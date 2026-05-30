import { DeleteResult } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IService } from '../../shared/interface';
import { GenericRepository } from '../../persistence/repository';
import { LogHistoryService } from './log-history.service';
import {
  BuscarDto,
  FiltroGenericoDto,
  LogHistoryDto,
  ResponseDto,
  SelectDto,
} from '../../shared/dto';
import { UserEntity } from '../../persistence/entity';
import { HISTORY_ACTION } from '../../persistence/entity/log-history.entity';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../app.keys';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ObjectLiteral } from 'typeorm';

// Interfaz auxiliar para entidades con id y toString
interface EntityWithId {
  id: number;
  toString(): string;
}

export abstract class GenericService<
  ENTITY extends ObjectLiteral,
> implements IService {
  private readonly isProductionEnv: boolean;

  protected constructor(
    protected configService: ConfigService,
    protected genericRepository: GenericRepository<ENTITY>,
    protected mapper: any,
    protected logHistoryService: LogHistoryService,
    protected traza?: boolean,
  ) {
    this.isProductionEnv =
      this.configService.get(AppConfig.NODE_ENV) === 'production';
  }

  async findAll(
    options: IPaginationOptions,
    sinPaginacion?: boolean,
  ): Promise<Pagination<any> | any[]> {
    const items: Pagination<ENTITY> | ENTITY[] =
      await this.genericRepository.findAll(options, sinPaginacion);
    const readDto: any[] = [];
    if (sinPaginacion === true) {
      for (const item of items as ENTITY[]) {
        readDto.push(await this.mapper.entityToDto(item));
      }
      return readDto;
    } else {
      for (const item of (items as Pagination<ENTITY>).items) {
        readDto.push(await this.mapper.entityToDto(item));
      }
      return new Pagination(
        readDto,
        (items as Pagination<ENTITY>).meta,
        (items as Pagination<ENTITY>).links,
      );
    }
  }

  async findById(id: any): Promise<any> {
    if (!id) {
      throw new BadRequestException('El id no puede ser vacio');
    }
    const obj: ENTITY = await this.genericRepository.findById(id);
    if (!obj) {
      throw new NotFoundException('El obj no se encuentra.');
    }
    return await this.mapper.entityToDto(obj);
  }

  async findByIds(ids: any[]): Promise<any[]> {
    const items: ENTITY[] = await this.genericRepository.findByIds(ids);
    const readDto: any[] = [];
    for (const item of items) {
      readDto.push(await this.mapper.entityToDto(item));
    }
    return readDto;
  }

  async createSelect(): Promise<SelectDto[]> {
    const items: ENTITY[] = await this.genericRepository.createSelect();
    const selectDto: SelectDto[] = [];
    for (const item of items) {
      const entity = item as unknown as EntityWithId;
      selectDto.push(new SelectDto(entity.id, entity.toString()));
    }
    return selectDto;
  }

  async createSelectFilter(
    filtroGenericoDto: FiltroGenericoDto,
  ): Promise<SelectDto[]> {
    const items: ENTITY[] = await this.genericRepository.createSelectFilter(
      filtroGenericoDto.clave,
      filtroGenericoDto.valor,
    );
    const selectDto: SelectDto[] = [];
    for (const item of items) {
      const entity = item as unknown as EntityWithId;
      selectDto.push(new SelectDto(entity.id, entity.toString()));
    }
    return selectDto;
  }

  async create(
    user: UserEntity,
    createDto: any,
    ip: string,
  ): Promise<ResponseDto> {
    const result = new ResponseDto();
    const newEntity = await this.mapper.dtoToEntity(createDto);
    const esquema: string = this.genericRepository.getSchema();
    const tabla: string = this.genericRepository.getTabla();
    try {
      const objEntity: any = await this.genericRepository.create(newEntity);
      if (this.traza && this.isProductionEnv) {
        const logHistoryDto: LogHistoryDto = new LogHistoryDto(
          null,
          user.userName,
          new Date(),
          tabla,
          esquema,
          HISTORY_ACTION.ADD,
          objEntity,
          null,
          objEntity.id,
          ip,
        );
        await this.logHistoryService.create(logHistoryDto);
      }
      result.id = objEntity.id;
      result.successStatus = true;
      result.message = 'success';
    } catch (error: unknown) {
      if (error instanceof Error) {
        result.message = error.message;
      } else {
        result.message = String(error);
      }
      result.successStatus = false;
      return result;
    }
    return result;
  }

  async createMultiple(
    user: UserEntity,
    createDto: any[],
    ip: string,
  ): Promise<ResponseDto[]> {
    const result: ResponseDto[] = [];
    for (const dtoElement of createDto) {
      result.push(await this.create(user, dtoElement, ip));
    }
    return result;
  }

  async import(
    user: UserEntity,
    createDto: any[],
    ip: string,
  ): Promise<ResponseDto[]> {
    const result: ResponseDto[] = [];
    for (const dtoElement of createDto) {
      const clave: string[] = [];
      const valor: any[] = [];
      for (const key in dtoElement) {
        clave.push(key);
        valor.push(dtoElement[key as keyof typeof dtoElement]);
      }
      const filtroGenericoDto: FiltroGenericoDto = { clave, valor };
      const filtro: any = await this.filter(
        {
          page: 1,
          limit: 10,
          route: '',
        },
        filtroGenericoDto,
      );
      if (filtro.meta.totalItems === 0) {
        result.push(await this.create(user, dtoElement, ip));
      } else {
        result.push({
          id: 0,
          successStatus: false,
          message: 'Ya existe en la base de datos.',
        });
      }
    }
    return result;
  }

  async update(
    user: UserEntity,
    id: number,
    updateDto: any,
    ip: string,
  ): Promise<ResponseDto> {
    const result = new ResponseDto();
    const foundObj: ENTITY = await this.genericRepository.findById(id);
    if (!foundObj) {
      throw new NotFoundException('No existe');
    }
    const updateEntity = await this.mapper.dtoToUpdateEntity(
      updateDto,
      foundObj,
    );
    const esquema = this.genericRepository.getSchema();
    const tabla: string = this.genericRepository.getTabla();
    try {
      await this.genericRepository.update(updateEntity);
      if (this.traza && this.isProductionEnv) {
        const logHistoryDto: LogHistoryDto = new LogHistoryDto(
          null,
          user.userName,
          new Date(),
          tabla,
          esquema,
          HISTORY_ACTION.MOD,
          updateEntity,
          foundObj,
          updateEntity.id,
          ip,
        );
        await this.logHistoryService.create(logHistoryDto);
      }
      result.successStatus = true;
      result.message = 'success';
    } catch (error: unknown) {
      if (error instanceof Error) {
        result.message = (error as any).detail ?? error.message;
      } else {
        result.message = String(error);
      }
      result.successStatus = false;
      return result;
    }
    return result;
  }

  async deleteMultiple(
    user: UserEntity,
    ids: number[],
    ip: string,
  ): Promise<ResponseDto> {
    const result = new ResponseDto();
    const esquema = this.genericRepository.getSchema();
    const tabla: string = this.genericRepository.getTabla();
    try {
      for (const id of ids) {
        const objEntity: ENTITY = await this.genericRepository.findById(id);
        const deleteEntity: any = await this.genericRepository.delete(id);
        if (this.traza && this.isProductionEnv) {
          const logHistoryDto: LogHistoryDto = new LogHistoryDto(
            null,
            user.userName,
            new Date(),
            tabla,
            esquema,
            HISTORY_ACTION.DEL,
            deleteEntity,
            objEntity,
            objEntity.id,
            ip,
          );
          await this.logHistoryService.create(logHistoryDto);
        }
      }
      result.successStatus = true;
      result.message = 'success';
    } catch (error: unknown) {
      if (error instanceof Error) {
        result.message = (error as any).detail ?? error.message;
      } else {
        result.message = String(error);
      }
      result.successStatus = false;
      return result;
    }
    return result;
  }

  async removeMultiple(
    user: UserEntity,
    ids: number[],
    ip: string,
  ): Promise<DeleteResult> {
    const esquema = this.genericRepository.getSchema();
    const tabla: string = this.genericRepository.getTabla();
    for (const id of ids) {
      const objEntity: ENTITY | null = await this.genericRepository.findOne(id);
      if (!objEntity) {
        throw new NotFoundException('No existe');
      }
      if (this.traza && this.isProductionEnv) {
        const logHistoryDto: LogHistoryDto = new LogHistoryDto(
          null,
          user.userName,
          new Date(),
          tabla,
          esquema,
          HISTORY_ACTION.REM,
          null,
          objEntity,
          objEntity.id,
          ip,
        );
        await this.logHistoryService.create(logHistoryDto);
      }
    }
    return await this.genericRepository.remove(ids);
  }

  async count(): Promise<number> {
    return await this.genericRepository.count();
  }

  async filter(
    options: IPaginationOptions,
    filtroGenericoDto: FiltroGenericoDto,
  ): Promise<Pagination<any>> {
    const items: Pagination<ENTITY> = await this.genericRepository.filter(
      options,
      filtroGenericoDto.clave,
      filtroGenericoDto.valor,
    );
    const readDto: any[] = [];
    for (const item of items.items) {
      readDto.push(await this.mapper.entityToDto(item));
    }
    return new Pagination(readDto, items.meta, items.links);
  }

  async search(
    options: IPaginationOptions,
    buscarDto: BuscarDto,
  ): Promise<Pagination<any>> {
    const items: Pagination<ENTITY> = await this.genericRepository.search(
      options,
      buscarDto.search,
    );
    const readDto: any[] = [];
    for (const item of items.items) {
      readDto.push(await this.mapper.entityToDto(item));
    }
    return new Pagination(readDto, items.meta, items.links);
  }
}

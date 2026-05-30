import { Injectable, NotFoundException } from '@nestjs/common';
import { GenericNomencladorMapper } from '../mapper';
import { DeleteResult } from 'typeorm';
import { GenericNomencladorRepository } from '../../persistence/repository';
import { LogHistoryService } from './log-history.service';
import {
  BuscarDto,
  FiltroGenericoDto,
  LogHistoryDto,
  ReadNomencladorDto,
  ResponseDto,
  SelectDto,
} from '../../shared/dto';
import { UserEntity } from '../../persistence/entity';
import { HISTORY_ACTION } from '../../persistence/entity/log-history.entity';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../app.keys';

@Injectable()
export class GenericNomencladorService {
  private readonly isProductionEnv: boolean;
  constructor(
    protected configService: ConfigService,
    protected repository: GenericNomencladorRepository,
    protected mapper: GenericNomencladorMapper,
    protected logHistoryService: LogHistoryService,
  ) {
    this.isProductionEnv =
      this.configService.get(AppConfig.NODE_ENV) === 'production';
  }

  async findAll(
    name: string,
    options: IPaginationOptions,
  ): Promise<Pagination<ReadNomencladorDto>> {
    const items: Pagination<any> = await this.repository.findAll(name, options);
    const readNomencladorDto: ReadNomencladorDto[] = items.items.map(
      (item: any) => this.mapper.entityToDto(item),
    );
    return new Pagination(readNomencladorDto, items.meta, items.links);
  }

  async findById(name: string, id: number): Promise<ReadNomencladorDto> {
    const entity = await this.repository.findById(name, id);
    return this.mapper.entityToDto(entity);
  }

  async findByIds(name: string, ids: any[]): Promise<ReadNomencladorDto[]> {
    const items: any[] = await this.repository.findByIds(name, ids);
    return items.map((item: any) => this.mapper.entityToDto(item));
  }

  async create(
    name: string,
    user: UserEntity,
    createDto: any,
    ip: string,
  ): Promise<ResponseDto> {
    const result = new ResponseDto();
    const newEntity = await this.mapper.dtoToEntity(createDto);
    try {
      const objEntity: any = await this.repository.create(name, newEntity);
      if (this.isProductionEnv) {
        const esquema: string = this.repository.getSchema(name);
        const tabla: string = this.repository.getTabla(name);
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
      result.successStatus = true;
      result.message = 'success';
    } catch (error: unknown) {
      // TypeScript 6: manejar error de tipo unknown
      if (error instanceof Error) {
        result.message = (error as any).response ?? error.message;
      } else {
        result.message = String(error);
      }
      result.successStatus = false;
      return result;
    }
    return result;
  }

  async createMultiple(
    name: string,
    user: UserEntity,
    createDto: any[],
    ip: string,
  ): Promise<ResponseDto[]> {
    const result: ResponseDto[] = [];
    for (const dtoElement of createDto) {
      result.push(await this.create(name, user, dtoElement, ip));
    }
    return result;
  }

  async createSelect(name: string): Promise<SelectDto[]> {
    const items: any[] = await this.repository.createSelect(name);
    const selectDto: SelectDto[] = [];
    for (const item of items) {
      selectDto.push(new SelectDto(item.id, item.toString()));
    }
    return selectDto;
  }

  async importar(
    name: string,
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
        name,
        {
          page: 1,
          limit: 10,
          route: '',
        },
        filtroGenericoDto,
      );
      if (filtro.meta.totalItems === 0) {
        result.push(await this.create(name, user, dtoElement, ip));
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
    name: string,
    user: UserEntity,
    id: number,
    updateDto: any,
    ip: string,
  ): Promise<ResponseDto> {
    const result = new ResponseDto();
    const foundObj: any = await this.repository.findById(name, id);
    if (!foundObj) {
      throw new NotFoundException('No existe');
    }
    const updateEntity = await this.mapper.dtoToUpdateEntity(
      updateDto,
      foundObj,
    );
    try {
      await this.repository.update(name, updateEntity);
      if (this.isProductionEnv) {
        const esquema: string = this.repository.getSchema(name);
        const tabla: string = this.repository.getTabla(name);
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
      // TypeScript 6: manejar error de tipo unknown
      if (error instanceof Error) {
        result.message = (error as any).response ?? error.message;
      } else {
        result.message = String(error);
      }
      result.successStatus = false;
      return result;
    }
    return result;
  }

  async deleteMultiple(
    name: string,
    user: UserEntity,
    ids: number[],
    ip: string,
  ): Promise<ResponseDto> {
    const result = new ResponseDto();
    try {
      for (const id of ids) {
        const objEntity: any = await this.repository.findById(name, id);
        if (!objEntity) {
          throw new NotFoundException('No existe');
        }
        const deleteEntity: any = await this.repository.delete(name, id);
        if (this.isProductionEnv) {
          const esquema: string = this.repository.getSchema(name);
          const tabla: string = this.repository.getTabla(name);
          const logHistoryDto: LogHistoryDto = new LogHistoryDto(
            null,
            user.userName,
            new Date(),
            tabla,
            esquema,
            HISTORY_ACTION.DEL,
            deleteEntity,
            objEntity,
            objEntity.id.toHexString(),
            ip,
          );
          await this.logHistoryService.create(logHistoryDto);
        }
      }
      result.successStatus = true;
      result.message = 'success';
    } catch (error: unknown) {
      // TypeScript 6: manejar error de tipo unknown
      if (error instanceof Error) {
        result.message = (error as any).response ?? error.message;
      } else {
        result.message = String(error);
      }
      result.successStatus = false;
      return result;
    }
    return result;
  }

  async removeMultiple(
    name: string,
    user: UserEntity,
    ids: number[],
    ip: string,
  ): Promise<DeleteResult> {
    for (const id of ids) {
      const objEntity: any = await this.repository.findOne(name, id);
      if (!objEntity) {
        throw new NotFoundException('No existe');
      }
      if (this.isProductionEnv) {
        const esquema: string = this.repository.getSchema(name);
        const tabla: string = this.repository.getTabla(name);
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
    return await this.repository.remove(name, ids);
  }

  async count(name: string): Promise<number> {
    return await this.repository.count(name);
  }

  async filter(
    name: string,
    options: IPaginationOptions,
    filtroGenericoDto: FiltroGenericoDto,
  ): Promise<Pagination<ReadNomencladorDto>> {
    const items: Pagination<any> = await this.repository.filter(
      name,
      options,
      filtroGenericoDto.clave,
      filtroGenericoDto.valor,
    );
    const readNomencladorDto: ReadNomencladorDto[] = items.items.map(
      (item: any) => this.mapper.entityToDto(item),
    );
    return new Pagination(readNomencladorDto, items.meta, items.links);
  }

  async search(
    name: string,
    options: IPaginationOptions,
    buscarDto: BuscarDto,
  ): Promise<Pagination<ReadNomencladorDto>> {
    const items: Pagination<any> = await this.repository.search(
      name,
      options,
      buscarDto.search,
    );
    const readNomencladorDto: ReadNomencladorDto[] = items.items.map(
      (item: any) => this.mapper.entityToDto(item),
    );
    return new Pagination(readNomencladorDto, items.meta, items.links);
  }

  async createSelectDependiente(
    name: string,
    filtroGenericoDto: FiltroGenericoDto,
  ): Promise<SelectDto[]> {
    const selectDto: SelectDto[] = [];
    const items: any[] = await this.repository.findBy(
      name,
      filtroGenericoDto.clave,
      filtroGenericoDto.valor,
    );
    for (const item of items) {
      selectDto.push(new SelectDto(item.id, item.toString()));
    }
    return selectDto;
  }
}

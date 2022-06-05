import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IService } from '../../shared/interface';
import { GenericRepository } from '../../persistence/repository';
import { TrazaService } from './traza.service';
import {
  BuscarDto,
  FiltroGenericoDto,
  ResponseDto,
  SelectDto,
} from '../../shared/dto';
import { UserEntity } from '../../persistence/entity';
import { HISTORY_ACTION } from '../../persistence/entity/traza.entity';

export abstract class GenericService<ENTITY> implements IService {
  protected constructor(
    protected genericRepository: GenericRepository<ENTITY>,
    protected mapper: any,
    protected trazaService: TrazaService,
    protected traza?: boolean,
  ) {}

  async findAll(
    options: IPaginationOptions,
    sinPaginacion?: boolean,
  ): Promise<Pagination<any> | any[]> {
    const items: Pagination<ENTITY> | ENTITY[] =
      await this.genericRepository.findAll(options, sinPaginacion);
    const readDto: any[] = [];
    if (sinPaginacion) {
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
    const items: any[] = await this.genericRepository.createSelect();
    const selectDto: SelectDto[] = [];
    for (const item of items) {
      selectDto.push(new SelectDto(item.id, item.toString()));
    }
    return selectDto;
  }

  async create(user: UserEntity, createDto: any): Promise<ResponseDto> {
    const result = new ResponseDto();
    const newEntity = await this.mapper.dtoToEntity(createDto);
    try {
      const objEntity: any = await this.genericRepository.create(newEntity);
      if (this.traza) {
        await this.trazaService.create(user, objEntity, HISTORY_ACTION.ADD);
      }
      result.id = objEntity.id;
      result.successStatus = true;
      result.message = 'success';
    } catch (error) {
      result.message = error;
      result.successStatus = false;
      return result;
    }
    return result;
  }

  async createMultiple(
    user: UserEntity,
    createDto: any[],
  ): Promise<ResponseDto[]> {
    const result: ResponseDto[] = [];
    for (const dtoElement of createDto) {
      result.push(await this.create(user, dtoElement));
    }
    return result;
  }

  async import(user: UserEntity, createDto: any[]): Promise<ResponseDto[]> {
    const result: ResponseDto[] = [];
    for (const dtoElement of createDto) {
      const clave: string[] = [];
      const valor: any[] = [];
      for (const key in dtoElement) {
        clave.push(key);
        valor.push(createDto[key]);
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
      if (filtro.data.meta.totalItems === 0) {
        result.push(await this.create(user, dtoElement));
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
    try {
      await this.genericRepository.update(updateEntity);
      if (this.traza) {
        await this.trazaService.create(user, updateEntity, HISTORY_ACTION.MOD);
      }
      result.successStatus = true;
      result.message = 'success';
    } catch (error) {
      result.message = error.detail;
      result.successStatus = false;
      return result;
    }
    return result;
  }

  async deleteMultiple(user: UserEntity, ids: number[]): Promise<ResponseDto> {
    const result = new ResponseDto();
    try {
      for (const id of ids) {
        const objEntity: ENTITY = await this.genericRepository.findById(id);
        if (this.traza) {
          await this.trazaService.create(user, objEntity, HISTORY_ACTION.DEL);
        }
        await this.genericRepository.delete(id);
      }
      result.successStatus = true;
      result.message = 'success';
    } catch (error) {
      result.message = error.detail;
      result.successStatus = false;
      return result;
    }
    return result;
  }

  async removeMultiple(user: UserEntity, ids: number[]): Promise<DeleteResult> {
    for (const id of ids) {
      const objEntity: ENTITY = await this.genericRepository.findOne(id);
      if (!objEntity) {
        throw new NotFoundException('No existe');
      }
      if (this.traza) {
        await this.trazaService.create(user, objEntity, HISTORY_ACTION.DEL);
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
  ): Promise<Pagination<ENTITY>> {
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
  ): Promise<Pagination<ENTITY>> {
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

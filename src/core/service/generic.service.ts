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
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../app.keys';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { Column, SortBy } from 'nestjs-paginate/lib/helper';

export abstract class GenericService<ENTITY> implements IService {
  private isProductionEnv;
  protected constructor(
    protected configService: ConfigService,
    protected genericRepository: GenericRepository<ENTITY>,
    protected mapper: any,
    protected trazaService: TrazaService,
    protected traza?: boolean,
  ) {
    this.isProductionEnv =
      this.configService.get(AppConfig.NODE_ENV) === 'production';
  }

  async findAll(
    query: PaginateQuery,
    sinPaginacion?: boolean,
  ): Promise<Paginated<any> | any[]> {
    const items: Paginated<ENTITY> | ENTITY[] =
      await this.genericRepository.findAll(query, sinPaginacion);
    const readDto: any[] = [];
    if (sinPaginacion) {
      for (const item of items as ENTITY[]) {
        readDto.push(await this.mapper.entityToDto(item));
      }
      return readDto;
    } else {
      for (const item of (items as Paginated<ENTITY>).data) {
        readDto.push(await this.mapper.entityToDto(item));
      }
      return {
        data: readDto,
        meta: {
          itemsPerPage: (items as Paginated<ENTITY>).meta.itemsPerPage,
          totalItems: (items as Paginated<ENTITY>).meta.totalItems,
          currentPage: (items as Paginated<ENTITY>).meta.currentPage,
          totalPages: (items as Paginated<ENTITY>).meta.totalPages,
          sortBy: (items as Paginated<ENTITY>).meta.sortBy as SortBy<any>,
          searchBy: (items as Paginated<ENTITY>).meta.searchBy as Column<any>[],
          search: (items as Paginated<ENTITY>).meta.search,
          filter: (items as Paginated<ENTITY>).meta.filter,
        },
        links: (items as Paginated<ENTITY>).links,
      };
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
      if (this.traza && this.isProductionEnv) {
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
          path: '',
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
      if (this.traza && this.isProductionEnv) {
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
        if (this.traza && this.isProductionEnv) {
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
      if (this.traza && this.isProductionEnv) {
        await this.trazaService.create(user, objEntity, HISTORY_ACTION.REM);
      }
    }
    return await this.genericRepository.remove(ids);
  }

  async count(): Promise<number> {
    return await this.genericRepository.count();
  }

  async filter(
    query: PaginateQuery,
    filtroGenericoDto: FiltroGenericoDto,
  ): Promise<Paginated<any>> {
    const items: Paginated<ENTITY> = await this.genericRepository.filter(
      query,
      filtroGenericoDto.clave,
      filtroGenericoDto.valor,
    );
    const readDto: any[] = [];
    for (const item of items.data) {
      readDto.push(await this.mapper.entityToDto(item));
    }
    return {
      data: readDto,
      meta: {
        itemsPerPage: items.meta.itemsPerPage,
        totalItems: items.meta.totalItems,
        currentPage: items.meta.currentPage,
        totalPages: items.meta.totalPages,
        sortBy: items.meta.sortBy as SortBy<any>,
        searchBy: items.meta.searchBy as Column<any>[],
        search: items.meta.search,
        filter: items.meta.filter,
      },
      links: items.links,
    };
  }

  async search(
    query: PaginateQuery,
    buscarDto: BuscarDto,
  ): Promise<Paginated<any>> {
    const items: Paginated<ENTITY> = await this.genericRepository.search(
      query,
      buscarDto.search,
    );
    const readDto: any[] = [];
    for (const item of items.data) {
      readDto.push(await this.mapper.entityToDto(item));
    }
    return {
      data: readDto,
      meta: {
        itemsPerPage: items.meta.itemsPerPage,
        totalItems: items.meta.totalItems,
        currentPage: items.meta.currentPage,
        totalPages: items.meta.totalPages,
        sortBy: items.meta.sortBy as SortBy<any>,
        searchBy: items.meta.searchBy as Column<any>[],
        search: items.meta.search,
        filter: items.meta.filter,
      },
      links: items.links,
    };
  }
}

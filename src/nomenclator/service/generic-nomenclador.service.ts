import { Injectable, NotFoundException } from '@nestjs/common';
import { ReadNomencladorDto, SelectDto } from '../dto';
import { GenericNomencladorMapper } from '../mapper';
import { GenericNomencladorRepository } from '../repository';
import { TrazaService } from '../../security/service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { HISTORY_ACTION, UserEntity } from '../../security/entity';
import { BuscarDto, FiltroGenericoDto, ResponseDto } from '../../shared/dto';
import { DeleteResult } from 'typeorm';

@Injectable()
export class GenericNomencladorService {
  constructor(
    protected repository: GenericNomencladorRepository,
    protected mapper: GenericNomencladorMapper,
    protected trazaService: TrazaService,
  ) {}
  async findAllNomenclator(name: string): Promise<SelectDto[]> {
    const returned: SelectDto[] = [];
    const entitys = await this.repository.get(name);
    for (let index = 0; index < entitys.length; index++) {
      returned.push(await this.mapper.entityToSelectDto(entitys[index]));
    }
    return returned;
  }

  async findById(name: string, id: number): Promise<ReadNomencladorDto> {
    const entity = await this.repository.findById(name, id);
    return this.mapper.entityToDto(entity);
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

  async findByIds(name: string, ids: any[]): Promise<ReadNomencladorDto[]> {
    const items: any[] = await this.repository.findByIds(name, ids);
    return items.map((item: any) => this.mapper.entityToDto(item));
  }

  async create(
    name: string,
    user: UserEntity,
    createDto: any,
  ): Promise<ResponseDto> {
    const result = new ResponseDto();
    const newEntity = await this.mapper.dtoToEntity(createDto);
    try {
      const objEntity: any = await this.repository.create(name, newEntity);
      await this.trazaService.create(user, objEntity, HISTORY_ACTION.ADD);
      result.successStatus = true;
      result.message = 'success';
    } catch (error) {
      result.message = error.response;
      result.successStatus = false;
      return result;
    }
    return result;
  }

  async update(
    name: string,
    user: UserEntity,
    id: number,
    updateDto: any,
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
      await this.trazaService.create(user, updateEntity, HISTORY_ACTION.MOD);
      result.successStatus = true;
      result.message = 'success';
    } catch (error) {
      result.message = error.response;
      result.successStatus = false;
      return result;
    }
    return result;
  }

  async deleteMultiple(
    name: string,
    user: UserEntity,
    ids: number[],
  ): Promise<ResponseDto> {
    const result = new ResponseDto();
    try {
      for (const id of ids) {
        const objEntity: any = await this.repository.findById(name, id);
        if (!objEntity) {
          throw new NotFoundException('No existe');
        }
        await this.trazaService.create(user, objEntity, HISTORY_ACTION.DEL);
        await this.repository.delete(name, id);
      }
      result.successStatus = true;
      result.message = 'success';
    } catch (error) {
      result.message = error.response;
      result.successStatus = false;
      return result;
    }
    return result;
  }

  async removeMultiple(
    name: string,
    user: UserEntity,
    ids: number[],
  ): Promise<DeleteResult> {
    for (const id of ids) {
      const objEntity: any = await this.repository.findOne(name, id);
      if (!objEntity) {
        throw new NotFoundException('No existe');
      }
      await this.trazaService.create(user, objEntity, HISTORY_ACTION.DEL);
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
}

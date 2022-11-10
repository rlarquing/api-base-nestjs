import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindManyOptions,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { EndPointEntity } from '../entity';

@Injectable()
export class EndPointRepository {
  constructor(
    @InjectRepository(EndPointEntity)
    private endPointRepository: Repository<EndPointEntity>,
  ) {}

  async findAll(): Promise<EndPointEntity[]> {
    return await this.endPointRepository.find();
  }

  async findById(id: number): Promise<EndPointEntity> {
    const options = { id } as FindOptionsWhere<EndPointEntity>;
    return await this.endPointRepository.findOneBy(options);
  }

  async findByNombre(nombre: string): Promise<EndPointEntity> {
    const options = { nombre: nombre } as FindOptionsWhere<EndPointEntity>;
    return await this.endPointRepository.findOneBy(options);
  }

  async findByController(controller: string): Promise<EndPointEntity[]> {
    const options = {
      controller: controller,
    } as FindOptionsWhere<EndPointEntity>;
    return await this.endPointRepository.findBy(options);
  }

  async findByIds(ids: number[]): Promise<EndPointEntity[]> {
    const options = {
      where: { id: In(ids) },
    } as FindManyOptions;
    return await this.endPointRepository.find(options);
  }

  async create(endPointEntity: EndPointEntity): Promise<void> {
    await this.endPointRepository.save(endPointEntity);
  }

  async update(endPointEntity: EndPointEntity): Promise<void> {
    const endPoint: EndPointEntity = await this.findByNombre(
      endPointEntity.nombre,
    );
    if (endPoint) {
      endPointEntity.id = endPoint.id;
      await this.endPointRepository.save(endPointEntity);
    }
  }

  async remove(nombre: string): Promise<DeleteResult> {
    const endPoint: EndPointEntity = await this.findByNombre(nombre);
    return await this.endPointRepository.delete(endPoint.id);
  }
}

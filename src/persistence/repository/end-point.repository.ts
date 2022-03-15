import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
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
    return await this.endPointRepository.findOne(id);
  }

  async findByNombre(nombre: string): Promise<EndPointEntity> {
    return await this.endPointRepository.findOne({ nombre: nombre });
  }

  async findByIds(ids: number[]): Promise<EndPointEntity[]> {
    return await this.endPointRepository.findByIds(ids);
  }

  async create(endPointEntity: EndPointEntity): Promise<void> {
    await this.endPointRepository.save(endPointEntity);
  }

  async update(endPointEntity: EndPointEntity): Promise<void> {
    const endPoint: EndPointEntity = await this.findByNombre(
      endPointEntity.nombre,
    );
    if (endPoint !== null) {
      endPointEntity.id = endPoint.id;
      await this.endPointRepository.save(endPointEntity);
    }
  }

  async remove(nombre: string): Promise<DeleteResult> {
    const endPoint: EndPointEntity = await this.findByNombre(nombre);
    return await this.endPointRepository.delete(endPoint.id);
  }
}

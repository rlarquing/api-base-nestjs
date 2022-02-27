import { Injectable } from '@nestjs/common';
import { GenericRepository } from '../../shared/repository';
import { IRepository } from '../../shared/interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolEntity } from '../entity';

@Injectable()
export class RolRepository
  extends GenericRepository<RolEntity>
  implements IRepository<RolEntity>
{
  constructor(
    @InjectRepository(RolEntity)
    private rolRepository: Repository<RolEntity>,
  ) {
    super(rolRepository, ['users', 'permisos', 'dimension']);
  }
}

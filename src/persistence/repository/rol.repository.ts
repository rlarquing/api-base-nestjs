import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolEntity } from '../entity';
import { IRepository } from '../../shared/interface';
import { GenericRepository } from './generic.repository';

@Injectable()
export class RolRepository
  extends GenericRepository<RolEntity>
  implements IRepository<RolEntity>
{
  constructor(
    @InjectRepository(RolEntity)
    private rolRepository: Repository<RolEntity>,
  ) {
    super(rolRepository, ['users', 'funcions', 'dimension']);
  }
}

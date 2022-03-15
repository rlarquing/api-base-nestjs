import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FuncionEntity } from '../entity';
import { IRepository } from '../../shared/interface';
import { GenericRepository } from './generic.repository';

@Injectable()
export class FuncionRepository
  extends GenericRepository<FuncionEntity>
  implements IRepository<FuncionEntity>
{
  constructor(
    @InjectRepository(FuncionEntity)
    private funcionRepository: Repository<FuncionEntity>,
  ) {
    super(funcionRepository, ['endPoints', 'menu']);
  }
}

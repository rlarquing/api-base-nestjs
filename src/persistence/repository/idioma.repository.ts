import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { IdiomaEntity } from '../entity';
import { IRepository } from '../../shared/interface';
import { GenericRepository } from './generic.repository';

@Injectable()
export class IdiomaRepository
  extends GenericRepository<IdiomaEntity>
  implements IRepository<IdiomaEntity>
{
  constructor(
    @InjectRepository(IdiomaEntity)
    private idiomaRepository: Repository<IdiomaEntity>,
  ) {
    super(idiomaRepository);
  }

  async desmarcarDefectoExcepto(id: number): Promise<void> {
    await this.idiomaRepository.update(
      { id: Not(id), defecto: true },
      { defecto: false },
    );
  }
}

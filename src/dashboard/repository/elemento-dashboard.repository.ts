import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRepository } from '../../shared/interface';
import {GenericRepository} from "../../persistence/repository";
import {ElementoDashboardEntity} from "../entity/elemento-dashboard.entity";

@Injectable()
export class ElementoDashboardRepository
  extends GenericRepository<ElementoDashboardEntity>
  implements IRepository<ElementoDashboardEntity>
{
  constructor(
    @InjectRepository(ElementoDashboardEntity)
    private elementoDashboardRepository: Repository<ElementoDashboardEntity>,
  ) {
    super(elementoDashboardRepository);
  }
}

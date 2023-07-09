import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {FindOneOptions, Repository} from 'typeorm';
import {FuncionEntity, MenuEntity} from '../entity';
import {IRepository} from '../../shared/interface';
import {GenericRepository} from './generic.repository';

@Injectable()
export class FuncionRepository
    extends GenericRepository<FuncionEntity>
    implements IRepository<FuncionEntity> {
    constructor(
        @InjectRepository(FuncionEntity)
        private funcionRepository: Repository<FuncionEntity>,
    ) {
        super(funcionRepository, ['endPoints', 'menu']);
    }

    async findByMenu(menu: MenuEntity): Promise<FuncionEntity> {
        return await this.funcionRepository.createQueryBuilder('f').
        leftJoinAndSelect('f.menu','menu').
        leftJoinAndSelect('f.endPoints','endPoints').
        where(`f.activo = true AND f.menu_id=:menu_id`,{menu_id: menu.id}).getOne();
    }
}

import {Injectable} from "@nestjs/common";
import {GenericRepository} from "../../shared/repository";
import {IRepository} from "../../shared/interface";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {GrupoEntity} from "../entity";

@Injectable()
export class GrupoRepository extends GenericRepository<GrupoEntity> implements IRepository<GrupoEntity>{
    constructor( @InjectRepository(GrupoEntity)
                 private grupoRepository: Repository<GrupoEntity>){
        super(grupoRepository,['roles', 'permisos']);
    }
}

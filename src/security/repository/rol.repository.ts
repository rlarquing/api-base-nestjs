import {Injectable} from "@nestjs/common";
import {GenericRepository} from "../../shared/repository/generic.repository";
import {IRepository} from "../../shared/interface";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {RolEntity} from "../entity";

@Injectable()
export class RolRepository extends GenericRepository<RolEntity> implements IRepository<RolEntity>{
    constructor( @InjectRepository(RolEntity)
                 private roleRepository: Repository<RolEntity>){
        super(roleRepository);
    }
}

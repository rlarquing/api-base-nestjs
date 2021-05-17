import {Injectable, NotFoundException} from "@nestjs/common";
import {GenericRepository} from "../../shared/repository/generic.repository";
import {IRepository} from "../../shared/interface";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {RoleEntity} from "../entity";

@Injectable()
export class RoleRepository extends GenericRepository<RoleEntity> implements IRepository<RoleEntity>{
    constructor( @InjectRepository(RoleEntity)
                 private roleRepository: Repository<RoleEntity>){
        super(roleRepository);
    }
}

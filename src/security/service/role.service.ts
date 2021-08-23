import { Injectable} from '@nestjs/common';
import { RoleEntity} from '../entity';
import {RoleRepository} from "../repository";
import {RoleMapper} from "../mapper";
import {TrazaService} from "./traza.service";
import {GenericService} from "../../shared/service/generic.service";
import {IService} from "../../shared/interface";

@Injectable()
export class RoleService extends GenericService<RoleEntity> implements IService<RoleEntity>{
   constructor(
       protected roleRepository: RoleRepository,
       protected roleMapper: RoleMapper,
       protected trazaService: TrazaService,
   ){
       super(roleRepository,roleMapper,trazaService,true);
   }
}

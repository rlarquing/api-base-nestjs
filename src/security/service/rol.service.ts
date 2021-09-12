import { Injectable} from '@nestjs/common';
import { RolEntity} from '../entity';
import {RolRepository} from "../repository";
import {RolMapper} from "../mapper";
import {TrazaService} from "./traza.service";
import {GenericService} from "../../shared/service/generic.service";
import {IService} from "../../shared/interface";

@Injectable()
export class RolService extends GenericService<RolEntity> implements IService<RolEntity>{
   constructor(
       protected rolRepository: RolRepository,
       protected rolMapper: RolMapper,
       protected trazaService: TrazaService,
   ){
       super(rolRepository,rolMapper,trazaService,true);
   }
}

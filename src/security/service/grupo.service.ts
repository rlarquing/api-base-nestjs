import { Injectable} from '@nestjs/common';
import { GrupoEntity} from '../entity';
import {GrupoRepository} from "../repository";
import {GrupoMapper} from "../mapper";
import {TrazaService} from "./traza.service";
import {GenericService} from "../../shared/service";

@Injectable()
export class GrupoService extends GenericService<GrupoEntity>{
   constructor(
       protected grupoRepository: GrupoRepository,
       protected grupoMapper: GrupoMapper,
       protected trazaService: TrazaService,
   ){
       super(grupoRepository,grupoMapper,trazaService,true);
   }
}

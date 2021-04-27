import {Injectable} from '@nestjs/common';
import {ReadMunicipioDto} from './../dto'
import {MunicipioEntity} from "../entity/municipio.entity";

@Injectable()
export class MunicipioMapper {

    entityToDto(municipioEntity: MunicipioEntity): ReadMunicipioDto {
        return new ReadMunicipioDto(
            municipioEntity.id,
            municipioEntity.nombre
        );
    }
}

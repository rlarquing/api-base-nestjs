import {Injectable} from '@nestjs/common';
import {ReadMunicipioDto} from '../dto'
import {MunicipioEntity} from "../entity";

@Injectable()
export class MunicipioMapper {

    entityToDto(municipioEntity: MunicipioEntity): ReadMunicipioDto {
        const dtoToString: string = municipioEntity.toString();
        return new ReadMunicipioDto(
            municipioEntity.id,
            municipioEntity.nombre,
            dtoToString
        );
    }
}

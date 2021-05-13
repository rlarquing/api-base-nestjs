import {Injectable} from '@nestjs/common';
import {ReadProvinciaDto} from '../dto'
import {ProvinciaEntity} from "../entity";

@Injectable()
export class ProvinciaMapper {

    entityToDto(provinciaEntity: ProvinciaEntity): ReadProvinciaDto {
        return new ReadProvinciaDto(
            provinciaEntity.id,
            provinciaEntity.nombre
        );
    }
}

import {Injectable} from '@nestjs/common';
import {ReadProvinciaDto} from '../dto'
import {ProvinciaEntity} from "../entity";

@Injectable()
export class ProvinciaMapper {

    entityToDto(provinciaEntity: ProvinciaEntity): ReadProvinciaDto {
        const dtoToString: string = provinciaEntity.toString();
        return new ReadProvinciaDto(
            provinciaEntity.id,
            provinciaEntity.nombre,
            dtoToString
        );
    }
}

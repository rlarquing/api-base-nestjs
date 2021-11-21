import {Injectable} from "@nestjs/common";
import {ModeloEntity} from "../entity";
import {ReadModeloDto} from "../dto";

@Injectable()
export class ModeloMapper {

    entityToDto(modeloEntity: ModeloEntity): ReadModeloDto {
        const dtoToString: string = modeloEntity.toString();
        return new ReadModeloDto(
            dtoToString,
            modeloEntity.id,
            modeloEntity.nombre,
            modeloEntity.schema
        );
    }
}

import { ApiProperty } from '@nestjs/swagger';
import {ReadPermisoDto} from "./read-permiso.dto";

export class ReadModeloDto {
    @ApiProperty({ description: 'Nombre del objeto', example: 'Objeto 1' })
    dtoToString: string;

    @ApiProperty({ description: 'id de la entidad.', example: 1 })
    id: number;

    @ApiProperty({ description: 'Nombre de la entidad.', example: 'Crear objeto' })
    nombre: string;

    @ApiProperty({ description: 'Esquema de la entidad', example: 'public' })
    schema: string;

    constructor(dtoToString: string, id: number, nombre: string, schema: string) {
        this.dtoToString = dtoToString;
        this.id = id;
        this.nombre = nombre;
        this.schema = schema;
    }
}

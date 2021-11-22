import { ApiProperty } from '@nestjs/swagger';
import {ReadModeloDto} from "./read-modelo.dto";

export class ReadPermisoDto {
    @ApiProperty({ description: 'Nombre del objeto', example: 'Objeto 1' })
    dtoToString: string;

    @ApiProperty({ description: 'id del permiso.', example: 1 })
    id: number;

    @ApiProperty({ description: 'Nombre del permiso.', example: 'Crear objeto' })
    nombre: string;

    @ApiProperty({ description: 'Servicio al que tiene permiso', example: 'newObjeto' })
    servicio: string;

    @ApiProperty({ description: 'Entidad al que tiene permiso', example: ReadModeloDto })
    modelo: ReadModeloDto;

    constructor(dtoToString: string, id: number, nombre: string, servicio: string, modelo: ReadModeloDto) {
        this.dtoToString = dtoToString;
        this.id = id;
        this.nombre = nombre;
        this.servicio = servicio;
        this.modelo = modelo;
    }
}

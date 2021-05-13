import {IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class ReadMunicipioDto{

    @IsNumber()
    @ApiProperty({description: 'id del municipio.', example: 1})
    id: number;

    @IsString()
    @ApiProperty({ description: 'Nombre del municipio.', example: 'Minas' })
    nombre : string;

    constructor(id: number, nombre: string) {
        this.id = id;
        this.nombre = nombre;
    }
}
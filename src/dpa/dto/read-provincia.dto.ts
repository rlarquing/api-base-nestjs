import {IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class ReadProvinciaDto{

    @IsNumber()
    @ApiProperty({description: 'id de la provincia.', example: 1})
    id: number;

    @IsString()
    @ApiProperty({ description: 'Nombre de la provincia.', example: 'Camaguey' })
    nombre : string;

    constructor(id: number, nombre: string) {
        this.id = id;
        this.nombre = nombre;
    }
}
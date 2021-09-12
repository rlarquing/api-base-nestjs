import{IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
export class ReadRolDto {

    @IsNumber()
    @ApiProperty({ description: 'id del rol.', example: 1 })
    id: number;

    @IsString()
    @ApiProperty({ description: 'Nombre del rol.', example: 'Administrador' })
    nombre : string;

    @IsString()
    @ApiProperty({ description: 'Descripción del rol.', example: 'Tiene permiso total del api' })
    description: string;

 constructor(id: number, nombre: string, description: string) {
  this.id = id;
  this.nombre = nombre;
  this.description = description;
 }
}
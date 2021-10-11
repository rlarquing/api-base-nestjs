import{IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
export class ReadRolDto {

    @IsString({message: 'El dtoToString debe de ser un string'})
    dtoToString: string;

    @IsNumber()
    @ApiProperty({ description: 'id del rol.', example: 1 })
    id: number;

    @IsString()
    @ApiProperty({ description: 'Nombre del rol.', example: 'Administrador' })
    nombre : string;

    @IsString()
    @ApiProperty({ description: 'Descripción del rol.', example: 'Tiene permiso total del api' })
    descripcion: string;

 constructor(id: number, nombre: string, descripcion: string, dtoToString: string) {
  this.id = id;
  this.nombre = nombre;
  this.descripcion = descripcion;
  this.dtoToString = dtoToString;
 }
}
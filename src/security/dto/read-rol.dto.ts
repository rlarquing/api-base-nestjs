import{IsNumber, IsString, MaxLength} from "class-validator";
import { Exclude, Expose } from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
@Exclude()
export class ReadRolDto {

    @Expose({name: 'identificador'})
    @IsNumber()
    @ApiProperty({ description: 'id del rol.', example: 1 })
    id: number;

    @Expose()
    @IsString()
    @ApiProperty({ description: 'Nombre del rol.', example: 'Administrador' })
    nombre : string;

    @Expose()
    @IsString()
    @ApiProperty({ description: 'Descripción del rol.', example: 'Tiene permiso total del api' })
    description: string;

 constructor(id: number, nombre: string, description: string) {
  this.id = id;
  this.nombre = nombre;
  this.description = description;
 }
}
import{IsNumber, IsString, MaxLength} from "class-validator";
import { Exclude, Expose } from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
@Exclude()
export class ReadRoleDto{

    @Expose({name: 'identificador'})
    @IsNumber()
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
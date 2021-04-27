import{IsNumber, IsString, MaxLength} from "class-validator";
import { Exclude, Expose } from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
@Exclude()
export class ReadRoleDto{

    @Expose({name: 'identificador'})
    @IsNumber()
    readonly id: number;

    @Expose()
    @IsString()
    @ApiProperty({ description: 'Nombre del rol', example: 'Administrador' })
    @MaxLength(50, {message: 'this name is not valid'})
    readonly nombre : string;

    @Expose()
    @IsString()
    @MaxLength(100, {message: 'this decription is not valid'})
    @ApiProperty({ description: 'Descripción del rol', example: 'Tiene permiso total del api' })
    readonly description: string;

 constructor(id: number, nombre: string, description: string) {
  this.id = id;
  this.nombre = nombre;
  this.description = description;
 }
}
import {IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator"
import {ApiProperty} from "@nestjs/swagger";
export class CreateRoleDto{

    @IsNotEmpty()
    @IsString()
    @MinLength(4, {
        message: 'El nombre debe de tener al menos 4 carácteres.'
    })
    @MaxLength(20, {
        message: 'El nombre debe tener como máximo 20 carácteres.'
    })
    @ApiProperty({description: 'Nombre del rol.', example: 'Administrador'})
    nombre : string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({description: 'Descripción del rol.', example: 'Tiene permiso total del api.'})
    descripcion: string;


    constructor(nombre: string, descripcion: string) {
        this.nombre = nombre;
        this.descripcion = descripcion;
    }
}
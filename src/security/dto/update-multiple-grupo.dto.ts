import {IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
export class UpdateMultipleGrupoDto {

    @IsNotEmpty()
    @ApiProperty({ description: 'id del rol.', example: 1 })
    id: number

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

    @IsArray()
    @IsOptional()
    @ApiProperty({ description: 'Roles que tiene este grupo.', example: [1, 2] })
    roles?: number[];

    @IsArray()
    @IsOptional()
    @ApiProperty({ description: 'Permisos del grupo.', example: [1, 2] })
    permisos?: number[];
}
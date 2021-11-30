import {IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
export class CreatePermisoDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(4, {
        message: 'El nombre debe de tener al menos 4 carácteres.'
    })
    @MaxLength(20, {
        message: 'El nombre debe tener como máximo 20 carácteres.'
    })
    @ApiProperty({description: 'Nombre del permiso.', example: 'Crear usuario.'})
    nombre: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4, {
        message: 'El servicio debe de tener al menos 4 carácteres.'
    })
    @MaxLength(20, {
        message: 'El servicio debe tener como máximo 20 carácteres.'
    })
    @ApiProperty({description: 'Servicio que tiene permiso.', example: 'create_user'})
    servicio : string;
}
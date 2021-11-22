import{IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {ReadUserDto} from "./read-user.dto";
import {ReadGrupoDto} from "./read-grupo.dto";
import {ReadPermisoDto} from "./read-permiso.dto";
export class ReadRolDto {

    @IsString({message: 'El dtoToString debe de ser un string'})
    dtoToString: string;

    @ApiProperty({ description: 'id del rol.', example: 1 })
    id: number;

    @ApiProperty({ description: 'Nombre del rol.', example: 'Administrador' })
    nombre : string;

    @ApiProperty({ description: 'Descripción del rol.', example: 'Tiene permiso total del api' })
    descripcion: string;

    @ApiProperty({ description: 'Permisos del rol.', type: [ReadPermisoDto] })
    permisos: ReadPermisoDto[];

    constructor(dtoToString: string, id: number, nombre: string, descripcion: string, permisos: ReadPermisoDto[]) {
        this.dtoToString = dtoToString;
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.permisos = permisos;
    }
}
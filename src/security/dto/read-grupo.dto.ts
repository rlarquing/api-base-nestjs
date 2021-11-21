import{IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {ReadPermisoDto} from "./read-permiso.dto";
import {ReadRolDto} from "./read-rol.dto";
export class ReadGrupoDto {

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

    @ApiProperty({ description: 'Roles que tiene este grupo.', type: [ReadRolDto] })
    roles: ReadRolDto[];

    @ApiProperty({ description: 'Permisos del grupo.', type: [ReadPermisoDto] })
    permisos: ReadPermisoDto[];

    constructor(dtoToString: string, id: number, nombre: string, descripcion: string, roles: ReadRolDto[], permisos: ReadPermisoDto[]) {
        this.dtoToString = dtoToString;
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.roles = roles;
        this.permisos = permisos;
    }
}
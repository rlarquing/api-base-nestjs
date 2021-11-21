import { ApiProperty } from '@nestjs/swagger';
import {ReadModeloDto} from "./read-modelo.dto";
import {ReadUserDto} from "./read-user.dto";
import {ReadRolDto} from "./read-rol.dto";
import {ReadGrupoDto} from "./read-grupo.dto";
export class ReadPermisoDto {
    @ApiProperty({ description: 'Nombre del objeto', example: 'Objeto 1' })
    dtoToString: string;

    @ApiProperty({ description: 'id del permiso.', example: 1 })
    id: number;

    @ApiProperty({ description: 'Nombre del permiso.', example: 'Crear objeto' })
    nombre: string;

    @ApiProperty({ description: 'Servicio al que tiene permiso', example: 'newObjeto' })
    servicio: string;

    @ApiProperty({ description: 'Entidad al que tiene permiso', example: ReadModeloDto })
    modelo: ReadModeloDto;

    @ApiProperty({ description: 'Usuarios que tiene este permiso.', type: [ReadUserDto] })
    users: ReadUserDto[];

    @ApiProperty({ description: 'Roles que tiene este permiso.', type: [ReadRolDto] })
    roles: ReadRolDto[];

    @ApiProperty({ description: 'Grupos que tiene este permiso.', type: [ReadGrupoDto] })
    grupos: ReadGrupoDto[];

    constructor(dtoToString: string, id: number, nombre: string, servicio: string, modelo: ReadModeloDto, users: ReadUserDto[], roles: ReadRolDto[], grupos: ReadGrupoDto[]) {
        this.dtoToString = dtoToString;
        this.id = id;
        this.nombre = nombre;
        this.servicio = servicio;
        this.modelo = modelo;
        this.users = users;
        this.roles = roles;
        this.grupos = grupos;
    }
}

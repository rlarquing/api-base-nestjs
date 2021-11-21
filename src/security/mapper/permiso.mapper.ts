import {Injectable} from "@nestjs/common";
import {ReadGrupoDto, ReadModeloDto, ReadPermisoDto, ReadRolDto, ReadUserDto} from "../dto";
import {GrupoEntity, PermisoEntity} from "../entity";
import {PermisoRepository} from "../repository";
import {GrupoMapper} from "./grupo.mapper";
import {RolMapper} from "./rol.mapper";
import {UserMapper} from "./user.mapper";
import {ModeloMapper} from "./modelo.mapper";

@Injectable()
export class PermisoMapper {
    constructor(
        protected permisoRepository: PermisoRepository,
        protected modeloMapper: ModeloMapper,
        protected userMapper: UserMapper,
        protected rolMapper: RolMapper,
        protected grupoMapper: GrupoMapper
    ) {
    }
    async entityToDto(permisoEntity: PermisoEntity): Promise<ReadPermisoDto> {
        const permiso: PermisoEntity = await this.permisoRepository.findById(permisoEntity.id);
        const dtoToString: string = permiso.toString();
        const readModeloDto: ReadModeloDto = this.modeloMapper.entityToDto(permiso.modelo);
        const readUserDto: ReadUserDto[] = [];
        for (const user of permiso.users) {
            readUserDto.push(await this.userMapper.entityToDto(user));
        }
        const readRolDto: ReadRolDto[] = [];
        for (const rol of permiso.roles) {
            readRolDto.push(await this.rolMapper.entityToDto(rol));
        }
        const readGrupoDto: ReadGrupoDto[] = [];
        for (const grupo of permiso.grupos) {
            readGrupoDto.push(await this.grupoMapper.entityToDto(grupo));
        }
        return new ReadPermisoDto(
            dtoToString,
            permisoEntity.id,
            permisoEntity.nombre,
            permisoEntity.servicio,
            readModeloDto,
            readUserDto,
            readRolDto,
            readGrupoDto
        );
    }
}

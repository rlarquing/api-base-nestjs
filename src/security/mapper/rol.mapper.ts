import {Injectable} from '@nestjs/common';
import {CreateRolDto, ReadPermisoDto, ReadRolDto, UpdateRolDto} from '../dto';
import {GrupoEntity, PermisoEntity, RolEntity, UserEntity} from "../entity";
import {GrupoRepository, PermisoRepository, RolRepository, UserRepository} from "../repository";
import {PermisoMapper} from "./permiso.mapper";

@Injectable()
export class RolMapper {
    constructor(
        protected rolRepository: RolRepository,
        protected userRepository: UserRepository,
        protected permisoRepository: PermisoRepository,
        protected grupoRepository: GrupoRepository,
        protected permisoMapper: PermisoMapper
    ) {
    }
    async dtoToEntity(createRolDto: CreateRolDto): Promise<RolEntity> {
        const users: UserEntity[] = await this.userRepository.findByIds(createRolDto.users);
        const permisos: PermisoEntity[] = await this.permisoRepository.findByIds(createRolDto.permisos);
        const grupos: GrupoEntity[] = await this.grupoRepository.findByIds(createRolDto.grupos);
        return new RolEntity(
            createRolDto.nombre,
            createRolDto.descripcion,
            users,
            permisos,
            grupos
        );
    }
    async dtoToUpdateEntity(updateRolDto: UpdateRolDto, updateRolEntity: RolEntity): Promise<RolEntity> {
        const users: UserEntity[] = await this.userRepository.findByIds(updateRolDto.users);
        const permisos: PermisoEntity[] = await this.permisoRepository.findByIds(updateRolDto.permisos);
        const grupos: GrupoEntity[] = await this.grupoRepository.findByIds(updateRolDto.grupos);
        updateRolEntity.nombre = updateRolDto.nombre;
        updateRolEntity.descripcion = updateRolDto.descripcion;
        if (users) {
            updateRolEntity.users = users;
        }
        if (permisos) {
            updateRolEntity.permisos = permisos;
        }
        if (grupos) {
            updateRolEntity.grupos = grupos;
        }
        return updateRolEntity;
    }
    async entityToDto(rolEntity: RolEntity): Promise<ReadRolDto> {
        const rol: RolEntity = await this.rolRepository.findById(rolEntity.id);
        const readPermisoDto: ReadPermisoDto[] = [];
        for (const permiso of rol.permisos) {
            readPermisoDto.push(await this.permisoMapper.entityToDto(permiso));
        }
        const dtoToString: string = rol.toString();
        return new ReadRolDto(
            dtoToString,
            rolEntity.id,
            rolEntity.nombre,
            rolEntity.descripcion,
            readPermisoDto

        );
    }
}

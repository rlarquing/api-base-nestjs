import {Injectable} from '@nestjs/common';
import {CreateRolDto, ReadGrupoDto, ReadPermisoDto, ReadRolDto, ReadUserDto, UpdateRolDto} from '../dto';
import {GrupoEntity, PermisoEntity, RolEntity, UserEntity} from "../entity";
import {GrupoRepository, PermisoRepository, RolRepository, UserRepository} from "../repository";
import {UserMapper} from "./user.mapper";
import {GrupoMapper} from "./grupo.mapper";
import {PermisoMapper} from "./permiso.mapper";

@Injectable()
export class RolMapper {
    constructor(
        protected rolRepository: RolRepository,
        protected userRepository: UserRepository,
        protected permisoRepository: PermisoRepository,
        protected grupoRepository: GrupoRepository,
        protected userMapper: UserMapper,
        protected rolMapper: RolMapper,
        protected permisoMapper: PermisoMapper,
        protected grupoMapper: GrupoMapper
    ) {
    }
    async dtoToEntity(createRolDto: CreateRolDto): Promise<RolEntity> {
        const users: UserEntity[] = await this.userRepository.findByIds(createRolDto.users);
        const permisos: PermisoEntity[] = await this.permisoRepository.findByIds(createRolDto.users);
        const grupos: GrupoEntity[] = await this.grupoRepository.findByIds(createRolDto.users);
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
        const permisos: PermisoEntity[] = await this.permisoRepository.findByIds(updateRolDto.users);
        const grupos: GrupoEntity[] = await this.grupoRepository.findByIds(updateRolDto.users);
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
        const readUserDto: ReadUserDto[] = [];
        for (const user of rol.users) {
            readUserDto.push(await this.userMapper.entityToDto(user));
        }
        const readPermisoDto: ReadPermisoDto[] = [];
        for (const permiso of rol.permisos) {
            readPermisoDto.push(await this.permisoMapper.entityToDto(permiso));
        }
        const readGrupoDto: ReadGrupoDto[] = [];
        for (const grupo of rol.grupos) {
            readGrupoDto.push(await this.grupoMapper.entityToDto(grupo));
        }
        const dtoToString: string = rol.toString();
        return new ReadRolDto(
            dtoToString,
            rolEntity.id,
            rolEntity.nombre,
            rolEntity.descripcion,
            readUserDto,
            readPermisoDto,
            readGrupoDto

        );
    }
}

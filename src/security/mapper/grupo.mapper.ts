import {Injectable} from '@nestjs/common';
import {CreateGrupoDto, ReadGrupoDto, ReadPermisoDto, ReadRolDto, UpdateGrupoDto} from '../dto';
import {GrupoEntity, PermisoEntity, RolEntity} from "../entity";
import {GrupoRepository, PermisoRepository, RolRepository} from "../repository";
import {RolMapper} from "./rol.mapper";
import {PermisoMapper} from "./permiso.mapper";

@Injectable()
export class GrupoMapper {
    constructor(
        protected grupoRepository: GrupoRepository,
        protected rolRepository: RolRepository,
        protected permisoRepository: PermisoRepository,
        protected rolMapper: RolMapper,
        protected permisoMapper: PermisoMapper
    ) {
    }
    async dtoToEntity(createGrupoDto: CreateGrupoDto): Promise<GrupoEntity> {
        const roles: RolEntity[] = await this.rolRepository.findByIds(createGrupoDto.roles);
        const permisos: PermisoEntity[] = await this.permisoRepository.findByIds(createGrupoDto.permisos);
        return new GrupoEntity(
            createGrupoDto.nombre,
            createGrupoDto.descripcion,
            roles,
            permisos
        );
    }

    async dtoToUpdateEntity(updateGrupoDto: UpdateGrupoDto, updateGrupoEntity: GrupoEntity): Promise<GrupoEntity> {
        const roles: RolEntity[] = await this.rolRepository.findByIds(updateGrupoDto.roles);
        const permisos: PermisoEntity[] = await this.permisoRepository.findByIds(updateGrupoDto.permisos);

        updateGrupoEntity.nombre = updateGrupoDto.nombre;
        updateGrupoEntity.descripcion = updateGrupoDto.descripcion;

        if (roles) {
            updateGrupoEntity.roles = roles;
        }
        if (permisos) {
            updateGrupoEntity.permisos = permisos;
        }
        return updateGrupoEntity;
    }

    async entityToDto(grupoEntity: GrupoEntity): Promise<ReadGrupoDto> {
        const grupo: GrupoEntity = await this.grupoRepository.findById(grupoEntity.id);
        const readRolDto: ReadRolDto[] = [];
        for (const rol of grupo.roles) {
            readRolDto.push(await this.rolMapper.entityToDto(rol));
        }
        const readPermisoDto: ReadPermisoDto[] = [];
        for (const permiso of grupo.permisos) {
            readPermisoDto.push(await this.permisoMapper.entityToDto(permiso));
        }
        const dtoToString: string = grupo.toString();
        return new ReadGrupoDto(
            dtoToString,
            grupoEntity.id,
            grupoEntity.nombre,
            grupoEntity.descripcion,
            readRolDto,
            readPermisoDto

        );
    }
}

import {Injectable} from '@nestjs/common';
import {CreateGrupoDto, ReadGrupoDto, ReadPermisoDto, ReadRolDto, UpdateGrupoDto} from '../dto';
import {GrupoEntity, PermisoEntity, RolEntity} from "../entity";
import {GrupoRepository, PermisoRepository, RolRepository} from "../repository";
import {RolMapper} from "./rol.mapper";
import {PermisoMapper} from "./permiso.mapper";
import {eliminarDuplicado} from "../../shared/lib/util";

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
        let permisos: PermisoEntity[] = await this.permisoRepository.findByIds(createGrupoDto.permisos);
        roles.forEach((rol: RolEntity) => {
                permisos.concat(rol.permisos);
            }
        );
        permisos = eliminarDuplicado(permisos);
        return new GrupoEntity(
            createGrupoDto.nombre,
            createGrupoDto.descripcion,
            roles,
            permisos
        );
    }
    async dtoToUpdateEntity(updateGrupoDto: UpdateGrupoDto, updateGrupoEntity: GrupoEntity): Promise<GrupoEntity> {
        const roles: RolEntity[] = await this.rolRepository.findByIds(updateGrupoDto.roles);
        let permisos: PermisoEntity[] = await this.permisoRepository.findByIds(updateGrupoDto.permisos);
        updateGrupoEntity.nombre = updateGrupoDto.nombre;
        updateGrupoEntity.descripcion = updateGrupoDto.descripcion;
        if (roles) {
            updateGrupoEntity.roles = roles;
        }
        if (permisos) {
            roles.forEach((rol: RolEntity) => {
                    permisos.concat(rol.permisos);
                }
            );
            permisos = eliminarDuplicado(permisos);
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

import { Injectable} from '@nestjs/common';
import { RoleEntity} from '../entity';
import {RoleRepository} from "../repository";
import {RoleMapper} from "../mapper";
import {TrazaService} from "./traza.service";
import {GenericService} from "../../shared/service/generic.service";
import {IService} from "../../shared/interface";

@Injectable()
export class RoleService extends GenericService<RoleEntity> implements IService<RoleEntity>{
   constructor(
       protected roleRepository: RoleRepository,
       protected roleMapper: RoleMapper,
       protected trazaService: TrazaService,
   ){
       super(roleRepository,roleMapper,trazaService,true);
   }

    // constructor(
    //     private roleRepository: RoleRepository,
    //     private roleMapper: RoleMapper,
    //     private trazaService: TrazaService,
    // ) {
    // }
    //
    // async getAll(options: IPaginationOptions): Promise<Pagination<ReadRoleDto>> {
    //     const roles: Pagination<RoleEntity> = await this.roleRepository.getAll(options);
    //     const readRoleDto: ReadRoleDto[] = roles.items.map((rol: RoleEntity) => this.roleMapper.entityToDto(rol));
    //     return new Pagination(readRoleDto, roles.meta, roles.links);
    // }
    //
    // async get(id: number): Promise<ReadRoleDto> {
    //     if (!id) {
    //         throw new BadRequestException("El id no puede ser vacio");
    //     }
    //     const rol: RoleEntity = await this.roleRepository.get(id);
    //     if (!rol) {
    //         throw new NotFoundException('El rol no se encuentra.');
    //     }
    //     return this.roleMapper.entityToDto(rol);
    // }
    //
    // async create(user: UserEntity, createRoleDto: CreateRoleDto): Promise<ReadRoleDto> {
    //     const roleEntity: RoleEntity = await this.roleRepository.create(createRoleDto);
    //     await this.trazaService.create(user, roleEntity, HISTORY_ACTION.ADD);
    //     return this.roleMapper.entityToDto(roleEntity);
    // }
    //
    // async update(user: UserEntity, id: number, rol: UpdateRoleDto): Promise<ReadRoleDto> {
    //     const roleEntity: RoleEntity = await this.roleRepository.update(id, rol);
    //     await this.trazaService.create(user, roleEntity, HISTORY_ACTION.MOD);
    //     return this.roleMapper.entityToDto(roleEntity);
    //
    // }
    //
    // async delete(user: UserEntity, id: number): Promise<void> {
    //     const roleEntity: RoleEntity = await this.roleRepository.get(id);
    //     await this.trazaService.create(user, roleEntity, HISTORY_ACTION.DEL);
    //     return await this.roleRepository.delete(id);
    // }
}

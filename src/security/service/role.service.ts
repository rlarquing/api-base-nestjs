import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import {CreateRoleDto, ReadRoleDto, UpdateRoleDto} from './../dto';
import {RoleEntity} from './../entity/role.entity';
import { RoleRepository } from "./../repository/role.repository";
import {RoleMapper} from "../mapper/role.mapper";

@Injectable()
export class RoleService {
    constructor(
        private roleRepository: RoleRepository,
        private roleMapper: RoleMapper,
    ){}
    async getAll(): Promise<ReadRoleDto[]>{
        const roles: RoleEntity[] = await this.roleRepository.getAll();
         return roles.map((rol) => this.roleMapper.entityToDto(rol));
    }

    async get(id: number): Promise<ReadRoleDto>{
        if(!id){
            throw new BadRequestException("El id no puede ser vacio");
        }
        const rol: RoleEntity = await this.roleRepository.get(id);
        if(!rol){
            throw new NotFoundException();
        }
        return this.roleMapper.entityToDto(rol);
    }

    async create(createRoleDto: CreateRoleDto): Promise<ReadRoleDto>{
      const savedRole: RoleEntity = await this.roleRepository.create(createRoleDto);
      return this.roleMapper.entityToDto(savedRole);
    }

    async update(id: number, rol: UpdateRoleDto): Promise<ReadRoleDto>{
      const updatedRole: RoleEntity = await this.roleRepository.update(id,rol);
      return this.roleMapper.entityToDto(updatedRole);

    }

    async delete(id: number): Promise<void>{
      return await this.roleRepository.delete(id);
    }

}

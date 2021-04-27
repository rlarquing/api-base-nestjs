import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {RoleEntity} from "../entity/role.entity";
import {RoleMapper} from "../mapper/role.mapper";
import {CreateRoleDto, UpdateRoleDto} from "../dto";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";

@Injectable()
export class RoleRepository {
    constructor(
        @InjectRepository(RoleEntity)
        private roleRepository: Repository<RoleEntity>,
        private roleMapper: RoleMapper,
    ) {
    }

    async getAll(options: IPaginationOptions): Promise<Pagination<RoleEntity>> {
        return await paginate<RoleEntity>(this.roleRepository, options, {where: {status: 'ACTIVE'}});

    }

    async get(id: number): Promise<RoleEntity> {
        const rol: RoleEntity = await this.roleRepository.findOne({
            where: {status: 'ACTIVE'}
        });
        return rol;
    }

    async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
        const newRole = this.roleMapper.dtoToEntity(createRoleDto);
        return await this.roleRepository.save(newRole);
    }

    async update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
        const foundRole: RoleEntity = await this.roleRepository.findOne(id);
        if (!foundRole) {
            throw new NotFoundException('No existe el rol');
        }
        const {nombre, descripcion} = updateRoleDto;
        foundRole.nombre = nombre;
        foundRole.descripcion = descripcion;
        const updatedRole: RoleEntity = await this.roleRepository.save(foundRole);
        return updatedRole;
    }

    async delete(id: number): Promise<void> {
        const role = await this.roleRepository.findOne(id, {where: {status: 'ACTIVE'}});
        if (!role) {
            throw new NotFoundException('No existe el rol');
        }
        role.status = 'INACTIVE';
        await this.roleRepository.save(role);
    }
}

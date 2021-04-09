import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post} from '@nestjs/common';
import {CreateRoleDto, ReadRoleDto, UpdateRoleDto} from './../dto';

import {RoleService} from './../service/role.service';

@Controller('roles')
export class RoleController {
    constructor(private roleService: RoleService) {
    }

    @Get()
    async getRoles(): Promise<ReadRoleDto[]> {
        return await this.roleService.getAll();
    }

    @Get(':id')
    getRole(@Param('id', ParseIntPipe) id: number): Promise<ReadRoleDto> {
        return this.roleService.get(id);
    }

    @Post()
    async create(@Body() createRoleDto: CreateRoleDto): Promise<ReadRoleDto> {
        return await this.roleService.create(createRoleDto);
    }

    @Patch(':id')
    async updateRole(@Param('id', ParseIntPipe) id: number, @Body() rol: UpdateRoleDto): Promise<ReadRoleDto> {
        return await this.roleService.update(id, rol);
    }

    @Delete(':id')
    async deleteRole(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.roleService.delete(id);

    }
}
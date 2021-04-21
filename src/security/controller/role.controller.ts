import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards} from '@nestjs/common';
import {CreateRoleDto, ReadRoleDto, UpdateRoleDto} from './../dto';

import {RoleService} from './../service/role.service';
import {Roles} from "../decorator/role.decorator";
import {RoleType} from "../enum/roletype.enum";
import {AuthGuard} from "@nestjs/passport";
import {RoleGuard} from "../guards/role.guard";
import {GetUser} from "../decorator/get-user.decorator";
import {UserEntity} from "../entity/user.entity";

@Controller('roles')
export class RoleController {
    constructor(private roleService: RoleService) {
    }

    @Roles(RoleType.ADMINISTRADOR)
    @UseGuards(AuthGuard(), RoleGuard)
    @Get()
    async getRoles(): Promise<ReadRoleDto[]> {
        return await this.roleService.getAll();
    }

    @Roles(RoleType.ADMINISTRADOR)
    @UseGuards(AuthGuard(), RoleGuard)
    @Get(':id')
    getRole(@Param('id', ParseIntPipe) id: number): Promise<ReadRoleDto> {
        return this.roleService.get(id);
    }

    @Roles(RoleType.ADMINISTRADOR)
    @UseGuards(AuthGuard(), RoleGuard)
    @Post()
    async create(@GetUser() user: UserEntity, @Body() createRoleDto: CreateRoleDto): Promise<ReadRoleDto> {
        return await this.roleService.create(user, createRoleDto);
    }

    @Roles(RoleType.ADMINISTRADOR)
    @UseGuards(AuthGuard(), RoleGuard)
    @Patch(':id')
    async updateRole(@GetUser() user: UserEntity, @Param('id', ParseIntPipe) id: number, @Body() rol: UpdateRoleDto): Promise<ReadRoleDto> {
        return await this.roleService.update(user, id, rol);
    }

    @Roles(RoleType.ADMINISTRADOR)
    @UseGuards(AuthGuard(), RoleGuard)
    @Delete(':id')
    async deleteRole(@GetUser() user: UserEntity, @Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.roleService.delete(user, id);

    }
}
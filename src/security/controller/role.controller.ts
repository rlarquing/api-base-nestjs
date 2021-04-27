import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {CreateRoleDto, ReadRoleDto, UpdateRoleDto} from './../dto';
import {RoleService} from './../service/role.service';
import {Roles} from "../decorator/role.decorator";
import {RoleType} from "../enum/roletype.enum";
import {AuthGuard} from "@nestjs/passport";
import {RoleGuard} from "../guards/role.guard";
import {GetUser} from "../decorator/get-user.decorator";
import {UserEntity} from "../entity/user.entity";
import {Pagination} from "nestjs-typeorm-paginate";
import {ConfigService} from "@atlasjs/config";
import {AppConfig} from "../../app.keys";

@Controller('roles')
@Roles(RoleType.ADMINISTRADOR)
@UseGuards(AuthGuard(), RoleGuard)
export class RoleController {
    constructor(
        private roleService: RoleService,
        private configService: ConfigService
    ) {
    }

    @Get()
    getAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<Pagination<ReadRoleDto>> {
        limit = limit > 100 ? 100 : limit;
        const url = this.configService.config[AppConfig.URL];
        const port= this.configService.config[AppConfig.PORT];
        return this.roleService.getAll({
            page,
            limit,
            route: url+':'+port+'/roles',
        });
    }

    @Get(':id')
    get(@Param('id', ParseIntPipe) id: number): Promise<ReadRoleDto> {
        return this.roleService.get(id);
    }

    @Post()
    async create(@GetUser() user: UserEntity, @Body() createRoleDto: CreateRoleDto): Promise<ReadRoleDto> {
        return await this.roleService.create(user, createRoleDto);
    }

    @Patch(':id')
    async update(@GetUser() user: UserEntity, @Param('id', ParseIntPipe) id: number, @Body() rol: UpdateRoleDto): Promise<ReadRoleDto> {
        return await this.roleService.update(user, id, rol);
    }

    @Delete(':id')
    async delete(@GetUser() user: UserEntity, @Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.roleService.delete(user, id);

    }
}
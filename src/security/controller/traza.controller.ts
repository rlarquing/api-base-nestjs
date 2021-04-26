import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {GetUser} from './../decorator/get-user.decorator';
import {Roles} from './../decorator/role.decorator';
import {RoleGuard} from './../guards/role.guard';
import {RoleType} from './../enum/roletype.enum';
import {UserEntity} from './../entity/user.entity';
import {TrazaService} from './../service/traza.service';
import {TrazaDto} from "../dto/traza.dto";
import {DeleteResult} from "typeorm";
import {TrazaEntity} from "../entity/traza.entity";
import {Pagination} from "nestjs-typeorm-paginate";

@Controller('trazas')
export class TrazaController {
    constructor(private trazaService: TrazaService) {
    }

    @Roles(RoleType.ADMINISTRADOR)
    @UseGuards(AuthGuard(), RoleGuard)
    @Get()
    getAll(): Promise<TrazaDto[]> {
        return this.trazaService.getAll();
    }

    @Roles(RoleType.ADMINISTRADOR)
    @UseGuards(AuthGuard(), RoleGuard)
    @Get('listado')
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<Pagination<TrazaEntity>> {
        limit = limit > 100 ? 100 : limit;
        return this.trazaService.paginate({
            page,
            limit,
            route: 'http://localhost:5000/trazas',
        });
    }

    @Roles(RoleType.ADMINISTRADOR)
    @UseGuards(AuthGuard(), RoleGuard)
    @Get(':id')
    get(@Param('id', ParseIntPipe) id: number): Promise<TrazaDto> {
        return this.trazaService.get(id);

    }

    @Roles(RoleType.ADMINISTRADOR)
    @UseGuards(AuthGuard(), RoleGuard)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        return await this.trazaService.delete(id);
    }

    @Roles(RoleType.ADMINISTRADOR)
    @UseGuards(AuthGuard(), RoleGuard)
    @Post('filtro/por')
    async getAllFiltrados(@GetUser() user: UserEntity, @Body() filtro: any): Promise<any> {
        return await this.trazaService.getFiltrados(user, filtro);
    }
}

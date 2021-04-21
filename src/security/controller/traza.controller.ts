import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {GetUser} from './../decorator/get-user.decorator';
import {Roles} from './../decorator/role.decorator';
import {RoleGuard} from './../guards/role.guard';
import {RoleType} from './../enum/roletype.enum';
import {UserEntity} from './../entity/user.entity';
import {TrazaService} from './../service/traza.service';
import {TrazaDto} from "../dto/traza.dto";
import {DeleteResult} from "typeorm";

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

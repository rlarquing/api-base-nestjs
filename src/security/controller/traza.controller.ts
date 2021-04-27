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
import {Pagination} from "nestjs-typeorm-paginate";
import {ConfigService} from "@atlasjs/config";
import {AppConfig} from "../../app.keys";

@Controller('trazas')
@Roles(RoleType.ADMINISTRADOR)
@UseGuards(AuthGuard(), RoleGuard)
export class TrazaController {
    constructor(
        private trazaService: TrazaService,
        private configService: ConfigService
    ) {
    }

    @Get()
    getAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<Pagination<TrazaDto>> {
        limit = limit > 100 ? 100 : limit;
        const url = this.configService.config[AppConfig.URL];
        const port= this.configService.config[AppConfig.PORT];
        return this.trazaService.getAll({
            page,
            limit,
            route: url+':'+port+'/trazas',
        });
    }

    @Get(':id')
    get(@Param('id', ParseIntPipe) id: number): Promise<TrazaDto> {
        return this.trazaService.get(id);

    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        return await this.trazaService.delete(id);
    }

    @Post('filtro/por')
    async getAllFiltrados(@GetUser() user: UserEntity, @Body() filtro: any): Promise<any> {
        return await this.trazaService.getFiltrados(user, filtro);
    }
}

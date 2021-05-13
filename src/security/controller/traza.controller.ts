import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {GetUser} from '../decorator';
import {Roles} from '../decorator';
import {RoleGuard} from '../guards/role.guard';
import {RoleType} from '../enum/roletype.enum';
import {UserEntity} from '../entity';
import {TrazaService} from '../service';
import {TrazaDto} from "../dto/traza.dto";
import {DeleteResult} from "typeorm";
import {Pagination} from "nestjs-typeorm-paginate";
import {ConfigService} from "@atlasjs/config";
import {AppConfig} from "../../app.keys";
import {ApiBearerAuth, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Trazas')
@Controller('trazas')
@Roles(RoleType.ADMINISTRADOR)
@UseGuards(AuthGuard(), RoleGuard)
@ApiBearerAuth()
export class TrazaController {
    constructor(
        private trazaService: TrazaService,
        private configService: ConfigService
    ) {
    }

    @Get()
    @ApiOperation({ summary: 'Obtener el listado de las trazas' })
    @ApiResponse({
        status: 200,
        description: 'Listado de las trazas',
        type: TrazaDto,
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Trazas no encontradas.',
    })
    async getAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<Pagination<TrazaDto>> {
        limit = limit > 100 ? 100 : limit;
        const url = this.configService.config[AppConfig.URL];
        const port= this.configService.config[AppConfig.PORT];
        return await this.trazaService.getAll({
            page,
            limit,
            route: url+':'+port+'/trazas',
        });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una traza' })
    @ApiResponse({
        status: 200,
        description: 'Muestra la información de una traza',
        type: TrazaDto,
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Traza no encontrada.',
    })
    async get(@Param('id', ParseIntPipe) id: number): Promise<TrazaDto> {
        return await this.trazaService.get(id);

    }
    @ApiOperation({ summary: 'Eliminar una traza' })
    @ApiResponse({
        status: 200,
        description: 'Elimina de una traza',
    })
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        return await this.trazaService.delete(id);
    }

    @Post('filtro/por')
    @ApiOperation({ summary: 'Filtrar por un usuario y los parametros establecidos' })
    @ApiResponse({
        status: 201,
        description: 'Filtra por un usuario y parametros que se le puedan pasar',
    })
    async getAllFiltrados(@GetUser() user: UserEntity, @Body() filtro: any): Promise<any> {
        return await this.trazaService.getFiltrados(user, filtro);
    }
}

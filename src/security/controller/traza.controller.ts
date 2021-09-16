import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {GetUser} from '../decorator';
import {Roles} from '../decorator';
import {RolGuard} from '../guard/rol.guard';
import {RolType} from '../enum/roltype.enum';
import {UserEntity} from '../entity';
import {TrazaService} from '../service';
import {TrazaDto} from "../dto/traza.dto";
import {DeleteResult} from "typeorm";
import {Pagination} from "nestjs-typeorm-paginate";
import {ConfigService} from "@atlasjs/config";
import {AppConfig} from "../../app.keys";
import {ApiBearerAuth, ApiBody, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {FiltroDto} from "../dto/filtro.dto";

@ApiTags('Trazas')
@Controller('traza')
@Roles(RolType.ADMINISTRADOR)
@UseGuards(AuthGuard('jwt'), RolGuard)
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
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<Pagination<TrazaDto>> {
        limit = limit > 100 ? 100 : limit;
        const url = this.configService.config[AppConfig.URL];
        const port= this.configService.config[AppConfig.PORT];
        return await this.trazaService.findAll({
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
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    async findById(@Param('id', ParseIntPipe) id: number): Promise<TrazaDto> {
        return await this.trazaService.findById(id);

    }
    @ApiOperation({ summary: 'Eliminar una traza' })
    @ApiResponse({
        status: 200,
        description: 'Elimina de una traza',
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
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
    @ApiBody({
        description: 'Estructura para crear el filtrado de la traza.',
        type: FiltroDto
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    async findByFiltrados(@GetUser() user: UserEntity, @Body() filtroDto: FiltroDto): Promise<any> {
        return await this.trazaService.findByFiltrados(user, filtroDto);
    }
}

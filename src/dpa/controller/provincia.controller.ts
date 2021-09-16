import {
    Controller,
    Get,
    Param,
    ParseIntPipe, Query,
    UseGuards,
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ProvinciaService} from '../service';
import {Roles} from "../../security/decorator";
import {RolType} from "../../security/enum/roltype.enum";
import {RolGuard} from "../../security/guard/rol.guard";
import {ReadProvinciaDto} from "../dto";
import {ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Pagination} from "nestjs-typeorm-paginate";
import {AppConfig} from "../../app.keys";
import {ConfigService} from "@atlasjs/config";
import {GeoJsonDto} from "../../shared/dto";

@ApiTags('Provincias')
@Controller('provincia')
@Roles(
    RolType.ADMINISTRADOR,
    RolType.USUARIO,
)
@UseGuards(AuthGuard(), RolGuard)
export class ProvinciaController {
    constructor(
        private provinciaService: ProvinciaService,
        private configService: ConfigService
    ) {
    }

    @Get()
    @ApiOperation({summary: 'Obtener el listado de las provincias'})
    @ApiResponse({
        status: 200,
        description: 'Listado de las provincias',
        type: ReadProvinciaDto,
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Provincias no encontradas.',
    })
    async getAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<Pagination<ReadProvinciaDto>> {
        limit = limit > 100 ? 100 : limit;
        const url = this.configService.config[AppConfig.URL];
        const port = this.configService.config[AppConfig.PORT];
        return await this.provinciaService.getAll({
            page,
            limit,
            route: url + ':' + port + '/provincias',
        });
    }

    @Get(':id')
    @ApiOperation({summary: 'Obtener una provincia'})
    @ApiResponse({
        status: 200,
        description: 'Muestra la información de una provincia',
        type: ReadProvinciaDto,
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'provincia no encontrada.',
    })
    async get(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ReadProvinciaDto> {
        return await this.provinciaService.get(id);
    }

    @Get('obtener/json')
    @ApiOperation({summary: 'Obtener el geojson de las provincias'})
    @ApiResponse({
        status: 200,
        description: 'Muestra el geojson de las provincias',
        type: GeoJsonDto,
    })
    async geoJson(): Promise<GeoJsonDto>{
        return await this.provinciaService.geoJson();
    }
}

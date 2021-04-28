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
import {RoleType} from "../../security/enum/roletype.enum";
import {RoleGuard} from "../../security/guards/role.guard";
import {ReadProvinciaDto} from "../dto";
import {ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ReadRoleDto} from "../../security/dto";
import {Pagination} from "nestjs-typeorm-paginate";
import {AppConfig} from "../../app.keys";
import {ConfigService} from "@atlasjs/config";
import {getManager} from "typeorm";
import {ProvinciaEntity} from "../entity";

@ApiTags('Provincias')
@Controller('provincias')
@Roles(
    RoleType.ADMINISTRADOR,
    RoleType.USUARIO,
)
@UseGuards(AuthGuard(), RoleGuard)
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
    get(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ReadProvinciaDto> {
        return this.provinciaService.get(id);
    }

    @Get('obtener/json')
    async obtenerJson(): Promise<any>{
        return await this.provinciaService.obtenerJson();
    }
}

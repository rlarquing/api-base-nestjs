import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {RoleType} from "../../security/enum/roletype.enum";
import {RoleGuard} from "../../security/guards/role.guard";
import {MunicipioService} from "../service";
import {ReadMunicipioDto} from "../dto";
import {Pagination} from "nestjs-typeorm-paginate";
import {ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ReadRoleDto} from "../../security/dto";
import {AppConfig} from "../../app.keys";
import {ConfigService} from "@atlasjs/config";
import {Roles} from "../../security/decorator";

@ApiTags('Municipios')
@Controller('municipios')
@Roles(
    RoleType.ADMINISTRADOR,
    RoleType.USUARIO,
)
@UseGuards(AuthGuard(), RoleGuard)
export class MunicipioController {
  constructor(
      private municipioService: MunicipioService,
      private configService: ConfigService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener el listado de los municipios' })
  @ApiResponse({
    status: 200,
    description: 'Listado de los municipios',
    type: ReadRoleDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Municipios no encontrados.',
  })
  async getAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
  ): Promise<Pagination<ReadMunicipioDto>> {
    limit = limit > 100 ? 100 : limit;
    const url = this.configService.config[AppConfig.URL];
    const port= this.configService.config[AppConfig.PORT];
    return await this.municipioService.getAll({
      page,
      limit,
      route: url+':'+port+'/municipios',
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un rol' })
  @ApiResponse({
    status: 200,
    description: 'Muestra la información de un rol',
    type: ReadRoleDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Not found. Rol no encontrado.',
  })
  get(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReadMunicipioDto> {
    return this.municipioService.get(id);
  }

  @Get('/provincia/:id')
  getByProvincia(@Param('id', ParseIntPipe) id: number,
  ): Promise<ReadMunicipioDto[]> {
    return this.municipioService.getByProvincia(id);
  }
}

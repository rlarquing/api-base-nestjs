import {
  Controller,
  UseGuards,
  Get,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PermisoService } from '../service';

import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SelectDto } from '../../nomenclator/dto';
import { PermissionGuard, RolGuard } from '../guard';
import { Servicio } from '../decorator';

@ApiTags('Permisos')
@Controller('permiso')
@UseGuards(AuthGuard('jwt'), RolGuard, PermissionGuard)
@ApiBearerAuth()
@UsePipes(ValidationPipe)
export class PermisoController {
  constructor(private permisoService: PermisoService) {}

  @Get('/crear/select')
  @ApiOperation({
    summary: 'Obtener los elementos del conjunto para crear un select',
  })
  @ApiResponse({
    status: 200,
    description:
      'Muestra la información de los elementos del conjunto para crear un select',
    type: [SelectDto],
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Elemento del conjunto no encontrado.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio(PermisoController.name, 'createSelect')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  async createSelect(): Promise<SelectDto[]> {
    return await this.permisoService.createSelect();
  }
}

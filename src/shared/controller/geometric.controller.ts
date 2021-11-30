import {Body, Param, ParseIntPipe, Post, UseGuards} from '@nestjs/common';
import {GeometricService} from '../service';
import {GeoJsonDto, TypeDto} from '../dto';
import {GenericController} from './generic.controller';
import {Servicio} from "../../security/decorator";
import {AuthGuard} from "@nestjs/passport";
import {PermissionGuard} from "../../security/guard";
import {ConfigService} from "@nestjs/config";

export abstract class GeometricController<ENTITY> extends GenericController<ENTITY> {
    protected constructor(
        protected service: GeometricService<ENTITY>,
        protected configService: ConfigService,
        protected ruta: string,
        protected controller: any
    ) {
        super(service, configService, ruta, controller);
        this.controller = controller.name;
    }
    @Post('obtener/json')
    @Servicio(GeometricController.prototype.controller, 'geoJson')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    async geoJson(@Body() opciones?: TypeDto): Promise<GeoJsonDto> {
        return await this.service.geoJson(opciones);
    }
    @Post(':id/obtener/json')
    @Servicio(GeometricController.prototype.controller, 'geoJsonById')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    async geoJsonById(
        @Param('id', ParseIntPipe) id: number,
        @Body() opciones?: TypeDto
    ): Promise<GeoJsonDto> {
        return await this.service.geoJsonById(
            id,
            opciones
        );
    }
}

import {Body, Delete, Get, Param, ParseIntPipe, Patch, Post, Query} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {Pagination} from "nestjs-typeorm-paginate";
import {ConfigService} from "@atlasjs/config";
import {AppConfig} from "../../app.keys";
import {GetUser} from "../../security/decorator";
import {UserEntity} from "../../security/entity";
import {DeleteResult} from "typeorm";
import {UpdateResult} from "typeorm/query-builder/result/UpdateResult";
import {GenericService} from "../service/generic.service";
import {IController} from "../interface";
import {BuscarDto, FiltroGenericoDto, ListadoDto, ResponseDto} from "../dto";
import {FiltroDto} from "../../security/dto/filtro.dto";

export abstract class GenericController<ENTITY> implements IController<ENTITY> {

    constructor(
        protected readonly service: GenericService<ENTITY>,
        protected configService: ConfigService,
        protected ruta: string
    ) {
    }

    @Get()
    async findAll(@Query('page') page: number = 1,
                  @Query('limit') limit: number = 10,): Promise<Pagination<any>> {
        limit = limit > 100 ? 100 : limit;
        const url = this.configService.config[AppConfig.URL];
        const port = this.configService.config[AppConfig.PORT];
        return await this.service.findAll({
            page,
            limit,
            route: url + ':' + port + '/api/' + this.ruta,
        });
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return await this.service.findById(id);
    }

    @Get('/elementos/multiples')
    async findByIds(@Body() ids: number[]): Promise<any[]> {
        return await this.service.findByIds(ids);
    }

    @Post()
    async create(@GetUser() user: UserEntity, @Body() object: any): Promise<ResponseDto> {
        return await this.service.create(user, object);
    }

    @Post('/multiple')
    async createMultiple(@GetUser() user: UserEntity, @Body() objects: any[]): Promise<ResponseDto> {
        let result = new ResponseDto();
        for (const item of objects) {
            result = await this.service.create(user, item);
        }
        return result;
    }

    @Patch(':id')
    async update(@GetUser() user: UserEntity, @Param('id', ParseIntPipe) id: number, @Body() object: any): Promise<ResponseDto> {
        return await this.service.update(user, id, object);
    }

    @Patch('/elementos/multiples')
    async updateMultiple(@GetUser() user: UserEntity, @Body() objects: any[]): Promise<ResponseDto> {
        let result = new ResponseDto();
        for (const item of objects) {
            result = await this.service.update(user, item.id, item);
        }
        return result;
    }

    @Delete(':id')
    @ApiOperation({summary: 'Eliminar un elemento del conjunto utilizando borrado virtual.'})
    @ApiResponse({status: 201, description: 'El elemento se ha eliminado.'})
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    async delete(@GetUser() user: UserEntity, @Param('id', ParseIntPipe) id: number): Promise<ResponseDto> {
        return await this.service.deleteMultiple(user, [id]);
    }

    @Delete('/elementos/multiples')
    @ApiOperation({summary: 'Eliminar un grupo de elementos del conjunto utilizando borrado virtual.'})
    @ApiBody({
        description: 'Estructura para eliminar el grupo de elementos del conjunto.',
        type: [Number]
    })
    @ApiResponse({status: 201, description: 'El elemento se ha eliminado.'})
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    async deleteMultiple(@GetUser() user: UserEntity, @Body() ids: number[]): Promise<ResponseDto> {
        return await this.service.deleteMultiple(user, ids);
    }

    @Delete('/:id/delete/real')
    @ApiOperation({summary: 'Eliminar un elemento del conjunto utilizando borrado real.'})
    @ApiResponse({status: 201, description: 'El elemento se ha eliminado.'})
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    async remove(@GetUser() user: UserEntity, @Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        return await this.service.removeMultiple(user, [id]);
    }

    @Delete('/delete/real/elementos/multiples')
    @ApiOperation({summary: 'Eliminar un grupo de elementos del conjunto utilizando borrado real.'})
    @ApiBody({
        description: 'Estructura para eliminar el grupo de elementos del conjunto.',
        type: [Number]
    })
    @ApiResponse({status: 201, description: 'El elemento se ha eliminado.'})
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    async removeMultiple(@GetUser() user: UserEntity, @Body() ids: number[]): Promise<DeleteResult> {
        return await this.service.removeMultiple(user, ids);
    }

    @ApiOperation({summary: 'Mostrar la cantidad de elementos que tiene el conjunto.'})
    @ApiResponse({status: 201, description: 'Muestra la cantidad de elementos del conjunto.', type: Number})
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    @Get('/cantidad/elementos')
    async count(): Promise<number> {
        return await this.service.count();
    }

    @Post('filtro/por')
    async filter(@Query('page') page: number = 1,
                 @Query('limit') limit: number = 10,
                 @Body() filtroGenericoDto: FiltroGenericoDto): Promise<Pagination<any>> {
        limit = limit > 100 ? 100 : limit;
        const url = this.configService.config[AppConfig.URL];
        const port = this.configService.config[AppConfig.PORT];
        return await this.service.filter({
            page,
            limit,
            route: url + ':' + port + '/api/' + this.ruta,
        }, filtroGenericoDto);
    }

    @Post('search')
    async search(@Query('page') page: number = 1,
                 @Query('limit') limit: number = 10,
                 @Body() buscarDto: BuscarDto): Promise<Pagination<any>> {
        limit = limit > 100 ? 100 : limit;
        const url = this.configService.config[AppConfig.URL];
        const port = this.configService.config[AppConfig.PORT];
        return await this.service.search({
            page,
            limit,
            route: url + ':' + port + '/api/' + this.ruta,
        },buscarDto);
    }
}
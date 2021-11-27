import {ConfigService} from '@atlasjs/config';
import {
    Body,
    Controller, Delete,
    Get,
    Param,
    ParseIntPipe, Patch,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {
    ApiBearerAuth, ApiBody,
    ApiNotFoundResponse,
    ApiOperation, ApiParam,
    ApiResponse, ApiTags
} from '@nestjs/swagger';
import {GetUser, Servicio} from 'src/security/decorator';
import {UserEntity} from 'src/security/entity';
import {GenericNomencladorService} from '../service';
import {AuthGuard} from "@nestjs/passport";
import {BuscarDto, FiltroGenericoDto, ListadoDto, ResponseDto} from "../../shared/dto";
import {
    CreateNomencladorDto,
    ReadNomencladorDto,
    SelectDto,
    UpdateMultipleNomencladorDto,
    UpdateNomencladorDto
} from "../dto";
import {AppConfig} from "../../app.keys";
import {DeleteResult} from "typeorm";
import {NomencladorTypeEnum} from "../enum/nomenclador-type.enum";
import {PermissionGuard, RolGuard} from "../../security/guard";

@ApiTags('Nomencladores')
@Controller('nomenclador')
@UseGuards(AuthGuard('jwt'), RolGuard, PermissionGuard)
@ApiBearerAuth()
@UsePipes(ValidationPipe)
export class GenericNomencladorController {
    constructor(
        protected nomencladorService: GenericNomencladorService,
        protected configService: ConfigService
    ) {
    }
    @Get('/:name')
    @ApiParam({name: "name", example: 'clasificacionTransporte'})
    @ApiOperation({summary: 'Obtener el listado de elementos del conjunto para el select'})
    @ApiResponse({
        status: 200,
        description: 'Listado de elementos del conjunto para el select',
        type: SelectDto
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Elementos del conjunto no encontrados.'
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    @Servicio(GenericNomencladorController.name, 'getAllNomenclator')
    async getAllNomenclator(@Param('name') name: string): Promise<SelectDto[]> {
        return await this.nomencladorService.findAllNomenclator(name);
    }
    @Get('/:name/:id')
    @ApiParam({name: "name", example: 'clasificacionTransporte'})
    @ApiOperation({summary: 'Obtener un elemento del conjunto'})
    @ApiResponse({
        status: 200,
        description: 'Muestra la información de un elemento del conjunto',
        type: ReadNomencladorDto
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Elemento del conjunto no encontrado.'
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    @Servicio(GenericNomencladorController.name, 'findById')
    async findById(
        @Param('name') name: string,
        @Param('id', ParseIntPipe) id: number
    ): Promise<any> {
        return await this.nomencladorService.findById(name, id);
    }
    @Get('/:name/listado/elementos')
    @ApiParam({name: "name", example: 'clasificacionTransporte'})
    @ApiParam({required: false, name: "page", example: '1'})
    @ApiParam({required: false, name: "limit", example: '10'})
    @ApiOperation({summary: 'Obtener el listado de elementos del conjunto'})
    @ApiResponse({
        status: 200,
        description: 'Listado de elementos del conjunto',
        type: ListadoDto
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Elementos del conjunto no encontrados.'
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    @Servicio(GenericNomencladorController.name, 'findAll')
    async findAll(
        @Param('name') name: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ): Promise<ListadoDto> {
        limit = limit > 100 ? 100 : limit;
        const url = this.configService.config[AppConfig.URL];
        const port = this.configService.config[AppConfig.PORT];
        const data = await this.nomencladorService.findAll(name, {
            page,
            limit,
            route: url + ':' + port + '/api/nomenclador'
        });
        const header: string[] = ['id', 'Nombre'];
        return new ListadoDto(header, data);
    }
    @Post('/:name/elementos/multiples')
    @ApiParam({name: "name", example: 'clasificacionTransporte'})
    @ApiOperation({summary: 'Obtener multiples elementos del conjunto'})
    @ApiBody({
        description: 'Estructura para mostrar los multiples elementos del conjunto.',
        type: [Number]
    })
    @ApiResponse({
        status: 200,
        description: 'Muestra la información de multiples elementos del conjunto',
        type: [ReadNomencladorDto]
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Elementos del conjunto no encontrados.'
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    @Servicio(GenericNomencladorController.name, 'findByIds')
    async findByIds(@Param('name') name: string, @Body() ids: number[]): Promise<ReadNomencladorDto[]> {
        return await this.nomencladorService.findByIds(name, ids);
    }
    @Post(':name')
    @ApiParam({name: "name", example: 'clasificacionTransporte'})
    @ApiOperation({summary: 'Crear un elemento del conjunto.'})
    @ApiBody({
        description: 'Estructura para crear el elemento del conjunto.',
        type: CreateNomencladorDto
    })
    @ApiResponse({status: 201, description: 'Crea un elemento del conjunto.', type: ResponseDto})
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    @Servicio(GenericNomencladorController.name, 'create')
    async create(@Param('name') name: string, @GetUser() user: UserEntity, @Body() createNomencladorDto: CreateNomencladorDto): Promise<ResponseDto> {
        return await this.nomencladorService.create(name, user, createNomencladorDto);
    }
    @Post('/:name/multiple')
    @ApiParam({name: "name", example: 'clasificacionTransporte'})
    @ApiOperation({summary: 'Crear un grupo de elementos del conjunto.'})
    @ApiBody({
        description: 'Estructura para crear el grupo de elementos del conjunto.',
        type: [CreateNomencladorDto]
    })
    @ApiResponse({status: 201, description: 'Crea un grupo de elementos del conjunto.', type: ResponseDto})
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    @Servicio(GenericNomencladorController.name, 'createMultiple')
    async createMultiple(@Param('name') name: string, @GetUser() user: UserEntity, @Body() createNomencladorDto: CreateNomencladorDto[]): Promise<ResponseDto> {
        let result = new ResponseDto();
        for (const item of createNomencladorDto) {
            result = await this.nomencladorService.create(name, user, item);
        }
        return result;
    }
    @Patch('/:name/:id')
    @ApiParam({name: "name", example: 'clasificacionTransporte'})
    @ApiOperation({summary: 'Actualizar un elemento del conjunto.'})
    @ApiBody({
        description: 'Estructura para modificar el elemento del conjunto.',
        type: UpdateNomencladorDto
    })
    @ApiResponse({status: 201, description: 'El elemento se ha actualizado.', type: ResponseDto})
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    @Servicio(GenericNomencladorController.name, 'update')
    async update(
        @Param('name') name: string,
        @GetUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateNomencladorDto: UpdateNomencladorDto
    ): Promise<ResponseDto> {
        return await this.nomencladorService.update(name, user, id, updateNomencladorDto);
    }
    @Patch('/:name/elementos/multiples')
    @ApiParam({name: "name", example: 'clasificacionTransporte'})
    @ApiOperation({summary: 'Actualizar un grupo de elementos del conjunto.'})
    @ApiBody({
        description: 'Estructura para modificar el grupo de elementos del conjunto.',
        type: [UpdateMultipleNomencladorDto]
    })
    @ApiResponse({status: 201, description: 'El grupo de elementos se han actualizado.', type: ResponseDto})
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    @Servicio(GenericNomencladorController.name, 'updateMultiple')
    async updateMultiple(
        @Param('name') name: string,
        @GetUser() user: UserEntity,
        @Body() updateMultipleNomencladorDto: UpdateMultipleNomencladorDto[]
    ): Promise<ResponseDto> {
        let result = new ResponseDto();
        for (const item of updateMultipleNomencladorDto) {
            result = await this.nomencladorService.update(name, user, item.id, item);
        }
        return result;
    }
    @Delete('/:name/:id')
    @ApiParam({name: "name", example: 'clasificacionTransporte'})
    @ApiOperation({summary: 'Eliminar un elemento del conjunto utilizando borrado virtual.'})
    @ApiResponse({status: 201, description: 'El elemento se ha eliminado.'})
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    @Servicio(GenericNomencladorController.name, 'delete')
    async delete(@Param('name') name: string, @GetUser() user: UserEntity, @Param('id', ParseIntPipe) id: number): Promise<ResponseDto> {
        return await this.nomencladorService.deleteMultiple(name, user, [id]);
    }
    @Delete('/:name/elementos/multiples')
    @ApiParam({name: "name", example: 'clasificacionTransporte'})
    @ApiOperation({summary: 'Eliminar un grupo de elementos del conjunto utilizando borrado virtual.'})
    @ApiBody({
        description: 'Estructura para eliminar el grupo de elementos del conjunto.',
        type: [Number]
    })
    @ApiResponse({status: 201, description: 'El elemento se ha eliminado.'})
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    @Servicio(GenericNomencladorController.name, 'deleteMultiple')
    async deleteMultiple(@Param('name') name: string, @GetUser() user: UserEntity, @Body() ids: number[]): Promise<ResponseDto> {
        return await this.nomencladorService.deleteMultiple(name, user, ids);
    }
    @Delete('/:name/:id/delete/real')
    @ApiParam({name: "name", example: 'clasificacionTransporte'})
    @ApiOperation({summary: 'Eliminar un elemento del conjunto utilizando borrado real.'})
    @ApiResponse({status: 201, description: 'El elemento se ha eliminado.'})
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    @Servicio(GenericNomencladorController.name, 'remove')
    async remove(@Param('name') name: string, @GetUser() user: UserEntity, @Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        return await this.nomencladorService.removeMultiple(name, user, [id]);
    }
    @Delete('/:name/delete/real/elementos/multiples')
    @ApiParam({name: "name", example: 'clasificacionTransporte'})
    @ApiOperation({summary: 'Eliminar un grupo de elementos del conjunto utilizando borrado real.'})
    @ApiBody({
        description: 'Estructura para eliminar el grupo de elementos del conjunto.',
        type: [Number]
    })
    @ApiResponse({status: 201, description: 'El elemento se ha eliminado.'})
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    @Servicio(GenericNomencladorController.name, 'removeMultiple')
    async removeMultiple(@Param('name') name: string, @GetUser() user: UserEntity, @Body() ids: number[]): Promise<DeleteResult> {
        return await this.nomencladorService.removeMultiple(name, user, ids);
    }
    @Get('/:name/cantidad/elementos')
    @ApiParam({name: "name", example: 'clasificacionTransporte'})
    @ApiParam({required: false, name: "page", example: '1'})
    @ApiParam({required: false, name: "limit", example: '10'})
    @ApiOperation({summary: 'Mostrar la cantidad de elementos que tiene el conjunto.'})
    @ApiResponse({status: 201, description: 'Muestra la cantidad de elementos del conjunto.', type: Number})
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    @Servicio(GenericNomencladorController.name, 'count')
    async count(@Param('name') name: string): Promise<number> {
        return await this.nomencladorService.count(name);
    }
    @Post('/:name/filtrar/por')
    @ApiParam({name: "name", example: 'clasificacionTransporte'})
    @ApiOperation({summary: 'Filtrar el conjunto por los parametros establecidos'})
    @ApiResponse({
        status: 201,
        description: 'Filtra el conjunto por los parametros que se le puedan pasar',
        type: ListadoDto
    })
    @ApiBody({
        description: 'Estructura para crear el filtrado.',
        type: FiltroGenericoDto
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    @Servicio(GenericNomencladorController.name, 'filter')
    async filter(@Param('name') name: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Body() filtroGenericoDto: FiltroGenericoDto): Promise<ListadoDto> {
        limit = limit > 100 ? 100 : limit;
        const url = this.configService.config[AppConfig.URL];
        const port = this.configService.config[AppConfig.PORT];
        const data = await this.nomencladorService.filter(name, {
            page,
            limit,
            route: url + ':' + port + '/api/nomenclador'
        }, filtroGenericoDto);
        const header: string[] = ['id', 'Nombre'];
        return new ListadoDto(header, data);
    }
    @Post('/:name/buscar')
    @ApiParam({name: "name", example: 'clasificacionTransporte'})
    @ApiParam({required: false, name: "page", example: '1'})
    @ApiParam({required: false, name: "limit", example: '10'})
    @ApiOperation({summary: 'Buscar en el conjunto por el parametro establecido'})
    @ApiResponse({
        status: 201,
        description: 'Busca en el conjunto en el parametros establecido',
        type: ListadoDto
    })
    @ApiBody({
        description: 'Estructura para crear la búsqueda.',
        type: String
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    @Servicio(GenericNomencladorController.name, 'search')
    async search(@Param('name') name: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Body() buscarDto: BuscarDto): Promise<ListadoDto> {
        limit = limit > 100 ? 100 : limit;
        const url = this.configService.config[AppConfig.URL];
        const port = this.configService.config[AppConfig.PORT];
        const data = await this.nomencladorService.search(name, {
            page,
            limit,
            route: url + ':' + port + '/api/nomenclador'
        }, buscarDto);
        const header: string[] = ['id', 'Nombre'];
        return new ListadoDto(header, data);
    }
    @Get()
    @ApiOperation({summary: 'Muestra todos los nombres de los nomencladores'})
    @ApiResponse({
        status: 200,
        description: 'Muestra todos los nombres de los nomencladores',
        type: [String]
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    @Servicio(GenericNomencladorController.name, 'nombreNomencladores')
    nombreNomencladores(): string[] {
        const array: string[] = [];
        for (const [, propertyValue] of Object.entries(NomencladorTypeEnum)) {
            array.push(propertyValue);
        }
        return array;
    }
}

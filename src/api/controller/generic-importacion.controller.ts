import { Body, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser, Servicio } from '../decorator';
import { UserEntity } from '../../persistence/entity';
import { ResponseDto, SelectDto } from '../../shared/dto';
import { GenericService } from '../../core/service';
import { ConfigService } from '@nestjs/config';

export abstract class GenericImportacionController<ENTITY> {
  protected constructor(
    protected service: GenericService<ENTITY>,
    protected configService: ConfigService,
    protected ruta: string,
  ) {}
  @Post('/importar/elementos')
  async import(
    @GetUser() user: UserEntity,
    @Body() objects: any[],
  ): Promise<ResponseDto[]> {
    return await this.service.importar(user, objects);
  }
  @Get('/crear/select')
  async createSelect(): Promise<SelectDto[]> {
    return await this.service.createSelect();
  }
}

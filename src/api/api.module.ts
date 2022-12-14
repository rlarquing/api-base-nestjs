import { Module } from '@nestjs/common';
import {
  AuthController,
  EndPointController,
  FuncionController,
  GenericNomencladorController,
  MenuController,
  MunicipioController,
  ProvinciaController,
  RolController,
  SocketController,
  TrazaController,
  UserController,
} from './controller';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [CoreModule, SharedModule],
  controllers: [
    TrazaController,
    AuthController,
    UserController,
    RolController,
    GenericNomencladorController,
    MunicipioController,
    ProvinciaController,
    EndPointController,
    FuncionController,
    MenuController,
    SocketController,
  ],
  providers: [],
  exports: [],
})
export class ApiModule {}

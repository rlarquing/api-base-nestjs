import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EndPointEntity,
  FuncionEntity,
  MenuEntity,
  MunicipioEntity,
  ProvinciaEntity,
  RolEntity,
  TrazaEntity,
  UserEntity,
} from './entity';
import { repository } from './persistence.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EndPointEntity,
      FuncionEntity,
      MenuEntity,
      MunicipioEntity,
      ProvinciaEntity,
      RolEntity,
      TrazaEntity,
      UserEntity,
    ]),
    SharedModule,
  ],
  providers: [...repository],
  exports: [...repository],
})
export class PersistenceModule {}

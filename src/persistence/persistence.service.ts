import {
  EndPointRepository,
  FuncionRepository,
  GenericNomencladorRepository,
  MenuRepository,
  MunicipioRepository,
  ProvinciaRepository,
  RolRepository,
  LogHistoryRepository,
  UserRepository,
} from './repository';
import {
  EndPointEntity,
  FuncionEntity,
  LogHistoryEntity,
  MenuEntity,
  MunicipioEntity,
  ProvinciaEntity,
  RolEntity, UserEntity
} from "./entity";

export const repository = [
  LogHistoryRepository,
  UserRepository,
  RolRepository,
  FuncionRepository,
  EndPointRepository,
  MenuRepository,
  GenericNomencladorRepository,
  MunicipioRepository,
  ProvinciaRepository,
];
export  const entity = [
  EndPointEntity,
  FuncionEntity,
  MenuEntity,
  MunicipioEntity,
  ProvinciaEntity,
  RolEntity,
  LogHistoryEntity,
  UserEntity,
]

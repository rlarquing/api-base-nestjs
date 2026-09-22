import {
  EndPointRepository,
  FuncionRepository,
  FuncionTraduccionRepository,
  GenericNomencladorRepository,
  IdiomaRepository,
  MenuRepository,
  MenuTraduccionRepository,
  MunicipioRepository,
  ProvinciaRepository,
  RolRepository,
  LogHistoryRepository,
  UserRepository,
} from './repository';
import {
  EndPointEntity,
  FuncionEntity,
  FuncionTraduccionEntity,
  IdiomaEntity,
  LogHistoryEntity,
  MenuEntity,
  MenuTraduccionEntity,
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
  IdiomaRepository,
  MenuTraduccionRepository,
  FuncionTraduccionRepository,
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
  IdiomaEntity,
  MenuTraduccionEntity,
  FuncionTraduccionEntity,
]

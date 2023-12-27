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

import {
  EndPointRepository,
  FuncionRepository,
  GenericNomencladorRepository,
  MenuRepository,
  MunicipioRepository,
  ProvinciaRepository,
  RolRepository,
  TrazaRepository,
  UserRepository,
} from './repository';

export const repository = [
  TrazaRepository,
  UserRepository,
  RolRepository,
  FuncionRepository,
  EndPointRepository,
  MenuRepository,
  GenericNomencladorRepository,
  MunicipioRepository,
  ProvinciaRepository,
];

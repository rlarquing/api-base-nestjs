import {
  AuthController, EndPointController, FuncionController,
  GenericNomencladorController,
  LogHistoryController, MenuController, MunicipioController, ProvinciaController,
  RolController, SocketController,
  UserController
} from "./controller";


export const controller = [
  LogHistoryController,
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
];

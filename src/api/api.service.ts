import {
  AuthController, EndPointController, FuncionController,
  FuncionTraduccionController,
  GenericNomencladorController,
  IdiomaController,
  LogHistoryController, MenuController, MenuTraduccionController, MunicipioController, ProvinciaController,
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
  IdiomaController,
  MenuTraduccionController,
  FuncionTraduccionController,
];

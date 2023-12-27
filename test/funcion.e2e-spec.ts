import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeORMExceptionFilter } from '../src/shared/filter/typeorm-exception.filter';
import { ApiModule } from '../src/api/api.module';
import { PersistenceModule } from '../src/persistence/persistence.module';
import { CoreModule } from '../src/core/core.module';
import {
  AuthCredentialsDto,
  CreateFuncionDto,
  UpdateFuncionDto,
} from '../src/shared/dto';

describe('FuncionController (e2e)', () => {
  let app: INestApplication;
  let currentSize: number;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ApiModule, PersistenceModule, CoreModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new TypeORMExceptionFilter());
    app.setGlobalPrefix('api');
    currentSize = 0;
    await app.init();
  });

  it('Listar función', async () => {
    const server = request(app.getHttpServer());
    const authCredentialsDto: AuthCredentialsDto = {
      userName: 'juan',
      password: 'Qwerty1234*',
    };
    const loginUserRequest = await server
      .post('/api/auth/signin')
      .type('form')
      .send(authCredentialsDto)
      .expect(201);
    expect(loginUserRequest.status).toBe(201);
    const findAllRequest = await server
      .get('/api/funcion')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(findAllRequest.status).toBe(200);
    currentSize = await findAllRequest.body.data.meta.totalItems;
  });

  it('Crear función', async () => {
    const server = request(app.getHttpServer());
    const authCredentialsDto: AuthCredentialsDto = {
      userName: 'juan',
      password: 'Qwerty1234*',
    };
    const loginUserRequest = await server
      .post('/api/auth/signin')
      .type('form')
      .send(authCredentialsDto)
      .expect(201);
    expect(loginUserRequest.status).toBe(201);

    let funcionDto: CreateFuncionDto = new CreateFuncionDto();

    const listMenuRequest = await server
      .get('/api/menu')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    if (listMenuRequest.body.data.items.length > 0) {
      const menu_id: number =
        listMenuRequest.body.data.items[
          listMenuRequest.body.data.items.length - 1
        ].id;

      funcionDto = {
        nombre: 'Crear dimensión',
        descripcion: 'Funcion para crear las dimensiones',
        endPoints: [299],
        menu: menu_id,
      };
    } else {
      funcionDto = {
        nombre: 'Crear dimensión',
        descripcion: 'Funcion para crear las dimensiones',
        endPoints: [299],
      };
    }

    const newFuncionRequest = await server
      .post('/api/funcion')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .send(funcionDto)
      .expect(201);
    expect(newFuncionRequest.body.message).toBe('success');

    const listFuncionRequest = await server
      .get('/api/funcion')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(listFuncionRequest.status).toBe(200);

    const postNewRequest = await server
      .get('/api/funcion')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(postNewRequest.status).toBe(200);
    const postNewSize = postNewRequest.body.data.meta.totalItems;
    expect(postNewSize).toBe(currentSize + 1);
  });

  it('Editar función', async () => {
    const server = request(app.getHttpServer());
    const authCredentialsDto: AuthCredentialsDto = {
      userName: 'juan',
      password: 'Qwerty1234*',
    };
    const loginUserRequest = await server
      .post('/api/auth/signin')
      .type('form')
      .send(authCredentialsDto)
      .expect(201);
    expect(loginUserRequest.status).toBe(201);

    const listFuncionRequest = await server
      .get('/api/funcion')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);

    const id: number =
      listFuncionRequest.body.data.items[
        listFuncionRequest.body.data.items.length - 1
      ].id;

    const updateFuncionDto: UpdateFuncionDto = {
      nombre: 'Crear las dimensiones',
      descripcion: 'Funcion para crear las dimensiones',
      endPoints: [299],
    };

    const getFuncionRequest = await server
      .get(`/api/funcion/${id}`)
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);

    const updateFuncionRequest = await server
      .patch(`/api/funcion/${getFuncionRequest.body.id}`)
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .send(updateFuncionDto)
      .expect(200);
    expect(updateFuncionRequest.body.message).toBe('success');
  });

  it('Eliminar función', async () => {
    const server = request(app.getHttpServer());
    const authCredentialsDto: AuthCredentialsDto = {
      userName: 'juan',
      password: 'Qwerty1234*',
    };
    const loginUserRequest = await server
      .post('/api/auth/signin')
      .type('form')
      .send(authCredentialsDto)
      .expect(201);
    expect(loginUserRequest.status).toBe(201);

    let listFuncionRequest = await server
      .get('/api/funcion')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(listFuncionRequest.status).toBe(200);
    const id: number =
      listFuncionRequest.body.data.items[
        listFuncionRequest.body.data.items.length - 1
      ].id;
    const getFuncionRequest = await server
      .get(`/api/funcion/${id}`)
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(getFuncionRequest.status).toBe(200);
    const deleteFuncionRequest = await server
      .delete(`/api/funcion/${getFuncionRequest.body.id}`)
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(deleteFuncionRequest.body.message).toBe('success');
    listFuncionRequest = await server
      .get('/api/funcion')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(listFuncionRequest.status).toBe(200);
  });

  afterAll(async () => {
    await app.close();
  });
});

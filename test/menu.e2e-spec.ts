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
  CreateMenuDto,
  UpdateMenuDto,
} from '../src/shared/dto';

describe('MenuController (e2e)', () => {
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

  it('Listar menu', async () => {
    const server = request(app.getHttpServer());
    const authCredentialsDto: AuthCredentialsDto = {
      username: 'juan',
      password: 'Qwerty1234*',
    };
    const loginUserRequest = await server
      .post('/api/auth/signin')
      .type('form')
      .send(authCredentialsDto)
      .expect(201);
    expect(loginUserRequest.status).toBe(201);
    const findAllRequest = await server
      .get('/api/menu')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(findAllRequest.status).toBe(200);
    currentSize = await findAllRequest.body.data.meta.totalItems;
  });

  it('Crear menu', async () => {
    const server = request(app.getHttpServer());
    const authCredentialsDto: AuthCredentialsDto = {
      username: 'juan',
      password: 'Qwerty1234*',
    };
    const loginUserRequest = await server
      .post('/api/auth/signin')
      .type('form')
      .send(authCredentialsDto)
      .expect(201);
    expect(loginUserRequest.status).toBe(201);

    const menuDto: CreateMenuDto = {
      label: 'Reportes',
      icon: 'files',
      to: '/reporte',
      dimension: 1,
    };

    const newMenuRequest = await server
      .post('/api/menu')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .send(menuDto)
      .expect(201);
    expect(newMenuRequest.body.message).toBe('success');

    const listMenuRequest = await server
      .get('/api/menu')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(listMenuRequest.status).toBe(200);
    const id: number =
      listMenuRequest.body.data.items[
        listMenuRequest.body.data.items.length - 1
      ].id;

    const menuHijoDto: CreateMenuDto = {
      label: 'Exportar tablero de comando económico',
      icon: 'pdf',
      to: '/reporte/tablero/economico',
      dimension: 1,
      menu: id,
    };

    const newMenuHijoRequest = await server
      .post('/api/menu')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .send(menuHijoDto)
      .expect(201);
    expect(newMenuHijoRequest.body.message).toBe('success');

    const postNewRequest = await server
      .get('/api/menu')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(postNewRequest.status).toBe(200);
    const postNewSize = postNewRequest.body.data.meta.totalItems;
    expect(postNewSize).toBe(currentSize + 2);
  });

  it('Editar menu', async () => {
    const server = request(app.getHttpServer());
    const authCredentialsDto: AuthCredentialsDto = {
      username: 'juan',
      password: 'Qwerty1234*',
    };
    const loginUserRequest = await server
      .post('/api/auth/signin')
      .type('form')
      .send(authCredentialsDto)
      .expect(201);
    expect(loginUserRequest.status).toBe(201);

    const listMenuRequest = await server
      .get('/api/menu')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);

    const menu_padre_id: number =
      listMenuRequest.body.data.items[
        listMenuRequest.body.data.items.length - 2
      ].id;

    const updateMenuDto: UpdateMenuDto = {
      label: 'Exportar tablero comando económico',
      icon: 'pdf',
      to: '/reporte/tablero/economico',
      dimension: 1,
      menu: menu_padre_id,
    };

    const id: number =
      listMenuRequest.body.data.items[
        listMenuRequest.body.data.items.length - 1
      ].id;

    const getMenuRequest = await server
      .get(`/api/menu/${id}`)
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);

    const updateMenuRequest = await server
      .patch(`/api/menu/${getMenuRequest.body.id}`)
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .send(updateMenuDto)
      .expect(200);
    expect(updateMenuRequest.body.message).toBe('success');
  });

  it('Eliminar menu', async () => {
    const server = request(app.getHttpServer());
    const authCredentialsDto: AuthCredentialsDto = {
      username: 'juan',
      password: 'Qwerty1234*',
    };
    const loginUserRequest = await server
      .post('/api/auth/signin')
      .type('form')
      .send(authCredentialsDto)
      .expect(201);
    expect(loginUserRequest.status).toBe(201);

    const listMenuRequest = await server
      .get('/api/menu')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(listMenuRequest.status).toBe(200);
    const id: number =
      listMenuRequest.body.data.items[
        listMenuRequest.body.data.items.length - 1
      ].id;
    const getMenuRequest = await server
      .get(`/api/menu/${id}`)
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(getMenuRequest.status).toBe(200);
    const deleteMenuRequest = await server
      .delete(`/api/menu/${getMenuRequest.body.id}`)
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(deleteMenuRequest.body.message).toBe('success');
  });

  afterAll(async () => {
    await app.close();
  });
});

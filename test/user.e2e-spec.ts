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
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserDto,
} from '../src/shared/dto';

describe('UserController (e2e)', () => {
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

  it('Listar usuarios', async () => {
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
      .get('/api/user')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(findAllRequest.status).toBe(200);
    currentSize = await findAllRequest.body.data.meta.totalItems;
  });

  it('Crear user', async () => {
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

    const userDto: CreateUserDto = {
      username: 'especialista',
      password: 'Qwerty1234*',
      confirmPassword: 'Qwerty1234*',
      roles: [1],
      funcions: [],
    };

    const newUserRequest = await server
      .post('/api/user')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .send(userDto)
      .expect(201);
    expect(newUserRequest.body.message).toBe('success');
    const postNewRequest = await server
      .get('/api/user')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    const postNewSize = postNewRequest.body.data.meta.totalItems;
    expect(postNewSize).toBe(currentSize + 1);
  });
  it('Editar user', async () => {
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

    const updateUserDto: UpdateUserDto = {
      username: 'especialistaEconomico',
      roles: [1],
    };
    const listUserRequest = await server
      .get('/api/user')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    const id: number =
      listUserRequest.body.data.items[
        listUserRequest.body.data.items.length - 1
      ].id;
    const getUserRequest = await server
      .get(`/api/user/${id}`)
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    const updateUserRequest = await server
      .patch(`/api/user/${getUserRequest.body.id}`)
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .send(updateUserDto)
      .expect(200);
    expect(updateUserRequest.body.message).toBe('success');
  });
  it('Cambiar password user', async () => {
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

    const changePasswordDto: ChangePasswordDto = {
      password: 'Qwerty1234**',
      confirmPassword: 'Qwerty1234**',
    };
    const listUserRequest = await server
      .get('/api/user')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    const id: number =
      listUserRequest.body.data.items[
        listUserRequest.body.data.items.length - 1
      ].id;
    const getUserRequest = await server
      .get(`/api/user/${id}`)
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    const changePasswordUserRequest = await server
      .patch(`/api/user/${getUserRequest.body.id}/change/password`)
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .send(changePasswordDto)
      .expect(200);
    expect(changePasswordUserRequest.body.message).toBe('success');
  });
  it('Eliminar user', async () => {
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

    const listUserRequest = await server
      .get('/api/user')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(listUserRequest.status).toBe(200);
    const id: number =
      listUserRequest.body.data.items[
        listUserRequest.body.data.items.length - 1
      ].id;
    const getUserRequest = await server
      .get(`/api/user/${id}`)
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(getUserRequest.status).toBe(200);
    const deleteUserRequest = await server
      .delete(`/api/user/${getUserRequest.body.id}`)
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(deleteUserRequest.body.message).toBe('success');
  });

  afterAll(async () => {
    await app.close();
  });
});

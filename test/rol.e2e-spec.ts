import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SecurityModule } from '../src/security/security.module';
import { TypeORMExceptionFilter } from '../src/shared/filter/typeorm-exception.filter';
import {
  AuthCredentialsDto,
  CreateRolDto,
  UpdateRolDto,
  UpdateUserDto,
} from '../src/security/dto';

describe('RolController (e2e)', () => {
  let app: INestApplication;
  let currentSize: number;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, SecurityModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new TypeORMExceptionFilter());
    app.setGlobalPrefix('api');
    currentSize = 0;
    await app.init();
  });

  it('Listar Roles', async () => {
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
      .get('/api/rol')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(findAllRequest.status).toBe(200);
    currentSize = await findAllRequest.body.data.meta.totalItems;
  });

  it('Crear Rol', async () => {
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

    const rolDto: CreateRolDto = {
      nombre: 'Especialista principal economia',
      descripcion: 'Se encarga de toda la dimension economica',
      dimension: 1,
      users: [],
      permisos: [610, 611],
    };

    const newRolRequest = await server
      .post('/api/rol')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .send(rolDto)
      .expect(201);
    expect(newRolRequest.body.message).toBe('success');
    const postNewRequest = await server
      .get('/api/rol')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    const postNewSize = postNewRequest.body.data.meta.totalItems;
    expect(postNewSize).toBe(currentSize + 1);
  });

  it('Editar Rol', async () => {
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
    const updateRolDto: UpdateRolDto = {
      nombre: 'this_is_not_a_real_rol',
      descripcion: 'Este rol es de prueba',
      dimension: 1,
    };
    const listRolRequest = await server
      .get('/api/rol')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    const id: number =
      listRolRequest.body.data.items[listRolRequest.body.data.items.length - 1]
        .id;

    const getRolRequest = await server
      .get(`/api/rol/${id}`)
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);

    const updateRolRequest = await server
      .patch(`/api/rol/${getRolRequest.body.id}`)
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .send(updateRolDto)
      .expect(200);
    expect(updateRolRequest.body.message).toBe('success');
  });

  it('Eliminar Rol', async () => {
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

    const listRolRequest = await server
      .get('/api/rol')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(listRolRequest.status).toBe(200);
    const id: number =
      listRolRequest.body.data.items[listRolRequest.body.data.items.length - 1]
        .id;
    const getRolRequest = await server
      .get(`/api/rol/${id}`)
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(getRolRequest.status).toBe(200);
    const deleteRolRequest = await server
      .delete(`/api/rol/${getRolRequest.body.id}`)
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(deleteRolRequest.body.message).toBe('success');
  });

  afterAll(async () => {
    await app.close();
  });
});

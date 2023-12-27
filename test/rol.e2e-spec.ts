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
  CreateRolDto,
  UpdateRolDto,
} from '../src/shared/dto';

describe('RolController (e2e)', () => {
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

  it('Listar roles', async () => {
    const server = request(app.getHttpServer());
    const authCredentialsDto: AuthCredentialsDto = {
      userName: 'admin',
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
    if (findAllRequest.body.data.meta === undefined) {
      currentSize = await findAllRequest.body.data.length;
    } else {
      currentSize = await findAllRequest.body.data.meta.totalItems;
    }
  });

  it('Crear rol', async () => {
    const server = request(app.getHttpServer());
    const authCredentialsDto: AuthCredentialsDto = {
      userName: 'admin',
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
      users: [],
      funcions: [1],
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
    let postNewSize = 0;
    if (postNewRequest.body.data.meta === undefined) {
      postNewSize = postNewRequest.body.data.length;
    } else {
      postNewSize = postNewRequest.body.data.meta.totalItems;
    }

    expect(postNewSize).toBe(currentSize + 1);
  });

  it('Editar rol', async () => {
    const server = request(app.getHttpServer());
    const authCredentialsDto: AuthCredentialsDto = {
      userName: 'admin',
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
    };
    const listRolRequest = await server
      .get('/api/rol')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    let id = 0;
    if (listRolRequest.body.data.meta === undefined) {
      id = listRolRequest.body.data[listRolRequest.body.data.length - 1].id;
    } else {
      id =
        listRolRequest.body.data.data[listRolRequest.body.data.data.length - 1]
          .id;
    }

    listRolRequest.body.data.data[listRolRequest.body.data.data.length - 1].id;

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

  it('Eliminar rol', async () => {
    const server = request(app.getHttpServer());
    const authCredentialsDto: AuthCredentialsDto = {
      userName: 'admin',
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

    let id = 0;
    if (listRolRequest.body.data.meta === undefined) {
      id = listRolRequest.body.data[listRolRequest.body.data.length - 1].id;
    } else {
      id =
        listRolRequest.body.data.data[listRolRequest.body.data.data.length - 1]
          .id;
    }

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

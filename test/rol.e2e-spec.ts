import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SecurityModule } from '../src/security/security.module';
import { TypeORMExceptionFilter } from '../src/shared/filter/typeorm-exception.filter';
import { AuthCredentialsDto } from '../src/security/dto';

describe('RolController (e2e)', () => {
  let app: INestApplication;
  let currentSize: number;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, SecurityModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new TypeORMExceptionFilter());
    currentSize=0;
    await app.init();
  });

  it('Listar Roles', async () => {
    const server = request(app.getHttpServer());
    const authCredentialsDto: AuthCredentialsDto = {
      username: 'juan',
      password: 'Qwerty1234*',
    };
    const loginUserRequest = await server
      .post('/auth/signin')
      .type('form')
      .send(authCredentialsDto)
      .expect(201);
    expect(loginUserRequest.status).toBe(201);
    const findAllRequest = await server
      .get('/rol')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(200);
    expect(findAllRequest.status).toBe(200);
    currentSize = await findAllRequest.body.data.meta.totalItems;
  });
  // const currentGetAllRequest = await server.get('/user').expect(401);
  // const currentSize = currentGetAllRequest.body.length;
  // await server
  //   .post('/user')
  //   .type('form')
  //   .send(authCredentialsDto)
  //   .expect(400);
  // const postNewRequest = await server.get('/user').expect(200);
  // const postNewSize = postNewRequest.body.length;
  // expect(postNewSize).toBe(currentSize + 1);
  // const id = newUserRequest.body.id;
  // const getUserByIdRequest = await server.get(`/users/${id}`).expect(200);
  // expect(getUserByIdRequest.body.id).toBe(id);
  // const updateUser: UserDto = {
  //     id: newUserRequest.body.id,
  //     name: 'Reynelbis Larquin'
  // };
  // const updateUserRequest = await server.put(`/users/${updateUser.id}`).expect(200).type('form').send(updateUser);
  // expect(updateUserRequest.body.name).toEqual(updateUser.name);
  // await server.delete(`/users/${updateUser.id}`).expect(200);
  // const postDeleteGetAllRequest = await server.get('/users').expect(200);
  // const postDeleteSize = postDeleteGetAllRequest.body.length;
  // expect(postDeleteSize).toBe(currentSize);
  afterAll(async () => {
    await app.close();
  });
});

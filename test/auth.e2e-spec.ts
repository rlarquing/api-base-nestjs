import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeORMExceptionFilter } from '../src/shared/filter/typeorm-exception.filter';
import { AuthCredentialsDto, UserDto } from '../src/shared/dto';
import { ApiModule } from '../src/api/api.module';
import { PersistenceModule } from '../src/persistence/persistence.module';
import { CoreModule } from '../src/core/core.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ApiModule, PersistenceModule, CoreModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new TypeORMExceptionFilter());
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('Registrar User', async () => {
    const server = request(app.getHttpServer());
    const userDto: UserDto = {
      username: 'reynelbis',
      password: 'Qwerty1234*',
      confirmPassword: 'Qwerty1234*',
    };

    const newUserRequest = await server
      .post('/api/auth/signup')
      .type('form')
      .send(userDto)
      .expect(201);
    expect(newUserRequest.body.message).toBe('success');
  });
  it('Logear User', async () => {
    const server = request(app.getHttpServer());
    const authCredentialsDto: AuthCredentialsDto = {
      username: 'reynelbis',
      password: 'Qwerty1234*',
    };
    const loginUserRequest = await server
      .post('/api/auth/signin')
      .type('form')
      .send(authCredentialsDto)
      .expect(201);
    expect(loginUserRequest.status).toBe(201);
  });
  it('Refresh-tokens User', async () => {
    const server = request(app.getHttpServer());
    const authCredentialsDto: AuthCredentialsDto = {
      username: 'reynelbis',
      password: 'Qwerty1234*',
    };
    const loginUserRequest = await server
      .post('/api/auth/signin')
      .type('form')
      .send(authCredentialsDto)
      .expect(201);
    expect(loginUserRequest.status).toBe(201);
    const { refreshToken } = loginUserRequest.body;
    const refreshTokenUserRequest = await server
      .post('/api/auth/refresh-tokens')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .send({ refreshToken })
      .expect(201);
    expect(refreshTokenUserRequest.status).toBe(201);
  });
  it('Deslogear User', async () => {
    const server = request(app.getHttpServer());
    const authCredentialsDto: AuthCredentialsDto = {
      username: 'reynelbis',
      password: 'Qwerty1234*',
    };
    const loginUserRequest = await server
      .post('/api/auth/signin')
      .type('form')
      .send(authCredentialsDto)
      .expect(201);
    expect(loginUserRequest.status).toBe(201);

    const logoutUserRequest = await server
      .post('/api/auth/logout')
      .set('Authorization', 'Bearer ' + loginUserRequest.body.accessToken)
      .expect(201);
    expect(logoutUserRequest.status).toBe(201);
  });
  afterAll(async () => {
    await app.close();
  });
});

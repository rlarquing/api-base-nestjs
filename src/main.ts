import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TypeORMExceptionFilter } from './shared/filter/typeorm-exception.filter';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import {
  EndPointService,
  IdiomaService,
  MenuService,
  RolService,
  UserService,
} from './core/service';
import { parseController } from '../lib';
import { NomencladorTypeEnum } from './shared/enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitar trust proxy para obtener la IP real del cliente detrás de proxies (Nginx, Caddy, Cloudflare)
  app.getHttpAdapter().getInstance().set('trust proxy', true);
  app.enableCors({
    origin: AppModule.cors,
  });
  // I18nValidationExceptionFilter traduce los mensajes de validacion y responde
  // { statusCode, message: string[] } en el idioma resuelto para la peticion.
  app.useGlobalFilters(
    new TypeORMExceptionFilter(),
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  );
  if (AppModule.logger) {
    app.useLogger(AppModule.loggerProvider);
  }
  app.setGlobalPrefix('api');
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('API-BASE')
    .setDescription('Api básica con Nestjs.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });
  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  // La siembra corre ANTES de escuchar: si falla, nadie ha podido pegarle a una
  // API a medio sembrar (menus sin funcion, rol admin sin permisos).
  const isDevelopmentEnv = process.env.NODE_ENV !== 'production';
  if (isDevelopmentEnv) {
    await sembrarDatosDesarrollo(app);
  }
  await app.listen(AppModule.port);
  const socketEnabled = process.env.SOCKET_ENABLED === 'true';
  console.log(
    `[Socket] ${socketEnabled ? 'ACTIVO' : 'INACTIVO'} (SOCKET_ENABLED=${process.env.SOCKET_ENABLED || 'false'})`,
  );
}

// La siembra es idempotente y se reintenta en cada arranque, asi que un fallo
// aqui no debe impedir levantar la API: se registra y se sigue. Antes la
// excepcion escapaba de bootstrap() y tumbaba el proceso con la API ya
// escuchando, dejando el estado a medias.
async function sembrarDatosDesarrollo(
  app: Awaited<ReturnType<typeof NestFactory.create>>,
): Promise<void> {
  try {
    const endPointService = app.get(EndPointService);
    const rolService: RolService = app.get(RolService);
    const userService: UserService = app.get(UserService);
    const menuService = app.get(MenuService);
    const idiomaService: IdiomaService = app.get(IdiomaService);
    const nomencladores: string[] = [];
    for (const [, propertyValue] of Object.entries(NomencladorTypeEnum)) {
      nomencladores.push(propertyValue);
    }
    await rolService.crearRolAdministrador();
    if (nomencladores.length > 0) {
      await menuService.crearMenuNomenclador(nomencladores);
    }
    await parseController(endPointService);
    await menuService.crearMenuAdministracion();
    await rolService.asignarFuncionesAdmin();
    await userService.crearUsuarioAdmin();
    await idiomaService.crearIdiomasIniciales();
  } catch (error) {
    console.error(
      '[Seed] La siembra de desarrollo fallo; la API arranca igualmente. Se reintentara en el proximo arranque.',
      error,
    );
  }
}

bootstrap().catch((error) => {
  console.error('[Bootstrap] No se pudo iniciar la aplicacion.', error);
  process.exit(1);
});

import * as fs from 'fs';
import * as path from 'path';
import {DatabaseModule} from "./database/database.module";
import {PersistenceModule} from "./persistence/persistence.module";
import {CoreModule} from "./core/core.module";
import {ApiModule} from "./api/api.module";
import {MailModule} from "./mail/mail.module";
import {DashboardModule} from "./dashboard/dashboard.module";
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from "nestjs-i18n";

// Cargar .env en process.env ANTES de cualquier module-level check.
// ConfigModule.forRoot() también lo hace, pero lo hace DESPUÉS de que
// este archivo se evalúa, por lo que process.env.SOCKET_ENABLED y
// process.env.DEFAULT_LANG no estarían disponibles sin esta carga temprana.
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, 'utf-8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.substring(0, idx).trim();
      const value = trimmed.substring(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

/**
 * Resuelve el directorio de assets i18n subiendo desde el directorio del modulo
 * compilado hasta encontrar la carpeta i18n. Mantiene una unica ubicacion
 * (dist/i18n) que vale igual en desarrollo y produccion.
 */
function resolverDirI18n(desde: string): string {
  let dir = path.resolve(desde);
  // Sube hasta la raiz del volumen (limite de seguridad).
  for (let i = 0; i < 10; i++) {
    const candidato = path.join(dir, 'i18n');
    if (fs.existsSync(path.join(candidato, 'es', 'validation.json'))) {
      return candidato + path.sep;
    }
    const padre = path.dirname(dir);
    if (padre === dir) break;
    dir = padre;
  }
  // Fallback: asume el layout actual del build (code en dist/src, assets en dist/i18n).
  return path.join(path.resolve(desde, '..'), 'i18n') + path.sep;
}

export const module = [
  // El idioma se resuelve por peticion: ?lang= (util en Swagger), luego la cabecera
  // x-lang y por ultimo Accept-Language, que es la que envia el frontend.
  // El primer resolver que encuentra un valor gana.
  I18nModule.forRoot({
    fallbackLanguage: process.env.DEFAULT_LANG ?? 'es',
    loaderOptions: {
      // Los assets i18n se copian por nest-cli.json dentro de dist/ junto al
      // codigo compilado, por lo que se resuelven subiendo desde __dirname
      // hasta encontrar el directorio i18n. Idem en dev (dist/src) y prod
      // (dist/src), sin depender de la estructura exacta del build.
      path: resolverDirI18n(__dirname),
      watch: process.env.NODE_ENV !== 'production',
    },
    resolvers: [
      new QueryResolver(['lang']),
      new HeaderResolver(['x-lang']),
      AcceptLanguageResolver,
    ],
  }),
  DatabaseModule,
  PersistenceModule,
  CoreModule,
  ApiModule,
  MailModule,
  DashboardModule,
   ...(process.env.SOCKET_ENABLED === 'true' ? [require('./socket/socket.module').SocketModule] : []),
];

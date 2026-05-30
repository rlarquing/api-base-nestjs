# API-NAVECOPA

API RESTful para el sistema de gestión de operaciones portuarias de NAVECOPA, construido con [NestJS](https://nestjs.com/) y TypeScript.

## Stack Tecnológico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| NestJS | 11 | Framework backend |
| TypeScript | 6 | Lenguaje |
| TypeORM | 0.3 | ORM para PostgreSQL |
| PostgreSQL | 16 | Base de datos |
| Passport + JWT | - | Autenticación |
| Swagger | - | Documentación API |
| Nodemailer | - | Envío de emails |
| WebSockets | - | Comunicación en tiempo real |

## Requisitos

- Node.js 20+
- PostgreSQL 16+
- npm

## Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/rlarquing/api-navecopa.git
cd api-navecopa

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Ejecutar migraciones
npm run migration:run

# Iniciar en modo desarrollo
npm run start:dev
```

La API estará disponible en `http://localhost:3000/api/`
La documentación Swagger en `http://localhost:3000/api/docs`

## Variables de Entorno

Crear un archivo `.env` basado en `.env.example`:

| Variable | Default | Descripción |
|----------|---------|-------------|
| `NODE_ENV` | production | Entorno de ejecución |
| `PORT` | 3000 | Puerto del servidor |
| `URL` | http://localhost:3000 | URL base del servidor |
| `SECRET` | - | Clave secreta JWT |
| `CORS` | true | Habilitar CORS |
| `TYPE` | postgres | Tipo de base de datos |
| `SSL` | false | Conexión SSL a la base de datos |
| `DB_HOST` | localhost | Host de PostgreSQL |
| `DB_PORT` | 5432 | Puerto de PostgreSQL |
| `DB_NAME` | - | Nombre de la base de datos |
| `DB_USER` | postgres | Usuario de PostgreSQL |
| `DB_PASS` | postgres | Contraseña de PostgreSQL |
| `DB_SYNC` | false | Sincronizar schema automáticamente |
| `DB_MIGRATIONS_RUN` | true | Ejecutar migraciones al inicio |
| `LOGGER` | true | Habilitar logger |
| `LOGGER_LEVELS` | error,warn,log | Niveles de log |

### Email (opcional)

| Variable | Descripción |
|----------|-------------|
| `EMAIL_SMTP` | Servidor SMTP |
| `EMAIL_PORT` | Puerto SMTP (465) |
| `EMAIL_SECURE` | SSL/TLS (true) |
| `EMAIL_ID` | Email del remitente |
| `EMAIL_PASS` | Contraseña/App Password |
| `EMAIL_FROM` | Dirección de origen |

## Despliegue con Docker

### Arquitectura de Contenedores

```
┌──────────────────────────────────────────────┐
│              navecopa-network                 │
│                                              │
│  ┌─────────┐  ┌─────────┐  ┌──────────────┐ │
│  │   DB    │  │   API   │  │    WEB       │ │
│  │ PG:16   │  │ NestJS  │  │  Next.js     │ │
│  │ :5432   │  │ :3000   │  │  :4000       │ │
│  └─────────┘  └─────────┘  └──────────────┘ │
└──────────────────────────────────────────────┘
```

### Características del Dockerfile

- **Multi-stage build** — Imagen de producción mínima
- **Entrypoint script** — Genera `.env` automáticamente desde las variables de entorno del contenedor
- **Non-root user** — Ejecuta como usuario `node` por seguridad
- **Healthcheck** — Verifica disponibilidad de la API cada 30s
- **Logs persistentes** — Volume para logs del servidor

### Opción 1: API + Base de Datos (recomendado para desarrollo)

```bash
cd api-navecopa

# Configurar variables de entorno
cp .env.example .env
# Editar .env con las configuraciones deseadas

# Construir y levantar
docker compose up -d --build
```

Esto levanta:
- **PostgreSQL** (`navecopa-db`) en puerto 5432
- **API** (`navecopa-api`) en puerto 3000

### Opción 2: Stack Completo (API + Web + DB)

Para levantar todos los servicios juntos, usar el archivo `docker-compose.full.yml`:

```bash
# Clonar ambos repositorios en el mismo directorio
git clone https://github.com/rlarquing/api-navecopa.git
git clone https://github.com/rlarquing/web-navecopa.git

# Desde el directorio padre
docker compose -f api-navecopa/docker-compose.full.yml up -d --build
```

Esto levanta:
- **PostgreSQL** (`navecopa-db`) en puerto 5432
- **API** (`navecopa-api`) en puerto 3000
- **Web** (`navecopa-web`) en puerto 4000

### Opción 3: Solo la imagen Docker

```bash
# Construir imagen
docker build -t navecopa-api .

# Ejecutar contenedor con una base de datos externa
docker run -d \
  --name navecopa-api \
  -p 3000:3000 \
  -e DB_HOST=tu-host-postgres \
  -e DB_NAME=api-navecopa \
  -e DB_USER=postgres \
  -e DB_PASS=tu-password \
  -e SECRET=tu-secreto-jwt \
  navecopa-api
```

### Personalizar Variables en Docker

Puedes personalizar las variables de entorno al levantar los contenedores:

```bash
# Usando variables en el comando
DB_PASS=MiPasswordSeguro SECRET=MiClaveJWT docker compose up -d --build

# O crear un archivo .env en el directorio del proyecto
cat > .env << EOF
DB_NAME=api-navecopa
DB_USER=postgres
DB_PASS=MiPasswordSeguro
SECRET=MiClaveJWT
PORT=3000
EOF

docker compose up -d --build
```

### Verificar el Despliegue

```bash
# Verificar que los contenedores están corriendo
docker compose ps

# Verificar la API
curl http://localhost:3000/api/

# Ver logs del API
docker compose logs -f api

# Ver logs de la base de datos
docker compose logs -f db
```

### Comandos Útiles de Docker

```bash
# Detener todos los servicios
docker compose down

# Detener y eliminar volúmenes (⚠️ pierde datos)
docker compose down -v

# Reconstruir después de cambios
docker compose up -d --build

# Ejecutar migraciones manualmente
docker compose exec api node dist/src/main.js
```

## Estructura del Proyecto

```
api-navecopa/
├── config/              # Configuración de entorno
├── src/
│   ├── api/             # Controladores REST
│   │   └── controller/  # Endpoints de cada entidad
│   ├── core/
│   │   ├── service/     # Servicios de negocio
│   │   ├── entity/      # Entidades TypeORM
│   │   └── dto/         # Data Transfer Objects
│   ├── database/        # Configuración DB y migraciones
│   ├── shared/          # Filtros, guards, interceptors
│   ├── mail/            # Servicio de correo
│   └── app.module.ts    # Módulo principal
├── test/                # Tests e2e
├── Dockerfile           # Multi-stage build optimizado
├── docker-compose.yml   # API + PostgreSQL
├── docker-compose.full.yml # Stack completo (API + Web + DB)
├── docker-entrypoint.sh # Genera .env desde variables de entorno
└── .env.example         # Variables de entorno template
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run start:dev` | Iniciar en modo desarrollo con hot-reload |
| `npm run build` | Compilar TypeScript |
| `npm run start:prod` | Iniciar en producción |
| `npm run migration:run` | Ejecutar migraciones pendientes |
| `npm run migration:generate` | Generar migración nueva |
| `npm run migration:revert` | Revertir última migración |
| `npm run lint` | Verificar código con ESLint |
| `npm run test` | Ejecutar tests unitarios |

## Autor

**Reynelbis Larquin Guerra**

## Licencia

UNLICENSED - Uso privado

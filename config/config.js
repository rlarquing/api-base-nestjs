"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = exports.config = exports.env = void 0;
const fs = __importStar(require("fs"));
const path_1 = require("path");
const app_keys_1 = require("../src/app.keys");
const database_keys_1 = require("../src/database/database.keys");
const defined = (v) => typeof v != 'undefined' && v != '';
const env = (name, default_value) => {
    const envFilePath = (0, path_1.normalize)(`${process.cwd()}/.env`);
    const existsPath = fs.existsSync(envFilePath);
    if (!existsPath) {
        console.log('.env file does not exist');
        process.exit(0);
    }
    let v = process.env[name];
    if (!defined(default_value) && !defined(v)) {
        console.error(`Missing environment variable: "${name}"`);
        process.exit(0);
    }
    if (v === 'true') {
        v = true;
    }
    if (v === 'false') {
        v = false;
    }
    return v ?? default_value;
};
exports.env = env;
const config = () => ({
    port: Number((0, exports.env)(app_keys_1.AppConfig.PORT, 3000)),
    cors: (0, exports.env)(app_keys_1.AppConfig.CORS, true),
    logger: (0, exports.env)(app_keys_1.AppConfig.LOGGER, true),
    database: {
        ssl: (0, exports.env)(app_keys_1.AppConfig.SSL, false),
        type: (0, exports.env)(app_keys_1.AppConfig.TYPE, 'postgres'),
        host: (0, exports.env)(database_keys_1.Configuration.DB_HOST, 'localhost'),
        port: Number((0, exports.env)(database_keys_1.Configuration.DB_PORT, 5432)),
        username: (0, exports.env)(database_keys_1.Configuration.DB_USER, 'postgres'),
        password: (0, exports.env)(database_keys_1.Configuration.DB_PASS, 'postgres'),
        database: (0, exports.env)(database_keys_1.Configuration.DB_NAME),
        synchronize: (0, exports.env)(database_keys_1.Configuration.DB_SYNC, false),
        migrationsRun: (0, exports.env)(database_keys_1.Configuration.DB_MIGRATIONS_RUN, true),
    },
    loggerLevels: (0, exports.env)(app_keys_1.AppConfig.LOGGER_LEVELS).split(',') || [],
});
exports.config = config;
const enviroment = () => {
    const envFilePath = (0, path_1.normalize)(`${process.cwd()}/.env`);
    const fichero = fs.readFileSync(envFilePath, 'utf8');
    let parseo = fichero.split('\r\n');
    parseo = parseo.filter((item) => item != '');
    const objeto = {};
    for (const item of parseo) {
        const tmp = item.split('=');
        objeto[tmp[0]] = tmp[1];
    }
    return objeto;
};
const dataSource = () => enviroment();
exports.dataSource = dataSource;
//# sourceMappingURL=config.js.map
import * as fs from 'fs';
import {normalize} from "path";
import {AppConfig} from "../src/app.keys";
import {Configuration} from "../src/database/database.keys";

const defined = (v) => typeof v != 'undefined' && v != '';
export const env = (name: string, default_value?) => {
    const envFilePath = normalize(`${process.cwd()}/.env`);
    const existsPath = fs.existsSync(envFilePath);
    if (!existsPath) {
        console.log('.env file does not exist');
        process.exit(0);
    }
    let v: any = process.env[name];
    if (!defined(default_value) && !defined(v)) {
        console.error(`Missing environment variable: "${name}"`);
        process.exit(0);
    }
    if (v.toLowerCase() === "true") {
        v = true;
    }
    if (v.toLowerCase() === "false") {
        v = false;
    }

    return v ?? default_value;
};
export const config = () => ({
    port: Number(env(AppConfig.PORT,3000)),
    cors: env(AppConfig.CORS,true),
    logger: env(AppConfig.LOGGER,true),
    database: {
        ssl: env(AppConfig.SSL, false),
        type: env(AppConfig.TYPE,'postgres'),
        host: env(Configuration.DB_HOST,'localhost'),
        port: Number( env(Configuration.DB_PORT,5432)),
        username: env(Configuration.DB_USER, 'postgres'),
        password: env(Configuration.DB_PASS, 'postgres'),
        database: env(Configuration.DB_NAME),
        synchronize: env(Configuration.DB_SYNC, false),
    },
    loggerLevels:  env(AppConfig.LOGGER_LEVELS).split(',') || []
});

import * as fs from 'fs';
import {parse} from 'dotenv';

const defined = (v) => typeof v != 'undefined' && v != '';
let envConfig: { [key: string]: string };
export const env = (name: string, default_value?) => {
    const isDevelopmentEnv = process.env.NODE_ENV !== "production";
    if (isDevelopmentEnv) {
        const envFilePath = __dirname + '/../../config/.env';
        const existsPath = fs.existsSync(envFilePath);
        if (!existsPath) {
            console.log('.env file does not exist');
            process.exit(0);
        }
        envConfig = parse(fs.readFileSync(envFilePath));
    }
    let v: any = envConfig[name];
    if (!defined(default_value) && !defined(v)) {
        console.error(`Missing environment variable: "${name}"`);
        process.exit(0);
        throw new Error(`Missing environment variable: "${name}"`);
    }
    if (v.toLowerCase() === "true") {
        v = true;
    }
    if (v.toLowerCase() === "false") {
        v = false;
    }
    return v ?? default_value;
};

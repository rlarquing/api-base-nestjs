#!/usr/bin/env node
import * as util from 'util';
import {exec as exec0} from 'child_process';
import {AppConfig} from '../src/app.keys';
import {dataSource} from '../config/config';

const exec = util.promisify(exec0);
// Eliminar el argumento 0 y 1 (node y script.js)
const args = process.argv.splice(2);

// Recuperar el primer argumento
const name = args[0];
const migrar = async (): Promise<void> => {
    const {stdout} = await exec(
        `npm run typeorm -- migration:generate ${
            dataSource()[AppConfig.MIGRATION_PATH]
        }/${name}`,
    );
    console.log(stdout);
};
migrar().finally();

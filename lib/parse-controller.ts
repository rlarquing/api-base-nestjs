import {TypescriptParser} from "typescript-parser";
import {CreatePermisoDto} from "../src/security/dto";
import {PermisoService} from "../src/security/service";
import {findElemento} from "./util";

const pathBase = process.cwd() + "\\src\\";
const finder = require("findit")(pathBase);
let dirFiles = [];
finder.on("file", function (file) {
    dirFiles.push(file);
});
export async function parseController(permisoService: PermisoService) {
    const parser = new TypescriptParser();
    let parsed = await parser.parseFile(findElemento(dirFiles, 'generic.controller.ts'), pathBase);
    const metodosGenericos: any[] = parsed.declarations[0]['methods'];
    parsed = await parser.parseFile(findElemento(dirFiles, 'geometric.controller.ts'), pathBase);
    let metodosGeometricos: any[] = parsed.declarations[0]['methods'];
    metodosGeometricos = metodosGeometricos.concat(metodosGenericos);
    let createPermiso: CreatePermisoDto = new CreatePermisoDto();
    let nombrePermiso:string;
    for (const file of dirFiles) {
        if (file.indexOf('controller.ts') !== -1) {
            parsed = await parser.parseFile(file, pathBase);
            const padreGenerico = parsed.usages.includes('GenericController');
            const padreGeometrico = parsed.usages.includes('GeometricController');
            const nombre: string = parsed.declarations[0]['name'];
            const metodos: any[] = parsed.declarations[0]['methods'];
            if (padreGenerico) {
                metodos.concat(metodosGenericos);
            }
            if (padreGeometrico) {
                metodos.concat(metodosGeometricos);
            }
            let servicio: string;
            for (const metodo of metodos) {
                servicio = metodo['name'] + '-' + nombre;
                nombrePermiso=`Puede acceder al servicio ${metodo['name']} en el controller ${nombre}`;
                createPermiso={nombre:nombrePermiso, servicio};
                //await permisoService.create(createPermiso);
            }
        }
    }
}
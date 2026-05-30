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
exports.parseController = parseController;
const util_1 = require("./util");
const path_1 = require("path");
const ts_morph_1 = require("ts-morph");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const project = new ts_morph_1.Project();
project.addSourceFilesAtPaths("**/*.ts");
const pathBase = (0, path_1.normalize)(`${process.cwd()}/src/api/controller`);
let dirFiles = [];
function getFilesWithFullPath(dirPath) {
    return fs.readdirSync(dirPath).filter((file) => {
        return fs.statSync(path.join(dirPath, file)).isFile();
    }).map(file => path.join(dirPath, file));
}
dirFiles = getFilesWithFullPath(pathBase);
function findElementoPorDentro(dirs, className) {
    for (const dir of dirs) {
        const sourceFile = project.getSourceFileOrThrow(dir);
        const classes = sourceFile.getClasses();
        let className1 = '';
        for (const cls of classes) {
            className1 = cls.getName();
        }
        if (className === className1) {
            return dir;
        }
    }
    return -1;
}
function servicioHeredado(dirs, baseClass, className) {
    let resultado = [];
    const metodos = [];
    const dir = findElementoPorDentro(dirs, baseClass);
    if (dir !== -1) {
        let rutaController = '$generic';
        const sourceFile = project.getSourceFileOrThrow(dir);
        const classes = sourceFile.getClasses();
        let baseClass1;
        let className1;
        for (const cls of classes) {
            const methods = cls.getMethods();
            baseClass1 = cls.getBaseClass();
            className1 = cls.getName();
            const decorator = cls.getDecorators().find((item) => item.getName() === 'Controller');
            if (decorator) {
                const decoratorArgument = decorator.getArguments()[0];
                rutaController = decoratorArgument.getText().replace(/'/g, '');
            }
            for (const method of methods) {
                const decorators = method.getDecorators();
                for (const decorator of decorators) {
                    const decoratorName = decorator.getName();
                    if (['Get', 'Post', 'Patch', 'Delete', 'Put'].includes(decoratorName)) {
                        const decoratorArguments = decorator.getArguments();
                        for (const argument of decoratorArguments) {
                            const argumento = argument.getText().replace(/'/g, '');
                            switch (decoratorName) {
                                case 'Get':
                                    metodos.push({
                                        servicio: method.getName(),
                                        ruta: `/${rutaController}${argumento}`,
                                        className,
                                        metodo: decoratorName,
                                    });
                                    break;
                                case 'Post':
                                    metodos.push({
                                        servicio: method.getName(),
                                        ruta: `/${rutaController}${argumento}`,
                                        className,
                                        metodo: decoratorName,
                                    });
                                    break;
                                case 'Patch':
                                    metodos.push({
                                        servicio: method.getName(),
                                        ruta: `/${rutaController}${argumento}`,
                                        className,
                                        metodo: decoratorName,
                                    });
                                    break;
                                case 'Delete':
                                    metodos.push({
                                        servicio: method.getName(),
                                        ruta: `/${rutaController}${argumento}`,
                                        className,
                                        metodo: decoratorName,
                                    });
                                    break;
                                case 'Put':
                                    metodos.push({
                                        servicio: method.getName(),
                                        ruta: `/${rutaController}${argumento}`,
                                        className,
                                        metodo: decoratorName,
                                    });
                                    break;
                            }
                        }
                    }
                }
            }
        }
        if (baseClass1) {
            resultado = resultado.concat(metodos);
            return resultado.concat(servicioHeredado(dirs, baseClass1.getName(), className1));
        }
        else {
            resultado = resultado.concat(metodos);
            return resultado;
        }
    }
    return resultado;
}
async function buscarServicios() {
    const resultado = new Map();
    let nombre;
    let controller;
    const controladores = [];
    for (const file of dirFiles) {
        if (file.indexOf('.controller.ts') !== -1) {
            controladores.push(file);
        }
    }
    for (const controlador of controladores) {
        const sourceFile = project.getSourceFileOrThrow(controlador);
        const classes = sourceFile.getClasses();
        let metodos = [];
        let rutaController = '';
        let className = '';
        for (const cls of classes) {
            const methods = cls.getMethods();
            const baseClass = cls.getBaseClass();
            className = cls.getName();
            if (baseClass) {
                metodos = servicioHeredado(controladores, baseClass.getName(), className);
            }
            const decorator = cls.getDecorators().find((item) => item.getName() === 'Controller');
            if (decorator) {
                const decoratorArgument = decorator.getArguments()[0];
                rutaController = decoratorArgument.getText().replace(/'/g, '');
            }
            for (const method of methods) {
                const decorators = method.getDecorators();
                for (const decorator of decorators) {
                    const decoratorName = decorator.getName();
                    if (['Get', 'Post', 'Patch', 'Delete', 'Put'].includes(decoratorName)) {
                        const decoratorArguments = decorator.getArguments();
                        for (const argument of decoratorArguments) {
                            const argumento = argument.getText().replace(/'/g, '');
                            switch (decoratorName) {
                                case 'Get':
                                    metodos.push({
                                        servicio: method.getName(),
                                        ruta: `/${rutaController}${argumento}`,
                                        className,
                                        metodo: decoratorName,
                                    });
                                    break;
                                case 'Post':
                                    metodos.push({
                                        servicio: method.getName(),
                                        ruta: `/${rutaController}${argumento}`,
                                        className,
                                        metodo: decoratorName,
                                    });
                                    break;
                                case 'Patch':
                                    metodos.push({
                                        servicio: method.getName(),
                                        ruta: `/${rutaController}${argumento}`,
                                        className,
                                        metodo: decoratorName,
                                    });
                                    break;
                                case 'Delete':
                                    metodos.push({
                                        servicio: method.getName(),
                                        ruta: `/${rutaController}${argumento}`,
                                        className,
                                        metodo: decoratorName,
                                    });
                                    break;
                                case 'Put':
                                    metodos.push({
                                        servicio: method.getName(),
                                        ruta: `/${rutaController}${argumento}`,
                                        className,
                                        metodo: decoratorName,
                                    });
                                    break;
                            }
                        }
                    }
                }
            }
        }
        if (className !== 'GenericController' &&
            className !== 'GenericImportacionController' &&
            className !== 'GeometricController') {
            for (const metodo of metodos) {
                let ruta = '';
                if (metodo.ruta.split('/')[1] === '$generic') {
                    ruta = metodo.ruta.replace('$generic', rutaController);
                }
                else {
                    ruta = metodo.ruta;
                }
                const analisisRuta = ruta.split('/');
                const rutaArreglada = [];
                for (let item of analisisRuta) {
                    if (item.includes(':')) {
                        item = item.replace(':', '{') + '}';
                        rutaArreglada.push(item);
                    }
                    else {
                        rutaArreglada.push(item);
                    }
                }
                ruta = rutaArreglada.join('/');
                controller = (0, util_1.eliminarSufijo)(className, 'Controller');
                if (controller === 'GenericNomenclador') {
                    controller = 'Nomenclador';
                }
                nombre = `Acceso a ${controller} -> ${metodo.servicio}`;
                resultado.set(nombre, {
                    controller: (0, util_1.aInicialMinuscula)(controller),
                    ruta,
                    nombre,
                    servicio: metodo.servicio,
                    metodo: metodo.metodo,
                });
            }
        }
    }
    return resultado;
}
async function parseController(endPointService) {
    const serviciosRegistrados = await endPointService.findAll();
    const serviciosEncontrados = await buscarServicios();
    if (serviciosRegistrados.length === 0) {
        for (const serviciosEncontrado of serviciosEncontrados.values()) {
            await endPointService.create(serviciosEncontrado);
        }
    }
    else {
        for (const encontrado of serviciosEncontrados.values()) {
            if ((0, util_1.findElemento)(serviciosRegistrados, encontrado.nombre) === -1) {
                await endPointService.create(encontrado);
            }
        }
        for (const registrado of serviciosRegistrados) {
            if (!serviciosEncontrados.has(registrado)) {
                await endPointService.remove(registrado);
            }
        }
        for (const encontrado of serviciosEncontrados.values()) {
            if ((0, util_1.findElemento)(serviciosRegistrados, encontrado.nombre) !== -1) {
                await endPointService.update(encontrado);
            }
        }
    }
}
//# sourceMappingURL=parse-controller.js.map
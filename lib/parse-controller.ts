import { eliminarSufijo, findElemento } from './util';
import * as ts from 'typescript';
import * as fs from 'fs';
import { normalize } from 'path';

import * as findit from 'findit';
import {CreateEndPointDto} from "../src/security/dto";
import {EndPointService} from "../src/security/service";

const pathBase = normalize(`${process.cwd()}/src`);
const finder = findit(pathBase);
const dirFiles = [];
finder.on('file', function (file) {
  dirFiles.push(file);
});
function findElementoPorDentro(dirs: string[], className: string): any {
  for (const dir of dirs) {
    const node = ts.createSourceFile(
        'x.ts',
        fs.readFileSync(dir, 'utf8'),
        ts.ScriptTarget.Latest,
    );
    let classDecl;
    node.forEachChild((child) => {
      if (ts.SyntaxKind[child.kind] === 'ClassDeclaration') {
        classDecl = child;
      }
    });
    if (className === classDecl.name.escapedText) {
      return dir;
    }
  }
  return -1;
}
function servicioHeredado(dirs: string[], className: string): string[] {
  let resultado: string[] = [];
  const metodos: string[] = [];
  const decoradores: string[] = [];
  const dir = findElementoPorDentro(dirs, className);
  if (dir !== -1) {
    const node = ts.createSourceFile(
        'x.ts', // fileName
        fs.readFileSync(dir, 'utf8'), // sourceText
        ts.ScriptTarget.Latest, // langugeVersion
    );
    let classDecl;
    node.forEachChild((child) => {
      if (ts.SyntaxKind[child.kind] === 'ClassDeclaration') {
        classDecl = child;
      }
    });
    if (classDecl.heritageClauses !== undefined) {
      const padre =
          classDecl.heritageClauses[0].types[0].expression.escapedText;
      if (padre === 'IController') {
        classDecl.members.forEach((member) => {
          if (member.decorators) {
            member.decorators.forEach((decorator) => {
              decoradores.push(decorator.expression.expression.escapedText);
            });
          }
          if (member.name && decoradores.includes('Servicio')) {
            metodos.push(member.name.escapedText);
          }
        });
        resultado = resultado.concat(metodos);
        return resultado;
      } else {
        classDecl.members.forEach((member) => {
          if (member.decorators) {
            member.decorators.forEach((decorator) => {
              decoradores.push(decorator.expression.expression.escapedText);
            });
          }
          if (member.name && decoradores.includes('Servicio')) {
            metodos.push(member.name.escapedText);
          }
        });
        resultado = resultado.concat(metodos);
        return resultado.concat(servicioHeredado(dirs, padre));
      }
    }
  }
  return resultado;
}
async function buscarServicios(): Promise<Map<string, CreateEndPointDto>> {
  const resultado: Map<string, CreateEndPointDto> = new Map<
      string,
      CreateEndPointDto
      >();
  let nombre: string;
  let servicio: string;
  let controller: string;
  let ruta: string;
  const controladores: string[] = [];
  for (const file of dirFiles) {
    if (file.indexOf('.controller.ts') !== -1) {
      controladores.push(file);
    }
  }
  for (const controlador of controladores) {
    const node = ts.createSourceFile(
        'x.ts', // fileName
        fs.readFileSync(controlador, 'utf8'), // sourceText
        ts.ScriptTarget.Latest, // langugeVersion
    );
    let classDecl;
    node.forEachChild((child) => {
      if (ts.SyntaxKind[child.kind] === 'ClassDeclaration') {
        classDecl = child;
      }
    });
    let metodos: string[] = [];
    let decoradores: string[] = [];
    const className = classDecl.name.escapedText;
    if (classDecl.heritageClauses) {
      const padre =
          classDecl.heritageClauses[0].types[0].expression.escapedText;
      metodos = servicioHeredado(controladores, padre);
    }
    classDecl.members.forEach((member) => {
      if (member.decorators) {
        member.decorators.forEach((decorator) => {
          decoradores.push(decorator.expression.expression.escapedText);
        });
      }
      if (member.name && decoradores.includes('Servicio')) {
        metodos.push(member.name.escapedText);
      }
      decoradores = [];
    });
    if (
        className !== 'GenericController' &&
        className !== 'GeometricController'
    ) {
      for (const metodo of metodos) {
        servicio = metodo;
        controller = eliminarSufijo(className, 'Controller');
        nombre = `Acceso a ${eliminarSufijo(
            className,
            'Controller',
        )} -> ${metodo}`;
        resultado.set(servicio, {
          controller,
          ruta,
          nombre,
          servicio,
        });
      }
    }
  }
  return resultado;
}
export async function parseController(endPointService: EndPointService) {
  const serviciosRegistrados: string[] = await endPointService.findAll();
  // var importDecl;
  // node.forEachChild(child => {
  //     if (ts.SyntaxKind[child.kind] === 'ImportDeclaration') {
  //         importDecl = child;
  //     }
  // });
  // let a=importDecl.importClause.namedBindings.elements.map(
  //     el => el.name.escapedText
  // );
  //let decorador=classDecl.decorators[0].expression.expression.escapedText;
  //console.log(metodos);
  const serviciosEncontrados: Map<string, CreateEndPointDto> =
      await buscarServicios();
  if (serviciosRegistrados.length === 0) {
    for (const serviciosEncontrado of serviciosEncontrados.values()) {
      await endPointService.create(serviciosEncontrado);
    }
  } else {
    for (const encontrado of serviciosEncontrados.values()) {
      if (findElemento(serviciosRegistrados, encontrado.servicio) === -1) {
        // el elemento está en la lista y no está en la bd
        await endPointService.create(encontrado);
      }
    }
    for (const registrado of serviciosRegistrados) {
      if (!serviciosEncontrados.has(registrado)) {
        // el elemento está en la bd y no está en la lista
        await endPointService.remove(registrado);
      }
    }
    for (const encontrado of serviciosEncontrados.values()) {
      if (findElemento(serviciosRegistrados, encontrado.servicio) !== -1) {
        await endPointService.update(encontrado.servicio, encontrado.nombre);
      }
    }
  }
}

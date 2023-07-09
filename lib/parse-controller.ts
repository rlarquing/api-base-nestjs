import { aInicialMinuscula, eliminarSufijo, findElemento } from './util';
import * as ts from 'typescript';
import * as fs from 'fs';
import { normalize } from 'path';
import * as findit from 'findit';
import { CreateEndPointDto } from '../src/shared/dto';
import { EndPointService } from '../src/core/service';

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
  const metodos: any[] = [];
  const decoradores: string[] = [];
  const dir = findElementoPorDentro(dirs, className);
  if (dir !== -1) {
    const node = ts.createSourceFile(
      'x.ts', // fileName
      fs.readFileSync(dir, 'utf8'), // sourceText
      ts.ScriptTarget.Latest, // langugeVersion
    );
    let classDecl;
    let rutaController = '$generic';
    if (node.text.includes('@Controller(')) {
      rutaController = node.text.substring(
        node.text.indexOf('@Controller(') + 13,
        node.text.indexOf('export class'),
      );
    }
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
          if (member.modifiers) {
            member.modifiers.forEach((decorator) => {
              if (decorator.expression){
              decoradores.push(decorator.expression.expression.escapedText);
              decorator.expression.arguments.forEach((arg) => {
                const temporal = rutaController.substring(
                  0,
                  rutaController.indexOf(`')`),
                );
                if (temporal.length > 0) {
                  rutaController = temporal;
                }
                switch (decorator.expression.expression.escapedText) {
                  case 'Get':
                    metodos.push({
                      servicio: member.name.escapedText,
                      ruta: `/${rutaController}${arg.text}`,
                      className,
                      metodo: decorator.expression.expression.escapedText,
                    });
                    break;
                  case 'Post':
                    metodos.push({
                      servicio: member.name.escapedText,
                      ruta: `/${rutaController}${arg.text}`,
                      className,
                      metodo: decorator.expression.expression.escapedText,
                    });
                    break;
                  case 'Patch':
                    metodos.push({
                      servicio: member.name.escapedText,
                      ruta: `/${rutaController}${arg.text}`,
                      className,
                      metodo: decorator.expression.expression.escapedText,
                    });
                    break;
                  case 'Delete':
                    metodos.push({
                      servicio: member.name.escapedText,
                      ruta: `/${rutaController}${arg.text}`,
                      className,
                      metodo: decorator.expression.expression.escapedText,
                    });
                    break;
                  case 'Put':
                    metodos.push({
                      servicio: member.name.escapedText,
                      ruta: `/${rutaController}${arg.text}`,
                      className,
                      metodo: decorator.expression.expression.escapedText,
                    });
                    break;
                }
              });
            }});
          }
        });
        resultado = resultado.concat(metodos);
        return resultado;
      } else {
        classDecl.members.forEach((member) => {
          if (member.modifiers) {
            member.modifiers.forEach((decorator) => {
              decoradores.push(decorator.expression.expression.escapedText);
              decorator.expression.arguments.forEach((arg) => {
                const temporal = rutaController.substring(
                  0,
                  rutaController.indexOf(`')`),
                );
                if (temporal.length > 0) {
                  rutaController = temporal;
                }
                switch (decorator.expression.expression.escapedText) {
                  case 'Get':
                    metodos.push({
                      servicio: member.name.escapedText,
                      ruta: `/${rutaController}${arg.text}`,
                      className,
                      metodo: decorator.expression.expression.escapedText,
                    });
                    break;
                  case 'Post':
                    metodos.push({
                      servicio: member.name.escapedText,
                      ruta: `/${rutaController}${arg.text}`,
                      className,
                      metodo: decorator.expression.expression.escapedText,
                    });
                    break;
                  case 'Patch':
                    metodos.push({
                      servicio: member.name.escapedText,
                      ruta: `/${rutaController}${arg.text}`,
                      className,
                      metodo: decorator.expression.expression.escapedText,
                    });
                    break;
                  case 'Delete':
                    metodos.push({
                      servicio: member.name.escapedText,
                      ruta: `/${rutaController}${arg.text}`,
                      className,
                      metodo: decorator.expression.expression.escapedText,
                    });
                    break;
                  case 'Put':
                    metodos.push({
                      servicio: member.name.escapedText,
                      ruta: `/${rutaController}${arg.text}`,
                      className,
                      metodo: decorator.expression.expression.escapedText,
                    });
                    break;
                }
              });
            });
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
  let controller: string;
  const controladores: string[] = [];
  let rutaController = '';
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
    if (node.text.includes('@Controller(')) {
      rutaController = node.text.substring(
        node.text.indexOf('@Controller(') + 13,
        node.text.indexOf('export class'),
      );
    }

    node.forEachChild((child) => {
      if (ts.SyntaxKind[child.kind] === 'ClassDeclaration') {
        classDecl = child;
      }
    });
    let metodos: any[] = [];
    let decoradores: string[] = [];
    const className = classDecl.name.escapedText;
    if (classDecl.heritageClauses) {
      const padre =
        classDecl.heritageClauses[0].types[0].expression.escapedText;
      metodos = servicioHeredado(controladores, padre);
    }
    classDecl.members.forEach((member) => {
      if (member.modifiers) {
        member.modifiers.forEach((decorator) => {
        if(decorator.expression){
          decoradores.push(decorator.expression.expression.escapedText);
          decorator.expression.arguments.forEach((arg) => {
            const temporal = rutaController.substring(
              0,
              rutaController.indexOf(`')`),
            );
            if (temporal.length > 0) {
              rutaController = temporal;
            }
            switch (decorator.expression.expression.escapedText) {
              case 'Get':
                metodos.push({
                  servicio: member.name.escapedText,
                  ruta: `/${rutaController}${arg.text}`,
                  className,
                  metodo: decorator.expression.expression.escapedText,
                });
                break;
              case 'Post':
                metodos.push({
                  servicio: member.name.escapedText,
                  ruta: `/${rutaController}${arg.text}`,
                  className,
                  metodo: decorator.expression.expression.escapedText,
                });
                break;
              case 'Patch':
                metodos.push({
                  servicio: member.name.escapedText,
                  ruta: `/${rutaController}${arg.text}`,
                  className,
                  metodo: decorator.expression.expression.escapedText,
                });
                break;
              case 'Delete':
                metodos.push({
                  servicio: member.name.escapedText,
                  ruta: `/${rutaController}${arg.text}`,
                  className,
                  metodo: decorator.expression.expression.escapedText,
                });
                break;
              case 'Put':
                metodos.push({
                  servicio: member.name.escapedText,
                  ruta: `${rutaController}/${arg.text}`,
                  className,
                  metodo: decorator.expression.expression.escapedText,
                });

                break;
            }
          });
        }});
      }
      decoradores = [];
    });
    if (
      className !== 'GenericController' &&
      className !== 'GenericImportacionController' &&
      className !== 'GeometricController'
    ) {
      for (const metodo of metodos) {
        let ruta = '';
        if (metodo.ruta.split('/')[1] === '$generic') {
          ruta = metodo.ruta.replace('$generic', rutaController);
        } else {
          ruta = metodo.ruta;
        }
        const analisisRuta: string[] = ruta.split('/');
        const rutaArreglada: string[] = [];
        for (let item of analisisRuta) {
          if (item.includes(':')) {
            item = item.replace(':', '{') + '}';
            rutaArreglada.push(item);
          } else {
            rutaArreglada.push(item);
          }
        }
        ruta = rutaArreglada.join('/');
        controller = eliminarSufijo(className, 'Controller');
        if (controller === 'GenericNomenclador') {
          controller = 'Nomenclador';
        }
        nombre = `Acceso a ${controller} -> ${metodo.servicio}`;

        resultado.set(nombre, {
          controller: aInicialMinuscula(controller),
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
  //let decorador=classDecl.modifiers[0].expression.expression.escapedText;
  //console.log(metodos);
  const serviciosEncontrados: Map<string, CreateEndPointDto> =
    await buscarServicios();
  if (serviciosRegistrados.length === 0) {
    for (const serviciosEncontrado of serviciosEncontrados.values()) {
      await endPointService.create(serviciosEncontrado);
    }
  } else {
    for (const encontrado of serviciosEncontrados.values()) {
      if (findElemento(serviciosRegistrados, encontrado.nombre) === -1) {
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
      if (findElemento(serviciosRegistrados, encontrado.nombre) !== -1) {
        await endPointService.update(encontrado);
      }
    }
  }
}

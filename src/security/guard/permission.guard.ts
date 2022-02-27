import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { quitarSeparador } from '../../../lib';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let permiso: string = this.reflector.get<string>(
      'servicio',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    if (!permiso) {
      return true;
    }
    if (permiso.includes('undefined')) {
      const funcionalidad = permiso.split('.')[1];
      const ruta: string[] = request.route.path
        .split(`/`)
        .filter((path) => path !== '');
      let controlador = ruta[1];
      controlador = quitarSeparador(controlador, '-') + 'Controller';

      permiso = controlador + '.' + funcionalidad;
    }

    const {
      user,
      headers: { authorization },
    } = request;
    const permisos: string[] = await this.jwt.verify(
      authorization.split(' ')[1],
    ).permisos;
    const hasPermiso = () => {
      return permisos.includes(permiso);
    };
    return user && hasPermiso();
  }
}

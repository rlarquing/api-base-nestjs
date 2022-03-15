import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { aInicialMinuscula, quitarSeparador } from '../../../lib';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let endPoint: string = this.reflector.get<string>(
      'servicio',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    if (!endPoint) {
      return true;
    }
    if (endPoint.includes('undefined')) {
      const funcionalidad = endPoint.split('.')[1];
      const ruta: string[] = request.route.path
        .split(`/`)
        .filter((path) => path !== '');
      let controlador = ruta[1];
      controlador = aInicialMinuscula(quitarSeparador(controlador, '-'));

      endPoint = controlador + '.' + funcionalidad;
    }

    const {
      user,
      headers: { authorization },
    } = request;
    const endPoints: string[] = await this.jwt.verify(
      authorization.split(' ')[1],
    ).endPoints;
    const hasEndPoint = () => {
      return endPoints.includes(endPoint);
    };
    return user && hasEndPoint();
  }
}

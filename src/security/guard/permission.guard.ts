import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from "@nestjs/core";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwt: JwtService
    ) {
    }
    async canActivate(
        context: ExecutionContext
    ): Promise<boolean> {
        let permiso: string = this.reflector.get<string>(
            'servicio',
            context.getHandler());
        if (!permiso) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const {user, headers: {authorization}} = request;
        const permisos: string[] = await this.jwt.verify(authorization.split(' ')[1]).permisos;
        const hasPermiso = () => permisos.includes(permiso);
        return user && hasPermiso();
    }
}

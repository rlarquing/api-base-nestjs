import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from "@nestjs/core";
import {RolEntity} from "../entity/rol.entity";

@Injectable()
export class RolGuard implements CanActivate {
  constructor(private readonly reflector: Reflector){}
  canActivate(
    context: ExecutionContext,
  ): boolean  {
    let roles: string[] = this.reflector.get<string[]>(
      'roles',
       context.getHandler());

       if(!roles){
        return true;
       }
       const request = context.switchToHttp().getRequest();
       const {user}= request;
       const hasRole = () => user.roles.some((rol: RolEntity)=> roles.includes(rol.nombre));
      console.log(hasRole());
       return user && user.roles && hasRole();
  }
}

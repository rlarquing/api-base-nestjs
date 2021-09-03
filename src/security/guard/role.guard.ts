import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from "@nestjs/core";
import { strict } from 'assert';
import {RoleEntity} from "../entity/role.entity";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector,

              ){

  }
  canActivate(
    context: ExecutionContext,
  ): boolean  {
    const roles: string[] = this.reflector.get<string[]>(
      'roles',
       context.getHandler());
       if(!roles){
        return true;
       }
       const request = context.switchToHttp().getRequest();
       const {user}= request;
       const hasRole = () => user.roles.some((role: RoleEntity)=> roles.includes(role.nombre))
       return user && user.roles && hasRole();
  }
}

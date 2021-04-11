import {IsNumber, IsEmail, IsString, IsOptional, IsNotEmpty} from 'class-validator';
import {ReadRoleDto} from "./read-role.dto";

export class ReadUserDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsOptional()
  readonly email: string;

  @IsNotEmpty()
  readonly roles: ReadRoleDto[]

  constructor(id: number, username: string, email: string, roles: ReadRoleDto[]) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.roles = roles;
  }
}

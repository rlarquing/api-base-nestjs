import {IsNumber, IsEmail, IsString, IsOptional, IsNotEmpty} from 'class-validator';
import {ReadRoleDto} from "./read-role.dto";

export class ReadUserDto {
  @IsNumber()
  readonly id: number;

  @IsEmail()
  @IsOptional()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly roles: ReadRoleDto[]

  constructor(id: number, email: string, username: string, roles: ReadRoleDto[]) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.roles = roles;
  }
}

import {IsNumber, IsEmail, IsString, IsOptional, IsNotEmpty} from 'class-validator';
import {ReadRoleDto} from "./read-role.dto";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class ReadUserDto {

  @IsNumber()
  @ApiProperty({description: 'id del usuario.', example: 1})
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Nombre del usuario.', example: 'juan'})
  username: string;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({description: 'Email del usuario.', example: 'juan@camaguey.geocuba.cu'})
  email: string;

  @IsNotEmpty()
  @ApiProperty({description: 'Roles del usuario.', type: [ReadRoleDto]})
  roles: ReadRoleDto[]

  constructor(id: number, username: string, email: string, roles: ReadRoleDto[]) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.roles = roles;
  }
}

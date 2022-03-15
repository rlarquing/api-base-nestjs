import {
  IsNumber,
  IsEmail,
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { ReadRolDto } from './read-rol.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReadFuncionDto } from './read-funcion.dto';

export class ReadUserDto {
  @IsString({ message: 'El dtoToString debe de ser un string' })
  dtoToString: string;

  @IsNumber()
  @ApiProperty({ description: 'id del usuario.', example: 1 })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Nombre del usuario.', example: 'juan' })
  username: string;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Email del usuario.',
    example: 'juan@camaguey.geocuba.cu',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Roles del usuario.', type: [ReadRolDto] })
  roles: ReadRolDto[];

  @IsNotEmpty()
  @ApiProperty({
    description: 'Funciones del usuario.',
    type: [ReadFuncionDto],
  })
  funcions: ReadFuncionDto[];

  constructor(
    dtoToString: string,
    id: number,
    username: string,
    email: string,
    roles: ReadRolDto[],
    funcions: ReadFuncionDto[],
  ) {
    this.dtoToString = dtoToString;
    this.id = id;
    this.username = username;
    this.email = email;
    this.roles = roles;
    this.funcions = funcions;
  }
}

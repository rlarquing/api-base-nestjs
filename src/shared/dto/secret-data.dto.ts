import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReadFuncionDto } from './read-funcion.dto';
import { ReadMenuDto } from './read-menu.dto';

export class SecretDataDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nombre del usuario.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1YW4iLCJpYXQiOjE2Mjg4NTY5MzAsImV4cCI6MTYyODg2MDUzMH0.Ayxt1eCbRKbx7ya1QkZAjAHMWKWNL2BCZdqOHKVbb0g',
  })
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nombre del usuario.',
    example: 'OCbvl7fnhhzg5KVm',
  })
  refreshToken: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Funciones del usuario.',
    example: [ReadFuncionDto],
  })
  functions: ReadFuncionDto[];

  @IsNotEmpty()
  @ApiProperty({
    description: 'Menu del usuario.',
    example: [ReadMenuDto],
  })
  menus: ReadMenuDto[];
}

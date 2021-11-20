import { ReproyectarDto } from './reproyectar.dto';
import { IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TypeDto {
  @IsArray({ message: 'El atributo debe de ser un arreglo' })
  @IsOptional()
  @ApiProperty({ description: 'Exclución de atributos', example: [] })
  exclude: string[];

  @ApiProperty({
    description: 'Reproyectar la geometríaa',
    example: ReproyectarDto,
  })
  reproyectar: ReproyectarDto;
}

import { ReadRolDto } from './read-rol.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReadFuncionDto } from './read-funcion.dto';

export class ReadUserDto {
  dtoToString: string;

  @ApiProperty({ description: 'id del usuario.', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nombre del usuario.', example: 'juan' })
  username: string;

  @ApiPropertyOptional({
    description: 'Email del usuario.',
    example: 'juan@camaguey.geocuba.cu',
  })
  email: string;

  @ApiProperty({ description: 'Roles del usuario.', type: [ReadRolDto] })
  roles: ReadRolDto[];

  @ApiProperty({
    description: 'Funciones del usuario.',
    type: [ReadFuncionDto],
  })
  funcions: ReadFuncionDto[];
}

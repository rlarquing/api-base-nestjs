import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListadoDto {
  @IsArray()
  @ApiProperty({ description: 'Header.', example: [] })
  header: string[];

  @IsArray()
  @ApiProperty({ description: 'Llaves.', example: [] })
  key: string[];

  @IsNotEmpty()
  @ApiProperty({
    description: 'Datos que se mostrarán.',
    example: {
      data: [{}],
      meta: {
        itemsPerPage: 1,
        totalItems: 1,
        currentPage: 10,
        totalPages: 1,
        sortBy: [['id', 'ASC']],
      },
      links: {
        first: '',
        previous: '',
        current: '',
        next: '',
        last: '',
      },
    },
  })
  data: object;

  constructor(header: string[], key: string[], data: object) {
    this.header = header;
    this.key = key;
    this.data = data;
  }
}

import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HISTORY_ACTION } from '../../persistence/entity/log-history.entity';

export class LogHistoryDto {
  @IsNumber()
  @ApiProperty({ description: 'id de la traza.', example: 1 })
  id: number;

  @IsString()
  @ApiProperty({ description: 'Nombre del usuario.', example: 'Juan' })
  user: string;

  @IsDate()
  @ApiProperty({
    description: 'Fecha de la traza.',
    example: '2021-04-26 15:02:16.21585',
  })
  date: Date;

  @IsString()
  @ApiProperty({
    description: 'Nombre del modelo que se modifico.',
    example: 'RoleEntity',
  })
  model: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Datos que se introducieron.' })
  data: object;

  @IsNotEmpty()
  @ApiProperty({ description: 'Acción que se realizó.', example: 'ADD' })
  action: HISTORY_ACTION;

  @IsNumber()
  @ApiProperty({
    description: 'Numero de registro que se modifico.',
    example: '1',
  })
  record: number;

  constructor(
    id: number,
    user: string,
    date: Date,
    model: string,
    data: object,
    action: HISTORY_ACTION,
    record: number,
  ) {
    this.id = id;
    this.user = user;
    this.date = date;
    this.model = model;
    this.data = data;
    this.action = action;
    this.record = record;
  }
}

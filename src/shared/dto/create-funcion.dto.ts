import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFuncionDto {
  @IsNotEmpty()
  @IsString({ message: 'El atributo nombre debe ser un strings' })
  @ApiProperty({
    description: 'Aquí escriba una descripción para el atributo nombre',
    example: 'Aquí una muestra para ese atributo',
  })
  nombre: string;
  @IsNotEmpty()
  @IsString({ message: 'El atributo descripcion debe ser un texto' })
  @ApiProperty({
    description: 'Aquí escriba una descripción para el atributo descripcion',
    example: 'Aquí una muestra para ese atributo',
  })
  descripcion: string;
  @IsArray({ message: 'El atributo endPoints debe de ser un arreglo' })
  @ApiProperty({
    description: 'Aquí escriba una descripción para el atributo endPoints',
    example: 'Aquí una muestra para ese atributo',
  })
  endPoints: number[];

  @IsOptional()
  @ApiProperty({
    description: 'Aquí escriba una descripción para el atributo menu',
    example: 'Aquí una muestra para ese atributo',
  })
  menu?: number;
}

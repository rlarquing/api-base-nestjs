import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { GenericEntity } from './generic.entity';
import { SchemaEnum } from '../../database/schema/schema.enum';
import { FuncionEntity } from './funcion.entity';
import { IdiomaEntity } from './idioma.entity';

@Entity('funcion_traduccion', {
  schema: SchemaEnum.MOD_AUTH,
  orderBy: { id: 'ASC' },
})
@Index('UQ_funcion_traduccion_funcion_idioma', ['funcion', 'idioma'], {
  unique: true,
  where: '"activo" = true',
})
export class FuncionTraduccionEntity extends GenericEntity {
  @ManyToOne(() => FuncionEntity, (funcion) => funcion.traducciones, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'funcion_id' })
  funcion!: FuncionEntity;

  @ManyToOne(() => IdiomaEntity, (idioma) => idioma.funcionTraducciones, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'idioma_id' })
  idioma!: IdiomaEntity;

  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: false,
    name: 'nombre',
  })
  nombre!: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: true,
    name: 'descripcion',
  })
  descripcion?: string;

  constructor(
    funcion: FuncionEntity,
    idioma: IdiomaEntity,
    nombre: string,
    descripcion?: string,
  ) {
    super();
    this.funcion = funcion;
    this.idioma = idioma;
    this.nombre = nombre;
    this.descripcion = descripcion;
  }

  public toString(): string {
    return this.nombre;
  }
}

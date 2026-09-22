import { Column, Entity, Index, OneToMany } from 'typeorm';
import { GenericEntity } from './generic.entity';
import { SchemaEnum } from '../../database/schema/schema.enum';
import { MenuTraduccionEntity } from './menu-traduccion.entity';
import { FuncionTraduccionEntity } from './funcion-traduccion.entity';

@Entity('idioma', { schema: SchemaEnum.PUBLIC, orderBy: { id: 'ASC' } })
@Index('UQ_idioma_codigo', ['codigo'], {
  unique: true,
  where: '"activo" = true',
})
export class IdiomaEntity extends GenericEntity {
  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    name: 'codigo',
  })
  codigo!: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: false,
    name: 'nombre',
  })
  nombre!: string;

  @Column({
    type: 'boolean',
    default: false,
    name: 'defecto',
  })
  defecto!: boolean;

  @OneToMany(() => MenuTraduccionEntity, (traduccion) => traduccion.idioma)
  menuTraducciones!: MenuTraduccionEntity[];

  @OneToMany(() => FuncionTraduccionEntity, (traduccion) => traduccion.idioma)
  funcionTraducciones!: FuncionTraduccionEntity[];

  constructor(codigo: string, nombre: string, defecto = false) {
    super();
    this.codigo = codigo;
    this.nombre = nombre;
    this.defecto = defecto;
  }

  public toString(): string {
    return this.nombre;
  }
}

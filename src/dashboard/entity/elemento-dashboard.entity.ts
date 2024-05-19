import { Column, Entity } from 'typeorm';
import { SchemaEnum } from '../../database/schema/schema.enum';
import {GenericEntity} from "../../persistence/entity";

@Entity('elemento_dashboard', {
  schema: SchemaEnum.PUBLIC,
  orderBy: { id: 'ASC' },
})
export class ElementoDashboardEntity extends GenericEntity {
  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: false,
    name: 'nombre',
  })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: false,
    name: 'tipo',
  })
  tipo: string;

  @Column({ type: 'jsonb', nullable: true })
  capa: object;

  @Column({ type: 'jsonb', nullable: true })
  consulta: object;

  constructor(nombre: string, tipo: string, capa: object, consulta: object) {
    super();
    this.nombre = nombre;
    this.tipo = tipo;
    this.capa = capa;
    this.consulta = consulta;
  }
  public toString(): string {
    return `${this.nombre}`;
  }
}

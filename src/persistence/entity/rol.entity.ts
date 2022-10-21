import {
  Entity,
  ManyToMany,
  JoinColumn,
  JoinTable,
  Column,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { FuncionEntity } from './funcion.entity';
import { SchemaEnum } from '../../database/schema/schema.enum';
import { GenericEntity } from './generic.entity';

@Entity('rol', { schema: SchemaEnum.MOD_AUTH, orderBy: { id: 'ASC' } })
export class RolEntity extends GenericEntity {
  @Column({ type: 'varchar', unique: true, length: 255, nullable: false })
  nombre: string;

  @Column({ type: 'text', nullable: false })
  descripcion: string;
  @ManyToMany(() => UserEntity, (user) => user.roles)
  @JoinColumn()
  users: UserEntity[];
  @ManyToMany(() => FuncionEntity, (funcion) => funcion.rols, { eager: false })
  @JoinTable({
    name: 'rol_funcion',
    joinColumn: {
      name: 'rol_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'funcion_id',
      referencedColumnName: 'id',
    },
  })
  funcions: FuncionEntity[];
  constructor(
    nombre: string,
    descripcion: string,
    funcions: FuncionEntity[],
    users?: UserEntity[],
  ) {
    super();
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.users = users;
    this.funcions = funcions;
  }
  public toString(): string {
    return this.nombre;
  }
}

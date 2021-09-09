import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import {GenericEntity} from "../../shared/entity/generic.entity";

@Entity('roles', { schema: 'mod_auth' })
export class RoleEntity extends GenericEntity {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  nombre: string;

  @Column({ type: 'text', nullable: false })
  descripcion: string;

  @ManyToMany((type) => UserEntity, (user) => user.roles)
  @JoinColumn()
  users: UserEntity[];

  constructor(nombre: string, descripcion: string) {
    super();
    this.nombre = nombre;
    this.descripcion = descripcion;
  }
}

import {
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import {GenericNomencaldorEntity} from "../../shared/entity";

@Entity('roles', { schema: 'mod_auth' })
export class RolEntity extends GenericNomencaldorEntity {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToMany((type) => UserEntity, (user) => user.roles)
  @JoinColumn()
  users: UserEntity[];

  constructor(nombre: string, descripcion: string) {
    super();
    this.nombre = nombre;
    this.descripcion = descripcion;
  }

  public toString(): string {
    return this.nombre;
  }
}

import {
  Entity,
  ManyToMany,
  JoinColumn, JoinTable
} from 'typeorm';
import { UserEntity } from './user.entity';
import {GenericNomencladorEntity} from "../../nomenclator/entity";
import {PermisoEntity} from "./permiso.entity";

@Entity('rol', { schema: 'mod_auth' })
export class RolEntity extends GenericNomencladorEntity {

  @ManyToMany(() => UserEntity, (user) => user.roles)
  @JoinColumn()
  users: UserEntity[];

  @ManyToMany(() => PermisoEntity, (permiso) => permiso.users,{eager: false})
  @JoinTable({name: 'rol_permiso',
    joinColumn: {
      name: "rol_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "permiso_id",
      referencedColumnName: "id"
    }})
  permisos: PermisoEntity[];

  constructor(nombre: string, descripcion: string, users?: UserEntity[], permisos?: PermisoEntity[]) {
    super(nombre, descripcion);
    this.users = users;
    this.permisos = permisos;

  }
}

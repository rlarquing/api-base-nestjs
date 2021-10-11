import {
  Entity,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import {GenericNomencaldorEntity} from "../../nomenclator/entity";

@Entity('roles', { schema: 'mod_auth' })
export class RolEntity extends GenericNomencaldorEntity {

  @ManyToMany((type) => UserEntity, (user) => user.roles)
  @JoinColumn()
  users: UserEntity[];

}

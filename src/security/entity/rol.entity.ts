import {
  Entity,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import {GenericNomencladorEntity} from "../../nomenclator/entity";

@Entity('rol', { schema: 'mod_auth' })
export class RolEntity extends GenericNomencladorEntity {

  @ManyToMany((type) => UserEntity, (user) => user.roles)
  @JoinColumn()
  users: UserEntity[];

}

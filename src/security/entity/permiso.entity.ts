import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { RolEntity } from './rol.entity';
import { SchemaEnum } from '../../database/schema/schema.enum';

@Entity('permiso', { schema: SchemaEnum.MOD_AUTH })
export class PermisoEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', nullable: false })
  nombre: string;
  @Column({ type: 'varchar', nullable: false })
  servicio: string;
  @ManyToMany(() => UserEntity, (user) => user.permisos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  users: UserEntity[];
  @ManyToMany(() => RolEntity, (rol) => rol.permisos, { onDelete: 'CASCADE' })
  @JoinColumn()
  roles: RolEntity[];
  constructor(nombre: string, servicio: string) {
    this.nombre = nombre;
    this.servicio = servicio;
  }
  public toString(): string {
    return this.nombre;
  }
}

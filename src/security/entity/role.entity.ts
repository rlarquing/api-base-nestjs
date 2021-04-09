import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '../entity/user.entity';

@Entity('roles', { schema: 'mod_auth' })
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  nombre: string;

  @Column({ type: 'text', nullable: false })
  descripcion: string;

  @ManyToMany((type) => UserEntity, (user) => user.roles)
  @JoinColumn()
  users: UserEntity[];

  @Column({ type: 'varchar', default: 'ACTIVE', length: 8 })
  status: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: true })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date;


  constructor(nombre: string, descripcion: string) {
    super();
    this.nombre = nombre;
    this.descripcion = descripcion;
  }
}

import {
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { EndPointEntity } from './end-point.entity';
import { RolEntity } from './rol.entity';
import { UserEntity } from './user.entity';
import { SchemaEnum } from '../../database/schema/schema.enum';
import { GenericEntity } from './generic.entity';
import { MenuEntity } from './menu.entity';

@Entity('funcion', { schema: SchemaEnum.MOD_AUTH, orderBy: { id: 'ASC' } })
export class FuncionEntity extends GenericEntity {
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
    name: 'descripcion',
  })
  descripcion: string;
  @ManyToMany(() => EndPointEntity, (end_point) => end_point.funcions, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'funcion_end_point',
    joinColumn: { name: 'funcion_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'end_point_id', referencedColumnName: 'id' },
  })
  endPoints: EndPointEntity[];
  @OneToOne(() => MenuEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'menu_id' })
  menu?: MenuEntity;
  @ManyToMany(() => RolEntity, (rol) => rol.funcions)
  @JoinColumn()
  rols: RolEntity[];
  @ManyToMany(() => UserEntity, (user) => user.funcions)
  @JoinColumn()
  users: UserEntity[];
  constructor(partial: Partial<FuncionEntity>) {
    super();
    Object.assign(this, partial);
  }
  public toString(): string {
    return this.nombre;
  }
}

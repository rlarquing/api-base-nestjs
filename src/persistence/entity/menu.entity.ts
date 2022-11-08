import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { GenericEntity } from './generic.entity';
import { SchemaEnum } from '../../database/schema/schema.enum';
import { TipoMenuTypeEnum } from '../../shared/enum';
@Entity('menu', { schema: SchemaEnum.PUBLIC, orderBy: { id: 'ASC' } })
export class MenuEntity extends GenericEntity {
  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: false,
    name: 'label',
  })
  label: string;
  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: false,
    name: 'icon',
  })
  icon: string;
  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: false,
    name: 'to',
  })
  to: string;
  @ManyToOne(() => MenuEntity, (menu) => menu.menus, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'menu_id' })
  menu: MenuEntity;
  @OneToMany(() => MenuEntity, (menu) => menu.menu)
  menus: MenuEntity[];
  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: false,
    name: 'tipo',
    default: 'interno',
  })
  tipo: TipoMenuTypeEnum;
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: true,
    name: 'nomemclador',
  })
  nomemclador: string;
  constructor(
    label: string,
    icon: string,
    to: string,
    menu: MenuEntity,
    tipo: TipoMenuTypeEnum,
    nomemclador?: string,
  ) {
    super();
    this.label = label;
    this.icon = icon;
    this.to = to;
    this.menu = menu;
    this.tipo = tipo;
    this.nomemclador = nomemclador;
  }
  public toString(): string {
    return this.label;
  }
}

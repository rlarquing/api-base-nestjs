import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { GenericEntity } from './generic.entity';
import { SchemaEnum } from '../../database/schema/schema.enum';
@Entity('menu', { schema: SchemaEnum.PUBLIC })
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
  constructor(
    label: string,
    icon: string,
    to: string,
    menu: MenuEntity,
  ) {
    super();
    this.label = label;
    this.icon = icon;
    this.to = to;
    this.menu = menu;
  }
  public toString(): string {
    return this.label;
  }
}

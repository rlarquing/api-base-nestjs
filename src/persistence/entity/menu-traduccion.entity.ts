import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { GenericEntity } from './generic.entity';
import { SchemaEnum } from '../../database/schema/schema.enum';
import { MenuEntity } from './menu.entity';
import { IdiomaEntity } from './idioma.entity';

@Entity('menu_traduccion', {
  schema: SchemaEnum.PUBLIC,
  orderBy: { id: 'ASC' },
})
@Index('UQ_menu_traduccion_menu_idioma', ['menu', 'idioma'], {
  unique: true,
  where: '"activo" = true',
})
export class MenuTraduccionEntity extends GenericEntity {
  @ManyToOne(() => MenuEntity, (menu) => menu.traducciones, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'menu_id' })
  menu!: MenuEntity;

  @ManyToOne(() => IdiomaEntity, (idioma) => idioma.menuTraducciones, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'idioma_id' })
  idioma!: IdiomaEntity;

  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: false,
    name: 'label',
  })
  label!: string;

  constructor(menu: MenuEntity, idioma: IdiomaEntity, label: string) {
    super();
    this.menu = menu;
    this.idioma = idioma;
    this.label = label;
  }

  public toString(): string {
    return this.label;
  }
}

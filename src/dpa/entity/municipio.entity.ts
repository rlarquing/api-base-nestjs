import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {ProvinciaEntity} from "./provincia.entity";
import {SchemaEnum} from "../../database/schema/schema.enum";


@Entity('municipio', { schema: SchemaEnum.MOD_DPA })
export class MunicipioEntity {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 4, nullable: false })
  codigo: string;

  @Column('geometry', { name: 'geom', nullable: true })
  geom: string | null;

  @ManyToOne(() => ProvinciaEntity, (provincia) => provincia.municipios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  provincia: ProvinciaEntity;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: true })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date;

  public toString():string{
    return this.nombre;
  }
}

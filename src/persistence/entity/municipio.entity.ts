import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ProvinciaEntity } from './provincia.entity';
import { SchemaEnum } from '../../database/schema/schema.enum';

@Entity('municipio', { schema: SchemaEnum.MOD_DPA, orderBy: { id: 'ASC' } })
export class MunicipioEntity {
  @PrimaryGeneratedColumn('increment') id: number;
  @Column({ type: 'varchar', length: 255, nullable: false }) nombre: string;
  @Column({ type: 'integer', nullable: false, default: 0 }) codigo: number;
  @Column('geometry', { name: 'geom', nullable: true }) geom: string | null;
  @Column('geometry', { name: 'centroide', nullable: true }) centroide:
    | string
    | null;
  @ManyToOne(() => ProvinciaEntity, (provincia) => provincia.municipios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'provincia_id' })
  provincia: ProvinciaEntity;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: true })
  createdAt: Date;
  @CreateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date;

  public toString(): string {
    return this.nombre;
  }
}

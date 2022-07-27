import {
  Column,
  Entity,
  OneToMany,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MunicipioEntity } from './municipio.entity';
import { SchemaEnum } from '../../database/schema/schema.enum';

@Entity('provincia', { schema: SchemaEnum.MOD_DPA, orderBy: { id: 'ASC' } })
export class ProvinciaEntity {
  @PrimaryGeneratedColumn('increment') id: number;
  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: false,
    name: 'nombre',
  })
  nombre: string;
  @Column({ type: 'varchar', length: 2, nullable: false }) codigo: string;
  @Column('geometry', { name: 'geom', nullable: true }) geom: string | null;
  @Column('geometry', { name: 'centroide', nullable: true })
  centroide: string | null;
  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: false,
    name: 'nombre_corto',
  })
  nombreCorto: string | null;
  @OneToMany(() => MunicipioEntity, (municipio) => municipio.provincia)
  municipios: MunicipioEntity[];
  @CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: true })
  createdAt: Date;
  @CreateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date;
  public toString(): string {
    return this.nombre;
  }
}

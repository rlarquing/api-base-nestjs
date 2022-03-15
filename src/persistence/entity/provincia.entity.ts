import {
  Column,
  Entity,
  OneToMany,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MunicipioEntity } from './municipio.entity';
import { SchemaEnum } from '../../database/schema/schema.enum';
import { ParadigmaProvinciaEntity } from './paradigma-provincia.entity';
import { CierreProvinciaEntity } from './cierre-provincia.entity';

@Entity('provincia', { schema: SchemaEnum.MOD_DPA })
export class ProvinciaEntity {
  @PrimaryGeneratedColumn('increment') id: number;
  @Column('text') nombre: string;
  @Column({ type: 'varchar', length: 2, nullable: false }) codigo: string;
  @Column('geometry', { name: 'geom', nullable: true }) geom: string | null;
  @Column('text') nombre_corto: string | null;
  @OneToMany(() => MunicipioEntity, (municipio) => municipio.provincia)
  municipios: MunicipioEntity[];
  @OneToMany(
    () => ParadigmaProvinciaEntity,
    (paradigma_provincia) => paradigma_provincia.provincia,
  )
  paradigmaProvincias: ParadigmaProvinciaEntity[];
  @CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: true })
  createdAt: Date;
  @CreateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date;
  @OneToMany(
    () => CierreProvinciaEntity,
    (cierre_provincia) => cierre_provincia.provincia,
  )
  cierreProvincias: CierreProvinciaEntity[];
  public toString(): string {
    return this.nombre;
  }
}

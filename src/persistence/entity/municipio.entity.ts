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
import { PoblacionEntity } from './poblacion.entity';
import { ParadigmaMunicipioEntity } from './paradigma-municipio.entity';
import { EmpresaEntity } from './empresa.entity';
import { CierreMunicipioEntity } from './cierre-municipio.entity';

@Entity('municipio', { schema: SchemaEnum.MOD_DPA })
export class MunicipioEntity {
  @PrimaryGeneratedColumn('increment') id: number;
  @Column({ type: 'varchar', length: 255, nullable: false }) nombre: string;
  @Column({ type: 'varchar', length: 4, nullable: false }) codigo: string;
  @Column('geometry', { name: 'geom', nullable: true }) geom: string | null;
  @ManyToOne(() => ProvinciaEntity, (provincia) => provincia.municipios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  provincia: ProvinciaEntity;
  @OneToMany(() => PoblacionEntity, (poblacion) => poblacion.municipio)
  poblacions: PoblacionEntity[];
  @OneToMany(
    () => ParadigmaMunicipioEntity,
    (paradigma_municipio) => paradigma_municipio.municipio,
  )
  paradigmaMunicipios: ParadigmaMunicipioEntity[];
  @OneToMany(() => EmpresaEntity, (empresa) => empresa.municipio)
  empresas: EmpresaEntity[];
  @CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: true })
  createdAt: Date;
  @CreateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date;
  @OneToMany(
    () => CierreMunicipioEntity,
    (cierre_municipio) => cierre_municipio.municipio,
  )
  cierreMunicipios: CierreMunicipioEntity[];
  public toString(): string {
    return this.nombre;
  }
}

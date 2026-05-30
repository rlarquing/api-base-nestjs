import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { SchemaEnum } from '../../database/schema/schema.enum';

export enum HISTORY_ACTION {
  ADD = 'Adicionar',
  MOD = 'Modificar',
  DEL = 'Eliminar',
  REM = 'Eliminar_completamente',
}

@Entity('log_history', {
  schema: SchemaEnum.MOD_AUTH,
  orderBy: { id: 'ASC' },
})
export class LogHistoryEntity {
  @PrimaryGeneratedColumn({ type: 'int8' })
  id!: number;

  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: false,
    name: 'user',
  })
  user!: string;

  @CreateDateColumn({ type: 'timestamp', name: 'date', nullable: true })
  date!: Date;

  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: false,
    name: 'tabla',
  })
  tabla!: string;

  @Column({ type: 'jsonb', nullable: true, name: 'valor_nuevo' })
  valorNuevo?: object | null;

  @Column({ type: 'jsonb', nullable: true, name: 'valor_anterior' })
  valorAnterior?: object | null;

  @Column({ type: 'int8', unique: false, nullable: false, name: 'registro_id' })
  registroId?: number | null | undefined;

  @Column({
    type: 'varchar',
    length: 45,
    unique: false,
    nullable: false,
    name: 'direccion_ip',
  })
  direccionIp?: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    unique: false,
    nullable: false,
    name: 'esquema',
  })
  esquema!: string;

  @Column()
  action!: HISTORY_ACTION;
}

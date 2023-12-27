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
  @PrimaryGeneratedColumn({ type: 'int8'})
  id: number;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp', name: 'date', nullable: true })
  date: Date;

  @Column()
  model: string;

  @Column({ type: 'jsonb', nullable: true })
  data: object;

  @Column()
  action: HISTORY_ACTION;

  @Column({ nullable: true })
  record: number;
}

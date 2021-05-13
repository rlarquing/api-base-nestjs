
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {UserEntity} from "./user.entity";

export enum HISTORY_ACTION {
  ADD = 'Adicionar',
  MOD = 'Modificar',
  DEL = 'Eliminar',
}

@Entity({
  schema: 'mod_auth',
  name: 'traza',
})
export class TrazaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity,{eager: true})
  @JoinColumn({ name: 'user' })
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

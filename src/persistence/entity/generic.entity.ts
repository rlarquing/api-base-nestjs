import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';

export abstract class GenericEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int8'})
  id: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date;

  public abstract toString(): string;
}

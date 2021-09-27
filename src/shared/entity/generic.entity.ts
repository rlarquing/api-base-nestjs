import {BaseEntity, Column, CreateDateColumn} from "typeorm";

export abstract class GenericEntity extends BaseEntity {
    @Column({type: 'boolean', default: true})
    activo: boolean;

    @CreateDateColumn({type: 'timestamp', name: 'created_at', nullable: true})
    createdAt: Date;

    @CreateDateColumn({type: 'timestamp', name: 'updated_at', nullable: true})
    updatedAt: Date;

    public abstract toString(): string;
}
import {
    Column,
    Entity,
    JoinColumn, ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import {UserEntity} from "./user.entity";
import {RolEntity} from "./rol.entity";

@Entity('permiso', {schema: 'mod_auth'})
export class PermisoEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({type: 'varchar', nullable: false})
    nombre: string;
    @Column({type: 'varchar', nullable: false})
    servicio: string;
    @ManyToMany(() => UserEntity, (user) => user.permisos, {onDelete: 'CASCADE'})
    @JoinColumn()
    users: UserEntity[];
    @ManyToMany(() => RolEntity, (rol) => rol.permisos, {onDelete: 'CASCADE'})
    @JoinColumn()
    roles: RolEntity[];
    constructor(nombre: string, servicio: string) {
        this.nombre = nombre;
        this.servicio = servicio;
    }
    public toString(): string {
        return this.nombre;
    }
}
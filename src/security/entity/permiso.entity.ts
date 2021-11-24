import {
    Column,
    Entity,
    JoinColumn, ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import {ModeloEntity} from "./modelo.entity";
import {UserEntity} from "./user.entity";
import {RolEntity} from "./rol.entity";

@Entity('permiso',{schema: 'mod_auth'})
export class PermisoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', nullable: false})
    nombre: string;

    @Column({type: 'varchar', nullable: false})
    servicio: string;

    @ManyToOne(() => ModeloEntity, (modelo) => modelo.permisos, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: 'modelo_id'})
    modelo: ModeloEntity;

    @ManyToMany(() => UserEntity, (user) => user.permisos)
    @JoinColumn()
    users: UserEntity[];

    @ManyToMany(() => RolEntity, (rol) => rol.permisos)
    @JoinColumn()
    roles: RolEntity[];

    constructor(nombre: string, servicio: string, modelo: ModeloEntity) {
        this.nombre = nombre;
        this.servicio = servicio;
        this.modelo = modelo;
    }

    public toString(): string {
        return this.nombre;
    }
}
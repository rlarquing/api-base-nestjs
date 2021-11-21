import {
    Column,
    Entity,
    JoinColumn, ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import {EntidadEntity} from "./entidad.entity";
import {UserEntity} from "./user.entity";
import {RolEntity} from "./rol.entity";
import {GrupoEntity} from "./grupo.entity";

@Entity({
    schema: 'mod_auth',
    name: 'permiso'
})
export class PermisoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', nullable: false})
    name: string;

    @Column({type: 'varchar', nullable: false})
    servicio: string;

    @ManyToOne(() => EntidadEntity, (entidad) => entidad.permisos, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: 'tipo_alerta_id'})
    entidad: EntidadEntity;

    @ManyToMany(() => UserEntity, (user) => user.permisos)
    @JoinColumn()
    users: UserEntity[];

    @ManyToMany(() => RolEntity, (rol) => rol.permisos)
    @JoinColumn()
    roles: RolEntity[];

    @ManyToMany(() => GrupoEntity, (grupo) => grupo.permisos)
    @JoinColumn()
    grupos: GrupoEntity[];
    constructor(name: string, servicio: string, entidad: EntidadEntity) {
        this.name = name;
        this.servicio = servicio;
        this.entidad = entidad;
    }
}
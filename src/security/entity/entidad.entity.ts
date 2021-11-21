import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {PermisoEntity} from "./permiso.entity";

@Entity({
    schema: 'mod_auth',
    name: 'entidad',
})
export class EntidadEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', nullable: false})
    name: string;

    @Column({type: 'varchar', nullable: false})
    schema: string;

    @OneToMany(() => PermisoEntity, (permiso) => permiso.entidad)
    permisos: PermisoEntity[];

    constructor(name: string, schema: string) {
        this.name = name;
        this.schema = schema;
    }
}
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {PermisoEntity} from "./permiso.entity";

@Entity({
    schema: 'mod_auth',
    name: 'modelo',
})
export class ModeloEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', nullable: false})
    nombre: string;

    @Column({type: 'varchar', nullable: false})
    schema: string;

    @OneToMany(() => PermisoEntity, (permiso) => permiso.modelo)
    permisos: PermisoEntity[];

    constructor(nombre: string, schema: string) {
        this.nombre = nombre;
        this.schema = schema;
    }

    public toString(): string {
        return this.nombre;
    }
}
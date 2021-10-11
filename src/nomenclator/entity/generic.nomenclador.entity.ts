import {Column} from "typeorm";
import {GenericEntity} from "../../shared/entity";

export class GenericNomencladorEntity extends GenericEntity{

    @Column({ type: 'varchar', length: 255, nullable: false })
    nombre: string;

    @Column({ type: 'text', nullable: false })
    descripcion: string;

    constructor(nombre: string, descripcion: string) {
        super();
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    public toString(): string {
       return this.nombre;
    }
}
import {Column, Unique} from "typeorm";
import {GenericEntity} from "../../shared/entity";

@Unique(['nombre'])
export class GenericNomencladorEntity extends GenericEntity{

    @Column({ type: 'varchar', unique:true,length: 255, nullable: false })
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
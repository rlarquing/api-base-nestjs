import {Column} from "typeorm";
import {GenericEntity} from "./generic.entity";

export abstract class GenericNomencaldorEntity extends GenericEntity{

    @Column({ type: 'varchar', length: 255, nullable: false })
    nombre: string;

    @Column({ type: 'text', nullable: false })
    descripcion: string;
}
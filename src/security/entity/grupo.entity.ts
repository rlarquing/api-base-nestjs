import {Entity, JoinTable, ManyToMany} from "typeorm";
import {GenericNomencladorEntity} from "../../nomenclator/entity";
import {PermisoEntity} from "./permiso.entity";
import {RolEntity} from "./rol.entity";

@Entity({
    schema: 'mod_auth',
    name: 'grupo',
})
export class GrupoEntity extends GenericNomencladorEntity{

    @ManyToMany(() => RolEntity, (rol) => rol.grupos,{eager: false})
    @JoinTable({name: 'grupo_rol',
        joinColumn: {
            name: "grupo_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "rol_id",
            referencedColumnName: "id"
        }})
    roles: RolEntity[];

    @ManyToMany(() => PermisoEntity, (permiso) => permiso.grupos,{eager: false})
    @JoinTable({name: 'grupo_permiso',
        joinColumn: {
            name: "grupo_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "permiso_id",
            referencedColumnName: "id"
        }})
    permisos: PermisoEntity[];

    constructor(nombre: string, descripcion: string, roles?: RolEntity[], permisos?: PermisoEntity[]) {
        super(nombre, descripcion);
        this.roles = roles;
        this.permisos = permisos;
    }
}
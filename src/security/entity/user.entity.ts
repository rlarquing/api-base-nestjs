import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    Unique
} from 'typeorm';
import { hash } from 'bcryptjs';
import {RolEntity} from './rol.entity';
import {GenericEntity} from "../../shared/entity";
import {PermisoEntity} from "./permiso.entity";
import {SchemaEnum} from "../../database/schema/schema.enum";

@Entity('user', {schema: SchemaEnum.MOD_AUTH})
@Unique(['username'])
export class UserEntity extends GenericEntity {
    @Column({type: 'varchar', unique: true, length: 25, nullable: false})
    username: string;
    @Column({type: 'varchar', nullable: true})
    email: string;
    @Column({type: 'varchar', nullable: false})
    password: string;
    @Column({nullable: true, name: 'refreshtoken'})
    refreshToken: string;
    @Column({type: 'date', nullable: true, name: 'refreshtokenexp'})
    refreshTokenExp: string;
    @Column({type: 'varchar', nullable: true})
    salt: string;
    @ManyToMany(() => RolEntity, (rol) => rol.users, {eager: false})
    @JoinTable({
        name: 'user_rol',
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "rol_id",
            referencedColumnName: "id"
        }
    })
    roles: RolEntity[];
    @ManyToMany(() => PermisoEntity, (permiso) => permiso.users, {eager: false, onDelete: 'CASCADE'})
    @JoinTable({
        name: 'user_permiso',
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "permiso_id",
            referencedColumnName: "id"
        }
    })
    permisos: PermisoEntity[];
    async validatePassword(password: string): Promise<boolean> {
        return this.password === await hash(password, this.salt);
    }
    constructor(username: string, email: string, permisos?: PermisoEntity[]) {
        super();
        this.username = username;
        this.email = email;
        this.permisos = permisos;
    }
    public toString(): string {
        return this.username;
    }
}

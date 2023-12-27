import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { hash } from 'bcryptjs';
import { RolEntity } from './rol.entity';
import { FuncionEntity } from './funcion.entity';
import { SchemaEnum } from '../../database/schema/schema.enum';
import { GenericEntity } from './generic.entity';

@Entity('user', { schema: SchemaEnum.MOD_AUTH, orderBy: { id: 'ASC' } })
export class UserEntity extends GenericEntity {
  @Column({ type: 'varchar', name: 'user_name', unique: true, length: 25, nullable: false })
  userName: string;
  @Column({ type: 'varchar', nullable: true })
  email: string;
  @Column({ type: 'varchar', nullable: false })
  password: string;
  @Column({ nullable: true, name: 'refresh_token' })
  refreshToken: string;
  @Column({ type: 'date', nullable: true, name: 'refresh_token_exp' })
  refreshTokenExp: string;
  @Column({ type: 'varchar', nullable: true })
  salt: string;
  @ManyToMany(() => RolEntity, (rol) => rol.users, { eager: false })
  @JoinTable({
    name: 'user_rol',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'rol_id', referencedColumnName: 'id' },
  })
  roles: RolEntity[];
  @ManyToMany(() => FuncionEntity, (funcion) => funcion.users, { eager: false })
  @JoinTable({
    name: 'user_funcion',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'funcion_id',
      referencedColumnName: 'id',
    },
  })
  funcions?: FuncionEntity[];

  constructor(userName: string, email: string, funcions?: FuncionEntity[]) {
    super();
    this.userName = userName;
    this.email = email;
    this.funcions = funcions;
  }
  public async validatePassword(password: string): Promise<boolean> {
    return this.password === (await hash(password, this.salt));
  }
  public toString(): string {
    return this.userName;
  }
}

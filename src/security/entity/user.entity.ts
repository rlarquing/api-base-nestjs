import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn, Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from './../entity/role.entity';

@Entity('user', { schema: 'mod_auth' })
@Unique(['username'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ example: 'pedro' })
  @Column({ type: 'varchar', unique: true, length: 25, nullable: false })
  username: string;

  @ApiProperty({ example: 'pedro@camaguey.geocuba.cu' })
  @Column({ type: 'varchar', nullable: true })
  email: string;

  @ApiProperty({ example: 'Asd1234*' })
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  salt: string;

  @ManyToMany((type) => RoleEntity, (role) => role.users)
  @JoinTable()
  roles: RoleEntity[];

  @Column({ type: 'varchar', default: 'ACTIVE', length: 8 })
  status: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }


  constructor(username: string, email: string) {
    super();
    this.username = username;
    this.email = email;
  }

}

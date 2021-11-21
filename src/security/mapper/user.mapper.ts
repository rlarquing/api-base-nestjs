import { Injectable } from '@nestjs/common';
import {RolEntity, UserEntity} from "../entity";
import {ReadRolDto, ReadUserDto, UpdateUserDto, UserDto} from "../dto";
import {RolMapper} from "./rol.mapper";

@Injectable()
export class UserMapper {
  constructor(
      protected rolMapper: RolMapper,
  ) {
  }
  dtoToEntity(userDto: UserDto): UserEntity {
    return new UserEntity(
        userDto.username,
        userDto.email
    );
  }

  dtoToUpdateEntity(updateUserDto: UpdateUserDto, updateUserEntity: UserEntity): UserEntity {
    updateUserEntity.username = updateUserDto.username;
    updateUserEntity.email = updateUserDto.email;
    return updateUserEntity;
  }

  async entityToDto(userEntity: UserEntity): Promise<ReadUserDto>{
    const readRolDto: ReadRolDto[] = [];
    for (const rol of userEntity.roles) {
      readRolDto.push(await this.rolMapper.entityToDto(rol));
    }

    const dtoToString: string = userEntity.toString();
    return new ReadUserDto(
        userEntity.id,
        userEntity.username,
        userEntity.email,
        readRolDto,
        dtoToString
    );
  }
}

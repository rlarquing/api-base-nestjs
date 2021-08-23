import { Injectable } from '@nestjs/common';
import {UserEntity} from "../entity";
import {ReadRoleDto, ReadUserDto, UpdateUserDto, UserDto} from "../dto";

@Injectable()
export class UserMapper {
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

  entityToDto(userEntity: UserEntity, readRoleDto: ReadRoleDto[]): ReadUserDto{
    return new ReadUserDto(
        userEntity.id,
        userEntity.username,
        userEntity.email,
        readRoleDto,
    );
  }
}

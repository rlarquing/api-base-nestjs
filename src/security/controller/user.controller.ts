import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {GetUser} from './../decorator/get-user.decorator';
import {Roles} from './../decorator/role.decorator';
import {RoleGuard} from './../guards/role.guard';
import {CreateRoleDto, ReadRoleDto, ReadUserDto, UpdateUserDto, UserDto} from './../dto';
import {UserEntity} from './../entity/user.entity';
import {UserService} from './../service/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {

  }

  // @Roles(RoleType.ADMINISTRADOR,RoleType.DIGITADOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Get()
  async getUsers(): Promise<ReadUserDto[]> {
    return await this.userService.getAll();
  }

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<ReadUserDto> {
    return await this.userService.get(id);

  }

  @Post()
  async create(@Body() userDto: UserDto): Promise<ReadUserDto> {
    return await this.userService.create(userDto);
  }

  @Patch(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);

  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.delete(id);

  }

}

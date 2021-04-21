import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {GetUser} from './../decorator/get-user.decorator';
import {Roles} from './../decorator/role.decorator';
import {RoleGuard} from './../guards/role.guard';
import { ReadUserDto, UpdateUserDto, UserDto} from './../dto';
import {UserEntity} from './../entity/user.entity';
import {UserService} from './../service/user.service';
import {RoleType} from "../enum/roletype.enum";

@Controller('users')
@Roles(RoleType.ADMINISTRADOR)
@UseGuards(AuthGuard(),RoleGuard)
export class UserController {
  constructor(private userService: UserService) {
  }

  @Get()
  async getUsers(): Promise<ReadUserDto[]> {
    return await this.userService.getAll();
  }

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<ReadUserDto> {
    return await this.userService.get(id);

  }

  @Post()
  async create(@GetUser() user: UserEntity, @Body() userDto: UserDto): Promise<ReadUserDto> {
    return await this.userService.create(user, userDto);
  }

  @Patch(':id')
  updateUser(@GetUser() user: UserEntity, @Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user, id, updateUserDto);

  }

  @Delete(':id')
  deleteUser(@GetUser() user: UserEntity, @Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.delete(user, id);

  }

}

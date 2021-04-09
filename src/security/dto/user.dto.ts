import {IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength} from 'class-validator';

import {ApiProperty} from "@nestjs/swagger";

export class UserDto{

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @ApiProperty({ example: 'juan' })
    username: string;

    @IsString()
    @MinLength(8, {
        message: 'La contraseña debe tener al menos 8 carácteres.',
    })

    @MaxLength(20, {
        message: 'La contraseña debe tener como máximo 20 carácteres.',
    })

    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña es muy débil.',
    })

    @ApiProperty()
    password: string;

    @IsOptional()
    email?: string;

    @IsNotEmpty()
    roles: number[];

    constructor(username: string, email: string, roles: number[]) {
        this.username = username;
        this.email = email;
        this.roles = roles;
    }
}

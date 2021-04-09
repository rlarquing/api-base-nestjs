import {IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator'

export class UpdateUserDto {

    @IsEmail()
    @IsOptional()
    readonly email?: string;

    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @IsNumber()
    @IsNotEmpty()
    readonly roles: number[];

}

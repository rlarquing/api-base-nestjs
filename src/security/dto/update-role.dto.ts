import{IsString, MaxLength} from "class-validator"
export class UpdateRoleDto{
    @IsString()
    @MaxLength(50, {message: 'this name is not valid'})
    readonly nombre : string;
    @IsString()
    @MaxLength(100, {message: 'this decription is not valid'})
    readonly descripcion: string;
}
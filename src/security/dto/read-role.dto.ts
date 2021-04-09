import{IsNumber, IsString, MaxLength} from "class-validator";
import { Exclude, Expose } from "class-transformer";
@Exclude()
export class ReadRoleDto{
   @Expose({name: 'identificador'})
    @IsNumber()
    readonly id: number;
    @Expose()
    @IsString()
    @MaxLength(50, {message: 'this name is not valid'})
    readonly nombre : string;
    @Expose()
    @IsString()
    @MaxLength(100, {message: 'this decription is not valid'})
    readonly description: string;

 constructor(id: number, nombre: string, description: string) {
  this.id = id;
  this.nombre = nombre;
  this.description = description;
 }
}
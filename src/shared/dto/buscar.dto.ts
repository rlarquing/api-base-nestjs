import {ApiProperty} from "@nestjs/swagger";

export class BuscarDto{
    @ApiProperty({description: 'search', example: 'ADMINISTRADOR'})
    search: any;
}
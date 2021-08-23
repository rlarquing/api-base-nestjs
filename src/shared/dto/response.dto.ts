import {ApiProperty} from "@nestjs/swagger";

export class ResponseDto {

    @ApiProperty({description: 'Estado de la respuesta.', example: 'true'})
    successStatus: boolean;

    @ApiProperty({description: 'mensaje de la respuesta.', example: 'success'})
    message: string;
}
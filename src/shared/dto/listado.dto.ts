import {IsArray, IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class ListadoDto{

    @IsArray()
    @ApiProperty({description: 'Header.', example: [
        "id","Nombre","Descripción" ]})
    header: Array<string>;

    @IsNotEmpty()
    @ApiProperty({ description: 'Datos que se mostrarán.', example:{
                "items": [
                    {
                        "id": 1,
                        "nombre": "ADMINISTRADOR",
                        "description": "Tiene permiso total del api"
                    },
                ],
                "meta": {
                    "totalItems": 1,
                    "itemCount": 1,
                    "itemsPerPage": 10,
                    "totalPages": 1,
                    "currentPage": 1
                },
                "links": {
                    "first": "http://localhost:3000/api/roles?limit=10",
                    "previous": "",
                    "next": "",
                    "last": "http://localhost:3000/api/roles?page=1&limit=10"
                }
            }})
    data: object;


    constructor(header: Array<string>, data: object) {
        this.header = header;
        this.data = data;
    }
}
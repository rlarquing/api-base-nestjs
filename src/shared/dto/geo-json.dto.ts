import {IsArray, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class GeoJsonDto{

    @IsString()
    @ApiProperty({description: 'FeatureCollection.', example: "FeatureCollection"})
    type:string;

    @IsArray()
    @ApiProperty({description: 'Features.', example: []})
    features: [];

    constructor(features) {
       this.type="FeatureCollection";
       this.features = features;
    }
}
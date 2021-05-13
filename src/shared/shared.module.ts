import { Module } from '@nestjs/common';
import {GeoJsonMapper} from "./mapper";

@Module({
    imports: [],
    controllers: [],
    providers: [GeoJsonMapper],
    exports: [GeoJsonMapper]
})
export class SharedModule {}

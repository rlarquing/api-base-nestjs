import { Module } from '@nestjs/common';
import {GeoJsonMapper} from "./mapper";
import {SocketService} from "./service";
import {SocketController} from "./controller";
import {HttpModule} from "@nestjs/axios";
import {ScheduleModule} from "@nestjs/schedule";
import {SocketGateway} from "./gateway/socket.gateway";

@Module({
    imports: [ScheduleModule.forRoot(),HttpModule],
    controllers: [SocketController],
    providers: [GeoJsonMapper, SocketService, SocketGateway],
    exports: [GeoJsonMapper, SocketService, SocketGateway]
})
export class SharedModule {}

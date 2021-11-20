import {forwardRef, Module} from '@nestjs/common';
import {GeoJsonMapper} from "./mapper";
import {SocketService} from "./service";
import {SocketController} from "./controller";
import {HttpModule} from "@nestjs/axios";
import {ScheduleModule} from "@nestjs/schedule";
import {SocketGateway} from "./gateway/socket.gateway";
import {SecurityModule} from "../security/security.module";

@Module({
    imports: [
        ScheduleModule.forRoot(),
        HttpModule,
        forwardRef(() => SecurityModule)
    ],
    controllers: [SocketController],
    providers: [GeoJsonMapper, SocketService, SocketGateway],
    exports: [GeoJsonMapper, SocketService, SocketGateway]
})
export class SharedModule {}

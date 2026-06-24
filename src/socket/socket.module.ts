import { Module } from '@nestjs/common';
import { SocketGateway } from '../shared/gateway/socket.gateway';
import { SocketController } from '../api/controller/socket.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [SocketController],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}

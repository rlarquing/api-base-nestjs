import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { SocketGateway } from './gateway/socket.gateway';
import { SocketService } from '../core/service';
import { SocketController } from '../api/controller';
import { PaginationModule } from './pagination/pagination.module';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule, PaginationModule],
  controllers: [SocketController],
  providers: [SocketService, SocketGateway],
  exports: [ScheduleModule, HttpModule, SocketService, SocketGateway, PaginationModule],
})
export class SharedModule {}

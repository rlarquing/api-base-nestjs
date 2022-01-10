import { Controller, Get, Param } from '@nestjs/common';
import { SocketService } from '../service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Socket')
@Controller('socket')
export class SocketController {
  constructor(private readonly socketService: SocketService) {}

  @Get()
  getHello(): string {
    return this.socketService.getHello();
  }

   @Get(':id')
   async gpsTren(@Param('id') id: string): Promise<any> {
    return await this.socketService.gpsTren(id);
   }
}

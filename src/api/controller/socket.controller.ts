import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SocketService } from '../../core/service';

@ApiTags('Socket')
@Controller('socket')
export class SocketController {
  constructor(private readonly socketService: SocketService) {}

  @Get()
  getHello(): string {
    return this.socketService.getHello();
  }
  // @Get('/:id')
  // async gpsTren(@Param('id') id: string): Promise<any> {
  //   return await this.socketService.gpsTren(id);
  // }
}

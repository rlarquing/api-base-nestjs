import { Controller, Get, Param } from '@nestjs/common';
import {SocketService} from "../service";

@Controller()
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

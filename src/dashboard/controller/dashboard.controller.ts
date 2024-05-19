import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, } from '@nestjs/common';
import {DashboardService} from "../service";

@ApiTags('Dashboards')
@Controller('dashboard')
export class DashboardController {
  constructor(protected dasboardService: DashboardService) {}

  @Get('/cube')
  async consultaCube(): Promise<any> {
    return await this.dasboardService.consultaCube();
  }
}

import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ElementoDashboardEntity} from "./entity/elemento-dashboard.entity";
import {CubeService, DashboardService, ElementoDashboardService} from "./service";
import {ElementoDashboardRepository} from "./repository/elemento-dashboard.repository";
import {CubeController, DashboardController, ElementoDashboardController} from "./controller";
import {ElementoDashboardMapper} from "./mapper/elemento-dashboard.mapper";
import {CoreModule} from "../core/core.module";


@Module({
  imports: [
    TypeOrmModule.forFeature([ElementoDashboardEntity]),
      CoreModule
  ],
  controllers: [CubeController, DashboardController, ElementoDashboardController],
  providers: [CubeService, DashboardService, ElementoDashboardService, ElementoDashboardMapper, ElementoDashboardRepository],
  exports: [CubeService, DashboardService, ElementoDashboardService, ElementoDashboardMapper, ElementoDashboardRepository],
})
export class DashboardModule {}

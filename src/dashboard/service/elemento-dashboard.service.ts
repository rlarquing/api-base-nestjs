import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {GenericService, LogHistoryService} from "../../core/service";
import {ElementoDashboardEntity} from "../entity/elemento-dashboard.entity";
import {ElementoDashboardRepository} from "../repository/elemento-dashboard.repository";
import {ElementoDashboardMapper} from "../mapper/elemento-dashboard.mapper";

@Injectable()
export class ElementoDashboardService extends GenericService<ElementoDashboardEntity> {
  constructor(
    protected configService: ConfigService,
    protected elementoDashboardRepository: ElementoDashboardRepository,
    protected elementoDashboardMapper: ElementoDashboardMapper,
    protected logHistoryService: LogHistoryService,
  ) {
    super(
      configService,
      elementoDashboardRepository,
      elementoDashboardMapper,
        logHistoryService,
      true,
    );
  }
}

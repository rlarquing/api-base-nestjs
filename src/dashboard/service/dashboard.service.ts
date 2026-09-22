import { Injectable } from '@nestjs/common';
import { AppConfig } from '../../app.keys';
import { ConfigService } from '@nestjs/config';
import { CubeService } from './cube.service';
import {ListadoDto} from "../../shared/dto";
import { IPaginationOptions } from '../../shared/pagination';
import {ElementoDashboardRepository} from "../repository/elemento-dashboard.repository";
import {ElementoDashboardEntity} from "../entity/elemento-dashboard.entity";
import {GraficoDto} from "../dto";

@Injectable()
export class DashboardService {
  constructor(
    private configService: ConfigService,
    private elementoDashboardRepository: ElementoDashboardRepository,
    private cubeService: CubeService,
  ) {}

  async consultaCube(): Promise<any[]> {
    const url = this.configService.get(AppConfig.URL);
    const elementoDashboards: ElementoDashboardEntity[] =
      (await this.elementoDashboardRepository.findAll(
        null as unknown as IPaginationOptions,
        true,
      )) as ElementoDashboardEntity[];
    const result: any[] = [];
    let elemento: any;
    for (const elementoDashboard of elementoDashboards) {
      switch (elementoDashboard.tipo) {
        case 'table':
          const listado: ListadoDto = await this.cubeService.findPaginado(
            elementoDashboard.id,
            {
              page: 1,
              limit: 10,
              route: url + '/api/cube/' + elementoDashboard.id,
            },
          );
          result.push({
            nombre: elementoDashboard.nombre,
            tipo: elementoDashboard.tipo,
            capa: elementoDashboard.capa,
            elementoDashboard: listado,
          });
          break;
        case 'number':
          elemento = (
            await this.cubeService.query(elementoDashboard.consulta)
          ).rawData()[0];
          result.push({
            nombre: elementoDashboard.nombre,
            tipo: elementoDashboard.tipo,
            capa: elementoDashboard.capa,
            elementoDashboard: {
              value: +Object.values(elemento as Record<string, any>)[0],
            },
          });
          break;
        default:
          const graficoDto: GraficoDto = new GraficoDto();
          let categories: any[] = [];
          const series: any[] = [];

          elemento = await this.cubeService.query(elementoDashboard.consulta);

          const seriesNames = elemento.seriesNames();
          const pivot = elemento.chartPivot();
          seriesNames.forEach((e: any) => {
            const data = pivot.map((p: any) => p[e.key]);
            series.push({
              name: e.shortTitle.split(',')[0],
              data,
            });
          });
          categories = pivot.map((p: any) => p.x);
          graficoDto.label = elementoDashboard.nombre;
          graficoDto.categories = categories;
          graficoDto.series = series;
          result.push({
            nombre: elementoDashboard.nombre,
            tipo: elementoDashboard.tipo,
            capa: elementoDashboard.capa,
            elementoDashboard: graficoDto,
          });
          break;
      }
    }

    return result;
  }
}

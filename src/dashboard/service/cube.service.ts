import { Injectable } from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import cubejs, { CubeApi, ResultSet } from '@cubejs-client/core';
import { AppConfig } from '../../app.keys';
import { ConfigService } from '@nestjs/config';
import { buscarValor, intlRound, paginarArreglo } from '../../../lib';
import { ListadoDto } from '../../shared/dto';
import {ElementoDashboardRepository} from "../repository/elemento-dashboard.repository";
import {ElementoDashboardEntity} from "../entity/elemento-dashboard.entity";

@Injectable()
export class CubeService {
  private cubejsApi: CubeApi;
  constructor(
    private configService: ConfigService,
    private elementoDashboardRepository: ElementoDashboardRepository,
  ) {
    this.cubejsApi = cubejs({
      apiUrl: this.configService.get("CUBE_URL"), // reemplaza con la URL de tu Cube.js en Docker
    });
  }

  async findPaginado(
    id: number,
    options: IPaginationOptions,
  ): Promise<ListadoDto> {
    const elementoDashboard: ElementoDashboardEntity =
      await this.elementoDashboardRepository.findById(id);
    const consulta: any = elementoDashboard.consulta;
    consulta.limit = options.limit;
    consulta.offset = +options.limit * (+options.page - 1);
    const resultSet = await this.cubejsApi.load(elementoDashboard.consulta);
    const totalItems: number = resultSet.totalRows();
    const itemsPerPage: number = +options.limit;
    const currentPage: number = +options.page;
    const totalPages: number = intlRound(totalItems / itemsPerPage, 0);
    const itemCount: number = itemsPerPage * currentPage;
    const items: any[] = [];
    let llave = 1;
    for (const resultSetElement of resultSet.rawData()) {
      items.push({ id: llave, ...resultSetElement });
      llave = llave + 1;
    }
    const meta: any = {
      totalItems,
      itemsPerPage,
      currentPage,
      totalPages,
      itemCount,
    };
    const links: any = {
      first:
        totalItems <= itemsPerPage
          ? ''
          : options.route + `?limit=${itemsPerPage}`,
      previous:
        currentPage === 1
          ? ''
          : options.route + `?page=${currentPage - 1}&limit=${itemsPerPage}`,
      next:
        totalItems <= itemsPerPage
          ? ''
          : options.route + `?page=${currentPage + 1}&limit=${itemsPerPage}`,
      last:
        totalItems <= itemsPerPage
          ? ''
          : options.route + `?page=${totalPages}&limit=${itemsPerPage}`,
    };
    const header = ['id'];
    const key = ['id'];
    const tableColumns = resultSet.tableColumns();
    for (const tableColumn of tableColumns) {
      key.push(tableColumn.key);
      header.push(tableColumn.shortTitle.replace('nno', 'ño'));
    }
    return new ListadoDto(header, key, new Pagination(items, meta, links));
  }
  async query(query: any): Promise<ResultSet<any>> {
    return await this.cubejsApi.load(query);
  }

  async search(
    id: number,
    options: IPaginationOptions,
    criterio: string,
  ): Promise<ListadoDto> {
    const elementoDashboard: ElementoDashboardEntity =
      await this.elementoDashboardRepository.findById(id);
    const consulta: any = elementoDashboard.consulta;
    const resultSet = await this.cubejsApi.load(elementoDashboard.consulta);
    let listadoBusqueda = buscarValor(resultSet.rawData(), criterio);
    const totalItems: number = listadoBusqueda.length;
    const itemsPerPage: number = +options.limit;
    const currentPage: number = +options.page;
    const totalPages: number = intlRound(totalItems / itemsPerPage, 0);
    const itemCount: number = itemsPerPage * currentPage;
    const items: any[] = [];
    let llave = 1;
    const limit: number = +options.limit;
    const offset: number = +options.limit * (+options.page - 1);
    listadoBusqueda = paginarArreglo(listadoBusqueda, limit, offset);
    for (const resultSetElement of listadoBusqueda) {
      items.push({ id: llave, ...resultSetElement });
      llave = llave + 1;
    }
    const meta: any = {
      totalItems,
      itemsPerPage,
      currentPage,
      totalPages,
      itemCount,
    };
    const links: any = {
      first:
        totalItems <= itemsPerPage
          ? ''
          : options.route + `?limit=${itemsPerPage}`,
      previous:
        currentPage === 1
          ? ''
          : options.route + `?page=${currentPage - 1}&limit=${itemsPerPage}`,
      next:
        totalItems <= itemsPerPage
          ? ''
          : options.route + `?page=${currentPage + 1}&limit=${itemsPerPage}`,
      last:
        totalItems <= itemsPerPage
          ? ''
          : options.route + `?page=${totalPages}&limit=${itemsPerPage}`,
    };
    const header = ['id'];
    const key = ['id'];
    const tableColumns = resultSet.tableColumns();
    for (const tableColumn of tableColumns) {
      key.push(tableColumn.key);
      header.push(tableColumn.shortTitle.replace('nno', 'ño'));
    }
    return new ListadoDto(header, key, new Pagination(items, meta, links));
  }
}

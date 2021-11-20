import { GeoJsonDto, ReproyectarDto, TypeDto } from "../dto";
import { GeometricRepository } from '../repository';
import { GenericService } from './generic.service';
import { GeoJsonMapper } from '../mapper';
import { TrazaService } from '../../security/service';

export abstract class GeometricService<ENTITY> extends GenericService<ENTITY> {
  protected geoJsonMapper: GeoJsonMapper;
  protected constructor(
    protected geometricRepository: GeometricRepository<ENTITY>,
    protected mapper: any,
    protected trazaService: TrazaService,
    protected traza?: boolean,
  ) {
    super(geometricRepository, mapper, trazaService, traza);
    this.geoJsonMapper = new GeoJsonMapper();
  }

  async geoJson(
    opciones?: TypeDto,
  ): Promise<GeoJsonDto> {
    const jsons = await this.geometricRepository.geoJson(opciones.exclude, opciones.reproyectar);
    return this.geoJsonMapper.entitiesToDto(jsons);
  }

  async geoJsonById(
    id: number,
    opciones?: TypeDto,
  ): Promise<GeoJsonDto> {
    const json = await this.geometricRepository.geoJsonById(
      id,
      opciones.exclude,
      opciones.reproyectar,
    );
    return this.geoJsonMapper.entityToDto(json);
  }
}
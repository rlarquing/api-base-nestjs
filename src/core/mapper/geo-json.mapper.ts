import { Injectable } from '@nestjs/common';
import { GeoJsonDto } from '../../shared/dto';

@Injectable()
export class GeoJsonMapper {
  entitiesToDto(entities: any): GeoJsonDto {
    const geom: any = [];
    entities.map((entity) => {
      geom.push({
        type: 'Feature',
        properties: entity.properties,
        geometry: entity.geometry,
      });
    });
    return new GeoJsonDto(geom);
  }

  entityToDto(entity: any): GeoJsonDto {
    const geom: any = [];
    geom.push({
      type: 'Feature',
      properties: entity.properties,
      geometry: entity.geometry,
    });
    return new GeoJsonDto(geom);
  }
}

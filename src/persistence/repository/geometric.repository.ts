import { GenericRepository } from './generic.repository';
import { FindManyOptions, Repository } from 'typeorm';
import { isBoolean, isDate, isObject, isArray } from 'class-validator';

export abstract class GeometricRepository<
  ENTITY,
> extends GenericRepository<ENTITY> {
  constructor(
    protected repository: Repository<ENTITY>,
    protected relations?: string[],
  ) {
    super(repository, relations);
  }

  async geoJson(exclude?: string[], reproyectar?: any): Promise<any> {
    let data: any[] = [];
    if (!reproyectar) {
      const options = {
        where: { activo: true },
        relations: this.relations,
      } as FindManyOptions;
      data = await this.repository.find(options);
    } else {
      const queryBuilder = this.repository.createQueryBuilder('q');
      if (this.relations) {
        for (const relation of this.relations) {
          queryBuilder.leftJoinAndSelect(`q.${relation}`, relation);
        }
      }
      queryBuilder.where(`q.activo = true`);
      queryBuilder.addSelect(
        `ST_AsGeoJSON(ST_Transform(ST_SetSRID(q.geom,${reproyectar.origen}),${reproyectar.destino}))::json`,
        'geometry',
      );
      const result = await queryBuilder.getRawAndEntities();
      let entity: any;
      for (let i = 0; i < result.raw.length; i++) {
        entity = result.entities[i];
        entity.geom = result.raw[i].geometry;
        data.push(entity);
      }
    }
    const keys = new Map<string, string>();
    if (data.length > 0) {
      Object.keys(data[0]).forEach((key) => {
        keys.set(key, key);
      });
      keys.delete('activo');
      keys.delete('createdAt');
      keys.delete('updatedAt');
    }
    if (isArray(exclude)) {
      exclude.forEach((key) => {
        keys.delete(key);
      });
    }
    const salida: any[] = [];
    let objs = { properties: {}, geometry: {} };
    let properties = {};
    for (const item of data) {
      keys.forEach((key) => {
        if (key === 'geom') {
          objs['geometry'] = item[key];
        }
        if (isObject(item[key]) && key !== 'geom') {
          properties[key] = item[key].toString();
        }
        if (!isObject(item[key]) && key !== 'geom') {
          properties[key] = item[key];
        }
        if (isDate(item[key])) {
          properties[key] = item[key].toLocaleDateString();
        }
        if (isBoolean(item[key])) {
          properties[key] = item[key] ? 'Si' : 'No';
        }
      });
      objs['properties'] = properties;
      salida.push(objs);
      properties = {};
      objs = { properties: {}, geometry: {} };
    }
    return salida;
  }

  async geoJsonById(
    id: number,
    exclude?: string[],
    reproyectar?: any,
  ): Promise<any> {
    let data: any;
    if (!reproyectar) {
      data = await super.findById(id);
    } else {
      const queryBuilder = this.repository.createQueryBuilder('q');
      if (this.relations) {
        for (const relation of this.relations) {
          queryBuilder.leftJoinAndSelect(`q.${relation}`, relation);
        }
      }
      queryBuilder.where(`q.activo = true AND q.id=:id`, { id: id });
      queryBuilder.addSelect(
        `ST_AsGeoJSON(ST_Transform(ST_SetSRID(q.geom,${reproyectar.origen}),${reproyectar.destino}))::json`,
        'geometry',
      );
      const result = await queryBuilder.getRawAndEntities();
      let entity: any;
      for (let i = 0; i < result.raw.length; i++) {
        entity = result.entities[i];
        entity.geom = result.raw[i].geometry;
        data = entity;
      }
    }
    const keys = new Map<string, string>();
    if (data) {
      Object.keys(data).forEach((key) => {
        keys.set(key, key);
      });
      keys.delete('activo');
      keys.delete('createdAt');
      keys.delete('updatedAt');
    }
    if (isArray(exclude)) {
      exclude.forEach((key) => {
        keys.delete(key);
      });
    }
    const objs = { properties: {}, geometry: {} };
    const properties = {};
    keys.forEach((key) => {
      if (key === 'geom') {
        objs['geometry'] = data[key];
      }
      if (isObject(data[key]) && key !== 'geom') {
        properties[key] = data[key].toString();
      }
      if (!isObject(data[key]) && key !== 'geom') {
        properties[key] = data[key];
      }
      if (isDate(data[key])) {
        properties[key] = data[key].toLocaleDateString();
      }
      if (isBoolean(data[key])) {
        properties[key] = data[key] ? 'Si' : 'No';
      }
    });
    objs['properties'] = properties;
    return objs;
  }
}

import { FindManyOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { IPaginationOptions, Pagination, PaginationLinks, PaginationMeta } from './types';

/**
 * Construye los enlaces de navegación de paginación.
 */
function buildLinks(
  route: string | undefined,
  page: number,
  limit: number,
  totalPages: number,
): PaginationLinks | undefined {
  if (!route) {
    return undefined;
  }
  const baseUrl = route.endsWith('/') ? route.slice(0, -1) : route;
  return new PaginationLinks(
    `${baseUrl}?page=1&limit=${limit}`,
    page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : '',
    page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : '',
    `${baseUrl}?page=${totalPages}&limit=${limit}`,
  );
}

/**
 * Paginación para repositorio.
 */
export async function paginate<T>(
  repository: Repository<T>,
  options: IPaginationOptions,
  findOptions?: FindManyOptions<T>,
): Promise<Pagination<T>>;

/**
 * Paginación para query builder.
 */
export async function paginate<T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions,
): Promise<Pagination<T>>;

export async function paginate<T>(
  repoOrQb: Repository<T> | SelectQueryBuilder<T>,
  options: IPaginationOptions,
  findOptions?: FindManyOptions<T>,
): Promise<Pagination<T>> {
  const { page = 1, limit = 10, route } = options;

  let items: T[];
  let totalItems: number;

  if (repoOrQb instanceof Repository) {
    const skip = (page - 1) * limit;
    [items, totalItems] = await (repoOrQb as Repository<T>).findAndCount({
      ...(findOptions || {}),
      take: limit,
      skip,
    });
  } else {
    const queryBuilder = repoOrQb as SelectQueryBuilder<T>;
    const skip = (page - 1) * limit;
    queryBuilder.take(limit).skip(skip);
    [items, totalItems] = await queryBuilder.getManyAndCount();
  }

  const totalPages = Math.ceil(totalItems / limit);
  const itemCount = items.length;
  const meta = new PaginationMeta(totalItems, itemCount, limit, totalPages, page);
  const links = buildLinks(route, page, limit, totalPages);

  return new Pagination(items, meta, links);
}

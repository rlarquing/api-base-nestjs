export interface IPaginationOptions {
  page: number;
  limit: number;
  route?: string;
}

export class PaginationMeta {
  constructor(
    public readonly totalItems: number,
    public readonly itemCount: number,
    public readonly itemsPerPage: number,
    public readonly totalPages: number,
    public readonly currentPage: number,
  ) {}
}

export class PaginationLinks {
  constructor(
    public readonly first?: string,
    public readonly previous?: string,
    public readonly next?: string,
    public readonly last?: string,
  ) {}
}

export class Pagination<PaginationObject> {
  constructor(
    public readonly items: PaginationObject[],
    public readonly meta: PaginationMeta,
    public readonly links?: PaginationLinks,
  ) {}
}

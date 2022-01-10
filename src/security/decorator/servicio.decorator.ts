import { SetMetadata } from '@nestjs/common';
export const Servicio = (controller: string, servicio: string) =>
  SetMetadata('servicio', controller + '.' + servicio);

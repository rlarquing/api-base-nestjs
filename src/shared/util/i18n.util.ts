import { I18nContext } from 'nestjs-i18n';

/**
 * Traduce una clave usando el idioma resuelto para la peticion en curso.
 *
 * `I18nContext.current()` es un accesor estatico basado en AsyncLocalStorage, por lo que
 * no hace falta inyectar `I18nService` en servicios ya existentes. Fuera de una peticion
 * HTTP (bootstrap, seeds, jobs, tests) no hay contexto y se devuelve el texto de reserva.
 */
export function traducir(
  clave: string,
  reserva: string,
  args?: Record<string, unknown>,
): string {
  const i18n = I18nContext.current();
  if (!i18n) {
    return reserva;
  }
  return i18n.t(clave, { args }) as string;
}

/**
 * Codigo del idioma resuelto para la peticion en curso, o undefined fuera de una peticion.
 * Se usa para resolver el contenido dinamico (traducciones guardadas en la base de datos).
 */
export function idiomaActual(): string | undefined {
  return I18nContext.current()?.lang;
}

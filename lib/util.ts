export const removeItemFromArr = (
  arr: any[],
  item: any,
  field: string,
): any[] => {
  return arr.filter((e) => e[field] !== item[field]);
};
export const removeFromArr = (arr: any[], item: any): any[] => {
  return arr.filter((e) => e !== item);
};
export const encuentra = (array: any[], elem: any, field: any): boolean => {
  return array.some((item: any) => item[field] === elem[field]);
};
export const eliminarDuplicado = (array: any): any[] => {
  const arreglado: any[] = [];
  array.forEach((element) => {
    arreglado.push(element.trim());
  });
  return arreglado.filter((item: any, index: number) => {
    return arreglado.indexOf(item) === index;
  });
};
export const findElemento = (lista: any[], elemento: any): any => {
  for (const item of lista) {
    if (item.indexOf(elemento) !== -1) {
      return item;
    }
  }
  return -1;
};

export const aInicialMayuscula = (str: string): string => {
  let result: string = str;
  if (result.length > 0) {
    result = result.substring(0, 1).toLocaleUpperCase();
  }
  if (str.length > 1) {
    result += str.substring(1);
  }
  return result;
};

export const quitarSeparador = (str: string, separador: string): string => {
  if (str.length === 0) {
    return '';
  }
  if (str.indexOf('_') !== -1) {
    separador = '_';
  }
  const resultado: any = str
    .split(separador)
    .map((item) => aInicialMayuscula(item));
  return resultado.join('');
};

export const eliminarSufijo = (str: string, s: string) => {
  if (right(str, s.length) === s) {
    return left(str, str.length - s.length);
  } else {
    return str;
  }
};
export const left = (str: string, l: number) => {
  return str.substring(0, l);
};
export const right = (str: string, l: number) => {
  return str.substring(str.length - l);
};

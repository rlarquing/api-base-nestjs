export const removeItemFromArr = (arr: any[], item: any, field: string): any[] => {
    return arr.filter(e => e[field] !== item[field]);
};
export const removeFromArr = (arr: any[], item: any): any[] => {
    return arr.filter(e => e !== item);
};
export const encuentra = (array: any[], elem: any, field: any): boolean => {
    return array.some((item: any) => item[field] === elem[field]);
};
export const eliminarDuplicado = (array: any): any[] => {
    let arreglado: any[] = [];
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
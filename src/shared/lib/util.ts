export const removeItemFromArr = (arr, item, field): any[] => {
    return arr.filter(e => e[field] !== item[field]);
};
export const removeFromArr = (arr, item): any[] => {
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
    return arreglado.filter((item, index) => {
        return arreglado.indexOf(item) === index;
    });
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupBy = exports.generarNuevoColor = exports.zNegativa = exports.zPositiva = exports.promedio = exports.ordenarElementosPorFecha = exports.compareDates = exports.color = exports.max = exports.min = exports.analizarFormulas = exports.intlRound = exports.parseFormula = exports.right = exports.left = exports.eliminarSufijo = exports.quitarSeparador = exports.formatearNombre = exports.esMayuscula = exports.aInicialMinuscula = exports.aInicialMayuscula = exports.findElemento = exports.eliminarDuplicado = exports.isEquals = exports.paginarArreglo = exports.buscarValor = exports.encuentra = exports.removeFromArr = exports.removeItemFromArr = void 0;
const removeItemFromArr = (arr, item, field) => {
    return arr.filter((e) => e[field] !== item[field]);
};
exports.removeItemFromArr = removeItemFromArr;
const removeFromArr = (arr, item) => {
    return arr.filter((e) => e !== item);
};
exports.removeFromArr = removeFromArr;
const encuentra = (array, elem, field) => {
    return array.some((item) => item[field] === elem[field]);
};
exports.encuentra = encuentra;
const buscarValor = (objetos, valor) => {
    return objetos.filter((objeto) => {
        return Object.values(objeto).some((campo) => String(campo).indexOf(valor) !== -1);
    });
};
exports.buscarValor = buscarValor;
const paginarArreglo = (arreglo, limit, offset) => {
    return arreglo.slice(offset, offset + limit);
};
exports.paginarArreglo = paginarArreglo;
const hasPrimitiveType = (x) => {
    return (typeof x == 'boolean' ||
        typeof x == 'number' ||
        typeof x == 'string' ||
        typeof x == 'symbol' ||
        x instanceof Boolean ||
        x instanceof Number ||
        x instanceof String);
};
const isEquals = (a, b) => {
    if (hasPrimitiveType(a) && hasPrimitiveType(b)) {
        return a === b;
    }
    else if (a instanceof Array && b instanceof Array) {
        if (a.length == 0) {
            return b.length == 0;
        }
        else if (b.length == 0) {
            return a.length == 0;
        }
        else if (a.length !== b.length) {
            return false;
        }
        else {
            for (let i = 0; i < a.length; i++) {
                if (!(0, exports.isEquals)(a[i], b[i])) {
                    return false;
                }
            }
        }
    }
    else {
        return deepEqual(a, b);
    }
    return true;
};
exports.isEquals = isEquals;
const deepEqual = (object1, object2) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if ((areObjects && !deepEqual(val1, val2)) ||
            (!areObjects && val1 !== val2)) {
            return false;
        }
    }
    return true;
};
function isObject(object) {
    return object != null && typeof object === 'object';
}
const eliminarDuplicado = (array) => {
    const newArray = [];
    let esta = false;
    for (let i = 0; i <= array.length - 1; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if ((0, exports.isEquals)(array[i], array[j])) {
                esta = true;
            }
        }
        if (!esta) {
            newArray.push(array[i]);
        }
        esta = false;
    }
    return newArray;
};
exports.eliminarDuplicado = eliminarDuplicado;
const findElemento = (lista, elemento) => {
    for (const item of lista) {
        if (deepEqual(item, elemento)) {
            return item;
        }
    }
    return -1;
};
exports.findElemento = findElemento;
const aInicialMayuscula = (str) => {
    let result = str;
    if (result.length > 0) {
        result = result.substring(0, 1).toLocaleUpperCase();
    }
    if (str.length > 1) {
        result += str.substring(1);
    }
    return result;
};
exports.aInicialMayuscula = aInicialMayuscula;
const aInicialMinuscula = (str) => {
    let result = str;
    if (result.length > 0) {
        result = result.substring(0, 1).toLocaleLowerCase();
    }
    if (str.length > 1) {
        result += str.substring(1);
    }
    return result;
};
exports.aInicialMinuscula = aInicialMinuscula;
const esMayuscula = (char) => {
    return char === char.toLocaleUpperCase();
};
exports.esMayuscula = esMayuscula;
const formatearNombre = (str, separador) => {
    if (str.length === 0) {
        return '';
    }
    if (str.indexOf('_') !== -1) {
        separador = '_';
    }
    let resultado = str[0].toLocaleLowerCase();
    for (let i = 1; i < str.length; i++) {
        if ((0, exports.esMayuscula)(str[i])) {
            resultado += separador;
        }
        resultado += str[i].toLocaleLowerCase();
    }
    return resultado;
};
exports.formatearNombre = formatearNombre;
const quitarSeparador = (str, separador) => {
    if (str.length === 0) {
        return '';
    }
    if (str.indexOf('_') !== -1) {
        separador = '_';
    }
    const resultado = str
        .split(separador)
        .map((item) => (0, exports.aInicialMayuscula)(item));
    return resultado.join('');
};
exports.quitarSeparador = quitarSeparador;
const eliminarSufijo = (str, s) => {
    if ((0, exports.right)(str, s.length) === s) {
        return (0, exports.left)(str, str.length - s.length);
    }
    else {
        return str;
    }
};
exports.eliminarSufijo = eliminarSufijo;
const left = (str, l) => {
    return str.substring(0, l);
};
exports.left = left;
const right = (str, l) => {
    return str.substring(str.length - l);
};
exports.right = right;
const parseFormula = (expression, solver) => {
    let _f;
    function isOperation(l) {
        const tmp = String(l).trim();
        return (tmp.indexOf('+') !== -1 ||
            tmp.indexOf('-') !== -1 ||
            tmp.indexOf('*') !== -1 ||
            tmp.indexOf('/') !== -1 ||
            tmp.indexOf('(') !== -1 ||
            tmp.indexOf(')') !== -1);
    }
    function isNumber(str) {
        try {
            const tmp = Number(String(str).trim());
            return !((str !== 0 && str !== '0' && tmp === 0) || isNaN(tmp));
        }
        catch (e) {
            return false;
        }
    }
    function _evaluate(l, r) {
        if (r >= _f.length) {
            r = _f.length - 1;
        }
        let wo, op, k;
        let t1 = 0;
        let t2 = 0;
        k = 0;
        wo = 0;
        op = 8;
        function substituir(s, start, end, subStr) {
            const prefijo = start === 0 ? '' : s.substring(0, start);
            const sufijo = end === s.length - 1 ? '' : s.substring(end + 1);
            return prefijo + subStr + sufijo;
        }
        function sintaxCheck(cadena, posicion) {
            let endComment;
            if (!cadena ||
                cadena.length === 0 ||
                posicion < 0 ||
                posicion >= cadena.length) {
                return -1;
            }
            const pares = [
                { start: '(', end: ')' },
                { start: '{', end: '}' },
                { start: '[', end: ']' },
            ];
            if (cadena.substring(posicion, posicion + 2) === '//') {
                endComment = cadena.indexOf('\n', posicion + 2);
                if (endComment === -1) {
                    return cadena.length - 1;
                }
                return endComment + 1;
            }
            else if (cadena.substring(posicion, posicion + 2) === '/*') {
                endComment = cadena.indexOf('*/', posicion + 2);
                return endComment;
            }
            switch (cadena[posicion]) {
                case "'":
                    return cadena.indexOf("'", posicion + 1);
                case '`':
                    return (posicion = cadena.indexOf('`', posicion + 1));
                case '"':
                    return cadena.indexOf('"', posicion + 1);
                default: {
                    let q;
                    for (let i = 0; i < pares.length; i++) {
                        if (cadena.substr(posicion, pares[i].start.length) === pares[i].start) {
                            q = posicion + pares[i].start.length;
                            while (q !== -1 && q < cadena.length) {
                                if (cadena.substr(q, pares[i].end.length) === pares[i].end) {
                                    return q + pares[i].end.length - 1;
                                }
                                else {
                                    q = sintaxCheck(cadena, q);
                                    if (q !== -1 && q < cadena.length) {
                                        q++;
                                    }
                                    else {
                                        return -1;
                                    }
                                }
                            }
                            return -1;
                        }
                    }
                }
            }
            return posicion;
        }
        let wep;
        let delta;
        if (_f.charAt(l) === '(' && _f.charAt(r) === ')') {
            wep = sintaxCheck(_f, l);
            if (wep && wep - 1 <= r) {
                if (wep - 1 === r) {
                    return _evaluate(l + 1, r - 1);
                }
                else {
                    delta = _f.length;
                    _f = substituir(_f, l, wep - 1, _evaluate(l + 1, wep - 2));
                    delta = delta - _f.length;
                    r = r - delta;
                }
            }
        }
        for (let i = l; i < r; i = i + 1) {
            if (k < 0)
                throw new Error(`La expresión tiene ${_f}, tiene paréntesis mal formados en la posición ${i}.`);
            switch (_f.charAt(i)) {
                case '(': {
                    k = k + 1;
                    break;
                }
                case ')': {
                    k = k - 1;
                    break;
                }
                case '+': {
                    if (k == 0) {
                        wo = i;
                        op = 1;
                    }
                    break;
                }
                case '-': {
                    if (k == 0) {
                        wo = i;
                        op = 2;
                    }
                    break;
                }
                case '*': {
                    if (k == 0 && op > 2) {
                        wo = i;
                        op = 3;
                    }
                    break;
                }
                case '/': {
                    if (k == 0 && op > 2) {
                        wo = i;
                        op = 4;
                    }
                    break;
                }
            }
        }
        if (op < 5) {
            t1 = _evaluate(l, wo - 1);
            t2 = _evaluate(wo + 1, r);
        }
        switch (op) {
            case 1:
                return String(Number(t1) + Number(t2));
            case 2:
                return String(Number(t1) - Number(t2));
            case 3:
                return String(Number(t1) * Number(t2));
            case 4:
                return String(Number(t1) / Number(t2));
        }
        const tmp = String(_f)
            .substring(l, r + 1)
            .trim();
        if (!isOperation(tmp) && !isNumber(tmp)) {
            if (solver) {
                return solver(tmp);
            }
            else {
                throw new Error('Necesita resolver una referencia a: ' + tmp.trim());
            }
        }
        return tmp;
    }
    _f = String(expression);
    return _evaluate(0, _f.length - 1);
};
exports.parseFormula = parseFormula;
const intlRound = (numero, decimales = 2, usarComa = false) => {
    const opciones = {
        maximumFractionDigits: decimales,
        useGrouping: false,
    };
    return Number(new Intl.NumberFormat(usarComa ? 'es' : 'en', opciones).format(numero));
};
exports.intlRound = intlRound;
const analizarFormulas = (exp) => {
    const resultado = [];
    let indicador = '';
    let inPeriodo = false;
    let columna = '';
    let sustituir = '';
    for (let i = 0; i < exp.length; i++) {
        sustituir = sustituir + exp[i];
        if (exp.charCodeAt(i) > 32) {
            if ('abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZA_$áéíóúüÁÉÍÓÚÜ0123456789'.indexOf(exp[i]) !== -1) {
                if (inPeriodo) {
                    columna = columna + exp[i];
                }
                else {
                    indicador = indicador + exp[i];
                }
            }
            else if (exp[i] === '{') {
                inPeriodo = true;
            }
            else if (exp[i] === '}') {
                if (columna === '') {
                    indicador = '';
                }
                resultado.push({
                    indicador: indicador,
                    columna: columna,
                    sustituir: sustituir.trim(),
                });
                inPeriodo = false;
                indicador = '';
                columna = '';
                sustituir = '';
            }
            else if ('+-*/()'.indexOf(exp[i]) !== -1) {
                sustituir = sustituir.substring(0, sustituir.indexOf(exp[i]));
                if (indicador !== '' || columna !== '') {
                    if (columna === '') {
                        indicador = '';
                    }
                    resultado.push({
                        indicador: indicador,
                        columna: columna,
                        sustituir: sustituir.trim(),
                    });
                    indicador = '';
                    columna = '';
                    inPeriodo = false;
                    sustituir = '';
                }
            }
        }
    }
    if (indicador !== '' || columna !== '') {
        if (columna === '') {
            indicador = '';
        }
        sustituir = sustituir.trim();
        resultado.push({ indicador: indicador, columna: columna, sustituir });
    }
    return resultado;
};
exports.analizarFormulas = analizarFormulas;
const min = (array) => {
    return Math.min(...array);
};
exports.min = min;
const max = (array) => {
    return Math.max(...array);
};
exports.max = max;
const color = (valor) => {
    let color = '#ff0013';
    if (valor >= 0.9) {
        color = '#00ff1a';
    }
    else if (valor >= 0.6 && valor < 0.9) {
        color = '#fff900';
    }
    return color;
};
exports.color = color;
const compareDates = (d1, d2) => {
    let parts = d1.split('/');
    const dn1 = Number(parts[1] + parts[0]);
    parts = d2.split('/');
    const dn2 = Number(parts[1] + parts[0]);
    return dn1 <= dn2;
};
exports.compareDates = compareDates;
const ordenarElementosPorFecha = (array) => {
    const length = array.length;
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length - i - 1; j++) {
            if ((0, exports.compareDates)(array[j].fecha, array[j + 1].fecha)) {
                const tmp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = tmp;
            }
        }
    }
    return array;
};
exports.ordenarElementosPorFecha = ordenarElementosPorFecha;
const promedio = (array) => {
    let suma = 0;
    for (const number of array) {
        suma = suma + number;
    }
    return suma / array.length;
};
exports.promedio = promedio;
const zPositiva = (x, xMin, xMax) => {
    let z;
    if (x === xMin) {
        z = 0;
    }
    else if (x === xMax) {
        z = 1;
    }
    else {
        z = (x - xMin) / (xMax - xMin);
    }
    return z;
};
exports.zPositiva = zPositiva;
const zNegativa = (x, xMin, xMax) => {
    let z;
    if (x === xMax) {
        z = 0;
    }
    else if (x === xMin) {
        z = 1;
    }
    else {
        z = (xMax - x) / (xMax - xMin);
    }
    return z;
};
exports.zNegativa = zNegativa;
const generarNuevoColor = () => {
    let simbolos, color;
    simbolos = '0123456789ABCDEF';
    color = '#';
    for (let i = 0; i < 6; i++) {
        color = color + simbolos[Math.floor(Math.random() * 16)];
    }
    return color;
};
exports.generarNuevoColor = generarNuevoColor;
const groupBy = (list, keyGetter) => {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        }
        else {
            collection.push(item);
        }
    });
    return map;
};
exports.groupBy = groupBy;
//# sourceMappingURL=util.js.map
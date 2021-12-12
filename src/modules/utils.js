var module = {};

module.flattenShallow = function (array) {
    if (!array || !array.reduce) {
        return array;
    }

    return array.reduce(function (a, b) {
        var aIsArray = Array.isArray(a);
        var bIsArray = Array.isArray(b);

        if (aIsArray && bIsArray) {
            return a.concat(b);
        }
        if (aIsArray) {
            a.push(b);

            return a;
        }
        if (bIsArray) {
            return [a].concat(b);
        }

        return [a, b];
    });
};

module.isFlat = function (array) {
    if (!array) {
        return false;
    }

    for (var i = 0; i < array.length; ++i) {
        if (Array.isArray(array[i])) {
            return false;
        }
    }

    return true;
};

module.flatten = function () {
    var result = module.argsToArray.apply(null, arguments);

    while (!module.isFlat(result)) {
        result = module.flattenShallow(result);
    }

    return result;
};

module.argsToArray = function (args) {
    var result = [];

    module.arrayEach(args, function (value) {
        result.push(value);
    });

    return result;
};

module.numbers = function () {
    var possibleNumbers = this.flatten.apply(null, arguments);
    return possibleNumbers.filter(function (el) {
        return typeof el === 'number';
    });
};

module.cleanFloat = function (number) {
    var power = 1e14;
    return Math.round(number * power) / power;
};

module.parseBool = function (bool) {
    if (typeof bool === 'boolean') {
        return bool;
    }

    if (bool instanceof Error) {
        return bool;
    }

    if (typeof bool === 'number') {
        return bool !== 0;
    }

    if (typeof bool === 'string') {
        var up = bool.toUpperCase();
        if (up === 'TRUE') {
            return true;
        }

        if (up === 'FALSE') {
            return false;
        }
    }

    if (bool instanceof Date && !isNaN(bool)) {
        return true;
    }

    return error.value;
};

module.parseNumber = function (string) {
    if (string === undefined || string === '') {
        return error.value;
    }
    if (!isNaN(string)) {
        return parseFloat(string);
    }

    return error.value;
};

module.parseNumberArray = function (arr) {
    var len;

    if (!arr || (len = arr.length) === 0) {
        return error.value;
    }

    var parsed;

    while (len--) {
        parsed = module.parseNumber(arr[len]);
        if (parsed === error.value) {
            return parsed;
        }
        arr[len] = parsed;
    }

    return arr;
};

module.parseMatrix = function (matrix) {
    var n;

    if (!matrix || (n = matrix.length) === 0) {
        return error.value;
    }
    var pnarr;

    for (var i = 0; i < matrix.length; i++) {
        pnarr = module.parseNumberArray(matrix[i]);
        matrix[i] = pnarr;

        if (pnarr instanceof Error) {
            return pnarr;
        }
    }

    return matrix;
};

var d1900 = new Date(Date.UTC(1900, 0, 1));
module.parseDate = function (date) {
    if (!isNaN(date)) {
        if (date instanceof Date) {
            return new Date(date);
        }
        var d = parseInt(date, 10);
        if (d < 0) {
            return error.num;
        }
        if (d <= 60) {
            return new Date(d1900.getTime() + (d - 1) * 86400000);
        }
        return new Date(d1900.getTime() + (d - 2) * 86400000);
    }
    if (typeof date === 'string') {
        date = new Date(date);
        if (!isNaN(date)) {
            return date;
        }
    }
    return error.value;
};

module.parseDateArray = function (arr) {
    var len = arr.length;
    var parsed;
    while (len--) {
        parsed = this.parseDate(arr[len]);
        if (parsed === error.value) {
            return parsed;
        }
        arr[len] = parsed;
    }
    return arr;
};

module.anyIsError = function () {
    var n = arguments.length;
    while (n--) {
        if (arguments[n] instanceof Error) {
            return true;
        }
    }
    return false;
};

module.arrayValuesToNumbers = function (arr) {
    var n = arr.length;
    var el;
    while (n--) {
        el = arr[n];
        if (typeof el === 'number') {
            continue;
        }
        if (el === true) {
            arr[n] = 1;
            continue;
        }
        if (el === false) {
            arr[n] = 0;
            continue;
        }
        if (typeof el === 'string') {
            var number = this.parseNumber(el);
            if (number instanceof Error) {
                arr[n] = 0;
            } else {
                arr[n] = number;
            }
        }
    }
    return arr;
};

module.rest = function (array, idx) {
    idx = idx || 1;
    if (!array || typeof array.slice !== 'function') {
        return array;
    }
    return array.slice(idx);
};

module.initial = function (array, idx) {
    idx = idx || 1;
    if (!array || typeof array.slice !== 'function') {
        return array;
    }
    return array.slice(0, array.length - idx);
};

module.arrayEach = function (array, iteratee) {
    var index = -1, length = array.length;

    while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
            break;
        }
    }

    return array;
};

module.transpose = function (matrix) {
    if (!matrix) {
        return error.value;
    }

    return matrix[0].map(function (col, i) {
        return matrix.map(function (row) {
            return row[i];
        });
    });
};

export default module

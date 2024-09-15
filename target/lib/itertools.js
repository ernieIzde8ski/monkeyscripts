"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class itertools {
    static __bool(arg) {
        return !!arg;
    }
    static *__filter(__func, __iter) {
        for (const obj of __iter) {
            if (__func(obj)) {
                yield obj;
            }
        }
    }
    static *__map(__func, __iter) {
        for (const obj of __iter) {
            yield __func(obj);
        }
    }
    static *__filterMap(__func, __iter) {
        for (const obj of __iter) {
            const res = __func(obj);
            if (res !== undefined && res !== null) {
                yield res;
            }
        }
    }
    static *__flatten(__iters) {
        for (const iterable of __iters) {
            for (const obj of iterable) {
                yield obj;
            }
        }
    }
    static *__flatMap(__func, __keys) {
        for (const key of __keys) {
            const values = __func(key);
            for (const value of values) {
                yield value;
            }
        }
    }
    constructor(__iter) {
        this.__iter = __iter ?? [];
    }
    [Symbol.iterator]() {
        return this.__iter[Symbol.iterator]();
    }
    filter(__func) {
        const func = __func ?? itertools.__bool;
        const filter = itertools.__filter(func, this);
        return new itertools(filter);
    }
    map(__func) {
        const map = itertools.__map(__func, this);
        return new itertools(map);
    }
    filterMap(__func) {
        const filterMap = itertools.__filterMap(__func, this);
        return new itertools(filterMap);
    }
    flatten() {
        const flatten = itertools.__flatten(this);
        return new itertools(flatten);
    }
    chain(iterable) {
        const flatten = itertools.__flatten([this, iterable]);
        return new itertools(flatten);
    }
    flatMap(__func) {
        const flatMap = itertools.__flatMap(__func, this);
        return new itertools(flatMap);
    }
    collect() {
        return [...this];
    }
}
exports.default = itertools;

type Falsy = undefined | null | 0 | "" | false;
type NonFalsy<T> = Exclude<T, Falsy>;

class itertools<T> implements Iterable<T> {
  private __iter: Iterable<T>;

  protected static __bool<T>(arg: T): arg is NonFalsy<T> {
    return !!arg;
  }

  protected static *__filter<T>(
    __func: (t: T) => boolean,
    __iter: Iterable<T>,
  ) {
    for (const obj of __iter) {
      if (__func(obj)) {
        yield obj;
      }
    }
  }

  protected static *__map<T, U>(__func: (t: T) => U, __iter: Iterable<T>) {
    for (const obj of __iter) {
      yield __func(obj);
    }
  }

  protected static *__filterMap<T, U>(
    __func: (t: T) => U,
    __iter: Iterable<T>,
  ): Iterable<NonNullable<U>> {
    for (const obj of __iter) {
      const res = __func(obj);
      if (res !== undefined && res !== null) {
        yield res;
      }
    }
  }

  protected static *__flatten<T>(__iters: Iterable<Iterable<T>>): Iterable<T> {
    for (const iterable of __iters) {
      for (const obj of iterable) {
        yield obj;
      }
    }
  }

  protected static *__flatMap<T, U>(
    __func: (t: T) => Iterable<U>,
    __keys: Iterable<T>,
  ) {
    for (const key of __keys) {
      const values = __func(key);
      for (const value of values) {
        yield value;
      }
    }
  }

  constructor(__iter?: Iterable<T>) {
    this.__iter = __iter ?? [];
  }

  [Symbol.iterator](): Iterator<T> {
    return this.__iter[Symbol.iterator]();
  }

  filter(): itertools<Exclude<T, Falsy>>;
  filter<U extends T>(__func: (t: T) => t is U): itertools<U>;
  filter(__func?: (t: T) => boolean) {
    const func = __func ?? itertools.__bool;
    const filter = itertools.__filter(func, this);
    return new itertools(filter);
  }

  map<U>(__func: (t: T) => U): itertools<U> {
    const map = itertools.__map(__func, this);
    return new itertools(map);
  }

  filterMap<U>(__func: (t: T) => U): itertools<NonNullable<U>> {
    const filterMap = itertools.__filterMap(__func, this);
    return new itertools(filterMap);
  }

  flatten<U>(this: itertools<Iterable<U>>): itertools<U> {
    const flatten = itertools.__flatten(this);
    return new itertools(flatten);
  }

  chain(iterable: Iterable<T>) {
    const flatten = itertools.__flatten([this, iterable]);
    return new itertools(flatten);
  }

  flatMap<U>(__func: (t: T) => Iterable<U>): itertools<U> {
    const flatMap = itertools.__flatMap(__func, this);
    return new itertools(flatMap);
  }

  collect(): Array<T> {
    return [...this];
  }
}

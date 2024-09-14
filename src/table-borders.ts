// ==UserScript==
// @name         Table Borders
// @namespace    http://tampermonkey.net
// @version      1.0
// @description  Add table borders to various menus for readability.
// @author       Ernie Serrano
// @match        https://www.reddit.com/settings/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @updateURL    https://raw.githubusercontent.com/ernieIzde8ski/monkeyscripts/master/target/table-borders.ts
// @downloadURL  https://raw.githubusercontent.com/ernieIzde8ski/monkeyscripts/master/target/table-borders.ts
// @supportURL   https://github.com/ernieIzde8ski/monkeyscripts/issues
// ==/UserScript==

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

  constructor(__iter: Iterable<T>) {
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

const RAW_STYLE_SHEETS = Object.freeze({
  reddit: `:host>div>div,
:host>div>label,
:host>div>ul,
:host>ul>label,
settings-account-section>div,
settings-account-section>label,
settings-account-section>ul>label { border: 1px solid black; padding: 5px}`,
});

function newStyleElement(
  css: keyof typeof RAW_STYLE_SHEETS,
  id?: string,
): HTMLStyleElement {
  const styleElement = document.createElement("style");
  styleElement.setAttribute("type", "text/css");

  const rawStyleSheet = RAW_STYLE_SHEETS[css];
  const styleTextNode = document.createTextNode(rawStyleSheet);
  styleElement.appendChild(styleTextNode);

  if (typeof id == "string") {
    styleElement.id = id;
  }

  return styleElement;
}

function elemHasShadowRoot(
  elem: Element,
): elem is Element & { shadowRoot: ShadowRoot } {
  return !(elem.shadowRoot === null);
}

function updateBorders() {
  if (
    document.URL.match(/https:\/\/(?:www\.)?reddit.com\/settings(?:\/\w+)?/gm)
  ) {
    const accountSection = new itertools(["settings-account-section"]).flatMap(
      (s) => document.getElementsByTagName(s),
    );

    const shadowElements = new itertools([
      "settings-emails",
      "settings-notifications-section",
      "settings-privacy-section",
      "settings-profile-section",
      "settings-preferences",
    ])
      .flatMap((s) => document.getElementsByTagName(s))
      .chain(accountSection);

    for (const elem of shadowElements) {
      const styleID = elem.tagName + "-table-style";
      const root = elem.shadowRoot ?? document;

      if (root.getElementById(styleID) === null) {
        let head = elem.shadowRoot ?? document.querySelector("head")!;
        let style = newStyleElement("reddit", styleID);
        head.appendChild(style);
        console.log("TABLE BORDERS SCRIPT RAN SUCCCESSFULLY!");
      }
    }
  } else {
    throw "unrecognized url: " + document.URL;
  }
}

window.setInterval(updateBorders, 250);

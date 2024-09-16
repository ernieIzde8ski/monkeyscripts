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
// @require      https://raw.githubusercontent.com/ernieIzde8ski/monkeyscripts/master/lib/itertools.js
// ==/UserScript==
const RAW_STYLE_SHEETS = Object.freeze({
    reddit: `:host>div>div,
:host>div>label,
:host>div>ul,
:host>ul>label,
settings-account-section>div,
settings-account-section>label,
settings-account-section>ul>label { border: 1px solid black; padding: 5px}`,
});
function newStyleElement(css, id) {
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
function elemHasShadowRoot(elem) {
    return !(elem.shadowRoot === null);
}
function updateBorders() {
    if (document.URL.match(/https:\/\/(?:www\.)?reddit.com\/settings(?:\/\w+)?/gm)) {
        const accountSection = new itertools(["settings-account-section"]).flatMap((s) => document.getElementsByTagName(s));
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
                let head = elem.shadowRoot ?? document.querySelector("head");
                let style = newStyleElement("reddit", styleID);
                head.appendChild(style);
                console.log("TABLE BORDERS SCRIPT RAN SUCCCESSFULLY!");
            }
        }
    }
    else {
        throw "unrecognized url: " + document.URL;
    }
}
window.setInterval(updateBorders, 250);

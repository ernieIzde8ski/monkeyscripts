// ==UserScript==
// @name         Memum Badge Fixer
// @namespace    http://tampermonkey.net
// @version      1.0
// @description  Fix memum badges.
// @author       Ernie Serrano
// @match        https://www.memum.io/player/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=memum.io
// @grant        none
// @updateURL    https://raw.githubusercontent.com/ernieIzde8ski/monkeyscripts/master/dist/memumio-badge.js
// @downloadURL  https://raw.githubusercontent.com/ernieIzde8ski/monkeyscripts/master/dist/memumio-badge.js
// @supportURL   https://github.com/ernieIzde8ski/monkeyscripts/issues
// ==/UserScript==

let fixBadgesInterval: number | null = null;

function fixBadges() {
  for (const badge of document.getElementsByClassName("badge")) {
    const newHTML = badge.innerHTML.replace("Moderator", "Manger");
    badge.innerHTML = newHTML;

    if (fixBadgesInterval !== null) {
      clearInterval(fixBadgesInterval);
    }
  }
}

setInterval(fixBadges, 250);

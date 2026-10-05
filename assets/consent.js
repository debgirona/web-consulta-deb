/* Aviso de cookies y carga condicionada del mapa. No usa cookies: guarda la elección en el almacenamiento local. */
(function () {
  'use strict';
  var KEY = 'dp-cookies', VERSION = 1, MAX_AGE = 365 * 24 * 60 * 60 * 1000;
  var ca = (document.documentElement.lang || 'es').slice(0, 2) === 'ca';
  var me = document.currentScript;
  var policy = (me && me.getAttribute('data-policy')) || 'cookies';
  var T = ca ? {
    title: 'Cookies',
    text: 'Aquesta web no fa servir cookies d’analítica ni de publicitat. El mapa de Google de la pàgina de contacte sí que pot instal·lar cookies de tercers, i només es carregarà si ho acceptes. Pots canviar la teva elecció quan vulguis a «Configuració de cookies», al peu de la pàgina.',
    more: 'Política de cookies', accept: 'Acceptar', reject: 'Rebutjar', label: 'Avís de cookies'
  } : {
    title: 'Cookies',
    text: 'Esta web no usa cookies de analítica ni de publicidad. El mapa de Google de la página de contacto sí puede instalar cookies de terceros, y solo se cargará si lo aceptas. Puedes cambiar tu elección cuando quieras en «Configuración de cookies», al pie de la página.',
    more: 'Política de cookies', accept: 'Aceptar', reject: 'Rechazar', label: 'Aviso de cookies'
  };

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      if (v && v.v === VERSION && (v.c === 'all' || v.c === 'none') && Date.now() - v.t < MAX_AGE) return v.c;
    } catch (e) {}
    return null;
  }
  function save(c) { try { localStorage.setItem(KEY, JSON.stringify({ v: VERSION, c: c, t: Date.now() })); } catch (e) {} }

  var placeholders = [];
  function boxes() { return Array.prototype.slice.call(document.querySelectorAll('[data-map]')); }
  function loadMap(box) {
    if (box.querySelector('iframe')) return;
    placeholders.push([box, box.innerHTML]);
    var f = document.createElement('iframe');
    f.src = box.getAttribute('data-src');
    f.title = box.getAttribute('data-title') || '';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    f.width = '600'; f.height = '260';
    f.style.cssText = 'width:100%;height:260px;border:0;display:block';
    box.innerHTML = '';
    box.classList.add('dpm-on');
    box.appendChild(f);
  }
  function unloadMaps() {
    placeholders.forEach(function (p) { p[0].innerHTML = p[1]; p[0].classList.remove('dpm-on'); });
    placeholders = [];
  }
  function apply(c) { if (c === 'all') boxes().forEach(loadMap); else unloadMaps(); }

  var banner = null;
  function close() { if (banner) { banner.parentNode.removeChild(banner); banner = null; } }
  function open() {
    if (banner) return;
    banner = document.createElement('div');
    banner.className = 'dpc';
    banner.id = 'dp-cookies';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', T.label);
    banner.innerHTML =
      '<div class="dpc-in"><div class="dpc-txt"><p class="dpc-title">' + T.title + '</p><p>' + T.text +
      ' <a href="' + policy + '">' + T.more + '</a></p></div>' +
      '<div class="dpc-btns"><button type="button" class="dpc-btn" data-c="none">' + T.reject + '</button>' +
      '<button type="button" class="dpc-btn" data-c="all">' + T.accept + '</button></div></div>';
    banner.addEventListener('click', function (e) {
      var c = e.target && e.target.getAttribute && e.target.getAttribute('data-c');
      if (!c) return;
      save(c); apply(c); close();
    });
    document.body.appendChild(banner);
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var b = t.closest('[data-map-load]');
    if (b) { var box = b.closest('[data-map]'); if (box) loadMap(box); return; }
    if (t.closest('[data-cookie-settings]')) { e.preventDefault(); open(); }
  });

  function start() { var c = read(); if (c) apply(c); else open(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

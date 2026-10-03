(function () {
  var view = document.getElementById('view');
  var search = document.getElementById('search');
  var data = { developer: {}, apps: [] };

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { n.appendChild(c); });
    return n;
  }

  function card(a) {
    return el('a', { class: 'card', href: '#/app/' + encodeURIComponent(a.id) }, [
      el('img', { src: a.icon, alt: '', loading: 'lazy' }),
      el('div', {}, [
        el('h3', { text: a.name }),
        el('p', { text: a.tagline || '' }),
        el('p', { text: [a.category, 'v' + a.version].filter(Boolean).join(' · ') })
      ])
    ]);
  }

  function renderList() {
    var q = search.value.trim().toLowerCase();
    var apps = data.apps.filter(function (a) {
      return !q || (a.name + ' ' + (a.tagline || '') + ' ' + (a.category || '')).toLowerCase().indexOf(q) !== -1;
    });
    view.replaceChildren(
      el('h1', { text: data.developer.name || 'Apps' }),
      el('p', { class: 'muted', text: data.developer.tagline || '' }),
      apps.length
        ? el('div', { class: 'grid' }, apps.map(card))
        : el('p', { class: 'muted', text: 'No apps found.' })
    );
  }

  function stat(label, value) {
    return el('div', { class: 'stat' }, [el('b', { text: value }), el('span', { text: label })]);
  }

  function renderApp(id) {
    var a = data.apps.filter(function (x) { return x.id === id; })[0];
    if (!a) { view.replaceChildren(el('p', { text: 'App not found.' }), el('a', { href: '#/', text: 'Back to all apps' })); return; }
    document.title = a.name + ' | Bulex Apps';

    var nodes = [
      el('a', { class: 'back', href: '#/', text: '← All apps' }),
      el('div', { class: 'hero' }, [
        el('img', { src: a.icon, alt: '' }),
        el('div', {}, [el('h1', { text: a.name }), el('div', { class: 'muted', text: a.tagline || '' })])
      ]),
      el('div', { class: 'stats' }, [
        stat('Version', a.version), stat('Size', a.size),
        stat('Android', a.minAndroid + '+'), stat('Updated', a.updated)
      ].filter(function (s) { return s.firstChild.textContent && s.firstChild.textContent !== 'undefined+'; })),
      el('a', { class: 'btn', href: a.apk, download: '', text: 'Download APK' })
    ];

    if (a.screenshots && a.screenshots.length) {
      nodes.push(el('h2', { text: 'Screenshots' }));
      nodes.push(el('div', { class: 'shots' }, a.screenshots.map(function (s) {
        return el('img', { src: s, alt: a.name + ' screenshot', loading: 'lazy' });
      })));
    }
    nodes.push(el('h2', { text: 'About' }), el('p', { text: a.description || '' }));

    if (a.changelog && a.changelog.length) {
      nodes.push(el('h2', { text: 'What is new' }));
      nodes.push(el('ul', { class: 'log' }, a.changelog.map(function (c) { return el('li', { text: c }); })));
    }
    if (a.sha256) {
      nodes.push(el('h2', { text: 'Verify download' }));
      nodes.push(el('p', { class: 'small', text: 'SHA-256 checksum:' }));
      nodes.push(el('code', { text: a.sha256 }));
    }
    view.replaceChildren.apply(view, nodes);
  }

  function route() {
    document.title = 'Bulex Apps';
    var m = location.hash.match(/^#\/app\/(.+)$/);
    window.scrollTo(0, 0);
    if (m) renderApp(decodeURIComponent(m[1])); else renderList();
  }

  search.addEventListener('input', function () {
    if (location.hash !== '#/' && location.hash !== '') location.hash = '#/';
    else renderList();
  });
  window.addEventListener('hashchange', route);

  fetch('apps.json')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      data = d;
      var dev = d.developer || {};
      document.getElementById('brand').textContent = (dev.name || 'Bulex') + ' Apps';
      document.getElementById('foot-text').textContent = dev.email ? 'Contact: ' + dev.email : '';
      route();
    })
    .catch(function () {
      view.textContent = 'Could not load apps.json. Serve the site over HTTP, not file://.';
    });
})();

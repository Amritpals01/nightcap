(function () {
  'use strict';

  var STORAGE_KEY = 'nightcap_cart_v1';

  function buildCatalog() {
    var map = {};
    if (typeof WHISKEY_ITEMS !== 'undefined' && typeof sellingPrice === 'function') {
      WHISKEY_ITEMS.forEach(function (item) {
        map[item.id] = {
          id: item.id,
          name: item.name,
          price: sellingPrice(item.basePrice),
          image: item.image,
        };
      });
    }
    if (typeof OTHER_ITEMS !== 'undefined') {
      OTHER_ITEMS.forEach(function (item) {
        map[item.id] = {
          id: item.id,
          name: item.name,
          price: item.price,
          image: null,
        };
      });
    }
    return map;
  }

  function formatMoney(n) {
    return '$' + n.toLocaleString('en-CA', { maximumFractionDigits: 0 });
  }

  function loadCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    } catch (e) {}
    return {};
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {}
  }

  function getTotalCount(cart) {
    var n = 0;
    Object.keys(cart).forEach(function (id) {
      var q = cart[id];
      if (typeof q === 'number' && q > 0) n += q;
    });
    return n;
  }

  function computeSubtotal(catalog, cart) {
    var sum = 0;
    Object.keys(cart).forEach(function (id) {
      var q = cart[id];
      var row = catalog[id];
      if (row && typeof q === 'number' && q > 0) sum += row.price * q;
    });
    return sum;
  }

  function setBodyCartOpen(open) {
    document.body.classList.toggle('cart-drawer-open', open);
  }

  function updateBadge(cart) {
    var el = document.getElementById('cart-count');
    if (!el) return;
    var c = getTotalCount(cart);
    el.textContent = c > 99 ? '99+' : String(c);
    el.classList.toggle('cart-count--empty', c === 0);
  }

  function renderCart(catalog, cart) {
    var linesEl = document.getElementById('cart-lines');
    var emptyEl = document.getElementById('cart-empty');
    var subEl = document.getElementById('cart-subtotal');
    if (!linesEl || !emptyEl || !subEl) return;

    var ids = Object.keys(cart).filter(function (id) {
      return catalog[id] && cart[id] > 0;
    });

    if (ids.length === 0) {
      linesEl.innerHTML = '';
      emptyEl.hidden = false;
      subEl.textContent = formatMoney(0);
      return;
    }

    emptyEl.hidden = true;
    var html = '';
    ids.forEach(function (id) {
      var row = catalog[id];
      var qty = cart[id];
      var lineTotal = row.price * qty;
      var thumb =
        row.image ?
          '<img class="cart-line-img" src="' +
          row.image +
          '" alt="" width="56" height="56" loading="lazy">' :
          '<div class="cart-line-placeholder" aria-hidden="true">🥃</div>';
      html +=
        '<div class="cart-line" data-cart-id="' +
        id +
        '">' +
        thumb +
        '<div class="cart-line-main">' +
        '<div class="cart-line-title">' +
        row.name +
        '</div>' +
        '<div class="cart-line-meta">' +
        formatMoney(row.price) +
        ' each</div>' +
        '<div class="cart-line-controls">' +
        '<button type="button" class="cart-qty-btn" data-cart-action="dec" aria-label="Decrease quantity">−</button>' +
        '<span class="cart-qty-val">' +
        qty +
        '</span>' +
        '<button type="button" class="cart-qty-btn" data-cart-action="inc" aria-label="Increase quantity">+</button>' +
        '</div>' +
        '</div>' +
        '<div class="cart-line-side">' +
        '<span class="cart-line-total">' +
        formatMoney(lineTotal) +
        '</span>' +
        '<button type="button" class="cart-remove" data-cart-action="remove" aria-label="Remove item">Remove</button>' +
        '</div>' +
        '</div>';
    });
    linesEl.innerHTML = html;
    subEl.textContent = formatMoney(computeSubtotal(catalog, cart));
  }

  function refreshUI(catalog, cart) {
    saveCart(cart);
    updateBadge(cart);
    renderCart(catalog, cart);
  }

  function openDrawer(toggle) {
    var nav = document.getElementById('site-nav');
    var navToggle = document.getElementById('nav-toggle');
    if (nav && navToggle) {
      nav.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
    var drawer = document.getElementById('cart-drawer');
    var overlay = document.getElementById('cart-overlay');
    if (!drawer || !overlay) return;
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    setBodyCartOpen(true);
  }

  function closeDrawer(toggle) {
    var drawer = document.getElementById('cart-drawer');
    var overlay = document.getElementById('cart-overlay');
    if (!drawer || !overlay) return;
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    var btn = toggle || document.getElementById('cart-toggle');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    setBodyCartOpen(false);
  }

  function init() {
    var catalog = buildCatalog();
    var cart = loadCart();

    refreshUI(catalog, cart);

    var toggle = document.getElementById('cart-toggle');
    var closeBtn = document.getElementById('cart-close');
    var overlay = document.getElementById('cart-overlay');

    if (toggle) {
      toggle.addEventListener('click', function () {
        var drawer = document.getElementById('cart-drawer');
        if (!drawer) return;
        var open = drawer.classList.contains('is-open');
        if (open) closeDrawer(toggle);
        else openDrawer(toggle);
      });
    }
    if (closeBtn) closeBtn.addEventListener('click', function () {
      closeDrawer(toggle);
    });
    if (overlay) {
      overlay.addEventListener('click', function () {
        closeDrawer(toggle);
      });
    }

    var drawerEl = document.getElementById('cart-drawer');
    if (drawerEl) {
      drawerEl.addEventListener('click', function (e) {
        if (e.target.closest('.cart-checkout')) closeDrawer(toggle);
      });
    }

    document.addEventListener('click', function (e) {
      var addBtn = e.target.closest('[data-add-cart]');
      if (!addBtn) return;
      var id = addBtn.getAttribute('data-add-cart');
      if (!id || !catalog[id]) return;
      e.preventDefault();
      cart[id] = (cart[id] || 0) + 1;
      refreshUI(catalog, cart);
      openDrawer(toggle);
    });

    var linesEl = document.getElementById('cart-lines');
    if (linesEl) {
      linesEl.addEventListener('click', function (e) {
        var line = e.target.closest('.cart-line');
        if (!line) return;
        var id = line.getAttribute('data-cart-id');
        var actionBtn = e.target.closest('[data-cart-action]');
        if (!actionBtn || !id || !catalog[id]) return;
        var action = actionBtn.getAttribute('data-cart-action');
        var qty = cart[id] || 0;
        if (action === 'inc') cart[id] = qty + 1;
        else if (action === 'dec') cart[id] = Math.max(0, qty - 1);
        else if (action === 'remove') cart[id] = 0;
        if (!cart[id]) delete cart[id];
        refreshUI(catalog, cart);
      });
    }

    var clearBtn = document.getElementById('cart-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        cart = {};
        refreshUI(catalog, cart);
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer(toggle);
    });

    window.NightcapCart = {
      getCart: function () {
        return Object.assign({}, cart);
      },
      getCatalog: function () {
        return Object.assign({}, catalog);
      },
      refresh: function () {
        catalog = buildCatalog();
        cart = loadCart();
        refreshUI(catalog, cart);
      },
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

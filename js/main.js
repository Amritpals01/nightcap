(function () {
  'use strict';

  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  const useFinePointer =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: fine)').matches;

  let mx = 0;
  let my = 0;
  let rx = 0;
  let ry = 0;

  if (useFinePointer && cursor && ring) {
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });

    function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animRing);
    }
    animRing();

    document.querySelectorAll('a, button, .product-card, .whiskey-card, .step, .hood, .cart-toggle, .btn-add-cart').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        ring.style.width = '60px';
        ring.style.height = '60px';
      });
      el.addEventListener('mouseleave', function () {
        cursor.style.width = '12px';
        cursor.style.height = '12px';
        ring.style.width = '40px';
        ring.style.height = '40px';
      });
    });
  } else {
    if (cursor) cursor.style.display = 'none';
    if (ring) ring.style.display = 'none';
  }

  window.enterSite = function () {
    var gate = document.getElementById('age-gate');
    if (gate) gate.classList.add('hidden');
    try {
      sessionStorage.setItem('ageVerified', '1');
    } catch (e) {}
  };

  if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('ageVerified')) {
    var ag = document.getElementById('age-gate');
    if (ag) ag.classList.add('hidden');
  }

  function prefersReducedMotion() {
    return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function isMobileViewport() {
    return typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 900px)').matches;
  }

  var starsEl = document.getElementById('stars');
  if (starsEl) {
    var reducedStars = prefersReducedMotion();
    var mobileStars = isMobileViewport();
    var starCount = reducedStars ? 28 : mobileStars ? 52 : 120;
    var dLo = reducedStars ? 4 : mobileStars ? 5 : 3;
    var dHi = reducedStars ? 9 : mobileStars ? 14 : 7;
    var opLo = mobileStars ? 0.22 : 0.3;
    for (var i = 0; i < starCount; i++) {
      var s = document.createElement('div');
      s.className = 'star';
      var size = Math.random() * (mobileStars ? 2 : 2.5) + 0.5;
      s.style.cssText =
        'left:' +
        Math.random() * 100 +
        '%;top:' +
        Math.random() * 100 +
        '%;width:' +
        size +
        'px;height:' +
        size +
        'px;--d:' +
        (dLo + Math.random() * (dHi - dLo)) +
        's;--delay:' +
        Math.random() * (mobileStars ? 8 : 6) +
        's;--op:' +
        (opLo + Math.random() * (mobileStars ? 0.55 : 0.7));
      starsEl.appendChild(s);
    }
  }

  function updateClock() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();
    var h12 = h % 12 || 12;
    var ampm = h >= 12 ? 'PM' : 'AM';
    function pad(n) {
      return String(n).padStart(2, '0');
    }
    var live = document.getElementById('live-clock');
    if (live) live.textContent = h12 + ':' + pad(m) + ' ' + ampm;

    var isOpen = h >= 23 || h < 4;
    var dot = document.getElementById('status-dot');
    var txt = document.getElementById('status-text');
    if (dot && txt) {
      if (isOpen) {
        dot.classList.add('open');
        txt.textContent = 'We are OPEN — Delivering Now';
      } else {
        dot.classList.remove('open');
        txt.textContent = 'Opens tonight at 11:00 PM';
      }
    }

    var hDeg = ((h % 12) + m / 60) * 30;
    var mDeg = (m + s / 60) * 6;
    var sDeg = s * 6;
    var hh = document.getElementById('hour-hand');
    var mm = document.getElementById('min-hand');
    var ss = document.getElementById('sec-hand');
    if (hh) hh.style.transform = 'rotate(' + hDeg + 'deg)';
    if (mm) mm.style.transform = 'rotate(' + mDeg + 'deg)';
    if (ss) ss.style.transform = 'rotate(' + sDeg + 'deg)';
  }
  updateClock();
  setInterval(updateClock, 1000);

  var revealObserverOpts = isMobileViewport()
    ? { threshold: 0.08, rootMargin: '0px 0px -4% 0px' }
    : { threshold: 0.15 };
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    },
    revealObserverOpts
  );
  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });

  function renderWhiskey() {
    var grid = document.getElementById('whiskey-grid');
    if (!grid || typeof WHISKEY_ITEMS === 'undefined' || typeof sellingPrice !== 'function') return;

    grid.innerHTML = WHISKEY_ITEMS.map(function (item) {
      var sell = sellingPrice(item.basePrice);
      var badge =
        item.badge ?
          '<div class="product-badge whiskey-badge">' +
          item.badge +
          '</div>' :
          '';
      return (
        '<article class="product-card whiskey-card reveal">' +
        badge +
        '<div class="whiskey-img-wrap">' +
        '<img class="whiskey-bottle-img" src="' +
        item.image +
        '" alt="' +
        item.name +
        ' bottle" loading="lazy" width="480" height="480">' +
        '</div>' +
        '<p class="product-tag">' +
        item.size +
        '</p>' +
        '<h3 class="product-name">' +
        item.name +
        '</h3>' +
        '<p class="product-desc">' +
        item.desc +
        '</p>' +
        '<div class="price-stack">' +
        '<span class="price-ref">Ref. retail ~ $' +
        item.basePrice +
        ' CAD</span>' +
        '<span class="product-price">Your price $' +
        sell +
        '</span>' +
        '<span class="price-note">Includes 40% service markup</span>' +
        '</div>' +
        '<button type="button" class="btn-add-cart" data-add-cart="' +
        item.id +
        '">Add to cart — $' +
        sell +
        '</button>' +
        '</article>'
      );
    }).join('');

    grid.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  renderWhiskey();

  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function syncCartUI() {
    if (window.NightcapCart && typeof window.NightcapCart.refresh === 'function') {
      window.NightcapCart.refresh();
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncCartUI);
  } else {
    syncCartUI();
  }
})();

(function () {
  'use strict';

  var ns = 'http://www.w3.org/2000/svg';

  function reducedMotion() {
    return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function isCoarsePointer() {
    return typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
  }

  function isNarrow() {
    return typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 900px)').matches;
  }

  function radialTicks(container, count, rInner, rOuter, opacityBase) {
    if (!container) return;
    for (var i = 0; i < count; i++) {
      var ang = (i / count) * Math.PI * 2;
      var line = document.createElementNS(ns, 'line');
      var x1 = Math.sin(ang) * rInner;
      var y1 = -Math.cos(ang) * rInner;
      var x2 = Math.sin(ang) * rOuter;
      var y2 = -Math.cos(ang) * rOuter;
      line.setAttribute('x1', x1.toFixed(2));
      line.setAttribute('y1', y1.toFixed(2));
      line.setAttribute('x2', x2.toFixed(2));
      line.setAttribute('y2', y2.toFixed(2));
      line.setAttribute('stroke', '#C9A84C');
      line.setAttribute('stroke-width', i % 6 === 0 ? '1.05' : '0.42');
      line.setAttribute('opacity', String(opacityBase + (i % 3) * 0.06));
      container.appendChild(line);
    }
  }

  function scanlines(group) {
    if (!group) return;
    for (var y = -38; y <= 38; y += 7) {
      var w = 46 - Math.abs(y);
      if (w < 4) continue;
      var line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', String(-w));
      line.setAttribute('y1', String(y));
      line.setAttribute('x2', String(w));
      line.setAttribute('y2', String(y));
      group.appendChild(line);
    }
  }

  function initDialSVG() {
    radialTicks(document.getElementById('dial-ticks-outer'), 72, 156, 174, 0.28);
    radialTicks(document.getElementById('dial-ticks-inner'), 48, 118, 134, 0.22);
    scanlines(document.getElementById('dial-scanlines'));
  }

  function runLiveMotion() {
    if (typeof anime === 'undefined') return;

    var mobile = isNarrow();
    var coarse = isCoarsePointer();

    var outerDur = mobile ? 72000 : 54000;
    var innerDur = mobile ? 44000 : 30000;

    anime({
      targets: '#dial-ticks-outer',
      rotate: 360,
      duration: outerDur,
      easing: 'linear',
      loop: true,
    });

    anime({
      targets: '#dial-ticks-inner',
      rotate: -360,
      duration: innerDur,
      easing: 'linear',
      loop: true,
    });

    anime({
      targets: '#dial-core',
      scale: [1, mobile ? 1.022 : 1.042, 1],
      duration: mobile ? 4400 : 3600,
      easing: 'easeInOutSine',
      loop: true,
    });

    anime({
      targets: '#dial-breathe',
      opacity: [0.15, mobile ? 0.38 : 0.5, 0.15],
      duration: mobile ? 4000 : 3200,
      easing: 'easeInOutQuad',
      loop: true,
    });

    anime({
      targets: '#dial-cross',
      scaleX: [0.85, 1.08, 0.85],
      duration: 2800,
      easing: 'easeInOutSine',
      loop: true,
    });

    anime({
      targets: '.dial-orbit-a',
      rotate: 360,
      duration: mobile ? 52000 : 40000,
      easing: 'linear',
      loop: true,
    });

    anime({
      targets: '.dial-orbit-b',
      rotate: -360,
      duration: mobile ? 76000 : 56000,
      easing: 'linear',
      loop: true,
    });

    anime({
      targets: '.dial-dot',
      opacity: [0.3, 1, 0.3],
      duration: mobile ? 2400 : 1900,
      easing: 'easeInOutQuad',
      loop: true,
    });

    var hero = document.querySelector('.hero');
    var dial = document.getElementById('hero-dial');
    if (hero && dial) {
      var parallaxAmp = coarse ? (mobile ? 8 : 12) : mobile ? 14 : 24;
      var rotateAmp = coarse ? 1.2 : 2.5;
      var ticking = false;
      var lx = 0;
      var ly = 0;

      function applyParallax(cx, cy) {
        lx = (cx / window.innerWidth - 0.5) * 2;
        ly = (cy / window.innerHeight - 0.5) * 2;
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          ticking = false;
          anime({
            targets: dial,
            translateX: lx * parallaxAmp,
            translateY: ly * parallaxAmp,
            rotate: lx * rotateAmp,
            duration: coarse ? 480 : 580,
            easing: 'easeOutQuad',
          });
        });
      }

      hero.addEventListener(
        'mousemove',
        function (e) {
          applyParallax(e.clientX, e.clientY);
        },
        { passive: true }
      );

      hero.addEventListener(
        'touchmove',
        function (e) {
          if (!e.touches || !e.touches[0]) return;
          applyParallax(e.touches[0].clientX, e.touches[0].clientY);
        },
        { passive: true }
      );
    }

    document.documentElement.classList.add('anime-live');
  }

  function boot() {
    initDialSVG();
    if (reducedMotion()) {
      document.documentElement.classList.add('reduce-anime-dial');
      return;
    }
    runLiveMotion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

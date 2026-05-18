/**
 * Main JS — Navbar, Scroll Reveal, Runtime Counter, Typing Effect
 */
(function() {
  'use strict';

  // =====================================================
  // 1. Navbar Toggle (Mobile)
  // =====================================================
  var toggleBtn = document.getElementById('navbarToggle');
  var drawer = document.getElementById('navbarDrawer');
  var overlay = document.getElementById('drawerOverlay');
  var closeBtn = document.getElementById('drawerClose');

  function openDrawer() {
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', openDrawer);
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }
  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }

  // Close on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeDrawer();
  });

  // =====================================================
  // 2. Scroll Reveal Animations
  // =====================================================
  function initScrollReveal() {
    var elements = document.querySelectorAll('.scroll-reveal');
    if (!elements.length) return;

    function reveal(el) {
      el.classList.add('revealed');
    }

    // Use Intersection Observer when available
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      elements.forEach(function(el) {
        // If already visible in viewport, reveal immediately
        // This handles cases where IntersectionObserver callback
        // fires late or doesn't fire (e.g., race condition with loader)
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0 &&
            rect.top + rect.height > 0) {
          reveal(el);
          return;
        }
        observer.observe(el);
      });
    } else {
      // Fallback: reveal all immediately
      elements.forEach(function(el) {
        reveal(el);
      });
    }
  }

  // =====================================================
  // 3. Navbar Shrink on Scroll
  // =====================================================
  function initNavbarShrink() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    var scrollThreshold = 80;
    var lastScrollY = window.scrollY;

    function onScroll() {
      var scrollY = window.scrollY;

      if (scrollY > scrollThreshold) {
        navbar.style.borderBottomColor = 'rgba(152, 251, 152, 0.25)';
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
      } else {
        navbar.style.borderBottomColor = 'var(--color-border)';
        navbar.style.background = 'var(--bg-nav)';
      }

      lastScrollY = scrollY;
    }

    // Throttled scroll listener
    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // =====================================================
  // 4. Runtime Counter (Footer)
  // =====================================================
  function initRuntimeCounter() {
    var displayEl = document.getElementById('runtimeDisplay');
    if (!displayEl) return;

    // Get start date from footer start config (injected via data attr)
    var startYearEl = document.querySelector('.footer-copyright');
    if (!startYearEl) return;

    // Parse start year from copyright text
    var match = startYearEl.textContent.match(/(\d{4})/);
    if (!match) return;

    var startYear = parseInt(match[1]);
    var startDate = new Date(startYear, 0, 1); // Jan 1 of start year

    function updateRuntime() {
      var now = new Date();
      var diff = now.getTime() - startDate.getTime();

      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((diff % (1000 * 60)) / 1000);

      displayEl.textContent = days + 'd ' +
        padZero(hours) + 'h ' +
        padZero(minutes) + 'm ' +
        padZero(seconds) + 's';
    }

    function padZero(n) {
      return n < 10 ? '0' + n : '' + n;
    }

    updateRuntime();
    setInterval(updateRuntime, 1000);
  }

  // =====================================================
  // 5. Typing Effect for Hero Subtitle
  // =====================================================
  function initTypingEffect() {
    var el = document.querySelector('.typing-text');
    if (!el) return;

    var text = el.textContent.trim();
    el.textContent = '';
    el.style.visibility = 'visible';

    var index = 0;
    function typeChar() {
      if (index < text.length) {
        el.textContent += text.charAt(index);
        index++;
        setTimeout(typeChar, 40 + Math.random() * 30);
      }
    }

    // Start typing after a short delay
    setTimeout(typeChar, 800);
  }

  // =====================================================
  // 6. Performance: disable heavy effects if prefers-reduced-motion
  // =====================================================
  function checkReducedMotion() {
    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      // Disable sparkles
      var container = document.getElementById('sparkle-container');
      if (container) container.style.display = 'none';
    }
  }

  // =====================================================
  // 7. Loading Progress Tracker (Dog Chases Cat)
  // =====================================================
  function initLoadingProgress() {
    var progressFill = document.getElementById('progressFill');
    var progressLabel = document.getElementById('progressLabel');
    var catMove = document.getElementById('catMove');
    var dogMove = document.getElementById('dogMove');
    var catchMessage = document.getElementById('catchMessage');
    var loader = document.getElementById('loader');

    if (!progressFill || !dogMove) return;

    // Respect reduced motion
    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      progressFill.style.width = '100%';
      if (progressLabel) progressLabel.textContent = '100%';
      if (catchMessage) catchMessage.classList.add('show');
      setTimeout(function() {
        if (loader) loader.style.opacity = '0';
        setTimeout(function() { if (loader) loader.style.display = 'none'; }, 800);
      }, 500);
      return;
    }

    // Safety: force hide loader after 5 seconds no matter what
    setTimeout(function() {
      if (loader && loader.style.display !== 'none') {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.8s ease';
        setTimeout(function() {
          loader.style.display = 'none';
          window.dispatchEvent(new Event('resize'));
        }, 800);
      }
    }, 5000);

    var startTime = Date.now();
    var currentProgress = 0;
    var targetProgress = 0;
    var windowLoaded = false;
    var animationActive = true;

    // Phase 1: DOM ready → 25%
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      targetProgress = Math.max(targetProgress, 25);
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        targetProgress = Math.max(targetProgress, 25);
      });
    }

    // Phase 2: Images loading → 25%–60%
    function watchImages() {
      var images = document.images;
      if (!images.length) {
        targetProgress = Math.max(targetProgress, 60);
        return;
      }

      function recountImages() {
        var loaded = 0;
        for (var i = 0; i < images.length; i++) {
          if (images[i].complete) loaded++;
        }
        targetProgress = Math.max(targetProgress, 25 + (loaded / images.length) * 35);
      }

      // Count already loaded
      recountImages();

      // Listen for future loads
      for (var i = 0; i < images.length; i++) {
        images[i].addEventListener('load', recountImages);
        images[i].addEventListener('error', recountImages);
      }
    }
    watchImages();

    // Phase 3: Window load → 85%
    if (document.readyState === 'complete') {
      windowLoaded = true;
      targetProgress = Math.max(targetProgress, 85);
    } else {
      window.addEventListener('load', function() {
        windowLoaded = true;
        targetProgress = Math.max(targetProgress, 85);
      });
    }

    // Update DOM and positions
    function updateDisplay(pct) {
      progressFill.style.width = pct + '%';
      if (progressLabel) progressLabel.textContent = Math.round(pct) + '%';

      // Dog: first in flex (left side), chases rightward to reach cat at 100%
      var dogX = -150 + (pct / 100) * 240;
      dogMove.style.transform = 'translateX(' + dogX + 'px)';

      // Cat: moves slightly ahead as progress advances
      if (catMove) {
        var catX = (pct / 100) * 30;
        catMove.style.transform = 'translateX(' + catX + 'px)';
      }

      // Show catch message near the end
      if (pct >= 95 && catchMessage) {
        catchMessage.classList.add('show');
      }
    }

    // Animation loop
    function tick() {
      if (!animationActive) return;

      // Phase 4: Min display time 2s → pushes 85%→100%
      var elapsed = Date.now() - startTime;
      var timeBonus = Math.min(elapsed / 2000, 1) * 15;

      var combinedTarget = Math.min(targetProgress + timeBonus, 100);

      // Smooth interpolation
      currentProgress += (combinedTarget - currentProgress) * 0.12;
      if (Math.abs(currentProgress - combinedTarget) < 0.3) {
        currentProgress = combinedTarget;
      }

      updateDisplay(currentProgress);

      if (currentProgress >= 100) {
        updateDisplay(100);
        setTimeout(function() {
          if (loader) {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.8s ease';
            setTimeout(function() {
              loader.style.display = 'none';
              window.dispatchEvent(new Event('resize'));
            }, 800);
          }
        }, 700);
        animationActive = false;
        return;
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  // =====================================================
  // Initialize Everything
  // =====================================================
  function init() {
    checkReducedMotion();
    initScrollReveal();
    initNavbarShrink();
    initRuntimeCounter();
    initTypingEffect();
    initLoadingProgress();

    // Final fallback: force-hide loader after 6s no matter what.
    // This ensures the page is never permanently blocked even if
    // the progress animation stalls or the `load` event never fires.
    setTimeout(function() {
      var loader = document.getElementById('loader');
      if (!loader) return;
      if (loader.style.display === 'none') return;
      loader.style.transition = 'opacity 0.8s ease';
      loader.style.opacity = '0';
      setTimeout(function() {
        loader.style.display = 'none';
        window.dispatchEvent(new Event('resize'));
      }, 800);
    }, 6000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // For re-init (if needed)
  window.KawaiiMain = {
    initScrollReveal: initScrollReveal
  };
})();

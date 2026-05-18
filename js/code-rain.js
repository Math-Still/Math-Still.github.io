/**
 * Code Rain — Cyberpunk Matrix-style falling characters
 * with cute emoji sprinkles for the kawaii vibe.
 */
(function() {
  'use strict';

  const canvas = document.getElementById('code-rain-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Character pool: binary digits, code symbols, and cute emojis
  const BINARY = '01';
  const SYMBOLS = '{}[];:<>/\\|!=+-*&%$#@~';
  const EMOJIS = ['✨', '⭐', '💻', '🌟', '💚', '🌸', '💕', '🐱', '🌈', '💜', '🦊', '🍀'];
  const ALL_CHARS = BINARY + SYMBOLS;

  // Colors: neon green primary, random pink/purple/cyan accents
  const COLORS = ['#0f0', '#f0f', '#98FB98', '#FFB7C5', '#D8B4FE', '#67E8F9'];

  let drops = [];
  let cols, rows;
  let fontSize = 16;
  let isMobile = false;
  let rafId = null;
  let lastTime = 0;
  const TARGET_FPS = isMobile ? 20 : 30;
  const FRAME_INTERVAL = 1000 / TARGET_FPS;

  function init() {
    isMobile = window.innerWidth < 768;
    fontSize = isMobile ? 12 : 16;
    resize();
    createDrops();

    // Hide loader after init
    window.addEventListener('load', function() {
      const loader = document.getElementById('loader');
      if (loader) {
        setTimeout(function() {
          loader.classList.add('hidden');
        }, 1200);
      }
    });
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / fontSize);
    rows = Math.floor(canvas.height / fontSize);
  }

  function createDrops() {
    drops = [];
    for (let i = 0; i < cols; i++) {
      drops[i] = {
        y: Math.floor(Math.random() * -rows),
        speed: 0.5 + Math.random() * 1.5,
        chars: []
      };
    }
  }

  function getRandomChar() {
    // ~20% chance of emoji, 80% code characters
    if (Math.random() < 0.2) {
      return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    }
    return ALL_CHARS[Math.floor(Math.random() * ALL_CHARS.length)];
  }

  function getRandomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  // Trail lengths for each column
  const trailLengths = {};

  function draw(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;

    if (delta < FRAME_INTERVAL) {
      rafId = requestAnimationFrame(draw);
      return;
    }
    lastTime = timestamp - (delta % FRAME_INTERVAL);

    // Semi-transparent black to create fade trail effect
    ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px "Fira Code", "Courier New", monospace';

    for (let i = 0; i < drops.length; i++) {
      const drop = drops[i];
      const trailLen = trailLengths[i] || 10 + Math.floor(Math.random() * 15);

      // Draw trail characters
      for (let j = 0; j < trailLen; j++) {
        const charY = (drop.y - j) * fontSize;
        if (charY < -fontSize || charY > canvas.height) continue;

        const char = drop.chars[j] || getRandomChar();
        drop.chars[j] = char;

        // Opacity fades toward the top of the trail
        const alpha = j === 0
          ? 1
          : Math.max(0.05, 1 - j / trailLen);

        // Lead character is brightest, rest fade
        if (j === 0) {
          ctx.fillStyle = getRandomColor();
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#0f0';
        } else {
          ctx.fillStyle = 'rgba(152, 251, 152, ' + alpha * 0.5 + ')';
          ctx.shadowBlur = 0;
        }

        ctx.fillText(char, i * fontSize, charY);
      }
      ctx.shadowBlur = 0;

      // Move the drop down
      drop.y += drop.speed * 0.6;

      // Reset when off screen
      if (drop.y * fontSize > canvas.height + 100) {
        drops[i] = {
          y: Math.floor(Math.random() * -20),
          speed: 0.3 + Math.random() * 1.2,
          chars: []
        };
        trailLengths[i] = 8 + Math.floor(Math.random() * 12);
      }
    }

    rafId = requestAnimationFrame(draw);
  }

  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      resize();
    }, 200);
  });

  // Reduce performance on mobile
  if (isMobile) {
    // Lower resolution on mobile
    canvas.width = Math.floor(window.innerWidth / 2);
    canvas.height = Math.floor(window.innerHeight / 2);
  }

  init();
  rafId = requestAnimationFrame(draw);

  // Cleanup on page unload (for PJAX-like navigation)
  window.addEventListener('beforeunload', function() {
    if (rafId) cancelAnimationFrame(rafId);
  });
})();

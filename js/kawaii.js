/**
 * Kawaii Easter Eggs Module
 * Sparkle cursor, post animals, and other cute surprises.
 */
(function() {
  'use strict';

  // =====================================================
  // 1. Sparkle Cursor Effect
  // =====================================================
  var sparkleEnabled = true;
  var sparkleContainer = document.getElementById('sparkle-container');

  var sparkleCharacters = ['✨', '⭐', '💚', '🌸', '💕', '💜', '🌟', '✦', '✧', '·'];

  function createSparkle(e) {
    if (!sparkleEnabled || !sparkleContainer) return;

    // Throttle: only create sparkle every 80ms
    var now = Date.now();
    if (now - (createSparkle._lastSparkle || 0) < 80) return;
    createSparkle._lastSparkle = now;

    // Randomly skip to not overwhelm
    if (Math.random() > 0.35) return;

    var sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.textContent = sparkleCharacters[Math.floor(Math.random() * sparkleCharacters.length)];

    var x = e.clientX;
    var y = e.clientY;

    // Random offset for spread
    var offsetX = (Math.random() - 0.5) * 30;
    var offsetY = (Math.random() - 0.5) * 30;

    sparkle.style.left = (x + offsetX) + 'px';
    sparkle.style.top = (y + offsetY) + 'px';

    // Random direction for CSS animation
    var tx = (Math.random() - 0.5) * 40 + 'px';
    var ty = (Math.random() - 0.5) * 40 - 20 + 'px';
    sparkle.style.setProperty('--tx', tx);
    sparkle.style.setProperty('--ty', ty);

    // Random size
    var size = 10 + Math.random() * 14;
    sparkle.style.fontSize = size + 'px';

    sparkleContainer.appendChild(sparkle);

    // Remove after animation
    setTimeout(function() {
      if (sparkle.parentNode) {
        sparkle.parentNode.removeChild(sparkle);
      }
    }, 800);
  }

  // Debounced mousemove listener
  var sparkleFrameId = null;
  document.addEventListener('mousemove', function(e) {
    if (sparkleFrameId) cancelAnimationFrame(sparkleFrameId);
    sparkleFrameId = requestAnimationFrame(function() {
      createSparkle(e);
    });
  });

  // Disable sparkle on touch devices (performance)
  if ('ontouchstart' in window) {
    sparkleEnabled = false;
  }

  // =====================================================
  // 2. Post Animal — Random Cute Animal at End of Articles
  // =====================================================
  var animals = [
    { emoji: '🐱', name: '小猫', message: '觉得这篇文章很棒！🐱' },
    { emoji: '🐼', name: '熊猫', message: '拍了拍圆肚子表示赞同 🐼' },
    { emoji: '🐧', name: '企鹅', message: '摇摇摆摆走过来点了个赞 🐧' },
    { emoji: '🦊', name: '小狐狸', message: '眯着眼睛说写得不错 🦊' },
    { emoji: '🐙', name: '小章鱼', message: '用八只爪爪同时点赞 🐙' },
    { emoji: '🐰', name: '小兔', message: '竖起耳朵认真读完了 🐰' },
    { emoji: '🦄', name: '独角兽', message: '用角角发射了彩虹赞同波 🦄' },
    { emoji: '🐹', name: '小仓鼠', message: '鼓着腮帮子说好棒 🐹' },
    { emoji: '🦝', name: '小浣熊', message: '洗完东西回来给你点赞 🦝' },
    { emoji: '🐸', name: '小青蛙', message: '蹲在键盘上呱呱叫好 🐸' },
    { emoji: '🐲', name: '小龙', message: '喷出一团烟花庆祝 🐲' },
    { emoji: '🦋', name: '小蝴蝶', message: '在代码花丛中翩翩起舞 🦋' }
  ];

  function initPostAnimal() {
    var animalEl = document.getElementById('postAnimal');
    var emojiEl = document.getElementById('animalEmoji');
    var msgEl = document.getElementById('animalMessage');

    if (!animalEl || !emojiEl || !msgEl) return;

    var pick = animals[Math.floor(Math.random() * animals.length)];
    emojiEl.textContent = pick.emoji;
    msgEl.textContent = pick.name + ' ' + pick.message;

    // Click to cycle
    animalEl.addEventListener('click', function() {
      var next = animals[Math.floor(Math.random() * animals.length)];
      emojiEl.textContent = next.emoji;
      msgEl.textContent = next.name + ' ' + next.message;
    });
  }

  // =====================================================
  // 3. Custom 404 robot head-scratch
  // =====================================================
  function init404Robot() {
    var robot = document.querySelector('.robot-head');
    if (!robot) return;

    // Add sadder expression on 404
    robot.addEventListener('mouseenter', function() {
      var pupils = document.querySelectorAll('.eye-pupil');
      pupils.forEach(function(p) {
        p.style.background = '#FFB7C5';
        p.style.boxShadow = '0 0 8px #FFB7C5';
      });
    });
    robot.addEventListener('mouseleave', function() {
      var pupils = document.querySelectorAll('.eye-pupil');
      pupils.forEach(function(p) {
        p.style.background = '#67E8F9';
        p.style.boxShadow = '0 0 8px #67E8F9';
      });
    });
  }

  // =====================================================
  // 4. Initialize everything when DOM is ready
  // =====================================================
  function init() {
    initPostAnimal();
    init404Robot();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for potential re-init (for PJAX-like navigation)
  window.KawaiiEasterEggs = {
    initPostAnimal: initPostAnimal,
    sparkleEnabled: sparkleEnabled
  };
})();

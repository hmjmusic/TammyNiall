/* ============================================
   TAMARA & NIALL — FAIRY TALE WEDDING
   Interactive JS: Particles, Scroll, Lightbox
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initFairyEntrance();
  initFairyDust();
  initNavigation();
  initScrollAnimations();
  initCountdown();
  initLightbox();
});

/* ===== FAIRY DUST PARTICLES (Enhanced) ===== */
function initFairyDust() {
  const canvas = document.getElementById('fairy-dust');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let fireflies = [];
  let mouse = { x: -1000, y: -1000 };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Track mouse for interactive sparkles
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    // Spawn trail particles near cursor
    for (let i = 0; i < 2; i++) {
      if (Math.random() > 0.5) {
        spawnSparkle(
          mouse.x + (Math.random() - 0.5) * 30,
          mouse.y + (Math.random() - 0.5) * 30,
          'cursor'
        );
      }
    }
  });

  // Click burst
  document.addEventListener('click', (e) => {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 / 12) * i;
      const speed = Math.random() * 2 + 1;
      spawnSparkle(e.clientX, e.clientY, 'burst', {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      });
    }
  });

  const sparkleColors = [
    'rgba(201, 169, 110, ',  // gold
    'rgba(232, 212, 168, ',  // light gold
    'rgba(255, 230, 180, ',  // warm gold
    'rgba(138, 112, 173, ',  // purple
    'rgba(168, 144, 196, ',  // light purple
    'rgba(212, 165, 199, ',  // rose
    'rgba(255, 255, 255, ',  // white sparkle
  ];

  function spawnSparkle(x, y, type = 'ambient', opts = {}) {
    const isGold = Math.random() > 0.4;
    const colorSet = isGold ? sparkleColors.slice(0, 3) : sparkleColors.slice(3);
    particles.push({
      x, y,
      vx: opts.vx || (Math.random() - 0.5) * 0.8,
      vy: opts.vy || -Math.random() * 1.0 - 0.3,
      size: type === 'burst' ? Math.random() * 3 + 1.5 : Math.random() * 2.5 + 0.8,
      color: colorSet[Math.floor(Math.random() * colorSet.length)],
      life: 1,
      decay: type === 'burst' ? 0.02 : Math.random() * 0.008 + 0.002,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.04 + 0.01,
      wobbleAmp: Math.random() * 0.5 + 0.2,
      type,
      sparklePhase: Math.random() * Math.PI * 2,
    });
  }

  // Initialize fireflies (persistent, slowly drifting glowing orbs)
  function initFireflies() {
    for (let i = 0; i < 15; i++) {
      fireflies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseX: Math.random() * canvas.width,
        baseY: Math.random() * canvas.height,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.005 + 0.002,
        radius: Math.random() * 150 + 50,
        size: Math.random() * 2.5 + 1.5,
        glowSize: Math.random() * 15 + 8,
        brightness: 0,
        brightPhase: Math.random() * Math.PI * 2,
        brightSpeed: Math.random() * 0.015 + 0.008,
        color: Math.random() > 0.5
          ? { r: 201, g: 169, b: 110 } // gold
          : { r: 168, g: 144, b: 196 }, // purple
      });
    }
  }
  initFireflies();

  // Spawn ambient sparkles
  function spawnAmbient() {
    if (particles.length < 80) {
      spawnSparkle(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        'ambient'
      );
    }
  }

  function drawStarShape(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spawn ambient
    if (Math.random() > 0.88) spawnAmbient();

    // Draw fireflies
    fireflies.forEach(f => {
      f.phase += f.phaseSpeed;
      f.brightPhase += f.brightSpeed;
      f.x = f.baseX + Math.cos(f.phase) * f.radius;
      f.y = f.baseY + Math.sin(f.phase * 0.7) * f.radius * 0.6;
      f.brightness = (Math.sin(f.brightPhase) + 1) / 2;

      // Wrap around screen
      if (f.x < -50) f.baseX += canvas.width + 100;
      if (f.x > canvas.width + 50) f.baseX -= canvas.width + 100;
      if (f.y < -50) f.baseY += canvas.height + 100;
      if (f.y > canvas.height + 50) f.baseY -= canvas.height + 100;

      const alpha = f.brightness * 0.35;
      const glowAlpha = f.brightness * 0.08;

      // Outer glow
      const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.glowSize);
      grd.addColorStop(0, `rgba(${f.color.r}, ${f.color.g}, ${f.color.b}, ${alpha})`);
      grd.addColorStop(0.5, `rgba(${f.color.r}, ${f.color.g}, ${f.color.b}, ${glowAlpha})`);
      grd.addColorStop(1, `rgba(${f.color.r}, ${f.color.g}, ${f.color.b}, 0)`);
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.glowSize, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size * f.brightness, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${f.color.r}, ${f.color.g}, ${f.color.b}, ${alpha * 1.5})`;
      ctx.fill();
    });

    // Draw sparkle particles
    particles = particles.filter(p => {
      p.wobble += p.wobbleSpeed;
      p.sparklePhase += 0.1;
      p.x += p.vx + Math.sin(p.wobble) * p.wobbleAmp;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) return false;

      const sparkleFlicker = (Math.sin(p.sparklePhase) + 1) / 2;
      const effectiveLife = p.life * (0.7 + sparkleFlicker * 0.3);
      const size = p.size * effectiveLife;

      // Draw as 4-point star for sparkle effect
      if (size > 1.5 && Math.random() > 0.3) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.sparklePhase * 0.5);
        drawStarShape(ctx, 0, 0, 4, size, size * 0.3);
        ctx.fillStyle = p.color + effectiveLife * 0.9 + ')';
        ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + effectiveLife + ')';
        ctx.fill();
      }

      // Glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
      ctx.fillStyle = p.color + (effectiveLife * 0.1) + ')';
      ctx.fill();

      return true;
    });

    requestAnimationFrame(animate);
  }
  animate();
}

/* ===== NAVIGATION ===== */
function initNavigation() {
  const nav = document.getElementById('main-nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const allLinks = document.querySelectorAll('.nav-links a');

  // Scroll effect
  function onScroll() {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    allLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !expanded);
  });

  // Close mobile menu on link click
  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animation for grid items
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  // Add stagger delays to grid items
  document.querySelectorAll('.hotels-grid .hotel-card').forEach((el, i) => {
    el.dataset.delay = i * 100;
  });
  document.querySelectorAll('.gallery-item').forEach((el, i) => {
    el.dataset.delay = i * 60;
  });

  // Observe all animatable elements
  document.querySelectorAll('[data-animate], .timeline-item, .detail-card, .gallery-item').forEach(el => {
    observer.observe(el);
  });
}

/* ===== COUNTDOWN ===== */
function initCountdown() {
  // Placeholder date: August 1, 2027 — will be updated when exact date is set
  const weddingDate = new Date('2027-08-01T16:00:00-04:00');
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  function update() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      daysEl.textContent = '0';
      hoursEl.textContent = '0';
      minutesEl.textContent = '0';
      secondsEl.textContent = '0';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = days;
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ===== LIGHTBOX ===== */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const galleryItems = document.querySelectorAll('.gallery-item img');
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = galleryItems[currentIndex].src;
    lightboxImg.alt = galleryItems[currentIndex].alt;
    lightbox.classList.add('active');
    document.body.classList.add('lightbox-open');
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('lightbox-open');
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    lightboxImg.src = galleryItems[currentIndex].src;
    lightboxImg.alt = galleryItems[currentIndex].alt;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    lightboxImg.src = galleryItems[currentIndex].src;
    lightboxImg.alt = galleryItems[currentIndex].alt;
  }

  galleryItems.forEach((img, index) => {
    img.parentElement.addEventListener('click', () => openLightbox(index));
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
}

/* ===== FAIRY ENTRANCE ANIMATION ===== */
function initFairyEntrance() {
  const overlay = document.getElementById('fairy-entrance');
  if (!overlay) return;

  // Only show the entrance once per session
  if (sessionStorage.getItem('fairyEntranceSeen')) {
    overlay.classList.add('hidden');
    return;
  }

  const trail = overlay.querySelector('.fairy-trail');
  const sprite = overlay.querySelector('.fairy-couple');
  const playBtn = document.getElementById('fairy-play-btn');
  const introPrompt = document.getElementById('fairy-intro-prompt');

  // Keep the fairy hidden until the visitor clicks
  sprite.classList.add('waiting');

  if (!playBtn) return;

  playBtn.addEventListener('click', function() {
    // 1. Burst sparkles from the button — three waves for maximum magic
    var btnRect = playBtn.getBoundingClientRect();
    var cx = btnRect.left + btnRect.width / 2;
    var cy = btnRect.top + btnRect.height / 2;
    var colors = ['#C9A96E', '#D4A5C7', '#8A70AD', '#fff', '#F5E6C8', '#E8B4D8'];

    function spawnBurstWave(count, minDist, maxDist, delay) {
      setTimeout(function() {
        for (var i = 0; i < count; i++) {
          var sparkle = document.createElement('div');
          sparkle.className = 'burst-sparkle';
          var angle = (Math.PI * 2 / count) * i + (Math.random() * 0.5);
          var dist = minDist + Math.random() * (maxDist - minDist);
          sparkle.style.left = cx + 'px';
          sparkle.style.top = cy + 'px';
          sparkle.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
          sparkle.style.setProperty('--by', Math.sin(angle) * dist + 'px');
          var size = (4 + Math.random() * 12);
          sparkle.style.width = size + 'px';
          sparkle.style.height = size + 'px';
          var color = colors[Math.floor(Math.random() * colors.length)];
          sparkle.style.background = color;
          sparkle.style.animationDuration = (0.8 + Math.random() * 0.8) + 's';
          sparkle.style.boxShadow = '0 0 ' + (6 + Math.random() * 12) + 'px ' + color;
          document.body.appendChild(sparkle);
          setTimeout(function(s) { s.remove(); }.bind(null, sparkle), 1800);
        }
      }, delay);
    }

    // Wave 1: tight inner burst
    spawnBurstWave(40, 40, 150, 0);
    // Wave 2: wider mid burst
    spawnBurstWave(50, 100, 280, 100);
    // Wave 3: outer ring
    spawnBurstWave(35, 180, 400, 220);

    // 2. Fade out the intro prompt
    introPrompt.classList.add('burst');

    // 3. Start the music (or queue it if YouTube hasn't loaded yet)
    musicRequested = true;
    if (ytReady) {
      startMusic();
    }

    // 4. After a brief pause, start the fairy flying
    setTimeout(function() {
      sprite.classList.remove('waiting');
      startFairyFlight();
    }, 600);
  });

  function startFairyFlight() {
    // Spawn sparkles trailing behind the fairy
    var sparkleInterval = setInterval(function() {
      var r = sprite.getBoundingClientRect();
      if (r.right < 0 || r.left > window.innerWidth) return;
      for (var i = 0; i < 4; i++) {
        var sparkle = document.createElement('div');
        sparkle.className = 'fairy-sparkle';
        sparkle.style.left = (r.left + r.width * 0.3 * Math.random()) + 'px';
        sparkle.style.top = (r.top + r.height * Math.random()) + 'px';
        sparkle.style.width = (3 + Math.random() * 6) + 'px';
        sparkle.style.height = sparkle.style.width;
        sparkle.style.background = Math.random() > 0.5 ? '#C9A96E' : '#D4A5C7';
        sparkle.style.animationDuration = (0.8 + Math.random() * 1.2) + 's';
        trail.appendChild(sparkle);
        setTimeout(function(s) { s.remove(); }.bind(null, sparkle), 2000);
      }
    }, 80);

    // Fade out overlay after fairy crosses screen (~14.3s)
    setTimeout(function() {
      clearInterval(sparkleInterval);
      overlay.classList.add('fade-out');
      sessionStorage.setItem('fairyEntranceSeen', 'true');
    }, 14000);

    // Remove from DOM
    setTimeout(function() {
      overlay.classList.add('hidden');
    }, 14900);
  }
}

/* ===== BACKGROUND MUSIC (YouTube IFrame API) ===== */
var ytPlayer = null;
var musicPlaying = false;
var musicRequested = false; // true once visitor clicks play
var ytReady = false;

function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('yt-player', {
    videoId: 'Dgjt3s7PGaM',
    playerVars: {
      autoplay: 0,
      loop: 1,
      playlist: 'Dgjt3s7PGaM',
      controls: 0,
      disablekb: 1,
      modestbranding: 1
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady() {
  ytReady = true;

  // If visitor already clicked play before YT loaded, start music now
  if (musicRequested && !musicPlaying) {
    startMusic();
  }

  // Set up the persistent toggle button
  var btn = document.getElementById('music-toggle');
  if (!btn) return;

  btn.addEventListener('click', function() {
    if (musicPlaying) {
      ytPlayer.pauseVideo();
      btn.classList.remove('playing');
      btn.title = 'Play music';
      musicPlaying = false;
    } else {
      startMusic();
    }
  });

  // If entrance was already seen, show toggle right away
  if (sessionStorage.getItem('fairyEntranceSeen')) {
    btn.classList.add('visible');
  }
}

function startMusic() {
  if (!ytReady || !ytPlayer) return;
  ytPlayer.setVolume(40);
  ytPlayer.playVideo();
  musicPlaying = true;
  var btn = document.getElementById('music-toggle');
  if (btn) {
    btn.classList.add('playing');
    btn.classList.add('visible');
  }
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    ytPlayer.playVideo();
  }
}

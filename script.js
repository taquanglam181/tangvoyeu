/**
 * Gửi Vợ Yêu - 20/10 (Phiên bản sẵn sàng cho GitHub Pages)
 * Tích hợp cố định bài hát "Thế Giới Của Anh" & Ảnh vợ yêu
 */

// --- 1. LỜI CHÚC Ý NGHĨA DÀNH CHO VỢ ---
const WISH_MESSAGE = `Chúc mừng ngày 20-10, người phụ nữ đặc biệt và tuyệt vời nhất trong cuộc đời anh!

Cảm ơn em vì đã luôn đồng hành và mang đến cho tổ ấm nhỏ của chúng mình ngập tràn tiếng cười, sự dịu dàng và yêu thương.

Nhân ngày Phụ nữ Việt Nam, chúc vợ yêu luôn rạng ngời xinh đẹp, bình an, hạnh phúc và thành công với mọi ước mơ.

Yêu em nhiều hơn mỗi ngày!`;

// --- 2. CÁC PHẦN TỬ GIAO DIỆN ---
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
const roseTrigger = document.getElementById('rose-trigger');
const sceneInitial = document.getElementById('scene-initial');
const sceneWishes = document.getElementById('scene-wishes');
const wishTextElem = document.getElementById('wish-text');

// Audio elements
const bgAudio = document.getElementById('bg-audio');
const audioBtn = document.getElementById('audio-btn');
const audioStatus = document.getElementById('audio-status');

// Tương tác
const btnBurstLove = document.getElementById('btn-burst-love');
const btnReplay = document.getElementById('btn-replay');

let isRoseClicked = false;
let isPlayingAudio = false;
let typewriterTimeout = null;

// --- 3. QUẢN LÝ BÀI HÁT "THẾ GIỚI CỦA ANH" ---
function playSong() {
  isPlayingAudio = true;
  audioBtn.classList.add('playing');
  audioStatus.textContent = 'Thế Giới Của Anh';

  bgAudio.play().catch(err => {
    console.warn('Cần tương tác chạm để phát nhạc:', err);
  });
}

function pauseSong() {
  isPlayingAudio = false;
  audioBtn.classList.remove('playing');
  audioStatus.textContent = 'Đã tạm dừng';
  bgAudio.pause();
}

audioBtn.addEventListener('click', () => {
  if (isPlayingAudio) {
    pauseSong();
  } else {
    playSong();
  }
});

// Âm thanh chime nhẹ nhàng khi click
function playMagicChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioCtx();
    const now = audioCtx.currentTime;
    const freqs = [587.33, 739.99, 880.00, 1174.66];
    freqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.9);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 1.0);
    });
  } catch (e) {
    // Không bắt buộc nếu trình duyệt hạn chế
  }
}

// --- 4. HỆ THỐNG ĐỒ HỌA 2D THUẦN TÚY (VECTOR FLAT 2D) ---
let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

function drawFlatPetal2D(ctx, x, y, size, angle, color, opacity) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.bezierCurveTo(size * 0.75, -size * 0.5, size * 0.65, size * 0.7, 0, size);
  ctx.bezierCurveTo(-size * 0.65, size * 0.7, -size * 0.75, -size * 0.5, 0, -size);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  ctx.restore();
}

function drawFlatHeart2D(ctx, x, y, size, angle, color, opacity) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;

  ctx.beginPath();
  const topY = -size * 0.4;
  ctx.moveTo(0, topY);
  ctx.bezierCurveTo(-size * 0.5, -size, -size, -size * 0.2, -size * 0.5, size * 0.25);
  ctx.lineTo(0, size * 0.8);
  ctx.lineTo(size * 0.5, size * 0.25);
  ctx.bezierCurveTo(size, -size * 0.2, size * 0.5, -size, 0, topY);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

class PetalEntity2D {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * width;
    this.y = initial ? Math.random() * height : -25;
    this.size = Math.random() * 11 + 8;
    this.speedY = Math.random() * 1.3 + 0.8;
    this.speedX = (Math.random() - 0.5) * 0.6;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.018;
    const colors = ['#e61c4f', '#ff4b72', '#d61a46', '#ff7597'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.5 + 0.4;
  }

  update() {
    this.y += this.speedY;
    this.x += Math.sin(this.angle) * 1.0 + this.speedX;
    this.angle += this.spin;

    if (this.y > height + 30 || this.x < -30 || this.x > width + 30) {
      this.reset();
    }
  }

  draw() {
    drawFlatPetal2D(ctx, this.x, this.y, this.size, this.angle, this.color, this.opacity);
  }
}

class SparkleDot2D {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = Math.random() * 1.8 + 0.6;
    this.alpha = Math.random() * 0.6 + 0.2;
    this.speed = Math.random() * 0.02 + 0.01;
    this.phase = Math.random() * Math.PI * 2;
  }

  update() {
    this.phase += this.speed;
    this.y -= 0.25;
    if (this.y < -10) this.y = height + 10;
  }

  draw() {
    const curAlpha = Math.abs(Math.sin(this.phase)) * this.alpha;
    ctx.save();
    ctx.globalAlpha = curAlpha;
    ctx.fillStyle = '#fff4f8';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class HeartEntity2D {
  constructor(originX, originY) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5.5 + 2.5;
    this.x = originX;
    this.y = originY;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 2.2;
    this.size = Math.random() * 14 + 10;
    this.rot = (Math.random() - 0.5) * 0.4;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.012;
    const heartColors = ['#ff3366', '#ff537b', '#f0c05a', '#ff7597', '#ffffff'];
    this.color = heartColors[Math.floor(Math.random() * heartColors.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.06;
    this.vx *= 0.98;
    this.alpha -= this.decay;
  }

  draw() {
    if (this.alpha <= 0) return;
    drawFlatHeart2D(ctx, this.x, this.y, this.size, this.rot, this.color, Math.max(this.alpha, 0));
  }
}

let floatingHeartsList = [];

function burstHearts2D(originX, originY, count = 25) {
  for (let i = 0; i < count; i++) {
    floatingHeartsList.push(new HeartEntity2D(originX, originY));
  }
}

const petals = Array.from({ length: 30 }, () => new PetalEntity2D());
const sparkles = Array.from({ length: 45 }, () => new SparkleDot2D());

function renderCanvasLoop() {
  ctx.clearRect(0, 0, width, height);

  sparkles.forEach(s => {
    s.update();
    s.draw();
  });

  petals.forEach(p => {
    p.update();
    p.draw();
  });

  for (let i = floatingHeartsList.length - 1; i >= 0; i--) {
    const h = floatingHeartsList[i];
    h.update();
    h.draw();
    if (h.alpha <= 0) {
      floatingHeartsList.splice(i, 1);
    }
  }

  requestAnimationFrame(renderCanvasLoop);
}
renderCanvasLoop();

// --- 5. HIỆU ỨNG GÕ CHỮ (TYPEWRITER) ---
function startTypewriter(text, element, speed = 35) {
  element.textContent = '';
  element.classList.remove('done');
  if (typewriterTimeout) clearTimeout(typewriterTimeout);

  let index = 0;
  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      typewriterTimeout = setTimeout(type, speed);
    } else {
      element.classList.add('done');
    }
  }
  type();
}

// --- 6. CHUYỂN CẢNH KHI CHẠM VÀO HOA ---
roseTrigger.addEventListener('click', () => {
  if (isRoseClicked) return;
  isRoseClicked = true;

  const rect = roseTrigger.getBoundingClientRect();
  const flowerCenterX = rect.left + rect.width / 2;
  const flowerCenterY = rect.top + rect.height * 0.4;

  roseTrigger.classList.add('blooming');

  playMagicChime();
  if (!isPlayingAudio) {
    playSong();
  }

  burstHearts2D(flowerCenterX, flowerCenterY, 32);

  setTimeout(() => {
    sceneInitial.classList.add('fade-out');
    
    setTimeout(() => {
      sceneInitial.style.display = 'none';
      sceneWishes.classList.add('active');
      
      setTimeout(() => {
        startTypewriter(WISH_MESSAGE, wishTextElem, 38);
        burstHearts2D(window.innerWidth / 2, window.innerHeight * 0.4, 22);
      }, 250);
    }, 600);
  }, 700);
});

btnBurstLove.addEventListener('click', () => {
  const rect = btnBurstLove.getBoundingClientRect();
  burstHearts2D(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
  burstHearts2D(Math.random() * width, Math.random() * height * 0.5, 15);
  playMagicChime();
});

btnReplay.addEventListener('click', () => {
  sceneWishes.classList.remove('active');
  isRoseClicked = false;
  roseTrigger.classList.remove('blooming');

  setTimeout(() => {
    sceneInitial.style.display = 'flex';
    void sceneInitial.offsetWidth;
    sceneInitial.classList.remove('fade-out');
  }, 350);
});

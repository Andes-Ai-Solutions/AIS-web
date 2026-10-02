// Fondo animado "Los Andes": una cordillera dibujada con líneas (una por cada fila de terreno)
// que avanza lentamente hacia quien mira. Las cumbres lejanas son más altas, el centro es un
// valle (ahí va el texto), los nodos turquesa sobre las cumbres evocan una red neuronal y el
// punto turquesa del logo hace de sol detrás de las montañas.
//
// Respeta "reducir movimiento" (dibuja un cuadro fijo) y se pausa fuera de pantalla o con la
// pestaña oculta para no gastar batería.

type RGB = readonly [number, number, number];

// Ajustes visuales: cambiar aquí para retocar el fondo.
const BG = '#06121d'; // igual a --color-andes-950
const SKY_HORIZON = '#0d2a42';
const TURQ: RGB = [0, 180, 166];
const DISTANT: RGB = [52, 96, 138]; // azul de las montañas lejanas
const ROW_DEPTH = 0.55; // separación entre líneas de terreno
const Z_FAR = 24; // distancia de la última línea visible
const CAMERA_HEIGHT = 1.5;
const SPEED = 0.45; // avance por segundo
const PEAK_THRESHOLD = 2.1; // altura mínima para que una cumbre lleve nodo

const clamp01 = (x: number): number => Math.min(1, Math.max(0, x));
const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const rgba = ([r, g, b]: RGB, alpha: number): string => `rgb(${r} ${g} ${b} / ${alpha.toFixed(3)})`;
const mix = (a: RGB, b: RGB, t: number): RGB => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];

/** Ruido de valor 2D con semilla fija: las mismas montañas en cada visita. */
function createNoise(seed: number): (x: number, y: number) => number {
  let state = seed;
  const random = (): number => (state = (state * 16807) % 2147483647) / 2147483647;
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const fade = (t: number): number => t * t * (3 - 2 * t);
  const hash = (x: number, y: number): number => perm[(perm[x & 255] + (y & 255)) & 511] / 255;

  return (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const u = fade(x - xi);
    const v = fade(y - yi);
    const a = hash(xi, yi);
    const b = hash(xi + 1, yi);
    const c = hash(xi, yi + 1);
    const d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}

interface Star {
  x: number;
  y: number;
  radius: number;
  phase: number;
  speed: number;
  depth: number;
}

export function mountTerrain(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const horizonRatio = Number(canvas.dataset.horizon ?? '0.62');
  const noise = createNoise(11);

  const stars: Star[] = Array.from({ length: 110 }, () => ({
    x: Math.random(),
    y: Math.random() ** 1.4, // más estrellas arriba que cerca del horizonte
    radius: 0.4 + Math.random() * 0.9,
    phase: Math.random() * Math.PI * 2,
    speed: 0.6 + Math.random() * 1.6,
    depth: Math.random(),
  }));

  let width = 0;
  let height = 0;
  let offset = 0;
  let cameraX = 0;
  let targetX = 0;
  let lastTime = 0;
  let frameId = 0;
  let onScreen = true;

  /** Altura del terreno: crestas afiladas (ridged noise) y un valle en el centro. */
  const heightAt = (x: number, z: number): number => {
    let sum = 0;
    let amplitude = 1;
    let frequency = 0.16;
    let norm = 0;
    for (let octave = 0; octave < 4; octave++) {
      const n = 1 - Math.abs(noise(x * frequency + 100, z * frequency) * 2 - 1);
      sum += n * n * amplitude;
      norm += amplitude;
      amplitude *= 0.5;
      frequency *= 2.03;
    }
    const h = sum / norm;
    const valley = 0.25 + 0.75 * smoothstep(0.8, 7, Math.abs(x));
    return h * h * 3.6 * valley;
  };

  const draw = (time: number): void => {
    const horizon = height * horizonRatio;
    const focal = height * 0.95;
    const centerX = width / 2;

    // Cielo y suelo
    const sky = ctx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, BG);
    sky.addColorStop(1, SKY_HORIZON);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, horizon + 1);
    ctx.fillStyle = BG;
    ctx.fillRect(0, horizon, width, height - horizon);

    // Estrellas que titilan
    for (const star of stars) {
      const alpha = 0.12 + 0.5 * (0.5 + 0.5 * Math.sin(time * star.speed + star.phase));
      ctx.fillStyle = `rgb(255 255 255 / ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(star.x * width - cameraX * 6 * star.depth, star.y * horizon * 0.92, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // El punto turquesa del logo como sol, detrás de las montañas
    // A la derecha y cerca del horizonte, para no quedar detrás del titular
    const sunX = centerX + Math.max(width * 0.36, 180) - cameraX * 10;
    const sunY = horizon - height * 0.05;
    const sunRadius = Math.max(8, height * 0.028);
    const pulse = 0.85 + 0.15 * Math.sin(time * 0.8);
    const glow = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.5, sunX, sunY, sunRadius * 10);
    glow.addColorStop(0, rgba(TURQ, 0.28 * pulse));
    glow.addColorStop(1, rgba(TURQ, 0));
    ctx.fillStyle = glow;
    ctx.fillRect(sunX - sunRadius * 10, sunY - sunRadius * 10, sunRadius * 20, sunRadius * 20);
    ctx.fillStyle = rgba(TURQ, 0.95);
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();

    // Cordillera: de atrás hacia adelante; cada línea tapa lo que queda detrás de ella
    const step = width < 640 ? 10 : 7;
    const firstRow = Math.floor(offset / ROW_DEPTH);
    const rows = Math.ceil(Z_FAR / ROW_DEPTH);
    const xs: number[] = [];
    const ys: number[] = [];
    const hs: number[] = [];
    ctx.lineJoin = 'round';

    for (let i = rows; i >= 0; i--) {
      const worldZ = (firstRow + i) * ROW_DEPTH;
      const z = worldZ - offset;
      if (z < 0.6) continue;

      const depth = z / Z_FAR; // 0 cerca, 1 lejos
      const fadeIn = smoothstep(1, 0.8, depth); // las líneas nuevas aparecen sin saltos
      xs.length = 0;
      ys.length = 0;
      hs.length = 0;

      ctx.beginPath();
      for (let sx = -step; sx <= width + step; sx += step) {
        const worldX = cameraX + ((sx - centerX) * z) / focal;
        const h = heightAt(worldX, worldZ) * (1 + depth * 1.3);
        const sy = horizon + ((CAMERA_HEIGHT - h) * focal) / z;
        if (xs.length === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
        xs.push(sx);
        ys.push(sy);
        hs.push(h);
      }
      ctx.lineTo(width + step, height + 2);
      ctx.lineTo(-step, height + 2);
      ctx.closePath();
      ctx.fillStyle = BG;
      ctx.fill();

      const nearness = 1 - depth;
      ctx.strokeStyle = rgba(mix(DISTANT, TURQ, nearness), fadeIn * (0.3 + 0.55 * nearness));
      ctx.lineWidth = 0.7 + nearness * 1.1;
      ctx.stroke();

      // Nodos sobre las cumbres (una de cada cuatro líneas), unidos entre sí
      if ((firstRow + i) % 4 !== 0 || depth > 0.9) continue;
      let prevX = Number.NaN;
      let prevY = Number.NaN;
      for (let k = 1; k < xs.length - 1; k++) {
        const isPeak = ys[k] < ys[k - 1] && ys[k] <= ys[k + 1] && hs[k] > PEAK_THRESHOLD;
        if (!isPeak || xs[k] - prevX < 48) continue;

        const twinkle = 0.55 + 0.45 * Math.sin(time * 1.6 + worldZ * 1.3 + (cameraX + xs[k] / 40) * 0.7);
        if (!Number.isNaN(prevX)) {
          ctx.strokeStyle = rgba(TURQ, 0.14 * fadeIn * nearness);
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(xs[k], ys[k]);
          ctx.stroke();
        }
        ctx.fillStyle = rgba(TURQ, fadeIn * twinkle * (0.45 + 0.5 * nearness));
        ctx.beginPath();
        ctx.arc(xs[k], ys[k], 1.2 + nearness * 2, 0, Math.PI * 2);
        ctx.fill();
        prevX = xs[k];
        prevY = ys[k];
      }
    }
  };

  const frame = (now: number): void => {
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    offset += SPEED * dt;
    cameraX += (targetX - cameraX) * Math.min(1, dt * 2.5);
    draw(now / 1000);
    frameId = requestAnimationFrame(frame);
  };

  const start = (): void => {
    if (frameId || reducedMotion.matches || !onScreen || document.hidden) return;
    lastTime = performance.now();
    frameId = requestAnimationFrame(frame);
  };

  const stop = (): void => {
    cancelAnimationFrame(frameId);
    frameId = 0;
  };

  const resize = (): void => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(performance.now() / 1000);
  };

  new ResizeObserver(resize).observe(canvas);

  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) start();
    else stop();
  }).observe(canvas);

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) stop();
    else start();
  });

  // Las montañas se desplazan un poco con el mouse (solo mouse, no táctil)
  window.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse') return;
      targetX = (event.clientX / window.innerWidth - 0.5) * 1.6;
    },
    { passive: true },
  );

  resize();
  start();
}

/**
 * Canvas grass for the homepage hero: three depth layers of blades that sway
 * in a gusty wind and bend away from the pointer as it brushes through.
 */

type Blade = {
  x: number;
  h: number;
  w: number;
  color: string;
  phase: number;
  lean: number;
  stiff: number;
  angle: number;
  vel: number;
};

type Layer = {
  ctx: CanvasRenderingContext2D;
  blades: Blade[];
  /** How strongly wind and the pointer move this layer (parallax depth). */
  depth: number;
  /** Darken the very bottom so blades sink into the ground. */
  ground?: string;
};

export type Pointer = { x: number; y: number; vx: number; vy: number; inside: boolean };

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export class Meadow {
  private layers: Layer[] = [];
  private width = 0;
  private height = 0;
  private dpr = 1;
  private canvases: HTMLCanvasElement[];

  constructor(back: HTMLCanvasElement, mid: HTMLCanvasElement, front: HTMLCanvasElement) {
    this.canvases = [back, mid, front];
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    for (const c of this.canvases) {
      c.width = Math.round(width * this.dpr);
      c.height = Math.round(height * this.dpr);
    }
    const ctx = (c: HTMLCanvasElement) => {
      const context = c.getContext("2d")!;
      context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      return context;
    };
    // Density scales with width so phones stay smooth.
    const dense = width < 700 ? 0.6 : 1;
    this.layers = [
      {
        ctx: ctx(this.canvases[0]),
        depth: 0.55,
        blades: this.makeBlades(Math.round((width / 5) * dense), [0.08, 0.17], [3, 6], () =>
          `hsl(${rand(78, 92)} ${rand(45, 60)}% ${rand(48, 60)}%)`
        ),
      },
      {
        ctx: ctx(this.canvases[1]),
        depth: 0.85,
        ground: "rgba(34, 58, 18, 0.55)",
        blades: this.makeBlades(Math.round((width / 5.5) * dense), [0.12, 0.27], [4, 8], () =>
          Math.random() < 0.25
            ? `hsl(${rand(70, 82)} ${rand(55, 70)}% ${rand(50, 62)}%)` // sunlit blades
            : `hsl(${rand(82, 100)} ${rand(42, 58)}% ${rand(32, 46)}%)`
        ),
      },
      {
        ctx: ctx(this.canvases[2]),
        depth: 1.2,
        blades: this.makeBlades(Math.round((width / 16) * dense), [0.2, 0.38], [9, 18], () =>
          `hsl(${rand(92, 108)} ${rand(38, 52)}% ${rand(16, 26)}%)`
        ),
      },
    ];
  }

  private makeBlades(count: number, hRange: [number, number], wRange: [number, number], color: () => string) {
    const blades: Blade[] = [];
    // Grass grows in tufts: blades fan out from a shared root.
    while (blades.length < count) {
      const root = rand(-30, this.width + 30);
      const tuft = Math.round(rand(3, 9));
      const tall = rand(hRange[0], hRange[1]) * this.height;
      const tilt = rand(-0.15, 0.15);
      for (let i = 0; i < tuft; i++) {
        const offset = rand(-1, 1);
        blades.push({
          x: root + offset * 12,
          h: tall * rand(0.45, 1),
          w: rand(wRange[0], wRange[1]),
          color: color(),
          phase: rand(0, Math.PI * 2),
          // Outer blades of a tuft splay further.
          lean: tilt + offset * rand(0.15, 0.5),
          stiff: rand(14, 28),
          angle: tilt + offset * 0.3,
          vel: 0,
        });
      }
    }
    // Tall blades behind short ones reads as depth.
    return blades.sort((a, b) => b.h - a.h);
  }

  /** Advance the simulation; t in ms, dt in seconds. */
  step(t: number, dt: number, pointer: Pointer) {
    const gust = Math.sin(t * 0.00031) * 0.5 + Math.sin(t * 0.00113 + 1.7) * 0.3 + Math.sin(t * 0.0021) * 0.12;
    const radius = Math.max(110, this.width * 0.09);
    for (const layer of this.layers) {
      for (const b of layer.blades) {
        const wind = (0.1 + gust * 0.16) * layer.depth + Math.sin(t * 0.0016 + b.x * 0.012 + b.phase) * 0.05 * layer.depth;
        let push = 0;
        if (pointer.inside) {
          // Sample the blade near its tip, where a hand brushing through would touch it.
          const px = b.x + Math.sin(b.angle) * b.h * 0.7;
          const py = this.height - Math.cos(b.angle) * b.h * 0.7;
          const dx = px - pointer.x;
          const dy = py - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < radius) {
            const f = (1 - d / radius) ** 2;
            push = (Math.sign(dx) * 1.4 + pointer.vx * 0.9) * f * layer.depth;
          }
        }
        const target = b.lean + wind + Math.max(-1.1, Math.min(1.1, push));
        const acc = (target - b.angle) * b.stiff - b.vel * 5.5;
        b.vel += acc * dt;
        b.angle += b.vel * dt;
      }
    }
  }

  draw() {
    const { width, height } = this;
    for (const layer of this.layers) {
      const ctx = layer.ctx;
      ctx.clearRect(0, 0, width, height);
      for (const b of layer.blades) {
        // A blade curves more towards its tip: the lower third stays fairly upright.
        const a = b.angle;
        const c1x = b.x + Math.sin(a * 0.25) * b.h * 0.4;
        const c1y = height - Math.cos(a * 0.25) * b.h * 0.4;
        const c2x = c1x + Math.sin(a * 0.7) * b.h * 0.35;
        const c2y = c1y - Math.cos(a * 0.7) * b.h * 0.35;
        const tipX = c2x + Math.sin(a * 1.3) * b.h * 0.3;
        const tipY = c2y - Math.cos(a * 1.3) * b.h * 0.3;
        const half = b.w / 2;
        ctx.beginPath();
        ctx.moveTo(b.x - half, height + 2);
        ctx.bezierCurveTo(c1x - half * 0.8, c1y, c2x - half * 0.45, c2y, tipX, tipY);
        ctx.bezierCurveTo(c2x + half * 0.45, c2y, c1x + half * 0.8, c1y, b.x + half, height + 2);
        ctx.closePath();
        ctx.fillStyle = b.color;
        ctx.fill();
      }
      if (layer.ground) {
        const g = ctx.createLinearGradient(0, height * 0.86, 0, height);
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(1, layer.ground);
        ctx.fillStyle = g;
        ctx.fillRect(0, height * 0.86, width, height * 0.14);
      }
    }
  }
}

export interface Pos {
  x: number;
  y: number;
}

export interface Vector2d {
  x: number;
  y: number;
}

export enum Orientation {
  Left,
  Right,
}

export class Entity {
  level: Level;
  pos: Pos;
  velocity: Vector2d;
  size: number;
  color: string;
  id: string;
  exists: boolean;
  moveSpeed: number;

  constructor(
    level: Level,
    pos: Pos,
    velocity: Vector2d,
    size: number,
    color: string,
    moveSpeed: number,
  ) {
    this.level = level;
    this.pos = {
      x: pos.x + size,
      y: pos.y + size,
    };
    this.velocity = velocity;
    this.size = size;
    this.color = color;
    this.id = crypto.randomUUID();
    this.exists = true;
    this.moveSpeed = moveSpeed;
  }

  tick(): void {
    this.level.ctx.beginPath();
    this.level.ctx.arc(
      this.pos.x,
      this.pos.y,
      this.size,
      0,
      2 * Math.PI,
      false,
    );
    this.level.ctx.fillStyle = this.color;
    this.level.ctx.fill();

    this.pos.x += this.velocity.x * this.moveSpeed;
    this.pos.y += this.velocity.y * this.moveSpeed;
  }

  dead(): boolean {
    const dx = this.level.ctx.canvas.clientWidth - this.pos.x;
    const dy = this.level.ctx.canvas.clientHeight - this.pos.y;

    return (
      !this.exists || this.pos.x <= 0 || dx <= 0 || this.pos.y <= 0 || dy <= 0
    );
  }

  hits(pos: Pos, size: number): boolean {
    const dx = pos.x - this.pos.x;
    const dy = pos.y - this.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    return dist < this.size + size;
  }
}

export class Level {
  ctx: CanvasRenderingContext2D;
  tickSpeed: number;
  color: string;
  entities: Entity[];
  score: Record<string, number>;
  pause: boolean;

  constructor(ctx: CanvasRenderingContext2D, tickSpeed: number, color: string) {
    this.ctx = ctx;
    this.tickSpeed = tickSpeed;
    this.color = color;
    this.entities = [];
    this.score = {};
    this.pause = false;
  }

  run(): number {
    return setInterval(() => {
      if (this.pause) return;

      this.discard();
      this.tick();
    }, this.tickSpeed);
  }

  tick(): void {
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const e = this.entities[i];
      e.tick();

      if (e.dead()) {
        this.entities.splice(i, 1);
      }
    }
  }

  discard(): void {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      0,
      0,
      this.ctx.canvas.clientWidth,
      this.ctx.canvas.clientHeight,
    );
  }

  spawn(e: Entity) {
    this.entities.push(e);
  }

  getEntityAt(pos: Pos) {
    return this.entities.find((e) => e.hits(pos, 10));
  }
}

export class Player extends Entity {
  orientation: Orientation;
  shotSpeed: number;
  shotProgress: number;

  constructor(
    level: Level,
    pos: Pos,
    velocity: Vector2d,
    size: number,
    color: string,
    orientation: Orientation,
  ) {
    super(level, pos, velocity, size, color, 1);

    this.orientation = orientation;
    this.shotSpeed = 0.1;
    this.shotProgress = 0;

    this.subscribe();
  }

  tick(): void {
    if (
      this.pos.y <= this.size ||
      this.pos.y >= this.level.ctx.canvas.clientHeight - this.size
    ) {
      this.velocity.y *= -1;
    }

    this.shotProgress += this.shotSpeed;

    if (this.shotProgress >= 1) {
      const velocity = {
        x: 10 * (this.orientation === Orientation.Right ? 1 : -1),
        y: 0,
      };
      const bullet = new Bullet(
        this.level,
        this.pos,
        velocity,
        this.size / 2,
        this.color,
        this,
        1
      );
      this.level.spawn(bullet);
      this.shotProgress = 0;
    }

    super.tick();
  }

  subscribe() {
    this.level.score[this.id] = 0;
  }
}

export class Bullet extends Entity {
  player: Player;

  constructor(
    level: Level,
    pos: Pos,
    velocity: Vector2d,
    size: number,
    color: string,
    player: Player,
    moveSpeed: number,
  ) {
    super(level, pos, velocity, size, color, moveSpeed);

    this.player = player;
  }

  tick() {
    const e = this.level.entities.find(
      (e) => e instanceof Player && e.id != this.player.id,
    );

    if (e && this.hits(e.pos, e.size)) {
      this.level.score[this.player.id] += 1;
      this.exists = false;
    }

    super.tick();
  }
}

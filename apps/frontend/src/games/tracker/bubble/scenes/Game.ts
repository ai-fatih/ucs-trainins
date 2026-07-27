import * as Phaser from 'phaser';
import SceneKeys from '../consts/SceneKeys';
import BallGrid from '../game/BallGrid';
import Shooter from '../game/Shooter';
import Ball from '../game/Ball';

const BALL_DIAMETER = 28;
const MAX_CELLS = 80;

export default class GameScene extends Phaser.Scene {
  grid!: BallGrid;
  shooter!: Shooter;
  gridSprites: (Phaser.GameObjects.Image | null)[][] = [];
  score = 0;
  shotCount = 0;
  shotsUntilDrop = 5;
  flyingBall: Ball | null = null;

  constructor() {
    super({ key: SceneKeys.Game });
  }

  create(): void {
    this.score = 0;
    this.shotCount = 0;
    this.flyingBall = null;
    this.gridSprites = [];

    this.grid = new BallGrid(this);
    this.grid.initGrid();

    this.renderGrid();

    this.shooter = new Shooter(this, () => {});

    this.input.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      if (this.flyingBall) return;
      if (ptr.worldY < this.shooter.baseY - 20) {
        const ball = this.shooter.fire();
        if (ball) this.onFire(ball);
      }
    });

    this.scene.launch(SceneKeys.GameUI, { gameScene: this });
  }

  private renderGrid(): void {
    for (const row of this.gridSprites) {
      for (const sprite of row) {
        if (sprite) sprite.destroy();
      }
    }
    this.gridSprites = [];

    for (let r = 0; r < this.grid.grid.length; r++) {
      const rowSprites: (Phaser.GameObjects.Image | null)[] = [];
      const cols = this.grid.getCols(r);
      for (let c = 0; c < cols; c++) {
        const color = this.grid.grid[r][c];
        if (color !== null) {
          const pos = this.grid.getPosition(c, r);
          const sprite = this.add.image(pos.x, pos.y, this.textureForColor(color));
          sprite.setDepth(5);
          rowSprites.push(sprite);
        } else {
          rowSprites.push(null);
        }
      }
      this.gridSprites.push(rowSprites);
    }
  }

  private textureForColor(color: number): string {
    const map: Record<number, string> = {
      0: 'ball-red',
      1: 'ball-green',
      2: 'ball-blue',
      3: 'ball-yellow',
    };
    return map[color];
  }

  private onFire(ball: Ball): void {
    this.shotCount++;
    this.flyingBall = ball;
  }

  update(): void {
    const ptr = this.input.activePointer;
    if (ptr && !this.flyingBall) this.shooter.update(ptr);

    if (this.flyingBall) this.checkFlyingBall(this.flyingBall);
  }

  private checkFlyingBall(ball: Ball): void {
    if (!ball.body || !ball.body.enable) return;

    const b = ball.body as Phaser.Physics.Arcade.Body;

    // Wall bounce
    if (ball.x <= 14 || ball.x >= this.scale.width - 14) {
      b.velocity.x *= -1;
      ball.x = Phaser.Math.Clamp(ball.x, 15, this.scale.width - 15);
    }

    // Ceiling
    if (ball.y <= 40) {
      this.attachBall(ball);
      return;
    }

    // Check collision with grid sprites
    for (let r = 0; r < this.gridSprites.length; r++) {
      const cols = this.grid.getCols(r);
      for (let c = 0; c < cols; c++) {
        const sprite = this.gridSprites[r][c];
        if (!sprite) continue;
        const pos = this.grid.getPosition(c, r);
        const dist = Phaser.Math.Distance.Between(ball.x, ball.y, pos.x, pos.y);
        if (dist < BALL_DIAMETER) {
          this.attachBall(ball);
          return;
        }
      }
    }
  }

  private attachBall(ball: Ball): void {
    if (ball.body) ball.body.enable = false;
    ball.setVelocity(0, 0);
    this.flyingBall = null;

    const pos = this.grid.findNearestColRow(ball.x, ball.y);
    const gridPos = this.grid.getPosition(pos.col, pos.row);

    this.tweens.add({
      targets: ball,
      x: gridPos.x,
      y: gridPos.y,
      duration: 80,
      onComplete: () => {
        this.grid.setBall(pos.col, pos.row, ball.ballColor);
        this.renderGrid();
        ball.destroy();

        const matched = this.grid.findMatch(pos.col, pos.row);
        if (matched.length >= 3) {
          this.clearMatched(matched);
        } else {
          this.afterAttach();
        }
      },
    });
  }

  private clearMatched(matched: { col: number; row: number }[]): void {
    for (const m of matched) {
      this.grid.setBall(m.col, m.row, null);
    }

    const cx = matched.reduce((s, m) => s + this.grid.getPosition(m.col, m.row).x, 0) / matched.length;
    const cy = matched.reduce((s, m) => s + this.grid.getPosition(m.col, m.row).y, 0) / matched.length;

    for (let i = 0; i < 6; i++) {
      const p = this.add.particles(cx, cy, 'particle', {
        speed: { min: 30, max: 100 },
        angle: { min: 0, max: 360 },
        lifespan: 400,
        quantity: 1,
        scale: { start: 1.5, end: 0 },
        emitting: false,
      });
      p.setDepth(20);
      p.explode(2);
      this.time.delayedCall(600, () => p.destroy());
    }

    this.score += matched.length * 10;

    const orphans = this.grid.removeOrphans();
    this.score += orphans.length * 5;

    this.renderGrid();
    this.events.emit('scoreUpdate', this.score);

    if (this.grid.isEmpty()) {
      this.time.delayedCall(500, () => this.endGame(true));
    } else {
      this.afterAttach();
    }
  }

  private afterAttach(): void {
    if (this.grid.getCellCount() > MAX_CELLS) {
      this.endGame(false);
      return;
    }

    if (this.shotCount >= this.shotsUntilDrop) {
      this.shotCount = 0;
      this.grid.addBallsToGrid();
      this.renderGrid();

      if (this.grid.isGameOver()) {
        this.time.delayedCall(400, () => this.endGame(false));
        return;
      }
    }

    this.time.delayedCall(200, () => {
      this.shooter.spawnBall();
    });
  }

  private endGame(won: boolean): void {
    this.scene.stop(SceneKeys.GameUI);
    this.scene.start(SceneKeys.GameOver, { won, score: this.score });
  }

  shutdown(): void {
    if (this.shooter) this.shooter.destroy();
    this.flyingBall = null;
  }
}
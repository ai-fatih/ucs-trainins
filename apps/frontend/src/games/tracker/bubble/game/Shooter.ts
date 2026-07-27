import * as Phaser from 'phaser';
import BallColor from '../consts/BallColor';
import TextureKeys from '../consts/TextureKeys';
import Ball from './Ball';

export default class Shooter {
  baseX: number;
  baseY: number;
  currentBall: Ball | null = null;
  nextColor: BallColor;
  private shooterSprite: Phaser.GameObjects.Image;
  private aimLine: Phaser.GameObjects.Graphics;

  constructor(private scene: Phaser.Scene, private fireCallback: (ball: Ball) => void) {
    this.baseX = scene.scale.width / 2;
    this.baseY = scene.scale.height - 50;
    this.nextColor = Ball.randomColor();

    this.shooterSprite = scene.add.image(this.baseX, this.baseY, TextureKeys.Shooter);
    this.aimLine = scene.add.graphics();

    this.spawnBall();
  }

  spawnBall(): void {
    this.currentBall = new Ball(this.scene, this.baseX, this.baseY, this.nextColor);
    this.currentBall.body!.enable = false;
    this.nextColor = Ball.randomColor();
  }

  update(pointer: Phaser.Input.Pointer): void {
    const angle = Phaser.Math.Angle.Between(this.baseX, this.baseY, pointer.worldX, pointer.worldY);
    const clamped = Phaser.Math.Clamp(angle, -Math.PI * 0.45, Math.PI * 0.45);
    this.shooterSprite.setRotation(clamped);

    this.aimLine.clear();
    this.aimLine.lineStyle(1, 0x9ca3af, 0.5);
    const len = pointer.worldY < this.baseY ? 500 : 300;
    const dx = Math.cos(clamped) * len;
    const dy = Math.sin(clamped) * len;
    for (let i = 0; i < 20; i++) {
      const t = i / 20;
      const x = this.baseX + dx * t;
      const y = this.baseY + dy * t;
      if (i % 3 === 0) this.aimLine.fillStyle(0x9ca3af, 0.4);
      else this.aimLine.fillStyle(0xd1d5db, 0.2);
      this.aimLine.fillCircle(x, y, 2);
    }
  }

  fire(): Ball | null {
    if (!this.currentBall) return null;
    const angle = this.shooterSprite.rotation;
    const ball = this.currentBall;

    const speed = 600;
    ball.body!.enable = true;
    ball.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    ball.setDepth(10);

    return ball;
  }

  reset(): void {
    if (this.currentBall) this.currentBall.destroy();
    this.currentBall = null;
  }

  destroy(): void {
    if (this.currentBall) this.currentBall.destroy();
    this.shooterSprite.destroy();
    this.aimLine.destroy();
  }
}
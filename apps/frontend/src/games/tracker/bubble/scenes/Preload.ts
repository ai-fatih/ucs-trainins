import * as Phaser from 'phaser';
import TextureKeys from '../consts/TextureKeys';
import Colors from '../consts/Colors';
import SceneKeys from '../consts/SceneKeys';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.Preload });
  }

  create(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    const g = this.make.graphics({ x: 0, y: 0 }, false);

    const colors: [TextureKeys, number][] = [
      [TextureKeys.BallRed, Colors.Red],
      [TextureKeys.BallGreen, Colors.Green],
      [TextureKeys.BallBlue, Colors.Blue],
      [TextureKeys.BallYellow, Colors.Yellow],
    ];

    for (const [key, color] of colors) {
      g.clear();
      g.fillStyle(color, 1);
      g.fillCircle(16, 16, 14);
      g.lineStyle(2, 0xffffff, 0.6);
      g.strokeCircle(16, 16, 14);
      g.generateTexture(key, 32, 32);
    }

    g.clear();
    g.fillStyle(Colors.Dark, 1);
    g.fillRect(0, 0, 36, 36);
    g.fillStyle(Colors.White, 1);
    g.fillTriangle(10, 6, 10, 30, 30, 18);
    g.generateTexture(TextureKeys.Shooter, 36, 36);

    g.clear();
    g.fillStyle(Colors.White, 1);
    g.fillCircle(2, 2, 2);
    g.generateTexture(TextureKeys.Particle, 4, 4);

    g.destroy();

    this.scene.start(SceneKeys.Title);
  }
}
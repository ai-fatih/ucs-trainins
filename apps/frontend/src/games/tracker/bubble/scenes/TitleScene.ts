import * as Phaser from 'phaser';
import SceneKeys from '../consts/SceneKeys';
import Colors from '../consts/Colors';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.Title });
  }

  create(): void {
    const w = this.scale.width;
    const h = this.scale.height;

    this.add.text(w / 2, h * 0.3, 'Bubble Pop', {
      fontSize: '42px',
      fontFamily: 'Arial, sans-serif',
      color: '#1a56db',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const balls: number[] = [Colors.Red, Colors.Green, Colors.Blue, Colors.Yellow];
    for (let i = 0; i < 4; i++) {
      const g = this.make.graphics({}, false);
      g.fillStyle(balls[i], 1);
      g.fillCircle(16, 16, 14);
      g.generateTexture(`_title_ball_${i}`, 32, 32);
      g.destroy();
      this.add.image(w / 2 - 48 + i * 32, h * 0.45, `_title_ball_${i}`);
    }

    this.add.text(w / 2, h * 0.56, 'Стреляй шарами, собирай тройки!', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      color: '#6b7280',
    }).setOrigin(0.5);

    const btn = this.add.text(w / 2, h * 0.7, '▶ ИГРАТЬ', {
      fontSize: '22px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      backgroundColor: '#059669',
      padding: { x: 24, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#047857' }));
    btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#059669' }));
    btn.on('pointerdown', () => this.scene.start(SceneKeys.Game));
  }
}
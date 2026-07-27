import * as Phaser from 'phaser';
import SceneKeys from '../consts/SceneKeys';
import Colors from '../consts/Colors';

interface GameOverData {
  won: boolean;
  score: number;
}

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.GameOver });
  }

  create(data: GameOverData): void {
    const w = this.scale.width;
    const h = this.scale.height;

    const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.5);
    overlay.setInteractive();

    const panelY = h / 2 - 60;

    this.add.text(w / 2, panelY, data.won ? '🎉 ПОБЕДА!' : '💥 ПОРАЖЕНИЕ', {
      fontSize: '32px',
      fontFamily: 'Arial, sans-serif',
      color: data.won ? '#059669' : '#dc2626',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(w / 2, panelY + 50, `Очки: ${data.score}`, {
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#374151',
    }).setOrigin(0.5);

    const btnW = 180;
    const btnH = 44;
    const btnY = panelY + 110;

    const btn = this.add.graphics();
    btn.fillStyle(0x1a56db, 1);
    btn.fillRoundedRect(w / 2 - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);

    const btnText = this.add.text(w / 2, btnY, '↻ ЕЩЁ РАЗ', {
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const hitArea = this.add.rectangle(w / 2, btnY, btnW, btnH, 0x000000, 0).setInteractive({ useHandCursor: true });
    hitArea.on('pointerover', () => {
      btn.clear();
      btn.fillStyle(0x1e40af, 1);
      btn.fillRoundedRect(w / 2 - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);
    });
    hitArea.on('pointerout', () => {
      btn.clear();
      btn.fillStyle(0x1a56db, 1);
      btn.fillRoundedRect(w / 2 - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);
    });
    hitArea.on('pointerdown', () => {
      this.scene.stop();
      this.scene.start(SceneKeys.Game);
    });
  }
}
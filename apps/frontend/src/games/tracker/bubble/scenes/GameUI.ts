import * as Phaser from 'phaser';
import SceneKeys from '../consts/SceneKeys';

export default class GameUIScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SceneKeys.GameUI });
  }

  create(data: { gameScene: Phaser.Scene }): void {
    const w = this.scale.width;

    this.scoreText = this.add.text(12, 8, 'Очки: 0', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      color: '#374151',
      fontStyle: 'bold',
    });

    this.add.text(w - 12, 8, 'Bubble Pop', {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      color: '#9ca3af',
    }).setOrigin(1, 0);

    if (data.gameScene) {
      data.gameScene.events.on('scoreUpdate', (s: number) => {
        this.scoreText.setText(`Очки: ${s}`);
      });
    }
  }
}
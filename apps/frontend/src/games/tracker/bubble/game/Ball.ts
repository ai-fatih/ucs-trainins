import * as Phaser from 'phaser';
import BallColor from '../consts/BallColor';
import TextureKeys from '../consts/TextureKeys';

const TEXTURE_MAP: Record<BallColor, TextureKeys> = {
  [BallColor.Red]: TextureKeys.BallRed,
  [BallColor.Green]: TextureKeys.BallGreen,
  [BallColor.Blue]: TextureKeys.BallBlue,
  [BallColor.Yellow]: TextureKeys.BallYellow,
};

export default class Ball extends Phaser.Physics.Arcade.Sprite {
  ballColor: BallColor;

  constructor(scene: Phaser.Scene, x: number, y: number, color: BallColor) {
    super(scene, x, y, TEXTURE_MAP[color]);
    this.ballColor = color;
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  static randomColor(): BallColor {
    return Phaser.Math.Between(0, 3) as BallColor;
  }

  static textureFor(color: BallColor): TextureKeys {
    return TEXTURE_MAP[color];
  }
}
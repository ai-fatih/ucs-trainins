import * as Phaser from 'phaser';
import { createGameConfig } from './config';
import PreloadScene from './scenes/Preload';
import TitleScene from './scenes/TitleScene';
import GameScene from './scenes/Game';
import GameUIScene from './scenes/GameUI';
import GameOverScene from './scenes/GameOver';

export function createBubbleGame(parent: HTMLElement): Phaser.Game {
  const config = createGameConfig(parent);
  const game = new Phaser.Game(config);
  game.scene.add('preload', PreloadScene, false);
  game.scene.add('title', TitleScene, false);
  game.scene.add('game', GameScene, false);
  game.scene.add('game-ui', GameUIScene, false);
  game.scene.add('game-over', GameOverScene, false);
  game.scene.start('preload');
  return game;
}
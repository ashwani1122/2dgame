require("dotenv").config();
import Phaser from 'phaser';
import { GameScene } from './GameScene';

new Phaser.Game({
    type: Phaser.AUTO,
    width: 2000,
    height: 1400,
    backgroundColor: '#242424',
    scene: [GameScene],
});

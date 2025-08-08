import Phaser from 'phaser';
import { socket, send } from './socket';

export class GameScene extends Phaser.Scene {
    tileSize = 32;
    playerBox!: Phaser.GameObjects.Rectangle;
    otherUsers: Record<string, Phaser.GameObjects.Rectangle> = {};

    preload() {
    }

    create() {
        const token = process.env.JWT_TOKEN;
        const spaceId = 'cme2bkhh90002vlp2yy3azmxa'; 
        send({
        type: 'join',
        payload: {
            token,
            spaceId,
        },
        });

        socket.addEventListener('message', (event) => {
        const msg = JSON.parse(event.data);

        switch (msg.type) {
            case 'space-joined': {
  const { x, y } = msg.payload.spawn;

  this.playerBox = this.add.rectangle(
    x * this.tileSize,
    y * this.tileSize,
    this.tileSize,
    this.tileSize,
    0xff0000 // red box for self
  );

  for (const user of msg.payload.users) {
    const other = this.add.rectangle(
      user.x * this.tileSize,
      user.y * this.tileSize,
      this.tileSize,
      this.tileSize,
      0x0000ff // blue for others
    );
    this.otherUsers[user.id] = other; // <- Use `id`
  }
  break;
}

case 'user-joined': {
  const { id, x, y } = msg.payload;
  const box = this.add.rectangle(
    x * this.tileSize,
    y * this.tileSize,
    this.tileSize,
    this.tileSize,
    0x0000ff
  );
  this.otherUsers[id] = box;
  break;
}

case 'movement': {
  const { userId, x, y } = msg.payload;
  if (userId && this.otherUsers[userId]) {
    this.otherUsers[userId].setPosition(x * this.tileSize, y * this.tileSize);
  }
  break;
}

            case 'movement-rejected': {
            const { x, y } = msg.payload;
            this.playerBox.setPosition(x * this.tileSize, y * this.tileSize);
            break;
            }

            case 'user-left': {
            const { userId } = msg.payload;
            this.otherUsers[userId]?.destroy();
            delete this.otherUsers[userId];
            break;
            }
        }
        });

        this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
        if (!this.playerBox) return;
        const currentX = this.playerBox.x / this.tileSize;
        const currentY = this.playerBox.y / this.tileSize;
        let newX = currentX;
        let newY = currentY;
        switch (event.key) {
            case 'ArrowUp':
            newY -= 1;
            break;
            case 'ArrowDown':
            newY += 1;
            break;
            case 'ArrowLeft':
            newX -= 1;
            break;
            case 'ArrowRight':
            newX += 1;
            break;
            default:
            return;
        }
        send({
            type: 'move',
            payload: {
            x: newX,
            y: newY,
            },
        });
        });
    }
}

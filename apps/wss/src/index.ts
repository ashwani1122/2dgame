import { WebSocketServer } from 'ws';
import { User } from './User';

const wss = new WebSocketServer({ port: 3002 });

wss.on('connection', function connection(ws) {
    console.log("yser connected")
    let user = new User(ws);
    console.log("yser connected 2")
    ws.on('error', console.error);

    ws.on('close', () => {
        user?.destroy();
    });
});
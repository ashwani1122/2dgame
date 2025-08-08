export const socket = new WebSocket("ws://localhost:3002");

export const send = (msg: any) => {
    const str = JSON.stringify(msg);
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(str);
    } else {
        socket.addEventListener('open', () => {
        socket.send(str);
        }, { once: true });
    }
};


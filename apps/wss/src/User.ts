import { WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import client from "@repo/db/client";
import { RoomManager } from "./RoomManager";
import type { OutgoingMessage } from "./types";
import { JWT_PASSWORD } from "./config";

function rid(n: number) {
    const s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let r = "";
    for (let i = 0; i < n; i++) r += s.charAt(Math.floor(Math.random() * s.length));
    return r;
    }

    export class User {
    public id: string;
    public userId?: string;
    private spaceId?: string;
    private x: number;
    private y: number;
    private ws: WebSocket;

    constructor(ws: WebSocket) {
        this.id = rid(10);
        this.x = Math.floor(Math.random() * 10);
        this.y = Math.floor(Math.random() * 10);
        this.ws = ws;
        this.initHandlers();
    }

    private initHandlers() {
        this.ws.on("message", async (data) => {
        let parsed: any;
        try {
            parsed = JSON.parse(data.toString());
        } catch {
            this.send({ type: "error", payload: { message: "invalid_json" } });
            return;
        }
        const t = parsed?.type;
        if (t === "join") {
            const spaceId = parsed?.payload?.spaceId;
            const token = parsed?.payload?.token;
            if (!spaceId || !token) {
            this.send({ type: "error", payload: { message: "missing_join_payload" } });
            return;
            }
            let userId: string | undefined;
            try {
            const decoded = jwt.verify(token, JWT_PASSWORD) as JwtPayload & { userId?: string };
            userId = decoded.userId;
            } catch {
            this.send({ type: "error", payload: { message: "invalid_token" } });
            return;
            }
            if (!userId) {
            this.send({ type: "error", payload: { message: "no_user_in_token" } });
            return;
            }
            const space = await client.space.findFirst({ where: { id: spaceId } });
            if (!space) {
            this.send({ type: "error", payload: { message: "space_not_found" } });
            return;
            }
            this.userId = userId;
            this.spaceId = spaceId;
            this.x = Math.floor(Math.random() * 10);
            this.y = Math.floor(Math.random() * 10);
            RoomManager.getInstance().addUser(spaceId, this);
            const others = RoomManager.getInstance()
            .listUsers(spaceId)
            .filter((u) => u.id !== this.id)
            .map((u) => ({ userId: u.userId!, x: u.xCoord(), y: u.yCoord() }));
            this.send({
            type: "space-joined",
            payload: { spawn: { x: this.x, y: this.y }, users: others },
            });
            RoomManager.getInstance().broadcast(
            { type: "user-joined", payload: { userId: this.userId!, x: this.x, y: this.y } },
            this,
            this.spaceId!
            );
            return;
        }
        if (t === "move") {
            if (!this.spaceId || !this.userId) return;
            const nx = parsed?.payload?.x;
            const ny = parsed?.payload?.y;
            if (typeof nx !== "number" || typeof ny !== "number") return;
            const dx = Math.abs(this.x - nx);
            const dy = Math.abs(this.y - ny);
            if (!((dx === 1 && dy === 0) || (dx === 0 && dy === 1))) {
            this.send({ type: "movement-rejected", payload: { x: this.x, y: this.y } });
            return;
            }
            this.x = nx;
            this.y = ny;
            RoomManager.getInstance().broadcast(
            { type: "movement", payload: { userId: this.userId!, x: this.x, y: this.y } },
            this,
            this.spaceId
            );
            return;
        }
        });
    }

    destroy() {
        if (!this.spaceId) return;
        RoomManager.getInstance().broadcast(
        { type: "user-left", payload: { userId: this.userId! } },
        this,
        this.spaceId
        );
        RoomManager.getInstance().removeUser(this, this.spaceId);
    }

    send(payload: OutgoingMessage) {
        if (this.ws.readyState === this.ws.OPEN) {
        try {
            this.ws.send(JSON.stringify(payload));
        } catch {}
        }
    }

    xCoord() {
        return this.x;
    }

    yCoord() {
        return this.y;
    }
}

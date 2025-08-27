import type { User } from "./User";
import type { OutgoingMessage } from "./types";

export class RoomManager {
    rooms: Map<string, Set<User>> = new Map();
    static instance: RoomManager;

    private constructor() {}
   
    static getInstance() {
        // alert("inside get instance");
        if (!this.instance) this.instance = new RoomManager();
        // alert("inside get instance");
        return this.instance;
    }

    addUser(spaceId: string, user: User) {
        console.log("inside add user");
        // alert("inside add user");
        if (!this.rooms.has(spaceId)) this.rooms.set(spaceId, new Set());
        this.rooms.get(spaceId)!.add(user);
    }
    
    removeUser(user: User, spaceId: string) {
        // alert("inside remove user");
        // alert(this.rooms);
        const set = this.rooms.get(spaceId);
        if (!set) return;
        set.delete(user);
        if (set.size === 0) this.rooms.delete(spaceId);
    }

    listUsers(spaceId: string) {

        return Array.from(this.rooms.get(spaceId) ?? []);
    }

    broadcast(message: OutgoingMessage, exclude: User | null, spaceId: string) {
        const set = this.rooms.get(spaceId);
        // alert(set);
        console.log("this is set :")
        console.log(typeof set);
        // alert(typeof set);
        if (!set) return;
        for (const u of set) {
        if (exclude && u.id === exclude.id) continue;
        u.send(message);
        }
    }
    }

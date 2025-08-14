export type OutgoingMessage =
    | {
        type: "space-joined";
        payload: { spawn: { x: number; y: number }; users: { userId: string; x: number; y: number }[] };
        }
    | {
        type: "user-joined";
        payload: { userId: string; x: number; y: number };
        }
    | {
        type: "movement";
        payload: { userId: string; x: number; y: number };
        }
    | {
        type: "movement-rejected";
        payload: { x: number; y: number };
        }
    | {
        type: "user-left";
        payload: { userId: string };
        }
    | {
        type: "error";
        payload: { message: string };
        };

import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { GameScene } from "./GameScene";

const Game: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        if (containerRef.current && !gameRef.current) {
        gameRef.current = new Phaser.Game({
            type: Phaser.AUTO,
            width: 800,
            height: 800,
            parent: containerRef.current,
            scene: [GameScene],
        });
        }

        return () => {
        gameRef.current?.destroy(true);
        gameRef.current = null;
        };
    }, []);

    return <div ref={containerRef} />;
};

export default Game;

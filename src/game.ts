import * as ROT from 'rot-js';

import { Player } from './player';
import { Pedro } from './pedro';
import { Being } from './mixin/being';

export class Game {
    public display: ROT.Display = new ROT.Display();
    public map: Object = {};
    public freeCells = [];
    public player: Player;
    public pedro: Pedro;
    public engine: ROT.Engine;
    public ananas: string;

    constructor() {
        console.log('started');
        document.body.appendChild(this.display.getContainer() as Node);
        this.generateMap();
        this.generateBoxes();
        this.drawWholeMap();

        // for some reason this has to be done after drawing the map
        // this.createPlayer();
        this.player = this.createBeing(Player);
        this.pedro = this.createBeing(Pedro);

        const scheduler = new ROT.Scheduler.Simple();
        scheduler.add(this.player, true);
        scheduler.add(this.pedro, true);
        this.engine = new ROT.Engine(scheduler);
        this.engine.start();

        console.log('ended');
    }

    private generateMap(): void {
        console.log('generateMap');
        const digger = new ROT.Map.Digger(80, 25);

        digger.create((x: number, y: number, value) => {
            if (value) { return; } /* do not store walls */
            const key = `${x},${y}`;
            this.freeCells.push(key);
            this.map[key] = '.';
        });

    }

    private drawWholeMap(): void {
        console.log('drawWholeMap');
        for (const key in this.map) {
            const [x, y] = (() => {
                const [x, y] = key.split(',');
                return [+x, +y];
            })();
            this.display.draw(x, y, this.map[key], null, null);
        }
    }

    private generateBoxes(): void {
        console.log('generateBoxes');
        for (let i = 0; i < 10; i++) {
            const index = Math.floor(ROT.RNG.getUniform() * this.freeCells.length);
            const key = this.freeCells.splice(index, 1)[0];
            this.map[key] = '*';
            if (!i) { this.ananas = key; } // first box contains the ananas
        }
    }

    // public createPlayer() {
    //     console.log('createPlayer');
    //     const index = Math.floor(ROT.RNG.getUniform() * this.freeCells.length);
    //     const key = this.freeCells.splice(index, 1)[0];
    //     const [x, y] = key.split(',').map((v: string) => +v);
    //     this.player = new Player(this, x, y);
    // }

    public createBeing<T>(b: new (game: Game, x: number, y: number) => T): T {
        console.log('createBeing');
        const index = Math.floor(ROT.RNG.getUniform() * this.freeCells.length);
        const key = this.freeCells.splice(index, 1)[0];
        const [x, y] = key.split(',').map((v: string) => +v);
        return new b(this, x, y);
    }
}
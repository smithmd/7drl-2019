import * as ROT from 'rot-js';

import { Player } from './player';

import { Being } from '../mixin/being';
import { Monster } from './monster';
import { MonsterType, monsterTypes } from '../constants';

export class Game {
    public display: ROT.Display = new ROT.Display();
    public map: Object = {};
    public freeCells = [];
    public player: Player;
    public monsters: Array<Monster> = [];
    public engine: ROT.Engine;
    public dungeonLevel: number;

    constructor() {
        this.dungeonLevel = 1;
        console.log('started');
        document.body.appendChild(this.display.getContainer() as Node);
        this.generateMap();
        this.generateBoxes();
        this.drawWholeMap();

        // for some reason this has to be done after drawing the map
        this.player = this.createBeing(Player, '@', '#ff0');
        const monsterDescriptions = monsterTypes.filter(m => (this.dungeonLevel >= m.minDungeon && this.dungeonLevel <= m.maxDungeon));
        this.monsters = monsterDescriptions.map(m => this.createBeing(Monster, m.character, m.fgColor, m.bgColor));

        const scheduler = new ROT.Scheduler.Simple();
        scheduler.add(this.player, true);
        this.monsters.forEach((m: Monster) => scheduler.add(m, true));
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
        }
    }

    private createBeing<T>(b: new (game: Game, x: number, y: number, char: string, fgColor?: string, bgColor?: string) => T, 
                            char: string, fgColor?: string, bgColor?: string): T {
        console.log('createBeing');
        const index = Math.floor(ROT.RNG.getUniform() * this.freeCells.length);
        const key = this.freeCells.splice(index, 1)[0];
        const [x, y] = key.split(',').map((v: string) => +v);
        return new b(this, x, y, char, fgColor, bgColor);
    }
}
import * as ROT from 'rot-js';

import { Player } from './player';

import { Being } from '../mixin/being';
import { Monster } from './monster';
import { MonsterType, monsterTypes, maxDungeonLevel } from '../constants';
import Simple from 'rot-js/lib/scheduler/simple';
import { UI } from './ui';

export class Game {
    public display: ROT.Display = new ROT.Display();
    public map: Object = {};
    public freeCells = [];
    public player: Player;
    public monsters: Array<Monster> = [];
    public engine: ROT.Engine;
    public dungeonLevel: number;
    public ui: UI;
    private scheduler = new ROT.Scheduler.Simple()

    constructor() {
        this.dungeonLevel = 1;
        console.log('started');
        document.getElementById('gameBody').appendChild(this.display.getContainer() as Node);
        this.ui = new UI();
        this.initializeGame();
        console.log('ended');
    }

    private initializeGame(): void {
        this.generateMap();
        this.generateBoxes();
        this.generateStairs();
        this.drawWholeMap();

        this.addPlayer();
        this.addMonsters();

        this.engine = new ROT.Engine(this.scheduler);
        this.engine.start();
    }

    private clearDungeon(): void {
        console.log('clear dungeon');
        this.freeCells.length = 0;
        // remove monsters
        this.monsters.forEach((m:Monster) => {
            this.scheduler.remove(m);
        });
        this.monsters.length = 0;

        // remove player
        // this.scheduler.remove(this.player);
        // this.player = null;

        // clear map
        this.map = {};
        this.display.clear();
    }

    public descend(): void {
        console.log('descending ')
        this.dungeonLevel += 1;
        this.clearDungeon();
        
        this.generateMap();
        this.generateBoxes();
        if (this.dungeonLevel < maxDungeonLevel) {
            this.generateStairs();
        }
        this.drawWholeMap();

        // this.addPlayer();
        this.addMonsters();
    }

    private addPlayer(): void {
        this.player = this.createBeing(Player, '@', '#ff0', null, 'Player');
        this.scheduler.add(this.player, true);
    }

    private addMonsters(): void {
        const monsterDescriptions = monsterTypes.filter(m => (this.dungeonLevel >= m.minDungeon && this.dungeonLevel <= m.maxDungeon));
        this.monsters = monsterDescriptions.map(m => this.createBeing(Monster, m.character, m.fgColor, m.bgColor, m.name));

        this.monsters.forEach((m: Monster) => this.scheduler.add(m, true));
    }

    private generateMap(): void {
        console.log('generateMap, level ', this.dungeonLevel);
        const digger = new ROT.Map.Rogue(80, 25, null);

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
            const key = this.getEmptyCellKey();
            this.map[key] = '*';
        }
    }

    private generateMacGuffin(): void{
        this.map[this.getEmptyCellKey()] = 'o';
    }

    private generateStairs(): void {
        console.log('generate stairs');
        const key = this.getEmptyCellKey();
        this.map[key] = '>';
    }

    private createBeing<T>(b: new (game: Game, x: number, y: number, char: string, fgColor?: string, bgColor?: string, name?: string) => T, 
                            char: string, fgColor?: string, bgColor?: string, name?: string): T {
        console.log('createBeing');
        const index = Math.floor(ROT.RNG.getUniform() * this.freeCells.length);
        const key = this.freeCells.splice(index, 1)[0];
        const [x, y] = key.split(',').map((v: string) => +v);
        return new b(this, x, y, char, fgColor, bgColor, name);
    }

    public getEmptyCellKey(): string {
        const index = Math.floor(ROT.RNG.getUniform() * this.freeCells.length);
        return this.freeCells.splice(index,1)[0];
    }

    public removeMonster(m: Monster) {
        this.scheduler.remove(m);
        const index = this.monsters.indexOf(m);
        this.display.draw(m.x, m.y, this.map[`${m.x},${m.y}`], null, null);
        this.monsters.splice(index,1);
    }
}
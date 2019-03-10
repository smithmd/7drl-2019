import * as ROT from 'rot-js';

import { Player } from './player';
import { Monster } from './monster';
import { monsterTypes, maxDungeonLevel, items } from '../constants';
import { UI } from './ui';
import { Item } from './item';

export class Game {
    public display: ROT.Display = new ROT.Display();
    public map: Object = {};
    public freeCells = [];
    public player: Player;
    public monsters: Array<Monster> = [];
    public engine: ROT.Engine;
    public dungeonLevel: number;
    public ui: UI;
    private scheduler = new ROT.Scheduler.Simple();
    private itemKeys: Array<string> = [];
    public macGuffinKey: string;

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
        this.drawWholeMap();

        this.generateStairs();

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

        this.itemKeys.length = 0;

        // clear map
        this.map = {};
        this.display.clear();
    }

    public descend(): void {
        console.log('descending');
        this.dungeonLevel += 1;
        this.clearDungeon();
        
        this.generateMap();
        this.generateBoxes();
        this.drawWholeMap();
        if (this.dungeonLevel < maxDungeonLevel) {
            this.generateStairs();
        }

        // this.addPlayer();
        this.addMonsters();

        this.ui.updateGameLog('Descending to level ' + this.dungeonLevel);
    }

    private addPlayer(): void {
        this.player = this.createBeing(Player, '@', '#ff0', null, 'Player');
        this.ui.updatePlayerStats(this.player);
        this.scheduler.add(this.player, true);
    }

    private addMonsters(): void {
        const monsterDescriptions = monsterTypes.filter(m => (this.dungeonLevel >= m.minDungeon && this.dungeonLevel <= m.maxDungeon));
        this.monsters = monsterDescriptions.map(m => {
            const being: Monster = this.createBeing(Monster, m.character, m.fgColor, m.bgColor, m.name);
            being.armor = m.armor;
            being.strength = m.strength;
            being.maxHP = m.hitPoints;
            being.hitPoints = m.hitPoints;
            return being;
        });

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
            const [x, y] = key.split(',').map(v => +v);
            this.display.draw(x, y, this.map[key], null, null);
        }
    }

    private generateBoxes(): void {
        console.log('generateBoxes');
        for (let i = 0; i < 10; i++) {
            const key = this.getEmptyCellKey();
            this.map[key] = '*';
            if (this.dungeonLevel < 4 && items[i]) {
                this.itemKeys.push(key);
            } else if (this.dungeonLevel === 4 && i === 0) {
                this.macGuffinKey = key;
            }
        }
    }

    private generateStairs(): void {
        const stairChar = '>';
        console.log('generate stairs');
        const key = this.getEmptyCellKey();
        this.map[key] = stairChar;
        const [x, y] = key.split(',').map(v => +v);
        this.display.draw(x,y,stairChar, '#f0f',null);
    }

    private createBeing<T>(b: new (game: Game, x: number, y: number, char: string, fgColor?: string, bgColor?: string, name?: string) => T, 
                            char: string, fgColor?: string, bgColor?: string, name?: string): T {
        console.log('createBeing');
        const index = Math.floor(ROT.RNG.getUniform() * this.freeCells.length);
        const key = this.freeCells.splice(index, 1)[0];
        const [x, y] = key.split(',').map((v: string) => +v);
        return new b(this, x, y, char, fgColor, bgColor, name);
    }

    public getItem(key: string): Item | null {
        const index = this.itemKeys.indexOf(key);
        if(index > -1) {
            this.itemKeys[index] = null;
            if (this.itemKeys.reduce((count, item) => {
                return (item ? count + 1 : count);
            }, 0) === 0) {
                this.ui.updateGameLog('You found everything on this floor.');
            }
            return items[index];
        }

        return null;
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

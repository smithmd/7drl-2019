import * as ROT from 'rot-js';
import { Game } from './game';
import { Being } from '../mixin/being';
import { Monster } from './monster';
import { Killable } from '../interfaces/killable';
import { Stats } from '../interfaces/stats';

export class Player extends Being implements Killable, Stats {
    hitPoints: number = 5;
    maxHP: number = 5;
    armor: number = 0;
    strength: number = 1;

    name = 'Player';

    constructor(protected game: Game, protected _x: number, protected _y: number) {
        super(game, _x, _y, '@', '#ff0');
    }

    act(): void {
        this.game.engine.lock();
        /* Wait for user input; do stuff when a user hits a key */
        window.addEventListener('keydown', this);
    }

    handleEvent(e: KeyboardEvent) {
        const keyMap = {};
        keyMap[ROT.KEYS.VK_W] = 0;
        keyMap[ROT.KEYS.VK_E] = 1;
        keyMap[ROT.KEYS.VK_D] = 2;
        keyMap[ROT.KEYS.VK_C] = 3;
        keyMap[ROT.KEYS.VK_X] = 4;
        keyMap[ROT.KEYS.VK_Z] = 5;
        keyMap[ROT.KEYS.VK_A] = 6;
        keyMap[ROT.KEYS.VK_Q] = 7;

        const code = e.keyCode;

        if (code === ROT.KEYS.VK_RETURN || code === ROT.KEYS.VK_SPACE) {
            this.checkBox();
        }

        if (code === ROT.KEYS.VK_GREATER_THAN || code === ROT.KEYS.VK_PERIOD) {
            this.checkForStairs();
        }

        if (code === ROT.KEYS.VK_S) {
            window.removeEventListener('keydown', this);
            this.game.engine.unlock();
        }

        if (!(code in keyMap)) { return; }

        const diff = ROT.DIRS[8][keyMap[code]];
        const newX = this.x + diff[0];
        const newY = this.y + diff[1];

        const canEnter = this.canEnter(newX, newY);

        if (canEnter === true) {
            // set the character in this space to what it used to be before the move
            const fgColor = this.game.map[`${this.x},${this.y}`] === '>' ? '#f0f' : null;
            this.game.display.draw(this.x, this.y, this.game.map[`${this.x},${this.y}`], fgColor, null);

            this._x = newX;
            this._y = newY;
            this.draw();
            window.removeEventListener('keydown', this);
            this.game.engine.unlock();
        } else if(canEnter instanceof Monster) {
            // monster in that square
            canEnter.takeHit(this);
            window.removeEventListener('keydown', this);
            this.game.engine.unlock();
        } else {
            this.game.ui.updateGameLog('You bumped into the wall.');
        }
    }

    checkForStairs(): void {
        const player_location = `${this.x},${this.y}`;
        if (this.game.map[player_location] === '>') {
            this.game.descend();
            window.removeEventListener('keydown', this);
            const key = this.game.getEmptyCellKey();
            const [newX, newY] = key.split(',').map((v: string) => +v);
            this._x = newX;
            this._y = newY;
            this.draw();
            this.game.engine.unlock();
        } else {
            this.game.ui.updateGameLog('There are no stairs here.');
        }
    }

    checkBox(): void {
        const key = `${this.x},${this.y}`;
        if (this.game.map[key] === '.') {
            this.game.ui.updateGameLog("You're looking at the empty ground. It's just ground.");
        } else if (this.game.map[key] === '>') {
            this.game.ui.updateGameLog('There are stairs here descending into the darkness.');
        } else if (this.game.map[key] === 'o') {
            this.game.ui.updateGameLog('There is an empty chest here. You\'ve already searched this one.');
        } else if (this.game.map[key] === '*') {
            const item = this.game.getItem(key);
            if (item) {
                let logText = 'You found ' + item.name + '!';

                logText += (item.healthIncrease > 0 ? ' Health +1' : '');
                this.maxHP += item.healthIncrease;
                if (item.name !== 'Gem of Power') {
                    const hp = this.hitPoints + (item.healthIncrease * 3);
                    this.hitPoints = hp > this.maxHP ? this.maxHP : hp;
                } else {
                    const hp = this.hitPoints + item.healthIncrease;
                    this.hitPoints = hp > this.maxHP ? this.maxHP : hp;
                }

                logText += (item.armorIncrease > 0 ? ' Armor +1' : '');
                this.armor += item.armorIncrease;
                
                logText += (item.strengthIncrease > 0 ? ' Strength +1' : '');
                this.strength += item.strengthIncrease;

                this.game.ui.updateGameLog(logText);
                this.game.ui.updatePlayerStats(this);
            } else if (this.game.dungeonLevel === 4 && key === this.game.macGuffinKey) {
                this.game.ui.updateGameLog('You found the disgusting ring! Congratulations! You win the game!');
                this.game.ui.updateCompletion(true);
                window.removeEventListener('keydown', this);
                this.game.engine.lock();
            } else {
                this.game.ui.updateGameLog('This chest is empty.');
            }
            this.game.map[key] = 'o';
        }
    }

    public die(): void {
        this.game.ui.updateGameLog('You died.\nGAME OVER');
        this.game.ui.updateCompletion(false);
        window.removeEventListener('keydown', this);
        this.game.engine.lock();
    }

    public takeHit(attacker: Monster | Player): void {
        const dmg = (attacker.strength - this.armor > 0 ? attacker.strength - this.armor : 0);  // prevent accidental healing
        this.hitPoints -= dmg;
        this.game.ui.updatePlayerStats(this);
        this.game.ui.updateGameLog('You were hit by ' + attacker.name + ' for ' + dmg + ' damage.');
        if (this.hitPoints <= 0) {
            this.die();
        }
    }
}

import * as ROT from 'rot-js';
import { Game } from './game';
import { Being } from '../mixin/being';
import { Monster } from './monster';

export class Player extends Being {

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

        if (!(code in keyMap)) { return; }

        const diff = ROT.DIRS[8][keyMap[code]];
        const newX = this.x + diff[0];
        const newY = this.y + diff[1];

        const canEnter = this.canEnter(newX, newY);

        if (canEnter === true) {
            // set the character in this space to what it used to be before the move
            this.game.display.draw(this.x, this.y, this.game.map[`${this.x},${this.y}`], null, null);

            this._x = newX;
            this._y = newY;
            this.draw();
        } else if(canEnter instanceof Monster) {
            // monster in that square
            console.log('collided with a ' + canEnter.character);
        }
        window.removeEventListener('keydown', this);
        this.game.engine.unlock();
    }

    checkBox(): void {
        const key = `${this.x},${this.y}`;
        if (this.game.map[key] !== '*') {
            console.log("You're looking at the empty ground. It's just ground.");
        } else {
            console.log("This box is empty.");
        }
    }

    private canEnter(x: number, y: number): Boolean | Monster {
        const newKey = `${x},${y}`;
        if (!(newKey in this.game.map)) {
            return false; 
        }

        const m: Monster = this.game.monsters.find(monster => monster.x === x && monster.y === y);
        if (m) {
            return m;
        }

        return true;
    }
}
import * as ROT from 'rot-js';
import { Game } from './game';
import { Being } from '../mixin/being';
import { Player } from './player';
import { Killable } from '../interfaces/killable';
import { Stats } from '../interfaces/stats';

export class Monster extends Being implements Killable, Stats {
    hitPoints: number;
    maxHP: number;
    armor: number;
    strength: number;

    constructor(protected game: Game, protected _x: number, protected _y: number, protected _char: string,
                protected _fgColor?: string, protected _bgColor?: string, public name?: string) {
        super(game, _x, _y, _char, _fgColor, _bgColor);
    }

    act() {
        const [p_x, p_y] = [this.game.player.x, this.game.player.y];
        const astar = new ROT.Path.AStar(p_x, p_y, 
                                        (x,y) => `${x},${y}` in this.game.map,
                                        {topology: 8});

        const path = [];
        astar.compute(this._x, 
                      this._y, 
                      (x,y) => path.push([x,y]));

        path.shift(); // remove monsters's position
        const [x,y] = [path[0][0], path[0][1]];
        const being = this.canEnter(x, y);
        if (being instanceof Player) {
            // do something because the monster just hit the player
            console.log('collision with player');
            being.takeHit(this);
        } else if (being instanceof Monster) {
            console.log(this.name + ' collided with ' + being.name);
        } else {
            this.game.display.draw(this._x, this._y, this.game.map[`${this._x},${this._y}`], null, null);
            [this._x, this._y] = [x, y];
            this.draw();
        }
    }

    public die(): void {
        this.game.ui.updateGameLog(this.name + ' died.');
        this.game.removeMonster(this);
    }

    public takeHit(attacker: Player | Monster): void {
        const dmg = attacker.strength - this.armor;
        this.hitPoints -= (dmg >= 0 ? dmg : 0);
        this.game.ui.updateGameLog(attacker.name + ' hit ' + this.name + ' for ' + dmg + ' damage.');
        if (this.hitPoints <= 0) {
            this.die();
        }
    }
}
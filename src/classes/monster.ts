import * as ROT from 'rot-js';
import { Game } from './game';
import { Being } from '../mixin/being';
import { Player } from './player';
import { Killable } from '../interfaces/killable';

export class Monster extends Being implements Killable {
    constructor(protected game: Game, protected _x: number, protected _y: number, protected _char: string,
                protected _fgColor?: string, protected _bgColor?: string, public name?: string) {
        super(game, _x, _y, _char, _fgColor, _bgColor);
    }

    act() {
        const [p_x, p_y] = [this.game.player.x, this.game.player.y];
        const astar = new ROT.Path.AStar(p_x, p_y, 
                                        (x,y) => `${x},${y}` in this.game.map,
                                        {topology: 4});
        
        const path = [];
        astar.compute(this._x, 
                      this._y, 
                      (x,y) => path.push([x,y]));

        path.shift(); // remove monsters's position
        // console.log(this._char + ': ' + path.length);
        const [x,y] = [path[0][0], path[0][1]];
        const being = this.canEnter(x, y);
        if (being instanceof Player) {
            // do something because the monster just hit the player
            console.log('collision with player');
            being.takeHit(this.name);
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

    public takeHit(attackerName: string): void {
        this.game.ui.updateGameLog(attackerName + ' hit ' + this.name);
        this.die();
    }
}
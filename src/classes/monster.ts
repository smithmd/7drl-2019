import * as ROT from 'rot-js';
import { Game } from './game';
import { Being } from '../mixin/being';

export class Monster extends Being {
    constructor(protected game: Game, protected _x: number, protected _y: number, protected _char: string, protected _fgColor?: string, protected _bgColor?: string, protected name?: string) {
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
        if (path.length <= 1) {
            // do something because the monster just hit the player
            console.log('collision with player');
        
        } else {
            const [x,y] = [path[0][0], path[0][1]];
            this.game.display.draw(this._x, this._y, this.game.map[`${this._x},${this._y}`], null, null);
            [this._x, this._y] = [x, y];
            this.draw();
        }
    }
}
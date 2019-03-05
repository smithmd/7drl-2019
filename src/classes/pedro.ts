import * as ROT from 'rot-js';
import { Game } from './game';
import { Being } from './mixin/being';

export class Pedro extends Being {
    constructor(protected game: Game, protected _x: number, protected _y: number) {
        super(game, _x, _y, 'P', '#f00');
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

        path.shift(); // remove pedro's position
        if (path.length === 1) {
            this.game.engine.lock();
            alert("Game Over - You were captured by Pedro!");
        } else {
            const [x,y] = [path[0][0], path[0][1]];
            this.game.display.draw(this._x, this._y, this.game.map[`${this._x},${this._y}`], null, null);
            [this._x, this._y] = [x, y];
            this.draw();
        }
    }
}
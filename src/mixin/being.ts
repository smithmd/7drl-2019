import { Game } from "../classes/game";
import { Monster } from "../classes/monster";
import { Player } from "../classes/player";

export class Being {
    constructor(protected game: Game, protected _x: number, protected _y: number, protected _character: string,
                private fgColor?: string, private bgColor?: string) {
        this.draw();
    }

    public get character(): string {
        return this._character;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    draw(): void {
        this.game.display.draw(this._x, this._y, this.character, this.fgColor || null, this.bgColor || null);
    }

    protected canEnter(x: number, y: number): Boolean | Monster | Player {
        const newKey = `${x},${y}`;
        if (!(newKey in this.game.map)) {
            return false; 
        }

        const m: Monster = this.game.monsters.find(monster => monster.x === x && monster.y === y);
        if (m) {
            return m;
        }

        if (this.game.player.x === x && this.game.player.y === y) {
            return this.game.player;
        }

        return true;
    }
}
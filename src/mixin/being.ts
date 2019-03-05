import { Game } from "../game";

export class Being {
    constructor(protected game: Game, protected _x: number, protected _y: number, private character: string, private color: string) {
        this.draw();
    }

    draw(): void {
        this.game.display.draw(this._x, this._y, this.character, this.color, null);
    }
}
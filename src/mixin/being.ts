import { Game } from "../classes/game";

export class Being {
    constructor(protected game: Game, protected _x: number, protected _y: number, private character: string,
                private fgColor?: string, private bgColor?: string) {
        this.draw();
    }

    draw(): void {
        this.game.display.draw(this._x, this._y, this.character, this.fgColor || null, this.bgColor || null);
    }
}
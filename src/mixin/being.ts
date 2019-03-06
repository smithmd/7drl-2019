import { Game } from "../classes/game";

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
}
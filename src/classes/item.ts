export class Item {
    strengthIncrease: number;
    armorIncrease: number;
    healthIncrease: number;
    public containerKey: string;

    constructor(s: number, a: number, h: number) {
        this.strengthIncrease = s;
        this.armorIncrease = a;
        this.healthIncrease = h;
    }
}
export class Item {
    strengthIncrease: number;
    armorIncrease: number;
    healthIncrease: number;
    name: string;
    public containerKey: string;

    constructor(s: number, a: number, h: number, n: string) {
        this.strengthIncrease = s;
        this.armorIncrease = a;
        this.healthIncrease = h;
        this.name = n;
    }
}
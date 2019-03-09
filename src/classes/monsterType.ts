export class MonsterType {
    minDungeon: number;
    maxDungeon: number;
    name: string;
    character: string;
    fgColor?: string;
    bgColor?: string;
    strength: number;
    hitPoints: number;
    maxHP: number;
    armor: number;

    constructor(min: number, max: number, name: string, character: string, hp: number, strength: number, armor: number, fg?: string, bg?: string) {
        this.minDungeon = min;
        this.maxDungeon = max;
        this.name = name;
        this.character = character;
        this.fgColor = fg;
        this.bgColor = bg;
        this.armor = armor;
        this.hitPoints = hp;
        this.maxHP = hp;
        this.strength = strength;
    }
}

export class MonsterType {
    minDungeon: number;
    maxDungeon: number;
    name: string;
    character: string;
    fgColor?: string;
    bgColor?: string;

    constructor(min: number, max: number, name: string, character: string, fg?: string, bg?: string) {
        this.minDungeon = min;
        this.maxDungeon = max;
        this.name = name;
        this.character = character;
        this.fgColor = fg;
        this.bgColor = bg;
    }
}

export const monsterTypes = [
    new MonsterType(1,1,'Bat','~','#f00',null),
    new MonsterType(2,3,'Minotaur','M','#f00',null),
    new MonsterType(2,3,'Wizard','W','#f00',null),
    new MonsterType(1,1,'Snake','s','#f00',null),
    new MonsterType(1,2,'Rat','r','#f00',null),
    new MonsterType(2,3,'Wyvern','y','#f00',null),
];

export const maxDungeonLevel: number = 4;
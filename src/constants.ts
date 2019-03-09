import { MonsterType } from "./classes/monsterType";

export const monsterTypes = [
    new MonsterType(1,1,'Bat','~',1,1,0,'#f00'),
    new MonsterType(1,1,'Bat','~',1,1,0,'#f00'),
    new MonsterType(2,3,'Manbat','B',2,2,0,'#f00'),
    new MonsterType(2,3,'Minotaur','m',3,3,1,'#f00'),
    new MonsterType(3,4,'Super Minotaur','M',4,2,2,'#f00'),
    new MonsterType(2,3,'Wizard','W',2,2,0,'#f00'),
    new MonsterType(1,1,'Snake','s',1,1,0,'#f00'),
    new MonsterType(1,2,'Rat','r',1,1,0,'#f00'),
    new MonsterType(2,4,'Wyvern','y',2,1,1,'#f00'),
    new MonsterType(2,4,'Wyvern','y',2,1,1,'#f00'),
];

export const maxDungeonLevel: number = 4;
import { MonsterType } from "./classes/monsterType";
import { Item } from "./classes/item";

export const monsterTypes = [
    new MonsterType(1,1,'Bat','~',1,2,0,'#f00'),
    new MonsterType(1,1,'Bat','~',1,1,0,'#f00'),
    new MonsterType(1,1,'Bat','~',1,1,0,'#f00'),
    new MonsterType(1,1,'Bat','~',1,1,0,'#f00'),
    new MonsterType(2,3,'Manbat','B',3,2,0,'#f00'),
    new MonsterType(2,3,'Manbat','B',3,2,0,'#f00'),
    new MonsterType(2,2,'Minotaur','m',4,2,1,'#f00'),
    new MonsterType(3,3,'Minotaur','m',4,3,2,'#f00'),
    new MonsterType(4,4,'Super Minotaur','M',9,6,2,'#0ff'),
    new MonsterType(2,3,'Wizard','W',2,2,0,'#f00'),
    new MonsterType(3,4,'Wizard','W',3,3,1,'#f00'),
    new MonsterType(1,1,'Snake','s',1,1,0,'#f00'),
    new MonsterType(1,2,'Rat','r',1,2,0,'#f00'),
    new MonsterType(1,2,'Rat','r',1,2,0,'#f00'),
    new MonsterType(2,3,'Wyvern','Y',2,2,1,'#f00'),
    new MonsterType(2,3,'Wyvern','Y',2,2,1,'#f00'),
    new MonsterType(3,4,'Steel Wyvern','Y',4,4,2,'#0ff'),
];

export const items = [
    new Item(1,0,0, 'Orb of Strength'),
    new Item(0,1,0, 'Shard of Armor'),
    new Item(0,0,1, 'Amulet of Health'),
    new Item(1,1,1, 'Gem of Power'),
];

export const maxDungeonLevel: number = 4;

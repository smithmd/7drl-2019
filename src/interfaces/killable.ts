import { Player } from "../classes/player";
import { Monster } from "../classes/monster";

export interface Killable {
    takeHit(attacker: Player | Monster): void;
    die(): void;
}
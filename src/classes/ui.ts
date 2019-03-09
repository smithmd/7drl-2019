import { Player } from "./player";

export class UI {
    updateGameLog(logText: string): void {
        document.getElementById('gameLog').append(logText+'\n');
    }
    updatePlayerStats(player: Player) {
        document.getElementById('playerHP').innerText = player.hitPoints + '';
        document.getElementById('playerMaxHP').innerText = player.maxHP + '';
        document.getElementById('playerStrength').innerText = player.strength + '';
        document.getElementById('playerArmor').innerText = player.armor + '';
    }
}
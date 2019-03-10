import { Player } from "./player";

export class UI {
    updateGameLog(logText: string): void {
        const log: HTMLDivElement = <HTMLDivElement>document.getElementById('gameLog');
        log.innerHTML = new Date().toTimeString().split(' ')[0] + ' ' + logText + '<br />' + log.innerHTML;
    }

    updatePlayerStats(player: Player) {
        document.getElementById('playerHP').innerText = player.hitPoints + '';
        document.getElementById('playerMaxHP').innerText = player.maxHP + '';
        document.getElementById('playerStrength').innerText = player.strength + '';
        document.getElementById('playerArmor').innerText = player.armor + '';
    }
}
import { Player } from "./player";

export class UI {
    updateGameLog(logText: string): void {
        const log: HTMLDivElement = <HTMLDivElement>document.getElementById('gameLog');
        log.innerHTML = new Date().toTimeString().split(' ')[0] + ' ' + logText + '\n' + log.innerHTML;
        log.scrollTop = 0;
    }

    updatePlayerStats(player: Player) {
        document.getElementById('playerHP').innerText = player.hitPoints + '';
        document.getElementById('playerMaxHP').innerText = player.maxHP + '';
        document.getElementById('playerStrength').innerText = player.strength + '';
        document.getElementById('playerArmor').innerText = player.armor + '';
    }

    updateCompletion(win:boolean) {
        const completion = document.getElementById('gameCompletionStatus');
        if (win) {
            completion.innerText = 'Congratulations! You Win!';
        } else {
            completion.innerText = 'You Died.';
        }
    }
}
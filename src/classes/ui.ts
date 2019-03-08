export class UI {
    updateGameLog(logText: string): void {
        document.getElementById('gameLog').append(logText+'\n');
    }
}
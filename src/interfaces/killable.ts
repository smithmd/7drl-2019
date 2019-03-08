export interface Killable {
    takeHit(attacker: string): void;
    die(): void;
}
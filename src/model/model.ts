import { Grid } from './grid/grid';
import type { Observer } from '../view/observer';
import type { Subject } from './subject';
import { GridSupplier } from './grid/gridsupplier';
import { Segment } from './segment';

export class Model implements Subject {

    private _grid: Grid;

    private _solutionTrail: Segment[] = [];
    private readonly _observers: Observer[] = [];

    changeGridType(gridType: string): void {
        this._grid = GridSupplier.getGrid(gridType);
        this._solutionTrail = [];
        this.notifyObservers();
    }

    get grid(): Grid {
        return this._grid;
    }

    get solutionTrail(): Segment[] {
        return this._solutionTrail;
    }

    public attachObserver(observer: Observer): void {
        this._observers.push(observer);
    }

    public detachObserver(observer: Observer): void {
        const observerIndex: number = this._observers.indexOf(observer);
        if (observerIndex > -1) {
            this._observers.splice(observerIndex, 1);
        }
    }

    public notifyObservers(): void {
        for (const observer of this._observers) {
            observer.update();
        }
    }

    public generateLabyrinth(): void {
        if (!this._grid) {
            return;
        }
        this._solutionTrail = this._grid.generateMaze();
        this.notifyObservers();
    }

    public reduceSomeComplexity(): void {
        if (!this._grid) {
            return;
        }
        this._grid.disconnectCellsWithOnlyOneConnection();
        this.notifyObservers();
    }

}
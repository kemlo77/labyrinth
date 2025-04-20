import { Cell } from './cell/cell';

export class Grid {

    private _cells: Cell[];
    private _startCell: Cell;
    private _endCell: Cell;

    constructor(interconnectedCells: Cell[], startCell: Cell, endCell: Cell) {
        this._cells = interconnectedCells;
        this._startCell = startCell;
        this._endCell = endCell;
    }

    static fromSingleCell(cell: Cell): Grid {
        return new Grid([cell], cell, cell);
    }

    get startCell(): Cell {
        return this._startCell;
    }

    get endCell(): Cell {
        return this._endCell;
    }

    get allCells(): Cell[] {
        return [...this._cells];
    }

    private get allCellsWithRoomForMoreNeighbours(): Cell[] {
        return this.allCells.filter(cell => cell.hasRoomForMoreNeighbours);
    }

    get allDisconnectedCells(): Cell[] {
        return this.allCells.filter(cell => cell.connectedNeighbours.length == 0);
    }

    get totalNumberOfCells(): number {
        return this.allCells.length;
    }

    get numberOfVisitedCells(): number {
        return this.allCells.filter(cell => cell.visited).length;
    }

    public resetGrid(): void {
        this.resetVisitedStatusOnCells();
        this.removeEstablishedConnectionsInCells();
    }

    private resetVisitedStatusOnCells(): void {
        this.allCells.forEach(cell => cell.visited = false);
    }

    private removeEstablishedConnectionsInCells(): void {
        this.allCells.forEach(cell => cell.removeEstablishedConnections());
    }

    public disconnectCellsWithOnlyOneConnection(): void {
        this.allCells
            .filter(cell => cell.connectedNeighbours.length == 1)
            .filter(cell => cell != this.startCell)
            .filter(cell => cell != this.endCell)
            .forEach(cell => {
                cell.removeConnectionsToCell();
            });
    }

    public establishNeighbourRelationsWith(grid: Grid): void {
        for (const cell of this.allCellsWithRoomForMoreNeighbours) {
            for (const otherCell of grid.allCellsWithRoomForMoreNeighbours) {
                if (!otherCell.hasRoomForMoreNeighbours) {
                    continue;
                }

                if (!cell.hasRoomForMoreNeighbours) {
                    break;
                }

                if (cell.hasCommonBorderWith(otherCell)) {
                    cell.establishNeighbourRelationTo(otherCell);
                }
            }
        }
    }

    public mergeWith(grid: Grid): Grid {
        this.establishNeighbourRelationsWith(grid);
        return new Grid(
            [
                ...this.allCells,
                ...grid.allCells
            ], this.startCell, grid.endCell);
    }

}
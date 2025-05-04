import { MazeGenerationAlgorithm } from '../algorithm/algorithm';
import { RecursiveBacktrackerAlgorithm } from '../algorithm/recursivebacktracker';
import { Coordinate } from '../coordinate';
import { Segment } from '../segment';
import { Cell } from './cell/cell';

export class Grid {

    private _cells: Cell[];
    private _startCell: Cell;
    private _endCell: Cell;
    private _center: Coordinate;
    private _algorithm: MazeGenerationAlgorithm = new RecursiveBacktrackerAlgorithm();

    constructor(interconnectedCells: Cell[], startCell: Cell, endCell: Cell, center?: Coordinate) {
        this._cells = interconnectedCells;
        this._startCell = startCell;
        this._endCell = endCell;
        this._center = center;
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

    get topRightCell(): Cell {
        if (this._cells.length === 0) {
            throw new Error('No cells in grid');
        }
        // Find the cell with the largest x, and in case of tie, largest y
        return this._cells.reduce((topRight, cell) => {
            if (cell.center.x > topRight.center.x || cell.center.y > topRight.center.y) {
                return cell;
            }
            return topRight;
        }, this._cells[0]);
    }

    private get allCellsWithRoomForMoreNeighbours(): Cell[] {
        return this.allCells.filter(cell => cell.hasRoomForMoreNeighbours);
    }

    get allUnconnectedCells(): Cell[] {
        return this.allCells.filter(cell => cell.hasNoOpenBorders);
    }

    get totalNumberOfCells(): number {
        return this.allCells.length;
    }

    get numberOfVisitedCells(): number {
        return this.allCells.filter(cell => cell.visited).length;
    }

    set center(center: Coordinate) {
        this._center = center;
    }

    get center(): Coordinate {
        if (this._center) {
            return this._center;
        } else {
            throw new Error('Center is not set');
        }
    }

    public resetGrid(): void {
        this.resetVisitedStatusOnCells();
        this.closeEstablishedConnectionsInCells();
    }

    private resetVisitedStatusOnCells(): void {
        this.allCells.forEach(cell => cell.visited = false);
    }

    private closeEstablishedConnectionsInCells(): void {
        this.allCells.forEach(cell => cell.closeEstablishedConnections());
    }

    public disconnectCellsWithOnlyOneConnection(): void {
        this.allCells
            .filter(cell => cell.connectedNeighbours.length == 1)
            .filter(cell => cell != this.startCell)
            .filter(cell => cell != this.endCell)
            .forEach(cell => {
                cell.closeEstablishedConnections();
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

    public generateMaze(): Segment[] {
        this.resetGrid();
        this.startCell.visited = true;
        return this._algorithm.generateMaze(this);
    }

}
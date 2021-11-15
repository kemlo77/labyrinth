import {Cell} from "./cell";

export class Model {

    private _grid: Cell[][];

    constructor(width: number, height: number) {
        this._grid = this.createGrid(width, height);
        this.interconnectGrid(this._grid);
    }

    get grid() {
        return this._grid;
    }

    private interconnectGrid(grid: Cell[][]): void {9
        //add a neighbours to the east
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length - 1; j++) {
                grid[i][j].addNeighbour(grid[j][j + 1]);
            }
        }

        //add a neighbours to the west
        for (let i = 0; i < grid.length; i++) {
            for (let j = 1; j < grid[i].length; j++) {
                grid[i][j].addNeighbour(grid[i][j - 1]);
            }
        }

        //add neightbours to the north
        for (let i = 1; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                grid[i][j].addNeighbour(grid[i - 1][j]);
            }
        }

        //add neightbours to the south
        for (let i = 0; i < grid.length - 1; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                grid[i][j].addNeighbour(grid[i + 1][j]);
            }
        }
    }

    private createGrid(x: number, y: number): Cell[][] {
        const grid: Cell[][] = [];
        for (let i = 0; i < x; i++) {
            const row: Cell[] = [];
            for (let j = 0; j < y; j++) {
                row.push(new Cell(i, j));
            }
            grid.push(row);
        }
        return grid;
    }

}
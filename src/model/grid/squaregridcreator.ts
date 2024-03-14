import { Coordinate } from '../coordinate';
import { Cell } from './cell/cell';
import { Grid } from './grid';
import { SquareCell } from './cell/squarecell';

export class SquareGridCreator {

    private constructor() {
        //
    }

    static createGrid(numberOfColumns: number, numberOfRows: number, cellWidth: number): Grid {
        const cellGrid: Cell[][] = SquareGridCreator.createCellGrid(numberOfColumns, numberOfRows, cellWidth);
        SquareGridCreator.interconnectCellsInGrid(cellGrid);
        const startCell: Cell = cellGrid[0][0];
        const endCell: Cell = cellGrid[numberOfColumns - 1][numberOfRows - 1];
        return new Grid(cellGrid, startCell, endCell);
    }

    private static createCellGrid(numberOfColumns: number, numberOfRows: number, cellWidth: number): Cell[][] {
        const cellGrid: Cell[][] = [];
        for (let columnIndex: number = 0; columnIndex < numberOfColumns; columnIndex++) {
            const rowOfCells: Cell[] = [];
            for (let rowIndex: number = 0; rowIndex < numberOfRows; rowIndex++) {
                const xCoordinate: number = cellWidth * (columnIndex + 1);
                const yCoordinate: number = cellWidth * (rowIndex + 1);
                const center: Coordinate = new Coordinate(xCoordinate, yCoordinate);
                rowOfCells.push(new SquareCell(center, cellWidth));
            }
            cellGrid.push(rowOfCells);
        }
        return cellGrid;
    }

    private static interconnectCellsInGrid(grid: Cell[][]): void {
        SquareGridCreator.connectNeighboursBelow(grid);
        SquareGridCreator.connectNeighboursAbove(grid);
        SquareGridCreator.connectNeighboursToTheLeft(grid);
        SquareGridCreator.connectNeighboursToTheRight(grid);
    }

    private static connectNeighboursBelow(grid: Cell[][]): void {
        for (let columnIndex: number = 0; columnIndex < grid.length; columnIndex++) {
            for (let rowIndex: number = 0; rowIndex < grid[columnIndex].length - 1; rowIndex++) {
                grid[columnIndex][rowIndex].addNeighbour(grid[columnIndex][rowIndex + 1]);
            }
        }
    }

    private static connectNeighboursAbove(grid: Cell[][]): void {
        for (let columnIndex: number = 0; columnIndex < grid.length; columnIndex++) {
            for (let rowIndex: number = 1; rowIndex < grid[columnIndex].length; rowIndex++) {
                grid[columnIndex][rowIndex].addNeighbour(grid[columnIndex][rowIndex - 1]);
            }
        }
    }

    private static connectNeighboursToTheLeft(grid: Cell[][]): void {
        for (let columnIndex: number = 1; columnIndex < grid.length; columnIndex++) {
            for (let rowIndex: number = 0; rowIndex < grid[columnIndex].length; rowIndex++) {
                grid[columnIndex][rowIndex].addNeighbour(grid[columnIndex - 1][rowIndex]);
            }
        }
    }

    private static connectNeighboursToTheRight(grid: Cell[][]): void {
        for (let columnIndex: number = 0; columnIndex < grid.length - 1; columnIndex++) {
            for (let rowIndex: number = 0; rowIndex < grid[columnIndex].length; rowIndex++) {
                grid[columnIndex][rowIndex].addNeighbour(grid[columnIndex + 1][rowIndex]);
            }
        }
    }

}
import { Coordinate } from '../../../coordinate';
import { Cell } from '../../../cell/cell';
import { CellFactory } from '../../../cell/cellfactory';
import { Grid } from '../../grid';
import type { CellCreator } from '../../../typealiases';
import { Vector } from '../../../vector/vector';
import type { RectangularGridFactory } from './rectangulargridfactory.interface';
import { RectangularGridProperties } from './rectangulargridproperties';
import { stepLeft, stepRight, stepUp } from '../../../vector/vectorcreator';
import { GridAssembler } from '../gridassemblers/gridassembler';

export class HexagonsGridFactory extends GridAssembler<Cell> implements RectangularGridFactory {

    createGrid(gridProperties: RectangularGridProperties): Grid {
        const cellGrid: Cell[][] = this.createCellMatrix(gridProperties);
        this.establishNeighbourRelationsInGrid(cellGrid);
        const startCell: Cell = cellGrid[0][0];
        const endCell: Cell = cellGrid[cellGrid.length - 1][cellGrid[cellGrid.length - 1].length - 1];
        const cells: Cell[] = cellGrid.flat();
        return new Grid(cells, startCell, endCell);
    }

    private createCellMatrix(gridProperties: RectangularGridProperties): Cell[][] {

        const cellHeight: number = gridProperties.lengthOfEdgeSegments;
        const cellSideLength: number = cellHeight / Math.sqrt(3);

        const numberOfRows: number = gridProperties.numberOfVerticalEdgeSegments;
        const numberOfColumns: number = gridProperties.numberOfHorizontalEdgeSegments;
        const angle: number = gridProperties.angle;


        const halfSideLengthRight: Vector = stepRight(cellSideLength / 2).newRotatedVector(angle);
        const sideLengthRight: Vector = stepRight(cellSideLength).newRotatedVector(angle);
        const columnStep: Vector = stepRight((cellSideLength * 1.5)).newRotatedVector(angle);

        const halfSideLengthToLeft: Vector = stepLeft(cellSideLength / 2).newRotatedVector(angle);

        const halfCellHeightUp: Vector = stepUp(cellHeight / 2).newRotatedVector(angle);
        const cellHeightUp: Vector = stepUp(cellHeight).newRotatedVector(angle);
        const rowStep: Vector = cellHeightUp;
        const halfRowStep: Vector = halfCellHeightUp;


        const regularCellCreator: CellCreator =
            CellFactory.getCellCreatorByType('hexagonal-cell', cellSideLength, angle);
        const topHalfCellCreator: CellCreator =
            CellFactory.getCellCreatorByType('bottom-half-hexagonal-cell', cellSideLength, angle);
        const bottomHalfCellCreator: CellCreator =
            CellFactory.getCellCreatorByType('bottom-half-hexagonal-cell', cellSideLength, angle + 180,
                sideLengthRight.thenTake(halfCellHeightUp));
        const leftSideCellCreator: CellCreator =
            CellFactory.getCellCreatorByType('right-half-hexagonal-cell', cellSideLength, angle);
        const rightSideCellCreator: CellCreator =
            CellFactory.getCellCreatorByType('right-half-hexagonal-cell', cellSideLength, angle + 180,
                cellHeightUp.thenTake(halfSideLengthRight));
        const bottomRightQuarterCellCreator: CellCreator =
            CellFactory.getCellCreatorByType('bottom-right-quarter-hexagonal-cell', cellSideLength, angle + 180,
                halfSideLengthRight.thenTake(halfCellHeightUp));
        const upRightQuarterCellCreator: CellCreator =
            CellFactory.getCellCreatorByType('bottom-left-quarter-hexagonal-cell', cellSideLength, angle);

        const insertionPoint: Coordinate = gridProperties.insertionPoint;

        const cellColumns: Cell[][] = [];
        for (let columnIndex: number = 0; columnIndex < numberOfColumns; columnIndex++) {
            const onOddColumn: boolean = columnIndex % 2 === 1;
            const onEvenColumn: boolean = !onOddColumn;
            const onFirstColumn: boolean = columnIndex === 0;
            const onLastColumn: boolean = columnIndex === numberOfColumns - 1;

            const firstcolumnInsertionPoint: Coordinate = insertionPoint;
            const columnInsertionPoint: Coordinate =
                insertionPoint.stepToNewCoordinate(columnStep.times(columnIndex).thenTake(halfSideLengthToLeft));


            if (onFirstColumn) {
                const columnOfCells: Cell[] =
                    this.createSequenceOfRegions(firstcolumnInsertionPoint, rowStep, numberOfRows, leftSideCellCreator);
                cellColumns.push(columnOfCells);
                continue;
            }

            if (onLastColumn && onEvenColumn) {
                const columnOfCells: Cell[] =
                    this.createSequenceOfRegions(columnInsertionPoint, rowStep, numberOfRows, rightSideCellCreator);
                cellColumns.push(columnOfCells);
                continue;
            }

            if (onLastColumn && onOddColumn) {
                const cellColumnInsertionPoint: Coordinate = columnInsertionPoint.stepToNewCoordinate(halfCellHeightUp);
                const topCellInsertionPoint: Coordinate =
                    cellColumnInsertionPoint.stepToNewCoordinate(rowStep.times(numberOfRows - 1));

                const bottomCell: Cell = bottomRightQuarterCellCreator(columnInsertionPoint);
                const intermediateCellsInColumn: Cell[] =
                    this.createSequenceOfRegions(
                        cellColumnInsertionPoint,
                        rowStep,
                        numberOfRows - 1,
                        rightSideCellCreator
                    );
                const topCell: Cell = upRightQuarterCellCreator(topCellInsertionPoint);

                cellColumns.push([bottomCell, ...intermediateCellsInColumn, topCell]);
                continue;
            }

            if (onEvenColumn) {
                const columnOfCells: Cell[] =
                    this.createSequenceOfRegions(columnInsertionPoint, rowStep, numberOfRows, regularCellCreator);
                cellColumns.push(columnOfCells);
            }

            if (onOddColumn) {
                const cellColumnInsertionPoint: Coordinate = columnInsertionPoint.stepToNewCoordinate(halfRowStep);
                const topCellInsertionPoint: Coordinate =
                    cellColumnInsertionPoint.stepToNewCoordinate(rowStep.times(numberOfRows - 1));

                const bottomCell: Cell = bottomHalfCellCreator(columnInsertionPoint);
                const intermediateCellsInColumn: Cell[] =
                    this.createSequenceOfRegions(
                        cellColumnInsertionPoint,
                        rowStep,
                        numberOfRows - 1,
                        regularCellCreator
                    );
                const topCell: Cell = topHalfCellCreator(topCellInsertionPoint);

                cellColumns.push([bottomCell, ...intermediateCellsInColumn, topCell]);
            }
        }
        return cellColumns;
    }

    private establishNeighbourRelationsInGrid(grid: Cell[][]): void {
        this.establishNeighbourRelationsInRows(grid);
        this.establishNeighbourRelationsInColumns(grid);
        this.establishNeighbourRelationsBetweenTheRest(grid);
    }

    private establishNeighbourRelationsBetweenTheRest(grid: Cell[][]): void {


        for (let columnIndex: number = 0; columnIndex < grid.length; columnIndex++) {
            for (let rowIndex: number = 0; rowIndex < grid[columnIndex].length; rowIndex++) {
                const currentCell: Cell = grid[columnIndex][rowIndex];
                const onEvenColumn: boolean = columnIndex % 2 === 0;
                const onOddColumn: boolean = !onEvenColumn;
                const onLastColumn: boolean = columnIndex === grid.length - 1;
                const notOnFirstRow: boolean = rowIndex > 0;

                if (onLastColumn) {
                    continue;
                }

                if (onEvenColumn) {
                    const neighbourUpRight: Cell = grid[columnIndex + 1][rowIndex + 1];
                    currentCell.establishNeighbourRelationsWith(neighbourUpRight);
                }

                if (onOddColumn && notOnFirstRow) {
                    const neighbourDownRight: Cell = grid[columnIndex + 1][rowIndex - 1];
                    currentCell.establishNeighbourRelationsWith(neighbourDownRight);
                }
            }
        }
    }
}



import { Coordinate } from '../../../coordinate';
import { Cell } from '../../../cell/cell';
import { CellCreatorFactory } from '../../../cell/cellcreatorfactory';
import { Grid } from '../../grid';
import type { CellCreator } from '../../../typealiases';
import { Vector } from '../../../vector/vector';
import type { RectangularGridFactory } from './rectangulargridfactory.interface';
import { RectangularGridProperties } from './rectangulargridproperties';
import { stepLeft, stepRight, stepUp } from '../../../vector/vectorcreator';
import { GridAssembler } from '../../gridassemblers/gridassembler';

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

        const createHexagonalCell: CellCreator = CellCreatorFactory.makeCellCreator('hexagonal-cell');
        const createBottomHalfHexagonalCell: CellCreator = CellCreatorFactory.makeCellCreator('bottom-half-hexagonal-cell');
        const createRightHalfHexagonalCell: CellCreator = CellCreatorFactory.makeCellCreator('right-half-hexagonal-cell');
        const createBottomRightQuarterHexagonalCell: CellCreator = CellCreatorFactory.makeCellCreator('bottom-right-quarter-hexagonal-cell');
        const createBottomLeftQuarterHexagonalCell: CellCreator = CellCreatorFactory.makeCellCreator('bottom-left-quarter-hexagonal-cell');


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
                    this.createSequenceOfRegions(
                        { insertionPoint: firstcolumnInsertionPoint, angle: angle, size: cellSideLength },
                        rowStep,
                        numberOfRows,
                        createRightHalfHexagonalCell
                    );
                cellColumns.push(columnOfCells);
                continue;
            }

            if (onLastColumn && onEvenColumn) {
                const adjustedInsertionPoint: Coordinate =
                    columnInsertionPoint.stepToNewCoordinate(cellHeightUp.thenTake(halfSideLengthRight));
                const columnOfCells: Cell[] =
                    this.createSequenceOfRegions(
                        { insertionPoint: adjustedInsertionPoint, angle: angle + 180, size: cellSideLength },
                        rowStep,
                        numberOfRows,
                        createRightHalfHexagonalCell
                    );
                cellColumns.push(columnOfCells);
                continue;
            }

            if (onLastColumn && onOddColumn) {
                const cellColumnInsertionPoint: Coordinate = columnInsertionPoint.stepToNewCoordinate(halfCellHeightUp);
                const bottomCellInsertionPoint: Coordinate =
                    columnInsertionPoint.stepToNewCoordinate(halfSideLengthRight.thenTake(halfCellHeightUp));
                const intermediateCellColumnInsertionPoint: Coordinate =
                    cellColumnInsertionPoint.stepToNewCoordinate(cellHeightUp.thenTake(halfSideLengthRight));
                const topCellInsertionPoint: Coordinate =
                    cellColumnInsertionPoint.stepToNewCoordinate(rowStep.times(numberOfRows - 1));

                const bottomCell: Cell =
                    createBottomRightQuarterHexagonalCell({ insertionPoint: bottomCellInsertionPoint, angle: angle + 180, size: cellSideLength });
                const intermediateCellsInColumn: Cell[] =
                    this.createSequenceOfRegions(
                        { insertionPoint: intermediateCellColumnInsertionPoint, angle: angle + 180, size: cellSideLength },
                        rowStep,
                        numberOfRows - 1,
                        createRightHalfHexagonalCell
                    );
                const topCell: Cell =
                    createBottomLeftQuarterHexagonalCell({ insertionPoint: topCellInsertionPoint, angle: angle, size: cellSideLength });

                cellColumns.push([bottomCell, ...intermediateCellsInColumn, topCell]);
                continue;
            }

            if (onEvenColumn) {
                const columnOfCells: Cell[] =
                    this.createSequenceOfRegions(
                        { insertionPoint: columnInsertionPoint, angle: angle, size: cellSideLength },
                        rowStep,
                        numberOfRows,
                        createHexagonalCell
                    );
                cellColumns.push(columnOfCells);
            }

            if (onOddColumn) {
                const cellColumnInsertionPoint: Coordinate = columnInsertionPoint.stepToNewCoordinate(halfRowStep);
                const bottomCellInsertionPoint: Coordinate =
                    columnInsertionPoint.stepToNewCoordinate(sideLengthRight.thenTake(halfCellHeightUp));
                const topCellInsertionPoint: Coordinate =
                    cellColumnInsertionPoint.stepToNewCoordinate(rowStep.times(numberOfRows - 1));

                const bottomCell: Cell =
                    createBottomHalfHexagonalCell({
                        insertionPoint: bottomCellInsertionPoint,
                        angle: angle + 180,
                        size: cellSideLength
                    });

                const intermediateCellsInColumn: Cell[] =
                    this.createSequenceOfRegions(
                        { insertionPoint: cellColumnInsertionPoint, angle: angle, size: cellSideLength },
                        rowStep,
                        numberOfRows - 1,
                        createHexagonalCell
                    );
                const topCell: Cell =
                    createBottomHalfHexagonalCell({
                        insertionPoint: topCellInsertionPoint,
                        angle: angle,
                        size: cellSideLength
                    });


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



import { Coordinate } from '../../../coordinate';
import { Cell } from '../../cell/cell';
import { CellFactory } from '../../cell/cellfactory';
import { Grid } from '../../grid';
import { CellCreator } from '../../typealiases';
import { Vector } from '../../../vector/vector';
import { RectangularGridFactory } from './rectangulargridfactory.interface';
import { RectangularGridProperties } from './rectangulargridproperties';
import { GridFactory } from '../gridfactory';
import { stepDown, stepLeft, stepRight, stepUp } from '../../../vector/vectorcreator';

export class HexagonsGridFactory extends GridFactory implements RectangularGridFactory {

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


        const createRegularCell: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint,
                cellSideLength,
                'hexagonal',
                angle
            );
        const createTopHalfCell: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint,
                cellSideLength,
                'bottom-half-hexagonal',
                angle + 0
            );
        const createBottomHalfCell: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint.stepToNewCoordinate(sideLengthRight.then(halfCellHeightUp)),
                cellSideLength,
                'bottom-half-hexagonal',
                angle + 180
            );

        const createLeftSideCell: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint,
                cellSideLength,
                'right-half-hexagonal',
                angle
            );
        const createRightSideCell: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint.stepToNewCoordinate(cellHeightUp.then(halfSideLengthRight)),
                cellSideLength,
                'right-half-hexagonal',
                angle + 180
            );

        const createBottomRightQuarterCell: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint.stepToNewCoordinate(halfSideLengthRight.then(halfCellHeightUp)),
                cellSideLength,
                'bottom-right-quarter-hexagonal',
                angle + 180
            );
        const createUpRightQuarterCell: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint,
                cellSideLength,
                'bottom-left-quarter-hexagonal',
                angle
            );

        const insertionPoint: Coordinate = gridProperties.insertionPoint;

        const cellColumns: Cell[][] = [];
        for (let columnIndex: number = 0; columnIndex < numberOfColumns; columnIndex++) {
            const onOddColumn: boolean = columnIndex % 2 === 1;
            const onEvenColumn: boolean = !onOddColumn;
            const onFirstColumn: boolean = columnIndex === 0;
            const onLastColumn: boolean = columnIndex === numberOfColumns - 1;

            const firstcolumnInsertionPoint: Coordinate = insertionPoint;
            const columnInsertionPoint: Coordinate =
                insertionPoint.stepToNewCoordinate(columnStep.times(columnIndex).then(halfSideLengthToLeft));


            if (onFirstColumn) {
                const columnOfCells: Cell[] =
                    this.createSequenceOfCells(firstcolumnInsertionPoint, rowStep, numberOfRows, createLeftSideCell);
                cellColumns.push(columnOfCells);
                continue;
            }

            if (onLastColumn && onEvenColumn) {
                const columnOfCells: Cell[] =
                    this.createSequenceOfCells(columnInsertionPoint, rowStep, numberOfRows, createRightSideCell);
                cellColumns.push(columnOfCells);
                continue;
            }

            if (onLastColumn && onOddColumn) {
                const cellColumnInsertionPoint: Coordinate = columnInsertionPoint.stepToNewCoordinate(halfCellHeightUp);
                const topCellInsertionPoint: Coordinate =
                    cellColumnInsertionPoint.stepToNewCoordinate(rowStep.times(numberOfRows - 1));

                const bottomCell: Cell = createBottomRightQuarterCell(columnInsertionPoint);
                const intermediateCellsInColumn: Cell[] =
                    this.createSequenceOfCells(
                        cellColumnInsertionPoint,
                        rowStep,
                        numberOfRows - 1,
                        createRightSideCell
                    );
                const topCell: Cell = createUpRightQuarterCell(topCellInsertionPoint);

                cellColumns.push([bottomCell, ...intermediateCellsInColumn, topCell]);
                continue;
            }

            if (onEvenColumn) {
                const columnOfCells: Cell[] =
                    this.createSequenceOfCells(columnInsertionPoint, rowStep, numberOfRows, createRegularCell);
                cellColumns.push(columnOfCells);
            }

            if (onOddColumn) {
                const cellColumnInsertionPoint: Coordinate = columnInsertionPoint.stepToNewCoordinate(halfRowStep);
                const topCellInsertionPoint: Coordinate =
                    cellColumnInsertionPoint.stepToNewCoordinate(rowStep.times(numberOfRows - 1));

                const bottomCell: Cell = createBottomHalfCell(columnInsertionPoint);
                const intermediateCellsInColumn: Cell[] =
                    this.createSequenceOfCells(cellColumnInsertionPoint, rowStep, numberOfRows - 1, createRegularCell);
                const topCell: Cell = createTopHalfCell(topCellInsertionPoint);

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
                    currentCell.establishNeighbourRelationTo(neighbourUpRight);
                }

                if (onOddColumn && notOnFirstRow) {
                    const neighbourDownRight: Cell = grid[columnIndex + 1][rowIndex - 1];
                    currentCell.establishNeighbourRelationTo(neighbourDownRight);
                }
            }
        }
    }
}



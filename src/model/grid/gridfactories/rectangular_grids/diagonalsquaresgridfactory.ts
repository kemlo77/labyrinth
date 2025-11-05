import { Coordinate } from '../../../coordinate';
import { Vector } from '../../../vector/vector';
import { stepDown, stepRight, stepUp, stepUpRight } from '../../../vector/vectorcreator';
import { Cell } from '../../cell/cell';
import { CellFactory } from '../../cell/cellfactory';
import { CellCreator } from '../../typealiases';
import { Grid } from '../../grid';
import { RectangularGridFactory } from './rectangulargridfactory.interface';
import { RectangularGridProperties } from './rectangulargridproperties';
import { GridAssembler } from '../gridassemblers/gridassembler';

export class DiagonalSquaresGridFactory extends GridAssembler<Cell> implements RectangularGridFactory {

    createGrid(gridProperties: RectangularGridProperties): Grid {
        const cellGrid: Cell[][] = this.createTiltedSquareCellGrid(gridProperties);
        this.connectTiltedSquareCellsToNeighbourCells(cellGrid);

        const startCell: Cell = cellGrid[0][0];
        const endCell: Cell = cellGrid[cellGrid.length - 1][cellGrid[cellGrid.length - 1].length - 1];

        const cells: Cell[] = cellGrid.flat();
        return new Grid(cells, startCell, endCell);
    }

    private createTiltedSquareCellGrid(gridProperties: RectangularGridProperties): Cell[][] {

        const cellWidth: number = gridProperties.lengthOfEdgeSegments / Math.SQRT2;
        const diagonalLength: number = gridProperties.lengthOfEdgeSegments;
        const halfDiagonalLength: number = diagonalLength / 2;
        const numberOfColumns: number = gridProperties.numberOfHorizontalEdgeSegments * 2 - 1;
        const numberOfRows: number = gridProperties.numberOfVerticalEdgeSegments;
        const angle: number = gridProperties.angle;

        const createTopRowTriangle: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(insertionPoint, cellWidth, 'isosceles-right-triangular', angle + 45);
        const createLeftColumnTriangle: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(insertionPoint, cellWidth, 'isosceles-right-triangular', angle + 135);
        const createBottomRowTriangle: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(insertionPoint, cellWidth, 'isosceles-right-triangular', angle + 225);
        const createRightColumnTriangle: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(insertionPoint, cellWidth, 'isosceles-right-triangular', angle + 315);
        const createSquareCell: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(insertionPoint, cellWidth, 'square', 45 + angle);

        const stepToLeftInsertionPoint: Vector = stepUpRight(cellWidth).newRotatedVector(angle);
        const stepToRightInsertionPoint: Vector =
            stepRight(diagonalLength * (gridProperties.numberOfHorizontalEdgeSegments - 1))
                .newRotatedVector(angle);
        const columnStep: Vector = stepRight(diagonalLength / 2).newRotatedVector(angle);
        const rowStep: Vector = stepUp(diagonalLength).newRotatedVector(angle);
        const oddColumnExtraStep: Vector = stepDown(halfDiagonalLength).newRotatedVector(angle);

        const bottomLeftInsertionPoint: Coordinate =
            gridProperties.insertionPoint.stepToNewCoordinate(stepToLeftInsertionPoint);
        const bottomRightInsertionPoint: Coordinate =
            bottomLeftInsertionPoint.stepToNewCoordinate(stepToRightInsertionPoint);

        const cellColumns: Cell[][] = [];

        //Left column of triangles
        const firstColumn: Cell[] =
            this.createSequenceOfRegions(bottomLeftInsertionPoint, rowStep, numberOfRows, createLeftColumnTriangle);
        cellColumns.push(firstColumn);

        //Intermediate columns of squares and triangles
        for (let columnIndex: number = 0; columnIndex < numberOfColumns; columnIndex++) {
            const cellColumn: Cell[] = [];

            const evenColumn: boolean = columnIndex % 2 === 0;
            const oddColumn: boolean = columnIndex % 2 === 1;
            const columnInsertionPoint: Coordinate = bottomLeftInsertionPoint
                .stepToNewCoordinate(columnStep.times(columnIndex));

            if (evenColumn) {
                //Bottom triangle
                const bottomTriangleCell: Cell = createBottomRowTriangle(columnInsertionPoint);
                cellColumn.push(bottomTriangleCell);

                //Squares
                const sequenceOfSquareCells: Cell[] =
                    this.createSequenceOfRegions(columnInsertionPoint, rowStep, numberOfRows - 1, createSquareCell);
                cellColumn.push(...sequenceOfSquareCells);

                //Top triangle
                const topTriangleInsertionPoint: Coordinate = columnInsertionPoint
                    .stepToNewCoordinate(rowStep.times(numberOfRows - 1));
                const topTriangleCell: Cell = createTopRowTriangle(topTriangleInsertionPoint);
                cellColumn.push(topTriangleCell);


                cellColumns.push(cellColumn);

            }

            if (oddColumn) {
                //Squares
                const oddColumnInsertionPoint: Coordinate =
                    columnInsertionPoint.stepToNewCoordinate(oddColumnExtraStep);
                const sequenceOfSquareCells: Cell[] =
                    this.createSequenceOfRegions(oddColumnInsertionPoint, rowStep, numberOfRows, createSquareCell);
                cellColumns.push(sequenceOfSquareCells);
            }

        }

        //Right column of triangles
        const rightColumn: Cell[] =
            this.createSequenceOfRegions(bottomRightInsertionPoint, rowStep, numberOfRows, createRightColumnTriangle);
        cellColumns.push(rightColumn);

        return cellColumns;
    }

    private connectTiltedSquareCellsToNeighbourCells(grid: Cell[][]): void {
        for (let columnIndex: number = 0; columnIndex < grid.length; columnIndex++) {
            for (let rowIndex: number = 0; rowIndex < grid[columnIndex].length; rowIndex++) {
                const onFirstColumn: boolean = columnIndex == 0;
                const notOnLastRow: boolean = rowIndex !== grid[columnIndex].length - 1;
                const notOnTheFirstRow: boolean = rowIndex !== 0;
                const onOddColumn: boolean = columnIndex % 2 === 1;
                const onEvenColumn: boolean = columnIndex % 2 === 0;
                const currentCell: Cell = grid[columnIndex][rowIndex];

                if (onFirstColumn) {
                    continue;
                }

                if (onOddColumn && notOnLastRow) {
                    const leftUpperCell: Cell = grid[columnIndex - 1][rowIndex];
                    currentCell.establishNeighbourRelationsWith(leftUpperCell);
                }

                if (onOddColumn && notOnTheFirstRow) {
                    const leftLowerCell: Cell = grid[columnIndex - 1][rowIndex - 1];
                    currentCell.establishNeighbourRelationsWith(leftLowerCell);
                }

                if (onEvenColumn) {
                    const leftUpperCell: Cell = grid[columnIndex - 1][rowIndex + 1];
                    const leftLowerCell: Cell = grid[columnIndex - 1][rowIndex];
                    currentCell.establishNeighbourRelationsWith(leftUpperCell);
                    currentCell.establishNeighbourRelationsWith(leftLowerCell);
                }

            }
        }
    }


}
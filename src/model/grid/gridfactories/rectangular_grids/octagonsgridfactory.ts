import { Coordinate } from '../../../coordinate';
import { Vector } from '../../../vector/vector';
import { Cell } from '../../cell/cell';
import { CellFactory } from '../../cell/cellfactory';
import { CellCreator } from '../../typealiases';
import { Grid } from '../../grid';
import { RectangularGridFactory } from './rectangulargridfactory.interface';
import { GridFactory } from '../gridfactory';
import { RectangularGridProperties } from './rectangulargridproperties';
import { stepDown, stepRight, stepUp } from '../../../vector/vectorcreator';

export class OctagonsGridFactory extends GridFactory implements RectangularGridFactory {

    createGrid(gridProperties: RectangularGridProperties): Grid {
        const cellGrid: Cell[][] = this.createCellGrid(gridProperties);
        this.establishNeighbourRelationsInGrid(cellGrid);
        const startCell: Cell = cellGrid[0][0];
        const endCell: Cell = cellGrid[cellGrid.length - 1][cellGrid[0].length - 1];
        const cells: Cell[] = cellGrid.flat();
        return new Grid(cells, startCell, endCell);
    }

    private createCellGrid(gridProperties: RectangularGridProperties): Cell[][] {
        const numberOfColumns: number = gridProperties.numberOfHorizontalEdgeSegments;
        const numberOfRows: number = gridProperties.numberOfVerticalEdgeSegments;
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;
        const sideLength: number = cellWidth / (1 + Math.SQRT2);
        const angle: number = gridProperties.angle;

        const tiltedSquareCellDiagonalLength: number =
            cellWidth - this.sideLengthOfOctagonFromInradius(cellWidth / 2);
        const tiltedSquareWidth: number = tiltedSquareCellDiagonalLength / Math.SQRT2;

        const columnStep: Vector = stepRight(cellWidth).newRotatedVector(angle);
        const rowStep: Vector = stepUp(cellWidth).newRotatedVector(angle);

        const gridInsertionPoint: Coordinate = gridProperties.insertionPoint;

        const createOctagonalCell: CellCreator =
            (insertionPoint: Coordinate) =>
                CellFactory.createCell(
                    insertionPoint.stepToNewCoordinate(stepRight(cellWidth / 2 - sideLength / 2)),
                    cellWidth,
                    'octagonal',
                    angle
                );

        const createLeftHalfOctagonalCell: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint,
                cellWidth,
                'semi-octagonal-semi-square',
                angle
            );
        const createBottomHalfOctagonalCell: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint.stepToNewCoordinate(columnStep),
                cellWidth,
                'semi-octagonal-semi-square',
                angle + 90
            );
        const createRightHalfOctagonalCell: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint.stepToNewCoordinate(rowStep.then(columnStep)),
                cellWidth,
                'semi-octagonal-semi-square',
                angle + 180
            );
        const createTopHalfOctagonalCell: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint.stepToNewCoordinate(rowStep),
                cellWidth,
                'semi-octagonal-semi-square',
                angle + 270
            );

        const createLowerLeftCornerCell: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint,
                cellWidth,
                'chamfered-square',
                angle + 0
            );
        const createLowerRightCornerCell: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint.stepToNewCoordinate(columnStep),
                cellWidth,
                'chamfered-square',
                angle + 90
            );
        const createUpperLeftCornerCell: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint.stepToNewCoordinate(rowStep),
                cellWidth,
                'chamfered-square',
                angle + 270
            );
        const createUpperRightCornerCell: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint.stepToNewCoordinate(rowStep.then(columnStep)),
                cellWidth,
                'chamfered-square',
                angle + 180
            );

        const createTiltedSquareCell: CellCreator = (center: Coordinate) =>
            CellFactory.createCell(
                center.stepToNewCoordinate(stepDown(tiltedSquareCellDiagonalLength / 2)),
                tiltedSquareWidth,
                'square',
                angle + 45
            );
        const createSquareCell: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint,
                cellWidth,
                'square',
                angle
            );

        if (gridProperties.numberOfVerticalEdgeSegments === 1) {
            const rowOfCells: Cell[] = this.createSequenceOfCells(
                gridInsertionPoint,
                columnStep,
                gridProperties.numberOfHorizontalEdgeSegments,
                createSquareCell
            );
            return [rowOfCells];
        }

        if (gridProperties.numberOfHorizontalEdgeSegments === 1) {
            const columnOfCells: Cell[] = this.createSequenceOfCells(
                gridInsertionPoint,
                rowStep,
                gridProperties.numberOfVerticalEdgeSegments,
                createSquareCell
            );
            return [columnOfCells];
        }


        const cellColumns: Cell[][] = [];

        // first column
        const firstColumn: Cell[] = [];
        const lowerLeftCornerCell: Cell = createLowerLeftCornerCell(gridInsertionPoint);
        firstColumn.push(lowerLeftCornerCell);

        const leftColumnSecondCellInsertionPoint: Coordinate = gridInsertionPoint.stepToNewCoordinate(rowStep);
        const leftColumnOfCells: Cell[] = this.createSequenceOfCells(
            leftColumnSecondCellInsertionPoint,
            rowStep,
            numberOfRows - 2,
            createLeftHalfOctagonalCell
        );
        firstColumn.push(...leftColumnOfCells);

        const upperLeftCornerCellInsertionPoint: Coordinate = gridInsertionPoint
            .stepToNewCoordinate(rowStep.times(numberOfRows - 1));
        const upperLeftCornerCell: Cell = createUpperLeftCornerCell(upperLeftCornerCellInsertionPoint);
        firstColumn.push(upperLeftCornerCell);

        cellColumns.push(firstColumn);


        // intermediate columns
        for (let columnIndex: number = 0; columnIndex < numberOfColumns; columnIndex++) {
            const notOnFirstColumn: boolean = columnIndex !== 0;
            const notOnLastColumn: boolean = columnIndex !== numberOfColumns - 1;

            const firstOctagonalCellInsertionPoint: Coordinate = gridInsertionPoint
                .stepToNewCoordinate(columnStep.times(columnIndex));
            const fistTiltedSquareCellCenter: Coordinate = firstOctagonalCellInsertionPoint
                .stepToNewCoordinate(columnStep.then(rowStep));


            if (notOnFirstColumn && notOnLastColumn) {
                const intermediateColumn: Cell[] = [];
                const bottomCell: Cell = createBottomHalfOctagonalCell(firstOctagonalCellInsertionPoint);
                intermediateColumn.push(bottomCell);

                const intermediateColumnSecondCellInsertionPoint: Coordinate =
                    firstOctagonalCellInsertionPoint.stepToNewCoordinate(rowStep);
                const octagonalCellSequence: Cell[] =
                    this.createSequenceOfCells(
                        intermediateColumnSecondCellInsertionPoint,
                        rowStep,
                        numberOfRows - 2,
                        createOctagonalCell
                    );
                intermediateColumn.push(...octagonalCellSequence);

                const topCellInsertionPoint: Coordinate = firstOctagonalCellInsertionPoint
                    .stepToNewCoordinate(rowStep.times(numberOfRows - 1));
                const topCell: Cell = createTopHalfOctagonalCell(topCellInsertionPoint);
                intermediateColumn.push(topCell);


                cellColumns.push(intermediateColumn);
            }

            if (notOnLastColumn) {
                const tiltedSquareCellSequence: Cell[] =
                    this.createSequenceOfCells(
                        fistTiltedSquareCellCenter,
                        rowStep,
                        numberOfRows - 1,
                        createTiltedSquareCell
                    );
                cellColumns.push(tiltedSquareCellSequence);
            }


        }
        // last column
        const lastColumn: Cell[] = [];
        const lastColumnFirstCellInsertionPoint: Coordinate =
            gridInsertionPoint.stepToNewCoordinate(columnStep.times(numberOfColumns - 1));
        const lowerRightCornerCell: Cell = createLowerRightCornerCell(lastColumnFirstCellInsertionPoint);
        lastColumn.push(lowerRightCornerCell);

        const rightColumnSecondCellInsertionPoint: Coordinate =
            lastColumnFirstCellInsertionPoint.stepToNewCoordinate(rowStep);
        const rightColumnOfCells: Cell[] = this.createSequenceOfCells(
            rightColumnSecondCellInsertionPoint,
            rowStep,
            numberOfRows - 2,
            createRightHalfOctagonalCell
        );
        lastColumn.push(...rightColumnOfCells);

        const upperRightCornerCellInsertionPoint: Coordinate = lastColumnFirstCellInsertionPoint
            .stepToNewCoordinate(rowStep.times(numberOfRows - 1));
        const upperRightCornerCell: Cell = createUpperRightCornerCell(upperRightCornerCellInsertionPoint);
        lastColumn.push(upperRightCornerCell);

        cellColumns.push(lastColumn);

        return cellColumns;
    }

    private sideLengthOfOctagonFromInradius(inradius: number): number {
        return inradius * 2 / (1 + Math.SQRT2);
    }

    private establishNeighbourRelationsInGrid(grid: Cell[][]): void {
        this.establishNeighbourRelationsBetweenOctagons(grid);
        this.establishNeighbourRelationsToFromTiltedSquareCells(grid);

    }

    private establishNeighbourRelationsBetweenOctagons(grid: Cell[][]): void {
        const octagonalCells: Cell[][] = grid.filter((_, index) => index % 2 === 0);
        this.establishNeighbourRelationsInColumns(octagonalCells);
        this.establishNeighbourRelationsInRows(octagonalCells);
    }

    private establishNeighbourRelationsToFromTiltedSquareCells(grid: Cell[][]): void {
        for (let columnIndex: number = 0; columnIndex < grid.length; columnIndex++) {
            for (let rowIndex: number = 0; rowIndex < grid[columnIndex].length; rowIndex++) {

                const onColumnWithOctagonalCells: boolean = columnIndex % 2 === 0;

                if (onColumnWithOctagonalCells) {
                    continue;
                }

                const currentCell: Cell = grid[columnIndex][rowIndex];
                const neighbourDownLeft: Cell = grid[columnIndex - 1][rowIndex];
                const neighbourDownRight: Cell = grid[columnIndex + 1][rowIndex];
                const neighbourUpLeft: Cell = grid[columnIndex - 1][rowIndex + 1];
                const neighbourUpRight: Cell = grid[columnIndex + 1][rowIndex + 1];

                currentCell.establishNeighbourRelationTo(neighbourDownLeft);
                currentCell.establishNeighbourRelationTo(neighbourDownRight);
                currentCell.establishNeighbourRelationTo(neighbourUpLeft);
                currentCell.establishNeighbourRelationTo(neighbourUpRight);

            }
        }
    }

}
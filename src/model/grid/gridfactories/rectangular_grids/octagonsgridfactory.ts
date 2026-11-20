import { Coordinate } from '../../../coordinate';
import { Vector } from '../../../vector/vector';
import { Cell } from '../../../cell/cell';
import { CellCreatorFactory } from '../../../cell/cellcreatorfactory';
import type { CellCreator } from '../../../typealiases';
import { Grid } from '../../grid';
import type { RectangularGridFactory } from './rectangulargridfactory.interface';
import { RectangularGridProperties } from './rectangulargridproperties';
import { stepDown, stepRight, stepUp } from '../../../vector/vectorcreator';
import { GridAssembler } from '../../gridassemblers/gridassembler';

export class OctagonsGridFactory extends GridAssembler<Cell> implements RectangularGridFactory {

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

        const createOctagonalCell: CellCreator = CellCreatorFactory.makeCellCreator('octagonal-cell');
        const createHalfOctagonalCell: CellCreator = CellCreatorFactory.makeCellCreator('semi-octagonal-semi-square-cell');
        const createChamferedSquareCell: CellCreator = CellCreatorFactory.makeCellCreator('chamfered-square-cell');
        const createSquareCell: CellCreator = CellCreatorFactory.makeCellCreator('square-cell');



        if (gridProperties.numberOfVerticalEdgeSegments === 1) {
            const rowOfCells: Cell[] = this.createSequenceOfRegions(
                { insertionPoint: gridInsertionPoint, angle: angle, size: cellWidth },
                columnStep,
                gridProperties.numberOfHorizontalEdgeSegments,
                createSquareCell
            );
            return [rowOfCells];
        }

        if (gridProperties.numberOfHorizontalEdgeSegments === 1) {
            const columnOfCells: Cell[] = this.createSequenceOfRegions(
                { insertionPoint: gridInsertionPoint, angle: angle, size: cellWidth },
                rowStep,
                gridProperties.numberOfVerticalEdgeSegments,
                createSquareCell
            );
            return [columnOfCells];
        }


        const cellColumns: Cell[][] = [];

        // first column
        const firstColumn: Cell[] = [];
        const lowerLeftCornerCell: Cell =
            createChamferedSquareCell({ insertionPoint: gridInsertionPoint, angle: angle + 0, size: cellWidth });
        firstColumn.push(lowerLeftCornerCell);

        const leftColumnSecondCellInsertionPoint: Coordinate = gridInsertionPoint.stepToNewCoordinate(rowStep);
        const leftColumnOfCells: Cell[] = this.createSequenceOfRegions(
            { insertionPoint: leftColumnSecondCellInsertionPoint, angle: angle + 0, size: cellWidth },
            rowStep,
            numberOfRows - 2,
            createHalfOctagonalCell
        );
        firstColumn.push(...leftColumnOfCells);

        const upperLeftCornerCellInsertionPoint: Coordinate = gridInsertionPoint
            .stepToNewCoordinate(rowStep.times(numberOfRows - 1).thenTake(rowStep));
        const upperLeftCornerCell: Cell =
            createChamferedSquareCell({ insertionPoint: upperLeftCornerCellInsertionPoint, angle: angle + 270, size: cellWidth });
        firstColumn.push(upperLeftCornerCell);

        cellColumns.push(firstColumn);


        // intermediate columns
        for (let columnIndex: number = 0; columnIndex < numberOfColumns; columnIndex++) {
            const notOnFirstColumn: boolean = columnIndex !== 0;
            const notOnLastColumn: boolean = columnIndex !== numberOfColumns - 1;

            const firstOctagonalCellInsertionPoint: Coordinate = gridInsertionPoint
                .stepToNewCoordinate(columnStep.times(columnIndex));
            const fistTiltedSquareCellCenter: Coordinate = firstOctagonalCellInsertionPoint
                .stepToNewCoordinate(columnStep.thenTake(rowStep))
                .stepToNewCoordinate(stepDown(tiltedSquareCellDiagonalLength / 2).newRotatedVector(angle));


            if (notOnFirstColumn && notOnLastColumn) {
                const intermediateColumn: Cell[] = [];
                const intermediateColumnBottomInsertionPoint: Coordinate =
                    firstOctagonalCellInsertionPoint.stepToNewCoordinate(columnStep);
                const bottomCell: Cell =
                    createHalfOctagonalCell({ insertionPoint: intermediateColumnBottomInsertionPoint, angle: angle + 90, size: cellWidth });
                intermediateColumn.push(bottomCell);

                const intermediateColumnSecondCellInsertionPoint: Coordinate =
                    firstOctagonalCellInsertionPoint
                        .stepToNewCoordinate(rowStep)
                        .stepToNewCoordinate(stepRight(cellWidth / 2 - sideLength / 2).newRotatedVector(angle));
                const octagonalCellSequence: Cell[] =
                    this.createSequenceOfRegions(
                        { insertionPoint: intermediateColumnSecondCellInsertionPoint, angle: angle, size: cellWidth },
                        rowStep,
                        numberOfRows - 2,
                        createOctagonalCell
                    );
                intermediateColumn.push(...octagonalCellSequence);

                const topCellInsertionPoint: Coordinate = firstOctagonalCellInsertionPoint
                    .stepToNewCoordinate(rowStep.times(numberOfRows - 1));
                const intermediateColumnTopInsertionPoint: Coordinate = topCellInsertionPoint.stepToNewCoordinate(rowStep);

                const topCell: Cell =
                    createHalfOctagonalCell({ insertionPoint: intermediateColumnTopInsertionPoint, angle: angle + 270, size: cellWidth });
                intermediateColumn.push(topCell);


                cellColumns.push(intermediateColumn);
            }

            if (notOnLastColumn) {
                const tiltedSquareCellSequence: Cell[] =
                    this.createSequenceOfRegions(
                        { insertionPoint: fistTiltedSquareCellCenter, angle: angle + 45, size: tiltedSquareWidth },
                        rowStep,
                        numberOfRows - 1,
                        createSquareCell
                    );
                cellColumns.push(tiltedSquareCellSequence);
            }


        }
        // last column
        const lastColumn: Cell[] = [];
        const lastColumnFirstCellInsertionPoint: Coordinate =
            gridInsertionPoint.stepToNewCoordinate(columnStep.times(numberOfColumns - 1));
        const lowerRightCornerCellInsertionPoint: Coordinate =
            lastColumnFirstCellInsertionPoint.stepToNewCoordinate(columnStep);
        const lowerRightCornerCell: Cell =
            createChamferedSquareCell({ insertionPoint: lowerRightCornerCellInsertionPoint, angle: angle + 90, size: cellWidth });
        lastColumn.push(lowerRightCornerCell);

        const rightColumnSecondCellInsertionPoint: Coordinate =
            lastColumnFirstCellInsertionPoint.stepToNewCoordinate(rowStep.times(2).thenTake(columnStep));
        const rightColumnOfCells: Cell[] = this.createSequenceOfRegions(
            { insertionPoint: rightColumnSecondCellInsertionPoint, angle: angle + 180, size: cellWidth },
            rowStep,
            numberOfRows - 2,
            createHalfOctagonalCell
        );
        lastColumn.push(...rightColumnOfCells);

        const upperRightCornerCellInsertionPoint: Coordinate = lastColumnFirstCellInsertionPoint
            .stepToNewCoordinate(rowStep.times(numberOfRows).thenTake(columnStep));
        const upperRightCornerCell: Cell =
            createChamferedSquareCell({ insertionPoint: upperRightCornerCellInsertionPoint, angle: angle + 180, size: cellWidth });
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

                currentCell.establishNeighbourRelationsWith(neighbourDownLeft);
                currentCell.establishNeighbourRelationsWith(neighbourDownRight);
                currentCell.establishNeighbourRelationsWith(neighbourUpLeft);
                currentCell.establishNeighbourRelationsWith(neighbourUpRight);

            }
        }
    }

}
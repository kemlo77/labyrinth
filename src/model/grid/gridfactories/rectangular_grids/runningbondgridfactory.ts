import { MatrixOperations } from '../../../../service/matrixoperations';
import { Coordinate } from '../../../coordinate';
import { Vector } from '../../../vector/vector';
import { stepRight, stepUp } from '../../../vector/vectorcreator';
import { Cell } from '../../cell/cell';
import { CellFactory } from '../../cell/cellfactory';
import { CellCreator } from '../../typealiases';
import { Grid } from '../../grid';
import { RectangularGridFactory } from './rectangulargridfactory.interface';
import { RectangularGridProperties } from './rectangulargridproperties';
import { GridAssembler } from '../gridassemblers/gridassembler';

export class RunningBondGridFactory extends GridAssembler<Cell> implements RectangularGridFactory {


    createGrid(gridProperties: RectangularGridProperties): Grid {
        const cellMatrix: Cell[][] = this.createCellGrid(gridProperties);
        this.establishNeighbourRelationsInMatrix(cellMatrix);
        const startCell: Cell = cellMatrix[0][0];
        const endCell: Cell = cellMatrix[cellMatrix.length - 1][cellMatrix[cellMatrix.length - 1].length - 1];
        const cells: Cell[] = cellMatrix.flat();
        return new Grid(cells, startCell, endCell);
    }

    private createCellGrid(gridProperties: RectangularGridProperties): Cell[][] {

        const cellWidth: number = gridProperties.lengthOfEdgeSegments;
        const halfCellWidth: number = cellWidth / 2;
        const doubleCellWidth: number = cellWidth * 2;
        const numberOfcolumns: number = gridProperties.numberOfHorizontalEdgeSegments;
        const numberOfRows: number = gridProperties.numberOfVerticalEdgeSegments;
        const angle: number = gridProperties.angle;

        const oneStepUp: Vector = stepUp(cellWidth).newRotatedVector(angle);
        const aHalfStepRight: Vector = stepRight(halfCellWidth).newRotatedVector(angle);
        const oneStepRight: Vector = stepRight(cellWidth).newRotatedVector(angle);
        const twoStepsRight: Vector = stepRight(doubleCellWidth).newRotatedVector(angle);

        const createSquareCell: CellCreator =
            (insertionPoint: Coordinate) => CellFactory.createCell(insertionPoint, cellWidth, 'square', angle);
        const createRectangularCell: CellCreator =
            (insertionPoint: Coordinate) =>
                CellFactory.createCell(insertionPoint, cellWidth * 2, 'double-square-rectangle', 0 + angle);

        const firstCellInsertionPoint: Coordinate = gridProperties.insertionPoint;

        const cellRows: Cell[][] = [];
        const evenRowNumberOfWideCells: number = Math.floor(numberOfcolumns / 2);
        const oddRowNumberOfWideCells: number =
            numberOfcolumns % 2 === 0 ? Math.floor((numberOfcolumns - 1) / 2) : Math.floor(numberOfcolumns / 2);

        for (let rowIndex: number = 0; rowIndex < numberOfRows; rowIndex++) {
            const rowOfCells: Cell[] = [];
            const onEvenRow: boolean = rowIndex % 2 === 0;
            const rowInsertionPoint: Coordinate =
                firstCellInsertionPoint.stepToNewCoordinate(oneStepUp.times(rowIndex));
            if (onEvenRow) {
                //rectangular cells
                const evenRowStartPoint: Coordinate = rowInsertionPoint.stepToNewCoordinate(aHalfStepRight);
                const rectangularCells: Cell[] = this.createSequenceOfRegions(
                    rowInsertionPoint,
                    twoStepsRight,
                    evenRowNumberOfWideCells,
                    createRectangularCell
                );
                rowOfCells.push(...rectangularCells);
                //square cell
                if (numberOfcolumns % 2 === 1) {
                    const lastCellInsertionPoint: Coordinate = evenRowStartPoint
                        .stepToNewCoordinate(twoStepsRight.times(evenRowNumberOfWideCells));
                    const squareCell: Cell = createSquareCell(lastCellInsertionPoint);
                    rowOfCells.push(squareCell);
                }
            } else {
                //square cell
                const oddRowStartPoint: Coordinate = rowInsertionPoint;
                const firstSquareCellInRow: Cell = createSquareCell(oddRowStartPoint);
                rowOfCells.push(firstSquareCellInRow);

                //rectangular cells
                const rectangularCellsInsertionPoint: Coordinate = oddRowStartPoint
                    .stepToNewCoordinate(oneStepRight);
                const rectangularCells: Cell[] = this.createSequenceOfRegions(
                    rectangularCellsInsertionPoint,
                    twoStepsRight,
                    oddRowNumberOfWideCells,
                    createRectangularCell
                );
                rowOfCells.push(...rectangularCells);

                //square cell
                if (numberOfcolumns % 2 === 0) {
                    const lastCellInsertionPoint: Coordinate = rectangularCellsInsertionPoint
                        .stepToNewCoordinate(twoStepsRight.times(oddRowNumberOfWideCells));
                    const lastSquareCellInRow: Cell = createSquareCell(lastCellInsertionPoint);
                    rowOfCells.push(lastSquareCellInRow);
                }
            }
            cellRows.push(rowOfCells);
        }

        return cellRows;



    }

    private establishNeighbourRelationsInMatrix(grid: Cell[][]): void {
        const transposedGrid: Cell[][] = MatrixOperations.transpose(grid);
        this.establishNeighbourRelationsInColumns(grid);
        this.establishNeighbourRelationsInColumns(transposedGrid);
        this.establishNeighbourRelationsForRemainingCells(grid);
    }

    private establishNeighbourRelationsForRemainingCells(grid: Cell[][]): void {
        for (let rowIndex: number = 0; rowIndex < grid.length; rowIndex++) {
            for (let columnIndex: number = 0; columnIndex < grid[rowIndex].length; columnIndex++) {

                const onFirstColumn: boolean = columnIndex === 0;
                const onEvenRow: boolean = rowIndex % 2 === 0;
                const onLastRow: boolean = rowIndex === grid.length - 1;
                const cell: Cell = grid[rowIndex][columnIndex];

                if (onEvenRow || onFirstColumn) {
                    continue;
                }
                const lowerRowLeftNeighbour: Cell = grid[rowIndex - 1][columnIndex - 1];
                cell.establishNeighbourRelationsWith(lowerRowLeftNeighbour);

                if (onLastRow) {
                    continue;
                }
                const upperRowLeftNeighbour: Cell = grid[rowIndex + 1][columnIndex - 1];
                cell.establishNeighbourRelationsWith(upperRowLeftNeighbour);
            }
        }
    }
}
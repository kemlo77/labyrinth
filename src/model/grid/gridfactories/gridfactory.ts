import { MatrixOperations } from '../../../service/matrixoperations';
import { Coordinate } from '../../coordinate';
import { Vector } from '../../vector/vector';
import { Cell } from '../cell/cell';
import { CellCreator } from '../typealiases';

export abstract class GridFactory {

    protected createSequenceOfCells(
        startCoordinate: Coordinate,
        step: Vector,
        cellsToCreate: number,
        createCell: CellCreator
    ): Cell[] {
        const cellSequence: Cell[] = [];
        for (let stepNumber: number = 0; stepNumber < cellsToCreate; stepNumber++) {
            const newCellCenter: Coordinate = startCoordinate.stepToNewCoordinate(step.times(stepNumber));
            cellSequence.push(createCell(newCellCenter));
        }
        return cellSequence;
    }

    protected createPointyTopFirstRowOfTriangles(
        insertionPoint: Coordinate,
        stepToNextInsertionPoint: Vector,
        numberOfPointyTopTriangles: number,
        createPointyTopTriangle: CellCreator,
        createPointyBottomTriangle: CellCreator
    ): Cell[] {
        const cellRow: Cell[] = [];
        for (let index: number = 0; index < numberOfPointyTopTriangles; index++) {
            const notFirstTriangle: boolean = index > 0;
            const cellInsertionPoint: Coordinate =
                insertionPoint.stepToNewCoordinate(stepToNextInsertionPoint.times(index));

            if (notFirstTriangle) {
                cellRow.push(createPointyBottomTriangle(cellInsertionPoint));
            }
            cellRow.push(createPointyTopTriangle(cellInsertionPoint));

        }
        return cellRow;
    }

    protected createPointyBottomFirstRowOfTriangles(
        insertionPoint: Coordinate,
        stepToNextInsertionPoint: Vector,
        numberOfPointyTopTriangles: number,
        createPointyTopTriangle: CellCreator,
        createPointyBottomTriangle: CellCreator
    ): Cell[] {
        const cellRow: Cell[] = [];
        for (let index: number = 0; index < numberOfPointyTopTriangles + 1; index++) {
            const notLastTriangle: boolean = index < numberOfPointyTopTriangles;
            const cellInsertionPoint: Coordinate =
                insertionPoint.stepToNewCoordinate(stepToNextInsertionPoint.times(index));

            cellRow.push(createPointyBottomTriangle(cellInsertionPoint));
            if (notLastTriangle) {
                cellRow.push(createPointyTopTriangle(cellInsertionPoint));
            }
        }
        return cellRow;
    }

    protected establishNeighbourRelationsInRows(cellMatrix: Cell[][]): void {
        const transposedCellMatrix: Cell[][] = MatrixOperations.transpose(cellMatrix);
        for (const column of transposedCellMatrix) {
            this.establishNeighbourRelationsInSequence(column);
        }
    }

    protected establishNeighbourRelationsInColumns(cellMatrix: Cell[][]): void {
        for (const column of cellMatrix) {
            this.establishNeighbourRelationsInSequence(column);
        }
    }

    protected establishNeighbourRelationsInSequence(sequence: Cell[]): void {
        for (let cellIndex: number = 0; cellIndex < sequence.length; cellIndex++) {
            const notOnTheLastCell: boolean = cellIndex !== sequence.length - 1;
            if (notOnTheLastCell) {
                const cell: Cell = sequence[cellIndex];
                const nextCell: Cell = sequence[cellIndex + 1];
                cell.establishNeighbourRelationsWith(nextCell);
            }
        }
    }

}
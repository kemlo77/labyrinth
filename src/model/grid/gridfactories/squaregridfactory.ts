import { Coordinate } from '../../coordinate';
import { rightUnitVector, upRightUnitVector, upUnitVector } from '../../unitvectors';
import { Vector } from '../../vector';
import { Cell } from '../cell/cell';
import { CellFactory } from '../cell/cellfactory';
import { CellCreator } from '../cell/celltypealiases';
import { Grid } from '../grid';
import { FramedGridFactory } from './framedgridfactory';

import { GridProperties } from './gridproperties';


export class SquareGridFactory extends FramedGridFactory {

    createGrid(gridProperties: GridProperties): Grid {
        const cellMatrix: Cell[][] = this.createCellMatrix(gridProperties);
        this.establishNeighbourRelationsInMatrix(cellMatrix);
        const startCell: Cell = cellMatrix[0][0];
        const endCell: Cell = cellMatrix[cellMatrix.length - 1][cellMatrix[0].length - 1];
        const cells: Cell[] = cellMatrix.flat();
        return new Grid(cells, startCell, endCell);
    }

    private createCellMatrix(gridProperties: GridProperties): Cell[][] {

        const cellWidth: number = gridProperties.edgeSegmentLength;
        const diagonalLength: number = cellWidth * Math.SQRT2;

        const stepDirectionToFirstCellCenter: Vector = upRightUnitVector.scale(diagonalLength / 2)
            .newRotatedVector(gridProperties.angle);
        const columnStep: Vector = rightUnitVector.scale(cellWidth)
            .newRotatedVector(gridProperties.angle);
        const rowStep: Vector = upUnitVector.scale(cellWidth)
            .newRotatedVector(gridProperties.angle);

        const firstCellCenter: Coordinate =
            gridProperties.insertionPoint.newRelativeCoordinate(stepDirectionToFirstCellCenter);

        const createRotatedSquareCell: CellCreator =
            (center: Coordinate) => CellFactory.createCell(center, cellWidth, 'square', gridProperties.angle);


        const cellColumns: Cell[][] = [];
        for (let columnIndex: number = 0; columnIndex < gridProperties.horizontalEdgeSegments; columnIndex++) {
            const columnStartCenter: Coordinate =
                firstCellCenter.newRelativeCoordinate(columnStep.scale(columnIndex));
            const cellSequence: Cell[] =
                this.createSequenceOfCells(columnStartCenter, rowStep, gridProperties.verticalEdgeSegments,
                    createRotatedSquareCell);
            cellColumns.push(cellSequence);
        }

        return cellColumns;
    }

    private establishNeighbourRelationsInMatrix(grid: Cell[][]): void {
        this.establishNeighbourRelationsInRows(grid);
        this.establishNeighbourRelationsInColumns(grid);
    }

}
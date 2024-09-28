import { Coordinate } from '../../../coordinate';
import { Vector } from '../../../vector/vector';
import { stepRight, stepUp, stepUpRight } from '../../../vector/vectorcreator';
import { Cell } from '../../cell/cell';
import { CellFactory } from '../../cell/cellfactory';
import { CellCreator } from '../../cell/celltypealiases';
import { Grid } from '../../grid';
import { GridFactory } from '../gridfactory';
import { RegularShapedGridFactory } from './regularshapedgridfactory.interface';
import { RegularShapedGridProperties } from './regularshapedgridproperties';



export class SquareGridFactory extends GridFactory implements RegularShapedGridFactory {

    createGrid(gridProperties: RegularShapedGridProperties): Grid {
        const cellMatrix: Cell[][] = this.createCellMatrix(gridProperties);
        this.establishNeighbourRelationsInMatrix(cellMatrix);
        const startCell: Cell = cellMatrix[0][0];
        const endCell: Cell = cellMatrix[cellMatrix.length - 1][cellMatrix[0].length - 1];
        const cells: Cell[] = cellMatrix.flat();
        return new Grid(cells, startCell, endCell);
    }

    private createCellMatrix(gridProperties: RegularShapedGridProperties): Cell[][] {

        const cellWidth: number = gridProperties.lengthOfEdgeSegments;
        const diagonalLength: number = cellWidth * Math.SQRT2;

        const stepDirectionToFirstCellCenter: Vector = stepUpRight(diagonalLength / 2)
            .newRotatedVector(gridProperties.angle);
        const columnStep: Vector = stepRight(cellWidth).newRotatedVector(gridProperties.angle);
        const rowStep: Vector = stepUp(cellWidth).newRotatedVector(gridProperties.angle);

        const firstCellCenter: Coordinate =
            gridProperties.insertionPoint.stepToNewCoordinate(stepDirectionToFirstCellCenter);

        const createRotatedSquareCell: CellCreator =
            (center: Coordinate) => CellFactory.createCell(center, cellWidth, 'square', gridProperties.angle);


        const cellColumns: Cell[][] = [];
        const segmentsPerSide: number = gridProperties.numberOfEdgeSegments;
        for (let columnIndex: number = 0; columnIndex < segmentsPerSide; columnIndex++) {
            const columnStartCenter: Coordinate = firstCellCenter.stepToNewCoordinate(columnStep.times(columnIndex));
            const cellSequence: Cell[] =
                this.createSequenceOfCells(columnStartCenter, rowStep, segmentsPerSide, createRotatedSquareCell);
            cellColumns.push(cellSequence);
        }

        return cellColumns;
    }

    private establishNeighbourRelationsInMatrix(grid: Cell[][]): void {
        this.establishNeighbourRelationsInRows(grid);
        this.establishNeighbourRelationsInColumns(grid);
    }

}
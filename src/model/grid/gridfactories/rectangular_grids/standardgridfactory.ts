import { Coordinate } from '../../../coordinate';
import { Vector } from '../../../vector/vector';
import { stepRight, stepUp } from '../../../vector/vectorcreator';
import { Cell } from '../../cell/cell';
import { CellFactory } from '../../cell/cellfactory';
import type { CellCreator } from '../../typealiases';
import { Grid } from '../../grid';
import type { RectangularGridFactory } from './rectangulargridfactory.interface';
import { RectangularGridProperties } from './rectangulargridproperties';
import { GridAssembler } from '../gridassemblers/gridassembler';


export class StandardGridFactory extends GridAssembler<Cell> implements RectangularGridFactory {

    createGrid(gridProperties: RectangularGridProperties): Grid {
        const cellMatrix: Cell[][] = this.createCellMatrix(gridProperties);
        this.establishNeighbourRelationsInMatrix(cellMatrix);
        const startCell: Cell = cellMatrix[0][0];
        const endCell: Cell = cellMatrix[cellMatrix.length - 1][cellMatrix[0].length - 1];
        const cells: Cell[] = cellMatrix.flat();
        return new Grid(cells, startCell, endCell);
    }

    private createCellMatrix(gridProperties: RectangularGridProperties): Cell[][] {

        const cellWidth: number = gridProperties.lengthOfEdgeSegments;
        const cellHeight: number = cellWidth;

        const columnStep: Vector = stepRight(cellWidth).newRotatedVector(gridProperties.angle);
        const rowStep: Vector = stepUp(cellHeight).newRotatedVector(gridProperties.angle);

        const firstCellInsertionPoint: Coordinate =
            gridProperties.insertionPoint;

        const createRotatedSquareCell: CellCreator =
            (insertionPoint: Coordinate) =>
                CellFactory.createCell(insertionPoint, cellWidth, 'square', gridProperties.angle);


        const cellColumns: Cell[][] = [];
        for (let columnIndex: number = 0; columnIndex < gridProperties.numberOfHorizontalEdgeSegments; columnIndex++) {
            const columnInsertionPoint: Coordinate =
                firstCellInsertionPoint.stepToNewCoordinate(columnStep.times(columnIndex));
            const cellSequence: Cell[] =
                this.createSequenceOfRegions(columnInsertionPoint, rowStep, gridProperties.numberOfVerticalEdgeSegments,
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
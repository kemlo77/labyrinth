import { Coordinate } from '../../../coordinate';
import { Vector } from '../../../vector/vector';
import { stepInDirection, stepRight } from '../../../vector/vectorcreator';
import { Cell } from '../../cell/cell';
import { CellFactory } from '../../cell/cellfactory';
import type { CellCreator } from '../../typealiases';
import { Grid } from '../../grid';
import type { RegularShapedGridFactory } from './regularshapedgridfactory.interface';
import { RegularShapedGridProperties } from './regularshapedgridproperties';
import { GridAssembler } from '../gridassemblers/gridassembler';


export class RhomboidGridFactory extends GridAssembler<Cell> implements RegularShapedGridFactory {

    createGrid(gridProperties: RegularShapedGridProperties): Grid {
        const cellGrid: Cell[][] = this.createCellMatrix(gridProperties);
        this.establishNeighbourRelationsInGrid(cellGrid);
        const startCell: Cell = cellGrid[0][0];
        const endCell: Cell = cellGrid[cellGrid.length - 1][cellGrid[0].length - 1];
        const cells: Cell[] = cellGrid.flat();
        return new Grid(cells, startCell, endCell);
    }

    private createCellMatrix(gridProperties: RegularShapedGridProperties): Cell[][] {
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;
        const segmentsPerSide: number = gridProperties.numberOfEdgeSegments;
        const angle: number = gridProperties.angle;
        const firstCellInsertionPoint: Coordinate = gridProperties.insertionPoint;

        const columnStep: Vector = stepRight(cellWidth).newRotatedVector(angle);
        const rowStep: Vector = stepInDirection(60, cellWidth).newRotatedVector(angle);

        const createRhombusCell: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(insertionPoint, cellWidth, 'rhombus', angle);

        const cellColumns: Cell[][] = [];
        for (let columnIndex: number = 0; columnIndex < segmentsPerSide; columnIndex++) {
            const columnInsertionPoint: Coordinate =
                firstCellInsertionPoint.stepToNewCoordinate(columnStep.times(columnIndex));
            const cellSequence: Cell[] =
                this.createSequenceOfRegions(
                    columnInsertionPoint,
                    rowStep,
                    segmentsPerSide,
                    createRhombusCell
                );
            cellColumns.push(cellSequence);
        }

        return cellColumns;
    }

    private establishNeighbourRelationsInGrid(grid: Cell[][]): void {
        this.establishNeighbourRelationsInRows(grid);
        this.establishNeighbourRelationsInColumns(grid);
    }

}

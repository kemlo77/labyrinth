import { Coordinate } from '../../../coordinate';
import { Vector } from '../../../vector/vector';
import { stepRight, stepUp } from '../../../vector/vectorcreator';
import { Cell } from '../../cell/cell';
import { CellFactory } from '../../cell/cellfactory';
import { CellCreator } from '../../typealiases';
import { Grid } from '../../grid';
import { GridFactory } from '../gridfactory';
import { RegularShapedGridFactory } from './regularshapedgridfactory.interface';
import { RegularShapedGridProperties } from './regularshapedgridproperties';

export class TriangularGridFactory extends GridFactory implements RegularShapedGridFactory {

    createGrid(gridProperties: RegularShapedGridProperties): Grid {
        const cellGrid: Cell[][] = this.createCellMatrix(gridProperties);
        this.establishNeighbourRelationsInMatrix(cellGrid);

        const startCell: Cell = cellGrid[0][0];
        const endCell: Cell = cellGrid[cellGrid.length - 1][0];
        const cells: Cell[] = cellGrid.flat();
        return new Grid(cells, startCell, endCell);
    }

    private createCellMatrix(gridProperties: RegularShapedGridProperties): Cell[][] {
        const firstInsertionPoint: Coordinate = gridProperties.insertionPoint;
        const angle: number = gridProperties.angle;
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;
        const cellHeight: number = cellWidth * Math.sqrt(3) / 2;

        const stepTriangleHeightUp: Vector = stepUp(cellHeight).newRotatedVector(angle);
        const stepHalfCellWidthRight: Vector = stepRight(cellWidth / 2).newRotatedVector(angle);
        const stepCellWidthRight: Vector = stepRight(cellWidth).newRotatedVector(angle);

        const createTriangleWithPointyTop: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(insertionPoint, cellWidth, 'equilateral-triangular', angle);
        const createTriangleWithPointyBottom: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(insertionPoint, cellWidth, 'equilateral-triangular', angle + 60);


        const cellRows: Cell[][] = [];

        for (let rowIndex: number = 0; rowIndex < gridProperties.numberOfEdgeSegments; rowIndex++) {
            const rowInsertionPoint: Coordinate = firstInsertionPoint
                .stepToNewCoordinate(stepTriangleHeightUp.times(rowIndex))
                .stepToNewCoordinate(stepHalfCellWidthRight.times(rowIndex));
            const numberOfPointyTopTriangles: number = gridProperties.numberOfEdgeSegments - rowIndex;

            const cellRow: Cell[] = this.createPointyTopFirstRowOfTriangles(
                rowInsertionPoint,
                stepCellWidthRight,
                numberOfPointyTopTriangles,
                createTriangleWithPointyTop,
                createTriangleWithPointyBottom
            );

            cellRows.push(cellRow);
        }
        return cellRows;
    }


    private establishNeighbourRelationsInMatrix(cellGrid: Cell[][]): void {
        cellGrid.forEach(cellRow => this.establishNeighbourRelationsInSequence(cellRow));

        for (let rowIndex: number = 0; rowIndex < cellGrid.length - 1; rowIndex++) {
            const currentRow: Cell[] = cellGrid[rowIndex];
            const nextRow: Cell[] = cellGrid[rowIndex + 1];
            for (let columnIndex: number = 0; columnIndex < nextRow.length; columnIndex += 2) {
                const currentRowCell: Cell = currentRow[columnIndex + 1];
                const nextRowCell: Cell = nextRow[columnIndex];
                currentRowCell.establishNeighbourRelationsWith(nextRowCell);

            }
        }
    }

}
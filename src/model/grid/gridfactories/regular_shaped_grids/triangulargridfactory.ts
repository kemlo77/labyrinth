import { Coordinate } from '../../../coordinate';
import { Vector } from '../../../vector/vector';
import { stepRight, stepUp } from '../../../vector/vectorcreator';
import { Cell } from '../../cell/cell';
import { CellFactory } from '../../cell/cellfactory';
import { CellCreator } from '../../cell/celltypealiases';
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
        const angle: number = gridProperties.angle;
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;
        const createTriangleWithPointyTop: CellCreator = (center: Coordinate) =>
            CellFactory.createCell(center, cellWidth, 'equilateral-triangular', angle);
        const createTriangleWithPointyBottom: CellCreator = (center: Coordinate) =>
            CellFactory.createCell(center, cellWidth, 'equilateral-triangular', angle + 180);

        const triangleHeight: number = cellWidth * Math.sqrt(3) / 2;
        const rowStep: Vector = stepUp(triangleHeight).newRotatedVector(angle);
        const columnStep: Vector = stepRight(cellWidth / 2).newRotatedVector(angle);
        const evenTriangleAdjustment: Vector = stepUp(triangleHeight / 3).newRotatedVector(angle);
        const oddTriangleAdjustment: Vector = stepUp(triangleHeight * 2 / 3).newRotatedVector(angle);

        const firstCellCornerPosition: Coordinate = gridProperties.insertionPoint;
        const cellRows: Cell[][] = [];

        for (let rowIndex: number = 0; rowIndex < gridProperties.numberOfEdgeSegments; rowIndex++) {
            const rowStartCenter: Coordinate =
                firstCellCornerPosition
                    .stepToNewCoordinate(columnStep)
                    .stepToNewCoordinate(rowStep.times(rowIndex))
                    .stepToNewCoordinate(columnStep.times(rowIndex));
            const cellRow: Cell[] = [];
            const trianglesInRow: number = 2 * (gridProperties.numberOfEdgeSegments - rowIndex) - 1;
            for (let columnIndex: number = 0; columnIndex < trianglesInRow; columnIndex++) {
                const evenColumn: boolean = columnIndex % 2 === 0;
                let cellCenter: Coordinate = rowStartCenter.stepToNewCoordinate(columnStep.times(columnIndex));
                if (evenColumn) {
                    cellCenter = cellCenter.stepToNewCoordinate(evenTriangleAdjustment);
                    cellRow.push(createTriangleWithPointyTop(cellCenter));
                } else {
                    cellCenter = cellCenter.stepToNewCoordinate(oddTriangleAdjustment);
                    cellRow.push(createTriangleWithPointyBottom(cellCenter));
                }
            }

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
                currentRowCell.establishNeighbourRelationTo(nextRowCell);

            }
        }
    }

}
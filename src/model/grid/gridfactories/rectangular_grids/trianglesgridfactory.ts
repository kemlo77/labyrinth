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


export class TrianglesGridFactory extends GridAssembler<Cell> implements RectangularGridFactory {

    createGrid(gridProperties: RectangularGridProperties): Grid {
        const cellGrid: Cell[][] = this.createCellMatrix(gridProperties);
        this.establishNeighbourRelationsInMatrix(cellGrid);

        const startCell: Cell = cellGrid[0][1];
        let endCell: Cell = cellGrid[cellGrid.length - 1][cellGrid[cellGrid.length - 1].length - 1];
        if (cellGrid.length % 2 === 0) {
            endCell = cellGrid[cellGrid.length - 1][cellGrid[cellGrid.length - 1].length - 2];
        }

        const cells: Cell[] = cellGrid.flat();
        return new Grid(cells, startCell, endCell);
    }


    private createCellMatrix(gridProperties: RectangularGridProperties): Cell[][] {

        const cellWidth: number = gridProperties.lengthOfEdgeSegments;
        const numberOfRows: number = gridProperties.numberOfVerticalEdgeSegments;
        const numberOfColumns: number = gridProperties.numberOfHorizontalEdgeSegments;
        const insertionPoint: Coordinate = gridProperties.insertionPoint;
        const angle: number = gridProperties.angle;

        const cellHeight: number = cellWidth;

        const stepRightHalfCellWidth: Vector = stepRight(cellWidth / 2).newRotatedVector(angle);
        const stepRightCellWidth: Vector = stepRight(cellWidth).newRotatedVector(angle);
        const stepUpCellHeight: Vector = stepUp(cellHeight).newRotatedVector(angle);

        const createTriangleWithPointyTop: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint,
                cellWidth,
                'triangular',
                angle
            );
        const createTriangleWithPointyBottom: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint.stepToNewCoordinate(stepRightHalfCellWidth.then(stepUpCellHeight)),
                cellWidth,
                'triangular',
                angle + 180
            );
        const createLeftHalfPointyTopTriangle: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint,
                cellWidth,
                'right-half-triangular',
                angle
            );
        const createRightHalfPointyTopTriangle: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint.stepToNewCoordinate(stepRightHalfCellWidth),
                cellWidth,
                'left-half-triangular',
                angle
            );
        const createLeftHalfPointyBottomTriangle: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint.stepToNewCoordinate(stepRightHalfCellWidth.then(stepUpCellHeight)),
                cellWidth,
                'left-half-triangular',
                angle + 180
            );
        const createRightHalfPointyBottomTriangle: CellCreator = (insertionPoint: Coordinate) =>
            CellFactory.createCell(
                insertionPoint.stepToNewCoordinate(stepUpCellHeight),
                cellWidth,
                'right-half-triangular',
                angle + 180
            );



        const cellRows: Cell[][] = [];

        for (let rowIndex: number = 0; rowIndex < numberOfRows; rowIndex++) {
            const rowInsertionPoint: Coordinate = insertionPoint.stepToNewCoordinate(stepUpCellHeight.times(rowIndex));
            const evenRow: boolean = rowIndex % 2 === 0;

            if (evenRow) {
                const firstCell: Cell = createLeftHalfPointyBottomTriangle(rowInsertionPoint);
                const cellRow: Cell[] = this.createPointyTopFirstRowOfTriangles(
                    rowInsertionPoint,
                    stepRightCellWidth,
                    numberOfColumns,
                    createTriangleWithPointyTop,
                    createTriangleWithPointyBottom
                );
                const lastCell: Cell = createRightHalfPointyBottomTriangle(
                    rowInsertionPoint.stepToNewCoordinate(stepRightCellWidth.times(numberOfColumns))
                );
                cellRows.push([firstCell, ...cellRow, lastCell]);
            } else {
                const firstCell: Cell = createLeftHalfPointyTopTriangle(rowInsertionPoint);
                const cellRow: Cell[] = this.createPointyBottomFirstRowOfTriangles(
                    rowInsertionPoint.stepToNewCoordinate(stepRightHalfCellWidth),
                    stepRightCellWidth,
                    numberOfColumns - 1,
                    createTriangleWithPointyTop,
                    createTriangleWithPointyBottom

                );
                const lastCell: Cell = createRightHalfPointyTopTriangle(
                    rowInsertionPoint.stepToNewCoordinate(stepRightCellWidth.times(numberOfColumns - 1))
                );
                cellRows.push([firstCell, ...cellRow, lastCell]);
            }


        }

        return cellRows;
    }

    private establishNeighbourRelationsInMatrix(grid: Cell[][]): void {
        grid.forEach(cellRow => this.establishNeighbourRelationsInSequence(cellRow));

        this.establishSomeNeighbourRelationsBetweenRows(grid);
    }

    private establishSomeNeighbourRelationsBetweenRows(grid: Cell[][]): void {
        for (let rowIndex: number = 0; rowIndex < grid.length; rowIndex++) {
            for (let columnIndex: number = 0; columnIndex < grid[rowIndex].length; columnIndex++) {

                const onLastRow: boolean = rowIndex === grid.length - 1;
                if (onLastRow) {
                    continue;
                }

                const currentCell: Cell = grid[rowIndex][columnIndex];
                const neighbourCellAbove: Cell = grid[rowIndex + 1][columnIndex];
                if (currentCell.hasCommonBorderWith(neighbourCellAbove)) {
                    currentCell.establishNeighbourRelationsWith(neighbourCellAbove);
                }
            }
        }
    }
}
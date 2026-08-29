import { Coordinate } from '../../../coordinate';
import { Vector } from '../../../vector/vector';
import { stepRight, stepUp } from '../../../vector/vectorcreator';
import { Cell } from '../../cell/cell';
import { Grid } from '../../grid';
import { Region } from '../../region';
import { RegionCreator } from '../../typealiases';
import { RegularShapedGridProperties } from '../regular_shaped_grids/regularshapedgridproperties';
import { GridAssembler } from './gridassembler';

export class TriangularGridAssembler<T extends Region<T>> extends GridAssembler<T> {

    createGrid(
        gridProperties: RegularShapedGridProperties,
        pointyTopCreator: RegionCreator<T>,
        pointyBottomCreator: RegionCreator<T>
    ): Grid {
        const regionGrid: T[][] =
            this.createRegionMatrix(gridProperties, pointyTopCreator, pointyBottomCreator);
        this.establishNeighbourRelationsInMatrix(regionGrid);

        const cells: Cell[] = regionGrid.flatMap(row => row.map(region => region.getCells())).flat();
        const startCell: Cell = cells[0];
        const endCell: Cell = cells[cells.length - 1];
        const center: Coordinate = this.calculateGridCenter(gridProperties);

        return new Grid(cells, startCell, endCell, center);
    }

    private calculateGridCenter(
        gridProperties: RegularShapedGridProperties
    ): Coordinate {
        const angle: number = gridProperties.angle;
        const regionWidth: number = gridProperties.lengthOfEdgeSegments;
        const gridBaseWidth: number = gridProperties.numberOfEdgeSegments * regionWidth;
        const gridHeight: number = (gridBaseWidth * Math.sqrt(3)) / 2;
        const insertionPoint: Coordinate = gridProperties.insertionPoint;
        const stepToGridCenter: Vector = stepRight(gridBaseWidth / 2)
            .thenTake(stepUp(gridHeight / 3))
            .newRotatedVector(angle);

        return insertionPoint.stepToNewCoordinate(stepToGridCenter);
    }

    private createRegionMatrix(
        gridProperties: RegularShapedGridProperties,
        pointyTopCreator: RegionCreator<T>,
        pointyBottomCreator: RegionCreator<T>
    ): T[][] {
        const firstInsertionPoint: Coordinate = gridProperties.insertionPoint;
        const angle: number = gridProperties.angle;
        const regionWidth: number = gridProperties.lengthOfEdgeSegments;
        const regionHeight: number = regionWidth * Math.sqrt(3) / 2;

        const stepTriangleHeightUp: Vector = stepUp(regionHeight).newRotatedVector(angle);
        const stepHalfRegionWidthRight: Vector = stepRight(regionWidth / 2).newRotatedVector(angle);
        const stepRegionWidthRight: Vector = stepRight(regionWidth).newRotatedVector(angle);

        const regionRows: T[][] = [];

        for (let rowIndex: number = 0; rowIndex < gridProperties.numberOfEdgeSegments; rowIndex++) {
            const rowInsertionPoint: Coordinate = firstInsertionPoint
                .stepToNewCoordinate(stepTriangleHeightUp.times(rowIndex))
                .stepToNewCoordinate(stepHalfRegionWidthRight.times(rowIndex));
            const numberOfPointyTopTriangles: number = gridProperties.numberOfEdgeSegments - rowIndex;

            const regionRow: T[] = this.createPointyTopFirstRowOfTriangles(
                rowInsertionPoint,
                stepRegionWidthRight,
                numberOfPointyTopTriangles,
                pointyTopCreator,
                pointyBottomCreator
            );

            regionRows.push(regionRow);
        }
        return regionRows;
    }


    private establishNeighbourRelationsInMatrix(regionGrid: T[][]): void {
        regionGrid.forEach(regionRow => this.establishNeighbourRelationsInSequence(regionRow));

        for (let rowIndex: number = 0; rowIndex < regionGrid.length - 1; rowIndex++) {
            const currentRow: T[] = regionGrid[rowIndex];
            const nextRow: T[] = regionGrid[rowIndex + 1];
            for (let columnIndex: number = 0; columnIndex < nextRow.length; columnIndex += 2) {
                const currentRowRegion: T = currentRow[columnIndex + 1];
                const nextRowRegion: T = nextRow[columnIndex];
                currentRowRegion.establishNeighbourRelationsWith(nextRowRegion);

            }
        }
    }

}
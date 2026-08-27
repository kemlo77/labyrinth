import { Coordinate } from '../../../coordinate';
import { Vector } from '../../../vector/vector';
import { stepInDirection, stepLeft, stepRight, stepUp } from '../../../vector/vectorcreator';
import { Cell } from '../../cell/cell';
import { Grid } from '../../grid';
import { Region } from '../../region';
import { RegionCreator } from '../../typealiases';
import { RegularShapedGridProperties } from '../regular_shaped_grids/regularshapedgridproperties';
import { GridAssembler } from './gridassembler';

export class HexagonalGridAssembler<T extends Region<T>> extends GridAssembler<T> {

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
        const gridSideWidth: number = gridProperties.numberOfEdgeSegments * regionWidth;
        const insertionPoint: Coordinate = gridProperties.insertionPoint;
        const stepToGridCenter: Vector = stepInDirection(60, gridSideWidth)
            .newRotatedVector(angle);

        return insertionPoint.stepToNewCoordinate(stepToGridCenter);
    }

    private createRegionMatrix(
        gridProperties: RegularShapedGridProperties,
        pointyTopCreator: RegionCreator<T>,
        pointyBottomCreator: RegionCreator<T>
    ): T[][] {

        const angle: number = gridProperties.angle;
        const regionWidth: number = gridProperties.lengthOfEdgeSegments;
        const numberOfEdgeSegments: number = gridProperties.numberOfEdgeSegments;
        const gridSideWidth: number = numberOfEdgeSegments * regionWidth;
        const regionHeight: number = regionWidth * Math.sqrt(3) / 2;
        const firstInsertionPoint: Coordinate = gridProperties.insertionPoint;

        const stepTriangleHeightUp: Vector = stepUp(regionHeight).newRotatedVector(angle);
        const stepHalfRegionWidthRight: Vector = stepRight(regionWidth / 2).newRotatedVector(angle);
        const stepHalfRegionWidthLeft: Vector = stepLeft(regionWidth / 2).newRotatedVector(angle);
        const stepRegionWidthRight: Vector = stepRight(regionWidth).newRotatedVector(angle);
        const stepToSecondInsertionPoint: Vector = stepInDirection(120, gridSideWidth).newRotatedVector(angle);

        const secondInsertionPoint: Coordinate = firstInsertionPoint.stepToNewCoordinate(stepToSecondInsertionPoint);

        const regionRows: T[][] = [];

        //bottom half of hexagon
        for (let rowIndex: number = 0; rowIndex < gridProperties.numberOfEdgeSegments; rowIndex++) {
            const rowInsertionPoint: Coordinate = firstInsertionPoint
                .stepToNewCoordinate(stepTriangleHeightUp.times(rowIndex))
                .stepToNewCoordinate(stepHalfRegionWidthLeft.times(rowIndex));
            const numberOfPointyTopTriangles: number = gridProperties.numberOfEdgeSegments + rowIndex;

            const rowOfRegions: T[] = this.createPointyBottomFirstRowOfTriangles(
                rowInsertionPoint,
                stepRegionWidthRight,
                numberOfPointyTopTriangles,
                pointyTopCreator,
                pointyBottomCreator
            );

            regionRows.push(rowOfRegions);
        }

        //upper half of hexagon
        for (let rowIndex: number = 0; rowIndex < gridProperties.numberOfEdgeSegments; rowIndex++) {
            const rowInsertionPoint: Coordinate = secondInsertionPoint
                .stepToNewCoordinate(stepTriangleHeightUp.times(rowIndex))
                .stepToNewCoordinate(stepHalfRegionWidthRight.times(rowIndex));
            const numberOfPointyTopTriangles: number = gridProperties.numberOfEdgeSegments * 2 - rowIndex;

            const rowOfRegions: T[] = this.createPointyTopFirstRowOfTriangles(
                rowInsertionPoint,
                stepRegionWidthRight,
                numberOfPointyTopTriangles,
                pointyTopCreator,
                pointyBottomCreator
            );

            regionRows.push(rowOfRegions);
        }
        return regionRows;
    }


    private establishNeighbourRelationsInMatrix(regionGrid: T[][]): void {
        regionGrid.forEach(regionRow => this.establishNeighbourRelationsInSequence(regionRow));

        //connect bottom half regions
        for (let rowIndex: number = 0; rowIndex < regionGrid.length / 2 - 1; rowIndex++) {
            const currentRow: T[] = regionGrid[rowIndex];
            const nextRow: T[] = regionGrid[rowIndex + 1];
            for (let columnIndex: number = 0; columnIndex < currentRow.length; columnIndex += 2) {
                const currentRowRegion: T = currentRow[columnIndex];
                const nextRowRegion: T = nextRow[columnIndex + 1];
                currentRowRegion.establishNeighbourRelationsWith(nextRowRegion);
            }
        }

        //connect middle regions
        const upperMiddleRowIndex: number = regionGrid.length / 2;
        const lowerMiddleRowIndex: number = upperMiddleRowIndex - 1;
        const upperMiddleRow: T[] = regionGrid[upperMiddleRowIndex];
        const lowerMiddleRow: T[] = regionGrid[lowerMiddleRowIndex];
        for (let columnIndex: number = 0; columnIndex < upperMiddleRow.length; columnIndex += 2) {
            const upperMiddleRegion: T = upperMiddleRow[columnIndex];
            const lowerMiddleRegion: T = lowerMiddleRow[columnIndex];
            upperMiddleRegion.establishNeighbourRelationsWith(lowerMiddleRegion);
        }

        //connect upper half region
        for (let rowIndex: number = regionGrid.length / 2; rowIndex < regionGrid.length - 1; rowIndex++) {
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
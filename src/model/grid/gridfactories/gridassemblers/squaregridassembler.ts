import { Coordinate } from '../../../coordinate';
import { Vector } from '../../../vector/vector';
import { stepRight, stepUp } from '../../../vector/vectorcreator';
import { Cell } from '../../cell/cell';
import { Grid } from '../../grid';
import { Region } from '../../region';
import { RegionCreator } from '../../typealiases';
import { RegularShapedGridProperties } from '../regular_shaped_grids/regularshapedgridproperties';
import { GridAssembler } from './gridassembler';

export class SquareGridAssembler<T extends Region<T>> extends GridAssembler<T> {

    createGrid(gridProperties: RegularShapedGridProperties, squareCreator: RegionCreator<T>): Grid {
        const regionGrid: T[][] = this.createRegionMatrix(gridProperties, squareCreator);
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
        const stepToGridCenter: Vector = stepRight(gridSideWidth / 2)
            .thenTake(stepUp(gridSideWidth / 2))
            .newRotatedVector(angle);

        return insertionPoint.stepToNewCoordinate(stepToGridCenter);
    }

    private createRegionMatrix(gridProperties: RegularShapedGridProperties, squareCreator: RegionCreator<T>): T[][] {

        const sideLength: number = gridProperties.lengthOfEdgeSegments;

        const columnStep: Vector = stepRight(sideLength).newRotatedVector(gridProperties.angle);
        const rowStep: Vector = stepUp(sideLength).newRotatedVector(gridProperties.angle);

        const firstRegionInsertionPoint: Coordinate = gridProperties.insertionPoint;

        const regionColumns: T[][] = [];
        const segmentsPerSide: number = gridProperties.numberOfEdgeSegments;
        for (let columnIndex: number = 0; columnIndex < segmentsPerSide; columnIndex++) {
            const columnStartCenter: Coordinate =
                firstRegionInsertionPoint.stepToNewCoordinate(columnStep.times(columnIndex));
            const regionSequence: T[] =
                this.createSequenceOfRegions(columnStartCenter, rowStep, segmentsPerSide, squareCreator);
            regionColumns.push(regionSequence);
        }

        return regionColumns;
    }

    private establishNeighbourRelationsInMatrix(regionMatrix: T[][]): void {
        this.establishNeighbourRelationsInRows(regionMatrix);
        this.establishNeighbourRelationsInColumns(regionMatrix);
    }


}
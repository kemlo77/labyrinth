import { Coordinate } from '../../../coordinate';
import { Grid } from '../../grid';
import { RegularShapedGridProperties } from '../regular_shaped_grids/regularshapedgridproperties';
import { RhomboidGridFactory } from '../regular_shaped_grids/rhomboidgridfactory';
import { ComplexGridFactory } from './complexgridfactory.interface';
import { ComplexGridProperties } from './complexgridproperties';

export class StarGridFactory implements ComplexGridFactory {

    createGrid(gridProperties: ComplexGridProperties): Grid {
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;
        const segmentsPerSide: number = 9;
        const insertionPoint: Coordinate = gridProperties.insertionPoint;

        const grid1: Grid = this.createRhombusGrid(insertionPoint, segmentsPerSide, cellWidth, 0);
        const grid2: Grid = this.createRhombusGrid(insertionPoint, segmentsPerSide, cellWidth, 60);
        const grid3: Grid = this.createRhombusGrid(insertionPoint, segmentsPerSide, cellWidth, 120);
        const grid4: Grid = this.createRhombusGrid(insertionPoint, segmentsPerSide, cellWidth, 180);
        const grid5: Grid = this.createRhombusGrid(insertionPoint, segmentsPerSide, cellWidth, 240);
        const grid6: Grid = this.createRhombusGrid(insertionPoint, segmentsPerSide, cellWidth, 300);

        return grid1.mergeWith(grid2).mergeWith(grid3).mergeWith(grid4).mergeWith(grid5).mergeWith(grid6);
    }

    private createRhombusGrid(
        insertionPoint: Coordinate, 
        segmentsPerSide: number, 
        cellWidth: number, 
        angle: number
    ): Grid {
        const gridProperties: RegularShapedGridProperties = 
            new RegularShapedGridProperties(insertionPoint, segmentsPerSide,cellWidth, angle);
        return new RhomboidGridFactory().createGrid(gridProperties);
    }
}

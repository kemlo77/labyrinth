import { Cell } from '../../../cell/cell';
import { CellCreatorFactory } from '../../../cell/cellcreatorfactory';
import { Grid } from '../../grid';
import type { RegularShapedGridFactory } from './regularshapedgridfactory.interface';
import { RegularShapedGridProperties } from './regularshapedgridproperties';
import { TriangularGridAssembler } from '../../gridassemblers/triangulargridassembler';
import type { RegionCreator } from '../../../typealiases';
import type { Coordinate } from '../../../coordinate';

export class TriangularGridFactory implements RegularShapedGridFactory {

    createGrid(gridProperties: RegularShapedGridProperties): Grid {
        const angle: number = gridProperties.angle;
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;

        const triangleWithPointyTopCreator: RegionCreator<Cell> = (insertionPoint: Coordinate) =>
            CellCreatorFactory.makeRegularCellCreator('equilateral-triangular-cell')(insertionPoint, cellWidth, angle);
        const triangleWithPointyBottomCreator: RegionCreator<Cell> = (insertionPoint: Coordinate) =>
            CellCreatorFactory.makeRegularCellCreator('equilateral-triangular-cell')(insertionPoint, cellWidth, angle + 60);

        return new TriangularGridAssembler<Cell>().createGrid(
            gridProperties,
            triangleWithPointyTopCreator,
            triangleWithPointyBottomCreator
        );
    }

}
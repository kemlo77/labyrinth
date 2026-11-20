import { Cell } from '../../../cell/cell';
import { CellCreatorFactory } from '../../../cell/cellcreatorfactory';
import { Grid } from '../../grid';
import type { RegularShapedGridFactory } from './regularshapedgridfactory.interface';
import { RegularShapedGridProperties } from './regularshapedgridproperties';
import { TriangularGridAssembler } from '../../gridassemblers/triangulargridassembler';
import type { RegionCreator } from '../../../typealiases';


export class TriangularGridFactory implements RegularShapedGridFactory {

    createGrid(gridProperties: RegularShapedGridProperties): Grid {
        const angle: number = gridProperties.angle;
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;

        const equilateralTriangleCreator: RegionCreator<Cell> =
            CellCreatorFactory.makeCellCreator('equilateral-triangular-cell')

        return new TriangularGridAssembler<Cell>().createGrid(
            gridProperties,
            equilateralTriangleCreator,
            equilateralTriangleCreator
        );
    }

}
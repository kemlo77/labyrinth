import { Coordinate } from '../../../coordinate';
import { Cell } from '../../cell/cell';
import { CellFactory } from '../../cell/cellfactory';
import { Grid } from '../../grid';
import type { RegularShapedGridFactory } from './regularshapedgridfactory.interface';
import { RegularShapedGridProperties } from './regularshapedgridproperties';
import { TriangularGridAssembler } from '../gridassemblers/triangulargridassembler';
import type { RegionCreator } from '../../typealiases';

export class TriangularGridFactory implements RegularShapedGridFactory {

    createGrid(gridProperties: RegularShapedGridProperties): Grid {
        const angle: number = gridProperties.angle;
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;

        const createTriangleWithPointyTop: RegionCreator<Cell> = (insertionPoint: Coordinate) =>
            CellFactory.createCell(insertionPoint, cellWidth, 'equilateral-triangular', angle);
        const createTriangleWithPointyBottom: RegionCreator<Cell> = (insertionPoint: Coordinate) =>
            CellFactory.createCell(insertionPoint, cellWidth, 'equilateral-triangular', angle + 60);

        return new TriangularGridAssembler<Cell>().createGrid(
            gridProperties,
            createTriangleWithPointyTop,
            createTriangleWithPointyBottom
        );
    }

}
import { Cell } from '../../../cell/cell';
import { CellCreatorFactory } from '../../../cell/cellcreatorfactory';
import { Grid } from '../../grid';
import type { RegularShapedGridFactory } from './regularshapedgridfactory.interface';
import { RegularShapedGridProperties } from './regularshapedgridproperties';
import { HexagonGridAssembler } from '../../gridassemblers/hexagongridassembler';
import type { RegionCreator } from '../../../typealiases';
import { GridFragmentCreatorFactory } from '../../gridfragments/gridfragmentcreatorfactory';

export class LargeHexagonGridFactory implements RegularShapedGridFactory {

    createGrid(gridProperties: RegularShapedGridProperties): Grid {
        const angle: number = gridProperties.angle;
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;

        const triangleWithPointyTopCreator: RegionCreator<Cell> =
            CellCreatorFactory.getCellCreatorByType('equilateral-triangular-cell', cellWidth, angle);
        const riangleWithPointyBottomCreator: RegionCreator<Cell> =
            CellCreatorFactory.getCellCreatorByType('equilateral-triangular-cell', cellWidth, angle + 60);

        return new HexagonGridAssembler<Cell>().createGrid(
            gridProperties,
            triangleWithPointyTopCreator,
            riangleWithPointyBottomCreator
        );
    }

    createGridWithNamedCellElements(gridProperties: RegularShapedGridProperties,
        pointyTopTriangle: string, pointyBottomTriangle?: string): Grid {
        if (!pointyBottomTriangle) {
            pointyBottomTriangle = pointyTopTriangle;
        }
        const angle: number = gridProperties.angle;
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;

        const triangleWithPointyTopCreator: RegionCreator<Cell> =
            CellCreatorFactory.getCellCreatorByType(pointyTopTriangle, cellWidth, angle);
        const triangleWithPointyBottomCreator: RegionCreator<Cell> =
            CellCreatorFactory.getCellCreatorByType(pointyBottomTriangle, cellWidth, angle + 60);

        return new HexagonGridAssembler<Cell>().createGrid(
            gridProperties,
            triangleWithPointyTopCreator,
            triangleWithPointyBottomCreator
        );
    }

    createGridWithNamedGridElements(gridProperties: RegularShapedGridProperties,
        pointyTopTriangle: string, pointyBottomTriangle?: string): Grid {
        if (!pointyBottomTriangle) {
            pointyBottomTriangle = pointyTopTriangle;
        }
        const angle: number = gridProperties.angle;
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;

        const triangleWithPointyTopCreator: RegionCreator<Grid> =
            GridFragmentCreatorFactory.getGridFragmentCreatorByType(cellWidth, pointyTopTriangle, angle);
        const triangleWithPointyBottomCreator: RegionCreator<Grid> =
            GridFragmentCreatorFactory.getGridFragmentCreatorByType(cellWidth, pointyBottomTriangle, angle + 60);

        return new HexagonGridAssembler<Grid>().createGrid(
            gridProperties,
            triangleWithPointyTopCreator,
            triangleWithPointyBottomCreator
        );
    }

}
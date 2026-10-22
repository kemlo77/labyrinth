import { Cell } from '../../../cell/cell';
import { CellCreatorFactory } from '../../../cell/cellcreatorfactory';
import { Grid } from '../../grid';
import type { RegularShapedGridFactory } from './regularshapedgridfactory.interface';
import { RegularShapedGridProperties } from './regularshapedgridproperties';
import { LargeHexagonGridAssembler } from '../gridassemblers/largehexagongridassembler';
import type { RegionCreator } from '../../../typealiases';
import { GridFragmentCreatorFactory } from '../gridfragments/gridfragmentcreatorfactory';

export class LargeHexagonGridFactory implements RegularShapedGridFactory {

    createGrid(gridProperties: RegularShapedGridProperties): Grid {
        const angle: number = gridProperties.angle;
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;

        const triangleWithPointyTopCreator: RegionCreator<Cell> =
            CellCreatorFactory.getCellCreatorByType('equilateral-triangular-cell', cellWidth, angle);
        const riangleWithPointyBottomCreator: RegionCreator<Cell> =
            CellCreatorFactory.getCellCreatorByType('equilateral-triangular-cell', cellWidth, angle + 60);

        return new LargeHexagonGridAssembler<Cell>().createGrid(
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

        return new LargeHexagonGridAssembler<Cell>().createGrid(
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
            GridFragmentCreatorFactory.createGridFragmentCreator(cellWidth, pointyTopTriangle, angle);
        const triangleWithPointyBottomCreator: RegionCreator<Grid> =
            GridFragmentCreatorFactory.createGridFragmentCreator(cellWidth, pointyBottomTriangle, angle + 60);

        return new LargeHexagonGridAssembler<Grid>().createGrid(
            gridProperties,
            triangleWithPointyTopCreator,
            triangleWithPointyBottomCreator
        );
    }

}
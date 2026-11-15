import { Cell } from '../../../cell/cell';
import { CellCreatorFactory } from '../../../cell/cellcreatorfactory';
import { Grid } from '../../grid';
import type { RegularShapedGridFactory } from './regularshapedgridfactory.interface';
import { RegularShapedGridProperties } from './regularshapedgridproperties';
import { HexagonGridAssembler } from '../../gridassemblers/hexagongridassembler';
import type { RegularRegionCreator } from '../../../typealiases';
import { GridFragmentCreatorFactory } from '../../gridfragments/gridfragmentcreatorfactory';

export class LargeHexagonGridFactory implements RegularShapedGridFactory {

    createGrid(gridProperties: RegularShapedGridProperties): Grid {

        const triangleWithPointyTopCreator: RegularRegionCreator<Cell> =
            CellCreatorFactory.makeRegularCellCreator('equilateral-triangular-cell');
        const triangleWithPointyBottomCreator: RegularRegionCreator<Cell> =
            CellCreatorFactory.makeRegularCellCreator('equilateral-triangular-cell');

        return new HexagonGridAssembler<Cell>().createGrid(
            gridProperties,
            triangleWithPointyTopCreator,
            triangleWithPointyBottomCreator
        );
    }

    createGridWithNamedCellElements(gridProperties: RegularShapedGridProperties,
        pointyTopTriangle: string, pointyBottomTriangle?: string): Grid {
        if (!pointyBottomTriangle) {
            pointyBottomTriangle = pointyTopTriangle;
        }

        const triangleWithPointyTopCreator: RegularRegionCreator<Cell> =
            CellCreatorFactory.makeRegularCellCreator(pointyTopTriangle);
        const triangleWithPointyBottomCreator: RegularRegionCreator<Cell> =
            CellCreatorFactory.makeRegularCellCreator(pointyBottomTriangle);

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

        const triangleWithPointyTopCreator: RegularRegionCreator<Grid> =
            GridFragmentCreatorFactory.makeRegularGridCreatorByType(pointyTopTriangle);
        const triangleWithPointyBottomCreator: RegularRegionCreator<Grid> =
            GridFragmentCreatorFactory.makeRegularGridCreatorByType(pointyBottomTriangle);

        return new HexagonGridAssembler<Grid>().createGrid(
            gridProperties,
            triangleWithPointyTopCreator,
            triangleWithPointyBottomCreator
        );
    }

}
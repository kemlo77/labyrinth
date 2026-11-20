import { Cell } from '../../../cell/cell';
import { CellCreatorFactory } from '../../../cell/cellcreatorfactory';
import { Grid } from '../../grid';
import type { RegularShapedGridFactory } from './regularshapedgridfactory.interface';
import { RegularShapedGridProperties } from './regularshapedgridproperties';
import { HexagonGridAssembler } from '../../gridassemblers/hexagongridassembler';
import type { RegionCreator } from '../../../typealiases';
import { GridFragmentCreatorFactory } from '../../gridfragments/gridfragmentcreatorfactory';
import type { Coordinate } from '../../../coordinate';

export class LargeHexagonGridFactory implements RegularShapedGridFactory {

    createGrid(gridProperties: RegularShapedGridProperties): Grid {

        const triangleWithPointyTopCreator: RegionCreator<Cell> =
            CellCreatorFactory.makeCellCreator('equilateral-triangular-cell');
        const triangleWithPointyBottomCreator: RegionCreator<Cell> =
            CellCreatorFactory.makeCellCreator('equilateral-triangular-cell');

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

        const triangleWithPointyTopCreator: RegionCreator<Cell> =
            CellCreatorFactory.makeCellCreator(pointyTopTriangle);
        const triangleWithPointyBottomCreator: RegionCreator<Cell> =
            CellCreatorFactory.makeCellCreator(pointyBottomTriangle);

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

        const triangleWithPointyTopCreator: RegionCreator<Grid> =
            GridFragmentCreatorFactory.makeGridCreatorByType(pointyTopTriangle)

        const triangleWithPointyBottomCreator: RegionCreator<Grid> =
            GridFragmentCreatorFactory.makeGridCreatorByType(pointyBottomTriangle)

        return new HexagonGridAssembler<Grid>().createGrid(
            gridProperties,
            triangleWithPointyTopCreator,
            triangleWithPointyBottomCreator
        );
    }

}
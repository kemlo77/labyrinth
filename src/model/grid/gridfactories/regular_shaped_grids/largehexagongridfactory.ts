import { Cell } from '../../../cell/cell';
import { CellCreatorFactory } from '../../../cell/cellcreatorfactory';
import { Grid } from '../../grid';
import type { RegularShapedGridFactory } from './regularshapedgridfactory.interface';
import { RegularShapedGridProperties } from './regularshapedgridproperties';
import { HexagonGridAssembler } from '../../gridassemblers/hexagongridassembler';
import type { RegularRegionCreator } from '../../../typealiases';
import { GridFragmentCreatorFactory } from '../../gridfragments/gridfragmentcreatorfactory';
import type { Coordinate } from '../../../coordinate';

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
            (insertionPoint: Coordinate, angleInDegrees: number, sideLength: number) => {
                return GridFragmentCreatorFactory.makeRegularGridCreatorByType(pointyTopTriangle)({ insertionPoint, angle: angleInDegrees, size: sideLength });
            };

        const triangleWithPointyBottomCreator: RegularRegionCreator<Grid> =
            (insertionPoint: Coordinate, angleInDegrees: number, sideLength: number) => {
                return GridFragmentCreatorFactory.makeRegularGridCreatorByType(pointyBottomTriangle)({ insertionPoint, angle: angleInDegrees, size: sideLength });
            };

        return new HexagonGridAssembler<Grid>().createGrid(
            gridProperties,
            triangleWithPointyTopCreator,
            triangleWithPointyBottomCreator
        );
    }

}
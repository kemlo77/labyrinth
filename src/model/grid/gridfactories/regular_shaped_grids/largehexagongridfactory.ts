import { Coordinate } from '../../../coordinate';
import { Cell } from '../../cell/cell';
import { CellFactory } from '../../cell/cellfactory';
import { Grid } from '../../grid';
import type { RegularShapedGridFactory } from './regularshapedgridfactory.interface';
import { RegularShapedGridProperties } from './regularshapedgridproperties';
import { LargeHexagonGridAssembler } from '../gridassemblers/largehexagongridassembler';
import type { RegionCreator } from '../../typealiases';
import { GridFragmentFactory } from '../gridfragments/gridfragmentfactory';

export class LargeHexagonGridFactory implements RegularShapedGridFactory {

    createGrid(gridProperties: RegularShapedGridProperties): Grid {
        const angle: number = gridProperties.angle;
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;

        const triangleWithPointyTopCreator: RegionCreator<Cell> =
            CellFactory.getCellCreatorByType('equilateral-triangular-cell', cellWidth, angle);
        const riangleWithPointyBottomCreator: RegionCreator<Cell> =
            CellFactory.getCellCreatorByType('equilateral-triangular-cell', cellWidth, angle + 60);

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
            CellFactory.getCellCreatorByType(pointyTopTriangle, cellWidth, angle);
        const triangleWithPointyBottomCreator: RegionCreator<Cell> =
            CellFactory.getCellCreatorByType(pointyBottomTriangle, cellWidth, angle + 60);

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

        const createTriangleWithPointyTop: RegionCreator<Grid> = (insertionPoint: Coordinate) =>
            GridFragmentFactory.createGridFragment(insertionPoint, cellWidth, pointyTopTriangle, angle);
        const createTriangleWithPointyBottom: RegionCreator<Grid> = (insertionPoint: Coordinate) =>
            GridFragmentFactory.createGridFragment(insertionPoint, cellWidth, pointyBottomTriangle, angle + 60);

        return new LargeHexagonGridAssembler<Grid>().createGrid(
            gridProperties,
            createTriangleWithPointyTop,
            createTriangleWithPointyBottom
        );
    }

}
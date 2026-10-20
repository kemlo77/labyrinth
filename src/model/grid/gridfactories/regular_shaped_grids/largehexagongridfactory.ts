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

        const createTriangleWithPointyTop: RegionCreator<Cell> = (insertionPoint: Coordinate) =>
            CellFactory.createCell(insertionPoint, cellWidth, 'equilateral-triangular-cell', angle);
        const createTriangleWithPointyBottom: RegionCreator<Cell> = (insertionPoint: Coordinate) =>
            CellFactory.createCell(insertionPoint, cellWidth, 'equilateral-triangular-cell', angle + 60);

        return new LargeHexagonGridAssembler<Cell>().createGrid(
            gridProperties,
            createTriangleWithPointyTop,
            createTriangleWithPointyBottom
        );
    }

    createGridWithNamedCellElements(gridProperties: RegularShapedGridProperties,
        pointyTopTriangle: string, pointyBottomTriangle?: string): Grid {
        if (!pointyBottomTriangle) {
            pointyBottomTriangle = pointyTopTriangle;
        }
        const angle: number = gridProperties.angle;
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;

        const createTriangleWithPointyTop: RegionCreator<Cell> = (insertionPoint: Coordinate) =>
            CellFactory.createCell(insertionPoint, cellWidth, pointyTopTriangle, angle);
        const createTriangleWithPointyBottom: RegionCreator<Cell> = (insertionPoint: Coordinate) =>
            CellFactory.createCell(insertionPoint, cellWidth, pointyBottomTriangle, angle + 60);

        return new LargeHexagonGridAssembler<Cell>().createGrid(
            gridProperties,
            createTriangleWithPointyTop,
            createTriangleWithPointyBottom
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
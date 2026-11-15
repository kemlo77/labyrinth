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
        const angle: number = gridProperties.angle;
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;

        const triangleWithPointyTopCreator: RegionCreator<Cell> = (insertionPoint: Coordinate) =>
            CellCreatorFactory.makeRegularCellCreator('equilateral-triangular-cell')(insertionPoint, cellWidth, angle);
        const riangleWithPointyBottomCreator: RegionCreator<Cell> = (insertionPoint: Coordinate) =>
            CellCreatorFactory.makeRegularCellCreator('equilateral-triangular-cell')(insertionPoint, cellWidth, angle + 60);

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

        const triangleWithPointyTopCreator: RegionCreator<Cell> = (insertionPoint: Coordinate) =>
            CellCreatorFactory.makeRegularCellCreator(pointyTopTriangle)(insertionPoint, cellWidth, angle);
        const triangleWithPointyBottomCreator: RegionCreator<Cell> = (insertionPoint: Coordinate) =>
            CellCreatorFactory.makeRegularCellCreator(pointyBottomTriangle)(insertionPoint, cellWidth, angle + 60);

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
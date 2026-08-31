import { Coordinate } from '../../../coordinate';
import { Cell } from '../../cell/cell';
import { CellFactory } from '../../cell/cellfactory';
import { Grid } from '../../grid';
import type { RegularShapedGridFactory } from './regularshapedgridfactory.interface';
import { RegularShapedGridProperties } from './regularshapedgridproperties';
import { HexagonalGridAssembler } from '../gridassemblers/hexagonalgridassembler';
import type { RegionCreator } from '../../typealiases';
import { GridFragmentFactory } from '../gridfragments/gridfragmentfactory';

export class HexagonalGridFactory implements RegularShapedGridFactory {

    createGrid(gridProperties: RegularShapedGridProperties): Grid {
        const angle: number = gridProperties.angle;
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;

        const createTriangleWithPointyTop: RegionCreator<Cell> = (insertionPoint: Coordinate) =>
            CellFactory.createCell(insertionPoint, cellWidth, 'equilateral-triangular', angle);
        const createTriangleWithPointyBottom: RegionCreator<Cell> = (insertionPoint: Coordinate) =>
            CellFactory.createCell(insertionPoint, cellWidth, 'equilateral-triangular', angle + 60);

        return new HexagonalGridAssembler<Cell>().createGrid(
            gridProperties,
            createTriangleWithPointyTop,
            createTriangleWithPointyBottom
        );
    }

    createKiteGrid(gridProperties: RegularShapedGridProperties): Grid {
        const angle: number = gridProperties.angle;
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;

        const createTriangleWithPointyTop: RegionCreator<Grid> = (insertionPoint: Coordinate) =>
            GridFragmentFactory.createGridFragment(insertionPoint, cellWidth, 'kite', angle);
        const createTriangleWithPointyBottom: RegionCreator<Grid> = (insertionPoint: Coordinate) =>
            GridFragmentFactory.createGridFragment(insertionPoint, cellWidth, 'kite', angle + 60);

        return new HexagonalGridAssembler<Grid>().createGrid(
            gridProperties,
            createTriangleWithPointyTop,
            createTriangleWithPointyBottom
        );
    }

    createTriakisGrid(gridProperties: RegularShapedGridProperties): Grid {
        const angle: number = gridProperties.angle;
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;

        const createTriangleWithPointyTop: RegionCreator<Grid> = (insertionPoint: Coordinate) =>
            GridFragmentFactory.createGridFragment(insertionPoint, cellWidth, 'triakis-triangle', angle);
        const createTriangleWithPointyBottom: RegionCreator<Grid> = (insertionPoint: Coordinate) =>
            GridFragmentFactory.createGridFragment(insertionPoint, cellWidth, 'triakis-triangle', angle + 60);

        return new HexagonalGridAssembler<Grid>().createGrid(
            gridProperties,
            createTriangleWithPointyTop,
            createTriangleWithPointyBottom
        );
    }

    createHalfHexagonsGrid(gridProperties: RegularShapedGridProperties): Grid {
        const angle: number = gridProperties.angle;
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;

        const createTriangleWithPointyTop: RegionCreator<Grid> = (insertionPoint: Coordinate) =>
            GridFragmentFactory.createGridFragment(insertionPoint, cellWidth, 'half-hexagon', angle);
        const createTriangleWithPointyBottom: RegionCreator<Grid> = (insertionPoint: Coordinate) =>
            GridFragmentFactory.createGridFragment(insertionPoint, cellWidth, 'half-hexagon', angle + 60);

        return new HexagonalGridAssembler<Grid>().createGrid(
            gridProperties,
            createTriangleWithPointyTop,
            createTriangleWithPointyBottom
        );
    }



}
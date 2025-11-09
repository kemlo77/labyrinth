import { Coordinate } from '../../../coordinate';
import { Cell } from '../../cell/cell';
import { CellFactory } from '../../cell/cellfactory';
import { Grid } from '../../grid';
import { RegularShapedGridFactory } from './regularshapedgridfactory.interface';
import { RegularShapedGridProperties } from './regularshapedgridproperties';
import { HexagonalGridAssembler } from '../gridassemblers/hexagonalgridassembler';
import { RegionCreator } from '../../typealiases';
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
            GridFragmentFactory.createGridFragment(insertionPoint, angle, cellWidth, 'kite');
        const createTriangleWithPointyBottom: RegionCreator<Grid> = (insertionPoint: Coordinate) =>
            GridFragmentFactory.createGridFragment(insertionPoint, angle + 60, cellWidth, 'kite');

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
            GridFragmentFactory.createGridFragment(insertionPoint, angle, cellWidth, 'triakis-triangle');
        const createTriangleWithPointyBottom: RegionCreator<Grid> = (insertionPoint: Coordinate) =>
            GridFragmentFactory.createGridFragment(insertionPoint, angle + 60, cellWidth, 'triakis-triangle');

        return new HexagonalGridAssembler<Grid>().createGrid(
            gridProperties,
            createTriangleWithPointyTop,
            createTriangleWithPointyBottom
        );
    }



}
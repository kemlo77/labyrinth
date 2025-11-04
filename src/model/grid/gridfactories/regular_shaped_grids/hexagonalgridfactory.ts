import { Coordinate } from '../../../coordinate';
import { Cell } from '../../cell/cell';
import { CellFactory } from '../../cell/cellfactory';
import { Grid } from '../../grid';
import { GridFactory } from '../gridfactory';
import { RegularShapedGridFactory } from './regularshapedgridfactory.interface';
import { RegularShapedGridProperties } from './regularshapedgridproperties';
import { HexagonalGridAssembler } from '../gridassemblers/hexagonalgridassembler';
import { RegionCreator } from '../../typealiases';
import { GridFragmentFactory } from '../gridfragments/gridfragmentfactory';

export class HexagonalGridFactory extends GridFactory implements RegularShapedGridFactory {

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
            new GridFragmentFactory().createKiteGridFragment(insertionPoint, angle, cellWidth);
        const createTriangleWithPointyBottom: RegionCreator<Grid> = (insertionPoint: Coordinate) =>
            new GridFragmentFactory().createKiteGridFragment(insertionPoint, angle + 60, cellWidth);

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
            new GridFragmentFactory().createTriakisGridFragment(insertionPoint, angle, cellWidth);
        const createTriangleWithPointyBottom: RegionCreator<Grid> = (insertionPoint: Coordinate) =>
            new GridFragmentFactory().createTriakisGridFragment(insertionPoint, angle + 60, cellWidth);

        return new HexagonalGridAssembler<Grid>().createGrid(
            gridProperties,
            createTriangleWithPointyTop,
            createTriangleWithPointyBottom
        );
    }



}
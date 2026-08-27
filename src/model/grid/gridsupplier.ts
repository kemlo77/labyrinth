import { Grid } from './grid';
import { HexagonsGridFactory } from './gridfactories/rectangular_grids/hexagonsgridfactory';
import { OctagonsGridFactory } from './gridfactories/rectangular_grids/octagonsgridfactory';
import { StandardGridFactory } from './gridfactories/rectangular_grids/standardgridfactory';
import { DiagonalSquaresGridFactory } from './gridfactories/rectangular_grids/diagonalsquaresgridfactory';
import { TrianglesGridFactory } from './gridfactories/rectangular_grids/trianglesgridfactory';
import { RunningBondGridFactory } from './gridfactories/rectangular_grids/runningbondgridfactory';
import { Coordinate } from '../coordinate';
import { RectangularGridProperties } from './gridfactories/rectangular_grids/rectangulargridproperties';
import { SwedishFlagGridFactory } from './gridfactories/complex_grids/swedishflaggridfactory';
import { ComplexGridProperties } from './gridfactories/complex_grids/complexgridproperties';
import { RegularShapedGridProperties } from './gridfactories/regular_shaped_grids/regularshapedgridproperties';
import { TriangularGridFactory }
    from './gridfactories/regular_shaped_grids/triangulargridfactory';
import { SquareGridFactory } from './gridfactories/regular_shaped_grids/squaregridfactory';
import { HexagonalGridFactory } from './gridfactories/regular_shaped_grids/hexagonalgridfactory';
import { stepRight } from '../vector/vectorcreator';
import { RhomboidGridFactory as RhomboidGridFactory } from './gridfactories/regular_shaped_grids/rhomboidgridfactory';
import { StarGridFactory } from './gridfactories/complex_grids/stargridfactory';
import { SierpinskiTriangleGridFactory } from './gridfactories/complex_grids/sierpinskitrianglegridfactory';
import { SierpinskySquareGridFactory } from './gridfactories/complex_grids/sierpinskysquaregridfactory';
import { MazeGridFactory } from './gridfactories/complex_grids/mazegridfactory';
import { TrailGridFactory } from './gridfactories/complex_grids/trailgridfactory';
import { TiltedTrailGridFactory } from './gridfactories/complex_grids/tiltedtrailgridfactory';

export class GridSupplier {

    private constructor() {
        throw new Error('This class cannot be instantiated');
    }

    static getGrid(gridType: string): Grid {

        const insertionPoint: Coordinate = new Coordinate(15, 15);
        const testInsertionPoint: Coordinate = new Coordinate(0, 0);

        if (gridType === 'test-grid') {
            const gridProperties: RectangularGridProperties =
                new RectangularGridProperties(testInsertionPoint, 3, 3, 10);
            return new StandardGridFactory().createGrid(gridProperties);
        }

        if (gridType === 'triangular') {
            const gridProperties: RegularShapedGridProperties =
                new RegularShapedGridProperties(insertionPoint, 24, 30);
            return new TriangularGridFactory().createGrid(gridProperties);
        }

        if (gridType === 'square') {
            const gridProperties: RegularShapedGridProperties =
                new RegularShapedGridProperties(insertionPoint, 20, 30);
            return new SquareGridFactory().createGrid(gridProperties);
        }

        if (gridType === 'hexagonal') {
            const numberOfEdgeSegments: number = 12;
            const lengthOfEdgeSegments: number = 30;
            const adjustedInsertionPoint: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(numberOfEdgeSegments * lengthOfEdgeSegments / 2));
            const gridProperties: RegularShapedGridProperties =
                new RegularShapedGridProperties(adjustedInsertionPoint, numberOfEdgeSegments, lengthOfEdgeSegments);
            return new HexagonalGridFactory().createGrid(gridProperties);
        }

        if (gridType === 'rhomboid') {
            const gridProperties: RegularShapedGridProperties = new RegularShapedGridProperties(insertionPoint, 21, 30);
            return new RhomboidGridFactory().createGrid(gridProperties);
        }


        if (gridType === 'standard') {
            const gridProperties: RectangularGridProperties = new RectangularGridProperties(insertionPoint, 34, 21, 30);
            return new StandardGridFactory().createGrid(gridProperties);
        }

        if (gridType === 'runningBond') {
            const gridProperties: RectangularGridProperties = new RectangularGridProperties(insertionPoint, 34, 21, 30);
            return new RunningBondGridFactory().createGrid(gridProperties);
        }

        if (gridType === 'hexagons') {
            const gridProperties: RectangularGridProperties = new RectangularGridProperties(insertionPoint, 40, 21, 30);
            return new HexagonsGridFactory().createGrid(gridProperties);
        }

        if (gridType === 'triangles') {
            const gridProperties: RectangularGridProperties = new RectangularGridProperties(insertionPoint, 34, 21, 30);
            return new TrianglesGridFactory().createGrid(gridProperties);
        }

        if (gridType === 'octagons') {
            const gridProperties: RectangularGridProperties = new RectangularGridProperties(insertionPoint, 34, 21, 30);
            return new OctagonsGridFactory().createGrid(gridProperties);
        }

        if (gridType === 'diagonalSquares') {
            const gridProperties: RectangularGridProperties = new RectangularGridProperties(insertionPoint, 34, 21, 30);
            return new DiagonalSquaresGridFactory().createGrid(gridProperties);
        }

        if (gridType === 'swedishFlag') {
            const gridProperties: ComplexGridProperties = new ComplexGridProperties(insertionPoint, 20, 0);
            return new SwedishFlagGridFactory().createGrid(gridProperties);
        }

        if (gridType === 'starGrid') {
            const adjustedInsertionPoint: Coordinate = new Coordinate(320, 320);
            const gridProperties: ComplexGridProperties = new ComplexGridProperties(adjustedInsertionPoint, 20);
            return new StarGridFactory().createGrid(gridProperties);
        }

        if (gridType === 'sierpinskiTriangle') {
            return new SierpinskiTriangleGridFactory().createGrid(insertionPoint, 6, 730);
        }

        if (gridType === 'sierpinskySquare') {
            return new SierpinskySquareGridFactory().createGrid(insertionPoint, 4, 630);
        }

        if (gridType === 'mazeInMaze') {
            return new MazeGridFactory().createGrid(insertionPoint, 9, 8, 8, 8);
        }

        if (gridType === 'spiralMaze') {
            return new TrailGridFactory().createSpiralGrid(insertionPoint, 8, 5, 12, 1, 10);
        }

        if (gridType === 'waveMaze') {
            return new TrailGridFactory().createWaveGrid(insertionPoint, 11, 7, 8, 1, 10);
        }

        if (gridType === 'tiltedSpiralMaze') {
            return new TiltedTrailGridFactory().createSpiralGrid(insertionPoint, 11, 7, 6, 1, 13);
        }
        if (gridType === 'triakisHexagonal') {
            const numberOfEdgeSegments: number = 12;
            const lengthOfEdgeSegments: number = 30;
            const adjustedInsertionPoint: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(numberOfEdgeSegments * lengthOfEdgeSegments / 2));
            const gridProperties: RegularShapedGridProperties =
                new RegularShapedGridProperties(adjustedInsertionPoint, numberOfEdgeSegments, lengthOfEdgeSegments);
            return new HexagonalGridFactory().createTriakisGrid(gridProperties);
        }

        if (gridType === 'kiteHexagonal') {
            const numberOfEdgeSegments: number = 12;
            const lengthOfEdgeSegments: number = 30;
            const adjustedInsertionPoint: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(numberOfEdgeSegments * lengthOfEdgeSegments / 2));
            const gridProperties: RegularShapedGridProperties =
                new RegularShapedGridProperties(adjustedInsertionPoint, numberOfEdgeSegments, lengthOfEdgeSegments);
            return new HexagonalGridFactory().createKiteGrid(gridProperties);
        }
        if (gridType === 'halfHexagonsInHexagon') {
            const numberOfEdgeSegments: number = 12;
            const lengthOfEdgeSegments: number = 30;
            const adjustedInsertionPoint: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(numberOfEdgeSegments * lengthOfEdgeSegments / 2));
            const gridProperties: RegularShapedGridProperties =
                new RegularShapedGridProperties(adjustedInsertionPoint, numberOfEdgeSegments, lengthOfEdgeSegments);
            return new HexagonalGridFactory().createHalfHexagonsGrid(gridProperties);
        }

        throw new Error('Invalid grid type');

    }
}

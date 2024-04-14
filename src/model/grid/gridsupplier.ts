import { Grid } from './grid';
import { HexagonalGridFactory } from './gridfactories/hexagonalgridfactory';
import { OctagonalGridFactory } from './gridfactories/octagonalgridfactory';
import { SquareGridFactory } from './gridfactories/squaregridfactory';
import { DiagonalSquareGridFactory } from './gridfactories/diagonalsquaregridfactory';
import { DiagonalSquareVariantFactory } from './gridfactories/diagonalsquarevariantfactory';
import { TriangularGridFactory } from './gridfactories/triangulargridfactory';
import { RunningBondGridFactory } from './gridfactories/runningbondgridfactory';

export class GridSupplier {

    private constructor() {
        throw new Error('This class cannot be instantiated');
    }

    static getGrid(gridType: string): Grid {

        if (gridType === 'test-grid') {
            return new SquareGridFactory().createGrid(3, 3, 15);
        }

        if (gridType === 'square') {
            return new SquareGridFactory().createGrid(69, 43, 15);
        }

        if (gridType === 'runningBond') {
            return new RunningBondGridFactory().createGrid(69, 21, 15);
        }

        if (gridType === 'hexagonal') {
            return new HexagonalGridFactory().createGrid(51, 37, 20);
        }

        if (gridType === 'triangular') {
            return new TriangularGridFactory().createGrid(81, 29, 25);
        }

        if (gridType === 'octagonal') {
            return new OctagonalGridFactory().createGrid(34, 21, 30);
        }

        if (gridType === 'diagonalSquare') {
            return new DiagonalSquareGridFactory().createGrid(31, 19, 23);
        }

        if (gridType === 'diagonalSquareVariant') {
            return new DiagonalSquareVariantFactory().createGrid(32, 32, 20);
        }

        throw new Error('Invalid grid type');

    }
}
import { Grid } from './grid';
import { HexagonalGridFactory } from './hexagonalgridfactory';
import { OctagonalGridFactory } from './octagonalgridfactory';
import { SquareGridFactory } from './squaregridfactory';
import { TriangularGridFactory } from './triangulargridfactory';

export class GridSupplier {
    static getGrid(gridType: string): Grid {

        if (gridType === 'square') {
            return new SquareGridFactory().createGrid(69, 43, 15);
        }

        if (gridType === 'hexagonal') {
            return new HexagonalGridFactory().createGrid(51, 37, 20);
        }

        if (gridType === 'triangular') {
            return new TriangularGridFactory().createGrid(102, 37, 20);
        }

        if (gridType === 'octagonal') {
            return new OctagonalGridFactory().createGrid(34, 21, 30);
        }

        throw new Error('Invalid grid type');

    }
}
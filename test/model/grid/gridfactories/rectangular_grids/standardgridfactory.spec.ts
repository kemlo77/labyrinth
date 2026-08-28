import { describe, it, expect, beforeEach } from 'vitest';
import { StandardGridFactory }
    from '../../../../../src/model/grid/gridfactories/rectangular_grids/standardgridfactory';
import { Cell } from '../../../../../src/model/grid/cell/cell';
import { Coordinate } from '../../../../../src/model/coordinate';
import { RectangularGridProperties }
    from '../../../../../src/model/grid/gridfactories/rectangular_grids/rectangulargridproperties';

describe('StandardGridFactory', () => {

    let cellMatrix: Cell[][];

    beforeEach(() => {
        const insertionPoint: Coordinate = new Coordinate(0, 0);
        const squaregridfactory: StandardGridFactory = new StandardGridFactory();
        const gridProperties: RectangularGridProperties = new RectangularGridProperties(insertionPoint, 3, 3, 10);
        cellMatrix = squaregridfactory['createCellMatrix'](gridProperties);
        squaregridfactory['establishNeighbourRelationsInMatrix'](cellMatrix);
    });

    it('verifying neighbour count', () => {
        expect(cellMatrix[0].map(cell => cell.neighbourCells.length)).to.deep.equal([2, 3, 2]);
        expect(cellMatrix[1].map(cell => cell.neighbourCells.length)).to.deep.equal([3, 4, 3]);
        expect(cellMatrix[2].map(cell => cell.neighbourCells.length)).to.deep.equal([2, 3, 2]);
    });

    it('verifying top left cell', () => {
        const topLeftCell: Cell = cellMatrix[0][0];
        expect(topLeftCell.center.x).to.equal(5);
        expect(topLeftCell.center.y).to.equal(5);
    });

    it('verifying center cell', () => {
        const centerCell: Cell = cellMatrix[1][1];
        expect(centerCell.center.x).to.equal(15);
        expect(centerCell.center.y).to.equal(15);
    });

    it('verifying right center cell', () => {
        const centerCell: Cell = cellMatrix[2][1];
        expect(centerCell.center.x).to.equal(25);
        expect(centerCell.center.y).to.equal(15);
    });

    it('totalNumberOfCells', () => {
        expect(cellMatrix.flat().length).to.equal(9);
    });

});
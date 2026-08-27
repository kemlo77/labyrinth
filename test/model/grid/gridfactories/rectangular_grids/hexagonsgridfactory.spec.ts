import { expect } from 'chai';
import { HexagonsGridFactory }
    from '../../../../../src/model/grid/gridfactories/rectangular_grids/hexagonsgridfactory';
import { Grid } from '../../../../../src/model/grid/grid';
import { Cell } from '../../../../../src/model/grid/cell/cell';
import { Coordinate } from '../../../../../src/model/coordinate';
import { RectangularGridProperties }
    from '../../../../../src/model/grid/gridfactories/rectangular_grids/rectangulargridproperties';

describe('HexagonsGridFactory', () => {

    const insertionPoint: Coordinate = new Coordinate(0, 0);
    const hexagonalgridfactory: HexagonsGridFactory = new HexagonsGridFactory();
    const gridProperties: RectangularGridProperties = new RectangularGridProperties(insertionPoint, 5, 5, 10);



    it('verifying neighbour count', () => {

        const cellMatrix: Cell[][] = hexagonalgridfactory['createCellMatrix'](gridProperties);
        hexagonalgridfactory['establishNeighbourRelationsInGrid'](cellMatrix);

        expect(cellMatrix[0].map(cell => cell.neighbourCells.length)).to.deep.equal([3, 4, 4, 4, 3]);
        expect(cellMatrix[1].map(cell => cell.neighbourCells.length)).to.deep.equal([3, 6, 6, 6, 6, 3]);
        expect(cellMatrix[2].map(cell => cell.neighbourCells.length)).to.deep.equal([5, 6, 6, 6, 5]);
        expect(cellMatrix[3].map(cell => cell.neighbourCells.length)).to.deep.equal([3, 6, 6, 6, 6, 3]);
        expect(cellMatrix[4].map(cell => cell.neighbourCells.length)).to.deep.equal([3, 4, 4, 4, 3]);
    });

    it('numberOfVisitedCells', () => {
        const rectGrid: Grid = hexagonalgridfactory.createGrid(gridProperties);
        expect(rectGrid.numberOfVisitedCells).to.equal(0);
    });

    it('totalNumberOfCells', () => {
        const rectGrid: Grid = hexagonalgridfactory.createGrid(gridProperties);
        expect(rectGrid.totalNumberOfCells).to.equal(27);
    });


});
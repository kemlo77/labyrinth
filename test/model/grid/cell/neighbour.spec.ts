import { expect } from 'chai';
import { Neighbour } from '../../../../src/model/grid/cell/neighbour';
import { Cell } from '../../../../src/model/grid/cell/cell';
import { Border } from '../../../../src/model/grid/cell/border';
import { Coordinate } from '../../../../src/model/coordinate';


describe('Neighbour', () => {
    it('should store cell and border references', () => {
        const cell: Cell = new Cell(
            new Coordinate(1, 1), [new Coordinate(2, 1), new Coordinate(2, 2), new Coordinate(1, 2)]);
        const border: Border = new Border(new Coordinate(1, 1), new Coordinate(2, 1));
        const neighbour: Neighbour = new Neighbour(cell, border);
        expect(neighbour.cell).to.equal(cell);
        expect(neighbour.commonBorder).to.equal(border);
    });
});

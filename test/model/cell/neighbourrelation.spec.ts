import { describe, it, expect } from 'vitest';
import { NeighbourRelation } from '../../../src/model/cell/neighbourrelation';
import { Cell } from '../../../src/model/cell/cell';
import { Border } from '../../../src/model/cell/border';
import { Coordinate } from '../../../src/model/coordinate';


describe('NeighbourRelation', () => {
    it('should store cell and border references', () => {
        const cell: Cell = new Cell(
            new Coordinate(1, 1), [new Coordinate(2, 1), new Coordinate(2, 2), new Coordinate(1, 2)]);
        const border: Border = new Border(new Coordinate(1, 1), new Coordinate(2, 1));
        const borders: Border[] = [border];
        const neighbour: NeighbourRelation = new NeighbourRelation(cell, borders);
        expect(neighbour.neighbourCell).to.equal(cell);
        expect(neighbour.commonBorders[0]).to.equal(border);
    });
});

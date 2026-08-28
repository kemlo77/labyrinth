import { describe, it, expect } from 'vitest';
import { Border } from '../../../../src/model/grid/cell/border';
import { Coordinate } from '../../../../src/model/coordinate';


describe('Border', () => {
    it('should create and store a border', () => {
        const start: Coordinate = new Coordinate(1, 1);
        const end: Coordinate = new Coordinate(2, 2);
        const border: Border = new Border(start, end);

        expect(border.p1).to.equal(start);
        expect(border.p2).to.equal(end);
        expect(border.isOpen).to.be.false;
        expect(border.bordersToNeighbour).to.be.false;
    });

    it('should close and open border', () => {
        const start: Coordinate = new Coordinate(1, 1);
        const end: Coordinate = new Coordinate(2, 2);
        const border: Border = new Border(start, end);

        expect(border.isOpen).to.be.false;
        expect(border.isClosed).to.be.true;
        border.open();
        expect(border.isOpen).to.be.true;
        expect(border.isClosed).to.be.false;
        border.close();
        expect(border.isOpen).to.be.false;
        expect(border.isClosed).to.be.true;
    });

    it('should check if two borders are adjacent', () => {
        const start1: Coordinate = new Coordinate(1, 1);
        const end1: Coordinate = new Coordinate(2, 2);
        const border1: Border = new Border(start1, end1);

        const start2: Coordinate = new Coordinate(1, 1);
        const end2: Coordinate = new Coordinate(2, 2);
        const border2: Border = new Border(start2, end2);

        expect(border1.isAdjacentTo(border2)).to.be.true;

        const start3: Coordinate = new Coordinate(4, 4);
        const end3: Coordinate = new Coordinate(5, 5);
        const border3: Border = new Border(start3, end3);

        expect(border1.isAdjacentTo(border3)).to.be.false;
    });

    it('it should store if it borders to neighbour', () => {
        const start: Coordinate = new Coordinate(1, 1);
        const end: Coordinate = new Coordinate(2, 2);
        const border: Border = new Border(start, end);

        expect(border.bordersToNeighbour).to.be.false;
        border.bordersToNeighbour = true;
        expect(border.bordersToNeighbour).to.be.true;
    });
});

import { expect } from 'chai';
import { Coordinate } from '../../src/model/coordinate';
import { Segment } from '../../src/model/segment';

describe('Segment', () => {

    it('should return an accurate midpoint', () => {
        const segment: Segment = new Segment(new Coordinate(0, 2), new Coordinate(10, 10));
        expect(segment.midpoint.x).to.equal(5);
        expect(segment.midpoint.y).to.equal(6);
    });

    it('should return an accurate midpoint again', () => {
        const segment: Segment = new Segment(new Coordinate(-6, -2), new Coordinate(10, 10));
        expect(segment.midpoint.x).to.equal(2);
        expect(segment.midpoint.y).to.equal(4);
    });

    it('should return an accurate length', () => {
        const segment: Segment = new Segment(new Coordinate(0, 0), new Coordinate(3, 4));
        expect(segment.length).to.equal(5);
    });

    it('should split a segment into equal pieces', () => {
        const segment: Segment = new Segment(new Coordinate(0,0), new Coordinate(4,0));
        const numberOfSugsegments: number = 4;

        const segments: Segment[] = segment.generateSubsegments(numberOfSugsegments);

        expect(segments.length).to.equal(4);
        expect(segments[0]).to.deep.equal({ p1: { x: 0, y: 0 }, p2: { x: 1, y: 0 } });
        expect(segments[1]).to.deep.equal({ p1: { x: 1, y: 0 }, p2: { x: 2, y: 0 } });
        expect(segments[2]).to.deep.equal({ p1: { x: 2, y: 0 }, p2: { x: 3, y: 0 } });
        expect(segments[3]).to.deep.equal({ p1: { x: 3, y: 0 }, p2: { x: 4, y: 0 } });
    });

});
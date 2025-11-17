import { expect } from 'chai';
import { Vector } from '../../../src/model/vector/vector';

describe('Vector', () => {

    it('should return an accurate magnitude', () => {
        const vector: Vector = new Vector(3, 4);
        expect(vector.magnitude).to.equal(5);
    });

    [
        { vector: new Vector(1, 0), expectedDirection: 0 },
        { vector: new Vector(2, 0), expectedDirection: 0 },
        { vector: new Vector(1, 1), expectedDirection: 45 },
        { vector: new Vector(0, 1), expectedDirection: 90 },
        { vector: new Vector(-1, 1), expectedDirection: 135 },
        { vector: new Vector(-1, 0), expectedDirection: 180 },
        { vector: new Vector(-1, -1), expectedDirection: 225 },
        { vector: new Vector(0, -1), expectedDirection: 270 },
        { vector: new Vector(1, -1), expectedDirection: 315 },
    ]
        .forEach(({ vector, expectedDirection }, index) => {
            it(`should return an accurate direction for case ${index + 1}`, () => {
                expect(vector.direction).to.be.closeTo(expectedDirection, 0.0001);
            });
        });

    it('should return an accurate new rotated vector', () => {
        const vector: Vector = new Vector(3, 4);
        const rotatedVector: Vector = vector.newRotatedVector(90);
        expect(rotatedVector.x).to.be.closeTo(-4, 0.0001);
        expect(rotatedVector.y).to.be.closeTo(3, 0.0001);
    });

    it('should return an accurate angle', () => {
        const vector: Vector = new Vector(3, 4);
        const otherVector: Vector = new Vector(-4, 3);
        expect(vector.hasAngleTo(otherVector)).to.be.closeTo(90, 0.0001);
    });

    it('should return an accurate angle vice versa', () => {
        const vector: Vector = new Vector(-4, 3);
        const otherVector: Vector = new Vector(3, 4);
        expect(vector.hasAngleTo(otherVector)).to.be.closeTo(270, 0.0001);
    });

    it('should return an accurate angle again', () => {
        const vector: Vector = new Vector(3, 4);
        const otherVector: Vector = new Vector(-3, -4);
        expect(vector.hasAngleTo(otherVector)).to.be.closeTo(180, 0.0001);
    });

    it('should return an accurate angle yet again', () => {
        const vector: Vector = new Vector(3, 4);
        const otherVector: Vector = new Vector(3, 4);
        expect(vector.hasAngleTo(otherVector)).to.be.closeTo(0, 0.0001);
    });

    it('should return an accurate unit vector', () => {
        const vector: Vector = new Vector(3, 4);
        const unitVector: Vector = vector.getUnitVector();
        expect(unitVector.magnitude).to.be.closeTo(1, 0.0001);
        expect(unitVector.x).to.be.closeTo(0.6, 0.0001);
        expect(unitVector.y).to.be.closeTo(0.8, 0.0001);
    });

});
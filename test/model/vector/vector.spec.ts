import { expect } from 'chai';
import { Vector } from '../../../src/model/vector/vector';

describe('Vector', () => {

    it('should return an accurate magnitude', () => {
        const vector: Vector = new Vector(3, 4);
        expect(vector.magnitude).to.equal(5);
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

    it('should return true for vectors with the same direction', () => {
        const v1: Vector = new Vector(2, 2);
        const v2: Vector = new Vector(4, 4);
        expect(v1.hasSameDirectionAs(v2)).to.be.true;
    });

    it('should return false for vectors with opposite directions', () => {
        const v1: Vector = new Vector(2, 2);
        const v2: Vector = new Vector(-2, -2);
        expect(v1.hasSameDirectionAs(v2)).to.be.false;
    });

    it('should return false if either vector is zero', () => {
        const v1: Vector = new Vector(0, 0);
        const v2: Vector = new Vector(1, 1);
        expect(v1.hasSameDirectionAs(v2)).to.be.false;
        expect(v2.hasSameDirectionAs(v1)).to.be.false;
    });

    [
        { vector: new Vector(1, 0), angleInDegrees: 0 },
        { vector: new Vector(2, 0), angleInDegrees: 0 },
        { vector: new Vector(1, 1), angleInDegrees: 45 },
        { vector: new Vector(0, 1), angleInDegrees: 90 },
        { vector: new Vector(-1, 1), angleInDegrees: 135 },
        { vector: new Vector(-1, 0), angleInDegrees: 180 },
        { vector: new Vector(-1, -1), angleInDegrees: 225 },
        { vector: new Vector(0, -1), angleInDegrees: 270 },
        { vector: new Vector(1, -1), angleInDegrees: 315 },
    ]
        .forEach(({ vector, angleInDegrees }, index) => {
            it(`should return true for vector with direction ${angleInDegrees} (case ${index + 1})`, () => {
                expect(vector.hasDirection(angleInDegrees)).to.equal(true);
            });
        });

});
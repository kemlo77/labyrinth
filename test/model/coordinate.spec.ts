import { describe, it, expect, beforeEach } from 'vitest';
import { Coordinate } from '../../src/model/coordinate';
import { Vector } from '../../src/model/vector/vector';

describe('Coordinate', () => {
    let coordinate: Coordinate;

    beforeEach(() => {
        coordinate = new Coordinate(3, 4);
    });

    it('should create a coordinate with given x and y values', () => {
        expect(coordinate.x).to.equal(3);
        expect(coordinate.y).to.equal(4);
    });

    it('should calculate the distance to another coordinate', () => {
        const otherCoordinate: Coordinate = new Coordinate(6, 8);
        const distance: number = coordinate.distanceTo(otherCoordinate);
        expect(distance).to.equal(5);
    });

    it('should not equal another coordinate', () => {
        const otherCoordinate: Coordinate = new Coordinate(6, 8);
        expect(coordinate.equals(otherCoordinate)).to.equal(false);
    });

    it('should equal another coordinate', () => {
        const otherCoordinate: Coordinate = new Coordinate(3, 4);
        expect(coordinate.equals(otherCoordinate)).to.equal(true);
    });

    it('should rotate counterclockwise', () => {
        const rotatedCoordinate: Coordinate = coordinate.rotateCounterclockwise(90);
        expect(rotatedCoordinate.x).to.be.closeTo(-4, 0.0001);
        expect(rotatedCoordinate.y).to.be.closeTo(3, 0.0001);
    });

    it('should not rotate clockwise when angle is 0', () => {
        const rotatedCoordinate: Coordinate = coordinate.rotateCounterclockwise(0);
        expect(rotatedCoordinate.x).to.equal(3);
        expect(rotatedCoordinate.y).to.equal(4);
    });

    it('should not rotate around center when angle is 0', () => {
        const center: Coordinate = new Coordinate(1, 1);
        const rotatedCoordinate: Coordinate = coordinate.rotateAroundCenter(0, center);
        expect(rotatedCoordinate.x).to.equal(3);
        expect(rotatedCoordinate.y).to.equal(4);
    });

    it('should translate', () => {
        const translatedCoordinate: Coordinate = coordinate.translate(1, 2);
        expect(translatedCoordinate.x).to.equal(4);
        expect(translatedCoordinate.y).to.equal(6);
    });

    it('should rotate around center', () => {
        const center: Coordinate = new Coordinate(1, 1);
        const rotatedCoordinate: Coordinate = coordinate.rotateAroundCenter(90, center);
        expect(rotatedCoordinate.x).to.be.closeTo(-2, 0.0001);
        expect(rotatedCoordinate.y).to.be.closeTo(3, 0.0001);
    });

    it('should clone the coordinate', () => {
        const clonedCoordinate: Coordinate = coordinate.clone();
        expect(clonedCoordinate.x).to.equal(coordinate.x);
        expect(clonedCoordinate.y).to.equal(coordinate.y);
        expect(clonedCoordinate).to.not.equal(coordinate);
    });

    it('should create a new relative coordinate (2 vectors)', () => {
        const stepVector1: Vector = new Vector(4, 0);
        const stepVector2: Vector = new Vector(0, 3);
        const relativeCoordinate: Coordinate = coordinate.stepToNewCoordinate(stepVector1, stepVector2);
        expect(relativeCoordinate.x).to.equal(7);
        expect(relativeCoordinate.y).to.equal(7);
    });

    it('should create a new relative coordinate (1 vector)', () => {
        const stepVector: Vector = new Vector(4, 3);
        const relativeCoordinate: Coordinate = coordinate.stepToNewCoordinate(stepVector);
        expect(relativeCoordinate.x).to.equal(7);
        expect(relativeCoordinate.y).to.equal(7);
    });

    it('should return the correct vector to another coordinate', () => {
        const otherCoordinate: Coordinate = new Coordinate(6, 8);
        const vector: Vector = coordinate.vectorTo(otherCoordinate);
        expect(vector.x).to.equal(3);
        expect(vector.y).to.equal(4);
    });
});

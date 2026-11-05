import { describe, it, expect } from 'vitest';
import { CellBuilder } from '../../../src/model/cell/cellbuilder';
import { Coordinate } from '../../../src/model/coordinate';
import { Vector } from '../../../src/model/vector/vector';
import { Cell } from '../../../src/model/cell/cell';

describe('CellBuilder', () => {

    it('should throw an error if starting point is missing', () => {
        const cellBuilder: CellBuilder = new CellBuilder()
            .addStepToNextVertice(new Vector(1, 0))
            .addStepToNextVertice(new Vector(1, 1))
            .defineCenter(new Coordinate(0, 0));

        expect(() => cellBuilder.build()).to.throw('Starting point is missing');
    });

    it('should throw an error if less than 2 steps added', () => {
        const cellBuilder: CellBuilder = new CellBuilder()
            .setStartingPoint(new Coordinate(0, 0))
            .addStepToNextVertice(new Vector(1, 1))
            .defineCenter(new Coordinate(0, 0));

        expect(() => cellBuilder.build()).to.throw('Less than 2 steps added');
    });

    it('should throw an error if center is missing', () => {
        const cellBuilder: CellBuilder = new CellBuilder()
            .setStartingPoint(new Coordinate(0, 0))
            .addStepToNextVertice(new Vector(1, 0))
            .addStepToNextVertice(new Vector(1, 1));

        expect(() => cellBuilder.build()).to.throw('Center is missing');
    });

    it('should throw an error if number of subdivisions per segment is less than 1', () => {
        const cellBuilder: CellBuilder = new CellBuilder()
            .setStartingPoint(new Coordinate(0, 0))
            .addStepToNextVertice(new Vector(1, 0))
            .addStepToNextVertice(new Vector(1, 1))
            .defineCenter(new Coordinate(0, 0))
            .numberOfSubdivisionsPerSegment(0);

        expect(() => cellBuilder.build()).to.throw('Number of subdivisions per segment must be at least 1');
    });

    it('should return a new Cell instance with correct center and vertices', () => {
        const startingPoint: Coordinate = new Coordinate(0, 0);
        const step1: Vector = new Vector(1, 0);
        const step2: Vector = new Vector(0, 1);
        const center: Coordinate = new Coordinate(1, 1);

        const cell: Cell = new CellBuilder()
            .setStartingPoint(startingPoint)
            .addStepToNextVertice(step1)
            .addStepToNextVertice(step2)
            .defineCenter(center)
            .build();

        const expectedVertices: Coordinate[] = [
            startingPoint,
            startingPoint.stepToNewCoordinate(step1),
            startingPoint.stepToNewCoordinate(step1).stepToNewCoordinate(step2)
        ];


        expect(cell.center).to.deep.equal(center);
        expect(cell.vertices).to.deep.equal(expectedVertices);
    });


    it('should rotate the cell around the starting point when rotation angle is set', () => {
        const startingPoint: Coordinate = new Coordinate(0, 0);
        const stepRight: Vector = new Vector(1, 0);
        const stepUp: Vector = new Vector(0, 1);
        const center: Coordinate = new Coordinate(1, 1);
        const rotationAngle: number = 90;

        const cell: Cell = new CellBuilder()
            .setStartingPoint(startingPoint)
            .addStepToNextVertice(stepRight)
            .addStepToNextVertice(stepUp)
            .defineCenter(center)
            .rotateAroundStartingPoint(rotationAngle)
            .build();

        expect(cell.center.x).toBeCloseTo(-1, 10);
        expect(cell.center.y).toBeCloseTo(1, 10);

        expect(cell.vertices[0].x).toBeCloseTo(0, 10);
        expect(cell.vertices[0].y).toBeCloseTo(0, 10);

        expect(cell.vertices[1].x).toBeCloseTo(0, 10);
        expect(cell.vertices[1].y).toBeCloseTo(1, 10);

        expect(cell.vertices[2].x).toBeCloseTo(-1, 10);
        expect(cell.vertices[2].y).toBeCloseTo(1, 10);
    });

    it('should correctly subdivide segments when number of subdivisions per segment is set', () => {
        const startingPoint: Coordinate = new Coordinate(0, 0);
        const stepRight: Vector = new Vector(2, 0);
        const stepUp: Vector = new Vector(0, 2);
        const center: Coordinate = new Coordinate(1, 1);
        const subdivisions: number = 2;

        const cell: Cell = new CellBuilder()
            .setStartingPoint(startingPoint)
            .addStepToNextVertice(stepRight)
            .addStepToNextVertice(stepUp)
            .defineCenter(center)
            .numberOfSubdivisionsPerSegment(subdivisions)
            .build();

        expect(cell.vertices.length).to.equal(6);

        expect(cell.vertices[0]).to.deep.equal(new Coordinate(0, 0));
        expect(cell.vertices[1]).to.deep.equal(new Coordinate(1, 0));
        expect(cell.vertices[2]).to.deep.equal(new Coordinate(2, 0));
        expect(cell.vertices[3]).to.deep.equal(new Coordinate(2, 1));
        expect(cell.vertices[4]).to.deep.equal(new Coordinate(2, 2));
        expect(cell.vertices[5]).to.deep.equal(new Coordinate(1, 1));
    });


});
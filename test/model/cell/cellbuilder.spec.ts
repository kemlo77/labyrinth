import { describe, it, expect } from 'vitest';
import { CellBuilder } from '../../../src/model/cell/cellbuilder';
import { Coordinate } from '../../../src/model/coordinate';
import { Vector } from '../../../src/model/vector/vector';
import { Cell } from '../../../src/model/cell/cell';

describe('CellBuilder', () => {
    describe('build', () => {
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
    });
});
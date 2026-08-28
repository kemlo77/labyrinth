import { describe, it, expect } from 'vitest';
import { CellBuilder } from '../../../../src/model/grid/cell/cellbuilder';
import { Coordinate } from '../../../../src/model/coordinate';
import { Vector } from '../../../../src/model/vector/vector';
import { Cell } from '../../../../src/model/grid/cell/cell';

describe('CellBuilder', () => {
    describe('build', () => {
        it('should throw an error if start corner is missing', () => {
            const cellBuilder: CellBuilder = new CellBuilder()
                .addStepToNextCorner(new Vector(1, 0))
                .addStepToNextCorner(new Vector(1, 1))
                .defineCenter(new Coordinate(0, 0));

            expect(() => cellBuilder.build()).to.throw('Start corner is missing');
        });

        it('should throw an error if less than 2 steps added', () => {
            const cellBuilder: CellBuilder = new CellBuilder()
                .setStartCorner(new Coordinate(0, 0))
                .addStepToNextCorner(new Vector(1, 1))
                .defineCenter(new Coordinate(0, 0));

            expect(() => cellBuilder.build()).to.throw('Less than 2 steps added');
        });

        it('should throw an error if center is missing', () => {
            const cellBuilder: CellBuilder = new CellBuilder()
                .setStartCorner(new Coordinate(0, 0))
                .addStepToNextCorner(new Vector(1, 0))
                .addStepToNextCorner(new Vector(1, 1));

            expect(() => cellBuilder.build()).to.throw('Center is missing');
        });

        it('should return a new Cell instance with correct center and corners', () => {
            const startCorner: Coordinate = new Coordinate(0, 0);
            const step1: Vector = new Vector(1, 0);
            const step2: Vector = new Vector(0, 1);
            const center: Coordinate = new Coordinate(1, 1);

            const cell: Cell = new CellBuilder()
                .setStartCorner(startCorner)
                .addStepToNextCorner(step1)
                .addStepToNextCorner(step2)
                .defineCenter(center)
                .build();

            const expectedCorners: Coordinate[] = [
                startCorner,
                startCorner.stepToNewCoordinate(step1),
                startCorner.stepToNewCoordinate(step1).stepToNewCoordinate(step2)
            ];


            expect(cell.center).to.deep.equal(center);
            expect(cell.corners).to.deep.equal(expectedCorners);
        });
    });
});
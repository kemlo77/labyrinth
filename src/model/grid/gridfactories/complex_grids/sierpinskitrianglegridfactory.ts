import { Coordinate } from '../../../coordinate';
import { Grid } from '../../grid';
import { SegmentedCellCreatorFactory } from '../../../cell/segmentedcellcreatorfactory';
import { Cell } from '../../../cell/cell';
import { stepRight, stepUp } from '../../../vector/vectorcreator';
import type { SegmentedCellCreator, OldGridCreator } from '../../../typealiases';

export class SierpinskiTriangleGridFactory {

    createGrid(
        insertionPoint: Coordinate,
        numberOfIterations: number,
        sideLength: number,
        angle: number = 0
    ): Grid {
        return this.createSierpinskiTriangle(insertionPoint, angle, sideLength, numberOfIterations);
    }

    private createSierpinskiTriangle(
        insertionPoint: Coordinate,
        angle: number,
        sideLength: number,
        iterations: number): Grid {
        const createTriangleCell: SegmentedCellCreator =
            SegmentedCellCreatorFactory.makeSegmentedCellCreator('triangular');

        if (iterations === 0) {
            const cell: Cell = createTriangleCell(insertionPoint, angle, sideLength, 1);
            return Grid.fromSingleCell(cell);
        }

        const halfWidth: number = sideLength / 2;
        const quarterWidth: number = sideLength / 4;
        const height: number = sideLength * Math.sqrt(3) / 4;

        const createSubdivision: OldGridCreator = (newInsertionPoint: Coordinate) => {
            return this.createSierpinskiTriangle(
                newInsertionPoint,
                angle,
                halfWidth,
                iterations - 1
            );
        };

        const createMiddle: OldGridCreator = (newInsertionPoint: Coordinate) => {
            const middleCell: Cell =
                createTriangleCell(newInsertionPoint, angle + 60, halfWidth, Math.pow(2, iterations - 1));
            return Grid.fromSingleCell(middleCell);
        };

        const baseMidPoint: Coordinate = insertionPoint
            .stepToNewCoordinate(stepRight(halfWidth).newRotatedVector(angle));
        const topInsertionPoint: Coordinate = insertionPoint
            .stepToNewCoordinate(stepRight(quarterWidth).thenTake(stepUp(height)).newRotatedVector(angle));

        const bottomLeft: Grid = createSubdivision(insertionPoint);
        const middle: Grid = createMiddle(baseMidPoint);
        const bottomRight: Grid = createSubdivision(baseMidPoint);
        const top: Grid = createSubdivision(topInsertionPoint);

        return bottomLeft.mergeWith(middle).mergeWith(bottomRight).mergeWith(top);
    }
}
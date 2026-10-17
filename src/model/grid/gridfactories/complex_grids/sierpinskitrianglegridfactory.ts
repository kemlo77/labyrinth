import { Coordinate } from '../../../coordinate';
import { Grid } from '../../grid';
import { AdvancedCellFactory } from '../../cell/advancedcellfactory';
import { Cell } from '../../cell/cell';
import { stepRight, stepUp } from '../../../vector/vectorcreator';
import type { GridCreator } from '../../typealiases';

export class SierpinskiTriangleGridFactory {

    createGrid(
        insertionPoint: Coordinate,
        numberOfIterations: number,
        sideLength: number,
        angle: number = 0
    ): Grid {
        return this.createSierpinskiTriangle(insertionPoint, sideLength, numberOfIterations, angle);
    }

    private createSierpinskiTriangle(
        insertionPoint: Coordinate,
        sideLength: number,
        iterations: number,
        angle: number): Grid {

        if (iterations === 0) {
            const cell: Cell = AdvancedCellFactory.createCell(insertionPoint, sideLength, 'triangular', 1, angle);
            return new Grid([cell], cell, cell);
        }

        const halfWidth: number = sideLength / 2;
        const quarterWidth: number = sideLength / 4;
        const height: number = sideLength * Math.sqrt(3) / 4;

        const createSubdivision: GridCreator = (newInsertionPoint: Coordinate) => {
            return this.createSierpinskiTriangle(
                newInsertionPoint,
                halfWidth,
                iterations - 1,
                angle
            );
        };

        const createMiddle: GridCreator = (newInsertionPoint: Coordinate) => {
            const middleCell: Cell = AdvancedCellFactory.createCell(
                newInsertionPoint,
                halfWidth,
                'triangular',
                Math.pow(2, iterations - 1),
                angle + 60
            );
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
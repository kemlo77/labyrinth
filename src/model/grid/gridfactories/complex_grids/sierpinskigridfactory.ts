import { Coordinate } from '../../../coordinate';
import { Grid } from '../../grid';
import { GridFactory } from '../gridfactory';
import { AdvancedCellFactory } from '../../cell/advancedcellfactory';
import { Cell } from '../../cell/cell';
import { stepRight, stepUp } from '../../../vector/vectorcreator';

export class SierpinskiGridFactory extends GridFactory {

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

        const halfLength: number = sideLength / 2;
        const quarterLength: number = sideLength / 4;
        const height: number = sideLength * Math.sqrt(3) / 4;

        const bottomLeft: Grid = this.createSierpinskiTriangle(
            insertionPoint,
            halfLength,
            iterations - 1,
            angle
        );

        const centerTriangle: Cell = AdvancedCellFactory.createCell(
            insertionPoint.stepToNewCoordinate(stepRight(halfLength).newRotatedVector(angle)),
            halfLength,
            'triangular',
            Math.pow(2, iterations - 1),
            angle + 60
        );
        const center: Grid = new Grid([centerTriangle], centerTriangle, centerTriangle);


        const bottomRight: Grid = this.createSierpinskiTriangle(
            insertionPoint.stepToNewCoordinate(stepRight(halfLength).newRotatedVector(angle)),
            halfLength,
            iterations - 1,
            angle
        );

        const top: Grid = this.createSierpinskiTriangle(
            insertionPoint.stepToNewCoordinate(stepRight(quarterLength).then(stepUp(height)).newRotatedVector(angle)),
            halfLength,
            iterations - 1,
            angle
        );

        return bottomLeft.mergeWith(center).mergeWith(bottomRight).mergeWith(top);
    }
}
import { Coordinate } from '../../../coordinate';
import { Cell } from '../../cell/cell';
import { Grid } from '../../grid';
import { AdvancedCellFactory } from '../../cell/advancedcellfactory';
import { stepRight, stepUp } from '../../../vector/vectorcreator';
import { GridCreator } from '../../typealiases';

export class SierpinskySquareGridFactory {

    createGrid(
        insertionPoint: Coordinate,
        numberOfIterations: number,
        sideLength: number,
        angle: number = 0
    ): Grid {
        return this.createSierpinskiSquare(insertionPoint, sideLength, numberOfIterations, angle);
    }

    private createSierpinskiSquare(
        insertionPoint: Coordinate,
        sideLength: number,
        iterations: number,
        angle: number): Grid {

        if (iterations === 0) {
            const cell: Cell = AdvancedCellFactory.createCell(insertionPoint, sideLength, 'square', 1, angle);
            return Grid.fromSingleCell(cell);
        }

        type SubCoordinateGetter = (up: number, right: number) => Coordinate;
        const getSubCoordinate: SubCoordinateGetter = (up, right) =>
            insertionPoint.stepToNewCoordinate(
                stepUp(sideLength / 3).times(up)
                    .then(stepRight(sideLength / 3).times(right))
                    .newRotatedVector(angle)
            );


        const createSubdivision: GridCreator = (newInsertionPoint: Coordinate) => {
            return this.createSierpinskiSquare(
                newInsertionPoint,
                sideLength / 3,
                iterations - 1,
                angle
            );
        };

        const createMiddle: GridCreator = (newInsertionPoint: Coordinate) => {
            const middleCell: Cell = AdvancedCellFactory.createCell(
                newInsertionPoint,
                sideLength / 3,
                'square',
                Math.pow(3, iterations - 1),
                angle
            );
            return Grid.fromSingleCell(middleCell);
        };


        const bottomLeft: Grid = createSubdivision(getSubCoordinate(0, 0));
        const bottomCenter: Grid = createSubdivision(getSubCoordinate(0, 1));
        const bottomRight: Grid = createSubdivision(getSubCoordinate(0, 2));

        const middleLeft: Grid = createSubdivision(getSubCoordinate(1, 0));
        const middleCenter: Grid = createMiddle(getSubCoordinate(1, 1));
        const middleRight: Grid = createSubdivision(getSubCoordinate(1, 2));

        const topLeft: Grid = createSubdivision(getSubCoordinate(2, 0));
        const topCenter: Grid = createSubdivision(getSubCoordinate(2, 1));
        const topRight: Grid = createSubdivision(getSubCoordinate(2, 2));


        const bottomRow: Grid = bottomLeft.mergeWith(bottomCenter).mergeWith(bottomRight);
        const middleRow: Grid = middleLeft.mergeWith(middleCenter).mergeWith(middleRight);
        const topRow: Grid = topLeft.mergeWith(topCenter).mergeWith(topRight);

        return bottomRow.mergeWith(middleRow).mergeWith(topRow);
    }

}

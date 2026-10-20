import { Coordinate } from '../../../coordinate';
import { Vector } from '../../../vector/vector';
import { stepLeft, stepRight, stepUp, stepInDirection } from '../../../vector/vectorcreator';
import { Cell } from '../../cell/cell';
import { CellFactory } from '../../cell/cellfactory';
import { Grid } from '../../grid';
import type { CellCreator } from '../../typealiases';

export class GridFragmentFactory {

    private constructor() {
        throw new Error('This class cannot be instantiated');
    }

    static createGridFragment(
        insertionPoint: Coordinate,
        sideLength: number,
        type: string,
        angle: number = 0
    ): Grid {
        switch (type) {
            case 'kite-grid-fragment-triangle':
                return GridFragmentFactory.createKiteGridFragment(insertionPoint, sideLength, angle);
            case 'triakis-grid-fragment-triangle':
                return GridFragmentFactory.createTriakisGridFragment(insertionPoint, sideLength, angle);
            case 'half-hexagon-grid-fragment-triangle':
                return GridFragmentFactory.createHalfHexagonGridFragment(insertionPoint, sideLength, angle);
            case 'reversed-half-hexagon-grid-fragment-triangle':
                return GridFragmentFactory.createReversedHalfHexagonGridFragment(insertionPoint, sideLength, angle);
            default:
                throw new Error('Unknown grid fragment type');
        }
    }

    private static createHalfHexagonGridFragment(insertionPoint: Coordinate, sideLength: number, angle: number): Grid {
        const cellBaseWidth: number = sideLength * 2 / 3;
        const cellCreator: CellCreator = (insertionPoint: Coordinate, angle?: number) =>
            CellFactory.createCell(insertionPoint, cellBaseWidth, 'half-hexagonal-cell', angle);

        return GridFragmentFactory.createTriangularGridFragment(
            insertionPoint,
            sideLength,
            angle,
            cellCreator
        );
    }

    private static createReversedHalfHexagonGridFragment(
        insertionPoint: Coordinate, sideLength: number, angle: number = 0): Grid {
        const cellBaseWidth: number = sideLength * 2 / 3;

        const cellCreator: CellCreator = (insertionPoint2: Coordinate, angle?: number) =>
            CellFactory.createCell(insertionPoint2.stepToNewCoordinate(stepInDirection(angle, cellBaseWidth / 2)),
                cellBaseWidth, 'half-hexagonal-cell', angle);

        return GridFragmentFactory.createTriangularGridFragment(
            insertionPoint,
            sideLength,
            angle,
            cellCreator
        );
    }


    private static createKiteGridFragment(insertionPoint: Coordinate, sideLength: number, angle: number): Grid {
        const cellBaseWidth: number = sideLength / 2;
        const cellCreator: CellCreator = (insertionPoint: Coordinate, angle?: number) =>
            CellFactory.createCell(insertionPoint, cellBaseWidth, 'kite-cell', angle);

        return GridFragmentFactory.createTriangularGridFragment(
            insertionPoint,
            sideLength,
            angle,
            cellCreator
        );
    }

    private static createTriakisGridFragment(insertionPoint: Coordinate, sideLength: number, angle: number): Grid {
        const cellBaseWidth: number = sideLength;
        const cellCreator: CellCreator = (insertionPoint: Coordinate, angle?: number) =>
            CellFactory.createCell(insertionPoint, cellBaseWidth, 'triakis-triangle-cell', angle);

        return GridFragmentFactory.createTriangularGridFragment(
            insertionPoint,
            sideLength,
            angle,
            cellCreator
        );

    }

    private static createTriangularGridFragment(
        insertionPoint: Coordinate,
        sideLength: number,
        angle: number,
        cellCreator: CellCreator
    ): Grid {
        const leftCorner: Coordinate = insertionPoint;
        const gridWidth: number = sideLength;
        const gridHeight: number = sideLength * Math.sqrt(3) / 2;

        const stepToRightCorner: Vector = stepRight(gridWidth).newRotatedVector(angle);
        const stepToTopCorner: Vector = stepRight(gridWidth / 2).thenTake(stepUp(gridHeight)).newRotatedVector(angle);
        const stepToGridCenter: Vector =
            stepRight(gridWidth / 2).thenTake(stepUp(gridHeight / 3)).newRotatedVector(angle);

        const rightCorner: Coordinate = leftCorner.stepToNewCoordinate(stepToRightCorner);
        const topCorner: Coordinate = leftCorner.stepToNewCoordinate(stepToTopCorner);
        const gridCenter: Coordinate = leftCorner.stepToNewCoordinate(stepToGridCenter);

        const leftCell: Cell = cellCreator(leftCorner, angle);
        const rightCell: Cell = cellCreator(rightCorner, angle + 120);
        const topCell: Cell = cellCreator(topCorner, angle + 240);

        leftCell.establishNeighbourRelationsWith(rightCell);
        rightCell.establishNeighbourRelationsWith(topCell);
        topCell.establishNeighbourRelationsWith(leftCell);

        const startCell: Cell = leftCell;
        const endCell: Cell = rightCell;
        const cells: Cell[] = [leftCell, rightCell, topCell];
        return new Grid(cells, startCell, endCell, gridCenter);
    }

}
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
        const leftCornerCellCreator: CellCreator =
            CellFactory.getCellCreatorByType('half-hexagonal-cell', cellBaseWidth, angle);
        const rightCornerCellCreator: CellCreator =
            CellFactory.getCellCreatorByType('half-hexagonal-cell', cellBaseWidth, angle + 120);
        const topCornerCellCreator: CellCreator =
            CellFactory.getCellCreatorByType('half-hexagonal-cell', cellBaseWidth, angle + 240);

        return GridFragmentFactory.createTriangularGridFragment(
            GridFragmentFactory.calculateTrianglePoints(insertionPoint, sideLength, angle),
            leftCornerCellCreator,
            rightCornerCellCreator,
            topCornerCellCreator
        );
    }

    private static createReversedHalfHexagonGridFragment(
        insertionPoint: Coordinate, sideLength: number, angle: number = 0): Grid {
        const cellBaseWidth: number = sideLength * 2 / 3;

        const leftCornerCellCreator: CellCreator =
            CellFactory.getCellCreatorByType('half-hexagonal-cell', cellBaseWidth, angle,
                stepInDirection(angle, cellBaseWidth / 2)
            );
        const rightCornerCellCreator: CellCreator =
            CellFactory.getCellCreatorByType('half-hexagonal-cell', cellBaseWidth, angle + 120,
                stepInDirection(angle + 120, cellBaseWidth / 2)
            );
        const topCornerCellCreator: CellCreator =
            CellFactory.getCellCreatorByType('half-hexagonal-cell', cellBaseWidth, angle + 240,
                stepInDirection(angle + 240, cellBaseWidth / 2)
            );

        return GridFragmentFactory.createTriangularGridFragment(
            GridFragmentFactory.calculateTrianglePoints(insertionPoint, sideLength, angle),
            leftCornerCellCreator,
            rightCornerCellCreator,
            topCornerCellCreator
        );
    }


    private static createKiteGridFragment(insertionPoint: Coordinate, sideLength: number, angle: number): Grid {
        const cellBaseWidth: number = sideLength / 2;
        const leftCornerCellCreator: CellCreator =
            CellFactory.getCellCreatorByType('kite-cell', cellBaseWidth, angle);
        const rightCornerCellCreator: CellCreator =
            CellFactory.getCellCreatorByType('kite-cell', cellBaseWidth, angle + 120);
        const topCornerCellCreator: CellCreator =
            CellFactory.getCellCreatorByType('kite-cell', cellBaseWidth, angle + 240);

        return GridFragmentFactory.createTriangularGridFragment(
            GridFragmentFactory.calculateTrianglePoints(insertionPoint, sideLength, angle),
            leftCornerCellCreator,
            rightCornerCellCreator,
            topCornerCellCreator
        );
    }

    private static createTriakisGridFragment(insertionPoint: Coordinate, sideLength: number, angle: number): Grid {
        const leftCornerCellCreator: CellCreator =
            CellFactory.getCellCreatorByType('triakis-triangle-cell', sideLength, angle);
        const rightCornerCellCreator: CellCreator =
            CellFactory.getCellCreatorByType('triakis-triangle-cell', sideLength, angle + 120);
        const topCornerCellCreator: CellCreator =
            CellFactory.getCellCreatorByType('triakis-triangle-cell', sideLength, angle + 240);

        return GridFragmentFactory.createTriangularGridFragment(
            GridFragmentFactory.calculateTrianglePoints(insertionPoint, sideLength, angle),
            leftCornerCellCreator,
            rightCornerCellCreator,
            topCornerCellCreator
        );
    }



    private static createTriangularGridFragment(
        trianglePoints: TrianglePoints,
        leftCornerCellCreator: CellCreator,
        rightCornerCellCreator: CellCreator,
        topCornerCellCreator: CellCreator
    ): Grid {
        const { leftCorner, rightCorner, topCorner, gridCenter } = trianglePoints;

        const leftCell: Cell = leftCornerCellCreator(leftCorner);
        const rightCell: Cell = rightCornerCellCreator(rightCorner);
        const topCell: Cell = topCornerCellCreator(topCorner);

        GridFragmentFactory.createNeighbourRelationsInTriangle(leftCell, rightCell, topCell);

        return GridFragmentFactory.createGrid(leftCell, rightCell, topCell, gridCenter);
    }

    private static calculateTrianglePoints(
        insertionPoint: Coordinate,
        sideLength: number,
        angle: number
    ): TrianglePoints {
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

        return new TrianglePoints(leftCorner, rightCorner, topCorner, gridCenter);
    }

    private static createNeighbourRelationsInTriangle(leftCell: Cell, rightCell: Cell, topCell: Cell): void {
        leftCell.establishNeighbourRelationsWith(rightCell);
        rightCell.establishNeighbourRelationsWith(topCell);
        topCell.establishNeighbourRelationsWith(leftCell);
    }

    private static createGrid(leftCell: Cell, rightCell: Cell, topCell: Cell, gridCenter: Coordinate): Grid {
        const startCell: Cell = leftCell;
        const endCell: Cell = rightCell;
        const cells: Cell[] = [leftCell, rightCell, topCell];
        return new Grid(cells, startCell, endCell, gridCenter);
    }

}

class TrianglePoints {
    constructor(
        public readonly leftCorner: Coordinate,
        public readonly rightCorner: Coordinate,
        public readonly topCorner: Coordinate,
        public readonly gridCenter: Coordinate
    ) {
        //
    }
}
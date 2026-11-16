import { Coordinate } from '../../coordinate';
import { Vector } from '../../vector/vector';
import { stepRight, stepUp, stepInDirection } from '../../vector/vectorcreator';
import { Cell } from '../../cell/cell';
import { CellCreatorFactory } from '../../cell/cellcreatorfactory';
import { Grid } from '../grid';
import type { CellCreator, GridCreator, RegularCellCreator, RegularGridCreator } from '../../typealiases';

export class GridFragmentCreatorFactory {

    private constructor() {
        throw new Error('This class cannot be instantiated');
    }

    static makeRegularGridCreatorByType(gridFragmentType: string): RegularGridCreator {
        switch (gridFragmentType) {
            case 'single-cell-triangle-grid-fragment':
                return GridFragmentCreatorFactory.createSingleCellGridFragment;
            case 'kite-triangle-grid-fragment':
                return GridFragmentCreatorFactory.createKiteGridFragment;
            case 'triakis-triangle-grid-fragment':
                return GridFragmentCreatorFactory.createTriakisGridFragment;
            case 'half-hexagon-triangle-grid-fragment':
                return GridFragmentCreatorFactory.createHalfHexagonGridFragment;
            case 'reversed-half-hexagon-triangle-grid-fragment':
                return GridFragmentCreatorFactory.createReversedHalfHexagonGridFragment;
            default:
                throw new Error('Unknown grid fragment type');
        }
    }

    private static createSingleCellGridFragment(insertionPoint: Coordinate, angleInDegrees: number, sideLength: number): Grid {
        const createTriangleCell: RegularCellCreator =
            CellCreatorFactory.makeRegularCellCreator('equilateral-triangular-cell');

        const cell: Cell = createTriangleCell(insertionPoint, angleInDegrees, sideLength);
        return Grid.fromSingleCell(cell);
    }

    private static createHalfHexagonGridFragment(insertionPoint: Coordinate, angleInDegrees: number, sideLength: number): Grid {
        const cellBaseWidth: number = sideLength * 2 / 3;
        const halfHexagonalCellCreator: RegularCellCreator =
            CellCreatorFactory.makeRegularCellCreator('half-hexagonal-cell');

        const trianglePoints: TrianglePoints =
            GridFragmentCreatorFactory.calculateTrianglePoints(insertionPoint, angleInDegrees, sideLength);

        return GridFragmentCreatorFactory.createTriangularGridFragment(
            trianglePoints,
            angleInDegrees,
            cellBaseWidth,
            halfHexagonalCellCreator
        );

    }

    private static createReversedHalfHexagonGridFragment(insertionPoint: Coordinate, angleInDegrees: number, sideLength: number): Grid {
        const cellBaseWidth: number = sideLength * 2 / 3;

        const halfHexagonalCellCreator: RegularCellCreator =
            CellCreatorFactory.makeRegularCellCreator('half-hexagonal-cell');

        const { leftCorner, rightCorner, topCorner, gridCenter } =
            GridFragmentCreatorFactory.calculateTrianglePoints(insertionPoint, angleInDegrees, sideLength);

        const rightCellInsertionPoint: Coordinate =
            leftCorner.stepToNewCoordinate(stepInDirection(angleInDegrees, cellBaseWidth / 2));
        const topCellInsertionPoint: Coordinate =
            rightCorner.stepToNewCoordinate(stepInDirection(angleInDegrees + 120, cellBaseWidth / 2));
        const leftCellInsertionPoint: Coordinate =
            topCorner.stepToNewCoordinate(stepInDirection(angleInDegrees + 240, cellBaseWidth / 2));

        const rightCell: Cell = halfHexagonalCellCreator(rightCellInsertionPoint, angleInDegrees + 0, cellBaseWidth); //0
        const topCell: Cell = halfHexagonalCellCreator(topCellInsertionPoint, angleInDegrees + 120, cellBaseWidth); //120
        const leftCell: Cell = halfHexagonalCellCreator(leftCellInsertionPoint, angleInDegrees + 240, cellBaseWidth); //240

        GridFragmentCreatorFactory.createNeighbourRelationsInTriangle(rightCell, topCell, leftCell);

        return GridFragmentCreatorFactory.createGrid(rightCell, topCell, leftCell, gridCenter);

    }


    private static createKiteGridFragment(insertionPoint: Coordinate, angleInDegrees: number, sideLength: number): Grid {
        const cellBaseWidth: number = sideLength / 2;
        const kiteCellCreator: RegularCellCreator = CellCreatorFactory.makeRegularCellCreator('kite-cell');

        const trianglePoints: TrianglePoints =
            GridFragmentCreatorFactory.calculateTrianglePoints(insertionPoint, angleInDegrees, sideLength);

        return GridFragmentCreatorFactory.createTriangularGridFragment(
            trianglePoints,
            angleInDegrees,
            cellBaseWidth,
            kiteCellCreator
        );
    }

    private static createTriakisGridFragment(insertionPoint: Coordinate, angleInDegrees: number, sideLength: number): Grid {
        const triakisTriangleCellCreator: RegularCellCreator = CellCreatorFactory.makeRegularCellCreator('triakis-triangle-cell');

        const trianglePoints: TrianglePoints =
            GridFragmentCreatorFactory.calculateTrianglePoints(insertionPoint, angleInDegrees, sideLength);

        return GridFragmentCreatorFactory.createTriangularGridFragment(
            trianglePoints,
            angleInDegrees,
            sideLength,
            triakisTriangleCellCreator
        );
    }

    private static createTriangularGridFragment(
        trianglePoints: TrianglePoints,
        angleInDegrees: number,
        sideLength: number,
        cellCreator: RegularCellCreator
    ): Grid {
        const { leftCorner, rightCorner, topCorner, gridCenter } = trianglePoints;

        const leftCell: Cell = cellCreator(leftCorner, angleInDegrees, sideLength);
        const rightCell: Cell = cellCreator(rightCorner, angleInDegrees + 120, sideLength);
        const topCell: Cell = cellCreator(topCorner, angleInDegrees + 240, sideLength);

        GridFragmentCreatorFactory.createNeighbourRelationsInTriangle(leftCell, rightCell, topCell);

        return GridFragmentCreatorFactory.createGrid(leftCell, rightCell, topCell, gridCenter);
    }

    private static calculateTrianglePoints(
        insertionPoint: Coordinate,
        angle: number,
        sideLength: number
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

    private static createGrid(firstCell: Cell, secondCell: Cell, thirdCell: Cell, gridCenter: Coordinate): Grid {
        const startCell: Cell = firstCell;
        const endCell: Cell = thirdCell;
        const cells: Cell[] = [firstCell, secondCell, thirdCell];
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
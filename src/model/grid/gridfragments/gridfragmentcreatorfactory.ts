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
        const leftCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('half-hexagonal-cell', cellBaseWidth, angleInDegrees);
        const rightCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('half-hexagonal-cell', cellBaseWidth, angleInDegrees + 120);
        const topCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('half-hexagonal-cell', cellBaseWidth, angleInDegrees + 240);

        return GridFragmentCreatorFactory.createTriangularGridFragment(
            GridFragmentCreatorFactory.calculateTrianglePoints(insertionPoint, sideLength, angleInDegrees),
            leftCornerCellCreator,
            rightCornerCellCreator,
            topCornerCellCreator
        );

    }

    private static createReversedHalfHexagonGridFragment(insertionPoint: Coordinate, angleInDegrees: number, sideLength: number): Grid {
        const cellBaseWidth: number = sideLength * 2 / 3;

        const rightCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('half-hexagonal-cell', cellBaseWidth, angleInDegrees);
        const topCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('half-hexagonal-cell', cellBaseWidth, angleInDegrees + 120);
        const leftCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('half-hexagonal-cell', cellBaseWidth, angleInDegrees + 240);

        const { leftCorner, rightCorner, topCorner, gridCenter } =
            GridFragmentCreatorFactory.calculateTrianglePoints(insertionPoint, sideLength, angleInDegrees);
        const rightCellInsertionPoint: Coordinate =
            leftCorner.stepToNewCoordinate(stepInDirection(angleInDegrees, cellBaseWidth / 2));
        const topCellInsertionPoint: Coordinate =
            rightCorner.stepToNewCoordinate(stepInDirection(angleInDegrees + 120, cellBaseWidth / 2));
        const leftCellInsertionPoint: Coordinate =
            topCorner.stepToNewCoordinate(stepInDirection(angleInDegrees + 240, cellBaseWidth / 2));

        const rightCell: Cell = rightCellCreator(rightCellInsertionPoint);
        const topCell: Cell = topCellCreator(topCellInsertionPoint);
        const leftCell: Cell = leftCellCreator(leftCellInsertionPoint);

        GridFragmentCreatorFactory.createNeighbourRelationsInTriangle(rightCell, topCell, leftCell);

        return GridFragmentCreatorFactory.createGrid(rightCell, topCell, leftCell, gridCenter);

    }


    private static createKiteGridFragment(insertionPoint: Coordinate, angleInDegrees: number, sideLength: number): Grid {
        const cellBaseWidth: number = sideLength / 2;
        const leftCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('kite-cell', cellBaseWidth, angleInDegrees);
        const rightCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('kite-cell', cellBaseWidth, angleInDegrees + 120);
        const topCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('kite-cell', cellBaseWidth, angleInDegrees + 240);

        return GridFragmentCreatorFactory.createTriangularGridFragment(
            GridFragmentCreatorFactory.calculateTrianglePoints(insertionPoint, sideLength, angleInDegrees),
            leftCornerCellCreator,
            rightCornerCellCreator,
            topCornerCellCreator
        );
    }

    private static createTriakisGridFragment(insertionPoint: Coordinate, angleInDegrees: number, sideLength: number): Grid {
        const leftCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('triakis-triangle-cell', sideLength, angleInDegrees);
        const rightCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('triakis-triangle-cell', sideLength, angleInDegrees + 120);
        const topCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('triakis-triangle-cell', sideLength, angleInDegrees + 240);

        return GridFragmentCreatorFactory.createTriangularGridFragment(
            GridFragmentCreatorFactory.calculateTrianglePoints(insertionPoint, sideLength, angleInDegrees),
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

        GridFragmentCreatorFactory.createNeighbourRelationsInTriangle(leftCell, rightCell, topCell);

        return GridFragmentCreatorFactory.createGrid(leftCell, rightCell, topCell, gridCenter);
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
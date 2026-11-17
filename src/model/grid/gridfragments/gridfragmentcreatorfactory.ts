import { Coordinate } from '../../coordinate';
import { Vector } from '../../vector/vector';
import { stepRight, stepUp, stepInDirection } from '../../vector/vectorcreator';
import { Cell } from '../../cell/cell';
import { CellCreatorFactory } from '../../cell/cellcreatorfactory';
import { Grid } from '../grid';
import type { GridFragmentCreator, PlacementInfo, RegularCellCreator } from '../../typealiases';

export class GridFragmentCreatorFactory {

    private constructor() {
        throw new Error('This class cannot be instantiated');
    }

    static makeRegularGridCreatorByType(gridFragmentType: string): GridFragmentCreator {
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

    private static createSingleCellGridFragment(placementInfo: PlacementInfo): Grid {
        const createTriangleCell: RegularCellCreator =
            CellCreatorFactory.makeRegularCellCreator('equilateral-triangular-cell');

        const cell: Cell = createTriangleCell(
            placementInfo.insertionPoint, placementInfo.angle, placementInfo.size);
        return Grid.fromSingleCell(cell);
    }

    private static createHalfHexagonGridFragment(placementInfo: PlacementInfo): Grid {
        const cellBaseWidth: number = placementInfo.size * 2 / 3;
        const halfHexagonalCellCreator: RegularCellCreator =
            CellCreatorFactory.makeRegularCellCreator('half-hexagonal-cell');

        return GridFragmentCreatorFactory.createTriangularGridFragment(
            placementInfo,
            cellBaseWidth,
            halfHexagonalCellCreator
        );

    }

    private static createReversedHalfHexagonGridFragment(placementInfo: PlacementInfo): Grid {
        const cellBaseWidth: number = placementInfo.size * 2 / 3;
        const angle = placementInfo.angle;

        const halfHexagonalCellCreator: RegularCellCreator =
            CellCreatorFactory.makeRegularCellCreator('half-hexagonal-cell');

        const { leftCorner, rightCorner, topCorner, gridCenter } =
            GridFragmentCreatorFactory.calculateTrianglePoints(placementInfo);

        const rightCellInsertionPoint: Coordinate =
            leftCorner.stepToNewCoordinate(stepInDirection(angle, cellBaseWidth / 2));
        const topCellInsertionPoint: Coordinate =
            rightCorner.stepToNewCoordinate(stepInDirection(angle + 120, cellBaseWidth / 2));
        const leftCellInsertionPoint: Coordinate =
            topCorner.stepToNewCoordinate(stepInDirection(angle + 240, cellBaseWidth / 2));

        const rightCell: Cell = halfHexagonalCellCreator(rightCellInsertionPoint, angle + 0, cellBaseWidth); //0
        const topCell: Cell = halfHexagonalCellCreator(topCellInsertionPoint, angle + 120, cellBaseWidth); //120
        const leftCell: Cell = halfHexagonalCellCreator(leftCellInsertionPoint, angle + 240, cellBaseWidth); //240

        GridFragmentCreatorFactory.establishNeighbourRelationsBetweenCells(rightCell, topCell, leftCell);

        return GridFragmentCreatorFactory.createGrid(rightCell, topCell, leftCell, gridCenter);

    }


    private static createKiteGridFragment(placementInfo: PlacementInfo): Grid {
        const cellBaseWidth: number = placementInfo.size / 2;
        const kiteCellCreator: RegularCellCreator = CellCreatorFactory.makeRegularCellCreator('kite-cell');

        return GridFragmentCreatorFactory.createTriangularGridFragment(
            placementInfo,
            cellBaseWidth,
            kiteCellCreator
        );
    }

    private static createTriakisGridFragment(placementInfo: PlacementInfo): Grid {
        const triakisTriangleCellCreator: RegularCellCreator = CellCreatorFactory.makeRegularCellCreator('triakis-triangle-cell');

        return GridFragmentCreatorFactory.createTriangularGridFragment(
            placementInfo,
            placementInfo.size,
            triakisTriangleCellCreator
        );
    }

    private static createTriangularGridFragment(placementInfo: PlacementInfo, sideLength: number, cellCreator: RegularCellCreator): Grid {
        const { leftCorner, rightCorner, topCorner, gridCenter } =
            GridFragmentCreatorFactory.calculateTrianglePoints(placementInfo);
        const angle = placementInfo.angle;

        const leftCell: Cell = cellCreator(leftCorner, angle, sideLength);
        const rightCell: Cell = cellCreator(rightCorner, angle + 120, sideLength);
        const topCell: Cell = cellCreator(topCorner, angle + 240, sideLength);

        GridFragmentCreatorFactory.establishNeighbourRelationsBetweenCells(leftCell, rightCell, topCell);

        return GridFragmentCreatorFactory.createGrid(leftCell, rightCell, topCell, gridCenter);
    }

    private static calculateTrianglePoints(placementInfo: PlacementInfo): TrianglePoints {
        const leftCorner: Coordinate = placementInfo.insertionPoint;
        const gridWidth: number = placementInfo.size;
        const gridHeight: number = placementInfo.size * Math.sqrt(3) / 2;
        const angle: number = placementInfo.angle;

        const stepToRightCorner: Vector = stepRight(gridWidth).newRotatedVector(angle);
        const stepToTopCorner: Vector = stepRight(gridWidth / 2).thenTake(stepUp(gridHeight)).newRotatedVector(angle);
        const stepToGridCenter: Vector =
            stepRight(gridWidth / 2).thenTake(stepUp(gridHeight / 3)).newRotatedVector(angle);

        const rightCorner: Coordinate = leftCorner.stepToNewCoordinate(stepToRightCorner);
        const topCorner: Coordinate = leftCorner.stepToNewCoordinate(stepToTopCorner);
        const gridCenter: Coordinate = leftCorner.stepToNewCoordinate(stepToGridCenter);

        return new TrianglePoints(leftCorner, rightCorner, topCorner, gridCenter);
    }

    private static establishNeighbourRelationsBetweenCells(leftCell: Cell, rightCell: Cell, topCell: Cell): void {
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
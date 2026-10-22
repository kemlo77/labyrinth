import { Coordinate } from '../../../coordinate';
import { Vector } from '../../../vector/vector';
import { stepRight, stepUp, stepInDirection } from '../../../vector/vectorcreator';
import { Cell } from '../../../cell/cell';
import { CellCreatorFactory } from '../../../cell/cellcreatorfactory';
import { Grid } from '../../grid';
import type { CellCreator, GridCreator } from '../../../typealiases';

export class GridFragmentCreatorFactory {

    private constructor() {
        throw new Error('This class cannot be instantiated');
    }

    static createGridFragment(
        insertionPoint: Coordinate,
        sideLength: number,
        type: string,
        angle: number = 0
    ): Grid {
        return GridFragmentCreatorFactory
            .createGridFragmentCreator(sideLength, type, angle)(insertionPoint);
    }

    static createGridFragmentCreator(
        sideLength: number,
        type: string,
        angle: number = 0
    ): GridCreator {
        switch (type) {
            case 'single-cell-grid-fragment-triangle':
                return GridFragmentCreatorFactory.makeSingleCellGridFragmentCreator(sideLength, angle);
            case 'kite-grid-fragment-triangle':
                return GridFragmentCreatorFactory.makeKiteGridFragmentCreator(sideLength, angle);
            case 'triakis-grid-fragment-triangle':
                return GridFragmentCreatorFactory.makeTriakisGridFragmentCreator(sideLength, angle);
            case 'half-hexagon-grid-fragment-triangle':
                return GridFragmentCreatorFactory.makeHalfHexagonGridFragmentCreator(sideLength, angle);
            case 'reversed-half-hexagon-grid-fragment-triangle':
                return GridFragmentCreatorFactory
                    .makeReversedHalfHexagonGridFragmentCreator(sideLength, angle);
            default:
                throw new Error('Unknown grid fragment type');
        }
    }

    private static makeSingleCellGridFragmentCreator(sideLength: number, angle: number): GridCreator {
        const triangleCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('equilateral-triangular-cell', sideLength, angle);
        return (insertionPoint: Coordinate) => {
            const cell: Cell = triangleCellCreator(insertionPoint);
            return new Grid([cell], cell, cell, cell.center);
        };
    }

    private static makeHalfHexagonGridFragmentCreator(sideLength: number, angle: number): GridCreator {
        const cellBaseWidth: number = sideLength * 2 / 3;
        const leftCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('half-hexagonal-cell', cellBaseWidth, angle);
        const rightCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('half-hexagonal-cell', cellBaseWidth, angle + 120);
        const topCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('half-hexagonal-cell', cellBaseWidth, angle + 240);

        return (insertionPoint: Coordinate) => GridFragmentCreatorFactory.createTriangularGridFragment(
            GridFragmentCreatorFactory.calculateTrianglePoints(insertionPoint, sideLength, angle),
            leftCornerCellCreator,
            rightCornerCellCreator,
            topCornerCellCreator
        );

    }

    private static makeReversedHalfHexagonGridFragmentCreator(sideLength: number, angle: number = 0): GridCreator {
        const cellBaseWidth: number = sideLength * 2 / 3;

        const leftCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByTypeAndAdjustInsertion('half-hexagonal-cell', cellBaseWidth, angle,
                stepInDirection(angle, cellBaseWidth / 2)
            );
        const rightCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByTypeAndAdjustInsertion('half-hexagonal-cell', cellBaseWidth, angle + 120,
                stepInDirection(angle + 120, cellBaseWidth / 2)
            );
        const topCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByTypeAndAdjustInsertion('half-hexagonal-cell', cellBaseWidth, angle + 240,
                stepInDirection(angle + 240, cellBaseWidth / 2)
            );

        return (insertionPoint: Coordinate) => GridFragmentCreatorFactory.createTriangularGridFragment(
            GridFragmentCreatorFactory.calculateTrianglePoints(insertionPoint, sideLength, angle),
            leftCornerCellCreator,
            rightCornerCellCreator,
            topCornerCellCreator
        );
    }


    private static makeKiteGridFragmentCreator(sideLength: number, angle: number): GridCreator {
        const cellBaseWidth: number = sideLength / 2;
        const leftCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('kite-cell', cellBaseWidth, angle);
        const rightCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('kite-cell', cellBaseWidth, angle + 120);
        const topCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('kite-cell', cellBaseWidth, angle + 240);

        return (insertionPoint: Coordinate) => GridFragmentCreatorFactory.createTriangularGridFragment(
            GridFragmentCreatorFactory.calculateTrianglePoints(insertionPoint, sideLength, angle),
            leftCornerCellCreator,
            rightCornerCellCreator,
            topCornerCellCreator
        );
    }

    private static makeTriakisGridFragmentCreator(sideLength: number, angle: number): GridCreator {
        const leftCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('triakis-triangle-cell', sideLength, angle);
        const rightCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('triakis-triangle-cell', sideLength, angle + 120);
        const topCornerCellCreator: CellCreator =
            CellCreatorFactory.getCellCreatorByType('triakis-triangle-cell', sideLength, angle + 240);

        return (insertionPoint: Coordinate) => GridFragmentCreatorFactory.createTriangularGridFragment(
            GridFragmentCreatorFactory.calculateTrianglePoints(insertionPoint, sideLength, angle),
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
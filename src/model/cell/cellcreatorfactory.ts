import { Coordinate } from '../coordinate';

import {
    stepDown,
    stepDownLeft,
    stepInDirection,
    stepLeft,
    stepRight,
    stepUp,
    stepUpLeft,
    stepUpRight
} from '../vector/vectorcreator';
import type { CellCreator, PlacementInfo } from '../typealiases';
import { Cell } from './cell';
import { CellBuilder } from './cellbuilder';

export class CellCreatorFactory {

    private constructor() {
        throw new Error('This class cannot be instantiated');
    }


    static makeCellCreator(cellType: string): CellCreator {
        switch (cellType) {
            case 'equilateral-triangular-cell':
                return CellCreatorFactory.crateEquilateralTriangleCell;
            case 'triangular-cell':
                return CellCreatorFactory.createTriangleCell;
            case 'left-half-triangular-cell':
                return CellCreatorFactory.createLeftHalfTriangleCell;
            case 'right-half-triangular-cell':
                return CellCreatorFactory.createRightHalfTriangleCell;
            case 'triakis-triangle-cell':
                return CellCreatorFactory.createTriakisTriangle;
            case 'isosceles-right-triangular-cell':
                return CellCreatorFactory.createIsoscelesRightTriangleCell;

            case 'square-cell':
                return CellCreatorFactory.createSquareCell;
            case 'double-square-rectangle-cell':
                return CellCreatorFactory.createDoubleSquareRectangleCell;
            case 'rhombus-cell':
                return CellCreatorFactory.createRhombusCell;
            case 'kite-cell':
                return CellCreatorFactory.createKiteCell;

            case 'hexagonal-cell':
                return CellCreatorFactory.createHexagonalCell;
            case 'half-hexagonal-cell':
                return CellCreatorFactory.createHalfHexagonalCell;
            case 'bottom-half-hexagonal-cell':
                return CellCreatorFactory.createBottomHalfHexagonalCell;
            case 'right-half-hexagonal-cell':
                return CellCreatorFactory.createRightHalfHexagonalCell;
            case 'bottom-right-quarter-hexagonal-cell':
                return CellCreatorFactory.createBottomRightQuarterHexagonalCell;
            case 'bottom-left-quarter-hexagonal-cell':
                return CellCreatorFactory.createBottomLeftQuarterHexagonalCell;

            case 'chamfered-square-cell':
                return CellCreatorFactory.createChamferedSquareCell;
            case 'semi-octagonal-semi-square-cell':
                return CellCreatorFactory.createSemiOctagonalSemiSquareCell;
            case 'octagonal-cell':
                return CellCreatorFactory.createOctagonalCell;

            default: throw new Error('Unknown cell type: ' + cellType);
        }
    }


    //Triangle that has all sides equal length
    private static crateEquilateralTriangleCell(placementInfo: PlacementInfo): Cell {
        const width: number = placementInfo.size;
        const height: number = width * Math.sqrt(3) / 2;
        const thirdHeight: number = height / 3;
        const halfWidth: number = width / 2;
        const sideLength: number = width;
        const center: Coordinate =
            placementInfo.insertionPoint
                .stepToNewCoordinate(stepRight(halfWidth)
                    .thenTake(stepUp(thirdHeight)));
        return new CellBuilder()
            .setStartingPoint(placementInfo.insertionPoint)
            .addStepToNextVertice(stepRight(sideLength))
            .addStepToNextVertice(stepInDirection(120, sideLength))
            .defineCenter(center)
            .rotateAroundStartingPoint(placementInfo.angle)
            .build();
    }

    //Triangle that has the same base width as height
    private static createTriangleCell(placementInfo: PlacementInfo): Cell {
        const width: number = placementInfo.size;
        const height: number = width;
        const thirdHeight: number = height / 3;
        const halfWidth: number = width / 2;

        const center: Coordinate =
            placementInfo.insertionPoint
                .stepToNewCoordinate(stepRight(halfWidth)
                    .thenTake(stepUp(thirdHeight)));
        return new CellBuilder()
            .setStartingPoint(placementInfo.insertionPoint)
            .addStepToNextVertice(stepRight(width))
            .addStepToNextVertice(stepUp(height).thenTake(stepLeft(width / 2)))
            .defineCenter(center)
            .rotateAroundStartingPoint(placementInfo.angle)
            .build();
    }

    private static createLeftHalfTriangleCell(placementInfo: PlacementInfo): Cell {
        const width: number = placementInfo.size;
        const height: number = width;
        const thirdHeight: number = height / 3;
        const halfWidth: number = width / 2;
        const sixthOfWidth: number = width / 6;

        const center: Coordinate =
            placementInfo.insertionPoint
                .stepToNewCoordinate(stepRight(sixthOfWidth)
                    .thenTake(stepUp(thirdHeight)));
        return new CellBuilder()
            .setStartingPoint(placementInfo.insertionPoint)
            .addStepToNextVertice(stepRight(halfWidth))
            .addStepToNextVertice(stepUp(height))
            .defineCenter(center)
            .rotateAroundStartingPoint(placementInfo.angle)
            .build();
    }

    private static createRightHalfTriangleCell(placementInfo: PlacementInfo): Cell {
        const width: number = placementInfo.size;
        const height: number = width;
        const thirdHeight: number = height / 3;
        const halfWidth: number = width / 2;
        const thirdOfWidth: number = width / 3;

        const center: Coordinate =
            placementInfo.insertionPoint
                .stepToNewCoordinate(stepRight(thirdOfWidth)
                    .thenTake(stepUp(thirdHeight)));
        return new CellBuilder()
            .setStartingPoint(placementInfo.insertionPoint)
            .addStepToNextVertice(stepRight(halfWidth))
            .addStepToNextVertice(stepUp(height).thenTake(stepLeft(halfWidth)))
            .defineCenter(center)
            .rotateAroundStartingPoint(placementInfo.angle)
            .build();
    }

    private static createSquareCell(placementInfo: PlacementInfo): Cell {
        const width: number = placementInfo.size;
        const height: number = width;

        const center: Coordinate =
            placementInfo.insertionPoint
                .stepToNewCoordinate(stepRight(width / 2)
                    .thenTake(stepUp(height / 2)));
        return new CellBuilder()
            .setStartingPoint(placementInfo.insertionPoint)
            .addStepToNextVertice(stepRight(width))
            .addStepToNextVertice(stepUp(width))
            .addStepToNextVertice(stepLeft(width))
            .defineCenter(center)
            .rotateAroundStartingPoint(placementInfo.angle)
            .build();
    }

    private static createDoubleSquareRectangleCell(placementInfo: PlacementInfo): Cell {
        const width: number = placementInfo.size;
        const height: number = width / 2;
        const halfWidth: number = width / 2;

        const center: Coordinate =
            placementInfo.insertionPoint
                .stepToNewCoordinate(stepRight(halfWidth)
                    .thenTake(stepUp(height / 2)));
        return new CellBuilder()
            .setStartingPoint(placementInfo.insertionPoint)
            .addStepsToNextVertice(2, stepRight(halfWidth))
            .addStepToNextVertice(stepUp(height))
            .addStepsToNextVertice(2, stepLeft(halfWidth))
            .defineCenter(center)
            .rotateAroundStartingPoint(placementInfo.angle)
            .build();
    }

    private static createIsoscelesRightTriangleCell(placementInfo: PlacementInfo): Cell {
        const width: number = placementInfo.size;
        const height: number = width;
        const hypotenuseLength: number = Math.hypot(width, height);

        const center: Coordinate =
            placementInfo.insertionPoint
                .stepToNewCoordinate(stepRight(width / 3)
                    .thenTake(stepUp(height / 3)));
        return new CellBuilder()
            .setStartingPoint(placementInfo.insertionPoint)
            .addStepToNextVertice(stepRight(width))
            .addStepToNextVertice(stepUpLeft(hypotenuseLength))
            .defineCenter(center)
            .rotateAroundStartingPoint(placementInfo.angle)
            .build();
    }

    private static createHexagonalCell(placementInfo: PlacementInfo): Cell {
        const width: number = placementInfo.size;
        // width = sideLength * 2;
        const height: number = width * Math.sqrt(3);

        const center: Coordinate =
            placementInfo.insertionPoint
                .stepToNewCoordinate(stepRight(width / 2)
                    .thenTake(stepUp(height / 2)));
        return new CellBuilder()
            .setStartingPoint(placementInfo.insertionPoint)
            .addStepToNextVertice(stepInDirection(0, width))
            .addStepToNextVertice(stepInDirection(60, width))
            .addStepToNextVertice(stepInDirection(120, width))
            .addStepToNextVertice(stepInDirection(180, width))
            .addStepToNextVertice(stepInDirection(240, width))
            .defineCenter(center)
            .rotateAroundStartingPoint(placementInfo.angle)
            .build();
    }

    private static createRightHalfHexagonalCell(placementInfo: PlacementInfo): Cell {
        const width: number = placementInfo.size;
        // width = sideLength * 2;
        const height: number = width * Math.sqrt(3);

        const center: Coordinate =
            placementInfo.insertionPoint
                .stepToNewCoordinate(stepRight(width / 4)
                    .thenTake(stepUp(height / 2)));

        return new CellBuilder()
            .setStartingPoint(placementInfo.insertionPoint)
            .addStepToNextVertice(stepInDirection(0, width / 2))
            .addStepToNextVertice(stepInDirection(60, width))
            .addStepToNextVertice(stepInDirection(120, width))
            .addStepToNextVertice(stepInDirection(180, width / 2))
            .defineCenter(center)
            .rotateAroundStartingPoint(placementInfo.angle)
            .build();
    }

    private static createBottomHalfHexagonalCell(placementInfo: PlacementInfo): Cell {
        const width: number = placementInfo.size;

        const doubleWidth: number = width * 2;
        const height: number = width * Math.sqrt(3);

        const center: Coordinate =
            placementInfo.insertionPoint
                .stepToNewCoordinate(stepRight(width / 2)
                    .thenTake(stepUp(height / 4)));

        return new CellBuilder()
            .setStartingPoint(placementInfo.insertionPoint)
            .addStepToNextVertice(stepInDirection(0, width))
            .addStepToNextVertice(stepInDirection(60, width))
            .addStepToNextVertice(stepInDirection(180, doubleWidth))
            .defineCenter(center)
            .rotateAroundStartingPoint(placementInfo.angle)
            .build();
    }

    private static createBottomRightQuarterHexagonalCell(placementInfo: PlacementInfo): Cell {
        const width: number = placementInfo.size;
        // width = sideLength * 2;
        const height: number = width * Math.sqrt(3);

        const center: Coordinate =
            placementInfo.insertionPoint
                .stepToNewCoordinate(stepRight(width / 4)
                    .thenTake(stepUp(height / 4)));

        return new CellBuilder()
            .setStartingPoint(placementInfo.insertionPoint)
            .addStepToNextVertice(stepInDirection(0, width / 2))
            .addStepToNextVertice(stepInDirection(60, width))
            .addStepToNextVertice(stepInDirection(180, width))
            .defineCenter(center)
            .rotateAroundStartingPoint(placementInfo.angle)
            .build();
    }

    private static createBottomLeftQuarterHexagonalCell(placementInfo: PlacementInfo): Cell {
        const width: number = placementInfo.size;
        // width = sideLength * 2;
        const height: number = width * Math.sqrt(3);

        const center: Coordinate =
            placementInfo.insertionPoint
                .stepToNewCoordinate(stepRight(width / 4)
                    .thenTake(stepUp(height / 4)));

        return new CellBuilder()
            .setStartingPoint(placementInfo.insertionPoint)
            .addStepToNextVertice(stepInDirection(0, width / 2))
            .addStepToNextVertice(stepInDirection(90, height / 2))
            .addStepToNextVertice(stepInDirection(180, width))
            .defineCenter(center)
            .rotateAroundStartingPoint(placementInfo.angle)
            .build();
    }

    private static createHalfHexagonalCell(placementInfo: PlacementInfo): Cell {
        const width: number = placementInfo.size;
        const sideLength: number = width / 2;
        const height: number = sideLength * Math.sqrt(3);


        const center: Coordinate =
            placementInfo.insertionPoint
                .stepToNewCoordinate(stepRight(sideLength / 2)
                    .thenTake(stepUp(height / 4)));

        return new CellBuilder()
            .setStartingPoint(placementInfo.insertionPoint)
            .addStepToNextVertice(stepInDirection(0, sideLength))
            .addStepToNextVertice(stepInDirection(0, sideLength))
            .addStepToNextVertice(stepInDirection(120, sideLength))
            .addStepToNextVertice(stepInDirection(180, sideLength))
            .defineCenter(center)
            .rotateAroundStartingPoint(placementInfo.angle)
            .build();
    }

    private static createChamferedSquareCell(placementInfo: PlacementInfo): Cell {
        const width: number = placementInfo.size;
        const height: number = width;
        const sideLength: number = width / (1 + Math.SQRT2);

        const center: Coordinate =
            placementInfo.insertionPoint
                .stepToNewCoordinate(stepRight(sideLength / 2)
                    .thenTake(stepUp(height / 2)));
        const cell: Cell = new CellBuilder()
            .setStartingPoint(placementInfo.insertionPoint)
            .addStepToNextVertice(stepRight(width))
            .addStepToNextVertice(stepUp(width / 2 + sideLength / 2))
            .addStepToNextVertice(stepUpLeft(sideLength))
            .addStepToNextVertice(stepLeft(width / 2 + sideLength / 2))
            .defineCenter(center)
            .build();

        if (placementInfo.angle === 0) {
            return cell;
        }
        return cell.rotateAroundCoordinate(placementInfo.angle, placementInfo.insertionPoint);
    }

    private static createSemiOctagonalSemiSquareCell(placementInfo: PlacementInfo): Cell {
        const width: number = placementInfo.size;
        const height: number = width;
        const sideLength: number = width / (1 + Math.SQRT2);

        const center: Coordinate =
            placementInfo.insertionPoint
                .stepToNewCoordinate(stepRight(sideLength / 2)
                    .thenTake(stepUp(height / 2)));
        const cell: Cell = new CellBuilder()
            .setStartingPoint(placementInfo.insertionPoint)
            .addStepToNextVertice(stepRight(width / 2 + sideLength / 2))
            .addStepToNextVertice(stepUpRight(sideLength))
            .addStepToNextVertice(stepUp(sideLength))
            .addStepToNextVertice(stepUpLeft(sideLength))
            .addStepToNextVertice(stepLeft(width / 2 + sideLength / 2))
            .defineCenter(center)
            .build();

        if (placementInfo.angle === 0) {
            return cell;
        }
        return cell.rotateAroundCoordinate(placementInfo.angle, placementInfo.insertionPoint);
    }

    private static createOctagonalCell(placementInfo: PlacementInfo): Cell {
        const width: number = placementInfo.size;
        const height: number = width;
        const sideLength: number = width / (1 + Math.SQRT2);
        const center: Coordinate =
            placementInfo.insertionPoint
                .stepToNewCoordinate(stepRight(sideLength / 2)
                    .thenTake(stepUp(height / 2)));
        const cell: Cell = new CellBuilder()
            .setStartingPoint(placementInfo.insertionPoint)
            .addStepToNextVertice(stepRight(sideLength))
            .addStepToNextVertice(stepUpRight(sideLength))
            .addStepToNextVertice(stepUp(sideLength))
            .addStepToNextVertice(stepUpLeft(sideLength))
            .addStepToNextVertice(stepLeft(sideLength))
            .addStepToNextVertice(stepDownLeft(sideLength))
            .addStepToNextVertice(stepDown(sideLength))
            .defineCenter(center)
            .build();

        if (placementInfo.angle === 0) {
            return cell;
        }
        return cell.rotateAroundCoordinate(placementInfo.angle, placementInfo.insertionPoint);

    }

    private static createRhombusCell(placementInfo: PlacementInfo): Cell {
        const width: number = placementInfo.size;
        const sideLength: number = width;

        const center: Coordinate =
            placementInfo.insertionPoint.stepToNewCoordinate(
                stepRight(sideLength)
                    .thenTake(stepInDirection(120, sideLength / 2))
            );
        return new CellBuilder()
            .setStartingPoint(placementInfo.insertionPoint)
            .addStepToNextVertice(stepRight(sideLength))
            .addStepToNextVertice(stepInDirection(60, sideLength))
            .addStepToNextVertice(stepLeft(sideLength))
            .defineCenter(center)
            .rotateAroundStartingPoint(placementInfo.angle)
            .build();
    }

    private static createKiteCell(placementInfo: PlacementInfo): Cell {
        const width: number = placementInfo.size;
        const sideLength1: number = width;
        const sideLength2: number = width / (Math.sqrt(3));

        const center: Coordinate =
            placementInfo.insertionPoint
                .stepToNewCoordinate(stepRight(sideLength1 / 2)
                    .thenTake(stepUp(sideLength2 / 2)));
        return new CellBuilder()
            .setStartingPoint(placementInfo.insertionPoint)
            .addStepToNextVertice(stepRight(sideLength1))
            .addStepToNextVertice(stepUp(sideLength2))
            .addStepToNextVertice(stepInDirection(150, sideLength2))
            .defineCenter(center)
            .rotateAroundStartingPoint(placementInfo.angle)
            .build();

    }

    private static createTriakisTriangle(placementInfo: PlacementInfo): Cell {
        const width: number = placementInfo.size;
        const height: number = width / (2 * Math.sqrt(3));
        const center: Coordinate =
            placementInfo.insertionPoint
                .stepToNewCoordinate(stepRight(width / 2)
                    .thenTake(stepUp(height / 3)));
        return new CellBuilder()
            .setStartingPoint(placementInfo.insertionPoint)
            .addStepToNextVertice(stepRight(width))
            .addStepToNextVertice(stepUp(height).thenTake(stepLeft(width / 2)))
            .defineCenter(center)
            .rotateAroundStartingPoint(placementInfo.angle)
            .build();

    }

}

import { Coordinate } from '../coordinate';
import { Vector } from '../vector/vector';

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
import type { CellCreator } from '../typealiases';
import { Cell } from './cell';
import { CellBuilder } from './cellbuilder';

export class CellCreatorFactory {

    private constructor() {
        throw new Error('This class cannot be instantiated');
    }

    static createCell(
        insertionPoint: Coordinate,
        width: number,
        type: string,
        angleInDegrees: number = 0
    ): Cell {
        return CellCreatorFactory.getCellCreatorByType(type, width, angleInDegrees)(insertionPoint);
    }

    static getCellCreatorByTypeAndAdjustInsertion(
        type: string, cellWidth: number, angle: number, insertionAdjustmentStep: Vector): CellCreator {
        if (!insertionAdjustmentStep) {
            insertionAdjustmentStep = new Vector(0, 0);
        }

        return (insertionPoint: Coordinate) => {
            const adjustedInsertionStep: Coordinate = insertionPoint.stepToNewCoordinate(insertionAdjustmentStep);
            return CellCreatorFactory.getCellCreatorByType(type, cellWidth, angle)(adjustedInsertionStep);
        };


    }

    static getCellCreatorByType(type: string, cellWidth: number, angle: number): CellCreator {

        switch (type) {

            case 'equilateral-triangular-cell':
                return CellCreatorFactory.makeEquilateralTriangleCellCreator(cellWidth, angle);
            case 'triangular-cell':
                return CellCreatorFactory.makeTriangleCellCreator(cellWidth, angle);
            case 'left-half-triangular-cell':
                return CellCreatorFactory.makeLeftHalfTriangleCellCreator(cellWidth, angle);
            case 'right-half-triangular-cell':
                return CellCreatorFactory.makeRightHalfTriangleCellCreator(cellWidth, angle);
            case 'triakis-triangle-cell':
                return CellCreatorFactory.makeTriakisTriangleCreator(cellWidth, angle);
            case 'isosceles-right-triangular-cell':
                return CellCreatorFactory.makeIsoscelesRightTriangleCellCreator(cellWidth, angle);

            case 'square-cell':
                return CellCreatorFactory.makeSquareCellCreator(cellWidth, angle);
            case 'double-square-rectangle-cell':
                return CellCreatorFactory.makeDoubleSquareRectangleCellCreator(cellWidth, angle);
            case 'rhombus-cell':
                return CellCreatorFactory.makeRhombusCellCreator(cellWidth, angle);
            case 'kite-cell':
                return CellCreatorFactory.makeKiteCellCreator(cellWidth, angle);

            case 'hexagonal-cell':
                return CellCreatorFactory.makeHexagonalCellCreator(cellWidth, angle);
            case 'half-hexagonal-cell':
                return CellCreatorFactory.makeHalfHexagonalCellCreator(cellWidth, angle);
            case 'bottom-half-hexagonal-cell':
                return CellCreatorFactory.makeBottomHalfHexagonalCellCreator(cellWidth, angle);
            case 'right-half-hexagonal-cell':
                return CellCreatorFactory.makeRightHalfHexagonalCellCreator(cellWidth, angle);
            case 'bottom-right-quarter-hexagonal-cell':
                return CellCreatorFactory.makeBottomRightQuarterHexagonalCellCreator(cellWidth, angle);
            case 'bottom-left-quarter-hexagonal-cell':
                return CellCreatorFactory.makeBottomLeftQuarterHexagonalCellCreator(cellWidth, angle);

            case 'chamfered-square-cell':
                return CellCreatorFactory.makeChamferedSquareCellCreator(cellWidth, angle);
            case 'semi-octagonal-semi-square-cell':
                return CellCreatorFactory.makeSemiOctagonalSemiSquareCellCreator(cellWidth, angle);
            case 'octagonal-cell':
                return CellCreatorFactory.makeOctagonalCellCreator(cellWidth, angle);

            default: throw new Error('Unknown cell type: ' + type);
        }
    }


    //Triangle that has all sides equal length
    private static makeEquilateralTriangleCellCreator(width: number, angle: number): CellCreator {
        const height: number = width * Math.sqrt(3) / 2;
        const thirdHeight: number = height / 3;
        const halfWidth: number = width / 2;
        const sideLength: number = width;
        return (insertionPoint: Coordinate) => {
            const center: Coordinate = insertionPoint.stepToNewCoordinate(stepRight(halfWidth)
                .thenTake(stepUp(thirdHeight)));
            return new CellBuilder()
                .setStartCorner(insertionPoint)
                .addStepToNextCorner(stepRight(sideLength))
                .addStepToNextCorner(stepInDirection(120, sideLength))
                .defineCenter(center)
                .rotateAroundStartCorner(angle)
                .build();
        };
    }

    //Triangle that has same width and height
    private static makeTriangleCellCreator(width: number, angle: number): CellCreator {
        const height: number = width;
        const thirdHeight: number = height / 3;
        const halfWidth: number = width / 2;
        return (insertionPoint: Coordinate) => {
            const center: Coordinate = insertionPoint.stepToNewCoordinate(stepRight(halfWidth)
                .thenTake(stepUp(thirdHeight)));
            return new CellBuilder()
                .setStartCorner(insertionPoint)
                .addStepToNextCorner(stepRight(width))
                .addStepToNextCorner(stepUp(height).thenTake(stepLeft(width / 2)))
                .defineCenter(center)
                .rotateAroundStartCorner(angle)
                .build();
        };
    }

    private static makeLeftHalfTriangleCellCreator(width: number, angle: number): CellCreator {
        const height: number = width;
        const thirdHeight: number = height / 3;
        const halfWidth: number = width / 2;
        const sixthOfWidth: number = width / 6;
        return (insertionPoint: Coordinate) => {
            const center: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(sixthOfWidth).thenTake(stepUp(thirdHeight)));
            return new CellBuilder()
                .setStartCorner(insertionPoint)
                .addStepToNextCorner(stepRight(halfWidth))
                .addStepToNextCorner(stepUp(height))
                .defineCenter(center)
                .rotateAroundStartCorner(angle)
                .build();
        };
    }

    private static makeRightHalfTriangleCellCreator(width: number, angle: number): CellCreator {
        const height: number = width;
        const thirdHeight: number = height / 3;
        const halfWidth: number = width / 2;
        const thirdOfWidth: number = width / 3;

        return (insertionPoint: Coordinate) => {
            const center: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(thirdOfWidth).thenTake(stepUp(thirdHeight)));
            return new CellBuilder()
                .setStartCorner(insertionPoint)
                .addStepToNextCorner(stepRight(halfWidth))
                .addStepToNextCorner(stepUp(height).thenTake(stepLeft(halfWidth)))
                .defineCenter(center)
                .rotateAroundStartCorner(angle)
                .build();
        };
    }

    private static makeSquareCellCreator(width: number, angle: number): CellCreator {
        const height: number = width;

        return (insertionPoint: Coordinate) => {
            const center: Coordinate = insertionPoint.stepToNewCoordinate(stepRight(width / 2)
                .thenTake(stepUp(height / 2)));
            return new CellBuilder()
                .setStartCorner(insertionPoint)
                .addStepToNextCorner(stepRight(width))
                .addStepToNextCorner(stepUp(width))
                .addStepToNextCorner(stepLeft(width))
                .defineCenter(center)
                .rotateAroundStartCorner(angle)
                .build();
        };
    }

    private static makeDoubleSquareRectangleCellCreator(width: number, angle: number): CellCreator {
        const height: number = width / 2;
        return (insertionPoint: Coordinate) => {
            const center: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(width / 2).thenTake(stepUp(height / 2)));
            return new CellBuilder()
                .setStartCorner(insertionPoint)
                .addStepToNextCorner(stepRight((width / 2)))
                .addStepToNextCorner(stepRight((width / 2)))
                .addStepToNextCorner(stepUp(height))
                .addStepToNextCorner(stepLeft((width / 2)))
                .addStepToNextCorner(stepLeft((width / 2)))
                .defineCenter(center)
                .rotateAroundStartCorner(angle)
                .build();
        };
    }

    private static makeIsoscelesRightTriangleCellCreator(width: number, angle: number): CellCreator {
        const height: number = width;
        const hypotenuseLength: number = Math.hypot(width, height);

        return (insertionPoint: Coordinate) => {
            const center: Coordinate = insertionPoint.stepToNewCoordinate(stepRight(width / 3)
                .thenTake(stepUp(height / 3)));
            return new CellBuilder()
                .setStartCorner(insertionPoint)
                .addStepToNextCorner(stepRight(width))
                .addStepToNextCorner(stepUpLeft(hypotenuseLength))
                .defineCenter(center)
                .rotateAroundStartCorner(angle)
                .build();
        };
    }

    private static makeHexagonalCellCreator(sideLength: number, angle: number): CellCreator {
        // width = sideLength * 2;
        const height: number = sideLength * Math.sqrt(3);

        return (insertionPoint: Coordinate) => {
            const center: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(sideLength / 2).thenTake(stepUp(height / 2)));
            return new CellBuilder()
                .setStartCorner(insertionPoint)
                .addStepToNextCorner(stepInDirection(0, sideLength))
                .addStepToNextCorner(stepInDirection(60, sideLength))
                .addStepToNextCorner(stepInDirection(120, sideLength))
                .addStepToNextCorner(stepInDirection(180, sideLength))
                .addStepToNextCorner(stepInDirection(240, sideLength))
                .defineCenter(center)
                .rotateAroundStartCorner(angle)
                .build();
        };
    }

    private static makeRightHalfHexagonalCellCreator(sideLength: number, angle: number): CellCreator {
        // width = sideLength * 2;
        const height: number = sideLength * Math.sqrt(3);

        return (insertionPoint: Coordinate) => {
            const center: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(sideLength / 4).thenTake(stepUp(height / 2)));

            return new CellBuilder()
                .setStartCorner(insertionPoint)
                .addStepToNextCorner(stepInDirection(0, sideLength / 2))
                .addStepToNextCorner(stepInDirection(60, sideLength))
                .addStepToNextCorner(stepInDirection(120, sideLength))
                .addStepToNextCorner(stepInDirection(180, sideLength / 2))
                .defineCenter(center)
                .rotateAroundStartCorner(angle)
                .build();
        };
    }

    private static makeBottomHalfHexagonalCellCreator(sideLength: number, angle: number): CellCreator {
        const width: number = sideLength * 2;
        const height: number = sideLength * Math.sqrt(3);

        return (insertionPoint: Coordinate) => {
            const center: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(sideLength / 2).thenTake(stepUp(height / 4)));

            return new CellBuilder()
                .setStartCorner(insertionPoint)
                .addStepToNextCorner(stepInDirection(0, sideLength))
                .addStepToNextCorner(stepInDirection(60, sideLength))
                .addStepToNextCorner(stepInDirection(180, width))
                .defineCenter(center)
                .rotateAroundStartCorner(angle)
                .build();
        };
    }

    private static makeBottomRightQuarterHexagonalCellCreator(sideLength: number, angle: number): CellCreator {
        // width = sideLength * 2;
        const height: number = sideLength * Math.sqrt(3);

        return (insertionPoint: Coordinate) => {
            const center: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(sideLength / 4).thenTake(stepUp(height / 4)));

            return new CellBuilder()
                .setStartCorner(insertionPoint)
                .addStepToNextCorner(stepInDirection(0, sideLength / 2))
                .addStepToNextCorner(stepInDirection(60, sideLength))
                .addStepToNextCorner(stepInDirection(180, sideLength))
                .defineCenter(center)
                .rotateAroundStartCorner(angle)
                .build();
        };
    }

    private static makeBottomLeftQuarterHexagonalCellCreator(sideLength: number, angle: number): CellCreator {
        // width = sideLength * 2;
        const height: number = sideLength * Math.sqrt(3);

        return (insertionPoint: Coordinate) => {
            const center: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(sideLength / 4).thenTake(stepUp(height / 4)));

            return new CellBuilder()
                .setStartCorner(insertionPoint)
                .addStepToNextCorner(stepInDirection(0, sideLength / 2))
                .addStepToNextCorner(stepInDirection(90, height / 2))
                .addStepToNextCorner(stepInDirection(180, sideLength))
                .defineCenter(center)
                .rotateAroundStartCorner(angle)
                .build();
        };
    }

    private static makeHalfHexagonalCellCreator(baseLength: number, angle: number): CellCreator {
        const sideLength: number = baseLength / 2;
        const height: number = sideLength * Math.sqrt(3);

        return (insertionPoint: Coordinate) => {
            const center: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(sideLength / 2).thenTake(stepUp(height / 4)));

            return new CellBuilder()
                .setStartCorner(insertionPoint)
                .addStepToNextCorner(stepInDirection(0, sideLength))
                .addStepToNextCorner(stepInDirection(0, sideLength))
                .addStepToNextCorner(stepInDirection(120, sideLength))
                .addStepToNextCorner(stepInDirection(180, sideLength))
                .defineCenter(center)
                .rotateAroundStartCorner(angle)
                .build();
        };
    }

    private static makeChamferedSquareCellCreator(width: number, angle: number): CellCreator {
        const height: number = width;
        const sideLength: number = width / (1 + Math.SQRT2);

        return (insertionPoint: Coordinate) => {
            const center: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(sideLength / 2).thenTake(stepUp(height / 2)));
            const cell: Cell = new CellBuilder()
                .setStartCorner(insertionPoint)
                .addStepToNextCorner(stepRight(width))
                .addStepToNextCorner(stepUp(width / 2 + sideLength / 2))
                .addStepToNextCorner(stepUpLeft(sideLength))
                .addStepToNextCorner(stepLeft(width / 2 + sideLength / 2))
                .defineCenter(center)
                .build();

            if (angle === 0) {
                return cell;
            }
            return cell.rotateAroundCenter(angle, insertionPoint);
        };
    }

    private static makeSemiOctagonalSemiSquareCellCreator(width: number, angle: number): CellCreator {
        const height: number = width;
        const sideLength: number = width / (1 + Math.SQRT2);

        return (insertionPoint: Coordinate) => {
            const center: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(sideLength / 2).thenTake(stepUp(height / 2)));
            const cell: Cell = new CellBuilder()
                .setStartCorner(insertionPoint)
                .addStepToNextCorner(stepRight(width / 2 + sideLength / 2))
                .addStepToNextCorner(stepUpRight(sideLength))
                .addStepToNextCorner(stepUp(sideLength))
                .addStepToNextCorner(stepUpLeft(sideLength))
                .addStepToNextCorner(stepLeft(width / 2 + sideLength / 2))
                .defineCenter(center)
                .build();

            if (angle === 0) {
                return cell;
            }
            return cell.rotateAroundCenter(angle, insertionPoint);
        };
    }

    private static makeOctagonalCellCreator(width: number, angle: number): CellCreator {
        const height: number = width;
        const sideLength: number = width / (1 + Math.SQRT2);
        return (insertionPoint: Coordinate) => {
            const center: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(sideLength / 2).thenTake(stepUp(height / 2)));
            const cell: Cell = new CellBuilder()
                .setStartCorner(insertionPoint)
                .addStepToNextCorner(stepRight(sideLength))
                .addStepToNextCorner(stepUpRight(sideLength))
                .addStepToNextCorner(stepUp(sideLength))
                .addStepToNextCorner(stepUpLeft(sideLength))
                .addStepToNextCorner(stepLeft(sideLength))
                .addStepToNextCorner(stepDownLeft(sideLength))
                .addStepToNextCorner(stepDown(sideLength))
                .defineCenter(center)
                .build();

            if (angle === 0) {
                return cell;
            }
            return cell.rotateAroundCenter(angle, insertionPoint);
        };
    }

    private static makeRhombusCellCreator(width: number, angle: number): CellCreator {
        const sideLength: number = width;
        return (insertionPoint: Coordinate) => {
            const center: Coordinate =
                insertionPoint.stepToNewCoordinate(
                    stepRight(sideLength).thenTake(stepInDirection(120, sideLength / 2))
                );
            return new CellBuilder()
                .setStartCorner(insertionPoint)
                .addStepToNextCorner(stepRight(sideLength))
                .addStepToNextCorner(stepInDirection(60, sideLength))
                .addStepToNextCorner(stepLeft(sideLength))
                .defineCenter(center)
                .rotateAroundStartCorner(angle)
                .build();
        };
    }

    private static makeKiteCellCreator(width: number, angle: number): CellCreator {
        const sideLength1: number = width;
        const sideLength2: number = width / (Math.sqrt(3));

        return (insertionPoint: Coordinate) => {
            const center: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(sideLength1 / 2).thenTake(stepUp(sideLength2 / 2)));
            return new CellBuilder()
                .setStartCorner(insertionPoint)
                .addStepToNextCorner(stepRight(sideLength1))
                .addStepToNextCorner(stepUp(sideLength2))
                .addStepToNextCorner(stepInDirection(150, sideLength2))
                .defineCenter(center)
                .rotateAroundStartCorner(angle)
                .build();
        };
    }

    private static makeTriakisTriangleCreator(width: number, angle: number): CellCreator {
        const height: number = width / (2 * Math.sqrt(3));

        return (insertionPoint: Coordinate) => {
            const center: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(width / 2).thenTake(stepUp(height / 3)));
            return new CellBuilder()
                .setStartCorner(insertionPoint)
                .addStepToNextCorner(stepRight(width))
                .addStepToNextCorner(stepUp(height).thenTake(stepLeft(width / 2)))
                .defineCenter(center)
                .rotateAroundStartCorner(angle)
                .build();
        };
    }

}

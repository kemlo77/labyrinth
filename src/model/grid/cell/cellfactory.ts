import { Coordinate } from '../../coordinate';
import { Vector } from '../../vector/vector';

import {
    stepDown,
    stepDownLeft,
    stepInDirection,
    stepLeft,
    stepRight,
    stepUp,
    stepUpLeft,
    stepUpRight
} from '../../vector/vectorcreator';
import type { CellCreator } from '../typealiases';
import { Cell } from './cell';
import { CellBuilder } from './cellbuilder';

export class CellFactory {

    private constructor() {
        throw new Error('This class cannot be instantiated');
    }

    static createCell(
        insertionPoint: Coordinate,
        width: number,
        type: string,
        angleInDegrees: number = 0
    ): Cell {
        return CellFactory.getCellCreatorByType(type, width, angleInDegrees)(insertionPoint);
    }

    static getCellCreatorByType(type: string, cellWidth: number, angle: number,
        insertionAdjustmentStep?: Vector): CellCreator {
        if (!insertionAdjustmentStep) {
            insertionAdjustmentStep = new Vector(0, 0);
        }

        switch (type) {

            case 'triangular-cell': return (insertionPoint: Coordinate) =>
                CellFactory.createTriangleCell(insertionPoint.stepToNewCoordinate(insertionAdjustmentStep),
                    cellWidth, angle);
            case 'equilateral-triangular-cell': return (insertionPoint: Coordinate) =>
                CellFactory.createEquilateralTriangleCell(insertionPoint.stepToNewCoordinate(insertionAdjustmentStep),
                    cellWidth, angle);
            case 'right-half-triangular-cell': return (insertionPoint: Coordinate) =>
                CellFactory.createRightHalfTriangleCell(insertionPoint.stepToNewCoordinate(insertionAdjustmentStep),
                    cellWidth, angle);
            case 'left-half-triangular-cell': return (insertionPoint: Coordinate) =>
                CellFactory.createLeftHalfTriangleCell(insertionPoint.stepToNewCoordinate(insertionAdjustmentStep),
                    cellWidth, angle);
            case 'triakis-triangle-cell': return (insertionPoint: Coordinate) =>
                CellFactory.createTriakisTriangle(insertionPoint.stepToNewCoordinate(insertionAdjustmentStep),
                    cellWidth, angle);

            case 'isosceles-right-triangular-cell': return (insertionPoint: Coordinate) =>
                CellFactory.createIsoscelesRightTriangleCell(
                    insertionPoint.stepToNewCoordinate(insertionAdjustmentStep),
                    cellWidth, angle);

            case 'square-cell': return (insertionPoint: Coordinate) =>
                CellFactory.createSquareCell(insertionPoint.stepToNewCoordinate(insertionAdjustmentStep),
                    cellWidth, angle);
            case 'double-square-rectangle-cell': return (insertionPoint: Coordinate) =>
                CellFactory.createDoubleSquareRectangleCell(insertionPoint.stepToNewCoordinate(insertionAdjustmentStep),
                    cellWidth, angle);

            case 'rhombus-cell': return (insertionPoint: Coordinate) =>
                CellFactory.createRhombusCell(insertionPoint.stepToNewCoordinate(insertionAdjustmentStep),
                    cellWidth, angle);

            case 'kite-cell': return (insertionPoint: Coordinate) =>
                CellFactory.createKiteCell(insertionPoint.stepToNewCoordinate(insertionAdjustmentStep),
                    cellWidth, angle);

            case 'hexagonal-cell': return (insertionPoint: Coordinate) =>
                CellFactory.createHexagonalCell(insertionPoint.stepToNewCoordinate(insertionAdjustmentStep),
                    cellWidth, angle);
            case 'half-hexagonal-cell': return (insertionPoint: Coordinate) =>
                CellFactory.createHalfHexagonalCell(insertionPoint.stepToNewCoordinate(insertionAdjustmentStep),
                    cellWidth, angle);
            case 'bottom-half-hexagonal-cell': return (insertionPoint: Coordinate) =>
                CellFactory.createBottomHalfHexagonalCell(insertionPoint.stepToNewCoordinate(insertionAdjustmentStep),
                    cellWidth, angle);
            case 'right-half-hexagonal-cell': return (insertionPoint: Coordinate) =>
                CellFactory.createRightHalfHexagonalCell(insertionPoint.stepToNewCoordinate(insertionAdjustmentStep),
                    cellWidth, angle);
            case 'bottom-right-quarter-hexagonal-cell': return (insertionPoint: Coordinate) =>
                CellFactory.createBottomRightQuarterHexagonalCell(
                    insertionPoint.stepToNewCoordinate(insertionAdjustmentStep),
                    cellWidth, angle);
            case 'bottom-left-quarter-hexagonal-cell': return (insertionPoint: Coordinate) =>
                CellFactory.createBottomLeftQuarterHexagonalCell(
                    insertionPoint.stepToNewCoordinate(insertionAdjustmentStep),
                    cellWidth, angle);

            case 'chamfered-square-cell': return (insertionPoint: Coordinate) =>
                CellFactory.createChamferedSquareCell(insertionPoint.stepToNewCoordinate(insertionAdjustmentStep),
                    cellWidth, angle);
            case 'semi-octagonal-semi-square-cell': return (insertionPoint: Coordinate) =>
                CellFactory.createSemiOctagonalSemiSquareCell(
                    insertionPoint.stepToNewCoordinate(insertionAdjustmentStep
                    ), cellWidth, angle);
            case 'octagonal-cell': return (insertionPoint: Coordinate) =>
                CellFactory.createOctagonalCell(insertionPoint.stepToNewCoordinate(insertionAdjustmentStep),
                    cellWidth, angle);

            default: throw new Error('Unknown cell type: ' + type);
        }
    }


    //Triangle that has all sides equal length
    private static createEquilateralTriangleCell(insertionPoint: Coordinate, width: number, angle: number): Cell {
        const height: number = width * Math.sqrt(3) / 2;
        const thirdHeight: number = height / 3;
        const halfWidth: number = width / 2;
        const sideLength: number = width;
        const center: Coordinate = insertionPoint.stepToNewCoordinate(stepRight(halfWidth)
            .thenTake(stepUp(thirdHeight)));
        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepRight(sideLength))
            .addStepToNextCorner(stepInDirection(120, sideLength))
            .defineCenter(center)
            .rotateAroundStartCorner(angle)
            .build();
    }

    //Triangle that has same width and height
    private static createTriangleCell(insertionPoint: Coordinate, width: number, angle: number): Cell {
        const height: number = width;
        const thirdHeight: number = height / 3;
        const halfWidth: number = width / 2;
        const center: Coordinate = insertionPoint.stepToNewCoordinate(stepRight(halfWidth)
            .thenTake(stepUp(thirdHeight)));
        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepRight(width))
            .addStepToNextCorner(stepUp(height).thenTake(stepLeft(width / 2)))
            .defineCenter(center)
            .rotateAroundStartCorner(angle)
            .build();
    }

    private static createLeftHalfTriangleCell(insertionPoint: Coordinate, width: number, angle: number): Cell {
        const height: number = width;
        const thirdHeight: number = height / 3;
        const halfWidth: number = width / 2;
        const sixthOfWidth: number = width / 6;
        const center: Coordinate =
            insertionPoint.stepToNewCoordinate(stepRight(sixthOfWidth).thenTake(stepUp(thirdHeight)));
        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepRight(halfWidth))
            .addStepToNextCorner(stepUp(height))
            .defineCenter(center)
            .rotateAroundStartCorner(angle)
            .build();
    }

    private static createRightHalfTriangleCell(insertionPoint: Coordinate, width: number, angle: number): Cell {
        const height: number = width;
        const thirdHeight: number = height / 3;
        const halfWidth: number = width / 2;
        const thirdOfWidth: number = width / 3;
        const center: Coordinate =
            insertionPoint.stepToNewCoordinate(stepRight(thirdOfWidth).thenTake(stepUp(thirdHeight)));
        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepRight(halfWidth))
            .addStepToNextCorner(stepUp(height).thenTake(stepLeft(halfWidth)))
            .defineCenter(center)
            .rotateAroundStartCorner(angle)
            .build();
    }

    private static createSquareCell(insertionPoint: Coordinate, width: number, angle: number): Cell {
        const height: number = width;
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
    }

    private static createDoubleSquareRectangleCell(insertionPoint: Coordinate, width: number, angle: number): Cell {
        const height: number = width / 2;
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
    }

    private static createIsoscelesRightTriangleCell(insertionPoint: Coordinate, width: number, angle: number): Cell {
        const height: number = width;
        const hypotenuseLength: number = Math.hypot(width, height);
        const center: Coordinate = insertionPoint.stepToNewCoordinate(stepRight(width / 3)
            .thenTake(stepUp(height / 3)));
        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepRight(width))
            .addStepToNextCorner(stepUpLeft(hypotenuseLength))
            .defineCenter(center)
            .rotateAroundStartCorner(angle)
            .build();
    }

    private static createHexagonalCell(insertionPoint: Coordinate, sideLength: number, angle: number): Cell {
        // width = sideLength * 2;
        const height: number = sideLength * Math.sqrt(3);
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
    }

    private static createRightHalfHexagonalCell(insertionPoint: Coordinate, sideLength: number, angle: number): Cell {
        // width = sideLength * 2;
        const height: number = sideLength * Math.sqrt(3);
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
    }

    private static createBottomHalfHexagonalCell(insertionPoint: Coordinate, sideLength: number, angle: number): Cell {
        const width: number = sideLength * 2;
        const height: number = sideLength * Math.sqrt(3);
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
    }

    private static createBottomRightQuarterHexagonalCell(insertionPoint: Coordinate, sideLength: number,
        angle: number): Cell {
        // width = sideLength * 2;
        const height: number = sideLength * Math.sqrt(3);
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
    }

    private static createBottomLeftQuarterHexagonalCell(insertionPoint: Coordinate, sideLength: number,
        angle: number): Cell {
        // width = sideLength * 2;
        const height: number = sideLength * Math.sqrt(3);
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
    }

    private static createHalfHexagonalCell(insertionPoint: Coordinate, baseLength: number, angle: number): Cell {
        const sideLength: number = baseLength / 2;
        const height: number = sideLength * Math.sqrt(3);
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
    }

    private static createChamferedSquareCell(insertionPoint: Coordinate, width: number, angle: number): Cell {
        const height: number = width;
        const sideLength: number = width / (1 + Math.SQRT2);
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
    }

    private static createSemiOctagonalSemiSquareCell(insertionPoint: Coordinate, width: number, angle: number): Cell {
        const height: number = width;
        const sideLength: number = width / (1 + Math.SQRT2);
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

    }

    private static createOctagonalCell(insertionPoint: Coordinate, width: number, angle: number): Cell {
        const height: number = width;
        const sideLength: number = width / (1 + Math.SQRT2);
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
    }

    private static createRhombusCell(insertionPoint: Coordinate, width: number, angle: number): Cell {
        const sideLength: number = width;
        const center: Coordinate =
            insertionPoint.stepToNewCoordinate(stepRight(sideLength).thenTake(stepInDirection(120, sideLength / 2)));
        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepRight(sideLength))
            .addStepToNextCorner(stepInDirection(60, sideLength))
            .addStepToNextCorner(stepLeft(sideLength))
            .defineCenter(center)
            .rotateAroundStartCorner(angle)
            .build();
    }

    private static createKiteCell(insertionPoint: Coordinate, width: number, angle: number): Cell {
        const sideLength1: number = width;
        const sideLength2: number = width / (Math.sqrt(3));
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
    }

    private static createTriakisTriangle(insertionPoint: Coordinate, width: number, angle: number): Cell {
        const height: number = width / (2 * Math.sqrt(3));
        const center: Coordinate =
            insertionPoint.stepToNewCoordinate(stepRight(width / 2).thenTake(stepUp(height / 3)));
        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepRight(width))
            .addStepToNextCorner(stepUp(height).thenTake(stepLeft(width / 2)))
            .defineCenter(center)
            .rotateAroundStartCorner(angle)
            .build();
    }

}

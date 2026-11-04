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
import type { CellCreator } from '../typealiases';
import { Cell } from './cell';
import { CellBuilder } from './cellbuilder';

export class CellCreatorFactory {

    private constructor() {
        throw new Error('This class cannot be instantiated');
    }

    static getCellCreatorByType(cellType: string, cellWidth: number, angle: number): CellCreator {

        switch (cellType) {

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

            default: throw new Error('Unknown cell type: ' + cellType);
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
                .setStartingPoint(insertionPoint)
                .addStepToNextVertice(stepRight(sideLength))
                .addStepToNextVertice(stepInDirection(120, sideLength))
                .defineCenter(center)
                .rotateAroundStartingPoint(angle)
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
                .setStartingPoint(insertionPoint)
                .addStepToNextVertice(stepRight(width))
                .addStepToNextVertice(stepUp(height).thenTake(stepLeft(width / 2)))
                .defineCenter(center)
                .rotateAroundStartingPoint(angle)
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
                .setStartingPoint(insertionPoint)
                .addStepToNextVertice(stepRight(halfWidth))
                .addStepToNextVertice(stepUp(height))
                .defineCenter(center)
                .rotateAroundStartingPoint(angle)
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
                .setStartingPoint(insertionPoint)
                .addStepToNextVertice(stepRight(halfWidth))
                .addStepToNextVertice(stepUp(height).thenTake(stepLeft(halfWidth)))
                .defineCenter(center)
                .rotateAroundStartingPoint(angle)
                .build();
        };
    }

    private static makeSquareCellCreator(width: number, angle: number): CellCreator {
        const height: number = width;

        return (insertionPoint: Coordinate) => {
            const center: Coordinate = insertionPoint.stepToNewCoordinate(stepRight(width / 2)
                .thenTake(stepUp(height / 2)));
            return new CellBuilder()
                .setStartingPoint(insertionPoint)
                .addStepToNextVertice(stepRight(width))
                .addStepToNextVertice(stepUp(width))
                .addStepToNextVertice(stepLeft(width))
                .defineCenter(center)
                .rotateAroundStartingPoint(angle)
                .build();
        };
    }

    private static makeDoubleSquareRectangleCellCreator(width: number, angle: number): CellCreator {
        const height: number = width / 2;
        return (insertionPoint: Coordinate) => {
            const center: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(width / 2).thenTake(stepUp(height / 2)));
            return new CellBuilder()
                .setStartingPoint(insertionPoint)
                .addStepToNextVertice(stepRight((width / 2)))
                .addStepToNextVertice(stepRight((width / 2)))
                .addStepToNextVertice(stepUp(height))
                .addStepToNextVertice(stepLeft((width / 2)))
                .addStepToNextVertice(stepLeft((width / 2)))
                .defineCenter(center)
                .rotateAroundStartingPoint(angle)
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
                .setStartingPoint(insertionPoint)
                .addStepToNextVertice(stepRight(width))
                .addStepToNextVertice(stepUpLeft(hypotenuseLength))
                .defineCenter(center)
                .rotateAroundStartingPoint(angle)
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
                .setStartingPoint(insertionPoint)
                .addStepToNextVertice(stepInDirection(0, sideLength))
                .addStepToNextVertice(stepInDirection(60, sideLength))
                .addStepToNextVertice(stepInDirection(120, sideLength))
                .addStepToNextVertice(stepInDirection(180, sideLength))
                .addStepToNextVertice(stepInDirection(240, sideLength))
                .defineCenter(center)
                .rotateAroundStartingPoint(angle)
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
                .setStartingPoint(insertionPoint)
                .addStepToNextVertice(stepInDirection(0, sideLength / 2))
                .addStepToNextVertice(stepInDirection(60, sideLength))
                .addStepToNextVertice(stepInDirection(120, sideLength))
                .addStepToNextVertice(stepInDirection(180, sideLength / 2))
                .defineCenter(center)
                .rotateAroundStartingPoint(angle)
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
                .setStartingPoint(insertionPoint)
                .addStepToNextVertice(stepInDirection(0, sideLength))
                .addStepToNextVertice(stepInDirection(60, sideLength))
                .addStepToNextVertice(stepInDirection(180, width))
                .defineCenter(center)
                .rotateAroundStartingPoint(angle)
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
                .setStartingPoint(insertionPoint)
                .addStepToNextVertice(stepInDirection(0, sideLength / 2))
                .addStepToNextVertice(stepInDirection(60, sideLength))
                .addStepToNextVertice(stepInDirection(180, sideLength))
                .defineCenter(center)
                .rotateAroundStartingPoint(angle)
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
                .setStartingPoint(insertionPoint)
                .addStepToNextVertice(stepInDirection(0, sideLength / 2))
                .addStepToNextVertice(stepInDirection(90, height / 2))
                .addStepToNextVertice(stepInDirection(180, sideLength))
                .defineCenter(center)
                .rotateAroundStartingPoint(angle)
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
                .setStartingPoint(insertionPoint)
                .addStepToNextVertice(stepInDirection(0, sideLength))
                .addStepToNextVertice(stepInDirection(0, sideLength))
                .addStepToNextVertice(stepInDirection(120, sideLength))
                .addStepToNextVertice(stepInDirection(180, sideLength))
                .defineCenter(center)
                .rotateAroundStartingPoint(angle)
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
                .setStartingPoint(insertionPoint)
                .addStepToNextVertice(stepRight(width))
                .addStepToNextVertice(stepUp(width / 2 + sideLength / 2))
                .addStepToNextVertice(stepUpLeft(sideLength))
                .addStepToNextVertice(stepLeft(width / 2 + sideLength / 2))
                .defineCenter(center)
                .build();

            if (angle === 0) {
                return cell;
            }
            return cell.rotateAroundCoordinate(angle, insertionPoint);
        };
    }

    private static makeSemiOctagonalSemiSquareCellCreator(width: number, angle: number): CellCreator {
        const height: number = width;
        const sideLength: number = width / (1 + Math.SQRT2);

        return (insertionPoint: Coordinate) => {
            const center: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(sideLength / 2).thenTake(stepUp(height / 2)));
            const cell: Cell = new CellBuilder()
                .setStartingPoint(insertionPoint)
                .addStepToNextVertice(stepRight(width / 2 + sideLength / 2))
                .addStepToNextVertice(stepUpRight(sideLength))
                .addStepToNextVertice(stepUp(sideLength))
                .addStepToNextVertice(stepUpLeft(sideLength))
                .addStepToNextVertice(stepLeft(width / 2 + sideLength / 2))
                .defineCenter(center)
                .build();

            if (angle === 0) {
                return cell;
            }
            return cell.rotateAroundCoordinate(angle, insertionPoint);
        };
    }

    private static makeOctagonalCellCreator(width: number, angle: number): CellCreator {
        const height: number = width;
        const sideLength: number = width / (1 + Math.SQRT2);
        return (insertionPoint: Coordinate) => {
            const center: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(sideLength / 2).thenTake(stepUp(height / 2)));
            const cell: Cell = new CellBuilder()
                .setStartingPoint(insertionPoint)
                .addStepToNextVertice(stepRight(sideLength))
                .addStepToNextVertice(stepUpRight(sideLength))
                .addStepToNextVertice(stepUp(sideLength))
                .addStepToNextVertice(stepUpLeft(sideLength))
                .addStepToNextVertice(stepLeft(sideLength))
                .addStepToNextVertice(stepDownLeft(sideLength))
                .addStepToNextVertice(stepDown(sideLength))
                .defineCenter(center)
                .build();

            if (angle === 0) {
                return cell;
            }
            return cell.rotateAroundCoordinate(angle, insertionPoint);
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
                .setStartingPoint(insertionPoint)
                .addStepToNextVertice(stepRight(sideLength))
                .addStepToNextVertice(stepInDirection(60, sideLength))
                .addStepToNextVertice(stepLeft(sideLength))
                .defineCenter(center)
                .rotateAroundStartingPoint(angle)
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
                .setStartingPoint(insertionPoint)
                .addStepToNextVertice(stepRight(sideLength1))
                .addStepToNextVertice(stepUp(sideLength2))
                .addStepToNextVertice(stepInDirection(150, sideLength2))
                .defineCenter(center)
                .rotateAroundStartingPoint(angle)
                .build();
        };
    }

    private static makeTriakisTriangleCreator(width: number, angle: number): CellCreator {
        const height: number = width / (2 * Math.sqrt(3));

        return (insertionPoint: Coordinate) => {
            const center: Coordinate =
                insertionPoint.stepToNewCoordinate(stepRight(width / 2).thenTake(stepUp(height / 3)));
            return new CellBuilder()
                .setStartingPoint(insertionPoint)
                .addStepToNextVertice(stepRight(width))
                .addStepToNextVertice(stepUp(height).thenTake(stepLeft(width / 2)))
                .defineCenter(center)
                .rotateAroundStartingPoint(angle)
                .build();
        };
    }

}

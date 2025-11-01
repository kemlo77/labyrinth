import { Coordinate } from '../../coordinate';
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
import { Cell } from './cell';
import { CellBuilder } from './cellbuilder';

export class CellFactory {

    private constructor() {
        throw new Error('This class cannot be instantiated');
    }

    static createCell(insertionPoint: Coordinate, width: number, type: string, angleInDegrees: number = 0): Cell {
        const createdCell: Cell = CellFactory.createCellByType(insertionPoint, width, type);

        if (angleInDegrees === 0) {
            return createdCell;
        }

        return createdCell.rotateAroundCenter(angleInDegrees, insertionPoint);
    }

    private static createCellByType(insertionPoint: Coordinate, width: number, type: string): Cell {

        switch (type) {
            case 'equilateral-triangular': return CellFactory.createEquilateralTriangleCell(insertionPoint, width);

            case 'triangular': return CellFactory.createTriangleCell(insertionPoint, width);
            case 'left-half-triangular': return CellFactory.createLeftHalfTriangleCell(insertionPoint, width);
            case 'right-half-triangular': return CellFactory.createRightHalfTriangleCell(insertionPoint, width);

            case 'square': return CellFactory.createSquareCell(insertionPoint, width);
            case 'isosceles-right-triangular':
                return CellFactory.createIsoscelesRightTriangleCell(insertionPoint, width);

            case 'double-square-rectangle': return CellFactory.createDoubleSquareRectangleCell(insertionPoint, width);

            case 'octagonal': return CellFactory.createOctagonalCell(insertionPoint, width);
            case 'chamfered-square': return CellFactory.createChamferedSquareCell(insertionPoint, width);
            case 'semi-octagonal-semi-square':
                return CellFactory.createSemiOctagonalSemiSquareCell(insertionPoint, width);

            case 'hexagonal': return CellFactory.createHexagonalCell(insertionPoint, width);
            case 'right-half-hexagonal': return CellFactory.createRightHalfHexagonalCell(insertionPoint, width);
            case 'bottom-half-hexagonal': return CellFactory.createBottomHalfHexagonalCell(insertionPoint, width);
            case 'bottom-right-quarter-hexagonal':
                return CellFactory.createBottomRightQuarterHexagonalCell(insertionPoint, width);
            case 'bottom-left-quarter-hexagonal':
                return CellFactory.createBottomLeftQuarterHexagonalCell(insertionPoint, width);

            case 'rhombus': return CellFactory.createRhombusCell(insertionPoint, width);

            case 'kite': return CellFactory.createKiteCell(insertionPoint, width);
            case 'triakis-triangle':
                return CellFactory.createTriakisTriangle(insertionPoint, width);

            default: throw new Error('Unknown cell type');
        }

    }

    //Triangle that has all sides equal length
    private static createEquilateralTriangleCell(insertionPoint: Coordinate, width: number): Cell {
        const height: number = width * Math.sqrt(3) / 2;
        const thirdHeight: number = height / 3;
        const halfWidth: number = width / 2;
        const sideLength: number = width;
        const center: Coordinate = insertionPoint.stepToNewCoordinate(stepRight(halfWidth).then(stepUp(thirdHeight)));
        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepRight(sideLength))
            .addStepToNextCorner(stepInDirection(120, sideLength))
            .defineCenter(center)
            .build();
    }

    //Triangle that has same width and height
    private static createTriangleCell(insertionPoint: Coordinate, width: number): Cell {
        const height: number = width;
        const thirdHeight: number = height / 3;
        const halfWidth: number = width / 2;
        const center: Coordinate = insertionPoint.stepToNewCoordinate(stepRight(halfWidth).then(stepUp(thirdHeight)));
        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepRight(width))
            .addStepToNextCorner(stepUp(height).then(stepLeft(width / 2)))
            .defineCenter(center)
            .build();
    }

    private static createLeftHalfTriangleCell(insertionPoint: Coordinate, width: number): Cell {
        const height: number = width;
        const thirdHeight: number = height / 3;
        const halfWidth: number = width / 2;
        const sixthOfWidth: number = width / 6;
        const center: Coordinate =
            insertionPoint.stepToNewCoordinate(stepRight(sixthOfWidth).then(stepUp(thirdHeight)));
        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepRight(halfWidth))
            .addStepToNextCorner(stepUp(height))
            .defineCenter(center)
            .build();
    }

    private static createRightHalfTriangleCell(insertionPoint: Coordinate, width: number): Cell {
        const height: number = width;
        const thirdHeight: number = height / 3;
        const halfWidth: number = width / 2;
        const thirdOfWidth: number = width / 3;
        const center: Coordinate =
            insertionPoint.stepToNewCoordinate(stepRight(thirdOfWidth).then(stepUp(thirdHeight)));
        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepRight(halfWidth))
            .addStepToNextCorner(stepUp(height).then(stepLeft(halfWidth)))
            .defineCenter(center)
            .build();
    }

    private static createSquareCell(insertionPoint: Coordinate, width: number): Cell {
        const height: number = width;
        const center: Coordinate = insertionPoint.stepToNewCoordinate(stepRight(width / 2).then(stepUp(height / 2)));
        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepRight(width))
            .addStepToNextCorner(stepUp(width))
            .addStepToNextCorner(stepLeft(width))
            .defineCenter(center)
            .build();
    }

    private static createDoubleSquareRectangleCell(insertionPoint: Coordinate, width: number): Cell {
        const height: number = width / 2;
        const center: Coordinate =
            insertionPoint.stepToNewCoordinate(stepRight(width / 2).then(stepUp(height / 2)));
        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepRight((width / 2)))
            .addStepToNextCorner(stepRight((width / 2)))
            .addStepToNextCorner(stepUp(height))
            .addStepToNextCorner(stepLeft((width / 2)))
            .addStepToNextCorner(stepLeft((width / 2)))
            .defineCenter(center)
            .build();
    }

    private static createIsoscelesRightTriangleCell(insertionPoint: Coordinate, width: number): Cell {
        const height: number = width;
        const hypotenuseLength: number = Math.sqrt(height * height + width * width);
        const center: Coordinate = insertionPoint.stepToNewCoordinate(stepRight(width / 3).then(stepUp(height / 3)));
        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepRight(width))
            .addStepToNextCorner(stepUpLeft(hypotenuseLength))
            .defineCenter(center)
            .build();
    }

    private static createHexagonalCell(insertionPoint: Coordinate, sideLength: number): Cell {
        // width = sideLength * 2;
        const height: number = sideLength * Math.sqrt(3);
        const center: Coordinate =
            insertionPoint.stepToNewCoordinate(stepRight(sideLength / 2).then(stepUp(height / 2)));

        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepInDirection(0, sideLength))
            .addStepToNextCorner(stepInDirection(60, sideLength))
            .addStepToNextCorner(stepInDirection(120, sideLength))
            .addStepToNextCorner(stepInDirection(180, sideLength))
            .addStepToNextCorner(stepInDirection(240, sideLength))
            .defineCenter(center)
            .build();
    }

    private static createRightHalfHexagonalCell(insertionPoint: Coordinate, sideLength: number): Cell {
        const width: number = sideLength * 2;
        const height: number = sideLength * Math.sqrt(3);
        const center: Coordinate =
            insertionPoint.stepToNewCoordinate(stepRight(sideLength / 4).then(stepUp(height / 2)));

        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepInDirection(0, sideLength / 2))
            .addStepToNextCorner(stepInDirection(60, sideLength))
            .addStepToNextCorner(stepInDirection(120, sideLength))
            .addStepToNextCorner(stepInDirection(180, sideLength / 2))
            .defineCenter(center)
            .build();
    }

    private static createBottomHalfHexagonalCell(insertionPoint: Coordinate, sideLength: number): Cell {
        const width: number = sideLength * 2;
        const height: number = sideLength * Math.sqrt(3);
        const center: Coordinate =
            insertionPoint.stepToNewCoordinate(stepRight(sideLength / 2).then(stepUp(height / 4)));

        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepInDirection(0, sideLength))
            .addStepToNextCorner(stepInDirection(60, sideLength))
            .addStepToNextCorner(stepInDirection(180, width))
            .defineCenter(center)
            .build();
    }

    private static createBottomRightQuarterHexagonalCell(insertionPoint: Coordinate, sideLength: number): Cell {
        const width: number = sideLength * 2;
        const height: number = sideLength * Math.sqrt(3);
        const center: Coordinate =
            insertionPoint.stepToNewCoordinate(stepRight(sideLength / 4).then(stepUp(height / 4)));

        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepInDirection(0, sideLength / 2))
            .addStepToNextCorner(stepInDirection(60, sideLength))
            .addStepToNextCorner(stepInDirection(180, sideLength))
            .defineCenter(center)
            .build();
    }

    private static createBottomLeftQuarterHexagonalCell(insertionPoint: Coordinate, sideLength: number): Cell {
        const width: number = sideLength * 2;
        const height: number = sideLength * Math.sqrt(3);
        const center: Coordinate =
            insertionPoint.stepToNewCoordinate(stepRight(sideLength / 4).then(stepUp(height / 4)));

        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepInDirection(0, sideLength / 2))
            .addStepToNextCorner(stepInDirection(90, height / 2))
            .addStepToNextCorner(stepInDirection(180, sideLength))
            .defineCenter(center)
            .build();
    }

    private static createChamferedSquareCell(insertionPoint: Coordinate, width: number): Cell {
        const height: number = width;
        const sideLength: number = width / (1 + Math.SQRT2);
        const center: Coordinate =
            insertionPoint.stepToNewCoordinate(stepRight(sideLength / 2).then(stepUp(height / 2)));
        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepRight(width))
            .addStepToNextCorner(stepUp(width / 2 + sideLength / 2))
            .addStepToNextCorner(stepUpLeft(sideLength))
            .addStepToNextCorner(stepLeft(width / 2 + sideLength / 2))
            .defineCenter(center)
            .build();
    }

    private static createSemiOctagonalSemiSquareCell(insertionPoint: Coordinate, width: number): Cell {
        const height: number = width;
        const sideLength: number = width / (1 + Math.SQRT2);
        const center: Coordinate =
            insertionPoint.stepToNewCoordinate(stepRight(sideLength / 2).then(stepUp(height / 2)));
        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepRight(width / 2 + sideLength / 2))
            .addStepToNextCorner(stepUpRight(sideLength))
            .addStepToNextCorner(stepUp(sideLength))
            .addStepToNextCorner(stepUpLeft(sideLength))
            .addStepToNextCorner(stepLeft(width / 2 + sideLength / 2))
            .defineCenter(center)
            .build();
    }

    private static createOctagonalCell(insertionPoint: Coordinate, width: number): Cell {
        const height: number = width;
        const sideLength: number = width / (1 + Math.SQRT2);
        const center: Coordinate =
            insertionPoint.stepToNewCoordinate(stepRight(sideLength / 2).then(stepUp(height / 2)));
        return new CellBuilder()
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
    }

    private static createRhombusCell(insertionPoint: Coordinate, width: number): Cell {
        const sideLength: number = width;
        const center: Coordinate =
            insertionPoint.stepToNewCoordinate(stepRight(sideLength).then(stepInDirection(120, sideLength / 2)));
        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepRight(sideLength))
            .addStepToNextCorner(stepInDirection(60, sideLength))
            .addStepToNextCorner(stepLeft(sideLength))
            .defineCenter(center)
            .build();
    }

    private static createKiteCell(insertionPoint: Coordinate, width: number): Cell {
        const sideLength1: number = width;
        const sideLength2: number = width / (Math.sqrt(3))
        const center: Coordinate =
            insertionPoint.stepToNewCoordinate(stepRight(sideLength1 / 2).then(stepUp(sideLength2 / 2)));
        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepRight(sideLength1))
            .addStepToNextCorner(stepUp(sideLength2))
            .addStepToNextCorner(stepInDirection(150, sideLength2))
            .defineCenter(center)
            .build();
    }

    private static createTriakisTriangle(insertionPoint: Coordinate, width: number): Cell {
        const height: number = width / (2 * Math.sqrt(3));
        const center: Coordinate =
            insertionPoint.stepToNewCoordinate(stepRight(width / 2).then(stepUp(height / 3)));
        return new CellBuilder()
            .setStartCorner(insertionPoint)
            .addStepToNextCorner(stepRight(width))
            .addStepToNextCorner(stepUp(height).then(stepLeft(width / 2)))
            .defineCenter(center)
            .build();
    }

}

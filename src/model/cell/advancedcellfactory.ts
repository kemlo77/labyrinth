import { Coordinate } from '../coordinate';
import { stepRight, stepUp, stepInDirection, stepLeft, stepDown } from '../vector/vectorcreator';
import { Cell } from '../cell/cell';
import { CellBuilder } from '../cell/cellbuilder';

export class AdvancedCellFactory {

    private constructor() {
        throw new Error('This class cannot be instantiated');
    }


    static createCell(
        insertionPoint: Coordinate,
        width: number,
        type: string,
        numberOfSideSegments: number,
        angleInDegrees: number = 0
    ): Cell {
        switch (type) {
            case 'triangular':
                return AdvancedCellFactory
                    .createSegmentedTriangleCell(insertionPoint, width, numberOfSideSegments, angleInDegrees);
            case 'square':
                return AdvancedCellFactory
                    .createSegmentedSquareCell(insertionPoint, width, numberOfSideSegments, angleInDegrees);
            default:
                throw new Error('Unknown cell type');
        }
    }

    private static createSegmentedSquareCell(
        insertionPoint: Coordinate,
        width: number,
        numberOfSideSegments: number,
        angleInDegrees: number
    ): Cell {
        const center: Coordinate = insertionPoint.stepToNewCoordinate(
            stepRight(width / 2).thenTake(stepUp(width / 2))
        );

        return new CellBuilder().setStartingPoint(insertionPoint)
            .addStepToNextVertice(stepRight(width))
            .addStepToNextVertice(stepUp(width))
            .addStepToNextVertice(stepLeft(width))
            .numberOfSubdivisionsPerSegment(numberOfSideSegments)
            .defineCenter(center)
            .rotateAroundStartingPoint(angleInDegrees)
            .build();
    }

    private static createSegmentedTriangleCell(
        insertionPoint: Coordinate,
        sideLength: number,
        numberOfSideSegments: number,
        angleInDegrees: number
    ): Cell {
        const triangleHeight: number = sideLength * Math.sqrt(3) / 2;
        const center: Coordinate = insertionPoint
            .stepToNewCoordinate(stepRight(sideLength / 2).thenTake(stepUp(triangleHeight / 3)));

        return new CellBuilder().setStartingPoint(insertionPoint)
            .addStepToNextVertice(stepRight(sideLength))
            .addStepToNextVertice(stepInDirection(120, sideLength))
            .numberOfSubdivisionsPerSegment(numberOfSideSegments)
            .defineCenter(center)
            .rotateAroundStartingPoint(angleInDegrees)
            .build();
    }
}
import { Coordinate } from '../coordinate';
import { stepRight, stepUp, stepInDirection, stepLeft } from '../vector/vectorcreator';
import { Cell } from './cell';
import { CellBuilder } from './cellbuilder';
import type { SegmentedCellCreator } from '../typealiases';

export class SegmentedCellCreatorFactory {

    private constructor() {
        throw new Error('This class cannot be instantiated');
    }

    static makeSegmentedCellCreator(
        type: string,
    ): SegmentedCellCreator {
        switch (type) {
            case 'triangular': return SegmentedCellCreatorFactory.createSegmentedTriangleCell;
            case 'square': return SegmentedCellCreatorFactory.createSegmentedSquareCell;
            default: throw new Error('Unknown cell type');
        }
    }

    private static createSegmentedSquareCell(
        insertionPoint: Coordinate,
        angleInDegrees: number,
        sideLength: number,
        numberOfSideSegments: number
    ): Cell {
        const center: Coordinate = insertionPoint.stepToNewCoordinate(
            stepRight(sideLength / 2).thenTake(stepUp(sideLength / 2))
        );

        return new CellBuilder().setStartingPoint(insertionPoint)
            .addStepToNextVertice(stepRight(sideLength))
            .addStepToNextVertice(stepUp(sideLength))
            .addStepToNextVertice(stepLeft(sideLength))
            .numberOfSubdivisionsPerSegment(numberOfSideSegments)
            .defineCenter(center)
            .rotateAroundStartingPoint(angleInDegrees)
            .build();
    }

    private static createSegmentedTriangleCell(
        insertionPoint: Coordinate,
        angleInDegrees: number,
        sideLength: number,
        numberOfSideSegments: number
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
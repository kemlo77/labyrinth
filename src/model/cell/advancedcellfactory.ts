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
        const segmentLength: number = width / numberOfSideSegments;
        const center: Coordinate = insertionPoint.stepToNewCoordinate(
            stepRight(width / 2).thenTake(stepUp(width / 2))
        );

        const cellBuilder: CellBuilder = new CellBuilder().setStartingPoint(insertionPoint);

        for (let i: number = 0; i < numberOfSideSegments; i++) {
            cellBuilder.addStepToNextVertice(stepRight(segmentLength));
        }
        for (let i: number = 0; i < numberOfSideSegments; i++) {
            cellBuilder.addStepToNextVertice(stepUp(segmentLength));
        }
        for (let i: number = 0; i < numberOfSideSegments; i++) {
            cellBuilder.addStepToNextVertice(stepLeft(segmentLength));
        }
        for (let i: number = 1; i < numberOfSideSegments; i++) {
            cellBuilder.addStepToNextVertice(stepDown(segmentLength));
        }

        cellBuilder.defineCenter(center);
        cellBuilder.rotateAroundStartingPoint(angleInDegrees);

        return cellBuilder.build();
    }

    private static createSegmentedTriangleCell(
        insertionPoint: Coordinate,
        sideLength: number,
        numberOfSideSegments: number,
        angleInDegrees: number
    ): Cell {
        const segmentLength: number = sideLength / numberOfSideSegments;
        const triangleHeight: number = sideLength * Math.sqrt(3) / 2;
        const thirdHeight: number = triangleHeight / 3;
        const halvSideLength: number = sideLength / 2;
        const center: Coordinate = insertionPoint
            .stepToNewCoordinate(stepRight(halvSideLength).thenTake(stepUp(thirdHeight)));

        const cellBuilder: CellBuilder = new CellBuilder().setStartingPoint(insertionPoint);

        for (let i: number = 0; i < numberOfSideSegments; i++) {
            cellBuilder.addStepToNextVertice(stepRight(segmentLength));
        }
        for (let i: number = 0; i < numberOfSideSegments; i++) {
            cellBuilder.addStepToNextVertice(stepInDirection(120, segmentLength));
        }
        for (let i: number = 1; i < numberOfSideSegments; i++) {
            cellBuilder.addStepToNextVertice(stepInDirection(240, segmentLength));
        }

        cellBuilder.defineCenter(center);
        cellBuilder.rotateAroundStartingPoint(angleInDegrees);

        return cellBuilder.build();
    }
}
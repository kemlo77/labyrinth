import { Coordinate } from '../../coordinate';
import { stepRight, stepUp, stepInDirection } from '../../vector/vectorcreator';
import { Cell } from './cell';
import { CellBuilder } from './cellbuilder';

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
        const createdCell: Cell =
            AdvancedCellFactory.createCellByType(insertionPoint, width, type, numberOfSideSegments);

        if (angleInDegrees === 0) {
            return createdCell;
        }

        return createdCell.rotateAroundCenter(angleInDegrees, insertionPoint);
    }

    private static createCellByType(
        insertionPoint: Coordinate,
        width: number,
        type: string,
        numberOfSideSegments: number
    ): Cell {
        switch (type) {
            case 'triangular':
                return AdvancedCellFactory.createSegmentedTriangleCell(insertionPoint, width, numberOfSideSegments);
            default:
                throw new Error('Unknown cell type');
        }
    }

    private static createSegmentedTriangleCell(
        insertionPoint: Coordinate,
        sideLength: number,
        numberOfSideSegments: number
    ): Cell {
        const segmentLength: number = sideLength / numberOfSideSegments;
        const triangleHeight: number = sideLength * Math.sqrt(3) / 2;
        const thirdHeight: number = triangleHeight / 3;
        const halvSideLength: number = sideLength / 2;
        const center: Coordinate = insertionPoint
            .stepToNewCoordinate(stepRight(halvSideLength).then(stepUp(thirdHeight)));

        const cellBuilder: CellBuilder = new CellBuilder().setStartCorner(insertionPoint);

        for (let i: number = 0; i < numberOfSideSegments; i++) {
            cellBuilder.addStepToNextCorner(stepRight(segmentLength));
        }
        for (let i: number = 0; i < numberOfSideSegments; i++) {
            cellBuilder.addStepToNextCorner(stepInDirection(120, segmentLength));
        }
        for (let i: number = 1; i < numberOfSideSegments; i++) {
            cellBuilder.addStepToNextCorner(stepInDirection(240, segmentLength));
        }

        cellBuilder.defineCenter(center);

        return cellBuilder.build();
    }
}
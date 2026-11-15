import { MatrixOperations } from '../../../service/matrixoperations';
import { Coordinate } from '../../coordinate';
import { Vector } from '../../vector/vector';
import type { Region } from '../region';
import type { RegionCreator, RegularRegionCreator } from '../../typealiases';
import { stepInDirection, stepRight, stepUp } from '../../vector/vectorcreator';


export abstract class GridAssembler<T extends Region<T>> {

    protected createSequenceOfRegions(
        insertionPoint: Coordinate,
        step: Vector,
        regionsToCreate: number,
        regionCreator: RegionCreator<T>
    ): T[] {
        const regionSequence: T[] = [];
        for (let stepNumber: number = 0; stepNumber < regionsToCreate; stepNumber++) {
            const newInsertionPoint: Coordinate = insertionPoint.stepToNewCoordinate(step.times(stepNumber));
            regionSequence.push(regionCreator(newInsertionPoint));
        }
        return regionSequence;
    }


    protected oldCreatePointyTopFirstRowOfTriangles(
        insertionPoint: Coordinate,
        stepToNextInsertionPoint: Vector,
        numberOfPointyTopTriangles: number,
        createPointyTopTriangle: RegionCreator<T>,
        createPointyBottomTriangle: RegionCreator<T>
    ): T[] {
        const rowOfRegions: T[] = [];
        for (let index: number = 0; index < numberOfPointyTopTriangles; index++) {
            const notFirstTriangle: boolean = index > 0;
            const regionInsertionPoint: Coordinate =
                insertionPoint.stepToNewCoordinate(stepToNextInsertionPoint.times(index));

            if (notFirstTriangle) {
                rowOfRegions.push(createPointyBottomTriangle(regionInsertionPoint));
            }
            rowOfRegions.push(createPointyTopTriangle(regionInsertionPoint));

        }
        return rowOfRegions;
    }

    protected createPointyTopFirstRowOfTriangles(
        insertionPoint: Coordinate,
        angle: number,
        triangleBaseWidth: number,
        triangleHeight: number,
        numberOfPointyTopTriangles: number,
        createTriangle: RegularRegionCreator<T>
    ): T[] {
        const stepToNextInsertionPoint: Vector = stepInDirection(angle, triangleBaseWidth);
        const stepToUpperInsertionPoint: Vector =
            stepRight(triangleBaseWidth / 2).thenTake(stepUp(triangleHeight)).newRotatedVector(angle);
        const rowOfRegions: T[] = [];
        for (let index: number = 0; index < numberOfPointyTopTriangles; index++) {
            const notFirstTriangle: boolean = index > 0;
            const regionInsertionPoint: Coordinate =
                insertionPoint.stepToNewCoordinate(stepToNextInsertionPoint.times(index));

            if (notFirstTriangle) {
                const upperInsertionPoint: Coordinate =
                    regionInsertionPoint.stepToNewCoordinate(stepToUpperInsertionPoint);
                rowOfRegions.push(createTriangle(upperInsertionPoint, triangleBaseWidth, angle + 180));
            }
            rowOfRegions.push(createTriangle(regionInsertionPoint, triangleBaseWidth, angle));

        }
        return rowOfRegions;
    }

    protected oldCreatePointyBottomFirstRowOfTriangles(
        insertionPoint: Coordinate,
        stepToNextInsertionPoint: Vector,
        numberOfPointyTopTriangles: number,
        createPointyTopTriangle: RegionCreator<T>,
        createPointyBottomTriangle: RegionCreator<T>
    ): T[] {
        const rowOfRegions: T[] = [];
        for (let index: number = 0; index < numberOfPointyTopTriangles + 1; index++) {
            const notLastTriangle: boolean = index < numberOfPointyTopTriangles;
            const regionInsertionPoint: Coordinate =
                insertionPoint.stepToNewCoordinate(stepToNextInsertionPoint.times(index));

            rowOfRegions.push(createPointyBottomTriangle(regionInsertionPoint));
            if (notLastTriangle) {
                rowOfRegions.push(createPointyTopTriangle(regionInsertionPoint));
            }
        }
        return rowOfRegions;
    }

    protected createPointyBottomFirstRowOfTriangles(
        insertionPoint: Coordinate,
        angle: number,
        triangleBaseWidth: number,
        triangleHeight: number,
        numberOfPointyTopTriangles: number,
        createTriangle: RegularRegionCreator<T>
    ): T[] {
        const stepToNextInsertionPoint: Vector = stepInDirection(angle, triangleBaseWidth);
        const stepToUpperInsertionPoint: Vector =
            stepRight(triangleBaseWidth / 2).thenTake(stepUp(triangleHeight)).newRotatedVector(angle);
        const rowOfRegions: T[] = [];
        for (let index: number = 0; index < numberOfPointyTopTriangles + 1; index++) {
            const notLastTriangle: boolean = index < numberOfPointyTopTriangles;
            const regionInsertionPoint: Coordinate =
                insertionPoint.stepToNewCoordinate(stepToNextInsertionPoint.times(index));

            const upperInsertionPoint: Coordinate =
                regionInsertionPoint.stepToNewCoordinate(stepToUpperInsertionPoint);
            rowOfRegions.push(createTriangle(upperInsertionPoint, triangleBaseWidth, angle + 180));
            if (notLastTriangle) {
                rowOfRegions.push(createTriangle(regionInsertionPoint, triangleBaseWidth, angle));
            }
        }
        return rowOfRegions;
    }

    protected establishNeighbourRelationsInRows(regionMatrix: T[][]): void {
        const transposedRegionMatrix: T[][] = MatrixOperations.transpose(regionMatrix);
        for (const column of transposedRegionMatrix) {
            this.establishNeighbourRelationsInSequence(column);
        }
    }

    protected establishNeighbourRelationsInColumns(regionMatrix: T[][]): void {
        for (const column of regionMatrix) {
            this.establishNeighbourRelationsInSequence(column);
        }
    }

    protected establishNeighbourRelationsInSequence(regionSequence: T[]): void {
        for (let index: number = 0; index < regionSequence.length; index++) {
            const notOnTheLastRegion: boolean = index !== regionSequence.length - 1;
            if (notOnTheLastRegion) {
                const region: T = regionSequence[index];
                const nextRegion: T = regionSequence[index + 1];
                region.establishNeighbourRelationsWith(nextRegion);
            }
        }
    }
}
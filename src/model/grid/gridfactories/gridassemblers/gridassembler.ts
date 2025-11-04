import { Coordinate } from '../../../coordinate';
import { Vector } from '../../../vector/vector';
import { Region } from '../../region';
import { RegionCreator } from '../../typealiases';


export abstract class GridAssembler<T extends Region<T>> {


    protected createPointyTopFirstRowOfTriangles(
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

    protected createPointyBottomFirstRowOfTriangles(
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
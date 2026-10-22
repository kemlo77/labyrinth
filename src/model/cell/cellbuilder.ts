import { Coordinate } from '../coordinate';
import { Vector } from '../vector/vector';
import { Cell } from './cell';

export class CellBuilder {

    private _startCorner: Coordinate;
    private readonly _steps: Vector[] = [];
    private _center: Coordinate;
    private _rotationAngle: number = 0;

    setStartCorner(startCorner: Coordinate): this {
        this._startCorner = startCorner.clone();
        return this;
    }

    addStepToNextCorner(step: Vector): this {
        this._steps.push(step);
        return this;
    }

    defineCenter(center: Coordinate): this {
        this._center = center;
        return this;
    }

    rotateAroundStartCorner(angleInDegrees: number): this {
        this._rotationAngle = angleInDegrees;
        return this;
    }

    build(): Cell {
        if (!this._startCorner) {
            throw new Error('Start corner is missing');
        }
        if (this._steps.length < 2) {
            throw new Error('Less than 2 steps added');
        }
        if (!this._center) {
            throw new Error('Center is missing');
        }

        const corners: Coordinate[] = this.calculateCorners();

        if (this._rotationAngle !== 0) {
            const rotatedCorners: Coordinate[] =
                corners.map(corner => corner.rotateAroundCenter(this._rotationAngle, this._startCorner));
            const rotatedCenter: Coordinate =
                this._center.rotateAroundCenter(this._rotationAngle, this._startCorner);
            return new Cell(rotatedCenter, rotatedCorners);
        }

        return new Cell(this._center, corners);
    }

    private calculateCorners(): Coordinate[] {
        const corners: Coordinate[] = [];
        let currentCorner: Coordinate = this._startCorner;
        corners.push(currentCorner);
        for (const step of this._steps) {
            currentCorner = currentCorner.stepToNewCoordinate(step);
            corners.push(currentCorner);
        }
        return corners;
    }

}
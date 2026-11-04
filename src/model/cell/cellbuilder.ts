import { Coordinate } from '../coordinate';
import { Vector } from '../vector/vector';
import { Cell } from './cell';

export class CellBuilder {

    private _startCorner!: Coordinate;
    private readonly _steps: Vector[] = [];
    private _center!: Coordinate;
    private _rotationAngle: number = 0;
    private _corners: Coordinate[] = [];

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
        this.assertBuildConditions();

        this.calculateCorners();

        if (this.cellIsRotated()) {
            this.rotateCornersAroundStartCorner();
            this.rotateCenterAroundStartCorner();
        }

        return new Cell(this._center, this._corners);
    }

    private cellIsRotated(): boolean {
        return this._rotationAngle !== 0;
    }

    private rotateCornersAroundStartCorner(): void {
        this._corners =
            this._corners.map(corner => corner.rotateAroundAnotherCoordinate(this._rotationAngle, this._startCorner));
    }

    private rotateCenterAroundStartCorner(): void {
        this._center = this._center.rotateAroundAnotherCoordinate(this._rotationAngle, this._startCorner);
    }

    private assertBuildConditions(): void {
        if (!this._startCorner) {
            throw new Error('Start corner is missing');
        }
        if (this._steps.length < 2) {
            throw new Error('Less than 2 steps added');
        }
        if (!this._center) {
            throw new Error('Center is missing');
        }
    }

    private calculateCorners(): void {
        const corners: Coordinate[] = [];
        let currentCorner: Coordinate = this._startCorner;
        corners.push(currentCorner);
        for (const step of this._steps) {
            currentCorner = currentCorner.stepToNewCoordinate(step);
            corners.push(currentCorner);
        }
        this._corners = corners;
    }

}
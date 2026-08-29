import { Coordinate } from '../../coordinate';
import { Vector } from '../../vector/vector';
import { Cell } from './cell';

export class CellBuilder {

    private _startCorner: Coordinate;
    private readonly _steps: Vector[] = [];
    private _corners: Coordinate[] = [];
    private _center: Coordinate;

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

        this._corners = this.calculateCorners();
        return new Cell(this._center, this._corners);
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
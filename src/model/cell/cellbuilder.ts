import { Coordinate } from '../coordinate';
import { Vector } from '../vector/vector';
import { Cell } from './cell';

export class CellBuilder {

    private _startPoint!: Coordinate;
    private readonly _steps: Vector[] = [];
    private _center!: Coordinate;
    private _rotationAngle: number = 0;
    private _vertices: Coordinate[] = [];


    setStartingPoint(startingPoint: Coordinate): this {
        this._startPoint = startingPoint.clone();
        return this;
    }

    addStepToNextVertice(step: Vector): this {
        this._steps.push(step);
        return this;
    }

    defineCenter(center: Coordinate): this {
        this._center = center;
        return this;
    }

    rotateAroundStartingPoint(angleInDegrees: number): this {
        this._rotationAngle = angleInDegrees;
        return this;
    }

    build(): Cell {
        this.assertBuildConditions();

        this.calculateVertices();

        if (this.cellIsRotated()) {
            this.rotateVerticesAroundStartingPoint();
            this.rotateCenterAroundStartingPoint();
        }

        return new Cell(this._center, this._vertices);
    }

    private cellIsRotated(): boolean {
        return this._rotationAngle !== 0;
    }

    private rotateVerticesAroundStartingPoint(): void {
        this._vertices =
            this._vertices.map(vertice => vertice.rotateAroundAnotherCoordinate(this._rotationAngle, this._startPoint));
    }

    private rotateCenterAroundStartingPoint(): void {
        this._center = this._center.rotateAroundAnotherCoordinate(this._rotationAngle, this._startPoint);
    }

    private assertBuildConditions(): void {
        if (!this._startPoint) {
            throw new Error('Starting point is missing');
        }
        if (this._steps.length < 2) {
            throw new Error('Less than 2 steps added');
        }
        if (!this._center) {
            throw new Error('Center is missing');
        }
    }

    private calculateVertices(): void {
        const vertices: Coordinate[] = [];
        let currentVertice: Coordinate = this._startPoint;
        vertices.push(currentVertice);
        for (const step of this._steps) {
            currentVertice = currentVertice.stepToNewCoordinate(step);
            vertices.push(currentVertice);
        }
        this._vertices = vertices;
    }

}
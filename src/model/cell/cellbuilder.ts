import { Coordinate } from '../coordinate';
import { Vector } from '../vector/vector';
import { Cell } from './cell';

export class CellBuilder {

    private _startPoint!: Coordinate;
    private readonly _steps: Vector[] = [];
    private _center!: Coordinate;
    private _rotationAngle: number = 0;
    private _vertices: Coordinate[] = [];
    private _numberOfSubdivisionsPerSegment: number = 1;


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

    numberOfSubdivisionsPerSegment(howMany: number): this {

        this._numberOfSubdivisionsPerSegment = howMany;
        return this
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
        if (this._numberOfSubdivisionsPerSegment < 1) {
            throw new Error('Number of subdivisions per segment must be at least 1');
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
        if (this._numberOfSubdivisionsPerSegment == 1) {
            this._vertices = vertices;
            return;
        }

        const subdividedVertices: Coordinate[] = [];
        const startVertice: Coordinate = this._startPoint;
        const lastVertice: Coordinate = vertices[vertices.length - 1];
        let workingStartVertice: Coordinate = startVertice;
        subdividedVertices.push(startVertice);
        for (let i = 1; i < vertices.length; i++) {
            const endVertice: Coordinate = vertices[i];

            //calculate subdivision step vector
            const stepVector: Vector = workingStartVertice.vectorTo(endVertice);
            const subdivisionStepVector: Vector = stepVector.times(1 / this._numberOfSubdivisionsPerSegment);

            //add subdivided vertices
            for (let j = 1; j <= this._numberOfSubdivisionsPerSegment; j++) {
                const newVertice: Coordinate = workingStartVertice.stepToNewCoordinate(subdivisionStepVector.times(j));
                subdividedVertices.push(newVertice);
            }
            workingStartVertice = endVertice;
        }

        const stepVector: Vector = lastVertice.vectorTo(startVertice);
        const subdivisionStepVector: Vector = stepVector.times(1 / this._numberOfSubdivisionsPerSegment);
        for (let k = 1; k < this._numberOfSubdivisionsPerSegment; k++) {

            const newVertice: Coordinate = lastVertice.stepToNewCoordinate(subdivisionStepVector.times(k));
            subdividedVertices.push(newVertice);
        }
        this._vertices = subdividedVertices;
    }


}
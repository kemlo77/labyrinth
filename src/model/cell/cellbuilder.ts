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

    private cellIsRotated(): boolean {
        return this._rotationAngle !== 0;
    }

    private segmentsAreSubdivided(): boolean {
        return this._numberOfSubdivisionsPerSegment > 1;
    }

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
        if (this.segmentsAreSubdivided()) {
            this._vertices = this.calculateSubdividedVerticesFromAddedSteps();
            return;
        }

        this._vertices = this.calculateVerticesFromAddedSteps();
    }

    private calculateSubdividedVerticesFromAddedSteps(): Coordinate[] {
        const vertices: Coordinate[] = this.calculateVerticesFromAddedSteps();
        const subdividedVertices: Coordinate[] = [];
        const startVertice: Coordinate = this._startPoint;
        const lastVertice: Coordinate = vertices[vertices.length - 1];
        let currentStartVertice: Coordinate = startVertice;
        subdividedVertices.push(startVertice);
        for (let i = 1; i < vertices.length; i++) {
            const currentEndVertice: Coordinate = vertices[i];

            const intermediateVertices: Coordinate[] =
                this.generateIntermediateVertices(currentStartVertice, currentEndVertice);
            subdividedVertices.push(...intermediateVertices);

            subdividedVertices.push(currentEndVertice);

            currentStartVertice = currentEndVertice;
        }

        const intermediateVerticesOnLastSegment: Coordinate[] =
            this.generateIntermediateVertices(lastVertice, startVertice);
        subdividedVertices.push(...intermediateVerticesOnLastSegment);
        return subdividedVertices;
    }

    private calculateVerticesFromAddedSteps(): Coordinate[] {
        const vertices: Coordinate[] = [];
        let currentVertice: Coordinate = this._startPoint;
        vertices.push(currentVertice);
        for (const step of this._steps) {
            currentVertice = currentVertice.stepToNewCoordinate(step);
            vertices.push(currentVertice);
        }
        return vertices;
    }

    private generateIntermediateVertices(startVertice: Coordinate, endVertice: Coordinate): Coordinate[] {
        const subdivisionStepVector: Vector = this.calculateSubDivisionStepVector(startVertice, endVertice);
        return this.generateVerticesFrom(
            startVertice, subdivisionStepVector, this._numberOfSubdivisionsPerSegment - 1);
    }

    private calculateSubDivisionStepVector(startVertice: Coordinate, endVertice: Coordinate): Vector {
        const subdivisionStepVector: Vector = startVertice.vectorTo(endVertice)
            .times(1 / this._numberOfSubdivisionsPerSegment);
        return subdivisionStepVector;
    }

    private generateVerticesFrom(startingPoint: Coordinate, step: Vector, numberOfSteps: number): Coordinate[] {
        const vertices: Coordinate[] = [];
        for (let i = 1; i <= numberOfSteps; i++) {
            const currentVertice = startingPoint.stepToNewCoordinate(step.times(i));
            vertices.push(currentVertice);
        }
        return vertices;
    }


}
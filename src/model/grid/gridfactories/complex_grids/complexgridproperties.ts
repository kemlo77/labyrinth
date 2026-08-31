import { Coordinate } from '../../../coordinate';

export class ComplexGridProperties {

    private readonly _insertionPoint: Coordinate;
    private readonly _lengthOfEdgeSegments: number;
    private readonly _angle: number;

    constructor(
        insertionPoint: Coordinate,
        lengthOfEdgeSegments: number,
        angle: number = 0
    ) {
        if (lengthOfEdgeSegments <= 0) {
            throw new Error('lengthOfEdgeSegments must be positive');
        }
        this._insertionPoint = insertionPoint;
        this._lengthOfEdgeSegments = lengthOfEdgeSegments;
        this._angle = angle;
    }

    get insertionPoint(): Coordinate {
        return this._insertionPoint;
    }

    get lengthOfEdgeSegments(): number {
        return this._lengthOfEdgeSegments;
    }

    get angle(): number {
        return this._angle;
    }
}
import { Coordinate } from '../../../coordinate';

export class RegularShapedGridProperties {

    private readonly _insertionPoint: Coordinate;
    private readonly _numberOfEdgeSegments: number;
    private readonly _lengthOfEdgeSegments: number;
    private readonly _angle: number;

    constructor(
        insertionPoint: Coordinate,
        numberOfEdgeSegments: number,
        lengthOfEdgeSegments: number,
        angle: number = 0
    ) {
        if (numberOfEdgeSegments < 1) {
            throw new Error('numberOfEdgeSegments must be at least 1');
        }
        if (lengthOfEdgeSegments <= 0) {
            throw new Error('edgeSegmentLength must be positive');
        }
        this._insertionPoint = insertionPoint;
        this._numberOfEdgeSegments = numberOfEdgeSegments;
        this._lengthOfEdgeSegments = lengthOfEdgeSegments;
        this._angle = angle;
    }

    get insertionPoint(): Coordinate {
        return this._insertionPoint;
    }

    get numberOfEdgeSegments(): number {
        return this._numberOfEdgeSegments;
    }

    get lengthOfEdgeSegments(): number {
        return this._lengthOfEdgeSegments;
    }

    get angle(): number {
        return this._angle;
    }
}
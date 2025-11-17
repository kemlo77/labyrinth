import { Coordinate } from './coordinate';
import { Vector } from './vector/vector';

export class Segment {

    constructor(readonly p1: Coordinate, readonly p2: Coordinate) {
        //
    }

    get midpoint(): Coordinate {
        return new Coordinate((this.p1.x + this.p2.x) / 2, (this.p1.y + this.p2.y) / 2);
    }

    get length(): number {
        return Math.sqrt(Math.pow(this.p1.x - this.p2.x, 2) + Math.pow(this.p1.y - this.p2.y, 2));
    }

    generateSubsegments(numberOfSubsegments:number): Segment[] {
        const vector: Vector = 
                    Vector.createVectorFromCoordinates(this.p1, this.p2);
        const pieceLength: number = vector.magnitude / numberOfSubsegments;
                
        const stepVector: Vector = 
                    vector.getUnitVector().times(pieceLength);
        const segments: Segment[] = [];
        
        for (let stepIndex: number = 0; stepIndex < numberOfSubsegments; stepIndex++) {
            const startPoint: Coordinate = 
                        this.p1.stepToNewCoordinate(stepVector.times(stepIndex));
            const endPoint: Coordinate = 
                        this.p1.stepToNewCoordinate(stepVector.times(stepIndex + 1));
            segments.push(new Segment(startPoint, endPoint));
        }
        
        return segments;
    }
}
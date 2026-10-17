import { Coordinate } from '../coordinate';

export class Vector {

    constructor(readonly x: number, readonly y: number) {
        //
    }

    static unitVectorInDirection(angleInDegrees: number): Vector {
        const angleInRadians: number = angleInDegrees * Math.PI / 180;
        return new Vector(Math.cos(angleInRadians), Math.sin(angleInRadians));
    }

    get magnitude(): number {
        return Math.hypot(this.x, this.y);
    }

    get direction(): number {
        if (this.magnitude === 0) {
            return 0;
        }
        const angle: number = Math.atan2(this.y, this.x) * 180 / Math.PI;
        return angle < 0 ? angle + 360 : angle;
    }

    //scaling vectors
    times(factor: number): Vector {
        return new Vector(this.x * factor, this.y * factor);
    }

    //adding vectors
    thenTake(otherVector: Vector): Vector {
        return new Vector(this.x + otherVector.x, this.y + otherVector.y);
    }

    getUnitVector(): Vector {
        const magnitude: number = this.magnitude;
        if (magnitude === 0) {
            return new Vector(0, 0);
        }
        return new Vector(this.x / magnitude, this.y / magnitude);
    }


    static createVectorFromCoordinates(coordinate1: Coordinate, coordinate2: Coordinate): Vector {
        return new Vector(coordinate2.x - coordinate1.x, coordinate2.y - coordinate1.y);
    }

    newRotatedVector(angleInDegrees: number): Vector {
        if (angleInDegrees === 0) {
            return this;
        }
        const angle: number = angleInDegrees * Math.PI / 180;
        const newX: number = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        const newY: number = this.x * Math.sin(angle) + this.y * Math.cos(angle);
        return new Vector(newX, newY);
    }

    hasAngleTo(otherVector: Vector): number {
        let angle: number = Math.atan2(this.crossProduct(otherVector), this.dotProduct(otherVector)) * 180 / Math.PI;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    }

    private dotProduct(otherVector: Vector): number {
        return this.x * otherVector.x + this.y * otherVector.y;
    }

    private crossProduct(otherVector: Vector): number {
        return this.x * otherVector.y - this.y * otherVector.x;
    }
}
import { Vector } from './vector';

export class Coordinate {

    constructor(readonly x: number, readonly y: number) {
        //
    }

    distanceTo(coordinate: Coordinate): number {
        return Math.sqrt(Math.pow(coordinate.x - this.x, 2) + Math.pow(coordinate.y - this.y, 2));
    }

    rotateCounterclockwise(angleInDegrees: number): Coordinate {
        if (angleInDegrees === 0) {
            return this;
        }
        const angle: number = angleInDegrees * Math.PI / 180;
        const newX: number = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        const newY: number = this.x * Math.sin(angle) + this.y * Math.cos(angle);
        return new Coordinate(newX, newY);
    }

    translate(distX: number, distY: number): Coordinate {
        const newX: number = this.x + distX;
        const newY: number = this.y + distY;
        return new Coordinate(newX, newY);
    }

    rotateAroundCenter(angleInDegrees: number, center: Coordinate): Coordinate {
        if (angleInDegrees === 0) {
            return this;
        }
        const translated: Coordinate = this.translate(-center.x, -center.y);
        const rotated: Coordinate = translated.rotateCounterclockwise(angleInDegrees);
        return rotated.translate(center.x, center.y);
    }

    newRelativeCoordinate(stepVector: Vector): Coordinate {
        const xCoordinate: number = this.x + stepVector.x;
        const yCoordinate: number = this.y + stepVector.y;
        return new Coordinate(xCoordinate, yCoordinate);
    }

    equals(coordinate: Coordinate): boolean {
        return this.x === coordinate.x && this.y === coordinate.y;
    }

}
import { Vector } from './vector/vector';

export class Coordinate {

    constructor(readonly x: number, readonly y: number) {
        //
    }

    distanceTo(coordinate: Coordinate): number {
        return Math.sqrt(Math.pow(coordinate.x - this.x, 2) + Math.pow(coordinate.y - this.y, 2));
    }

    vectorTo(coordinate: Coordinate): Vector {
        return new Vector(coordinate.x - this.x, coordinate.y - this.y);
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

    stepToNewCoordinate(...steps: Vector[]): Coordinate {
        let xCoordinate: number = this.x;
        let yCoordinate: number = this.y;
        for (const step of steps) {
            xCoordinate += step.x;
            yCoordinate += step.y;
        }
        return new Coordinate(xCoordinate, yCoordinate);
    }

    equals(coordinate: Coordinate): boolean {
        return this.x === coordinate.x && this.y === coordinate.y;
    }

    clone(): Coordinate {
        return new Coordinate(this.x, this.y);
    }

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }

}
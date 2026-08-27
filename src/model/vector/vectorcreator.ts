import { Vector } from './vector';

export const RIGHT: Vector = new Vector(1, 0);
export const UP: Vector = new Vector(0, 1);
export const LEFT: Vector = new Vector(-1, 0);
export const DOWN: Vector = new Vector(0, -1);

export function stepRight(length: number): Vector {
    return RIGHT.times(length);
}

export function stepUpRight(length: number): Vector {
    return Vector.unitVectorInDirection(45).times(length);
}

export function stepUp(length: number): Vector {
    return UP.times(length);
}

export function stepUpLeft(length: number): Vector {
    return Vector.unitVectorInDirection(135).times(length);
}

export function stepLeft(length: number): Vector {
    return LEFT.times(length);
}

export function stepDownLeft(length: number): Vector {
    return Vector.unitVectorInDirection(225).times(length);
}

export function stepDown(length: number): Vector {
    return DOWN.times(length);
}

export function stepDownRight(length: number): Vector {
    return Vector.unitVectorInDirection(315).times(length);
}

export function stepInDirection(angleInDegrees: number, length: number): Vector {
    return Vector.unitVectorInDirection(angleInDegrees).times(length);
}

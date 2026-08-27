import { Coordinate } from '../../coordinate';
import { Segment } from '../../segment';

export class Border extends Segment {

    private _bordersToNeighbour: boolean = false;
    private _isOpen: boolean = false;

    constructor(start: Coordinate, end: Coordinate) {
        super(start, end);
    }
    get bordersToNeighbour(): boolean {
        return this._bordersToNeighbour;
    }
    set bordersToNeighbour(bordersToNeighbour: boolean) {
        this._bordersToNeighbour = bordersToNeighbour;
    }
    get isOpen(): boolean {
        return this._isOpen;
    }
    get isClosed(): boolean {
        return !this.isOpen;
    }

    open(): void {
        this._isOpen = true;
    }
    close(): void {
        this._isOpen = false;
    }

    isAdjacentTo(otherBorder: Border): boolean {
        return this.midpoint.distanceTo(otherBorder.midpoint) < 0.1;
    }

}
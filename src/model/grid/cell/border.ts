import { Coordinate } from '../../coordinate';
import { Segment } from '../../segment';

export class Border extends Segment {

    private _isDuplicate: boolean = false;
    private _bordersToNeighbour: boolean = false;
    private _isOpen: boolean = false;

    constructor(start: Coordinate, end: Coordinate) {
        super(start, end);
    }

    get isDuplicate(): boolean {
        return this._isDuplicate;
    }
    set isDuplicate(isDuplicate: boolean) {
        this._isDuplicate = isDuplicate;
    }
    get bordersToNeighbour(): boolean {
        return this._bordersToNeighbour;
    }
    set bordersToNeighbour(bordersToNeighbour: boolean) {
        this._bordersToNeighbour = bordersToNeighbour;
    }
    get isOpen(): boolean {
        return this._isOpen || this._isDuplicate;
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

    settleCommonBorderWith(otherBorder: Border): void {
        this._bordersToNeighbour = true;
        otherBorder._bordersToNeighbour = true;
        this._isDuplicate = false;
        otherBorder.isDuplicate = true;
    }

}
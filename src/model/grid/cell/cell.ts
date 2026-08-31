import { ArrayOperations } from '../../../service/arrayoperations';
import { Coordinate } from '../../coordinate';
import { Segment } from '../../segment';
import type { Region } from '../region';
import { Border } from './border';
import { Neighbour } from './neighbour';

export class Cell implements Region<Cell> {

    private readonly _center: Coordinate;
    private _visited: boolean = false;
    private _isDead: boolean = false;
    private _neighbours: Neighbour[] = [];
    private _corners: Coordinate[];
    private _borders: Border[] = [];

    constructor(center: Coordinate, corners: Coordinate[]) {
        this._center = center;
        this._corners = corners;
        this._borders = this.createAllBorders();
    }

    private createAllBorders(): Border[] {
        const newBorders: Border[] = [];
        for (let i: number = 0; i < this._corners.length; i++) {
            const lastCorner: boolean = i === this._corners.length - 1;
            if (lastCorner) {
                break;
            }
            newBorders.push(new Border(this._corners[i], this._corners[i + 1]));
        }
        newBorders.push(new Border(this._corners[this._corners.length - 1], this._corners[0]));
        return newBorders;
    }

    getCells(): Cell[] {
        return [this];
    }

    get center(): Coordinate {
        return this._center;
    }

    get visited(): boolean {
        return this._visited;
    }

    set visited(visited: boolean) {
        this._visited = visited;
    }

    get isDead(): boolean {
        return this._isDead;
    }

    get corners(): Coordinate[] {
        return [... this._corners];
    }

    get allBorders(): Border[] {
        return this._borders;
    }

    get closedBorders(): Border[] {
        return this._borders.filter(border => border.isClosed);
    }

    get bordersWithNoNeighbour(): Border[] {
        return this.allBorders.filter(border => !border.bordersToNeighbour);
    }

    get bordersToNeighbour(): Border[] {
        return this.allBorders.filter(border => border.bordersToNeighbour);
    }

    get neighbourCells(): Cell[] {
        return this._neighbours.map(neighbour => neighbour.cell);
    }

    get hasRoomForMoreNeighbours(): boolean {
        return this.neighbourCells.length < this._borders.length;
    }

    get unvisitedNeighbours(): Cell[] {
        return this.neighbourCells.filter(cell => !cell.visited);
    }

    get hasNoUnvisitedNeighbours(): boolean {
        return this.unvisitedNeighbours.length == 0;
    }

    get randomUnvisitedNeighbour(): Cell {
        const randomIndex: number = Math.floor(Math.random() * this.unvisitedNeighbours.length);
        return this.unvisitedNeighbours[randomIndex];
    }

    get connectedNeighbours(): Cell[] {
        return this._neighbours
            .filter(neighbour => neighbour.commonBorder.isOpen)
            .map(neighbour => neighbour.cell);
    }

    get hasNoOpenBorders(): boolean {
        return this._neighbours.every(neighbour => neighbour.commonBorder.isClosed);
    }

    kill(): void {
        this._isDead = true;
        this.disestablishNeighbourRelations();
        this._borders = [];
        this._corners = [];
    }

    establishNeighbourRelationsWith(otherCell: Cell): void {
        if (this.neighbourCells.includes(otherCell)) {
            return;
        }
        const commonBorder: Border = this.findCommonBorderWith(otherCell);
        commonBorder.bordersToNeighbour = true;
        this._neighbours.push(new Neighbour(otherCell, commonBorder));
        otherCell._neighbours.push(new Neighbour(this, commonBorder));
        otherCell.replaceAdjacentBorderWith(commonBorder);
    }

    disestablishNeighbourRelations(): void {
        for (const neighbour of this._neighbours) {
            const otherCell: Cell = neighbour.cell;
            const commonBorder: Border = neighbour.commonBorder;
            commonBorder.bordersToNeighbour = false;
            const index: number = otherCell._neighbours.findIndex(n => n.cell === this);
            if (index !== -1) {
                otherCell._neighbours.splice(index, 1);
            }
        }
        this._neighbours = [];
    }

    private findCommonBorderWith(neighbourCell: Cell): Border {
        for (const ownBorder of this.bordersWithNoNeighbour) {
            for (const otherCellsBorderCandidate of neighbourCell.bordersWithNoNeighbour) {
                if (ownBorder.isAdjacentTo(otherCellsBorderCandidate)) {
                    return ownBorder;
                }
            }
        }
        throw new Error('No common border found between cells');
    }

    private replaceAdjacentBorderWith(newBorder: Border): void {
        const index: number = this._borders.findIndex(border => border.isAdjacentTo(newBorder));
        if (index === -1) {
            throw new Error('Border not found in borders with no neighbour');
        }
        this._borders.splice(index, 1);
        this._borders.push(newBorder);
    }

    openConnectionTo(toCell: Cell): void {
        const neighbour: Neighbour | undefined = this._neighbours.find(neighbour => neighbour.cell === toCell);
        if (neighbour === undefined) {
            throw new Error('No neighbour found to open connection to');
        }
        neighbour.commonBorder.open();
    }

    closeEstablishedConnections(): void {
        for (const neighbour of this._neighbours) {
            neighbour.commonBorder.close();
        }
    }

    hasCommonBorderWith(cell: Cell): boolean {
        return this.allBorders.some(border => {
            return cell.allBorders.some(otherBorder => {
                return border.isAdjacentTo(otherBorder);
            });
        });
    }

    rotateAroundCenter(angle: number, center: Coordinate = this._center): Cell {
        const newCenter: Coordinate = this._center.rotateAroundCenter(angle, center);
        const newCorners: Coordinate[] = this._corners.map(corner => corner.rotateAroundCenter(angle, center));
        return new Cell(newCenter, newCorners);
    }

    mergeWith(otherCell: Cell): Cell {
        const thisCellsCorners: Coordinate[] =
            this.cornersInCounterClockwiseOrder();
        const otherCellsCorners: Coordinate[] =
            otherCell.cornersInCounterClockwiseOrder();

        let newCorners: Coordinate[];
        let newCenter: Coordinate;
        for (let i: number = 0; i < thisCellsCorners.length; i++) {
            const thisCellsRotatedCorners: Coordinate[] = ArrayOperations.rotateArray<Coordinate>(thisCellsCorners, i);
            for (let j: number = 0; j < otherCellsCorners.length; j++) {
                const otherCellsRotatedCorners: Coordinate[] =
                    ArrayOperations.rotateArray<Coordinate>(otherCellsCorners, j);
                if (
                    thisCellsRotatedCorners[0].distanceTo(otherCellsRotatedCorners[1]) < 0.01 &&
                    thisCellsRotatedCorners[1].distanceTo(otherCellsRotatedCorners[0]) < 0.01
                ) {
                    newCenter = new Segment(thisCellsRotatedCorners[0], otherCellsRotatedCorners[0]).midpoint;
                    // removing duplicate corners
                    thisCellsRotatedCorners.shift();
                    otherCellsRotatedCorners.shift();
                    newCorners = [...thisCellsRotatedCorners, ...otherCellsRotatedCorners];
                    break;
                }
            }
        }
        if (newCorners === undefined || newCenter === undefined) {
            throw new Error('No common border found between cells');
        }

        const newCell: Cell = new Cell(newCenter, newCorners);

        //the old neighbours
        const oldCellsAllNeighbours: Neighbour[] = [...new Set([...this._neighbours, ...otherCell._neighbours])];
        const newNeighbourList: Neighbour[] = oldCellsAllNeighbours
            .filter(neighbour => neighbour.cell !== this && neighbour.cell !== otherCell);

        //killing the old cells will remove neighbour relations and free up the borders
        this.kill();
        otherCell.kill();

        //establishing neighbour from the new cell to the old neighbours
        newNeighbourList.forEach(neighbour => {
            neighbour.cell.establishNeighbourRelationsWith(newCell);
        });

        return newCell;
    }

    private cornersInCounterClockwiseOrder(): Coordinate[] {
        if (this.cornersAreInClockwiseOrder()) {
            return this._corners.reverse();
        }
        return this._corners;
    }

    private cornersAreInClockwiseOrder(): boolean {
        const area: number = this.gaussShoelace();
        return area < 0;
    }

    /**
     * Calculates the area of the polygon defined by the corners using the
     * Gauss's shoelace formula.
     * @returns The area of the polygon.
     * if the area is negative, the corners are in clockwise order,
     * if the area is positive, the corners are in counter-clockwise order.
     */
    private gaussShoelace(): number {
        let theSum: number = 0;
        for (let i: number = 0; i < this._corners.length; i++) {
            const j: number = (i + 1) % this._corners.length;
            const x1: number = this._corners[i].x;
            const y1: number = this._corners[i].y;
            const x2: number = this._corners[j].x;
            const y2: number = this._corners[j].y;
            theSum += (x1 * y2) - (x2 * y1);
        }
        const area: number = theSum / 2;
        return area;
    }

}
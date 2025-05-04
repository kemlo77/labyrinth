import { Coordinate } from '../../coordinate';
import { Border } from './border';
import { Neighbour } from './neighbour';

export class Cell {

    private _center: Coordinate;
    private _visited: boolean = false;
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

    get center(): Coordinate {
        return this._center;
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

    get visited(): boolean {
        return this._visited;
    }

    set visited(visited: boolean) {
        this._visited = visited;
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

    establishNeighbourRelationTo(otherCell: Cell): void {
        if (this.neighbourCells.includes(otherCell)) {
            return;
        }
        const commonBorder: Border = this.findCommonBorderWith(otherCell);
        commonBorder.bordersToNeighbour = true;
        this._neighbours.push(new Neighbour(otherCell, commonBorder));
        otherCell._neighbours.push(new Neighbour(this, commonBorder));
        otherCell.replaceAdjacentBorderWith(commonBorder);
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

    rotateAroundCenter(angle: number, center?: Coordinate): Cell {
        if (center === undefined) {
            center = this._center;
        }
        const newCenter: Coordinate = this._center.rotateAroundCenter(angle, center);
        const newCorners: Coordinate[] = this._corners.map(corner => corner.rotateAroundCenter(angle, center));
        return new Cell(newCenter, newCorners);
    }

}
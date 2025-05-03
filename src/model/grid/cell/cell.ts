import { Segment } from '../../segment';
import { Coordinate } from '../../coordinate';
import { Border } from './border';

export class Cell {

    private _center: Coordinate;
    private _visited: boolean = false;
    private _neighbours: Cell[] = [];
    private _connectedNeighbours: Cell[] = [];
    private _corners: Coordinate[];
    private _borders: Border[] = [];

    constructor(center: Coordinate, corners: Coordinate[]) {
        this._center = center;
        this._corners = corners;
        this._borders = this.createBorders();
    }

    private createBorders(): Border[] {
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

    get visited(): boolean {
        return this._visited;
    }

    set visited(visited: boolean) {
        this._visited = visited;
    }

    get neighbours(): Cell[] {
        return this._neighbours;
    }

    get hasRoomForMoreNeighbours(): boolean {
        return this._neighbours.length < this._corners.length;
    }

    get unvisitedNeighbours(): Cell[] {
        return this._neighbours.filter(cell => !cell.visited);
    }

    get hasNoUnvisitedNeighbours(): boolean {
        return this.unvisitedNeighbours.length == 0;
    }

    get randomUnvisitedNeighbour(): Cell {
        const randomIndex: number = Math.floor(Math.random() * this.unvisitedNeighbours.length);
        return this.unvisitedNeighbours[randomIndex];
    }

    establishNeighbourRelationTo(cell: Cell): void {
        this.addNeighbour(cell);
        cell.addNeighbour(this);
        this.settleCommonBordersWith(cell);
    }

    private settleCommonBordersWith(cell: Cell): void {
        for (const ownBorder of this.borders) {
            for (const otherCellsBorderCandidate of cell.borders) {
                if (ownBorder.isAdjacentTo(otherCellsBorderCandidate)) {
                    ownBorder.settleCommonBorderWith(otherCellsBorderCandidate);
                    break;
                }
            }
        }
    }

    private addNeighbour(cell: Cell): void {
        if (this._neighbours.includes(cell)) {
            return;
        }
        this._neighbours.push(cell);
    }

    get connectedNeighbours(): Cell[] {
        return this._connectedNeighbours;
    }


    establishConnectionTo(cell: Cell): void {
        this.addConnection(cell);
        cell.addConnection(this);
        this.openCommonBordersWith(cell);
    }

    private openCommonBordersWith(cell: Cell): void {
        for (const ownBorder of this.borders) {
            for (const otherCellsBorderCandidate of cell.borders) {
                if (ownBorder.isAdjacentTo(otherCellsBorderCandidate)) {
                    ownBorder.open();
                    otherCellsBorderCandidate.open();
                    break;
                }
            }
        }
    }

    private closeCommonBordersWith(cell: Cell): void {
        for (const ownBorder of this.borders) {
            for (const otherCellsBorderCandidate of cell.borders) {
                if (ownBorder.isAdjacentTo(otherCellsBorderCandidate)) {
                    ownBorder.close();
                    otherCellsBorderCandidate.close();
                    break;
                }
            }
        }
    }

    private addConnection(toCell: Cell): void {
        if (this._connectedNeighbours.includes(toCell)) {
            return;
        }
        this._connectedNeighbours.push(toCell);
    }

    removeEstablishedConnections(): void {
        this._connectedNeighbours = [];
        this.closeBorders();
    }

    private closeBorders(): void {
        this._borders.forEach(border => border.close());
    }

    removeConnectionsToCell(): void {
        const connectedCells: Cell[] = [...this.connectedNeighbours];
        connectedCells.forEach(otherCell => {
            this.removeConnection(otherCell);
            otherCell.removeConnection(this);
            this.closeCommonBordersWith(otherCell);
        });
    }

    private removeConnection(toCell: Cell): void {
        this._connectedNeighbours = this._connectedNeighbours.filter(cell => cell !== toCell);
    }

    hasCommonBorderWith(cell: Cell): boolean {
        return this.borders.some(border => {
            return cell.borders.some(otherBorder => {
                return border.isAdjacentTo(otherBorder);
            });
        });
    }

    get corners(): Coordinate[] {
        return [... this._corners];
    }

    get borders(): Border[] {
        return [... this._borders];
    }

    get closedBorders(): Border[] {
        return this._borders.filter(border => border.isClosed);

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
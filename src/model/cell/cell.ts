import { ArrayOperations } from '../../service/arrayoperations';
import { Coordinate } from '../coordinate';
import { Segment } from '../segment';
import type { Region } from '../grid/region';
import { Border } from './border';
import { NeighbourRelation } from './neighbourrelation';

export class Cell implements Region<Cell> {

    private readonly _center: Coordinate;
    private _visited: boolean = false;
    private _isDead: boolean = false;
    private _neighbourRelations: NeighbourRelation[] = [];
    private _vertices: Coordinate[];
    private _borders: Border[] = [];

    constructor(center: Coordinate, vertices: Coordinate[]) {
        this._center = center;
        this._vertices = vertices;
        this._borders = this.createAllBorders();
    }

    private createAllBorders(): Border[] {
        const newBorders: Border[] = [];
        for (let i: number = 0; i < this._vertices.length; i++) {
            const lastVertice: boolean = i === this._vertices.length - 1;
            if (lastVertice) {
                break;
            }
            newBorders.push(new Border(this._vertices[i], this._vertices[i + 1]));
        }
        newBorders.push(new Border(this._vertices[this._vertices.length - 1], this._vertices[0]));
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

    get vertices(): Coordinate[] {
        return [... this._vertices];
    }

    get allBorders(): Border[] {
        return this._borders;
    }

    get closedBorders(): Border[] {
        return this._borders.filter(border => border.isClosed);
    }

    get bordersWithNoNeighbour(): Border[] {
        return this.allBorders.filter(border => !border.isBorderingToNeighbour);
    }

    get bordersToNeighbour(): Border[] {
        return this.allBorders.filter(border => border.isBorderingToNeighbour);
    }

    get neighbourCells(): Cell[] {
        return this._neighbourRelations.map(neighbourRelation => neighbourRelation.neighbourCell);
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
        return this._neighbourRelations
            .filter(neighbourRelation => neighbourRelation.commonBorders.some(border => border.isOpen))
            .map(neighbourRelation => neighbourRelation.neighbourCell);
    }

    get hasNoOpenBorders(): boolean {
        return this._neighbourRelations.every(neighbourRelation =>
            neighbourRelation.commonBorders.every(border => border.isClosed)
        );
    }

    kill(): void {
        this._isDead = true;
        this.disestablishNeighbourRelations();
        this._borders = [];
        this._vertices = [];
    }

    establishNeighbourRelationsWith(otherCell: Cell): void {
        if (this.neighbourCells.includes(otherCell)) {
            return;
        }
        const commonBorders: Border[] = this.findCommonBorderWith(otherCell);
        commonBorders.forEach(border => border.isBorderingToNeighbour = true);
        this._neighbourRelations.push(new NeighbourRelation(otherCell, commonBorders));
        otherCell._neighbourRelations.push(new NeighbourRelation(this, commonBorders));
        otherCell.replaceAdjacentBorderWith(commonBorders);
    }

    disestablishNeighbourRelations(): void {
        for (const neighbourRelation of this._neighbourRelations) {
            const otherCell: Cell = neighbourRelation.neighbourCell;
            neighbourRelation.commonBorders.forEach(border => border.isBorderingToNeighbour = false);
            otherCell.removeNeighbourRelationWith(this);
        }
        this._neighbourRelations = [];
    }

    private removeNeighbourRelationWith(otherCell: Cell): void {
        const index: number = this._neighbourRelations.findIndex(n => n.neighbourCell === otherCell);
        if (index !== -1) {
            this._neighbourRelations.splice(index, 1);
        }
    }

    private findCommonBorderWith(neighbourCell: Cell): Border[] {
        const foundCommonBorders: Border[] = [];

        for (const ownBorder of this.bordersWithNoNeighbour) {
            for (const otherCellsBorderCandidate of neighbourCell.bordersWithNoNeighbour) {
                if (ownBorder.isAdjacentTo(otherCellsBorderCandidate)) {
                    foundCommonBorders.push(ownBorder);
                }
            }
        }
        if (foundCommonBorders.length === 0) {
            throw new Error('No common border found between cells');
        }
        return foundCommonBorders;
    }

    private replaceAdjacentBorderWith(newBorders: Border[]): void {
        for (const newBorder of newBorders) {
            const index: number = this._borders.findIndex(border => border.isAdjacentTo(newBorder));
            if (index === -1) {
                throw new Error('Border not found in borders with no neighbour');
            }
            this._borders.splice(index, 1);
            this._borders.push(newBorder);
        }

    }

    openConnectionTo(toCell: Cell): void {
        const neighbour: NeighbourRelation | undefined =
            this._neighbourRelations.find(neighbourRelation => neighbourRelation.neighbourCell === toCell);
        if (neighbour === undefined) {
            throw new Error('No neighbour found to open connection to');
        }
        //TODO: bara öppna en av borders, inte alla. Slumpmässigt?!
        //neighbour.commonBorders.forEach(border => border.open());
        neighbour.commonBorders[0].open();
    }

    closeEstablishedConnections(): void {
        for (const neighbourRelation of this._neighbourRelations) {
            neighbourRelation.commonBorders.forEach(border => border.close());
        }
    }

    hasCommonBorderWith(cell: Cell): boolean {
        return this.allBorders.some(border => {
            return cell.allBorders.some(otherBorder => {
                return border.isAdjacentTo(otherBorder);
            });
        });
    }

    rotateAroundCoordinate(angle: number, coordinate: Coordinate): Cell {
        const newCenter: Coordinate = this._center.rotateAroundAnotherCoordinate(angle, coordinate);
        const newVertices: Coordinate[] =
            this._vertices.map(vertice => vertice.rotateAroundAnotherCoordinate(angle, coordinate));
        return new Cell(newCenter, newVertices);
    }

    mergeWith(otherCell: Cell): Cell {
        const thisCellsVertices: Coordinate[] =
            this.verticesInCounterClockwiseOrder();
        const otherCellsVertices: Coordinate[] =
            otherCell.verticesInCounterClockwiseOrder();

        let newVertices: Coordinate[];
        let newCenter: Coordinate;
        for (let i: number = 0; i < thisCellsVertices.length; i++) {
            const thisCellsRotatedVertices: Coordinate[] =
                ArrayOperations.rotateArray<Coordinate>(thisCellsVertices, i);
            for (let j: number = 0; j < otherCellsVertices.length; j++) {
                const otherCellsRotatedVertices: Coordinate[] =
                    ArrayOperations.rotateArray<Coordinate>(otherCellsVertices, j);
                if (
                    thisCellsRotatedVertices[0].distanceTo(otherCellsRotatedVertices[1]) < 0.01 &&
                    thisCellsRotatedVertices[1].distanceTo(otherCellsRotatedVertices[0]) < 0.01
                ) {
                    newCenter = new Segment(thisCellsRotatedVertices[0], otherCellsRotatedVertices[0]).midpoint;
                    // removing duplicate vertices
                    thisCellsRotatedVertices.shift();
                    otherCellsRotatedVertices.shift();
                    newVertices = [...thisCellsRotatedVertices, ...otherCellsRotatedVertices];
                    break;
                }
            }
        }
        if (newVertices === undefined || newCenter === undefined) {
            throw new Error('No common border found between cells');
        }

        const newCell: Cell = new Cell(newCenter, newVertices);

        //the old neighbours
        const oldCellsAllNeighbourRelations: NeighbourRelation[] =
            [...new Set([...this._neighbourRelations, ...otherCell._neighbourRelations])];
        const newNeighbourRelationList: NeighbourRelation[] = oldCellsAllNeighbourRelations
            .filter(neighbourRelation => neighbourRelation
                .neighbourCell !== this && neighbourRelation.neighbourCell !== otherCell
            );

        //killing the old cells will remove neighbour relations and free up the borders
        this.kill();
        otherCell.kill();

        //establishing neighbour from the new cell to the old neighbours
        newNeighbourRelationList.forEach(neighbourRelation => {
            neighbourRelation.neighbourCell.establishNeighbourRelationsWith(newCell);
        });

        return newCell;
    }

    private verticesInCounterClockwiseOrder(): Coordinate[] {
        if (this.verticesAreInClockwiseOrder()) {
            return this._vertices.reverse();
        }
        return this._vertices;
    }

    private verticesAreInClockwiseOrder(): boolean {
        const area: number = this.gaussShoelace();
        return area < 0;
    }

    /**
     * Calculates the area of the polygon defined by the vertices using the
     * Gauss's shoelace formula.
     * @returns The area of the polygon.
     * if the area is negative, the vertices are in clockwise order,
     * if the area is positive, the vertices are in counter-clockwise order.
     */
    private gaussShoelace(): number {
        let theSum: number = 0;
        for (let i: number = 0; i < this._vertices.length; i++) {
            const j: number = (i + 1) % this._vertices.length;
            const x1: number = this._vertices[i].x;
            const y1: number = this._vertices[i].y;
            const x2: number = this._vertices[j].x;
            const y2: number = this._vertices[j].y;
            theSum += (x1 * y2) - (x2 * y1);
        }
        const area: number = theSum / 2;
        return area;
    }

}
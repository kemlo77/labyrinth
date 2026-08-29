import { describe, it, expect, beforeEach } from 'vitest';
import { Cell } from '../../../../src/model/grid/cell/cell';
import { Coordinate } from '../../../../src/model/coordinate';
import { CellFactory } from '../../../../src/model/grid/cell/cellfactory';
import { Segment } from '../../../../src/model/segment';

describe('Cell', () => {

    let leftCell: Cell;
    let middleCell: Cell;
    let rightCell: Cell;
    let upperCell: Cell;
    let lowerCell: Cell;

    beforeEach(() => {
        const insertionPoint1: Coordinate = new Coordinate(5, 5);
        leftCell = CellFactory.createCell(insertionPoint1, 10, 'square');

        const insertionPoint2: Coordinate = new Coordinate(15, 5);
        middleCell = CellFactory.createCell(insertionPoint2, 10, 'square');

        const insertionPoint3: Coordinate = new Coordinate(25, 5);
        rightCell = CellFactory.createCell(insertionPoint3, 10, 'square');

        const insertionPoint4: Coordinate = new Coordinate(15, 15);
        upperCell = CellFactory.createCell(insertionPoint4, 10, 'square');

        const insertionPoint5: Coordinate = new Coordinate(15, -5);
        lowerCell = CellFactory.createCell(insertionPoint5, 10, 'square');
    });

    it('establishing neighbour relation between two cells', () => {
        leftCell.establishNeighbourRelationsWith(middleCell);
        expect(leftCell.neighbourCells).to.have.lengthOf(1);
    });

    it('trying to establish neighbour relation twice', () => {
        leftCell.establishNeighbourRelationsWith(middleCell);
        leftCell.establishNeighbourRelationsWith(middleCell);
        expect(leftCell.neighbourCells).to.have.lengthOf(1);
    });

    it('visiting a cell', () => {
        leftCell.visited = true;
        expect(leftCell.visited).to.be.true;
    });

    it('establish neighbour relation between two cells', () => {
        const cell1: Cell = CellFactory.createCell(new Coordinate(10, 10), 10, 'square');
        const cell2: Cell = CellFactory.createCell(new Coordinate(20, 10), 10, 'square');
        cell1.establishNeighbourRelationsWith(cell2);
        expect(cell1.neighbourCells).to.have.lengthOf(1);
        expect(cell2.neighbourCells).to.have.lengthOf(1);
        expect(cell1.connectedNeighbours).to.have.lengthOf(0);
        expect(cell2.connectedNeighbours).to.have.lengthOf(0);
        expect(cell1.unvisitedNeighbours).to.have.lengthOf(1);
        expect(cell2.unvisitedNeighbours).to.have.lengthOf(1);
        expect(cell1.hasNoUnvisitedNeighbours).to.be.false;
        expect(cell2.hasNoUnvisitedNeighbours).to.be.false;
        expect(cell1.allBorders).to.have.lengthOf(4);
        expect(cell2.allBorders).to.have.lengthOf(4);
        expect(cell1.bordersWithNoNeighbour).to.have.lengthOf(3);
        expect(cell2.bordersWithNoNeighbour).to.have.lengthOf(3);
        expect(cell1.bordersToNeighbour[0])
            .to.equal(cell2.bordersToNeighbour[0]);
        expect(cell1.bordersToNeighbour[0].isClosed).to.be.true;
    });

    it('establish neighbour relation between two cells when not close', () => {
        const cell1: Cell = CellFactory.createCell(new Coordinate(10, 10), 10, 'square');
        const cell2: Cell = CellFactory.createCell(new Coordinate(100, 100), 10, 'square');
        expect(() => cell1.establishNeighbourRelationsWith(cell2))
            .to.throw('No common border found between cells');

    });

    it('open connection to a neighbour cell', () => {
        const cell1: Cell = CellFactory.createCell(new Coordinate(10, 10), 10, 'square');
        const cell2: Cell = CellFactory.createCell(new Coordinate(20, 10), 10, 'square');
        cell1.establishNeighbourRelationsWith(cell2);
        expect(cell1.hasNoOpenBorders).to.be.true;
        expect(cell2.hasNoOpenBorders).to.be.true;
        cell1.openConnectionTo(cell2);
        expect(cell1.hasNoOpenBorders).to.be.false;
        expect(cell2.hasNoOpenBorders).to.be.false;
        expect(cell1.connectedNeighbours).to.have.lengthOf(1);
        expect(cell2.connectedNeighbours).to.have.lengthOf(1);
        expect(cell1.connectedNeighbours[0]).to.equal(cell2);
        expect(cell2.connectedNeighbours[0]).to.equal(cell1);
        expect(cell1.bordersWithNoNeighbour).to.have.lengthOf(3);
        expect(cell2.bordersWithNoNeighbour).to.have.lengthOf(3);
        expect(cell1.bordersToNeighbour).to.have.lengthOf(1);
        expect(cell2.bordersToNeighbour).to.have.lengthOf(1);
        expect(cell1.bordersToNeighbour[0].isOpen).to.be.true;
    });

    it('open connection to a neighbour cell twice', () => {
        const cell1: Cell = CellFactory.createCell(new Coordinate(10, 10), 10, 'square');
        const cell2: Cell = CellFactory.createCell(new Coordinate(20, 10), 10, 'square');
        expect(() => cell1.openConnectionTo(cell2)).to.throw('No neighbour found to open connection to');
    });

    it('establish neighbour relation between two cells twice', () => {
        const cell1: Cell = CellFactory.createCell(new Coordinate(10, 10), 10, 'square');
        const cell2: Cell = CellFactory.createCell(new Coordinate(20, 10), 10, 'square');
        cell1.establishNeighbourRelationsWith(cell2);
        cell1.establishNeighbourRelationsWith(cell2);
        expect(cell1.neighbourCells).to.have.lengthOf(1);
        expect(cell2.neighbourCells).to.have.lengthOf(1);
    });

    it('closing all connection a cell has', () => {
        const cell1: Cell = CellFactory.createCell(new Coordinate(10, 10), 10, 'square');
        const cell2: Cell = CellFactory.createCell(new Coordinate(20, 10), 10, 'square');
        cell1.establishNeighbourRelationsWith(cell2);
        cell1.openConnectionTo(cell2);
        expect(cell1.bordersToNeighbour[0].isOpen).to.be.true;
        expect(cell1.connectedNeighbours[0]).to.equal(cell2);
        expect(cell2.connectedNeighbours[0]).to.equal(cell1);

        cell1.closeEstablishedConnections();

        expect(cell1.bordersToNeighbour[0].isOpen).to.be.false;
        expect(cell1.connectedNeighbours).to.have.lengthOf(0);
        expect(cell2.connectedNeighbours).to.have.lengthOf(0);
    });

    it('getting random unvisited neighbour', () => {
        const cell1: Cell = CellFactory.createCell(new Coordinate(10, 10), 10, 'square');
        const cell2: Cell = CellFactory.createCell(new Coordinate(20, 10), 10, 'square');
        cell1.establishNeighbourRelationsWith(cell2);
        expect(cell1.randomUnvisitedNeighbour).to.equal(cell2);
    });

    it('should have correct coordinates', () => {
        expect(leftCell.center.x).to.equal(10);
        expect(leftCell.center.y).to.equal(10);
    });

    it('should have correct corners', () => {
        const corners: Coordinate[] = leftCell.corners;
        expect(corners[0].equals(new Coordinate(5, 5))).to.be.true;
        expect(corners[1].equals(new Coordinate(15, 5))).to.be.true;
        expect(corners[2].equals(new Coordinate(15, 15))).to.be.true;
        expect(corners[3].equals(new Coordinate(5, 15))).to.be.true;
    });

    it('should have 4 borders when no neighbours', () => {
        const borders: Segment[] = leftCell.closedBorders;
        expect(borders).to.have.lengthOf(4);
    });

    it('should have 3 borders when one neighbour', () => {
        leftCell.establishNeighbourRelationsWith(middleCell);
        leftCell.openConnectionTo(middleCell);
        expect(leftCell.closedBorders).to.have.lengthOf(3);
        expect(middleCell.closedBorders).to.have.lengthOf(3);
    });

    it('should have 2 closed borders when two neighbours', () => {
        middleCell.establishNeighbourRelationsWith(leftCell);
        middleCell.establishNeighbourRelationsWith(rightCell);
        middleCell.openConnectionTo(leftCell);
        middleCell.openConnectionTo(rightCell);

        expect(leftCell.closedBorders).to.have.lengthOf(3);
        expect(middleCell.closedBorders).to.have.lengthOf(2);
        expect(rightCell.closedBorders).to.have.lengthOf(3);
    });

    it('should have common border with neighbour', () => {
        expect(leftCell.hasCommonBorderWith(middleCell)).to.be.true;
    });

    it('should not have common border with non-neighbour', () => {
        expect(leftCell.hasCommonBorderWith(rightCell)).to.be.false;
    });

    it('should have room for more neighbours', () => {
        expect(middleCell.hasRoomForMoreNeighbours).to.be.true;
        middleCell.establishNeighbourRelationsWith(leftCell);
        expect(middleCell.hasRoomForMoreNeighbours).to.be.true;
        middleCell.establishNeighbourRelationsWith(rightCell);
        expect(middleCell.hasRoomForMoreNeighbours).to.be.true;
        middleCell.establishNeighbourRelationsWith(upperCell);
        expect(middleCell.hasRoomForMoreNeighbours).to.be.true;
        middleCell.establishNeighbourRelationsWith(lowerCell);
        expect(middleCell.hasRoomForMoreNeighbours).to.be.false;
    });

    it('should rotate cell', () => {
        const cell: Cell = CellFactory.createCell(new Coordinate(10, 10), 10, 'square');
        const originalCorners: Coordinate[] = cell.corners;
        cell.rotateAroundCenter(90);
        const rotatedCorners: Coordinate[] = cell.corners;
        expect(originalCorners[0].equals(rotatedCorners[1])).to.be.false;
        expect(originalCorners[1].equals(rotatedCorners[2])).to.be.false;
        expect(originalCorners[2].equals(rotatedCorners[3])).to.be.false;
        expect(originalCorners[3].equals(rotatedCorners[0])).to.be.false;
    });

    it('kill cell', () => {
        middleCell.establishNeighbourRelationsWith(leftCell);
        middleCell.openConnectionTo(leftCell);
        middleCell.establishNeighbourRelationsWith(rightCell);
        expect(middleCell.isDead).to.be.false;
        expect(middleCell.connectedNeighbours).to.have.lengthOf(1);
        expect(middleCell.hasRoomForMoreNeighbours).to.be.true;
        expect(middleCell.neighbourCells).to.have.lengthOf(2);
        expect(middleCell.allBorders).to.have.lengthOf(4);

        middleCell.kill();
        expect(middleCell.isDead).to.be.true;
        expect(middleCell.allBorders).to.have.lengthOf(0);
        expect(middleCell.closedBorders).to.have.lengthOf(0);
        expect(middleCell.bordersWithNoNeighbour).to.have.lengthOf(0);
        expect(middleCell.bordersToNeighbour).to.have.lengthOf(0);
        expect(middleCell.corners).to.have.lengthOf(0);
        expect(middleCell.connectedNeighbours).to.have.lengthOf(0);
        expect(middleCell.hasRoomForMoreNeighbours).to.be.false;
        expect(middleCell.neighbourCells).to.have.lengthOf(0);
        expect(middleCell.unvisitedNeighbours).to.have.lengthOf(0);
        expect(middleCell.hasNoUnvisitedNeighbours).to.be.true;
        expect(middleCell.randomUnvisitedNeighbour).to.be.undefined;
        expect(() => middleCell.openConnectionTo(leftCell)).to.throw('No neighbour found to open connection to');
        expect(() => middleCell.establishNeighbourRelationsWith(leftCell))
            .to.throw('No common border found between cells');
        expect(() => middleCell.rotateAroundCenter(90)).not.to.throw();
    });

    it('gauss shoelace - clockwise', () => {
        const cell: Cell = new Cell(
            new Coordinate(5, 5),
            [
                new Coordinate(0, 10),
                new Coordinate(10, 10),
                new Coordinate(10, 0),
                new Coordinate(0, 0)
            ]
        );
        const area: number = cell['gaussShoelace']();
        expect(area).to.equal(-100);
        const isClockwise: boolean = cell['cornersAreInClockwiseOrder']();
        expect(isClockwise).to.be.true;
    });

    it('gauss shoelace - counter clockwise', () => {
        const cell: Cell = new Cell(
            new Coordinate(5, 5),
            [
                new Coordinate(0, 0),
                new Coordinate(20, 0),
                new Coordinate(20, 20),
                new Coordinate(0, 20)
            ]
        );
        const area: number = cell['gaussShoelace']();
        expect(area).to.equal(400);
        const isClockwise: boolean = cell['cornersAreInClockwiseOrder']();
        expect(isClockwise).to.be.false;
    });

    [
        { angle1: 0, angle2: 0 },
        { angle1: 0, angle2: 90 },
        { angle1: 0, angle2: 180 },
        { angle1: 0, angle2: 270 },
        { angle1: 90, angle2: 0 },
        { angle1: 90, angle2: 90 },
        { angle1: 90, angle2: 180 },
        { angle1: 90, angle2: 270 },
        { angle1: 180, angle2: 0 },
        { angle1: 180, angle2: 90 },
        { angle1: 180, angle2: 180 },
        { angle1: 180, angle2: 270 },
        { angle1: 270, angle2: 0 },
        { angle1: 270, angle2: 90 },
        { angle1: 270, angle2: 180 },

    ].forEach(testData => {
        it('should merge with another cell', () => {
            const cell1: Cell = CellFactory.createCell(new Coordinate(10, 10), 10, 'square');
            const cell2: Cell = CellFactory.createCell(new Coordinate(20, 10), 10, 'square');
            const rotatedCell1: Cell = cell1.rotateAroundCenter(testData.angle1);
            const rotatedCell2: Cell = cell2.rotateAroundCenter(testData.angle2);
            const newCell: Cell = rotatedCell1.mergeWith(rotatedCell2);
            expect(newCell.center.x).to.equal(20);
            expect(newCell.center.y).to.equal(15);
            expect(newCell.corners).to.have.lengthOf(6);
        });
    });

    it('should not merge with another cell when no common border', () => {
        const cell1: Cell = CellFactory.createCell(new Coordinate(10, 10), 10, 'square');
        const cell2: Cell = CellFactory.createCell(new Coordinate(30, 10), 10, 'square');
        expect(() => cell1.mergeWith(cell2)).to.throw('No common border found between cells');
    });

    it('should carry over neighbour relations when merging cells', () => {
        leftCell.establishNeighbourRelationsWith(middleCell);
        rightCell.establishNeighbourRelationsWith(middleCell);
        upperCell.establishNeighbourRelationsWith(middleCell);

        const newCell: Cell = middleCell.mergeWith(upperCell);

        expect(middleCell.isDead).to.be.true;
        expect(upperCell.isDead).to.be.true;
        expect(newCell.neighbourCells).to.have.lengthOf(2);
        expect(newCell.neighbourCells.includes(leftCell)).to.be.true;
        expect(newCell.neighbourCells.includes(rightCell)).to.be.true;


        expect(leftCell.neighbourCells).to.have.lengthOf(1);
        expect(leftCell.neighbourCells[0]).to.equal(newCell);
        expect(rightCell.neighbourCells).to.have.lengthOf(1);
        expect(rightCell.neighbourCells[0]).to.equal(newCell);
    });



});
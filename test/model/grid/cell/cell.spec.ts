import { expect } from 'chai';
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
        leftCell.establishNeighbourRelationTo(middleCell);
        expect(leftCell.neighbours.length).to.equal(1);
    });

    it('trying to establish neighbour relation twice', () => {
        leftCell.establishNeighbourRelationTo(middleCell);
        leftCell.establishNeighbourRelationTo(middleCell);
        expect(leftCell.neighbours.length).to.equal(1);
    });

    it('visiting a cell', () => {
        leftCell.visited = true;
        expect(leftCell.visited).to.equal(true);
    });

    it('interconnecting two cells', () => {
        const cell1: Cell = CellFactory.createCell(new Coordinate(10, 10), 2, 'square');
        const cell2: Cell = CellFactory.createCell(new Coordinate(20, 20), 2, 'square');
        cell1.establishConnectionTo(cell2);
        expect(cell1.unvisitedNeighbours.length).to.equal(0);
        expect(cell2.unvisitedNeighbours.length).to.equal(0);
        expect(cell1.hasNoUnvisitedNeighbours).to.equal(true);
        expect(cell2.hasNoUnvisitedNeighbours).to.equal(true);
        expect(cell1.connectedNeighbours[0]).to.equal(cell2);
        expect(cell2.connectedNeighbours[0]).to.equal(cell1);
    });

    it('interconnecting two cells twice', () => {
        const cell1: Cell = CellFactory.createCell(new Coordinate(10, 10), 2, 'square');
        const cell2: Cell = CellFactory.createCell(new Coordinate(20, 20), 2, 'square');
        cell1.establishConnectionTo(cell2);
        cell1.establishConnectionTo(cell2);
        expect(cell1.connectedNeighbours.length).to.equal(1);
        expect(cell2.connectedNeighbours.length).to.equal(1);
    });

    it('removing connection between two cells', () => {
        const cell1: Cell = CellFactory.createCell(new Coordinate(10, 10), 2, 'square');
        const cell2: Cell = CellFactory.createCell(new Coordinate(20, 20), 2, 'square');
        cell1.establishConnectionTo(cell2);
        expect(cell1.connectedNeighbours[0]).to.equal(cell2);
        expect(cell2.connectedNeighbours[0]).to.equal(cell1);

        cell1.removeConnectionsToCell();
        expect(cell1.unvisitedNeighbours.length).to.equal(0);
        expect(cell2.unvisitedNeighbours.length).to.equal(0);
        expect(cell1.hasNoUnvisitedNeighbours).to.equal(true);
        expect(cell2.hasNoUnvisitedNeighbours).to.equal(true);
        expect(cell1.connectedNeighbours.length).to.equal(0);
        expect(cell2.connectedNeighbours.length).to.equal(0);
    });

    it('removing all connections a cell has', () => {
        const cell1: Cell = CellFactory.createCell(new Coordinate(10, 10), 2, 'square');
        const cell2: Cell = CellFactory.createCell(new Coordinate(20, 20), 2, 'square');
        cell1.establishConnectionTo(cell2);
        expect(cell1.connectedNeighbours[0]).to.equal(cell2);
        expect(cell2.connectedNeighbours[0]).to.equal(cell1);

        cell1.removeEstablishedConnections();
        expect(cell1.connectedNeighbours.length).to.equal(0);
        expect(cell2.connectedNeighbours.length).to.equal(1);
    });

    it('getting random unvisited neighbour', () => {
        const cell1: Cell = CellFactory.createCell(new Coordinate(10, 10), 2, 'square');
        const cell2: Cell = CellFactory.createCell(new Coordinate(20, 20), 2, 'square');
        cell1.establishNeighbourRelationTo(cell2);
        expect(cell1.randomUnvisitedNeighbour).to.equal(cell2);
    });

    it('should have correct coordinates', () => {
        expect(leftCell.center.x).to.equal(10);
        expect(leftCell.center.y).to.equal(10);
    });

    it('should have correct corners', () => {
        const corners: Coordinate[] = leftCell.corners;
        expect(corners[0].equals(new Coordinate(5, 5))).to.equal(true);
        expect(corners[1].equals(new Coordinate(15, 5))).to.equal(true);
        expect(corners[2].equals(new Coordinate(15, 15))).to.equal(true);
        expect(corners[3].equals(new Coordinate(5, 15))).to.equal(true);
    });

    it('should have 4 borders when no neighbours', () => {
        const borders: Segment[] = leftCell.closedBorders;
        expect(borders.length).to.equal(4);
    });

    it('should have 3 borders when one neighbour', () => {
        leftCell.establishNeighbourRelationTo(middleCell);
        leftCell.establishConnectionTo(middleCell);
        expect(leftCell.closedBorders.length).to.equal(3);
        expect(middleCell.closedBorders.length).to.equal(3);
    });

    it('should have 2 closed borders when two neighbours', () => {
        leftCell.establishNeighbourRelationTo(middleCell);
        leftCell.establishNeighbourRelationTo(rightCell);
        middleCell.establishConnectionTo(leftCell);
        middleCell.establishConnectionTo(rightCell);

        expect(leftCell.closedBorders.length).to.equal(3);
        expect(middleCell.closedBorders.length).to.equal(2);
        expect(rightCell.closedBorders.length).to.equal(3);
    });

    it('should have common border with neighbour', () => {
        expect(leftCell.hasCommonBorderWith(middleCell)).to.equal(true);
    });

    it('should not have common border with non-neighbour', () => {
        expect(leftCell.hasCommonBorderWith(rightCell)).to.equal(false);
    });

    it('should have room for more neighbours', () => {
        expect(middleCell.hasRoomForMoreNeighbours).to.equal(true);
        middleCell.establishNeighbourRelationTo(leftCell);
        expect(middleCell.hasRoomForMoreNeighbours).to.equal(true);
        middleCell.establishNeighbourRelationTo(rightCell);
        expect(middleCell.hasRoomForMoreNeighbours).to.equal(true);
        middleCell.establishNeighbourRelationTo(upperCell);
        expect(middleCell.hasRoomForMoreNeighbours).to.equal(true);
        middleCell.establishNeighbourRelationTo(lowerCell);
        expect(middleCell.hasRoomForMoreNeighbours).to.equal(false);
    });

});
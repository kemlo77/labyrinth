import { expect } from 'chai';
import { RectangularGridCreator } from '../src/model/rectangulargridcreator';
import { Cell } from '../src/model/cell';
import { Grid } from '../src/model/grid';

describe('RectangularGrid', () => {

    it('verifying neighbours', () => {
        const rectGrid: Grid = RectangularGridCreator.createGrid(3, 3, 10);
        const middleCell: Cell = rectGrid.cellMatrix[1][1];
        //south neighbour
        expect(middleCell.neighbours[0].center.x).to.equal(20);
        expect(middleCell.neighbours[0].center.y).to.equal(30);
        //north neighbour
        expect(middleCell.neighbours[1].center.x).to.equal(20);
        expect(middleCell.neighbours[1].center.y).to.equal(10);
        //west neighbour
        expect(middleCell.neighbours[2].center.x).to.equal(10);
        expect(middleCell.neighbours[2].center.y).to.equal(20);
        //east neighbour
        expect(middleCell.neighbours[3].center.x).to.equal(30);
        expect(middleCell.neighbours[3].center.y).to.equal(20);
    });

    it('verifying neighbour count', () => {
        const rectGrid: Grid = RectangularGridCreator.createGrid(3, 3, 10);
        expect(rectGrid.cellMatrix[0].map(cell => cell.neighbours.length)).to.deep.equal([2, 3, 2]);
        expect(rectGrid.cellMatrix[1].map(cell => cell.neighbours.length)).to.deep.equal([3, 4, 3]);
        expect(rectGrid.cellMatrix[2].map(cell => cell.neighbours.length)).to.deep.equal([2, 3, 2]);
    });


    it('verifying top left cell', () => {
        const rectGrid: Grid = RectangularGridCreator.createGrid(3, 3, 10);
        const topLeftCell: Cell = rectGrid.cellMatrix[0][0];
        expect(topLeftCell.center.x).to.equal(10);
        expect(topLeftCell.center.y).to.equal(10);
    });

    it('verifying center cell', () => {
        const rectGrid: Grid = RectangularGridCreator.createGrid(3, 3, 10);
        const centerCell: Cell = rectGrid.cellMatrix[1][1];
        expect(centerCell.center.x).to.equal(20);
        expect(centerCell.center.y).to.equal(20);
    });

    it('verifying right center cell', () => {
        const rectGrid: Grid = RectangularGridCreator.createGrid(3, 3, 10);
        const centerCell: Cell = rectGrid.cellMatrix[1][1];
        expect(centerCell.center.x).to.equal(20);
        expect(centerCell.center.y).to.equal(20);
    });

    it('totalNumberOfCells', () => {
        const rectGrid: Grid = RectangularGridCreator.createGrid(3, 3, 10);
        expect(rectGrid.totalNumberOfCells).to.equal(9);
    });


});
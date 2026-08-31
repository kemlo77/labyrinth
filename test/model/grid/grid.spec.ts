import { describe, it, expect, beforeEach } from 'vitest';
import { Grid } from '../../../src/model/grid/grid';
import { Cell } from '../../../src/model/grid/cell/cell';
import { GridSupplier } from '../../../src/model/grid/gridsupplier';
import { Coordinate } from '../../../src/model/coordinate';
import { RectangularGridProperties }
    from '../../../src/model/grid/gridfactories/rectangular_grids/rectangulargridproperties';
import { StandardGridFactory } from '../../../src/model/grid/gridfactories/rectangular_grids/standardgridfactory';

describe('Grid', () => {
    let grid: Grid;


    beforeEach(() => {
        // Initialize the grid and cells before each test
        grid = GridSupplier.getGrid('test-grid');
    });

    it('should have the correct start cell', () => {
        expect(grid.startCell.center.x).to.equal(5);
        expect(grid.startCell.center.y).to.equal(5);
    });

    it('should have the correct end cell', () => {
        expect(grid.endCell.center.x).to.equal(25);
        expect(grid.endCell.center.y).to.equal(25);
    });

    it('should return all cells', () => {
        expect(grid.allCells).to.have.lengthOf(9);
    });

    it('should return all disconnected cells', () => {
        const allCells: Cell[] = grid.allCells;
        allCells[0].openConnectionTo(allCells[1]);
        expect(grid.allUnconnectedCells).to.have.lengthOf(7);
    });

    it('should have the correct number of cells', () => {
        expect(grid.totalNumberOfCells).to.equal(9);
    });

    it('should have the correct number of visited cells', () => {
        expect(grid.numberOfVisitedCells).to.equal(0);
    });

    it('should reset the grid', () => {
        const allCells: Cell[] = grid.allCells;
        allCells[0].openConnectionTo(allCells[1]);
        allCells.forEach(cell => cell.visited = true);
        grid.resetGrid();
        expect(grid.numberOfVisitedCells).to.equal(0);
        expect(grid.allUnconnectedCells).to.have.lengthOf(9);
    });

    it('should disconnect cells with only one connection', () => {
        const allCells: Cell[] = grid.allCells;
        allCells[0].openConnectionTo(allCells[1]);
        grid.disconnectCellsWithOnlyOneConnection();
        expect(grid.allUnconnectedCells).to.have.lengthOf(9);
    });

    it('should connect to another grid', () => {
        const insertionPoint1: Coordinate = new Coordinate(0, 0);
        const insertionPoint2: Coordinate = new Coordinate(30, 0);
        const gridProperties1: RectangularGridProperties = new RectangularGridProperties(insertionPoint1, 3, 3, 10);
        const gridProperties2: RectangularGridProperties = new RectangularGridProperties(insertionPoint2, 3, 3, 10);
        const grid1: Grid = new StandardGridFactory().createGrid(gridProperties1);
        const grid2: Grid = new StandardGridFactory().createGrid(gridProperties2);
        expect(grid1.allCells.filter(cell => cell.neighbourCells.length === 2)).to.have.lengthOf(4);
        expect(grid1.allCells.filter(cell => cell.neighbourCells.length === 3)).to.have.lengthOf(4);
        expect(grid1.allCells.filter(cell => cell.neighbourCells.length === 4)).to.have.lengthOf(1);
        expect(grid2.allCells.filter(cell => cell.neighbourCells.length === 2)).to.have.lengthOf(4);
        expect(grid2.allCells.filter(cell => cell.neighbourCells.length === 3)).to.have.lengthOf(4);
        expect(grid2.allCells.filter(cell => cell.neighbourCells.length === 4)).to.have.lengthOf(1);

        grid1.establishNeighbourRelationsWith(grid2);
        expect(grid1.allCells.filter(cell => cell.neighbourCells.length === 2)).to.have.lengthOf(2);
        expect(grid1.allCells.filter(cell => cell.neighbourCells.length === 3)).to.have.lengthOf(5);
        expect(grid1.allCells.filter(cell => cell.neighbourCells.length === 4)).to.have.lengthOf(2);
        expect(grid2.allCells.filter(cell => cell.neighbourCells.length === 2)).to.have.lengthOf(2);
        expect(grid2.allCells.filter(cell => cell.neighbourCells.length === 3)).to.have.lengthOf(5);
        expect(grid2.allCells.filter(cell => cell.neighbourCells.length === 4)).to.have.lengthOf(2);
    });

    it('should not connect to another grid', () => {
        const insertionPoint1: Coordinate = new Coordinate(0, 0);
        const insertionPoint2: Coordinate = new Coordinate(31, 0);
        const gridProperties1: RectangularGridProperties = new RectangularGridProperties(insertionPoint1, 3, 3, 10);
        const gridProperties2: RectangularGridProperties = new RectangularGridProperties(insertionPoint2, 3, 3, 10);
        const grid1: Grid = new StandardGridFactory().createGrid(gridProperties1);
        const grid2: Grid = new StandardGridFactory().createGrid(gridProperties2);
        expect(grid1.allCells.filter(cell => cell.neighbourCells.length === 2)).to.have.lengthOf(4);
        expect(grid1.allCells.filter(cell => cell.neighbourCells.length === 3)).to.have.lengthOf(4);
        expect(grid1.allCells.filter(cell => cell.neighbourCells.length === 4)).to.have.lengthOf(1);
        expect(grid2.allCells.filter(cell => cell.neighbourCells.length === 2)).to.have.lengthOf(4);
        expect(grid2.allCells.filter(cell => cell.neighbourCells.length === 3)).to.have.lengthOf(4);
        expect(grid2.allCells.filter(cell => cell.neighbourCells.length === 4)).to.have.lengthOf(1);

        grid1.establishNeighbourRelationsWith(grid2);
        expect(grid1.allCells.filter(cell => cell.neighbourCells.length === 2)).to.have.lengthOf(4);
        expect(grid1.allCells.filter(cell => cell.neighbourCells.length === 3)).to.have.lengthOf(4);
        expect(grid1.allCells.filter(cell => cell.neighbourCells.length === 4)).to.have.lengthOf(1);
        expect(grid2.allCells.filter(cell => cell.neighbourCells.length === 2)).to.have.lengthOf(4);
        expect(grid2.allCells.filter(cell => cell.neighbourCells.length === 3)).to.have.lengthOf(4);
        expect(grid2.allCells.filter(cell => cell.neighbourCells.length === 4)).to.have.lengthOf(1);
    });


});

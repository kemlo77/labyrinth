import { describe, it, expect } from 'vitest';
import { HexagonsGridFactory }
    from '../../../../../src/model/grid/gridfactories/rectangular_grids/hexagonsgridfactory';
import { Grid } from '../../../../../src/model/grid/grid';
import { Coordinate } from '../../../../../src/model/coordinate';
import { RectangularGridProperties }
    from '../../../../../src/model/grid/gridfactories/rectangular_grids/rectangulargridproperties';
import { Segment } from '../../../../../src/model/segment';
import { OctagonsGridFactory } from '../../../../../src/model/grid/gridfactories/rectangular_grids/octagonsgridfactory';
import { StandardGridFactory } from '../../../../../src/model/grid/gridfactories/rectangular_grids/standardgridfactory';
import { TrianglesGridFactory } from
    '../../../../../src/model/grid/gridfactories/rectangular_grids/trianglesgridfactory';
import { DiagonalSquaresGridFactory } from
    '../../../../../src/model/grid/gridfactories/rectangular_grids/diagonalsquaresgridfactory';
import { RunningBondGridFactory } from
    '../../../../../src/model/grid/gridfactories/rectangular_grids/runningbondgridfactory';
import { RectangularGridFactory } from
    '../../../../../src/model/grid/gridfactories/rectangular_grids/rectangulargridfactory.interface';

describe('RectangularGridFactories labyrint-generation', () => {

    const insertionPoint: Coordinate = new Coordinate(0, 0);
    const hexagonalgridfactory: HexagonsGridFactory = new HexagonsGridFactory();
    const octagonalGridFactory: OctagonsGridFactory = new OctagonsGridFactory();
    const squaregridfactory: StandardGridFactory = new StandardGridFactory();
    const triangularGridFactory: TrianglesGridFactory = new TrianglesGridFactory();
    const diagonalSquareGridFactory: DiagonalSquaresGridFactory = new DiagonalSquaresGridFactory();
    const runningBondGridFactory: RunningBondGridFactory = new RunningBondGridFactory();
    const gridProperties1: RectangularGridProperties = new RectangularGridProperties(insertionPoint, 5, 5, 10);
    const gridProperties2: RectangularGridProperties = new RectangularGridProperties(insertionPoint, 6, 6, 10, 20);
    const gridProperties3: RectangularGridProperties = new RectangularGridProperties(insertionPoint, 6, 1, 10);
    const gridProperties4: RectangularGridProperties = new RectangularGridProperties(insertionPoint, 1, 6, 10);
    const testGridProperties: RectangularGridProperties[] =
        [gridProperties1, gridProperties2, gridProperties3, gridProperties4];
    const rectangularGridFactory: RectangularGridFactory[] =
        [
            hexagonalgridfactory,
            octagonalGridFactory,
            squaregridfactory,
            triangularGridFactory,
            diagonalSquareGridFactory,
            runningBondGridFactory
        ];


    testGridProperties.forEach(gridProperty => {
        rectangularGridFactory.forEach(gridfactory => {
            it(gridfactory.constructor.name + ' - generateLabyrint', () => {
                const grid: Grid = gridfactory.createGrid(gridProperty);
                const solutionTrail: Segment[] = grid.generateMaze();
                expect(solutionTrail.length).toBeGreaterThan(0);
            });
        });

    });


});
import { Coordinate } from '../../../coordinate';
import { Vector } from '../../../vector/vector';
import { stepRight, stepUp } from '../../../vector/vectorcreator';
import { Grid } from '../../grid';
import { DiagonalSquaresGridFactory } from '../rectangular_grids/diagonalsquaresgridfactory';
import { RectangularGridProperties } from '../rectangular_grids/rectangulargridproperties';
import { StandardGridFactory } from '../rectangular_grids/standardgridfactory';
import { ComplexGridFactory } from './complexgridfactory.interface';
import { ComplexGridProperties } from './complexgridproperties';

export class SwedishFlagGridFactory implements ComplexGridFactory {

    createGrid(gridProperties: ComplexGridProperties): Grid {
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;
        const mult: number = 3;
        const rightStep: Vector = stepRight(cellWidth);
        const upStep: Vector = stepUp(cellWidth);

        const w1: number = 5 * mult;
        const w2: number = 2 * mult;
        const w3: number = 9 * mult;
        const w4: number = 16 * mult;
        const h1: number = 4 * mult;
        const h2: number = 2 * mult;


        const insertionPoint1: Coordinate = gridProperties.insertionPoint;

        const insertionPoint4: Coordinate = insertionPoint1.stepToNewCoordinate(upStep.times(h1));
        const insertionPoint5: Coordinate = insertionPoint1.stepToNewCoordinate(upStep.times(h1 + h2));

        const firstRowGrid: Grid = createEdgeGrid(insertionPoint1);
        const secondRowGrid: Grid = createMiddleRowGrid(insertionPoint4);
        const thirdRowGrid: Grid = createEdgeGrid(insertionPoint5);

        return firstRowGrid.mergeWith(secondRowGrid).mergeWith(thirdRowGrid);

        function createMiddleRowGrid(insertionPoint: Coordinate): Grid {
            const gridProperties4: RectangularGridProperties =
                new RectangularGridProperties(insertionPoint, w4, h2, cellWidth);
            return new StandardGridFactory().createGrid(gridProperties4);
        }

        function createEdgeGrid(insertionPoint: Coordinate): Grid {
            const insertionPoint2: Coordinate = insertionPoint.stepToNewCoordinate(rightStep.times(w1));
            const insertionPoint3: Coordinate = insertionPoint.stepToNewCoordinate(rightStep.times(w1 + w2));
            const gridProperties1: RectangularGridProperties =
                new RectangularGridProperties(insertionPoint, w1, h1, cellWidth);
            const gridProperties2: RectangularGridProperties =
                new RectangularGridProperties(insertionPoint2, w2, h1, cellWidth);
            const gridProperties3: RectangularGridProperties =
                new RectangularGridProperties(insertionPoint3, w3, h1, cellWidth);
            const grid1: Grid = new DiagonalSquaresGridFactory().createGrid(gridProperties1);
            const grid2: Grid = new StandardGridFactory().createGrid(gridProperties2);
            const grid3: Grid = new DiagonalSquaresGridFactory().createGrid(gridProperties3);
            return grid1.mergeWith(grid2).mergeWith(grid3);
        }


    }

}
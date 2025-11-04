import { Coordinate } from '../../../coordinate';
import { Vector } from '../../../vector/vector';
import { stepRight, stepUp } from '../../../vector/vectorcreator';
import { Cell } from '../../cell/cell';
import { CellFactory } from '../../cell/cellfactory';
import { Grid } from '../../grid';
import { GridFactory } from '../gridfactory';

export class GridFragmentFactory extends GridFactory {

    createKiteGridFragment(insertionPoint: Coordinate, angle: number, sideLength: number): Grid {
        const leftCorner: Coordinate = insertionPoint;
        const gridWidth: number = sideLength;
        const gridHeight: number = sideLength * Math.sqrt(3) / 2;
        const cellWidth: number = sideLength / 2;

        const stepToRightCorner: Vector = stepRight(gridWidth).newRotatedVector(angle);
        const stepToTopCorner: Vector = stepRight(gridWidth / 2).then(stepUp(gridHeight)).newRotatedVector(angle);
        const stepToGridCenter: Vector = stepRight(gridWidth / 2).then(stepUp(gridHeight / 3)).newRotatedVector(angle);

        const rightCorner: Coordinate = leftCorner.stepToNewCoordinate(stepToRightCorner);
        const topCorner: Coordinate = leftCorner.stepToNewCoordinate(stepToTopCorner);
        const gridCenter: Coordinate = leftCorner.stepToNewCoordinate(stepToGridCenter);

        const leftCell: Cell = CellFactory.createCell(leftCorner, cellWidth, 'kite', angle);
        const rightCell: Cell = CellFactory.createCell(rightCorner, cellWidth, 'kite', angle + 120);
        const topCell: Cell = CellFactory.createCell(topCorner, cellWidth, 'kite', angle + 240);

        leftCell.establishNeighbourRelationsWith(rightCell);
        rightCell.establishNeighbourRelationsWith(topCell);
        topCell.establishNeighbourRelationsWith(leftCell);

        const startCell: Cell = leftCell;
        const endCell: Cell = rightCell;
        const cells: Cell[] = [leftCell, rightCell, topCell];
        return new Grid(cells, startCell, endCell, gridCenter);
    }

    createTriakisGridFragment(insertionPoint: Coordinate, angle: number, sideLength: number): Grid {
        const leftCorner: Coordinate = insertionPoint;
        const gridWidth: number = sideLength;
        const gridHeight: number = gridWidth * Math.sqrt(3) / 2;

        const stepToRightCorner: Vector = stepRight(gridWidth).newRotatedVector(angle);
        const stepToTopCorner: Vector = stepRight(gridWidth / 2).then(stepUp(gridHeight)).newRotatedVector(angle);
        const stepToGridCenter: Vector = stepRight(gridWidth / 2).then(stepUp(gridHeight / 3)).newRotatedVector(angle);

        const rightCorner: Coordinate = leftCorner.stepToNewCoordinate(stepToRightCorner);
        const topCorner: Coordinate = leftCorner.stepToNewCoordinate(stepToTopCorner);
        const gridCenter: Coordinate = leftCorner.stepToNewCoordinate(stepToGridCenter);

        const bottomCell: Cell = CellFactory.createCell(leftCorner, gridWidth, 'triakis-triangle', angle);
        const rightCell: Cell = CellFactory.createCell(rightCorner, gridWidth, 'triakis-triangle', angle + 120);
        const leftCell: Cell = CellFactory.createCell(topCorner, gridWidth, 'triakis-triangle', angle + 240);

        bottomCell.establishNeighbourRelationsWith(rightCell);
        rightCell.establishNeighbourRelationsWith(leftCell);
        leftCell.establishNeighbourRelationsWith(bottomCell);

        const startCell: Cell = bottomCell;
        const endCell: Cell = rightCell;
        const cells: Cell[] = [leftCell, rightCell, bottomCell];
        return new Grid(cells, startCell, endCell, gridCenter);

    }

}
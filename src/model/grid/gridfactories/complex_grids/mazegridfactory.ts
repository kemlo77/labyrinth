import type { MazeGenerationAlgorithm } from '../../../algorithm/algorithm';
import { RecursiveBacktrackerAlgorithm } from '../../../algorithm/recursivebacktracker';
import { Coordinate } from '../../../coordinate';
import { Vector } from '../../../vector/vector';
import { stepRight, stepDown } from '../../../vector/vectorcreator';
import { Cell } from '../../../cell/cell';
import { Grid } from '../../grid';
import type { SimpleGridCreator } from '../../../typealiases';
import { RectangularGridProperties } from '../rectangular_grids/rectangulargridproperties';
import { StandardGridFactory } from '../rectangular_grids/standardgridfactory';
import { RegularShapedGridProperties } from '../regular_shaped_grids/regularshapedgridproperties';
import { SquareGridFactory } from '../regular_shaped_grids/squaregridfactory';

export class MazeGridFactory {

    private readonly _algorithm: MazeGenerationAlgorithm = new RecursiveBacktrackerAlgorithm();
    private _cellsInNewGrid!: Cell[];
    private _startCell!: Cell;
    private _endCell!: Cell;



    createGrid(
        insertionPoint: Coordinate,
        outerColumns: number,
        outerRows: number,
        subdivisions: number,
        sideLength: number): Grid {

        this._cellsInNewGrid = [];

        //Template Grid
        const anyLength: number = 20; //since the size of the large grid is not important
        const templateGrid: Grid = new StandardGridFactory()
            .createGrid(new RectangularGridProperties(insertionPoint, outerColumns, outerRows, anyLength));
        templateGrid.generateMaze();

        //New Grid
        this.generateNewGrid(insertionPoint, subdivisions, sideLength, templateGrid);
        return new Grid(this._cellsInNewGrid, this._startCell, this._endCell);
    }

    private generateNewGrid(
        insertionPoint: Coordinate,
        subDivisions: number,
        cellSideLength: number,
        largeGrid: Grid,
    ): void {
        //Seed Grid
        const gridProperties: RegularShapedGridProperties =
            new RegularShapedGridProperties(insertionPoint, subDivisions, cellSideLength);
        const seedGrid: Grid = new SquareGridFactory().createGrid(gridProperties);

        //Saving to new Grid
        this._startCell = seedGrid.startCell;
        this._cellsInNewGrid.push(...seedGrid.allCells);

        //Add steps fron Seed
        largeGrid.startCell.connectedNeighbours.forEach((neighbour: Cell) => {

            this.addNextGridStep(
                seedGrid,
                largeGrid.startCell,
                neighbour,
                largeGrid.endCell,
                cellSideLength,
                subDivisions
            );
        });

    }

    private addNextGridStep(
        previousGrid: Grid,
        previousTemplateGridCell: Cell,
        currentTemplateGridCell: Cell,
        endCell: Cell,
        cellSideLength: number,
        subDivisions: number
    ): void {
        const gridOffset: number = 2;
        const gridWidth: number = cellSideLength * subDivisions;

        const directionFromPreviousToCurrentCell: Vector =
            previousTemplateGridCell.center.vectorTo(currentTemplateGridCell.center);


        const currentGridInsertionPoint: Coordinate = previousGrid.center
            .stepToNewCoordinate(
                stepDown(gridWidth / 2)
                    .thenTake(stepRight(gridWidth / 2))
                    .newRotatedVector(directionFromPreviousToCurrentCell.direction)
            );
        const gridProperties: RectangularGridProperties = new RectangularGridProperties(
            currentGridInsertionPoint,
            subDivisions + gridOffset,
            subDivisions,
            cellSideLength,
            directionFromPreviousToCurrentCell.direction
        );
        const currentGrid: Grid = new StandardGridFactory().createGrid(gridProperties);
        const newGridCenter: Coordinate = previousGrid.center
            .stepToNewCoordinate(stepRight(gridWidth + cellSideLength * gridOffset).newRotatedVector(directionFromPreviousToCurrentCell.direction));
        currentGrid.center = newGridCenter;

        currentGrid.establishNeighbourRelationsWith(previousGrid);


        if (currentTemplateGridCell == endCell) {
            this._endCell = currentGrid.topRightCell;
        }

        this._cellsInNewGrid.push(...currentGrid.allCells);

        //recursive call
        currentTemplateGridCell.connectedNeighbours
            .filter((templateGridNeighbour: Cell) => templateGridNeighbour !== previousTemplateGridCell)
            .forEach((templateGridNeighbour: Cell) => {
                this.addNextGridStep(
                    currentGrid,
                    currentTemplateGridCell,
                    templateGridNeighbour,
                    endCell,
                    cellSideLength,
                    subDivisions
                );
            });
    }



}
import { MazeGenerationAlgorithm } from '../../../algorithm/algorithm';
import { RecursiveBacktrackerAlgorithm } from '../../../algorithm/recursivebacktracker';
import { Coordinate } from '../../../coordinate';
import { Vector } from '../../../vector/vector';
import { stepRight, stepDown, RIGHT, UP, LEFT, DOWN } from '../../../vector/vectorcreator';
import { Cell } from '../../cell/cell';
import { Grid } from '../../grid';
import { GridCreator } from '../../typealiases';
import { RectangularGridProperties } from '../rectangular_grids/rectangulargridproperties';
import { StandardGridFactory } from '../rectangular_grids/standardgridfactory';
import { RegularShapedGridProperties } from '../regular_shaped_grids/regularshapedgridproperties';
import { SquareGridFactory } from '../regular_shaped_grids/squaregridfactory';

export class MazeGridFactory {

    private readonly _algorithm: MazeGenerationAlgorithm = new RecursiveBacktrackerAlgorithm();
    private _cellsInNewGrid: Cell[];
    private _startCell: Cell;
    private _endCell: Cell;



    createGrid(
        insertionPoint: Coordinate,
        outerColumns: number,
        outerRows: number,
        subdivisions: number,
        sideLength: number): Grid {


        this._cellsInNewGrid = [];
        const anyLength: number = 20; //since the size of the large grid is not important

        const largeGrid: Grid = new StandardGridFactory()
            .createGrid(new RectangularGridProperties(insertionPoint, outerColumns, outerRows, anyLength));

        largeGrid.generateMaze();

        this.generateNewGrid(insertionPoint, largeGrid, subdivisions, sideLength);
        return new Grid(this._cellsInNewGrid, this._startCell, this._endCell);
    }

    private generateNewGrid(
        insertionPoint: Coordinate,
        largeGrid: Grid,
        subDivisions: number,
        cellSideLength: number
    ): void {
        const gridProperties: RegularShapedGridProperties =
            new RegularShapedGridProperties(insertionPoint, subDivisions, cellSideLength);
        const startGrid: Grid = new SquareGridFactory()
            .createGrid(gridProperties);
        this._startCell = startGrid.startCell;
        this._cellsInNewGrid.push(...startGrid.allCells);

        largeGrid.startCell.connectedNeighbours.forEach((neighbour: Cell) => {

            this.addNextGridStep(
                startGrid,
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
        const gridWidth: number = cellSideLength * subDivisions;

        const directionFromPreviousToCurrentCell: Vector =
            previousTemplateGridCell.center.vectorTo(currentTemplateGridCell.center);


        const createGrid: GridCreator = (neighbourGridCenter: Coordinate, angle: number) => {
            const gridInsertionPoint: Coordinate = neighbourGridCenter
                .stepToNewCoordinate(
                    stepDown(gridWidth / 2)
                        .then(stepRight(gridWidth / 2))
                        .newRotatedVector(angle)
                );
            const gridProperties: RectangularGridProperties = new RectangularGridProperties(
                gridInsertionPoint,
                subDivisions + 1,
                subDivisions,
                cellSideLength,
                angle
            );
            const newGrid: Grid = new StandardGridFactory().createGrid(gridProperties);
            const newGridCenter: Coordinate = neighbourGridCenter
                .stepToNewCoordinate(stepRight(gridWidth + cellSideLength).newRotatedVector(angle));
            newGrid.center = newGridCenter;
            return newGrid;
        };


        let currentGrid: Grid;

        if (directionFromPreviousToCurrentCell.hasDirection(0)) {
            currentGrid = createGrid(previousGrid.center, 0);
        }

        if (directionFromPreviousToCurrentCell.hasDirection(90)) {
            currentGrid = createGrid(previousGrid.center, 90);
        }

        if (directionFromPreviousToCurrentCell.hasDirection(180)) {
            currentGrid = createGrid(previousGrid.center, 180);
        }

        if (directionFromPreviousToCurrentCell.hasDirection(270)) {
            currentGrid = createGrid(previousGrid.center, 270);
        }

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
import { Grid } from '../../grid';
import { Coordinate } from '../../../coordinate';
import { RectangularGridProperties } from '../rectangular_grids/rectangulargridproperties';
import { stepDown, stepRight, stepUp } from '../../../vector/vectorcreator';
import { Cell } from '../../cell/cell';
import { DiagonalSquaresGridFactory } from '../rectangular_grids/diagonalsquaresgridfactory';

export class TiltedTrailGridFactory {

    createSpiralGrid(
        insertionPoint: Coordinate,
        width: number,
        height: number,
        cellsPerSide: number,
        cellOffset: number,
        cellWidth: number
    ): Grid {
        const stepAngleSequence: number[] = this.createSpiralStepAngleSequence(width, height);
        return this.createTrailingGrid(insertionPoint, stepAngleSequence, cellsPerSide, cellWidth, cellOffset);
    }

    createWaveGrid(
        insertionPoint: Coordinate,
        width: number,
        height: number,
        cellsPerSide: number,
        cellOffset: number,
        cellWidth: number
    ): Grid {
        const stepAngleSequence: number[] = this.createWaveStepAngleSequence(width, height);
        return this.createTrailingGrid(insertionPoint, stepAngleSequence, cellsPerSide, cellWidth, cellOffset);
    }

    createWaveStepAngleSequence(width: number, height: number): number[] {
        const angleSequence: number[] = [];

        for (let i: number = 0; i < width; i++) {
            if (i % 2 === 0) {

                angleSequence.push(...new Array(height - 1).fill(90));
            } else {
                angleSequence.push(...new Array(height - 1).fill(270));
            }
            if (i < width - 1) {
                angleSequence.push(0);
            }

        }
        return angleSequence;
    }

    createSpiralStepAngleSequence(width: number, height: number): number[] {
        const angleSequence: number[] = [];
        let stepsLeft: number = width * height;
        let xSteps: number = width;
        let ySteps: number = height - 1;
        let angle: number = 0;
        while (stepsLeft > 0) {
            if (xSteps > 0) {
                angleSequence.push(...new Array(xSteps).fill(angle));
                stepsLeft -= xSteps;
                xSteps -= 1;
            }
            if (ySteps > 0) {
                angleSequence.push(...new Array(ySteps).fill(angle + 90));
                stepsLeft -= ySteps;
                ySteps -= 1;
            }

            angle = (angle + 180) % 360;
        }
        angleSequence.shift();
        return angleSequence;
    }

    createTrailingGrid(
        insertionPoint: Coordinate,
        stepAngleSequence: number[],
        cellsPerSide: number,
        cellWidth: number,
        cellOffset: number
    ): Grid {
        const cellsInNewGrid: Cell[] = [];
        //create start grid block
        const startGridBlock: Grid = this.createSquareGridBlock(insertionPoint, cellsPerSide, cellWidth);
        const startCell: Cell = startGridBlock.startCell;
        cellsInNewGrid.push(...startGridBlock.allCells);


        //create the consequtive grid blocks
        let previousGridBlock: Grid = startGridBlock;

        stepAngleSequence.forEach((angle: number) => {
            const nextGridBlock: Grid = this.createConsecutiveGridBlock(previousGridBlock.center, cellsPerSide,
                cellWidth, cellOffset, angle);
            const mergedCells: Cell[] = previousGridBlock.mergeNeighbouringCells(nextGridBlock);
            cellsInNewGrid.push(...nextGridBlock.allCells);
            cellsInNewGrid.push(...mergedCells);
            previousGridBlock = nextGridBlock;
        });
        const endCell: Cell = previousGridBlock.endCell;

        //merging cells will result in some cells being dead, so we filter them out
        const aliveCells: Cell[] = cellsInNewGrid.filter(cell => !cell.isDead);

        return new Grid(aliveCells, startCell, endCell);
    }

    createSquareGridBlock(insertionPoint: Coordinate, cellsPerSide: number, cellWidth: number): Grid {
        const gridWidth: number = cellWidth * cellsPerSide;
        const gridProperties: RectangularGridProperties =
            new RectangularGridProperties(insertionPoint, cellsPerSide, cellsPerSide, cellWidth);
        const squareGrid: Grid = new DiagonalSquaresGridFactory().createGrid(gridProperties);
        const center: Coordinate = insertionPoint.stepToNewCoordinate(
            stepRight(gridWidth / 2).thenTake(stepUp(gridWidth / 2))
        );
        squareGrid.center = center;
        return squareGrid;
    }

    createConsecutiveGridBlock(
        neighbourGridCenter: Coordinate,
        numberOfCellsInWidth: number,
        cellWidth: number,
        gridOffset: number,
        angle: number
    ): Grid {
        const theWidth: number = cellWidth * numberOfCellsInWidth;
        const gridInsertionPoint: Coordinate = neighbourGridCenter
            .stepToNewCoordinate(
                stepDown(theWidth / 2)
                    .thenTake(stepRight(theWidth / 2))
                    .newRotatedVector(angle)
            );
        const gridProperties: RectangularGridProperties = new RectangularGridProperties(
            gridInsertionPoint,
            numberOfCellsInWidth + gridOffset,
            numberOfCellsInWidth,
            cellWidth,
            angle
        );
        const newGrid: Grid = new DiagonalSquaresGridFactory().createGrid(gridProperties);
        const newGridCenter: Coordinate = neighbourGridCenter
            .stepToNewCoordinate(stepRight(theWidth + cellWidth * gridOffset).newRotatedVector(angle));
        newGrid.center = newGridCenter;
        return newGrid;
    }

}

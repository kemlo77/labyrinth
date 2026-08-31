import { Cell } from '../grid/cell/cell';
import { Grid } from '../grid/grid';
import { Segment } from '../segment';
import type { MazeGenerationAlgorithm } from './algorithm';

export class RecursiveBacktrackerAlgorithm implements MazeGenerationAlgorithm {

    public generateMaze(grid: Grid): Segment[] {
        const sequenceOfVisitedCells: Cell[] = [grid.startCell];
        let solutionCellSequence: Cell[] = [];


        let numberOfVisitedCells: number = grid.numberOfVisitedCells;
        while (numberOfVisitedCells < grid.totalNumberOfCells) {
            while (currentCell().hasNoUnvisitedNeighbours && visitedStackIsNotEmpty()) {
                stepBackwards();
            }
            stepToRandomUnvisitedNeighbour();
            numberOfVisitedCells++;
        }
        return solutionTrail();



        function currentCell(): Cell {
            return sequenceOfVisitedCells[sequenceOfVisitedCells.length - 1];
        }

        function visitedStackIsNotEmpty(): boolean {
            return sequenceOfVisitedCells.length != 0;
        }

        function stepBackwards(): void {
            sequenceOfVisitedCells.pop();
        }

        function stepToRandomUnvisitedNeighbour(): void {
            const nextCell: Cell = currentCell().randomUnvisitedNeighbour;
            nextCell.visited = true;
            currentCell().openConnectionTo(nextCell);
            sequenceOfVisitedCells.push(nextCell);
            if (nextCell === grid.endCell) {
                solutionCellSequence = [...sequenceOfVisitedCells];
            }
        }

        function solutionTrail(): Segment[] {
            const solutionTrail: Segment[] = [];
            for (let index: number = 0; index < solutionCellSequence.length - 1; index++) {
                const currentCell: Cell = solutionCellSequence[index];
                const nextCell: Cell = solutionCellSequence[index + 1];
                solutionTrail.push(new Segment(currentCell.center, nextCell.center));
            }
            return solutionTrail;
        }

    }

}
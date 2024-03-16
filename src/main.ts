import './style.css';
import { Controller } from './controller';
import { Model } from './model/model';
import { SquareGridCreator } from './model/grid/squaregridcreator';
import { HexagonalGridCreator } from './model/grid/hexagonalgridcreator';
import { BoxedView } from './view/boxedview';
import { TriangularGridCreator } from './model/grid/triangulargridcreator';
import { OctagonalGridCreator } from './model/grid/octagonalgridcreator';

const model: Model = new Model();
const controller: Controller = new Controller(model);

document.getElementById('squareMazeButton').addEventListener('click', () => createSquareMaze());
document.getElementById('hexagonalMazeButton').addEventListener('click', () => createHexagonalMaze());
document.getElementById('triangularMazeButton').addEventListener('click', () => createTriangularMaze());
document.getElementById('octagonalMazeButton').addEventListener('click', () => createOctagonalMaze());

document.getElementById('simplifyButton').addEventListener('click', () => model.reduceSomeComplexity());
document.getElementById('showTrailButton').addEventListener('click', () => model.showSolution());
document.getElementById('hideTrailButton').addEventListener('click', () => model.hideSolution());

function createSquareMaze(): void {
    model.grid = SquareGridCreator.createGrid(69, 43, 15);
    model.view = new BoxedView(14);
    controller.generateLabyrinth();
}

function createHexagonalMaze(): void {
    model.grid = HexagonalGridCreator.createGrid(51, 37, 20);
    model.view = new BoxedView(18);
    controller.generateLabyrinth();
}

function createTriangularMaze(): void {
    model.grid = TriangularGridCreator.createGrid(102, 37, 20);
    model.view = new BoxedView(18);
    controller.generateLabyrinth();
}

function createOctagonalMaze(): void {
    model.grid = OctagonalGridCreator.createGrid(34, 21, 30);
    model.view = new BoxedView(18);
    controller.generateLabyrinth();
}

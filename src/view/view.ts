import { Cell } from '../model/grid/cell/cell';
import { Model } from '../model/model';
import { Observer } from './observer';
import {
    CanvasPainter,
    BLACK_COLOR,
    BLUE_COLOR,
    WHITE_COLOR,
    LIGHT_GREEN_COLOR,
    LIGHT_RED_COLOR,
    LIGHT_GRAY_COLOR
} from './canvaspainter';
import { Border } from '../model/grid/cell/border';

export class View implements Observer {

    private _model: Model;
    private _canvasPainter: CanvasPainter;
    private _showSolution: boolean = false;


    constructor(canvasPainter: CanvasPainter, model: Model) {
        this._canvasPainter = canvasPainter;
        this._model = model;
        this._model.attachObserver(this);
    }

    update(): void {
        this._canvasPainter.clearTheCanvas();
        this.shadeDisconnectedCells();

        this.drawStartCell();
        this.drawEndCell();
        this.drawAllCellBorders();
        //this.drawAllCellCenters();
        //this.drawAllCellConnections();
        //this.drawAllNeighbourRelations();
        //this.drawNumberOfNeighbours();
        if (this._showSolution) {
            this.drawSolution();
        }
    }

    private shadeDisconnectedCells(): void {
        this._model.grid.allUnconnectedCells
            .forEach(cell => this.fillCell(cell, LIGHT_GRAY_COLOR, BLACK_COLOR));
    }

    private fillCell(cell: Cell, fillColor: string, borderColor: string): void {
        this._canvasPainter.fillPolygon(cell.corners, fillColor, borderColor);
    }

    private drawAllCellBorders(): void {
        const borders: Border[] = this._model.grid.allCells
            .flatMap(cell => cell.closedBorders);
        const uniqueBorders: Border[] = [...new Set(borders)];

        const bordersBetweenCells: Border[] = uniqueBorders.filter(border => border.bordersToNeighbour);
        this._canvasPainter.drawSegments(bordersBetweenCells, 1, BLACK_COLOR);

        const edgeBorders: Border[] = uniqueBorders.filter(border => !border.bordersToNeighbour);
        this._canvasPainter.drawSegments(edgeBorders, 2, BLACK_COLOR);
    }

    private drawAllCellCenters(): void {
        this._model.grid.allCells.forEach(cell => {
            this._canvasPainter.drawFilledCircle(cell.center, 2, BLACK_COLOR);
        });
    }

    private drawAllCellConnections(): void {
        this._model.grid.allCells.forEach(cell => {
            cell.connectedNeighbours.forEach(neighbour => {
                this._canvasPainter.drawLine(cell.center, neighbour.center, 1, BLUE_COLOR);
            });
        });
    }

    private drawAllNeighbourRelations(): void {
        this._model.grid.allCells.forEach(cell => {
            cell.neighbourCells.forEach(neighbour => {
                this._canvasPainter.drawLine(cell.center, neighbour.center, 1, BLUE_COLOR);
            });
        });
    }

    private drawNumberOfNeighbours(): void {
        this._model.grid.allUnconnectedCells.forEach(cell => {
            this._canvasPainter.drawText(cell.neighbourCells.length.toString(), cell.center, 10, BLACK_COLOR);
        });
    }

    private drawStartCell(): void {
        this._canvasPainter.fillPolygon(this._model.grid.startCell.corners, LIGHT_GREEN_COLOR, LIGHT_GREEN_COLOR);
    }

    private drawEndCell(): void {
        this._canvasPainter.fillPolygon(this._model.grid.endCell.corners, LIGHT_RED_COLOR, LIGHT_RED_COLOR);
    }

    private drawSolution(): void {
        this._canvasPainter.drawSegments(this._model.solutionTrail, 2, BLUE_COLOR);
    }

    public showSolution(): void {
        this._showSolution = true;
        this.update();
    }

    public hideSolution(): void {
        this._showSolution = false;
        this.update();
    }

}
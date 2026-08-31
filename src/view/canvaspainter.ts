import { Coordinate } from '../model/coordinate';
import { Segment } from '../model/segment';

export const WHITE_COLOR: string = 'rgba(255,255,255,1)';
export const BLACK_COLOR: string = 'rgba(0,0,0,1)';
export const BLUE_COLOR: string = 'rgba(0,0,255,1)';
export const LIGHT_GREEN_COLOR: string = 'rgba(0,255,0,0.5)';
export const LIGHT_RED_COLOR: string = 'rgba(255,0,0,0.5)';
export const LIGHT_GRAY_COLOR: string = 'rgba(128,128,128,0.2)';

export class CanvasPainter {

    private readonly _canvasElement: HTMLCanvasElement;
    private readonly _canvasCtx: CanvasRenderingContext2D;

    constructor(canvasElement: HTMLCanvasElement) {
        this._canvasElement = canvasElement;
        this._canvasCtx = this._canvasElement.getContext('2d') as CanvasRenderingContext2D;
        this._canvasCtx.scale(1, -1);
        this._canvasCtx.translate(0, -this._canvasElement.height);
        this._canvasCtx.save();
    }

    public clearTheCanvas(): void {
        this._canvasCtx.clearRect(0, 0, this._canvasElement.width, this._canvasElement.height);
    }

    public drawFilledCircle(centerPoint: Coordinate, radius: number, fillColor: string): void {
        this._canvasCtx.fillStyle = fillColor;
        this._canvasCtx.beginPath();
        this._canvasCtx.arc(centerPoint.x, centerPoint.y, radius, 0, 2 * Math.PI);
        this._canvasCtx.fill();
    }

    public drawLine(fromPoint: Coordinate, toPoint: Coordinate, width: number, color: string): void {
        this._canvasCtx.strokeStyle = color;
        this._canvasCtx.lineWidth = width;
        this._canvasCtx.lineCap = 'round';
        this._canvasCtx.beginPath();
        this._canvasCtx.moveTo(fromPoint.x, fromPoint.y);
        this._canvasCtx.lineTo(toPoint.x, toPoint.y);
        this._canvasCtx.stroke();
    }

    public drawSegment(segment: Segment, width: number, color: string): void {
        this.drawLine(segment.p1, segment.p2, width, color);
    }

    public drawSegments(segments: Segment[], width: number, color: string): void {
        segments.forEach(segment => this.drawSegment(segment, width, color));
    }

    public fillPolygon(vertices: Coordinate[], fillColor: string, borderColor: string): void {
        this._canvasCtx.fillStyle = fillColor;
        this._canvasCtx.strokeStyle = borderColor;
        this._canvasCtx.lineWidth = 1;
        this._canvasCtx.beginPath();
        const firstVertex: Coordinate = vertices.shift();
        this._canvasCtx.moveTo(firstVertex.x, firstVertex.y);
        vertices.forEach(vertex => this._canvasCtx.lineTo(vertex.x, vertex.y));
        this._canvasCtx.fill();
        this._canvasCtx.stroke();
    }

    public drawText(text: string, position: Coordinate, fontSize: number, color: string): void {
        this._canvasCtx.fillStyle = color;
        this._canvasCtx.font = `${fontSize}px Arial`;
        this._canvasCtx.fillText(text, position.x - fontSize / 4, position.y + fontSize / 4);
    }

}
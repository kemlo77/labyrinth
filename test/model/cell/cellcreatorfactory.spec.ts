import { describe, it, expect, beforeEach } from 'vitest';
import { Coordinate } from '../../../src/model/coordinate';
import { Cell } from '../../../src/model/cell/cell';
import { CellCreatorFactory } from '../../../src/model/cell/cellcreatorfactory';
import { CellCreator } from '../../../src/model/typealiases';

describe('CellCreatorFactory', () => {
    let insertionPoint: Coordinate;

    beforeEach(() => {
        insertionPoint = new Coordinate(5, 5);
    });

    it('creating an equilateral triangle cell', () => {
        const insertionPoint: Coordinate = new Coordinate(0, 0);
        const createTriangularCell: CellCreator =
            CellCreatorFactory.getCellCreatorByType('equilateral-triangular-cell', 15, 0);
        const triangleCell: Cell = createTriangularCell(insertionPoint);
        expect(triangleCell.vertices).to.have.lengthOf(3);
        expect(triangleCell.center.x).to.be.closeTo(7.5, 0.0001);
        expect(triangleCell.center.y).to.be.closeTo(4.3301, 0.0001);
        expect(triangleCell.vertices[0].x).to.be.closeTo(0, 0.0001);
        expect(triangleCell.vertices[0].y).to.be.closeTo(0, 0.0001);
        expect(triangleCell.vertices[1].x).to.be.closeTo(15, 0.0001);
        expect(triangleCell.vertices[1].y).to.be.closeTo(0, 0.0001);
        expect(triangleCell.vertices[2].x).to.be.closeTo(7.5, 0.0001);
        expect(triangleCell.vertices[2].y).to.be.closeTo(12.9904, 0.0001);
    });

    it('creating a square cell', () => {
        const createSquareCell: CellCreator =
            CellCreatorFactory.getCellCreatorByType('square-cell', 10, 0);
        const squareCell: Cell = createSquareCell(insertionPoint);
        expect(squareCell.vertices).to.have.lengthOf(4);
        expect(squareCell.center.equals(new Coordinate(10, 10))).to.be.true;
        expect(squareCell.vertices[0].equals(new Coordinate(5, 5))).to.be.true;
        expect(squareCell.vertices[1].equals(new Coordinate(15, 5))).to.be.true;
        expect(squareCell.vertices[2].equals(new Coordinate(15, 15))).to.be.true;
        expect(squareCell.vertices[3].equals(new Coordinate(5, 15))).to.be.true;
    });

    it('creating an isosceles right triangle cell', () => {
        const createTriangularCell: CellCreator =
            CellCreatorFactory.getCellCreatorByType('isosceles-right-triangular-cell', 15, 0);
        const triangleCell: Cell = createTriangularCell(insertionPoint);
        expect(triangleCell.vertices).to.have.lengthOf(3);
        expect(triangleCell.vertices[0].equals(new Coordinate(5, 5))).to.be.true;
        expect(triangleCell.vertices[1].equals(new Coordinate(20, 5))).to.be.true;
        expect(triangleCell.vertices[2].equals(new Coordinate(5, 20))).to.be.true;
    });

    it('creating a double square rectangle cell', () => {
        const createRectangularCell: CellCreator =
            CellCreatorFactory.getCellCreatorByType('double-square-rectangle-cell', 10, 0);
        const rectangleCell: Cell = createRectangularCell(insertionPoint);
        expect(rectangleCell.vertices).to.have.lengthOf(6);
        expect(rectangleCell.center.equals(new Coordinate(10, 7.5))).to.be.true;
        expect(rectangleCell.vertices[0].equals(new Coordinate(5, 5))).to.be.true;
        expect(rectangleCell.vertices[1].equals(new Coordinate(10, 5))).to.be.true;
        expect(rectangleCell.vertices[2].equals(new Coordinate(15, 5))).to.be.true;
        expect(rectangleCell.vertices[3].equals(new Coordinate(15, 10))).to.be.true;
        expect(rectangleCell.vertices[4].equals(new Coordinate(10, 10))).to.be.true;
        expect(rectangleCell.vertices[5].equals(new Coordinate(5, 10))).to.be.true;
    });

    it('creating a rotated double square rectangle cell', () => {
        const rotatedRectangleCenter: Coordinate = new Coordinate(0, 0);
        const createRectangularCell: CellCreator =
            CellCreatorFactory.getCellCreatorByType('double-square-rectangle-cell', 10, 90);
        const rectangleCell: Cell = createRectangularCell(rotatedRectangleCenter);
        expect(rectangleCell.vertices[0].x).to.be.closeTo(0, 0.0001);
        expect(rectangleCell.vertices[0].y).to.be.closeTo(0, 0.0001);
        expect(rectangleCell.vertices[1].x).to.be.closeTo(0, 0.0001);
        expect(rectangleCell.vertices[1].y).to.be.closeTo(5, 0.0001);
        expect(rectangleCell.vertices[2].x).to.be.closeTo(0, 0.0001);
        expect(rectangleCell.vertices[2].y).to.be.closeTo(10, 0.0001);
        expect(rectangleCell.vertices[3].x).to.be.closeTo(-5, 0.0001);
        expect(rectangleCell.vertices[3].y).to.be.closeTo(10, 0.0001);
        expect(rectangleCell.vertices[4].x).to.be.closeTo(-5, 0.0001);
        expect(rectangleCell.vertices[4].y).to.be.closeTo(5, 0.0001);
        expect(rectangleCell.vertices[5].x).to.be.closeTo(-5, 0.0001);
        expect(rectangleCell.vertices[5].y).to.be.closeTo(0, 0.0001);
        expect(rectangleCell.vertices).to.have.lengthOf(6);
        expect(rectangleCell.center.x).to.be.closeTo(-2.5, 0.0001);
        expect(rectangleCell.center.y).to.be.closeTo(5, 0.0001);
    });

    it('creating a hexagon cell', () => {
        const insertionPoint: Coordinate = new Coordinate(0, 0);
        const createHexagonalCell: CellCreator =
            CellCreatorFactory.getCellCreatorByType('hexagonal-cell', 10, 0);
        const hexagonCell: Cell = createHexagonalCell(insertionPoint);
        expect(hexagonCell.vertices).to.have.lengthOf(6);
        expect(hexagonCell.center.x).to.be.closeTo(5, 0.0001);
        expect(hexagonCell.center.y).to.be.closeTo(8.6603, 0.0001);
        expect(hexagonCell.vertices[0].x).to.be.closeTo(0, 0.0001);
        expect(hexagonCell.vertices[0].y).to.be.closeTo(0, 0.0001);
        expect(hexagonCell.vertices[1].x).to.be.closeTo(10, 0.0001);
        expect(hexagonCell.vertices[1].y).to.be.closeTo(0, 0.0001);
        expect(hexagonCell.vertices[2].x).to.be.closeTo(15, 0.0001);
        expect(hexagonCell.vertices[2].y).to.be.closeTo(8.6603, 0.0001);
        expect(hexagonCell.vertices[3].x).to.be.closeTo(10, 0.0001);
        expect(hexagonCell.vertices[3].y).to.be.closeTo(17.3205, 0.0001);
        expect(hexagonCell.vertices[4].x).to.be.closeTo(0, 0.0001);
        expect(hexagonCell.vertices[4].y).to.be.closeTo(17.3205, 0.0001);
        expect(hexagonCell.vertices[5].x).to.be.closeTo(-5, 0.0001);
        expect(hexagonCell.vertices[5].y).to.be.closeTo(8.6603, 0.0001);
    });

    it('creating an octagon cell', () => {
        const createOctagonalCell: CellCreator =
            CellCreatorFactory.getCellCreatorByType('octagonal-cell', 10, 0);
        const octagonCell: Cell = createOctagonalCell(insertionPoint);
        expect(octagonCell.vertices).to.have.lengthOf(8);
        expect(octagonCell.center.x).to.be.closeTo(7.0711, 0.0001);
        expect(octagonCell.center.x).to.be.closeTo(7.0711, 0.0001);
        expect(octagonCell.vertices[0].x).to.be.closeTo(5, 0.0001);
        expect(octagonCell.vertices[0].y).to.be.closeTo(5, 0.0001);
        expect(octagonCell.vertices[1].x).to.be.closeTo(9.1421, 0.0001);
        expect(octagonCell.vertices[1].y).to.be.closeTo(5, 0.0001);
        expect(octagonCell.vertices[2].x).to.be.closeTo(12.0711, 0.0001);
        expect(octagonCell.vertices[2].y).to.be.closeTo(7.9289, 0.0001);
        expect(octagonCell.vertices[3].x).to.be.closeTo(12.0711, 0.0001);
        expect(octagonCell.vertices[3].y).to.be.closeTo(12.0711, 0.0001);
        expect(octagonCell.vertices[4].x).to.be.closeTo(9.1421, 0.0001);
        expect(octagonCell.vertices[4].y).to.be.closeTo(15, 0.0001);
        expect(octagonCell.vertices[5].x).to.be.closeTo(5, 0.0001);
        expect(octagonCell.vertices[5].y).to.be.closeTo(15, 0.0001);
        expect(octagonCell.vertices[6].x).to.be.closeTo(2.0711, 0.0001);
        expect(octagonCell.vertices[6].y).to.be.closeTo(12.0711, 0.0001);
        expect(octagonCell.vertices[7].x).to.be.closeTo(2.0711, 0.0001);
        expect(octagonCell.vertices[7].y).to.be.closeTo(7.9289, 0.0001);

    });

    it('getting a cell creator of unknown type', () => {
        expect(() => CellCreatorFactory.getCellCreatorByType('unknown', 10, 0)).to.throw('Unknown cell type');
    });
});
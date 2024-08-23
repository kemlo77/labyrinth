import { Cell } from '../../cell/cell';
import { CellFactory } from '../../cell/cellfactory';
import { Grid } from '../../grid';
import { GridFactory } from '../gridfactory';
import { RegularShapedGridFactory } from './regularshapedgridfactory.interface';
import { RegularShapedGridProperties } from './regularshapedgridproperties';

export class AlternativeTriangularGridFactory extends GridFactory implements RegularShapedGridFactory {

    createGrid(gridProperties: RegularShapedGridProperties): Grid {
        const cellGrid: Cell[][] = this.createCellMatrix(gridProperties);
        this.establishNeighbourRelationsInMatrix(cellGrid);

        const startCell: Cell = cellGrid[0][0];
        const endCell: Cell = cellGrid[cellGrid.length - 1][0];
        const cells: Cell[] = cellGrid.flat();
        return new Grid(cells, startCell, endCell);
    }

    private createCellMatrix(gridProperties: RegularShapedGridProperties): Cell[][] {
        const firstCell: Cell = 
            CellFactory.createCell(
                gridProperties.insertionPoint, 
                gridProperties.lengthOfEdgeSegments, 
                'equilateral-triangular', 
                gridProperties.angle
            );
        return [[firstCell]];
        
    }

    private establishNeighbourRelationsInMatrix(cellGrid: Cell[][]): void {
        //throw new Error('Method not implemented.');
    }

}
import { Coordinate } from '../../../coordinate';
import { Cell } from '../../cell/cell';
import { CellFactory } from '../../cell/cellfactory';
import { Grid } from '../../grid';
import { RegularShapedGridFactory } from './regularshapedgridfactory.interface';
import { RegularShapedGridProperties } from './regularshapedgridproperties';
import { SquareGridAssembler } from '../gridassemblers/squaregridassembler';
import { RegionCreator } from '../../typealiases';


export class SquareGridFactory implements RegularShapedGridFactory {

    createGrid(gridProperties: RegularShapedGridProperties): Grid {
        const angle: number = gridProperties.angle;
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;

        const createSquareCell: RegionCreator<Cell> = (insertionPoint: Coordinate) =>
            CellFactory.createCell(insertionPoint, cellWidth, 'square', angle);

        return new SquareGridAssembler<Cell>().createGrid(
            gridProperties,
            createSquareCell
        );
    }

}
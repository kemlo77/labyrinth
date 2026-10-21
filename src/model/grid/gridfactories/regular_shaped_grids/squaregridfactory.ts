import { Coordinate } from '../../../coordinate';
import { Cell } from '../../cell/cell';
import { CellFactory } from '../../cell/cellfactory';
import { Grid } from '../../grid';
import type { RegularShapedGridFactory } from './regularshapedgridfactory.interface';
import { RegularShapedGridProperties } from './regularshapedgridproperties';
import { SquareGridAssembler } from '../gridassemblers/squaregridassembler';
import type { RegionCreator } from '../../typealiases';


export class SquareGridFactory implements RegularShapedGridFactory {

    createGrid(gridProperties: RegularShapedGridProperties): Grid {
        const angle: number = gridProperties.angle;
        const cellWidth: number = gridProperties.lengthOfEdgeSegments;

        const squareCellCreator: RegionCreator<Cell> =
            CellFactory.getCellCreatorByType('square-cell', cellWidth, angle);

        return new SquareGridAssembler<Cell>().createGrid(
            gridProperties,
            squareCellCreator
        );
    }

}
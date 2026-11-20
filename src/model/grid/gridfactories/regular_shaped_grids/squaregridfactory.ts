import { Cell } from '../../../cell/cell';
import { CellCreatorFactory } from '../../../cell/cellcreatorfactory';
import { Grid } from '../../grid';
import type { RegularShapedGridFactory } from './regularshapedgridfactory.interface';
import { RegularShapedGridProperties } from './regularshapedgridproperties';
import { SquareGridAssembler } from '../../gridassemblers/squaregridassembler';
import type { CellCreator } from '../../../typealiases';


export class SquareGridFactory implements RegularShapedGridFactory {

    createGrid(gridProperties: RegularShapedGridProperties): Grid {

        const createSquareCell: CellCreator = CellCreatorFactory.makeCellCreator('square-cell');

        return new SquareGridAssembler<Cell>().createGrid(gridProperties, createSquareCell);
    }

}
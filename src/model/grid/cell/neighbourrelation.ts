import { Border } from './border';
import { Cell } from './cell';

export class NeighbourRelation {

    constructor(readonly neighbourCell: Cell, readonly commonBorders: Border[]) {
        //
    }

}
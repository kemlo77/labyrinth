import { Border } from './border';
import { Cell } from './cell';

export class Neighbour {

    constructor(readonly cell: Cell, readonly commonBorder: Border) {
        //
    }

}
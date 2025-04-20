import { Coordinate } from '../../coordinate';
import { Cell } from './cell';
export type CellTest = (cell: Cell) => boolean;
export type CellAction = (cell: Cell) => void;
export type CellCreator = (insertionPoint: Coordinate) => Cell;
import { Coordinate } from '../coordinate';
import { Cell } from './cell/cell';
import { Grid } from './grid';
export type CellTest = (cell: Cell) => boolean;
export type CellAction = (cell: Cell) => void;
export type CellCreator = (insertionPoint: Coordinate) => Cell;
export type GridCreator = (newInsertionPoint: Coordinate, angle?: number) => Grid;
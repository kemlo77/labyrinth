import { Coordinate } from './coordinate';
import { Cell } from './cell/cell';
import { Grid } from './grid/grid';
import type { Region } from './grid/region';
export type CellTest = (cell: Cell) => boolean;
export type CellAction = (cell: Cell) => void;
export type CellCreator = (insertionPoint: Coordinate) => Cell;
export type GridCreator = (newInsertionPoint: Coordinate) => Grid;
export type RegionCreator<T extends Region<T>> = (insertionPoint: Coordinate) => T;
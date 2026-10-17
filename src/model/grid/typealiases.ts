import { Coordinate } from '../coordinate';
import { Cell } from './cell/cell';
import { Grid } from './grid';
import type { Region } from './region';
export type CellTest = (cell: Cell) => boolean;
export type CellAction = (cell: Cell) => void;
export type CellCreator = (insertionPoint: Coordinate, angle?: number) => Cell;
export type GridCreator = (newInsertionPoint: Coordinate, angle?: number) => Grid;
export type RegionCreator<T extends Region<T>> = (insertionPoint: Coordinate, angle?: number) => T;
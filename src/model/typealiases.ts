import { Coordinate } from './coordinate';
import { Cell } from './cell/cell';
import { Grid } from './grid/grid';
import type { Region } from './grid/region';
export type CellTest = (cell: Cell) => boolean;
export type CellAction = (cell: Cell) => void;
export type CellCreator = (insertionPoint: Coordinate) => Cell;
export type GridCreator = (newInsertionPoint: Coordinate) => Grid;
export type RegionCreator<T extends Region<T>> = (insertionPoint: Coordinate) => T;


export type PlacementInfo = {
    insertionPoint: Coordinate;
    angle: number;
    size: number;
};

export type RegularCellCreator = (insertionPoint: Coordinate, angleInDegrees: number, sideLength: number) => Cell;
export type SegmentedCellCreator =
    (insertionPoint: Coordinate, angleInDegrees: number, sideLength: number, numberOfSideSegments: number) => Cell;
export type RegularGridCreator = (insertionPoint: Coordinate, angleInDegrees: number, sideLength: number) => Grid;
export type RegularRegionCreator<T extends Region<T>> =
    (insertionPoint: Coordinate, angleInDegrees: number, sideLength: number) => T;
export type GridFragmentCreator = (placementInfo: PlacementInfo) => Grid;
import { Coordinate } from './coordinate';
import { Cell } from './cell/cell';
import { Grid } from './grid/grid';
import type { Region } from './grid/region';
export type CellTest = (cell: Cell) => boolean;
export type CellAction = (cell: Cell) => void;
export type OldGridCreator = (newInsertionPoint: Coordinate) => Grid;



export type PlacementInfo = {
    insertionPoint: Coordinate;
    angle: number;
    size: number;
};


export type CellCreator = (placementInfo: PlacementInfo) => Cell;
export type SegmentedCellCreator =
    (insertionPoint: Coordinate, angleInDegrees: number, sideLength: number, numberOfSideSegments: number) => Cell;

export type GridFragmentCreator = (placementInfo: PlacementInfo) => Grid;
export type RegionCreator<T extends Region<T>> = (placementInfo: PlacementInfo) => T;



//deprecated
//export type RegularGridCreator = (insertionPoint: Coordinate, angleInDegrees: number, sideLength: number) => Grid;
//export type OldRegularRegionCreator<T extends Region<T>> = (insertionPoint: Coordinate, angleInDegrees: number, sideLength: number) => T;
//export type RegularCellCreator = (insertionPoint: Coordinate, angleInDegrees: number, sideLength: number) => Cell;
//export type OldCellCreator = (insertionPoint: Coordinate) => Cell;
//export type OldRegionCreator<T extends Region<T>> = (insertionPoint: Coordinate) => T;
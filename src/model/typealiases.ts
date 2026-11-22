import { Coordinate } from './coordinate';
import { Cell } from './cell/cell';
import { Grid } from './grid/grid';
import type { Region } from './grid/region';
export type CellTest = (cell: Cell) => boolean;
export type CellAction = (cell: Cell) => void;


export type PlacementInfo = {
    insertionPoint: Coordinate;
    angle: number;
    size: number;
};


export type CellCreator = (placementInfo: PlacementInfo) => Cell;
export type SegmentedCellCreator =
    (insertionPoint: Coordinate, angleInDegrees: number, sideLength: number, numberOfSideSegments: number) => Cell;

export type SimpleGridCreator = (newInsertionPoint: Coordinate) => Grid;
export type GridCreator = (placementInfo: PlacementInfo) => Grid;
export type RegionCreator<T extends Region<T>> = (placementInfo: PlacementInfo) => T;

import { Cell } from './cell/cell';

export interface Region<T> {
    establishNeighbourRelationsWith(region: T): void;
    mergeWith(region: T): T;
    getCells(): Cell[];
}
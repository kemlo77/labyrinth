import { describe, it, expect } from 'vitest';
import { ArrayOperations } from '../../src/service/arrayoperations';

describe('ArrayOperations', () => {
    it('should handle array operations correctly', () => {
        const array: number[] = [1, 2, 3, 4];
        const newArray: number[] = ArrayOperations.rotateArray(array, 1);
        expect(newArray).to.deep.equal([2, 3, 4, 1]);
    });


});
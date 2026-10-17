import { describe, it, expect } from 'vitest';
import { MatrixOperations } from '../../src/service/matrixoperations';

describe('MatrixOperations', () => {

    it('should transpose a matrix', () => {
        const matrix: number[][] = [
            [1, 2, 3],
            [4, 5, 6],
        ];

        const transposedMatrix: number[][] = MatrixOperations.transpose<number>(matrix);

        expect(transposedMatrix[0]).to.deep.equal([1, 4]);
        expect(transposedMatrix[1]).to.deep.equal([2, 5]);
        expect(transposedMatrix[2]).to.deep.equal([3, 6]);

    });
});
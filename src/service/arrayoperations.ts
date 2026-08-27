export class ArrayOperations {
    private constructor() {
        // Prevent instantiation
    }

    static rotateArray<Type>(array: Type[], steps: number): Type[] {
        return [...array.slice(steps), ...array.slice(0, steps)];
    }
}
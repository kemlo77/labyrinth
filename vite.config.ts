import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        globals: true,
        include: ['test/**/*.spec.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'], 
        },
    },
});
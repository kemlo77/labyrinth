import { scan } from '@sonar/scan';

await scan({
    serverUrl: 'http://localhost:9000',
    token: 'sqp_093a1dc9fd4a373996fba429c60e35854e91adcb',
    options: {
        'sonar.projectName': 'Labyrint',
        'sonar.projectKey': 'Labyrint',
        'sonar.projectDescription': 'a small project to test a labyrinth algorithm',
        'sonar.sources': 'src',
        'sonar.tests': 'test',
    },
});
import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,


  e2e: {
    baseUrl: "http://localhost:5173",
    "viewportWidth": 1920,
    "viewportHeight": 1680,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

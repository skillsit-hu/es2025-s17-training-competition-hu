/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
module.exports = {
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress", "dashboard"],
  testRunner: "jest",
  testRunnerNodeArgs: ["--max_old_space_size=4096"],
  coverageAnalysis: "perTest",
  mutate: [
    "src/**/*.js",
    "!src/index.js"
  ],
  thresholds: {
    high: 80,
    low: 60,
    break: 60
  },
  timeoutMS: 60000,
  timeoutFactor: 1.5,
  maxConcurrentTestRunners: 2,
  jest: {
    projectType: "custom",
    configFile: "package.json",
    enableFindRelatedTests: true
  },
  htmlReporter: {
    fileName: "reports/mutation/mutation.html"
  },
  dashboard: {
    reportType: "full"
  }
}; 
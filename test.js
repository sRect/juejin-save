const createLogger = require("progress-estimator");
const chalk = require("chalk");
const path = require("path");

let _logger = null;
const logger = (task, message, estimate) => {
  if (!_logger) {
    _logger = createLogger({
      storagePath: path.join(__dirname, ".progress-estimator"),
    });
  }
  return _logger(task, chalk.blue(message), {
    estimate,
  });
};

const task1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve({ success: true });
  }, 1200);
});

const task2 = new Promise((resolve) => {
  setTimeout(() => {
    resolve({ success: true });
  }, 4200);
});

async function run() {
  const startTime = Date.now();
  console.log();
  console.log(chalk.blue("Some Tasks"));
  console.log();
  await logger(task1, "Task 1", 1500);
  await logger(task2, "Task 2", 600);
  const endTime = Date.now();
  const time = ((endTime - startTime) / 1000).toFixed(2);
  console.log();
  console.log(chalk.green(`✨ Done in ${time}s`));
  console.log();
}

run();

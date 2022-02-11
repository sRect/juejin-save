#!/usr/bin/env node
const path = require("path");
const { writeFile } = require("fs/promises");
const inquirer = require("inquirer");
const chalk = require("chalk");
const ora = require("ora");
const createLogger = require("progress-estimator");
const deasync = require("deasync");
const { Command } = require("commander");

const program = new Command();
const spinner = ora();
const logger = createLogger({
  storagePath: path.join(__dirname, "../.progress-estimator"),
});

// 模拟任务
const task1 = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 900);
  });

const task2 = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 3600);
  });

// 交互式询问
async function handlePrompt(name) {
  // https://github.com/SBoudrias/Inquirer.js/#objects
  return await inquirer.prompt([
    {
      name: "resume",
      message: `Please confirm resume name: ${name}`,
      type: "confirm",
    },
    {
      name: "personName",
      message: "Please input your name:",
      type: "input",
      validate: (val) => {
        if (!val) {
          console.log(chalk.yellow("For example: foo"));
          return console.log(
            chalk.red("× The name cannot be empty, Please try again")
          );
        }

        return true;
      },
    },
    {
      name: "sex",
      message: "Please picker your sex:",
      type: "list",
      choices: ["man", "woman"],
    },
    {
      name: "hobby",
      messge: "Please select your hobby(multiple):",
      type: "checkbox",
      choices: [
        {
          name: "music",
          value: "music",
          description: "music music",
          checked: true,
        },
        {
          name: "code",
          value: "code",
          description: "code code",
        },
      ],
    },
  ]);
}

// 询问过后的处理
async function AfterePrompt(name, answers) {
  console.log(chalk.green("✔ answers result:" + JSON.stringify(answers)));

  spinner.color = "yellow";
  spinner.start("start...");

  setTimeout(() => {
    spinner.stopAndPersist({
      symbol: chalk.green("✔"),
      text: chalk.green("generate success"),
    });

    console.log(`----${name}'s resume ----`);
    console.log(chalk.green("name: "), answers.personName);
    console.log(chalk.green("sex: "), answers.sex);
    console.log(chalk.green("hobby: "), answers.hobby.join(","));
  }, 2000);
}

// 导出文件
async function exportResume(name, answers) {
  const { personName, sex, hobby } = answers;
  await logger(task1(), "resume export initial...", {
    estimate: 300,
  });

  await logger(task2(), "resume export...", {
    estimate: 3500,
  });

  await writeFile(
    // 当前shell执行路径
    path.resolve(process.cwd(), "resume.doc"),
    `
    ----${name}'s resume ----
    name: ${personName}
    sex: ${sex}
    hobby: ${hobby.join(",")}
  `,
    {
      encoding: "utf8",
    }
  );
}

// https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md#%E5%91%BD%E4%BB%A4
program
  .version("0.1.0")
  .command("create <resume-name>")
  // .option("-f,", "是否强制创建")
  .description("create a resume")
  .action(async (name) => {
    const answers = await handlePrompt(name);

    await AfterePrompt(name, answers);

    deasync.sleep(3000);

    await exportResume(name, answers);
  });

program.parse();

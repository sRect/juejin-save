#!/usr/bin/env node

const inquirer = require("inquirer");
const chalk = require("chalk");
const ora = require("ora");
const { Command } = require("commander");

const program = new Command();
const spinner = ora();

// https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md#%E5%91%BD%E4%BB%A4
program
  .version("0.1.0")
  .command("create <resume-name>")
  .description("create a resume")
  .action((name) => {
    // https://github.com/SBoudrias/Inquirer.js/#objects
    inquirer
      .prompt([
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
      ])
      .then((answers) => {
        console.log(chalk.green("✔ answers result:" + JSON.stringify(answers)));

        spinner.color = "yellow";
        spinner.start("start...");

        setTimeout(() => {
          // spinner.stop();

          // spinner.succeed(chalk.green("生成成功"));

          // spinner.fail(chalk.red("生成失败"));

          spinner.stopAndPersist({
            symbol: chalk.green("✔"),
            text: chalk.green("generate success"),
          });

          console.log(`----${name}'s resume ----`);
          console.log(chalk.green("name: "), answers.personName);
          console.log(chalk.green("sex: "), answers.sex);
          console.log(chalk.green("hobby: "), answers.hobby.join(", "));
        }, 2000);
      })
      .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
          console.error(
            "Prompt couldn't be rendered in the current environment"
          );
        } else {
          // Something else went wrong
          console.error("Something else went wrong:", error);
        }
      });
  });

program.parse();

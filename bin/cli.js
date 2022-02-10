#!/usr/bin/env node

const inquirer = require("inquirer");
const chalk = require("chalk");
const { Command } = require("commander");
const program = new Command();

// https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md#%E5%91%BD%E4%BB%A4
program
  .version("0.1.0")
  .command("create <project-name>")
  .description("create a new project")
  .action((name) => {
    console.log(`project name: ${name}`);
    // https://github.com/SBoudrias/Inquirer.js/#objects
    inquirer
      .prompt([
        {
          name: "project name",
          message: `Confirm project ${name}?`,
          type: "confirm",
        },
        {
          name: "input your name",
          message: "input name",
          type: "input",
          validate: (val) => {
            if (!val || !val.trim()) {
              return chalk.red("The name cannot be empty, Please try again");
            }
            return true;
          },
        },
        {
          name: "features",
          message: "Check the features needed for your project",
          pageSize: 10,
          type: "checkbox",
          choices: [
            // 具体的选项
            {
              name: "Babel",
              value: "babel",
              short: "Babel",
              description:
                "Transpile modern JavaScript to older versions (for compatibility)",
              link: "https://babeljs.io/",
              checked: true, // 默认选中
            },
            {
              name: "Router",
              value: "router",
              description: "Structure the app with dynamic pages",
              link: "https://router.vuejs.org/",
            },
            {
              name: "historyMode",
              // 只有当上一个问题为true才显示这个问题
              when: (answers) => answers.features.includes("router"),
              type: "confirm",
              message: `Use history mode for router? ${chalk.yellow(
                `(Requires proper server setup for index fallback in production)`
              )}`,
              description: `By using the HTML5 History API, the URLs don't need the '#' character anymore.`,
              link: "https://router.vuejs.org/guide/essentials/history-mode.html",
            },
          ],
        },
      ])
      .then((answers) => {
        // Use user feedback for... whatever!!
        console.log("answers==>", answers);
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

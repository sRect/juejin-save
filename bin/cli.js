#!/usr/bin/env node
const path = require("path");
const inquirer = require("inquirer");
const chalk = require("chalk");
const ora = require("ora");
const createLogger = require("progress-estimator");
const didYouMean = require("didyoumean"); // 简易的智能匹配引擎
const deasync = require("deasync");
const { Command } = require("commander");
const { puppeteerInit, saveToHtml, saveToMd, saveToPdf } = require(path.resolve(
  __dirname,
  "../puppeteer"
));

const program = new Command();
const spinner = ora();
const logger = createLogger({
  storagePath: path.join(__dirname, "../.progress-estimator"),
});

// 交互式询问
async function handlePrompt() {
  // https://github.com/SBoudrias/Inquirer.js/#objects
  return await inquirer.prompt([
    {
      name: "autoCreateFolder",
      message: `Automatically create folders?`,
      type: "confirm",
    },
    {
      name: "folderName",
      message: "Please input folder name:",
      type: "input",
      when({ autoCreateFolder }) {
        return !autoCreateFolder;
      },
      validate: (val) => {
        if (!val) {
          console.log(chalk.yellow("The folder name will used default name"));
        }

        return true;
      },
    },
    {
      name: "articleName",
      message: "Please input this article name:",
      type: "input",
      validate: (val) => {
        if (!val) {
          console.log(
            chalk.yellow("The article name will be used default name")
          );
        }

        return true;
      },
    },
    // {
    //   name: "saveOptiton",
    //   message: "Please select save options:",
    //   type: "list",
    //   choices: ["markdown", "pdf", "html"],
    // },
    {
      name: "saveOptiton",
      messge: "Please select save options(multiple):",
      type: "checkbox",
      choices: [
        {
          name: "markdown",
          value: "markdown",
          description: "save to markdown",
          checked: true,
        },
        {
          name: "pdf",
          value: "pdf",
          description: "save to pdf",
        },
        {
          name: "html",
          value: "html",
          description: "save to html",
        },
      ],
    },
  ]);
}

// 询问过后的处理
async function AfterePrompt(articleUrl, answers) {
  console.log(chalk.green("article url:" + articleUrl));

  spinner.color = "yellow";
  spinner.start(chalk.blueBright("puppeteer intial..."));

  const obj = await puppeteerInit(articleUrl, answers);

  spinner.stopAndPersist({
    symbol: chalk.green("✓"),
    text: chalk.green("puppeteer init ok"),
  });

  return obj;
}

// 导出文件
async function exportFile({
  saveOptiton,
  page,
  outMdFilePath,
  outPdfFilePath,
  outHtmlfFilePath,
}) {
  if (saveOptiton.includes("markdown")) {
    await logger(saveToMd(page, outMdFilePath), "md export:", {
      estimate: 800,
    });

    deasync.sleep(200);
  }

  if (saveOptiton.includes("pdf")) {
    await logger(saveToPdf(page, outPdfFilePath), "pdf export:", {
      estimate: 2000,
    });

    deasync.sleep(200);
  }

  if (saveOptiton.includes("html")) {
    await logger(saveToHtml(page, outHtmlfFilePath), "html export:", {
      estimate: 50,
    });
  }

  deasync.sleep(200);

  console.log(chalk.green("✓ export file successed"));
}

// https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md#%E5%91%BD%E4%BB%A4
program
  .version("0.1.0")
  .command("save  <article-url>")
  // .option("-f,", "是否强制创建")
  .description("save https://xxx")
  .action(async (articleUrl) => {
    const { autoCreateFolder, folderName, articleName, saveOptiton } =
      await handlePrompt();

    console.log(`----prompt asnwer----`);
    console.log(chalk.green("autoCreateFolder: "), autoCreateFolder);
    console.log(chalk.green("folderName: "), folderName);
    console.log(chalk.green("articleName: "), articleName);
    console.log(chalk.green("saveOptiton: "), saveOptiton.join(","));

    const { browser, page, outMdFilePath, outPdfFilePath, outHtmlfFilePath } =
      await AfterePrompt(articleUrl, {
        autoCreateFolder,
        folderName,
        articleName,
        saveOptiton,
      });

    await exportFile({
      saveOptiton,
      page,
      outMdFilePath,
      outPdfFilePath,
      outHtmlfFilePath,
    });

    await browser.close();

    process.exit(1);
  });

// 处理非法命令
program.arguments("<command>").action((cmd) => {
  // 打印帮助信息
  program.outputHelp();
  console.log(chalk.red(`Unknown command: ${chalk.yellow(cmd)}.`));
  suggestCommands(cmd);
});

// https://mp.weixin.qq.com/s/AH9fQdZnwMUcuczIVLOLVQ
function suggestCommands(cmd) {
  const avaliableCommands = program.commands.map((cmd) => {
    return cmd._name;
  });
  // 简易智能匹配用户命令
  const suggestion = didYouMean(cmd, avaliableCommands);
  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`));
  }
}

program.parse();

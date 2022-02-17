## 打造一个属于自己的 cli

### 1. 主要 package version

| package   | version |
| :-------- | :------ |
| commander | ^9.0.0  |
| inquirer  | ^8.2.0  |
| puppeteer | ^13.3.2 |

### 2. package.json 中添加`bin`字段

```json
{
  "bin": {
    "juejin-save": "bin/cli.js"
  }
}
```

### 3.

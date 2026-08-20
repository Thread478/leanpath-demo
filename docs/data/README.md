# LeanPath 题库维护说明

题库已经从 `index.html` 分离到 [question-bank.js](./question-bank.js)，无需修改页面结构即可增删题目。

## 题库结构

每个关卡包含以下字段：

- `label`：关卡标题；
- `desc`：关卡说明；
- `xp`：首次完成奖励；
- `draw`：每次实际抽取的题目数；
- `mix`：三个难度层的抽题配额，例如 `[2, 2, 2]`；
- `questions`：完整题池。

每道题使用以下字段：

| 字段 | 含义 |
|---|---|
| `id` | 全局唯一且保持稳定的题目编号 |
| `level` | 难度层：1 基础识别，2 概念连接，3 综合应用 |
| `concept` | 首次出现时展示的语法导学编号 |
| `p` | 中文题目 |
| `c` | Lean 4 代码或证明状态 |
| `o` | 备选答案数组 |
| `a` | 正确答案在 `o` 中的下标，从 0 开始 |
| `e` | 检查答案后显示的解释 |
| `source` | 可选的来源或改编标记 |

新增题目时，应保证：

1. `id` 不与任何现有题目重复；
2. 三个难度层都有足够题目满足 `mix`；
3. 代码使用 Lean 4 / Mathlib 当前语法；
4. 干扰项应对应真实的初学者误区；
5. 不直接复制外部教程的长题面，应重新表述并补充来源。

## 随机组卷规则

页面打开关卡时：

1. 分别打乱三个难度层；
2. 按 `mix` 从各层抽题；
3. 题目仍按 1 → 2 → 3 的难度顺序呈现；
4. 每题的答案位置再次随机打乱。

因此随机性不会破坏学习曲线。当前每个关卡有 9 题、每次抽取 6 题；练习场有 12 题、每次抽取 6 题。

## 一次性语法导学

`LEANPATH_CONCEPTS` 保存语法导学。题目的 `concept` 指向其中一个键。用户第一次抽到该概念时会看到导学卡；确认后写入浏览器本地进度，此后不再自动弹出。

修改现有概念说明时无需更换键；如果希望所有用户把它视为一个全新概念，应新建键并更新相应题目。

## 参考来源与许可证

题库并非逐题复制，而是参考下列开源教程的知识顺序、常见证明状态和练习类型后重新编写：

- [Natural Number Game 4](https://github.com/leanprover-community/NNG4) — Apache-2.0；
- [Theorem Proving in Lean 4](https://github.com/leanprover/theorem_proving_in_lean4) — Apache-2.0；
- [Mathematics in Lean](https://github.com/leanprover-community/mathematics_in_lean) — Apache-2.0。

其中标有 `source: "nng4-adapted"` 的题目参考了 NNG4 对 `rfl`、`rw` 和反向改写的教学顺序，但题面、选项与中文解释均为重新编写。


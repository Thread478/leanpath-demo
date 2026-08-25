# LeanPath 题库维护说明

课程主题与路线位于 [course-config.js](./course-config.js)，选择题位于 [question-bank.js](./question-bank.js)，真实 Lean 写作题位于 [writing-bank.js](./writing-bank.js)，成果展品清单位于 [showcase-bank.js](./showcase-bank.js)。四者均与页面运行逻辑分离。

当前主题为 **LeanPath Physics**，完整路线分成五部分：单位与量纲 → 欧式空间中的静力学 → 欧式空间中的动力学 → 黎曼流形的构造 → 拉格朗日力学。第一、二部分已经实现，后三部分在地图中作为后续路线展示。

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

1. `id` 不与任何现有题目重复，并尽量使用物理主题前缀；
2. 三个难度层都有足够题目满足 `mix`；
3. 代码使用 Lean 4 / Mathlib / Physlib 当前语法；
4. 干扰项应对应真实的初学者误区；
5. 不直接复制外部教程的长题面，应重新表述并补充来源。

## 随机组卷规则

页面打开关卡时：

1. 分别打乱三个难度层；
2. 按 `mix` 从各层抽题；
3. 题目仍按 1 → 2 → 3 的难度顺序呈现；
4. 每题的答案位置再次随机打乱。

因此随机性不会破坏学习曲线。第一部分和第二部分共 28 个知识关卡，每关各有 9 题、每次抽取 6 题；两次综合实验各有 12 题，每日练习含 24 题，总计 300 道选择题。

## 一次性语法导学

`LEANPATH_CONCEPTS` 保存语法导学。题目的 `concept` 指向其中一个键。用户第一次抽到该概念时会看到导学卡；确认后写入浏览器本地进度，此后不再自动弹出。

修改现有概念说明时无需更换键；如果希望所有用户把它视为一个全新概念，应新建键并更新相应题目。

## 参考来源与许可证

题库并非逐题复制，而是参考暑校 Type Theory / Inductive Type 讲义中的物理量练习，以及下列开源项目的 API、知识顺序和练习类型后重新编写：

- [Physlib](https://github.com/leanprover-community/Physlib) — Apache-2.0；
- [Theorem Proving in Lean 4](https://github.com/leanprover/theorem_proving_in_lean4) — Apache-2.0；
- [Mathematics in Lean](https://github.com/leanprover-community/mathematics_in_lean) — Apache-2.0。

标有 `source: "physlib-adapted"` 的题目依据 Physlib 中真实存在的定义或定理签名重新设计，但题面、选项与中文解释均为本站原创表述。

## Lean 写作题库

真实写作练习位于 [writing-bank.js](./writing-bank.js)，与选择题题库分离。每道写作题包含：

- `template`：完整、不可由学习者修改的 Lean 源码，其中必须且只能有一个 `{{ANSWER}}`；
- `starter`：首次打开时放入答案编辑区的脚手架；
- `placeholder`：编辑器为空时的提示，不会进入提交源码；
- `hint`：AI 不可用时的本地渐进提示；
- `guide`：可选的一次性新概念导学；
- `part`：所属部分；省略时默认为第一部分；
- `unlock`：可选的课程关卡 ID，只有完成该关后才开放这道写作题；
- `xp`：首次被 Lean 接受后的经验奖励。

学习者只编辑 `{{ANSWER}}`。提交时，页面会组合完整源码并交给 Lean Language Server；判定不依赖参考答案字符串。`sorry`、`admit`、`axiom`、`unsafe` 及答案建议占位符会被完整性检查拒绝。

新增写作题时，应同时满足：

1. 模板在当前 Mathlib 环境中可编译；
2. 题目陈述与测试位于不可编辑模板中；
3. 为题目准备至少一个通过答案与一个明确失败的答案，并进行真实 Lean 测试；
4. 不把完整答案写进 `starter` 或默认提示；
5. 在各部分内部保持渐进顺序；第二部分从欧式向量逐步进入力矩、平衡、静定性、虚功与能量稳定性；
6. 同时说明模型假设与现实适用范围，避免把 Lean 的演绎验证表述成经验验证。

判题与 AI 运行时配置见 [../INTEGRATION.md](../INTEGRATION.md)。

## 成果图鉴

[showcase-bank.js](./showcase-bank.js) 记录逐步解锁的代码展品。每个展品的 `unlock` 必须是 `course-config.js` 中存在的关卡 ID；小型展品可直接使用 `code`，完整章节使用 `file` 指向独立 Lean 文件。

第一部分的最终展品是 [../lean/UnitAndDimension.lean](../lean/UnitAndDimension.lean)，第二部分的最终展品是 [../lean/EuclideanStatics.lean](../lean/EuclideanStatics.lean)，分别在领取 `chest` 与 `statics-chest` 后展示。这些文件应作为完整章节作品维护，不得只拼接题目答案；修改后需检查导入、全部定理及 Mathlib/Physlib 调用。

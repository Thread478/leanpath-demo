# LeanPath Physics

**用 Lean 4 学习可检查的经典物理。**

LeanPath Physics 是一个面向学习者的浏览器端互动学习网站。学习者无需安装 Lean、Mathlib 或 Physlib，也无需克隆仓库：打开网站后即可沿课程路径阅读理论卡、完成选择题和 Lean 写作题，并由真实 Lean 语言服务器完成 elaboration、类型检查与内核验证。

项目的目标不是把物理学习变成“背 Lean 语法”，而是让物理模型中的对象、假设、公式与推导都以可检查的形式出现，并明确区分：

- **物理模型是否适用于现实情形**：由学习者根据假设和物理背景判断；
- **结论是否从给定定义与假设严格推出**：由 Lean 内核判断；
- **AI 讲解**：只解释 Lean 诊断或给渐进提示，不改变正确/错误判定。

公共站点的“AI 讲解”默认调用 Puter 的浏览器 AI 网关。只有学习者主动点击按钮时，本题源码与 Lean 诊断才会发送给 AI；首次使用可能需要授权 Puter 账户。若在线模型不可用，页面会明确标注为本地规则提示，不再把规则回退冒充成 AI。

## 课程结构

网站目前包含三个主体单元：

1. **单位与量纲**：SI 基本量、量纲代数、导出量纲、单位换算、仿射单位、类型安全的物理量；
2. **欧式空间中的静力学**：欧式向量、内积与度量、力与力矩、平衡、虚功、势能与稳定性；
3. **欧式空间中的动力学**：运动学、牛顿定律、动量与角动量、功与能、线性振动、刚体动力学、达朗贝尔/拉格朗日表述及中心力与开普勒轨道的代数核心。

课程同时提供可选的 Lean 4 零基础前置内容、随机练习、XP/红心/进度记录、形式化手册和完整 Lean 成果图鉴。

## 在线 Lean 判题

主线写作题通过 `docs/js/lean-checker.js` 使用 Language Server Protocol，经 WebSocket 发送到 Lean 服务。默认公共部署连接官方 `MathlibDemo` 环境，因此所有**主线在线写作题只依赖 Mathlib 或课程模板中自定义的透明模型**。

当前公开的 31 道主线写作题全部使用 Mathlib 环境；目前没有任何题目带 `optional: true` 或 `requires: "physlib"`。前端仍保留可选 Physlib 在线拓展题的架构，但它只是未来扩展能力，不是当前公开题库的组成部分。

具体部署结构见 [`docs/INTEGRATION.md`](docs/INTEGRATION.md)。

## 形式化成果

`docs/lean/` 保存三个单元对应的完整 Lean 成果代码：

- `UnitAndDimension.lean`
- `EuclideanStatics.lean`
- `EuclideanDynamics.lean`

这些文件用于展示课程中逐步出现的定义和定理如何组织成较完整的形式化作品。项目刻意区分三种来源：

- **Mathlib**：通用数学结构与定理；
- **Physlib**：现行物理形式化库中已经存在的单位、梯度、参考系等接口；
- **LeanPath**：为了教学透明性自行建立的量纲、力系、一般维力矩、动力学状态等模型。

仓库根目录现包含标准 Lake 工程。`lean-toolchain` 固定 Lean 版本，`lakefile.toml` 固定 Physlib 提交，`lake-manifest.json` 固定全部传递依赖；一次 `lake build` 会同时编译上述三个成果文件。

## 项目结构

```text
.
├── docs/
│   ├── index.html                 # 网站入口
│   ├── data/                      # 课程、讲义、题库、写作题、成果图鉴
│   ├── js/
│   │   ├── lean-checker.js        # Lean LSP/WebSocket 判题
│   │   └── ai-feedback.js         # AI/本地渐进提示
│   ├── lean/                      # 三个单元的完整 Lean 成果
│   └── INTEGRATION.md             # Lean/Physlib/AI 服务说明
├── lakefile.toml                  # 三个成果文件的 Lake 构建目标
├── lake-manifest.json             # 已解析依赖的精确版本
├── lean-toolchain                 # 固定 Lean 工具链
├── tests/site-check.cjs           # 页面脚本与 AI 状态回归测试
└── .github/workflows/
    ├── pages.yml                  # GitHub Pages 静态站部署
    └── lean.yml                   # 对三个 Lean 成果执行 lake build
```

## 当前部署边界

GitHub Pages 只负责静态前端；真正的 Lean elaboration 和内核检查发生在远端 Lean 服务器。当前公开写作题均面向 Mathlib 小型代码片段。仓库中的完整成果还使用 Physlib 接口，并由根目录 Lake 工程与 GitHub Actions 独立复现。

这一区分是有意的：**普通学习者只使用网站；仓库、Lake 环境和服务器配置属于开发与维护层，不是课程使用门槛。**

## 本地预览

网站本身是静态站点，可使用任意本地 HTTP server 预览 `docs/`。例如：

```bash
python -m http.server 8000 --directory docs
```

然后访问 `http://localhost:8000`。

## 复现三个 Lean 成果

安装 Lean 的推荐版本管理器 Elan 后，在仓库根目录运行：

```bash
lake update
lake exe cache get
lake build
```

其中 `lake update` 按已提交的配置和清单同步依赖，`lake exe cache get` 下载 Mathlib 预编译缓存，`lake build` 编译 `UnitAndDimension.lean`、`EuclideanStatics.lean` 与 `EuclideanDynamics.lean`。相同命令由 `.github/workflows/lean.yml` 在相关推送和 PR 中自动执行。

## 安全与说明

- `runtime-config.js` 会被公开部署，禁止把 API Key 写入其中；
- 默认 Puter AI 通过用户自己的账户授权和额度调用，不在本站保存密钥；若改用自建 AI endpoint，则必须由服务端代理持有密钥；
- 自建 Lean 服务应使用沙箱、资源限制和超时，因为 Lean elaboration 可以执行代码；
- “Lean 验证通过”只说明结论由当前形式化定义和假设推出，不替代物理实验或模型适用性分析。

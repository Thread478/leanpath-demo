# LeanPath Physics

**用 Lean 4 学习可检查的经典物理。**

LeanPath Physics 是一个面向学习者的浏览器端互动学习网站。学习者无需安装 Lean、Mathlib 或 Physlib，也无需克隆仓库：打开网站后即可沿课程路径阅读理论卡、完成选择题和 Lean 写作题，并由真实 Lean 语言服务器完成 elaboration、类型检查与内核验证。

项目的目标不是把物理学习变成“背 Lean 语法”，而是让物理模型中的对象、假设、公式与推导都以可检查的形式出现，并明确区分：

- **物理模型是否适用于现实情形**：由学习者根据假设和物理背景判断；
- **结论是否从给定定义与假设严格推出**：由 Lean 内核判断；
- **AI 讲解**：只解释 Lean 诊断或给渐进提示，不改变正确/错误判定。

## 课程结构

网站目前包含三个主体单元：

1. **单位与量纲**：SI 基本量、量纲代数、导出量纲、单位换算、仿射单位、类型安全的物理量；
2. **欧式空间中的静力学**：欧式向量、内积与度量、力与力矩、平衡、虚功、势能与稳定性；
3. **欧式空间中的动力学**：运动学、牛顿定律、动量与角动量、功与能、线性振动、刚体动力学、达朗贝尔/拉格朗日表述及中心力与开普勒轨道的代数核心。

课程同时提供可选的 Lean 4 零基础前置内容、随机练习、XP/红心/进度记录、形式化手册和完整 Lean 成果图鉴。

## 在线 Lean 判题

主线写作题通过 `docs/js/lean-checker.js` 使用 Language Server Protocol，经 WebSocket 发送到 Lean 服务。默认公共部署连接官方 `MathlibDemo` 环境，因此所有**主线在线写作题只依赖 Mathlib 或课程模板中自定义的透明模型**。

少量直接依赖 `Physlib.*` 的题目被明确标记为 **Physlib 拓展题**：

- 默认公共站点不会声称官方 Mathlib 服务能够加载 Physlib；
- 未配置 Physlib 服务时，拓展题不会误扣红心，也不会阻塞主线写作进度；
- 部署带 Physlib 依赖的自建 `lean4web` 项目后，只需在 `docs/data/runtime-config.js` 配置 `physlibWebSocket` 与 `physlibProject`，拓展题即可恢复真实在线 Lean 判题。

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
└── .github/workflows/pages.yml    # GitHub Pages 静态站部署
```

## 当前部署边界

GitHub Pages 只负责静态前端；真正的 Lean elaboration 和内核检查发生在远端 Lean 服务器。当前默认服务面向 Mathlib 小型代码片段。Physlib 拓展题若要在网页中直接验证，需要额外部署带 Physlib 的 Lean 服务。

这一区分是有意的：**普通学习者只使用网站；仓库、Lake 环境和服务器配置属于开发与维护层，不是课程使用门槛。**

## 本地预览

网站本身是静态站点，可使用任意本地 HTTP server 预览 `docs/`。例如：

```bash
python -m http.server 8000 --directory docs
```

然后访问 `http://localhost:8000`。

## 安全与说明

- `runtime-config.js` 会被公开部署，禁止把 API Key 写入其中；
- AI 云端接口必须由服务端代理持有密钥；
- 自建 Lean 服务应使用沙箱、资源限制和超时，因为 Lean elaboration 可以执行代码；
- “Lean 验证通过”只说明结论由当前形式化定义和假设推出，不替代物理实验或模型适用性分析。

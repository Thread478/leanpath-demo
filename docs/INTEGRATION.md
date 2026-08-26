# LeanPath 判题、Physlib 与 AI 集成

## 1. 面向学习者的架构

普通用户只需要打开 LeanPath 网站，不需要安装 Lean，也不需要克隆仓库。

```text
浏览器中的 LeanPath
       │
       │ WebSocket / LSP
       ▼
   Lean 服务器
       │
       ├─ Mathlib 主线环境
       └─ Physlib 拓展环境（可选、自建）
```

Lean 负责 elaboration、类型检查与内核验证，并给出唯一的通过/失败结论。AI 只解释 Lean 诊断、评价已通过的写法或给渐进提示，不能更改 Lean 的判定。

## 2. 当前公共部署：Mathlib 主线

`data/runtime-config.js` 默认使用：

```js
leanWebSocket: "wss://live.lean-lang.org/websocket/MathlibDemo",
leanProject: "MathlibDemo"
```

这个服务用于主线在线写作题。LeanPath **不假设**官方 `MathlibDemo` 同时包含 Physlib，因此公共站点的服务标签只写作“Lean 4 + Mathlib · 官方在线判题”。

直接 `import Physlib...` 的题目带有：

```js
optional: true,
requires: "physlib"
```

当 `physlibWebSocket` 为空时，它们被显示为“Physlib 拓展题”：可以阅读题目与代码模板，但不会阻塞后续主线写作题，也不会因服务器缺少 Physlib 而扣红心。

## 3. 启用 Physlib 在线判题

`lean4web` 支持把任意 Lake project 作为服务器项目。因此正式启用 Physlib 的推荐结构是：

```text
GitHub Pages / 其他静态站
          │
          │ wss://lean.example.org/...
          ▼
       lean4web
          │
          ▼
 Projects/LeanPath/
    ├─ leanweb-config.json
    ├─ leanweb-build.sh
    ├─ lakefile.toml
    ├─ lean-toolchain
    └─ LeanPath.lean
          │
          └─ Physlib → Mathlib
```

### 3.1 建立 LeanPath 服务器项目

在自建 `lean4web` 的 `Projects/LeanPath/` 中建立一个标准 Lake project。依赖版本应固定到你已经在本地验证过的 Physlib commit，而不是长期跟随 `master`。

示意 `lakefile.toml`：

```toml
name = "LeanPath"
defaultTargets = ["LeanPath"]

[[require]]
name = "Physlib"
git = "https://github.com/leanprover-community/physlib.git"
rev = "<你已经验证过的 Physlib commit>"

[[lean_lib]]
name = "LeanPath"
```

`LeanPath.lean` 可以至少写：

```lean
import Mathlib
import Physlib.Units.WithDim.Speed
import Physlib.Mathematics.Calculus.Gradient
```

服务器第一次构建时运行：

```bash
lake update
lake exe cache get
lake build
```

并提交生成的 `lake-manifest.json`，以固定解析后的依赖版本。

### 3.2 lean4web 项目描述

`leanweb-config.json` 示例：

```json
{
  "name": "LeanPath _LeanVers_ + Physlib",
  "default": false,
  "hidden": false,
  "sortOrder": 10,
  "examples": []
}
```

`leanweb-build.sh` 示例：

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
lake exe cache get
lake build
```

之后按 lean4web 文档构建并启动服务器。生产环境需要 HTTPS/WSS、反向代理以及 Lean 进程沙箱；不要把未隔离的 Lean server 直接暴露到公网。

### 3.3 让 LeanPath 前端切换到 Physlib 服务

自建服务可用后，只需要修改 `data/runtime-config.js`：

```js
physlibWebSocket: "wss://lean.example.org/websocket/LeanPath",
physlibProject: "LeanPath",
physlibServiceLabel: "Lean 4 + Mathlib + Physlib · 在线判题"
```

主线 Mathlib 题继续使用 `leanWebSocket`；带 `requires: "physlib"` 的拓展题自动使用 `physlibWebSocket`。不需要修改每一道题的判题代码。

> WebSocket 的具体路径必须以你的 lean4web/reverse-proxy 部署为准。先在部署环境确认连接地址，再填写到公开配置中。

## 4. 判题完整性

`js/lean-checker.js` 会把完整练习源码发送给 Lean Language Server，并等待 diagnostics 与文件处理完成。本站额外拒绝以下用于绕过练习的占位方式：

- `sorry`
- `admit`
- `axiom`
- `unsafe`
- `by?` / `exact?` 自动答案占位

这些前端检查只是课程完整性规则；真正的类型正确性仍由 Lean elaborator 与内核决定。

## 5. AI 讲解顺序

`js/ai-feedback.js` 按以下顺序选择讲解能力：

1. `runtime-config.js` 中配置的 `aiEndpoint`；
2. 浏览器原生 `LanguageModel`（可用时在本地运行）；
3. 明确标注为“本地规则提示（AI 未配置）”的非 AI 后备提示。

`runtime-config.js` 会公开发布，严禁写入任何 API Key。云端 AI 必须放在服务端代理之后，并在代理中保存密钥、限制来源、设置速率与费用上限。

## 6. AI Endpoint 协议

页面发送：

```json
{
  "locale": "zh-CN",
  "task": {
    "id": "unit-write-kinetic-dimension",
    "title": "验证动能量纲",
    "prompt": "练习说明",
    "hint": "本地渐进提示"
  },
  "source": "完整 Lean 源码",
  "leanResult": {
    "ok": false,
    "diagnostics": [],
    "warnings": []
  }
}
```

代理应返回：

```json
{
  "provider": "AI 助教",
  "feedback": "简体中文解释；不要覆盖 Lean 判定，也不要直接泄露完整答案。"
}
```

跨域代理还需允许站点来源的 `POST` 与 `content-type` 请求。建议只在已经有 Lean 结果后调用 AI，并对源码与诊断设置长度上限。

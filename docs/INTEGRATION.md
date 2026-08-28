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
       └─ Physlib 拓展环境（架构预留、可选自建）
```

Lean 负责 elaboration、类型检查与内核验证，并给出唯一的通过/失败结论。AI 只解释 Lean 诊断、评价已通过的写法或给渐进提示，不能更改 Lean 的判定。

## 2. 当前公共部署：Mathlib 主线

`data/runtime-config.js` 默认使用：

```js
leanWebSocket: "wss://live.lean-lang.org/websocket/MathlibDemo",
leanProject: "MathlibDemo"
```

这个服务用于主线在线写作题。LeanPath **不假设**官方 `MathlibDemo` 同时包含 Physlib，因此公共站点的服务标签只写作“Lean 4 + Mathlib · 官方在线判题”。

公共服务可能因冷启动或排队出现短时延迟。判题器把连接与编译分开处理：WebSocket 建连默认等待 20 秒，并只对网络中断自动重连一次；连接成功后，LSP 初始化和完整源码编译各自最多等待 120 秒。页面会显示当前处于连接、初始化还是编译阶段，任何服务故障都不会扣除红心。需要调整时可在 `runtime-config.js` 中覆盖：

```js
leanConnectTimeout: 20000,
leanCompileTimeout: 120000,
leanRetryCount: 1,
leanRetryDelay: 900
```

自动重连只针对 WebSocket 建连失败或提前关闭，不会对一份正在超时编译的源码重复提交，以免在公共服务拥堵时进一步增加负载。

前端为未来直接 `import Physlib...` 的题目预留了以下字段：

```js
optional: true,
requires: "physlib"
```

当 `physlibWebSocket` 为空时，这类题会显示为“Physlib 拓展题”，不会阻塞主线或扣红心。不过，**当前公开的 31 道写作题全部使用 Mathlib 环境，没有任何一题带上述字段**。这是受测试的扩展机制，不是当前已有题目。

## 3. 将来启用 Physlib 在线判题

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

仓库根目录现在已经是标准 Lake project，并固定了三个完整成果使用的 Lean 与 Physlib 版本。若将来部署自建 `lean4web`，可复用这些版本；服务器依赖不应长期跟随 `master`。

示意 `lakefile.toml`：

```toml
name = "LeanPath"
defaultTargets = ["LeanPath"]

[[require]]
name = "Physlib"
git = "https://github.com/leanprover-community/physlib.git"
rev = "1395e18a75c63b257f5bb1124400bf4d14fa174e"

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
2. 公共站点默认启用的 [Puter 浏览器 AI 网关](https://docs.puter.com/AI/chat/)；
3. 浏览器原生 `LanguageModel`（可用时在本地运行）；
4. 明确标注为“本地规则提示（在线 AI 已降级/未启用）”的非 AI 后备提示。

Puter 使用用户付费模式：首次调用可能要求学习者授权 Puter 账户，调用消耗该用户自己的免费额度或账户额度，本站不保存 API Key。只有主动点击“AI 讲解”时才会发送本题源码与 Lean 诊断。若配置自建 endpoint，它拥有最高优先级，密钥必须保存在服务端，并应设置来源限制、速率限制和费用上限。

## 6. 自建 AI Endpoint 协议

页面发送：

```json
{
  "locale": "zh-CN",
  "task": {
    "id": "unit-v2-kinetic-dimension",
    "title": "动能的量纲推导",
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

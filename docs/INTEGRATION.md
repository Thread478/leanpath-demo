# LeanPath 判题与 AI 集成

## 判题责任

LeanPath 将两种能力严格分开：

- Lean 负责 elaboration、类型检查与内核验证，并给出唯一的通过/失败结论；
- AI 只解释 Lean 诊断、评价已通过的写法或给出一个渐进提示，不能更改判定。

页面通过 `js/lean-checker.js` 使用 Language Server Protocol。默认配置连接 `wss://live.lean-lang.org/websocket/MathlibDemo`，当前环境同时可加载 Mathlib 与 Physlib，因此 GitHub Pages 上的静态站点也能提交真实物理形式化源码。这里的 Physlib 是由原通用物理库 PhysLean（更早名 HepLean）与 Lean-QuantumInfo 合并形成的现行项目；当前构建目标与模块前缀均为 `Physlib`。生产部署若需要独立容量、固定依赖版本与稳定性，应部署自己的 [lean4web](https://github.com/leanprover-community/lean4web) 服务，并固定 Mathlib/Physlib 提交版本，然后修改 `data/runtime-config.js` 中的 `leanWebSocket`、`leanProject` 与显示标签。

Lean elaboration 可以执行代码。自建服务必须使用沙箱、网络隔离、资源限制和超时；不要直接把未隔离的 Lean 进程暴露到公网。形式验证只说明结论由当前定义与假设推出，不替代物理模型的实验验证。

## AI 讲解顺序

`js/ai-feedback.js` 按以下顺序选择讲解能力：

1. `runtime-config.js` 中配置的 `aiEndpoint`；
2. 浏览器原生 `LanguageModel`（可用时在本地运行）；
3. 明确标注为“本地规则提示（AI 未配置）”的非 AI 后备提示。

`runtime-config.js` 会公开发布，严禁写入任何 API Key。云端 AI 必须放在服务端代理之后，并在代理中保存密钥、限制来源、设置速率与费用上限。

## AI Endpoint 协议

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

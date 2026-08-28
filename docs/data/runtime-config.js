/*
 * LeanPath runtime configuration.
 *
 * This file is public on GitHub Pages. Never put API keys or other secrets here.
 * `aiEndpoint` may point to a server-side proxy that owns its credentials.
 * The public site otherwise uses Puter's browser AI gateway. No API key is
 * stored here; Puter asks the learner to authorize their own account.
 *
 * The public default uses the official MathlibDemo Lean service. Physlib is NOT
 * assumed to exist there. The public writing bank currently contains no
 * Physlib-only task; the fields below reserve a future extension path.
 */
(function () {
  window.LEANPATH_CONFIG = Object.assign({
    leanWebSocket: "wss://live.lean-lang.org/websocket/MathlibDemo",
    leanProject: "MathlibDemo",
    leanServiceLabel: "Lean 4 + Mathlib · 官方在线判题",

    // Optional future Physlib-capable service. Leave blank on the public site
    // until both a self-hosted project and Physlib writing tasks exist.
    physlibWebSocket: "",
    physlibProject: "LeanPath",
    physlibServiceLabel: "Lean 4 + Mathlib + Physlib · 自建在线判题",

    // Optional custom proxy. When set, this takes priority over Puter.
    aiEndpoint: "",

    // Public-site AI provider. Puter is loaded by docs/index.html and performs
    // browser-side authentication on first use. Set to "none" to disable it.
    aiProvider: "puter",
    aiModel: "gpt-5-nano",
    aiTimeout: 60000
  }, window.LEANPATH_CONFIG || {});
}());

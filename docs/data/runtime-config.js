/*
 * LeanPath runtime configuration.
 *
 * This file is public on GitHub Pages. Never put API keys or other secrets here.
 * `aiEndpoint` must point to a server-side proxy that owns its credentials.
 *
 * The public default uses the official MathlibDemo Lean service. Physlib is NOT
 * assumed to exist there. To enable the optional Physlib exercises, deploy a
 * lean4web project that depends on Physlib and fill in physlibWebSocket below.
 */
(function () {
  window.LEANPATH_CONFIG = Object.assign({
    leanWebSocket: "wss://live.lean-lang.org/websocket/MathlibDemo",
    leanProject: "MathlibDemo",
    leanServiceLabel: "Lean 4 + Mathlib · 官方在线判题",

    // Optional Physlib-capable service. Leave blank on the public static site
    // until a self-hosted Lean project with Physlib has been deployed.
    physlibWebSocket: "",
    physlibProject: "LeanPath",
    physlibServiceLabel: "Lean 4 + Mathlib + Physlib · 自建在线判题",

    aiEndpoint: ""
  }, window.LEANPATH_CONFIG || {});
}());

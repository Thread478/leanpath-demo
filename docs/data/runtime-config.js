/*
 * LeanPath runtime configuration.
 *
 * This file is public on GitHub Pages. Never put API keys or other secrets here.
 * `aiEndpoint` must point to a server-side proxy that owns its credentials.
 */
(function () {
  window.LEANPATH_CONFIG = Object.assign({
    leanWebSocket: "wss://live.lean-lang.org/websocket/MathlibDemo",
    leanProject: "MathlibDemo",
    leanServiceLabel: "Lean 4 + Mathlib + Physlib · live.lean-lang.org",
    aiEndpoint: ""
  }, window.LEANPATH_CONFIG || {});
}());

/* Real Lean 4 checking through the Language Server Protocol over WebSocket. */
(function () {
  const DEFAULT_CONNECT_TIMEOUT = 20000;
  const DEFAULT_COMPILE_TIMEOUT = 120000;
  const DEFAULT_RETRY_COUNT = 1;
  const DEFAULT_RETRY_DELAY = 900;

  function positiveNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : fallback;
  }

  function checkerError(code, message) {
    const error = new Error(message);
    error.code = code;
    return error;
  }

  function messageText(message) {
    if (typeof message === "string") return message;
    if (message && typeof message.value === "string") return message.value;
    try { return JSON.stringify(message); } catch (error) { return String(message); }
  }

  function checkForbidden(source) {
    const rules = [
      {pattern:/\bsorry\b/i,label:"sorry"},
      {pattern:/\badmit\b/i,label:"admit"},
      {pattern:/\baxiom\b/i,label:"axiom"},
      {pattern:/\bunsafe\b/i,label:"unsafe"},
      {pattern:/\b(?:by|exact)\?/i,label:"自动答案占位符"}
    ];
    const hit = rules.find(function(rule){return rule.pattern.test(source);});
    if (!hit) return null;
    return {
      severity: 1,
      source: "LeanPath integrity check",
      message: "不能使用 " + hit.label + " 绕过练习。请提交一个由 Lean 内核完整检查的定义或证明。",
      range: {start:{line:0,character:0},end:{line:0,character:1}}
    };
  }

  function createChecker(options) {
    const config = Object.assign({}, window.LEANPATH_CONFIG || {}, options || {});
    const project = config.leanProject || "MathlibDemo";
    const socketUrl = config.leanWebSocket;
    const connectTimeout = positiveNumber(config.leanConnectTimeout, DEFAULT_CONNECT_TIMEOUT);
    const compileTimeout = positiveNumber(config.leanCompileTimeout || config.leanTimeout, DEFAULT_COMPILE_TIMEOUT);
    const retryDelay = positiveNumber(config.leanRetryDelay, DEFAULT_RETRY_DELAY);
    const retryCount = Math.min(2, Math.max(0,
      Number.isFinite(Number(config.leanRetryCount)) ? Math.floor(Number(config.leanRetryCount)) : DEFAULT_RETRY_COUNT
    ));

    function notify(message) {
      if (typeof config.onStatus !== "function") return;
      try { config.onStatus(message); } catch (error) {}
    }

    function checkOnce(source, attempt) {
      return new Promise(function (resolve, reject) {
        const unique = "LeanPath_" + Date.now() + "_" + Math.random().toString(36).slice(2) + ".lean";
        const rootUri = "file:///" + project;
        const uri = rootUri + "/" + unique;
        let socket;
        let diagnostics = [];
        let initialized = false;
        let settled = false;
        let requestId = 1;
        let phase = "connecting";
        let timer;

        notify(attempt > 1 ? "正在重新连接 Lean 服务（第 " + attempt + " 次）" : "正在连接 Lean 服务");

        function timeoutError() {
          if (phase === "connecting") {
            return checkerError("connection_timeout", "连接 Lean 服务超时，无法建立 WebSocket。请稍后再试或检查网络是否允许 WSS 连接。");
          }
          if (phase === "initializing") {
            return checkerError("initialization_timeout", "Lean 服务已连接，但语言服务器启动超时。公共服务可能正在排队，请稍后重试。");
          }
          return checkerError("compilation_timeout", "Lean 已连接，但本题在 " + Math.ceil(compileTimeout / 1000) + " 秒内尚未完成编译。公共服务可能拥堵；本次不扣红心，请稍后重试。");
        }

        function resetTimer(milliseconds) {
          clearTimeout(timer);
          timer = setTimeout(function () { finish(timeoutError()); }, milliseconds);
        }

        function finish(error, result) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          try { if (socket) socket.close(); } catch (closeError) {}
          if (error) reject(error); else resolve(result);
        }

        function send(message) {
          socket.send(JSON.stringify(Object.assign({jsonrpc:"2.0"}, message)));
        }

        resetTimer(connectTimeout);
        try {
          socket = new WebSocket(socketUrl);
        } catch (error) {
          finish(checkerError("connection_error", "浏览器无法创建 Lean WebSocket 连接，请检查服务地址与网络设置。"));
          return;
        }

        socket.addEventListener("open", function () {
          phase = "initializing";
          resetTimer(compileTimeout);
          notify("Lean 服务已连接，正在启动语言服务器");
          send({
            id:requestId++,
            method:"initialize",
            params:{
              processId:null,
              clientInfo:{name:"LeanPath",version:"0.3"},
              rootUri:rootUri,
              workspaceFolders:[{uri:rootUri,name:project}],
              capabilities:{textDocument:{publishDiagnostics:{relatedInformation:true}}}
            }
          });
        });

        socket.addEventListener("message", function (event) {
          let message;
          try { message = JSON.parse(event.data); } catch (error) { return; }

          if (message.method && message.id !== undefined) {
            send({id:message.id,result:null});
          }

          if (message.id === 1 && message.error && !initialized) {
            finish(checkerError("initialization_error", "Lean 语言服务器初始化失败：" + messageText(message.error.message || message.error)));
            return;
          }

          if (message.id === 1 && message.result && !initialized) {
            initialized = true;
            phase = "compiling";
            resetTimer(compileTimeout);
            notify("Lean 已启动，正在编译完整练习源码");
            send({method:"initialized",params:{}});
            send({
              method:"textDocument/didOpen",
              params:{textDocument:{uri:uri,languageId:"lean4",version:1,text:source}}
            });
            return;
          }

          if (message.method === "textDocument/publishDiagnostics" && message.params && message.params.uri === uri) {
            diagnostics = (message.params.diagnostics || []).map(function (item) {
              return Object.assign({}, item, {message:messageText(item.message)});
            });
          }

          if (message.method === "$/lean/fileProgress" && message.params && message.params.textDocument && message.params.textDocument.uri === uri && Array.isArray(message.params.processing) && message.params.processing.length === 0) {
            const errors = diagnostics.filter(function(item){return item.severity === 1;});
            const warnings = diagnostics.filter(function(item){return item.severity !== 1;});
            finish(null, {ok:errors.length === 0,diagnostics:errors,warnings:warnings,provider:"lean-lsp"});
          }
        });

        socket.addEventListener("error", function () {
          finish(checkerError("connection_error", "无法连接 Lean 判题服务，请稍后再试。"));
        });

        socket.addEventListener("close", function () {
          if (!settled) finish(checkerError("connection_closed", "Lean 判题连接提前关闭，请重试。"));
        });
      });
    }

    return {
      check: function (source) {
        const forbidden = checkForbidden(source);
        if (forbidden) return Promise.resolve({ok:false,diagnostics:[forbidden],warnings:[],provider:"integrity"});
        if (!socketUrl) return Promise.reject(new Error("尚未配置 Lean WebSocket 服务。"));
        let attempt = 1;
        function run(remainingRetries) {
          return checkOnce(source, attempt).catch(function (error) {
            const retryable = error && (error.code === "connection_timeout" || error.code === "connection_error" || error.code === "connection_closed");
            if (!retryable || remainingRetries <= 0) throw error;
            attempt += 1;
            notify("Lean 连接中断，正在自动重连一次");
            return new Promise(function (resolve) { setTimeout(resolve, retryDelay); })
              .then(function () { return run(remainingRetries - 1); });
          });
        }
        return run(retryCount);
      }
    };
  }

  window.LeanPathLean = {createChecker:createChecker,checkForbidden:checkForbidden};
}());

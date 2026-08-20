/* Real Lean 4 checking through the Language Server Protocol over WebSocket. */
(function () {
  const DEFAULT_TIMEOUT = 45000;

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

    return {
      check: function (source) {
        const forbidden = checkForbidden(source);
        if (forbidden) return Promise.resolve({ok:false,diagnostics:[forbidden],warnings:[],provider:"integrity"});
        if (!socketUrl) return Promise.reject(new Error("尚未配置 Lean WebSocket 服务。"));

        return new Promise(function (resolve, reject) {
          const unique = "LeanPath_" + Date.now() + "_" + Math.random().toString(36).slice(2) + ".lean";
          const rootUri = "file:///" + project;
          const uri = rootUri + "/" + unique;
          const socket = new WebSocket(socketUrl);
          let diagnostics = [];
          let initialized = false;
          let settled = false;
          let requestId = 1;

          const timer = setTimeout(function () {
            finish(new Error("Lean 判题超时，请检查网络后重试。"));
          }, Number(config.leanTimeout) || DEFAULT_TIMEOUT);

          function finish(error, result) {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            try { socket.close(); } catch (closeError) {}
            if (error) reject(error); else resolve(result);
          }

          function send(message) {
            socket.send(JSON.stringify(Object.assign({jsonrpc:"2.0"}, message)));
          }

          socket.addEventListener("open", function () {
            send({
              id:requestId++,
              method:"initialize",
              params:{
                processId:null,
                clientInfo:{name:"LeanPath",version:"0.2"},
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

            if (message.id === 1 && message.result && !initialized) {
              initialized = true;
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
            finish(new Error("无法连接 Lean 判题服务，请稍后再试。"));
          });

          socket.addEventListener("close", function () {
            if (!settled) finish(new Error("Lean 判题连接提前关闭，请重试。"));
          });
        });
      }
    };
  }

  window.LeanPathLean = {createChecker:createChecker,checkForbidden:checkForbidden};
}());

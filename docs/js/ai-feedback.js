/* AI explanation. Correctness always comes from Lean, never this layer. */
(function () {
  function localExplanation(task, result) {
    if (result && result.ok) {
      return "Lean 已经接受当前代码：所有目标均已关闭，当前声明通过了 elaboration 与内核检查。\n\n" +
        "下一步可检查证明是否清楚表达了物理假设，并尝试说明该形式化模型的适用边界。";
    }
    const first = result && result.diagnostics && result.diagnostics[0];
    const raw = first ? first.message : "";
    let reason = "Lean 没有接受当前代码。请从第一条诊断开始，分别检查物理假设、量纲/类型和证明步骤。";
    if (/unknown identifier/i.test(raw)) reason = "Lean 找不到某个名字。检查拼写、命名空间，以及是否已经 import 相应模块。";
    else if (/type mismatch|application type mismatch/i.test(raw)) reason = "这里出现了类型不匹配：你提供的项与 Lean 当前期待的类型不同。";
    else if (/unsolved goals/i.test(raw)) reason = "证明脚本已经执行，但仍有目标没有关闭。查看诊断末尾的 ⊢，那就是下一步要证明的命题。";
    else if (/Tactic `rfl` failed/i.test(raw)) reason = "rfl 只处理定义上相同的两边；当前等式需要改写、化简或引用已有定理。";
    else if (/unexpected|expected/i.test(raw)) reason = "这通常是语法结构未闭合或关键字位置不正确。优先检查括号、缩进与 by 后的策略块。";
    return reason + "\n\n渐进提示：" + task.hint;
  }

  function feedbackPrompt(task, source, result) {
    const diagnostics = (result.diagnostics || [])
      .concat(result.warnings || [])
      .map(function(item){return item.message;})
      .join("\n---\n") || "Lean 已通过，没有错误诊断。";
    return [
      "你是 Lean 4 物理形式化初学者助教。Lean 内核的结果是唯一代码正确性依据，你不能推翻它；物理模型的经验有效性需要另行审查。",
      "请用简体中文回答。若 Lean 未通过，判断第一处关键问题属于物理假设、量纲/类型还是 Lean 证明步骤，并只给一个渐进提示，不要直接给完整答案。若已通过，简短评价证明思路并指出模型边界。",
      "练习：" + task.title + "——" + task.prompt,
      "学生代码：\n" + source.slice(0, 16000),
      "Lean 结果：" + (result.ok ? "通过" : "未通过"),
      "Lean 诊断：\n" + diagnostics.slice(0, 6000)
    ].join("\n\n");
  }

  function withTimeout(promise, timeout, message) {
    let timer;
    const timeoutPromise = new Promise(function(_, reject) {
      timer = setTimeout(function(){reject(new Error(message));}, timeout);
    });
    return Promise.race([promise, timeoutPromise]).finally(function(){clearTimeout(timer);});
  }

  async function endpointExplanation(endpoint, task, source, result, timeout) {
    const controller = typeof AbortController === "function" ? new AbortController() : null;
    const request = fetch(endpoint, {
      method:"POST",
      headers:{"content-type":"application/json"},
      signal:controller ? controller.signal : undefined,
      body:JSON.stringify({
        locale:"zh-CN",
        task:{id:task.id,title:task.title,prompt:task.prompt,hint:task.hint},
        source:source,
        leanResult:{ok:result.ok,diagnostics:result.diagnostics,warnings:result.warnings}
      })
    });
    const response = await withTimeout(request, timeout, "AI 代理响应超时").catch(function(error) {
      if (controller) controller.abort();
      throw error;
    });
    if (!response.ok) throw new Error("AI 服务返回 " + response.status);
    const data = await response.json();
    if (!data || typeof data.feedback !== "string") throw new Error("AI 服务响应格式不正确");
    return {provider:data.provider || "云端 AI 助教",feedback:data.feedback};
  }

  function puterResponseText(response) {
    if (typeof response === "string") return response;
    if (response && typeof response.text === "string") return response.text;
    const content = response && response.message && response.message.content;
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      const text = content.map(function(item) {
        if (typeof item === "string") return item;
        return item && typeof item.text === "string" ? item.text : "";
      }).filter(Boolean).join("\n");
      if (text) return text;
    }
    const fallback = String(response || "");
    return fallback === "[object Object]" ? "" : fallback;
  }

  async function puterExplanation(task, source, result, model, timeout) {
    if (!window.puter || !window.puter.ai || typeof window.puter.ai.chat !== "function") {
      throw new Error("Puter AI SDK 未加载");
    }
    const response = await withTimeout(
      window.puter.ai.chat(feedbackPrompt(task, source, result), {
        model:model,
        temperature:0.2,
        max_tokens:700
      }),
      timeout,
      "Puter AI 响应超时"
    );
    const feedback = puterResponseText(response).trim();
    if (!feedback) throw new Error("Puter AI 返回了空响应");
    return {provider:"Puter AI · " + model,feedback:feedback};
  }

  async function browserExplanation(task, source, result) {
    if (!("LanguageModel" in window)) return null;
    const availability = await window.LanguageModel.availability();
    if (availability === "unavailable") return null;
    const session = await window.LanguageModel.create();
    try {
      const feedback = await session.prompt(feedbackPrompt(task, source, result));
      return {provider:"浏览器本地 AI",feedback:String(feedback)};
    } finally {
      if (typeof session.destroy === "function") session.destroy();
    }
  }

  async function explain(task, source, result) {
    const config = window.LEANPATH_CONFIG || {};
    const endpoint = config.aiEndpoint;
    const timeout = Math.max(5000, Number(config.aiTimeout) || 60000);
    const failures = [];
    if (endpoint) {
      try { return await endpointExplanation(endpoint, task, source, result, timeout); }
      catch (error) { failures.push("自建 AI 代理不可用"); }
    }
    if (config.aiProvider === "puter") {
      try {
        return await puterExplanation(task, source, result, config.aiModel || "gpt-5-nano", timeout);
      } catch (error) {
        failures.push("Puter AI 未授权、被拦截或暂时不可用");
      }
    }
    try {
      const browserResult = await browserExplanation(task, source, result);
      if (browserResult) return browserResult;
    } catch (error) { failures.push("浏览器本地模型不可用"); }
    const provider = failures.length
      ? "本地规则提示（在线 AI 已降级）"
      : "本地规则提示（在线 AI 未启用）";
    const note = failures.length ? "\n\n在线 AI 状态：" + failures.join("；") + "。" : "";
    return {provider:provider,feedback:localExplanation(task, result) + note};
  }

  window.LeanPathAI = {explain:explain};
}());

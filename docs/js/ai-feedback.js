/* Optional AI explanation. Correctness always comes from Lean, never this layer. */
(function () {
  function localExplanation(task, result) {
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

  async function endpointExplanation(endpoint, task, source, result) {
    const response = await fetch(endpoint, {
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify({
        locale:"zh-CN",
        task:{id:task.id,title:task.title,prompt:task.prompt,hint:task.hint},
        source:source,
        leanResult:{ok:result.ok,diagnostics:result.diagnostics,warnings:result.warnings}
      })
    });
    if (!response.ok) throw new Error("AI 服务返回 " + response.status);
    const data = await response.json();
    if (!data || typeof data.feedback !== "string") throw new Error("AI 服务响应格式不正确");
    return {provider:data.provider || "云端 AI 助教",feedback:data.feedback};
  }

  async function browserExplanation(task, source, result) {
    if (!("LanguageModel" in window)) return null;
    const availability = await window.LanguageModel.availability();
    if (availability === "unavailable") return null;
    const session = await window.LanguageModel.create();
    try {
      const diagnostics = (result.diagnostics || []).map(function(item){return item.message;}).join("\n---\n") || "Lean 已通过，没有错误诊断。";
      const prompt = [
        "你是 Lean 4 物理形式化初学者助教。Lean 内核的结果是唯一代码正确性依据，你不能推翻它；物理模型的经验有效性需要另行审查。",
        "请用简体中文判断第一处关键问题属于物理假设、量纲/类型还是 Lean 证明步骤，并只给一个渐进提示；不要直接给完整答案。若已通过，简短评价证明思路和模型边界。",
        "练习：" + task.title + "——" + task.prompt,
        "学生代码：\n" + source,
        "Lean 结果：" + (result.ok ? "通过" : "未通过"),
        "Lean 诊断：\n" + diagnostics
      ].join("\n\n");
      const feedback = await session.prompt(prompt);
      return {provider:"浏览器本地 AI",feedback:String(feedback)};
    } finally {
      if (typeof session.destroy === "function") session.destroy();
    }
  }

  async function explain(task, source, result) {
    const endpoint = (window.LEANPATH_CONFIG || {}).aiEndpoint;
    if (endpoint) {
      try { return await endpointExplanation(endpoint, task, source, result); } catch (error) {}
    }
    try {
      const browserResult = await browserExplanation(task, source, result);
      if (browserResult) return browserResult;
    } catch (error) {}
    return {provider:"本地规则提示（AI 未配置）",feedback:localExplanation(task, result)};
  }

  window.LeanPathAI = {explain:explain};
}());

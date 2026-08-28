const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

function compileJavaScript() {
  const directories = ["docs/data", "docs/js"];
  for (const directory of directories) {
    for (const name of fs.readdirSync(path.join(root, directory))) {
      if (!name.endsWith(".js")) continue;
      const filename = path.join(root, directory, name);
      new vm.Script(fs.readFileSync(filename, "utf8"), {filename});
    }
  }

  const htmlPath = path.join(root, "docs/index.html");
  const html = fs.readFileSync(htmlPath, "utf8");
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
  for (const match of scripts) {
    if (match[1].trim()) new vm.Script(match[1], {filename:htmlPath});
  }
}

function loadAI(config, extras = {}) {
  const window = Object.assign({LEANPATH_CONFIG:config}, extras.window || {});
  const context = {
    window,
    fetch:extras.fetch || (async () => { throw new Error("unexpected fetch"); }),
    AbortController,
    Promise,
    setTimeout,
    clearTimeout
  };
  const filename = path.join(root, "docs/js/ai-feedback.js");
  vm.runInNewContext(fs.readFileSync(filename, "utf8"), context, {filename});
  return window.LeanPathAI;
}

function checkContentContracts() {
  const context = vm.createContext({window:{}});
  for (const relative of ["docs/data/writing-bank.js", "docs/data/dynamics-writing-bank.js"]) {
    const filename = path.join(root, relative);
    vm.runInContext(fs.readFileSync(filename, "utf8"), context, {filename});
  }
  const tasks = context.window.LEANPATH_WRITING_BANK.tasks;
  assert.equal(tasks.length, 31);
  assert.equal(new Set(tasks.map(task => task.id)).size, tasks.length);
  assert.equal(tasks.filter(task => task.optional).length, 0);
  assert.equal(tasks.filter(task => task.requires === "physlib").length, 0);

  const guides = fs.readFileSync(path.join(root, "docs/data/lesson-guide-bank.js"), "utf8");
  assert.doesNotMatch(guides, /第四、五单元|第四单元|第五单元/);
}

async function checkAIBehavior() {
  const task = {id:"test",title:"测试题",prompt:"证明一个结论",hint:"先检查目标。"};

  const local = loadAI({aiProvider:"none",aiTimeout:5000});
  const passed = await local.explain(task, "example : True := by trivial", {
    ok:true, diagnostics:[], warnings:[]
  });
  assert.match(passed.provider, /本地规则提示/);
  assert.match(passed.feedback, /Lean 已经接受当前代码/);
  assert.doesNotMatch(passed.feedback, /Lean 没有接受当前代码/);

  const failed = await local.explain(task, "example : False := by", {
    ok:false,
    diagnostics:[{message:"unsolved goals\n⊢ False"}],
    warnings:[]
  });
  assert.match(failed.feedback, /仍有目标没有关闭/);

  let receivedPrompt = "";
  const puter = loadAI({aiProvider:"puter",aiModel:"gpt-5-nano",aiTimeout:5000}, {
    window:{puter:{ai:{chat:async (prompt, options) => {
      receivedPrompt = prompt;
      assert.equal(options.model, "gpt-5-nano");
      return {message:{content:"这是实际模型返回的渐进提示。"}};
    }}}}
  });
  const generated = await puter.explain(task, "example : True := by trivial", {
    ok:true, diagnostics:[], warnings:[]
  });
  assert.equal(generated.provider, "Puter AI · gpt-5-nano");
  assert.equal(generated.feedback, "这是实际模型返回的渐进提示。");
  assert.match(receivedPrompt, /Lean 结果：通过/);

  let puterCalled = false;
  const endpoint = loadAI({
    aiEndpoint:"https://example.test/ai",
    aiProvider:"puter",
    aiModel:"gpt-5-nano",
    aiTimeout:5000
  }, {
    fetch:async () => ({
      ok:true,
      json:async () => ({provider:"自建代理",feedback:"代理优先。"})
    }),
    window:{puter:{ai:{chat:async () => { puterCalled = true; }}}}
  });
  const proxied = await endpoint.explain(task, "example : True := by trivial", {
    ok:true, diagnostics:[], warnings:[]
  });
  assert.equal(proxied.provider, "自建代理");
  assert.equal(puterCalled, false);
}

(async () => {
  compileJavaScript();
  checkContentContracts();
  await checkAIBehavior();
  console.log("Site JavaScript and AI fallback checks passed.");
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

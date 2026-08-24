/*
 * LeanPath Physics course configuration.
 *
 * Keep the presentation and progression data outside index.html so the course
 * theme can evolve without touching the quiz, XP, heart, or Lean-grading code.
 */
(function () {
  window.LEANPATH_COURSE = {
    version: 1,
    storageKey: "leanpath-progress-v2",
    dailyGoal: 20,
    theme: {
      brand: "LeanPath Physics",
      documentTitle: "LeanPath Physics — 物理学形式化互动学习",
      description: "像闯关一样学习 Lean 4 物理学形式化：从量纲、单位与运动学，到守恒律、振动和轨道模型。",
      eyebrow: "LEAN 4 · 物理学形式化路径",
      heroTitle: "把物理定律，写成可检查的证明。",
      heroSubtitle: "从量纲与运动学出发，逐步进入守恒律、振动、轨道与 Physlib。",
      powered: "物理模型可讨论，推导过程可检查",
      handbookTitle: "Lean 4 物理形式化手册",
      writingTitle: "Lean 4 物理写作实验室",
      tipTitle: "今日形式化物理小知识",
      tipText: "量纲可以进入类型：速度与时间相乘得到长度，而不是靠注释提醒。",
      tipCode: "Quantity speedDim → Quantity timeDim → Quantity lengthDim"
    },
    courseOrder: [
      "quantities", "dimensions", "units", "practice", "chest",
      "kinematics", "modeling", "conservation", "physlib"
    ],
    prerequisites: {
      quantities: null,
      dimensions: "quantities",
      units: "dimensions",
      practice: "units",
      chest: "practice",
      kinematics: "practice",
      modeling: "kinematics",
      conservation: "modeling",
      physlib: "conservation"
    },
    units: [
      {
        n: 1,
        t: "物理量、单位与量纲",
        d: "从数值走向带量纲的类型安全模型",
        lessons: [
          {id:"quantities", icon:"ℝ", title:"物理量与类型", sub:"数值 · 单位 · 语义"},
          {id:"dimensions", icon:"[L]", title:"基本量纲", sub:"质量 · 长度 · 时间"},
          {id:"units", icon:"m/s", title:"单位与换算", sub:"SI · km/h · 无量纲量"},
          {id:"practice", icon:"⌁", title:"量纲实验", sub:"随机组卷 · +20 XP"},
          {id:"chest", icon:"◆", title:"单元宝箱", sub:"+50 XP"}
        ]
      },
      {
        n: 2,
        t: "从运动学到守恒律",
        d: "把公式的条件、结论与代数推导写成定理",
        lessons: [
          {id:"kinematics", icon:"x(t)", title:"一维运动学", sub:"位置 · 速度 · 加速度"},
          {id:"modeling", icon:"⊢", title:"模型与假设", sub:"ℝ · 正性 · 适用条件"},
          {id:"conservation", icon:"E", title:"方程与守恒", sub:"ring · rw · positivity"},
          {id:"physlib", icon:"↗", title:"调用 Physlib", sub:"单位 · 振子 · 圆轨道"}
        ]
      },
      {
        n: 3,
        t: "能量与动力系统",
        d: "下一阶段：功—能定理、动量与状态演化",
        lessons: [
          {icon:"K", title:"动能与功", sub:"平方非负 · 功—能定理"},
          {icon:"p", title:"动量守恒", sub:"封闭系统 · 碰撞"},
          {icon:"U", title:"势能与力", sub:"梯度 · 保守力"},
          {icon:"↻", title:"状态与不变量", sub:"轨迹 · 守恒量"}
        ]
      },
      {
        n: 4,
        t: "振动、轨道与连续模型",
        d: "下一阶段：从代数恒等式过渡到分析与微分方程",
        lessons: [
          {icon:"∿", title:"简谐振子", sub:"ω² = k / m"},
          {icon:"○", title:"圆轨道", sub:"v² = GM / r"},
          {icon:"d/dt", title:"常微分方程", sub:"导数 · 初值"},
          {icon:"→", title:"连续与极限", sub:"Continuous · Tendsto"}
        ]
      },
      {
        n: 5,
        t: "团队专题分支",
        d: "按兴趣分工，并在共同的形式化接口上汇合",
        lessons: [
          {icon:"T", title:"热力学与统计物理", sub:"理想气体 · 两能级系统"},
          {icon:"E⃗", title:"电磁学", sub:"场 · 线性代数 · 微积分"},
          {icon:"ψ", title:"有限维量子力学", sub:"复向量 · 算符 · 测量"},
          {icon:"PR", title:"小组研究项目", sub:"模型 · 定理 · 可复现实验"}
        ]
      }
    ]
  };
}());

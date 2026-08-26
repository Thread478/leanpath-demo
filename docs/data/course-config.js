/* LeanPath Physics theme and five-part course route. */
(function () {
  window.LEANPATH_COURSE = {
    version: 7,
    storageKey: "leanpath-progress-v2",
    dailyGoal: 20,
    theme: {
      brand: "LeanPath Physics",
      documentTitle: "LeanPath Physics — 用 Lean 学习形式化物理",
      description: "提供可选的 Lean 4 零基础前置训练，并以可检查的模型学习单位与量纲、欧式静力学与动力学、黎曼流形和拉格朗日力学。",
      eyebrow: "面向 LEAN 用户 · 五单元物理学习路径",
      heroTitle: "让 Lean 成为学习物理的语言。",
      heroSubtitle: "从真实物理情境出发：单位与量纲 → 欧式静力学 → 欧式动力学 → 黎曼流形 → 拉格朗日力学",
      powered: "物理定义公开，数学推导可检查",
      handbookTitle: "Lean 4 物理形式化手册",
      writingTitle: "物理学形式化 · Lean 写作实验室",
      showcaseTitle: "形式化成果图鉴",
      tipTitle: "今日形式化物理小知识",
      tipText: "在 ℝⁿ 中，力矩是 r∧F 形成的反对称二阶张量；三维叉积是它的 Hodge 对偶。",
      tipCode: "Mᵢⱼ = rᵢFⱼ − rⱼFᵢ,  Mᵢⱼ = −Mⱼᵢ"
    },
    completionRewards: {
      chest: {xp:80, message:"第一部分完成：+80 XP，完整《单位与量纲》Lean 作品已收入成果图鉴。", repeat:"第一部分成果已经领取，可在成果图鉴中查看。"},
      "statics-chest": {xp:100, message:"第二部分完成：+100 XP，完整《欧式空间静力学》Lean 作品已收入成果图鉴。", repeat:"第二部分成果已经领取，可在成果图鉴中查看。"}
    },
    courseOrder: [
      "quantity", "si-base", "dimension-model", "dimension-ops",
      "derived-dimensions", "dimensionless", "unit-systems", "unit-conversion",
      "typed-quantity", "typed-ops", "homogeneity", "physlib-units",
      "practice", "chest",
      "euclidean-vectors", "inner-metric", "affine-points", "applied-force",
      "force-system", "moment", "moment-shift", "equilibrium",
      "equilibrium-iff", "support-reactions", "determinacy", "work",
      "potential", "virtual-work", "stability", "statics-physlib",
      "statics-practice", "statics-chest"
    ],
    prerequisites: {
      quantity: null,
      "si-base": "quantity",
      "dimension-model": "si-base",
      "dimension-ops": "dimension-model",
      "derived-dimensions": "dimension-ops",
      dimensionless: "derived-dimensions",
      "unit-systems": "dimensionless",
      "unit-conversion": "unit-systems",
      "typed-quantity": "unit-conversion",
      "typed-ops": "typed-quantity",
      homogeneity: "typed-ops",
      "physlib-units": "homogeneity",
      practice: "physlib-units",
      chest: "practice",
      "euclidean-vectors": "chest",
      "inner-metric": "euclidean-vectors",
      "affine-points": "inner-metric",
      "applied-force": "affine-points",
      "force-system": "applied-force",
      moment: "force-system",
      "moment-shift": "moment",
      equilibrium: "moment-shift",
      "equilibrium-iff": "equilibrium",
      "support-reactions": "equilibrium-iff",
      determinacy: "support-reactions",
      work: "determinacy",
      potential: "work",
      "virtual-work": "potential",
      stability: "virtual-work",
      "statics-physlib": "stability",
      "statics-practice": "statics-physlib",
      "statics-chest": "statics-practice"
    },
    units: [
      {
        n: 1,
        t: "单位与量纲",
        d: "从 SI 基本量到量纲代数，并连接原 PhysLean、现 Physlib 的单位接口",
        lessons: [
          {id:"quantity", icon:"Q", title:"物理量的三层结构", sub:"数值 · 单位 · 量纲"},
          {id:"si-base", icon:"SI", title:"七个 SI 基本量", sub:"s · m · kg · A · K · mol · cd"},
          {id:"dimension-model", icon:"ℤ⁷", title:"构造量纲向量", sub:"指数向量 · 反推物理参数"},
          {id:"dimension-ops", icon:"×÷", title:"量纲代数", sub:"乘 · 除 · 逆 · 整数幂"},
          {id:"derived-dimensions", icon:"N", title:"导出量纲", sub:"速度 · 力 · 能量 · 电压"},
          {id:"dimensionless", icon:"1", title:"无量纲量", sub:"比例 · 角度 · 相似准则"},
          {id:"unit-systems", icon:"U", title:"单位与单位制", sub:"量纲不变 · 表示可变"},
          {id:"unit-conversion", icon:"⇄", title:"单位换算", sub:"尺度因子 · SI 归一化"},
          {id:"typed-quantity", icon:"Q[d]", title:"量纲约束下的物理量", sub:"公式合法性 · 单位与语义边界"},
          {id:"typed-ops", icon:"⊗", title:"物理公式的类型安全运算", sub:"冲量 · 功 · 密度 · 动能"},
          {id:"homogeneity", icon:"=ₐ", title:"量纲齐次性", sub:"公式检查 · 条件与边界"},
          {id:"physlib-units", icon:"↗", title:"从 PhysLean 连接现行 Physlib", sub:"历史来源 · 当前接口 · 精确换算"},
          {id:"practice", icon:"⌁", title:"单位与量纲综合实验", sub:"分层随机组卷 · +30 XP"},
          {id:"chest", icon:"◆", title:"第一部分通关成果", sub:"解锁完整 Lean 展品 · +80 XP"}
        ]
      },
      {
        n: 2,
        t: "欧式空间中的静力学",
        d: "有限维欧式空间中的向量、反对称张量力矩、刚体平衡、虚功与能量稳定性",
        lessons: [
          {id:"euclidean-vectors", icon:"ℝⁿ", title:"欧式空间与坐标向量", sub:"一般有限维 · 三维专门化"},
          {id:"inner-metric", icon:"⟪·,·⟫", title:"内积、范数与距离", sub:"功 · 距离 · 动能"},
          {id:"affine-points", icon:"P→Q", title:"点、位移与参考原点", sub:"仿射点 · 位置向量 · ReferenceFrame"},
          {id:"applied-force", icon:"F@P", title:"力与作用点", sub:"滑移向量 · 作用线 · AppliedForce"},
          {id:"force-system", icon:"ΣF", title:"力系与合力", sub:"多力叠加 · 力偶 · 等效"},
          {id:"moment", icon:"r∧F", title:"一般维力矩与三维叉积", sub:"反对称张量 · Hodge 对偶"},
          {id:"moment-shift", icon:"M↦", title:"一般维移矩与力偶", sub:"换参考点 · 三维专门化"},
          {id:"equilibrium", icon:"0⃗", title:"静力平衡", sub:"平动平衡 ∧ 转动平衡"},
          {id:"equilibrium-iff", icon:"⇔", title:"平衡充要条件", sub:"任意刚体虚速度功率为零"},
          {id:"support-reactions", icon:"△", title:"约束与支反力", sub:"简支梁 · 平衡方程 · 反力"},
          {id:"determinacy", icon:"ker", title:"静定与超静定", sub:"平衡算子 · 核 · 自应力"},
          {id:"work", icon:"W", title:"功的形式化", sub:"F · Δr · 可加性"},
          {id:"potential", icon:"V", title:"势能与保守力", sub:"F = −∇V · 二次势能"},
          {id:"virtual-work", icon:"δW", title:"虚功原理", sub:"有限维刚体 · 线性约束"},
          {id:"stability", icon:"min", title:"势能极值与稳定性", sub:"正刚度 · 中性 · 不稳定"},
          {id:"statics-physlib", icon:"↗", title:"区分课程模型与上游库", sub:"Mathlib · PhysLean → Physlib"},
          {id:"statics-practice", icon:"⌁", title:"欧式静力学综合实验", sub:"分层随机组卷 · +35 XP"},
          {id:"statics-chest", icon:"◆", title:"第二部分通关成果", sub:"解锁完整 Lean 展品 · +100 XP"}
        ]
      },
      {
        n: 3,
        t: "欧式空间中的动力学",
        d: "后续部分：轨迹、导数、牛顿方程与守恒律",
        lessons: [
          {icon:"x(t)", title:"轨迹与运动学", sub:"速度 · 加速度 · 正则性"},
          {icon:"ma", title:"牛顿第二定律", sub:"质量 · 力 · 二阶方程"},
          {icon:"p", title:"动量与冲量", sub:"系统边界 · 守恒"},
          {icon:"E", title:"功与能量", sub:"功率 · 势能 · 功能定理"},
          {icon:"↻", title:"振动与轨道", sub:"振子 · 中心力"},
          {icon:"ODE", title:"初值问题", sub:"存在唯一性 · 数值比较"}
        ]
      },
      {
        n: 4,
        t: "黎曼流形的构造",
        d: "后续部分：从局部坐标到度量、联络和测地线",
        lessons: [
          {icon:"M", title:"光滑流形", sub:"图册 · 坐标变换"},
          {icon:"Tₚ", title:"切空间与向量场", sub:"导子 · 切丛"},
          {icon:"g", title:"黎曼度量", sub:"正定对称双线性型"},
          {icon:"∇", title:"Levi-Civita 联络", sub:"无挠 · 度量相容"},
          {icon:"γ", title:"测地线", sub:"能量泛函 · 局部最短"},
          {icon:"R", title:"曲率", sub:"截面曲率 · 特殊情形"}
        ]
      },
      {
        n: 5,
        t: "拉格朗日力学",
        d: "后续部分：构型空间、作用量、变分与对称性",
        lessons: [
          {icon:"Q", title:"构型空间", sub:"约束系统 · 切丛状态"},
          {icon:"L", title:"拉格朗日量", sub:"动能 − 势能"},
          {icon:"S", title:"作用量与变分", sub:"固定端点变分"},
          {icon:"EL", title:"Euler–Lagrange 方程", sub:"局部坐标 · 内禀形式"},
          {icon:"N", title:"Noether 定理", sub:"连续对称 · 守恒量"},
          {icon:"λ", title:"约束与乘子", sub:"完整约束 · 退化情形"}
        ]
      }
    ]
  };
}());

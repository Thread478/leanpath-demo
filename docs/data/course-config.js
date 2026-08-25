/* LeanPath Physics theme and five-part course route. */
(function () {
  window.LEANPATH_COURSE = {
    version: 2,
    storageKey: "leanpath-progress-v2",
    dailyGoal: 20,
    theme: {
      brand: "LeanPath Physics",
      documentTitle: "LeanPath Physics — 从单位与量纲开始形式化物理",
      description: "以 Lean 4 学习物理学形式化：单位与量纲、欧式空间静力学与动力学、黎曼流形和拉格朗日力学。",
      eyebrow: "LEAN 4 · 五部分物理学形式化路径",
      heroTitle: "从量纲开始，逐层构造可检查的物理学。",
      heroSubtitle: "单位与量纲 → 欧式静力学 → 欧式动力学 → 黎曼流形 → 拉格朗日力学",
      powered: "物理定义公开，数学推导可检查",
      handbookTitle: "Lean 4 物理形式化手册",
      writingTitle: "单位与量纲 · Lean 写作实验室",
      showcaseTitle: "形式化成果图鉴",
      tipTitle: "今日形式化物理小知识",
      tipText: "量纲乘法就是指数向量相加；同量纲加法则由 Quantity d 的类型保证。",
      tipCode: "[F] = [M] · [L] · [T]⁻²"
    },
    courseOrder: [
      "quantity", "si-base", "dimension-model", "dimension-ops",
      "derived-dimensions", "dimensionless", "unit-systems", "unit-conversion",
      "typed-quantity", "typed-ops", "homogeneity", "physlib-units",
      "practice", "chest"
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
      chest: "practice"
    },
    units: [
      {
        n: 1,
        t: "单位与量纲",
        d: "从 SI 基本量到量纲代数、类型安全运算与 Physlib",
        lessons: [
          {id:"quantity", icon:"Q", title:"物理量的三层结构", sub:"数值 · 单位 · 量纲"},
          {id:"si-base", icon:"SI", title:"七个 SI 基本量", sub:"s · m · kg · A · K · mol · cd"},
          {id:"dimension-model", icon:"ℤ⁷", title:"构造量纲向量", sub:"BaseDimension → ℤ"},
          {id:"dimension-ops", icon:"×÷", title:"量纲代数", sub:"乘 · 除 · 逆 · 整数幂"},
          {id:"derived-dimensions", icon:"N", title:"导出量纲", sub:"速度 · 力 · 能量 · 电压"},
          {id:"dimensionless", icon:"1", title:"无量纲量", sub:"比例 · 角度 · 相似准则"},
          {id:"unit-systems", icon:"U", title:"单位与单位制", sub:"量纲不变 · 表示可变"},
          {id:"unit-conversion", icon:"⇄", title:"单位换算", sub:"尺度因子 · SI 归一化"},
          {id:"typed-quantity", icon:"Q[d]", title:"依赖类型物理量", sub:"Quantity d · 类型索引"},
          {id:"typed-ops", icon:"⊗", title:"类型安全运算", sub:"同量纲加法 · 乘除合成"},
          {id:"homogeneity", icon:"=ₐ", title:"量纲齐次性", sub:"公式检查 · 条件与边界"},
          {id:"physlib-units", icon:"↗", title:"调用 Physlib", sub:"Dimension · WithDim · SI"},
          {id:"practice", icon:"⌁", title:"单位与量纲综合实验", sub:"分层随机组卷 · +30 XP"},
          {id:"chest", icon:"◆", title:"第一部分通关成果", sub:"解锁完整 Lean 展品 · +80 XP"}
        ]
      },
      {
        n: 2,
        t: "欧式空间中的静力学",
        d: "后续部分：向量、力系、力矩、平衡与刚体",
        lessons: [
          {icon:"ℝⁿ", title:"欧式空间与内积", sub:"向量 · 范数 · 正交分解"},
          {icon:"F⃗", title:"力与力系", sub:"自由向量 · 作用点"},
          {icon:"τ", title:"力矩与叉积", sub:"参考点 · 反对称性"},
          {icon:"Σ", title:"质点系平衡", sub:"合力为零 · 必要充分条件"},
          {icon:"▱", title:"刚体静力学", sub:"合力与合力矩"},
          {icon:"⊥", title:"约束与支反力", sub:"接触 · 摩擦 · 分类讨论"}
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

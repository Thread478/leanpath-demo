/*
 * LeanPath Physics writing bank.
 * Learners edit only {{ANSWER}}; complete sources are checked by Lean.
 */
(function () {
  window.LEANPATH_WRITING_BANK = {
    version: 2,
    tasks: [
      {
        id:"phys-write-position", level:1, section:"物理量与函数", title:"写出匀速位置",
        prompt:"补全一维匀速模型：初始位置 x₀、速度 v、时间 t 均为实数，返回 x₀ + vt。",
        concept:"phys-real", xp:6, starter:"", placeholder:"写出一个 ℝ 表达式",
        hint:"函数体可以直接使用 x₀、v、t；Lean 中乘法写作 *。",
        template:"import Mathlib\n\ndef position (x₀ v t : ℝ) : ℝ :=\n  {{ANSWER}}\n\nexample (x₀ v t : ℝ) : position x₀ v t = x₀ + v * t := by\n  rfl\n"
      },
      {
        id:"phys-write-trajectory", level:1, section:"物理量与函数", title:"时间到位置的轨迹",
        prompt:"补全 trajectory，使它返回一个以时间 t 为输入的一维匀速轨迹函数。",
        concept:"phys-function", xp:6, starter:"", placeholder:"使用 fun t => ...",
        hint:"目标类型是 ℝ → ℝ，因此先用 fun 引入时间参数。",
        template:"import Mathlib\n\ndef trajectory (x₀ v : ℝ) : ℝ → ℝ :=\n  {{ANSWER}}\n\nexample (x₀ v t : ℝ) : trajectory x₀ v t = x₀ + v * t := by\n  rfl\n"
      },
      {
        id:"phys-write-speed-dimension", level:1, section:"量纲建模", title:"定义速度量纲",
        prompt:"用模式匹配补全 speedDimension：质量指数 0、长度指数 1、时间指数 −1。",
        concept:"phys-dimension", xp:8, starter:"fun\n  ", placeholder:"为三个基本量纲分别返回指数",
        hint:"依次匹配 .mass、.length、.time；负一可写作 -1。",
        template:"import Mathlib\n\ninductive BaseDimension where\n  | mass | length | time\n\nabbrev Dimension := BaseDimension → Int\n\ndef speedDimension : Dimension :=\n  {{ANSWER}}\n\nexample : speedDimension .mass = 0 := by rfl\nexample : speedDimension .length = 1 := by rfl\nexample : speedDimension .time = -1 := by rfl\n"
      },
      {
        id:"phys-write-safe-add", level:1, section:"量纲建模", title:"类型安全的物理量加法",
        prompt:"补全 add：两个输入共享量纲 d，结果也必须保持同一量纲，并把数值相加。",
        concept:"phys-typed-quantity", xp:8, starter:"", placeholder:"构造一个 Quantity d",
        hint:"使用结构字面量 { value := ... }，字段值来自 x.value 与 y.value。",
        template:"import Mathlib\n\ninductive BaseDimension where\n  | mass | length | time\n\nabbrev Dimension := BaseDimension → Int\n\nstructure Quantity (d : Dimension) where\n  value : ℝ\n\ndef Quantity.add {d : Dimension} (x y : Quantity d) : Quantity d :=\n  {{ANSWER}}\n\nexample {d : Dimension} (x y : Quantity d) :\n    (Quantity.add x y).value = x.value + y.value := by\n  rfl\n"
      },
      {
        id:"phys-write-unit-conversion", level:1, section:"单位与换算", title:"36 km/h 换算为 m/s",
        prompt:"证明 36 × 1000 ÷ 3600 = 10。这里把 km→m 与 h→s 的比例全部写在实数等式中。",
        concept:"phys-unit", xp:8, starter:"by\n  ", placeholder:"使用数值归一化策略",
        hint:"norm_num 可以证明闭合的有理数等式。",
        template:"import Mathlib\n\ntheorem thirtySix_kmh_in_mps :\n    (36 : ℝ) * 1000 / 3600 = 10 :=\n  {{ANSWER}}\n"
      },
      {
        id:"phys-write-initial-position", level:2, section:"运动学", title:"检查初始位置",
        prompt:"证明在 t = 0 时，匀速位置模型返回初始位置 x₀。",
        concept:"phys-ring", xp:8, starter:"by\n  ", placeholder:"展开 position 并化简",
        hint:"simp [position] 会同时展开定义并处理乘零、加零。",
        template:"import Mathlib\n\ndef position (x₀ v t : ℝ) : ℝ := x₀ + v * t\n\ntheorem position_at_zero (x₀ v : ℝ) : position x₀ v 0 = x₀ :=\n  {{ANSWER}}\n"
      },
      {
        id:"phys-write-zero-acceleration", level:2, section:"运动学", title:"零加速度退化为匀速",
        prompt:"定义 velocity v₀ a t = v₀ + at，并证明 a = 0 时速度保持为 v₀。",
        concept:"phys-ring", xp:8, starter:"by\n  ", placeholder:"展开定义并化简",
        hint:"目标不需要复杂代数；simp [velocity] 足以化简零乘法。",
        template:"import Mathlib\n\ndef velocity (v₀ a t : ℝ) : ℝ := v₀ + a * t\n\ntheorem velocity_zero_acceleration (v₀ t : ℝ) :\n    velocity v₀ 0 t = v₀ :=\n  {{ANSWER}}\n"
      },
      {
        id:"phys-write-torricelli", level:2, section:"运动学", title:"验证无时间速度公式",
        prompt:"在匀加速定义下验证 v² = v₀² + 2as。此题验证公式的代数核心，不额外声称模型适用于所有运动。",
        concept:"phys-ring", xp:10, starter:"by\n  dsimp\n  ", placeholder:"规范化多项式等式",
        hint:"展开 let 后，目标是 ℝ 上的多项式恒等式，可使用 ring。",
        template:"import Mathlib\n\ntheorem torricelli_identity (v₀ a t : ℝ) :\n    let v := v₀ + a * t\n    let s := v₀ * t + a * t^2 / 2\n    v^2 = v₀^2 + 2 * a * s :=\n  {{ANSWER}}\n"
      },
      {
        id:"phys-write-kinetic-nonnegative", level:2, section:"能量与正性", title:"动能非负",
        prompt:"若质量 m 非负，证明 K = 1/2 mv² 非负。",
        concept:"phys-positivity", xp:10, starter:"by\n  ", placeholder:"组合质量和平方的非负性",
        hint:"上下文已有 hm，速度平方自动非负；positivity 可以组合这些事实。",
        template:"import Mathlib\n\nnoncomputable def kineticEnergy (m v : ℝ) : ℝ := (1 / 2) * m * v^2\n\ntheorem kineticEnergy_nonnegative (m v : ℝ) (hm : 0 ≤ m) :\n    0 ≤ kineticEnergy m v :=\n  {{ANSWER}}\n"
      },
      {
        id:"phys-write-momentum-impulse", level:2, section:"动量守恒", title:"内部冲量抵消",
        prompt:"两个非零质量物体分别获得 +J 与 −J 的速度改变量，证明总动量不变。",
        concept:"phys-conservation", xp:12, starter:"by\n  ", placeholder:"消去非零分母，再整理环等式",
        hint:"先用 field_simp [hm₁, hm₂] 处理除法，再用 ring 整理。",
        template:"import Mathlib\n\ntheorem totalMomentum_after_internal_impulse\n    (m₁ m₂ v₁ v₂ J : ℝ) (hm₁ : m₁ ≠ 0) (hm₂ : m₂ ≠ 0) :\n    m₁ * (v₁ + J / m₁) + m₂ * (v₂ - J / m₂) =\n      m₁ * v₁ + m₂ * v₂ :=\n  {{ANSWER}}\n"
      },
      {
        id:"phys-write-physlib-speed", level:3, section:"Physlib 单位", title:"引用 km/h 的 SI 定理",
        prompt:"引用 Physlib 已有结果，证明 1 km/h 在 SI 中表示为 5/18 m/s。",
        concept:"phys-physlib", xp:12, starter:"by\n  ", placeholder:"引用完整限定名",
        hint:"目标与 DimSpeed.oneKilometerPerHour_in_SI 完全对应，可先尝试 exact。",
        template:"import Physlib.Units.WithDim.Speed\n\nopen LTMCTUnitChoices\n\nexample : DimSpeed.oneKilometerPerHour SI = ⟨5 / 18⟩ :=\n  {{ANSWER}}\n"
      },
      {
        id:"phys-write-oscillator", level:3, section:"Physlib 经典力学", title:"调用简谐振子频率定理",
        prompt:"对 Physlib 中任意简谐振子 S，引用现有定理证明 ω² = k/m。",
        concept:"phys-namespace", xp:12, starter:"by\n  ", placeholder:"从 S 调用 ω_sq",
        hint:"打开 ClassicalMechanics 后，可把命名空间定理按点记法写成 S.ω_sq。",
        template:"import Physlib.ClassicalMechanics.HarmonicOscillator.Basic\n\nopen ClassicalMechanics\n\nexample (S : HarmonicOscillator) : S.ω^2 = S.k / S.m :=\n  {{ANSWER}}\n"
      },
      {
        id:"phys-write-circular-orbit", level:3, section:"Physlib 经典力学", title:"调用圆轨道速度定理",
        prompt:"在 G、中心质量 M 与半径 r 均为正时，引用 Physlib 定理证明圆轨道速度平方关系。",
        concept:"phys-assumption", xp:14, starter:"by\n  ", placeholder:"向 speedCircular_sq 依次提供系统、配置和正性证明",
        hint:"完整定理位于 ClassicalMechanics.VisViva 命名空间，参数顺序是 sys、cfg、hr、hG、hM。",
        template:"import Physlib.ClassicalMechanics.OrbitalMechanics.VisViva\n\nopen ClassicalMechanics\n\nexample (sys : VisViva) (cfg : VisViva.ConfigurationSpace)\n    (hr : 0 < cfg.r) (hG : 0 < sys.G) (hM : 0 < sys.M) :\n    (VisViva.speedCircular sys cfg)^2 = sys.G * sys.M / cfg.r :=\n  {{ANSWER}}\n"
      }
    ]
  };
}());

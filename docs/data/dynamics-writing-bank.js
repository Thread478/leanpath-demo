/* LeanPath Physics · Unit III Euclidean dynamics writing laboratory. */
(function () {
  const bank = window.LEANPATH_WRITING_BANK || {version:0, tasks:[]};
  const vecPrelude = "import Mathlib\n\nabbrev VecN (n : ℕ) := Fin n → ℝ\n";

  bank.version = Math.max(bank.version || 0, 7);
  bank.tasks.push(
    {
      id:"dynamics-write-trajectory",part:3,unlock:"trajectory-kinematics",level:1,
      section:"运动学",title:"验证恒加速度轨迹的初始位置",
      prompt:"补全证明：恒加速度轨迹 r(t)=r₀+v₀t+½at² 在 t=0 时回到 r₀。",
      concept:"dyn-trajectory",xp:10,starter:"by\n  ",placeholder:"展开 trajectory 并化简",
      hint:"使用 simp [trajectory]。",
      template:"import Mathlib\n\ndef trajectory (r₀ v₀ a t : ℝ) : ℝ :=\n  r₀ + v₀ * t + (1 / 2 : ℝ) * a * t^2\n\ntheorem trajectory_at_zero (r₀ v₀ a : ℝ) :\n    trajectory r₀ v₀ a 0 = r₀ :=\n  {{ANSWER}}\n"
    },
    {
      id:"dynamics-write-newton",part:3,unlock:"newton-laws",level:1,
      section:"牛顿定律",title:"把牛顿方程写成零残差",
      prompt:"若 h 已给出 F=m a，证明动力学残差 F−m a 为零。",
      concept:"dyn-newton",xp:11,starter:"by\n  ",placeholder:"把减法为零改写为等式",
      hint:"sub_eq_zero.mpr h 正好把 F = m*a 转成 F-m*a=0。",
      template:"import Mathlib\n\ndef newtonResidual (F m a : ℝ) : ℝ := F - m * a\n\ntheorem newton_residual_zero (F m a : ℝ) (h : F = m * a) :\n    newtonResidual F m a = 0 :=\n  {{ANSWER}}\n"
    },
    {
      id:"dynamics-write-impulse",part:3,unlock:"momentum-dynamics",level:2,
      section:"动量定理",title:"从恒力速度公式推出冲量定理",
      prompt:"在 m≠0 下，由 v₁=v₀+(F/m)Δt 推出 m v₁−m v₀=FΔt。",
      concept:"dyn-momentum",xp:14,starter:"by\n  rw [hv]\n  ",placeholder:"消去分母并整理环表达式",
      hint:"field_simp [hm] 后，ring 可完成整理。",
      template:"import Mathlib\n\ntheorem constant_force_impulse (m F v₀ v₁ Δt : ℝ)\n    (hm : m ≠ 0) (hv : v₁ = v₀ + (F / m) * Δt) :\n    m * v₁ - m * v₀ = F * Δt :=\n  {{ANSWER}}\n"
    },
    {
      id:"dynamics-write-angular",part:3,unlock:"angular-momentum",level:2,
      section:"角动量",title:"证明角动量张量反对称",
      prompt:"一般 ℝⁿ 中令 L=r∧p；逐分量证明 Lᵢⱼ=−Lⱼᵢ。",
      concept:"dyn-angular",xp:14,starter:"by\n  ",placeholder:"展开 wedge 后用 ring",
      hint:"simp [wedge] 展开定义，ring 处理交换律。",
      template:vecPrelude + "\nabbrev TwoForm (n : ℕ) := Matrix (Fin n) (Fin n) ℝ\n\ndef wedge {n : ℕ} (r p : VecN n) : TwoForm n :=\n  fun i j => r i * p j - r j * p i\n\ntheorem angularMomentum_skew {n : ℕ} (r p : VecN n) (i j : Fin n) :\n    wedge r p i j = -wedge r p j i :=\n  {{ANSWER}}\n"
    },
    {
      id:"dynamics-write-work-energy",part:3,unlock:"energy-dynamics",level:2,
      section:"动能定理",title:"验证恒加速度下的功—能关系",
      prompt:"由 v₁²=v₀²+2as，证明动能增量等于恒合力 ma 所做的功。",
      concept:"dyn-energy",xp:14,starter:"by\n  rw [hv]\n  ",placeholder:"整理实数多项式",
      hint:"代入 hv 后使用 ring。",
      template:"import Mathlib\n\ntheorem constant_acceleration_work_energy (m v₀ v₁ a s : ℝ)\n    (hv : v₁^2 = v₀^2 + 2 * a * s) :\n    (1 / 2 : ℝ) * m * v₁^2 - (1 / 2 : ℝ) * m * v₀^2 = m * a * s :=\n  {{ANSWER}}\n"
    },
    {
      id:"dynamics-write-mass-stiffness",part:3,unlock:"mass-stiffness",level:2,
      section:"线性振动",title:"定义质量—刚度动力学残差",
      prompt:"补全一自由度线性振子的残差，使方程 residual=0 恰为 m q¨+kq=0。",
      concept:"dyn-matrices",xp:12,starter:"",placeholder:"写出质量项与刚度项之和",
      hint:"直接返回 m * qdd + k * q。",
      template:"import Mathlib\n\ndef oscillatorResidual (m k q qdd : ℝ) : ℝ :=\n  {{ANSWER}}\n\nexample (m k q qdd : ℝ) :\n    oscillatorResidual m k q qdd = 0 ↔ m * qdd + k * q = 0 := by\n  rfl\n"
    },
    {
      id:"dynamics-write-mode",part:3,unlock:"modal-eigen",level:3,
      section:"广义特征值",title:"验证二自由度的同相模态",
      prompt:"对 K=[[2k,−k],[−k,2k]]、M=mI，证明 φ=(1,1) 满足 Kφ=kφ；这对应 ω²=k/m。",
      concept:"dyn-modal",xp:16,starter:"by\n  constructor <;>\n    ",placeholder:"分别化简两个分量",
      hint:"两个目标都是实数环恒等式，ring 即可。",
      template:"import Mathlib\n\ntheorem two_mass_in_phase_mode (k : ℝ) :\n    (2 * k * 1 - k * 1 = k * 1) ∧\n    (-k * 1 + 2 * k * 1 = k * 1) :=\n  {{ANSWER}}\n"
    },
    {
      id:"dynamics-write-inertia",part:3,unlock:"inertia-tensor",level:2,
      section:"惯性张量",title:"计算哑铃的主惯量",
      prompt:"两个质量均为 m 的质点位于 x 轴 ±a。证明绕 y 轴的总惯量为 2ma²。",
      concept:"dyn-inertia",xp:13,starter:"by\n  ",placeholder:"展开并整理两个相同贡献",
      hint:"ring。",
      template:"import Mathlib\n\ndef dumbbellIy (m a : ℝ) : ℝ := m * a^2 + m * (-a)^2\n\ntheorem dumbbell_Iy (m a : ℝ) : dumbbellIy m a = 2 * m * a^2 :=\n  {{ANSWER}}\n"
    },
    {
      id:"dynamics-write-euler",part:3,unlock:"euler-equations",level:2,
      section:"刚体动力学",title:"验证绕主轴的自由转动",
      prompt:"补全证明：无外力矩、ω₂=ω₃=0 且三个角加速度为零时，三条欧拉方程残差全部为零。",
      concept:"dyn-euler",xp:15,starter:"by\n  ",placeholder:"逐项展开并化简",
      hint:"simp [eulerResidual]。",
      template:"import Mathlib\n\ndef eulerResidual (I₁ I₂ I₃ ω₁ ω₂ ω₃ α₁ α₂ α₃ : ℝ) : ℝ × ℝ × ℝ :=\n  (I₁ * α₁ + (I₃ - I₂) * ω₂ * ω₃,\n   I₂ * α₂ + (I₁ - I₃) * ω₃ * ω₁,\n   I₃ * α₃ + (I₂ - I₁) * ω₁ * ω₂)\n\ntheorem principal_axis_free_rotation (I₁ I₂ I₃ ω : ℝ) :\n    eulerResidual I₁ I₂ I₃ ω 0 0 0 0 0 = (0, 0, 0) :=\n  {{ANSWER}}\n"
    },
    {
      id:"dynamics-write-dalembert",part:3,unlock:"dalembert",level:3,
      section:"达朗贝尔原理",title:"由所有虚位移测试恢复牛顿方程",
      prompt:"一维无约束情形中，若 (F−ma)δ=0 对所有 δ 成立，证明 F=ma。",
      concept:"dyn-dalembert",xp:17,starter:"by\n  apply sub_eq_zero.mp\n  ",placeholder:"选择虚位移 δ=1",
      hint:"h 1 给出所需残差为零；simpa using h 1。",
      template:"import Mathlib\n\ntheorem dalembert_implies_newton (F m a : ℝ)\n    (h : ∀ δ : ℝ, (F - m * a) * δ = 0) : F = m * a :=\n  {{ANSWER}}\n"
    },
    {
      id:"dynamics-write-lagrange",part:3,unlock:"lagrange-equations",level:2,
      section:"拉格朗日方程",title:"定义欧拉—拉格朗日残差",
      prompt:"用已计算出的 d/dt(∂L/∂q̇)、∂L/∂q 和非保守广义力 Q 构造残差。",
      concept:"dyn-lagrange",xp:13,starter:"",placeholder:"左端两项相减，再减去 Q",
      hint:"残差写成 dpdt - dLdq - Q；等于零即标准方程。",
      template:"import Mathlib\n\ndef eulerLagrangeResidual (dpdt dLdq Q : ℝ) : ℝ :=\n  {{ANSWER}}\n\nexample (dpdt dLdq Q : ℝ) :\n    eulerLagrangeResidual dpdt dLdq Q = 0 ↔ dpdt - dLdq = Q := by\n  simp [eulerLagrangeResidual, sub_eq_zero]\n"
    },
    {
      id:"dynamics-write-central",part:3,unlock:"central-force",level:3,
      section:"中心力",title:"证明一般维中心力矩为零",
      prompt:"令 F=c r。用一般维楔积证明 r∧F 的每个分量都为零。",
      concept:"dyn-central",xp:17,starter:"by\n  ",placeholder:"展开 wedge 并整理乘法",
      hint:"simp [wedge] 后 ring。",
      template:vecPrelude + "\nabbrev TwoForm (n : ℕ) := Matrix (Fin n) (Fin n) ℝ\n\ndef wedge {n : ℕ} (r F : VecN n) : TwoForm n :=\n  fun i j => r i * F j - r j * F i\n\ntheorem central_force_zero_torque {n : ℕ} (c : ℝ) (r : VecN n) (i j : Fin n) :\n    wedge r (c • r) i j = 0 :=\n  {{ANSWER}}\n"
    },
    {
      id:"dynamics-write-kepler",part:3,unlock:"kepler-orbits",level:3,
      section:"开普勒轨道",title:"由偏心率判定束缚轨道能量",
      prompt:"若正参数 β 把能量写成 E=(e²−1)/β，证明 e²<1 时 E<0。",
      concept:"dyn-kepler",xp:18,starter:"by\n  rw [hE]\n  ",placeholder:"先证分子为负，再用正分母",
      hint:"exact div_neg_of_neg_of_pos (sub_neg.mpr he) hβ。",
      template:"import Mathlib\n\ntheorem ellipse_has_negative_energy (E e β : ℝ)\n    (hβ : 0 < β) (he : e^2 < 1) (hE : E = (e^2 - 1) / β) :\n    E < 0 :=\n  {{ANSWER}}\n"
    },
    {
      id:"dynamics-write-audit",part:3,unlock:"dynamics-practice",level:3,
      section:"综合审计",title:"给轨道定理写出适用域",
      prompt:"补全 OrbitAssumptions：开普勒圆锥结论至少显式记录正质量、正引力参数、非零角动量和非碰撞条件。",
      concept:"dyn-kepler",xp:18,starter:"",placeholder:"用四个命题的合取",
      hint:"Lean 中合取写作 ∧；按字段顺序组合四个条件。",
      template:"import Mathlib\n\nstructure OrbitData where\n  mass : ℝ\n  mu : ℝ\n  angularMomentum : ℝ\n  radius : ℝ → ℝ\n\ndef OrbitAssumptions (o : OrbitData) : Prop :=\n  {{ANSWER}}\n\nexample (o : OrbitData) (h : OrbitAssumptions o) : o.mass > 0 := h.1\n"
    }
  );

  window.LEANPATH_WRITING_BANK = bank;
}());

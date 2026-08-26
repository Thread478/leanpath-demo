/* LeanPath Physics · Unit III theorem exhibits. */
(function () {
  const showcase = window.LEANPATH_SHOWCASE || {version:0, entries:[]};
  const lean = String.raw;
  showcase.version = Math.max(showcase.version || 0, 9);

  showcase.entries.push(
    {
      id:"showcase-dynamics-trajectories",unlock:"trajectory-kinematics",part:3,
      title:"轨迹不是公式：速度与加速度是真导数",
      summary:"恒加速度向量轨迹在每个坐标上接受 Lean 的微分检查，并进一步组成 SolvesNewtonCurve：位置导数是速度、速度导数是加速度、力满足 F=ma。",
      origin:"LeanPath 动力学主代码摘编 · Mathlib Fréchet/标量导数",
      filename:"NewtonCurve.lean",
      milestones:["定义向量值位置与速度曲线","逐坐标证明 v′=a","逐坐标证明 r′=v","把两级导数与牛顿方程封装为全局解"],
      code:lean`import Mathlib

abbrev VecN (n : ℕ) := Fin n → ℝ
def velocityVec {n : ℕ} (v₀ a : VecN n) (t : ℝ) : VecN n := v₀ + t • a

theorem velocityVec_hasDerivAt {n : ℕ} (v₀ a : VecN n) (t : ℝ) :
    HasDerivAt (velocityVec v₀ a) a t := by
  apply hasDerivAt_pi.mpr
  intro i
  change HasDerivAt (fun s : ℝ => v₀ i + s * a i) (a i) t
  have h := ((hasDerivAt_id t).mul_const (a i)).const_add (v₀ i)
  have hd : 1 * a i = a i := by ring
  rw [hd] at h
  exact h
`
    },
    {
      id:"showcase-dynamics-momentum",unlock:"momentum-dynamics",part:3,
      title:"微分动量定理与碰撞守恒",
      summary:"由 v′=a 严格推出 p′=ma，再用 F=ma 得到 p′=F；另一条离散链处理恒力冲量、作用—反作用与完全非弹性碰撞速度的唯一性。",
      origin:"LeanPath 动力学主代码摘编 · 连续与离散动量模型",
      filename:"MomentumTheorem.lean",
      milestones:["常质量数乘与导数交换","牛顿方程把 ma 改写为外力 F","内冲量成对抵消保持总动量","非弹性碰撞共同速度由守恒方程唯一确定"],
      code:lean`import Mathlib

abbrev VecN (n : ℕ) := Fin n → ℝ
def momentum {n : ℕ} (m : ℝ) (v : VecN n) : VecN n := m • v

theorem momentum_hasDerivAt {n : ℕ} (m : ℝ)
    {v : ℝ → VecN n} {a : VecN n} {t : ℝ} (hv : HasDerivAt v a t) :
    HasDerivAt (fun s => momentum m (v s)) (momentum m a) t := by
  apply hasDerivAt_pi.mpr
  intro i
  change HasDerivAt (fun s : ℝ => m * v s i) (m * a i) t
  simpa using (hasDerivAt_pi.mp hv i).const_mul m
`
    },
    {
      id:"showcase-dynamics-angular",unlock:"angular-momentum",part:3,
      title:"一般维角动量—力矩定理",
      summary:"角动量取反对称张量 L=r∧p。对楔积逐分量应用乘法法则，利用 v∧mv=0 后得到 L̇=r∧F；中心力进一步给出零导数和任意两时刻的全局守恒。",
      origin:"LeanPath 动力学主代码摘编 · 一般 ℝⁿ 二形式",
      filename:"AngularMomentumDerivative.lean",
      milestones:["证明楔积的 HasDerivAt 乘法法则","从 p′=F 推出 L̇=v∧p+r∧F","平行性消去 v∧mv","均值定理把逐点零导数提升为全局守恒"],
      code:lean`import Mathlib

abbrev VecN (n : ℕ) := Fin n → ℝ
abbrev TwoForm (n : ℕ) := Matrix (Fin n) (Fin n) ℝ
def wedge {n : ℕ} (r p : VecN n) : TwoForm n :=
  fun i j => r i * p j - r j * p i

theorem wedge_hasDerivAt {n : ℕ}
    {r p : ℝ → VecN n} {v f : VecN n} {t : ℝ}
    (hr : HasDerivAt r v t) (hp : HasDerivAt p f t) :
    HasDerivAt (fun s => wedge (r s) (p s))
      (wedge v (p t) + wedge (r t) f) t := by
  apply hasDerivAt_pi.mpr
  intro i
  apply hasDerivAt_pi.mpr
  intro j
  have hri := (hasDerivAt_pi.mp hr) i
  have hrj := (hasDerivAt_pi.mp hr) j
  have hpi := (hasDerivAt_pi.mp hp) i
  have hpj := (hasDerivAt_pi.mp hp) j
  convert (hri.mul hpj).sub (hrj.mul hpi) using 1
  · funext s
    rfl
  · simp [wedge]
    ring
`
    },
    {
      id:"showcase-dynamics-work-energy",unlock:"energy-dynamics",part:3,
      title:"瞬时功率—动能定理",
      summary:"对 T=½m(v·v) 真正求导得到 Ṫ=m(v·a)，再由 F=ma 改写为 F·v。机械能守恒不再是预设定义，而是零导数与均值定理的推论。",
      origin:"LeanPath 动力学主代码摘编 · 微分功—能证明",
      filename:"DifferentialWorkEnergy.lean",
      milestones:["有限和上的点积乘法法则","动能的 HasDerivAt 定理","用牛顿方程识别瞬时功率","逐点零导数推出全局机械能守恒"],
      code:lean`import Mathlib

theorem energy_conserved_of_zero_derivative (E : ℝ → ℝ)
    (hE : ∀ t, HasDerivAt E 0 t) (t₁ t₂ : ℝ) : E t₁ = E t₂ := by
  have hdiff : Differentiable ℝ E := fun t => (hE t).differentiableAt
  have hderiv : ∀ t, deriv E t = 0 := fun t => (hE t).deriv
  exact is_const_of_deriv_eq_zero hdiff hderiv t₁ t₂
`
    },
    {
      id:"showcase-dynamics-modes",unlock:"modal-eigen",part:3,
      title:"质量—刚度系统与正常模态",
      summary:"对二自由度模型直接验证同相、反相广义特征向量，证明任意位形的模态分解、质量正交性与刚度能非负，从具体计算连接到谱问题。",
      origin:"LeanPath 动力学主代码摘编 · 有限维振动模型",
      filename:"GeneralizedNormalModes.lean",
      milestones:["Kφ=λMφ 的两个精确特征对","任意二自由度位形的模态分解","两个模态关于质量型正交","刚度二次型非负"],
      code:lean`import Mathlib

abbrev Vec2 := ℝ × ℝ
def massAction (m : ℝ) (q : Vec2) : Vec2 := (m * q.1, m * q.2)
def stiffnessAction (k : ℝ) (q : Vec2) : Vec2 :=
  (2 * k * q.1 - k * q.2, -k * q.1 + 2 * k * q.2)
def inPhase : Vec2 := (1, 1)

theorem inPhase_eigenpair (m k : ℝ) (hm : m ≠ 0) :
    stiffnessAction k inPhase = massAction m ((k / m) • inPhase) := by
  ext <;> simp [stiffnessAction, massAction, inPhase]
  <;> field_simp [hm]
  <;> ring
`
    },
    {
      id:"showcase-dynamics-euler",unlock:"euler-equations",part:3,
      title:"自由刚体的欧拉不变量",
      summary:"把三条主轴欧拉方程分别乘角速度后相加，耦合项循环抵消，得到转动能瞬时守恒；主代码继续把各角速度的真实导数接入并证明全局守恒。",
      origin:"LeanPath 动力学主代码摘编 · 欧拉刚体方程",
      filename:"EulerEnergyInvariant.lean",
      milestones:["一般维质点惯性矩阵的对称性","主轴坐标中的三条欧拉方程","转动能与角动量模平方的瞬时不变量","HasDerivAt 与均值定理给出全局能量守恒"],
      code:lean`import Mathlib

theorem freeEuler_energy_rate_zero
    (I₁ I₂ I₃ ω₁ ω₂ ω₃ α₁ α₂ α₃ : ℝ)
    (h₁ : I₁ * α₁ + (I₃ - I₂) * ω₂ * ω₃ = 0)
    (h₂ : I₂ * α₂ + (I₁ - I₃) * ω₃ * ω₁ = 0)
    (h₃ : I₃ * α₃ + (I₂ - I₁) * ω₁ * ω₂ = 0) :
    I₁ * ω₁ * α₁ + I₂ * ω₂ * α₂ + I₃ * ω₃ * α₃ = 0 := by
  linear_combination ω₁ * h₁ + ω₂ * h₂ + ω₃ * h₃
`
    },
    {
      id:"showcase-dynamics-lagrange",unlock:"lagrange-equations",part:3,
      title:"谐振子：真实偏导、Euler–Lagrange 与能量守恒",
      summary:"对 L=½mv²−½kq² 使用 HasDerivAt 真正计算 ∂L/∂v=mv、∂L/∂q=−kq，再把牛顿方程识别成 Euler–Lagrange 方程，并证明机械能逐点零导数及全局守恒。",
      origin:"LeanPath 动力学主代码摘编 · 拉格朗日微分证明链",
      filename:"HarmonicLagrangian.lean",
      milestones:["用乘法法则计算两个偏导","Newton 方程等价为 Euler–Lagrange 关系","链式/乘积法则证明机械能导数为零","均值定理给出任意两时刻能量相等"],
      code:lean`import Mathlib

noncomputable section

def harmonicLagrangian (m k q v : ℝ) : ℝ :=
  (1 / 2 : ℝ) * m * v^2 - (1 / 2 : ℝ) * k * q^2

section ScalarCalculus
local instance : AddCommGroup ℝ := Real.normedAddCommGroup.toAddCommGroup
local instance : Module ℝ ℝ := RCLike.toInnerProductSpaceReal.toModule

theorem dL_dv (m k q v : ℝ) :
    HasDerivAt (fun w => harmonicLagrangian m k q w) (m * v) v := by
  have hsq := (hasDerivAt_id v).mul (hasDerivAt_id v)
  have hkin := hsq.mul_const ((1 / 2 : ℝ) * m)
  have hfull := hkin.sub (hasDerivAt_const v ((1 / 2 : ℝ) * k * q^2))
  simp only [Pi.mul_apply, id_eq] at hfull
  have hd : (1 * v + v * 1) * ((1 / 2 : ℝ) * m) - 0 = m * v := by ring
  rw [hd] at hfull
  have hf : ((fun y : ℝ => y * y * ((1 / 2 : ℝ) * m)) -
      fun _ : ℝ => (1 / 2 : ℝ) * k * q^2) =
      (fun w => harmonicLagrangian m k q w) := by
    funext w
    simp only [harmonicLagrangian, Pi.sub_apply, pow_two]
    ring
  rw [hf] at hfull
  exact hfull

end ScalarCalculus
`
    },
    {
      id:"showcase-dynamics-kepler",unlock:"kepler-orbits",part:3,
      title:"开普勒圆锥、能量分类与第三定律",
      summary:"在正质量、正引力参数、非碰撞和非零角动量的适用域内，主代码形式化圆锥半径恒等式、椭圆/抛物线/双曲线的能量符号，并由面积律和椭圆关系推出第三定律。",
      origin:"LeanPath 动力学主代码摘编 · 正则中心力轨道",
      filename:"KeplerAlgebra.lean",
      milestones:["圆锥轨道方程的非退化分母条件","能量—偏心率三分类","面积律与角动量关系的代数消元","T²μ=4π²a³"],
      code:lean`import Mathlib

theorem kepler_third_law
    (m μ a b h T : ℝ) (hh : h ≠ 0)
    (hArea : T * h = 2 * m * Real.pi * a * b)
    (hAngular : h^2 * a = m^2 * μ * b^2) :
    T^2 * μ = 4 * Real.pi^2 * a^3 := by
  have hT : T = (2 * m * Real.pi * a * b) / h :=
    (eq_div_iff hh).2 hArea
  rw [hT]
  calc
    ((2*m*Real.pi*a*b)/h)^2*μ =
        (4*Real.pi^2*a^2*(m^2*μ*b^2))/h^2 := by
      field_simp [hh]
      ring
    _ = (4*Real.pi^2*a^2*(h^2*a))/h^2 := by rw [← hAngular]
    _ = 4*Real.pi^2*a^3 := by field_simp [hh]
`
    },
    {
      id:"showcase-dynamics-complete",unlock:"dynamics-chest",part:3,
      title:"第三部分完整成果 · 欧式空间动力学",
      summary:"完整主文件包含欧式球面曲线、真实轨迹导数、动量与角动量微分定理、功—能、模态、惯性、Euler 刚体、达朗贝尔、Lagrange 与 Kepler 证明链。",
      origin:"LeanPath 完整成果 · Mathlib；明确记录正则性与非碰撞边界",
      filename:"EuclideanDynamics.lean",file:"lean/EuclideanDynamics.lean",completion:true,
      milestones:["欧式球面速度切向与法向加速度恒等式","恒加速度向量轨迹满足 Newton 曲线","p′=F 的微分动量定理","一般维 L̇=r∧F 与中心力全局守恒","瞬时功率—动能定理与机械能守恒","质量—刚度广义特征模态","惯性张量和自由 Euler 能量守恒","达朗贝尔原理与 Newton 方程充要性","谐振子真实偏导、Euler–Lagrange 与全局守恒","Kepler 圆锥分类与第三定律"]
    }
  );

  window.LEANPATH_SHOWCASE = showcase;
}());

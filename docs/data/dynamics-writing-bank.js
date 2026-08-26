/* LeanPath Physics · Unit III writing laboratory.
   The exercises move from concrete mechanics to genuine HasDerivAt proofs
   and then to local-to-global conservation arguments. */
(function () {
  const bank = window.LEANPATH_WRITING_BANK || {version:0, tasks:[]};
  const lean = String.raw;

  bank.version = Math.max(bank.version || 0, 10);
  bank.tasks.push(
    {
      id:"dynamics-v2-concrete-kinematics",part:3,unlock:"trajectory-kinematics",level:1,
      section:"具体运动学",title:"计算五秒后的位移与速度",
      prompt:"质点从原点静止出发，保持 2 m/s² 的加速度。用 r=r₀+v₀t+½at²、v=v₀+at 精确证明五秒后 r=25 m、v=10 m/s。",
      concept:"dyn-trajectory",xp:12,starter:"by\n  ",placeholder:"展开两个运动学函数并做精确计算",
      hint:"norm_num [position, velocity]。",
      template:lean`import Mathlib

noncomputable section

def position (r₀ v₀ a t : ℝ) : ℝ := r₀ + v₀ * t + (1 / 2 : ℝ) * a * t^2
def velocity (v₀ a t : ℝ) : ℝ := v₀ + a * t

theorem five_seconds_of_uniform_acceleration :
    position 0 0 2 5 = 25 ∧ velocity 0 2 5 = 10 :=
  {{ANSWER}}
`
    },
    {
      id:"dynamics-v2-velocity-derivative",part:3,unlock:"trajectory-kinematics",level:3,
      section:"真实导数",title:"证明恒加速度速度曲线的导数",
      prompt:"对一般 ℝⁿ 速度曲线 v(t)=v₀+ta，逐坐标证明其 Lean 导数确实是 a。这一步把运动学公式升级为 HasDerivAt 事实。",
      concept:"dyn-trajectory",xp:20,starter:"by\n  apply hasDerivAt_pi.mpr\n  ",placeholder:"进入坐标 i，调用恒等函数的乘法求导",
      hint:"对第 i 坐标使用 (hasDerivAt_id t).mul_const (a i)，再 const_add (v₀ i)。",
      template:lean`import Mathlib

noncomputable section

abbrev VecN (n : ℕ) := Fin n → ℝ
def velocityVec {n : ℕ} (v₀ a : VecN n) (t : ℝ) : VecN n := v₀ + t • a

theorem velocityVec_hasDerivAt {n : ℕ} (v₀ a : VecN n) (t : ℝ) :
    HasDerivAt (velocityVec v₀ a) a t :=
  {{ANSWER}}
`
    },
    {
      id:"dynamics-v2-momentum-theorem",part:3,unlock:"momentum-dynamics",level:3,
      section:"动量定理",title:"从速度导数推出 ṗ=ma",
      prompt:"质量 m 为常数且 v′(t)=a。逐坐标证明 p(t)=m v(t) 的导数为 ma；这是动量定理的微分核心。",
      concept:"dyn-momentum",xp:20,starter:"by\n  apply hasDerivAt_pi.mpr\n  ",placeholder:"把向量导数拆为坐标，并对常数乘积求导",
      hint:"hasDerivAt_pi.mp hv i 给出第 i 坐标导数；使用 const_mul m。",
      template:lean`import Mathlib

noncomputable section

abbrev VecN (n : ℕ) := Fin n → ℝ
def momentum {n : ℕ} (m : ℝ) (v : VecN n) : VecN n := m • v

theorem momentum_hasDerivAt {n : ℕ} (m : ℝ)
    {v : ℝ → VecN n} {a : VecN n} {t : ℝ}
    (hv : HasDerivAt v a t) :
    HasDerivAt (fun s => momentum m (v s)) (momentum m a) t :=
  {{ANSWER}}
`
    },
    {
      id:"dynamics-v2-collision",part:3,unlock:"momentum-dynamics",level:2,
      section:"碰撞计算",title:"求完全非弹性碰撞后的共同速度",
      prompt:"质量 2、3 的两物体速度分别为 4、−1。由动量守恒精确证明粘连后的共同速度为 1。",
      concept:"dyn-momentum",xp:14,starter:"by\n  ",placeholder:"代入质量和速度并归一化有理式",
      hint:"norm_num [stickingVelocity]。",
      template:lean`import Mathlib

noncomputable def stickingVelocity (m₁ m₂ v₁ v₂ : ℝ) : ℝ :=
  (m₁ * v₁ + m₂ * v₂) / (m₁ + m₂)

theorem concrete_inelastic_collision :
    stickingVelocity 2 3 4 (-1) = 1 :=
  {{ANSWER}}
`
    },
    {
      id:"dynamics-v2-angular-torque",part:3,unlock:"angular-momentum",level:4,
      section:"角动量定理",title:"由楔积乘法法则证明 L̇=r∧F",
      prompt:"已给出楔积的导数法则。结合 r′=v、v′=a、p=mv、F=ma，消去 v∧mv 项，得到一般 ℝⁿ 中的角动量—力矩定理。",
      concept:"dyn-angular",xp:26,starter:"by\n  ",placeholder:"先求 p 的导数，再应用 wedge_hasDerivAt，并消去平行项",
      hint:"构造 hp 后令 hL := wedge_hasDerivAt hr hp；证明 wedge (v t) (momentum m (v t))=0，再按 hNewton 改写。",
      template:lean`import Mathlib

abbrev VecN (n : ℕ) := Fin n → ℝ
abbrev TwoForm (n : ℕ) := Matrix (Fin n) (Fin n) ℝ
def wedge {n : ℕ} (r p : VecN n) : TwoForm n :=
  fun i j => r i * p j - r j * p i
def momentum {n : ℕ} (m : ℝ) (v : VecN n) : VecN n := m • v
def angularMomentum {n : ℕ} (r : VecN n) (m : ℝ) (v : VecN n) : TwoForm n :=
  wedge r (momentum m v)

theorem momentum_hasDerivAt {n : ℕ} (m : ℝ)
    {v : ℝ → VecN n} {a : VecN n} {t : ℝ} (hv : HasDerivAt v a t) :
    HasDerivAt (fun s => momentum m (v s)) (momentum m a) t := by
  apply hasDerivAt_pi.mpr
  intro i
  change HasDerivAt (fun s : ℝ => m * v s i) (m * a i) t
  simpa using (hasDerivAt_pi.mp hv i).const_mul m

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

theorem central_force_zero_torque {n : ℕ} (c : ℝ) (r : VecN n) :
    wedge r (c • r) = 0 := by
  ext i j
  simp [wedge]
  ring

theorem angularMomentum_torque_theorem {n : ℕ} (m : ℝ)
    {r v : ℝ → VecN n} {a force : VecN n} {t : ℝ}
    (hr : HasDerivAt r (v t) t) (hv : HasDerivAt v a t)
    (hNewton : force = m • a) :
    HasDerivAt (fun s => angularMomentum (r s) m (v s))
      (wedge (r t) force) t :=
  {{ANSWER}}
`
    },
    {
      id:"dynamics-v2-work-energy",part:3,unlock:"energy-dynamics",level:4,
      section:"动能定理",title:"证明瞬时功率等于动能导数",
      prompt:"已知 v′=a，先对 v·v 使用乘法法则，再处理 ½m，并证明 dT/dt=m(v·a)。这是真正的微分版动能定理。",
      concept:"dyn-energy",xp:25,starter:"by\n  ",placeholder:"调用 dotProduct_hasDerivAt，再整理两个相同的交叉项",
      hint:"令 hdot := dotProduct_hasDerivAt hv hv；对它 const_mul (½m)，最后用 dotProduct_comm 和 ring。",
      template:lean`import Mathlib

noncomputable section

abbrev VecN (n : ℕ) := Fin n → ℝ

theorem dotProduct_hasDerivAt {n : ℕ}
    {u v : ℝ → VecN n} {u' v' : VecN n} {t : ℝ}
    (hu : HasDerivAt u u' t) (hv : HasDerivAt v v' t) :
    HasDerivAt (fun s => dotProduct (u s) (v s))
      (dotProduct u' (v t) + dotProduct (u t) v') t := by
  have hu' := hasDerivAt_pi.mp hu
  have hv' := hasDerivAt_pi.mp hv
  have hsum : HasDerivAt (fun s => ∑ i, u s i * v s i)
      (∑ i, (u' i * v t i + u t i * v' i)) t := by
    apply HasDerivAt.fun_sum
    intro i hi
    exact (hu' i).mul (hv' i)
  simpa [dotProduct, Finset.sum_add_distrib] using hsum

def kineticEnergyVec {n : ℕ} (m : ℝ) (v : VecN n) : ℝ :=
  (1 / 2 : ℝ) * m * dotProduct v v

theorem kineticEnergyVec_hasDerivAt {n : ℕ} (m : ℝ)
    {v : ℝ → VecN n} {a : VecN n} {t : ℝ} (hv : HasDerivAt v a t) :
    HasDerivAt (fun s => kineticEnergyVec m (v s))
      (m * dotProduct (v t) a) t :=
  {{ANSWER}}
`
    },
    {
      id:"dynamics-v2-normal-mode",part:3,unlock:"modal-eigen",level:3,
      section:"广义特征值",title:"验证二自由度同相模态",
      prompt:"对 K=[[2k,−k],[−k,2k]] 与 M=mI，证明 φ=(1,1) 满足 Kφ=M((k/m)φ)。假设 m≠0，完整处理特征值中的除法。",
      concept:"dyn-modal",xp:20,starter:"by\n  ext <;>\n    ",placeholder:"分别化简两个分量、消去 m 并整理",
      hint:"simp [stiffnessAction, massAction, inPhaseMode]，随后 field_simp [hm] 和 ring。",
      template:lean`import Mathlib

abbrev Vec2 := ℝ × ℝ
def massAction (m : ℝ) (q : Vec2) : Vec2 := (m * q.1, m * q.2)
def stiffnessAction (k : ℝ) (q : Vec2) : Vec2 :=
  (2 * k * q.1 - k * q.2, -k * q.1 + 2 * k * q.2)
def inPhaseMode : Vec2 := (1, 1)

theorem inPhase_generalized_eigenpair (m k : ℝ) (hm : m ≠ 0) :
    stiffnessAction k inPhaseMode =
      massAction m ((k / m) • inPhaseMode) :=
  {{ANSWER}}
`
    },
    {
      id:"dynamics-v2-inertia",part:3,unlock:"inertia-tensor",level:2,
      section:"具体惯量",title:"计算对称哑铃的主惯量",
      prompt:"两个质量均为 m 的质点位于 x=±a。逐项证明绕 y 轴的惯量 m a²+m(−a)² 等于 2ma²。",
      concept:"dyn-inertia",xp:15,starter:"by\n  ",placeholder:"展开定义并整理平方项",
      hint:"unfold dumbbellIy 后 ring。",
      template:lean`import Mathlib

def dumbbellIy (m a : ℝ) : ℝ := m * a^2 + m * (-a)^2

theorem dumbbell_Iy (m a : ℝ) : dumbbellIy m a = 2 * m * a^2 :=
  {{ANSWER}}
`
    },
    {
      id:"dynamics-v2-euler-energy",part:3,unlock:"euler-equations",level:3,
      section:"欧拉方程",title:"由三条自由欧拉方程推出能量变化率为零",
      prompt:"分别以 ω₁、ω₂、ω₃ 乘三条无外力矩欧拉方程并相加，证明陀螺耦合项完全抵消，只剩转动能变化率为零。",
      concept:"dyn-euler",xp:22,starter:"by\n  ",placeholder:"线性组合三条方程，并让多项式归一化",
      hint:"linear_combination ω₁ * h₁ + ω₂ * h₂ + ω₃ * h₃。",
      template:lean`import Mathlib

theorem freeEuler_energy_rate_zero
    (I₁ I₂ I₃ ω₁ ω₂ ω₃ α₁ α₂ α₃ : ℝ)
    (h₁ : I₁ * α₁ + (I₃ - I₂) * ω₂ * ω₃ = 0)
    (h₂ : I₂ * α₂ + (I₁ - I₃) * ω₃ * ω₁ = 0)
    (h₃ : I₃ * α₃ + (I₂ - I₁) * ω₁ * ω₂ = 0) :
    I₁ * ω₁ * α₁ + I₂ * ω₂ * α₂ + I₃ * ω₃ * α₃ = 0 :=
  {{ANSWER}}
`
    },
    {
      id:"dynamics-v2-dalembert",part:3,unlock:"dalembert",level:4,
      section:"达朗贝尔原理",title:"证明有限维虚功条件等价于牛顿方程",
      prompt:"证明残差 R=F−ma 对所有虚位移 δ 的点积为零，当且仅当 R=0。反向直接代入；正向选择 δ=R 并使用点积正定性。",
      concept:"dyn-dalembert",xp:25,starter:"by\n  constructor\n  ",placeholder:"正向用残差自身作测试向量；反向按牛顿等式化简",
      hint:"应用 dotProduct_self_eq_zero.mp，并 simpa [virtualPower] using h (force - m • acceleration)。",
      template:lean`import Mathlib

abbrev VecN (n : ℕ) := Fin n → ℝ
def virtualPower {n : ℕ} (residual variation : VecN n) : ℝ :=
  dotProduct residual variation

theorem dalembert_iff_newton {n : ℕ}
    (force acceleration : VecN n) (m : ℝ) :
    (∀ δ, virtualPower (force - m • acceleration) δ = 0) ↔
      force = m • acceleration :=
  {{ANSWER}}
`
    },
    {
      id:"dynamics-v2-lagrangian-derivative",part:3,unlock:"lagrange-equations",level:4,
      section:"拉格朗日方程",title:"真正计算 ∂L/∂v = mv",
      prompt:"对 L(q,v)=½mv²−½kq²，不把偏导数作为定义，而是使用 HasDerivAt 的乘法法则真正证明速度偏导为 mv。",
      concept:"dyn-lagrange",xp:27,starter:"by\n  ",placeholder:"对 v·v 求导、乘常数、减去常量势能，再整理函数表达式",
      hint:"先构造 hsq、hkin、hfull；把导数值化为 m*v，最后用函数外延性把 hfull 的函数改写成 harmonicLagrangian。",
      template:lean`import Mathlib

noncomputable section

def harmonicLagrangian (m k q v : ℝ) : ℝ :=
  (1 / 2 : ℝ) * m * v^2 - (1 / 2 : ℝ) * k * q^2

section ScalarCalculus
local instance : AddCommGroup ℝ := Real.normedAddCommGroup.toAddCommGroup
local instance : Module ℝ ℝ := RCLike.toInnerProductSpaceReal.toModule

theorem harmonicLagrangian_hasDerivAt_velocity (m k q v : ℝ) :
    HasDerivAt (fun w => harmonicLagrangian m k q w) (m * v) v :=
  {{ANSWER}}

end ScalarCalculus
`
    },
    {
      id:"dynamics-v2-global-conservation",part:3,unlock:"energy-dynamics",level:4,
      section:"守恒律",title:"从逐点零导数推出全局能量守恒",
      prompt:"设能量函数 E 在每个时刻都有导数 0。先得到 E 的全局可微性与 deriv E=0，再调用均值定理的常值推论证明任意两时刻能量相同。",
      concept:"dyn-energy",xp:26,starter:"by\n  ",placeholder:"从 hE 提取 differentiableAt 与 deriv，再用 is_const_of_deriv_eq_zero",
      hint:"构造 hdiff : Differentiable ℝ E 和 hderiv : ∀ t, deriv E t = 0。",
      template:lean`import Mathlib

theorem energy_conserved_of_zero_derivative (E : ℝ → ℝ)
    (hE : ∀ t, HasDerivAt E 0 t) (t₁ t₂ : ℝ) :
    E t₁ = E t₂ :=
  {{ANSWER}}
`
    },
    {
      id:"dynamics-v2-kepler-third",part:3,unlock:"kepler-orbits",level:4,
      section:"开普勒第三定律",title:"由面积律与椭圆关系推出 T²μ=4π²a³",
      prompt:"已知 Th=2mπab 与 h²a=m²μb²，且 h≠0。先解出周期 T，再代入消去 h、m、b，完成开普勒第三定律的代数证明。",
      concept:"dyn-kepler",xp:28,starter:"by\n  ",placeholder:"先由面积律解出 T，再分步代入角动量关系并消去非零 h",
      hint:"仿照主代码：构造 hT，rw [hT]，用 field_simp [hh]、ring 与 ←hAngular。",
      template:lean`import Mathlib

theorem kepler_third_law_from_area_and_ellipse
    (m μ a b h T : ℝ) (hh : h ≠ 0)
    (hArea : T * h = 2 * m * Real.pi * a * b)
    (hAngular : h^2 * a = m^2 * μ * b^2) :
    T^2 * μ = 4 * Real.pi^2 * a^3 :=
  {{ANSWER}}
`
    }
  );

  window.LEANPATH_WRITING_BANK = bank;
}());

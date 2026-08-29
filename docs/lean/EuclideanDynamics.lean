import Mathlib

/-!
# LeanPath Physics：欧式空间中的动力学

本文件是第三单元的完整成果。内容从欧式曲线的真实导数出发，依次形式化 Newton 方程、
动量与角动量定理、功—能关系、线性振动、刚体转动、达朗贝尔原理、Lagrange 方程及
Kepler 圆锥轨道的代数核心。文件明确区分物理建模假设与由 Lean 推出的数学结论；一般
常微分方程的存在唯一性、碰撞奇点排除和经验模型有效性不在本文件的证明范围内。
-/

noncomputable section

namespace LeanPath.Dynamics

abbrev VecN (n : ℕ) := Fin n → ℝ
abbrev TwoForm (n : ℕ) := Matrix (Fin n) (Fin n) ℝ
abbrev EVecN (n : ℕ) := EuclideanSpace ℝ (Fin n)


/-! ## 0. 欧式曲线的微分基础

与坐标辅助类型 `VecN` 不同，`EVecN` 是 Mathlib 中真正的 `EuclideanSpace`，其范数与
内积来自同一个度量结构。因此，下面两个引理是关于欧式球面上曲线的内禀几何陈述。
-/

/-- 欧式球面上的可微曲线，其速度向量切于球面，因而与径向向量正交。 -/
theorem euclideanSphere_velocity_orthogonal {n : ℕ}
    {r : ℝ → EVecN n} {v : EVecN n} {t R : ℝ}
    (hr : HasDerivAt r v t)
    (hSphere : ∀ s, ‖r s‖ ^ 2 = R ^ 2) :
    inner ℝ (r t) v = 0 := by
  have hnorm := hr.norm_sq
  have hzero : HasDerivAt (fun s => ‖r s‖ ^ 2) 0 t := by
    have hfun : (fun s : ℝ => ‖r s‖ ^ 2) = (fun _ : ℝ => R ^ 2) := by
      funext s
      exact hSphere s
    rw [hfun]
    exact hasDerivAt_const t (R ^ 2)
  have huniq := hnorm.unique hzero
  linarith

/-- 对欧式球面上的曲线，若 `r' = v` 且 `v' = a`，则
`⟪r,a⟫ = -⟪v,v⟫`。这是环境欧式空间中的法向加速度恒等式。 -/
theorem euclideanSphere_acceleration_normal_identity {n : ℕ}
    {r v : ℝ → EVecN n} {a : EVecN n} {t R : ℝ}
    (hr : ∀ s, HasDerivAt r (v s) s)
    (hv : HasDerivAt v a t)
    (hSphere : ∀ s, ‖r s‖ ^ 2 = R ^ 2) :
    inner ℝ (r t) a = -inner ℝ (v t) (v t) := by
  have hOrth : ∀ s, inner ℝ (r s) (v s) = 0 := by
    intro s
    exact euclideanSphere_velocity_orthogonal (R := R) (hr s) hSphere
  have hprod := HasDerivAt.inner ℝ (hr t) hv
  have hzero : HasDerivAt (fun s => inner ℝ (r s) (v s)) 0 t := by
    have hfun :
        (fun s : ℝ => inner ℝ (r s) (v s)) = (fun _ : ℝ => 0) := by
      funext s
      exact hOrth s
    rw [hfun]
    exact hasDerivAt_const t 0
  have huniq := hprod.unique hzero
  linarith

/-! ### 0A. 坐标模型中的内积乘积法则

`VecN n = Fin n → ℝ` 是有限维实赋范空间。下面的引理给出标准坐标点积的乘积法则，
并作为后续几何恒等式与力学守恒律的微分基础。
-/

theorem dotProduct_hasDerivAt {n : ℕ}
    {u v : ℝ → VecN n} {u' v' : VecN n} {t : ℝ}
    (hu : HasDerivAt u u' t) (hv : HasDerivAt v v' t) :
    HasDerivAt (fun s => dotProduct (u s) (v s))
      (dotProduct u' (v t) + dotProduct (u t) v') t := by
  have hu' := hasDerivAt_pi.mp hu
  have hv' := hasDerivAt_pi.mp hv
  have hsum :
      HasDerivAt (fun s => ∑ i, u s i * v s i)
        (∑ i, (u' i * v t i + u t i * v' i)) t := by
    apply HasDerivAt.fun_sum
    intro i hi
    exact (hu' i).mul (hv' i)
  simpa [dotProduct, Finset.sum_add_distrib] using hsum

/-- 受球面约束的可微曲线具有切向速度。 -/
theorem sphereCurve_velocity_orthogonal {n : ℕ}
    {r : ℝ → VecN n} {v : VecN n} {t R : ℝ}
    (hr : HasDerivAt r v t)
    (hSphere : ∀ s, dotProduct (r s) (r s) = R ^ 2) :
    dotProduct (r t) v = 0 := by
  have hnorm := dotProduct_hasDerivAt hr hr
  have hzero :
      HasDerivAt (fun s => dotProduct (r s) (r s)) 0 t := by
    have hfun :
        (fun s : ℝ => dotProduct (r s) (r s)) = (fun _ : ℝ => R ^ 2) := by
      funext s
      exact hSphere s
    rw [hfun]
    exact hasDerivAt_const t (R ^ 2)
  have huniq := hnorm.unique hzero
  rw [dotProduct_comm v (r t)] at huniq
  linarith

/-- 对二次可微的球面曲线，有 `r · a = -v · v`。这是圆周运动与球面运动背后的
法向加速度恒等式。 -/
theorem sphereCurve_acceleration_normal_identity {n : ℕ}
    {r v : ℝ → VecN n} {a : VecN n} {t R : ℝ}
    (hr : ∀ s, HasDerivAt r (v s) s)
    (hv : HasDerivAt v a t)
    (hSphere : ∀ s, dotProduct (r s) (r s) = R ^ 2) :
    dotProduct (r t) a = -dotProduct (v t) (v t) := by
  have hOrth : ∀ s, dotProduct (r s) (v s) = 0 := by
    intro s
    exact sphereCurve_velocity_orthogonal (R := R) (hr s) hSphere
  have hprod := dotProduct_hasDerivAt (hr t) hv
  have hzero :
      HasDerivAt (fun s => dotProduct (r s) (v s)) 0 t := by
    have hfun :
        (fun s : ℝ => dotProduct (r s) (v s)) = (fun _ : ℝ => 0) := by
      funext s
      exact hOrth s
    rw [hfun]
    exact hasDerivAt_const t 0
  have huniq := hprod.unique hzero
  linarith

/-! ## 1. 运动学与 Newton 方程 -/

structure ParticleState (n : ℕ) where
  position : VecN n
  velocity : VecN n
  acceleration : VecN n

def momentum {n : ℕ} (m : ℝ) (v : VecN n) : VecN n := m • v

def newtonResidual {n : ℕ} (force : VecN n) (m : ℝ)
    (acceleration : VecN n) : VecN n :=
  force - m • acceleration

def SatisfiesNewton {n : ℕ} (force : VecN n) (m : ℝ)
    (state : ParticleState n) : Prop :=
  force = m • state.acceleration


/-- 真正的 Newton 轨迹：位置的导数是速度，速度的导数是加速度，并且力学方程逐点成立。 -/
def SolvesNewtonCurve {n : ℕ} (force : ℝ → VecN n) (m : ℝ)
    (r v a : ℝ → VecN n) : Prop :=
  ∀ t, HasDerivAt r (v t) t ∧
    HasDerivAt v (a t) t ∧
    force t = m • a t

theorem newtonResidual_eq_zero {n : ℕ} (force acceleration : VecN n)
    (m : ℝ) (h : force = m • acceleration) :
    newtonResidual force m acceleration = 0 := by
  simp [newtonResidual, h]

theorem newtonResidual_eq_zero_iff {n : ℕ}
    (force acceleration : VecN n) (m : ℝ) :
    newtonResidual force m acceleration = 0 ↔
      force = m • acceleration := by
  unfold newtonResidual
  constructor
  · intro h
    exact sub_eq_zero.mp h
  · intro h
    exact sub_eq_zero.mpr h

theorem zero_force_implies_zero_acceleration {n : ℕ}
    (m : ℝ) (hm : m ≠ 0) (acceleration : VecN n)
    (h : (0 : VecN n) = m • acceleration) :
    acceleration = 0 := by
  ext i
  have hi : (0 : ℝ) = m * acceleration i := by
    simpa using congrFun h i
  exact (mul_eq_zero.mp hi.symm).resolve_left hm

def constantAccelerationTrajectory
    (r₀ v₀ a : ℝ) (t : ℝ) : ℝ :=
  r₀ + v₀ * t + (1 / 2 : ℝ) * a * t ^ 2

theorem constantAccelerationTrajectory_zero (r₀ v₀ a : ℝ) :
    constantAccelerationTrajectory r₀ v₀ a 0 = r₀ := by
  simp [constantAccelerationTrajectory]


/-! ### 1A. 以真实导数表述的运动学

前面的标量轨迹用于初等练习；下面的向量值版本则把速度和加速度表述为真正的导数。
-/

def constantAccelerationTrajectoryVec {n : ℕ}
    (r₀ v₀ a : VecN n) (t : ℝ) : VecN n :=
  r₀ + t • v₀ + ((1 / 2 : ℝ) * t ^ 2) • a

def constantAccelerationVelocityVec {n : ℕ}
    (v₀ a : VecN n) (t : ℝ) : VecN n :=
  v₀ + t • a

theorem constantAccelerationVelocityVec_hasDerivAt {n : ℕ}
    (v₀ a : VecN n) (t : ℝ) :
    HasDerivAt (constantAccelerationVelocityVec v₀ a) a t := by
  apply hasDerivAt_pi.mpr
  intro i
  change HasDerivAt (fun s : ℝ => v₀ i + s * a i) (a i) t
  have h := ((hasDerivAt_id t).mul_const (a i)).const_add (v₀ i)
  have hderiv : 1 * a i = a i := by ring
  rw [hderiv] at h
  exact h

theorem constantAccelerationTrajectoryVec_hasDerivAt {n : ℕ}
    (r₀ v₀ a : VecN n) (t : ℝ) :
    HasDerivAt (constantAccelerationTrajectoryVec r₀ v₀ a)
      (constantAccelerationVelocityVec v₀ a t) t := by
  have hlin : HasDerivAt (fun s : ℝ => s • v₀) v₀ t := by
    simpa using (hasDerivAt_id t).smul_const v₀
  have hquadScalar :
      HasDerivAt (fun s : ℝ => (1 / 2 : ℝ) * s ^ 2) t t := by
    have hscaled := HasDerivAt.const_mul (1 / 2 : ℝ)
      ((hasDerivAt_id t).mul (hasDerivAt_id t))
    simp only [Pi.mul_apply, id_eq] at hscaled
    have hderiv :
        (1 / 2 : ℝ) * (1 * t + t * 1) = t := by ring
    rw [hderiv] at hscaled
    simpa only [Pi.mul_apply, id_eq, pow_two] using hscaled
  have hquad :
      HasDerivAt (fun s : ℝ => ((1 / 2 : ℝ) * s ^ 2) • a) (t • a) t := by
    simpa using hquadScalar.smul_const a
  apply hasDerivAt_pi.mpr
  intro i
  change HasDerivAt
    (fun s : ℝ =>
      r₀ i + s * v₀ i + ((1 / 2 : ℝ) * s ^ 2) * a i)
    (v₀ i + t * a i) t
  have hsum :=
    ((hasDerivAt_const t (r₀ i)).add
      ((hasDerivAt_id t).mul_const (v₀ i))).add
      (hquadScalar.mul_const (a i))
  have hderiv :
      (0 + 1 * v₀ i) + t * a i = v₀ i + t * a i := by ring
  rw [hderiv] at hsum
  exact hsum

theorem constantAccelerationTrajectoryVec_solves_newton {n : ℕ}
    (r₀ v₀ a force : VecN n) (m t : ℝ)
    (hNewton : force = m • a) :
    HasDerivAt (constantAccelerationTrajectoryVec r₀ v₀ a)
        (constantAccelerationVelocityVec v₀ a t) t ∧
      HasDerivAt (constantAccelerationVelocityVec v₀ a) a t ∧
      force = m • a := by
  exact ⟨constantAccelerationTrajectoryVec_hasDerivAt r₀ v₀ a t,
    constantAccelerationVelocityVec_hasDerivAt v₀ a t, hNewton⟩


/-- 该多项式轨迹是常力 `F = m a` 所对应 Newton 方程的全局解。 -/
theorem constantAccelerationTrajectoryVec_solvesNewtonCurve {n : ℕ}
    (r₀ v₀ a : VecN n) (m : ℝ) :
    SolvesNewtonCurve (fun _ => m • a) m
      (constantAccelerationTrajectoryVec r₀ v₀ a)
      (constantAccelerationVelocityVec v₀ a)
      (fun _ => a) := by
  intro t
  exact ⟨constantAccelerationTrajectoryVec_hasDerivAt r₀ v₀ a t,
    constantAccelerationVelocityVec_hasDerivAt v₀ a t, rfl⟩

theorem momentum_hasDerivAt {n : ℕ} (m : ℝ)
    {v : ℝ → VecN n} {a : VecN n} {t : ℝ}
    (hv : HasDerivAt v a t) :
    HasDerivAt (fun s => momentum m (v s)) (momentum m a) t := by
  apply hasDerivAt_pi.mpr
  intro i
  change HasDerivAt (fun s : ℝ => m * v s i) (m * a i) t
  simpa using (hasDerivAt_pi.mp hv i).const_mul m

/-- 动量定理的微分形式：`p' = F`。 -/
theorem momentum_theorem {n : ℕ} (m : ℝ)
    {v : ℝ → VecN n} {a force : VecN n} {t : ℝ}
    (hv : HasDerivAt v a t) (hNewton : force = m • a) :
    HasDerivAt (fun s => momentum m (v s)) force t := by
  rw [hNewton]
  simpa [momentum] using momentum_hasDerivAt m hv

/-! ## 2. 动量与冲量 -/

def impulse (force duration : ℝ) : ℝ := force * duration

theorem constant_force_impulse (m F v₀ v₁ Δt : ℝ)
    (hm : m ≠ 0) (hv : v₁ = v₀ + (F / m) * Δt) :
    m * v₁ - m * v₀ = impulse F Δt := by
  rw [hv]
  calc
    m * (v₀ + (F / m) * Δt) - m * v₀ = F * Δt := by
      field_simp [hm]
      ring
    _ = impulse F Δt := by rfl

theorem inelastic_collision_velocity (m₁ m₂ v₁ v₂ : ℝ)
    (hm : m₁ + m₂ ≠ 0) :
    (m₁ + m₂) * ((m₁ * v₁ + m₂ * v₂) / (m₁ + m₂)) =
      m₁ * v₁ + m₂ * v₂ := by
  field_simp [hm]

def applyImpulse {n : ℕ} (p J : VecN n) : VecN n := p + J

theorem action_reaction_preserves_totalMomentum {n : ℕ}
    (p₁ p₂ J : VecN n) :
    applyImpulse p₁ J + applyImpulse p₂ (-J) = p₁ + p₂ := by
  ext i
  simp [applyImpulse]
  ring

theorem inelastic_collision_velocity_unique (m₁ m₂ v₁ v₂ v : ℝ)
    (hm : m₁ + m₂ ≠ 0)
    (h : (m₁ + m₂) * v = m₁ * v₁ + m₂ * v₂) :
    v = (m₁ * v₁ + m₂ * v₂) / (m₁ + m₂) := by
  apply (eq_div_iff hm).2
  simpa [mul_comm] using h

/-! ## 3. 以反对称张量表示角动量 -/

def wedge {n : ℕ} (r p : VecN n) : TwoForm n :=
  fun i j => r i * p j - r j * p i

def angularMomentum {n : ℕ} (r : VecN n) (m : ℝ)
    (v : VecN n) : TwoForm n :=
  wedge r (momentum m v)

theorem wedge_skew {n : ℕ} (r p : VecN n) (i j : Fin n) :
    wedge r p i j = -wedge r p j i := by
  simp [wedge]

theorem wedge_self {n : ℕ} (r : VecN n) : wedge r r = 0 := by
  ext i j
  simp [wedge]
  ring

theorem central_force_zero_torque {n : ℕ} (c : ℝ) (r : VecN n) :
    wedge r (c • r) = 0 := by
  ext i j
  simp [wedge]
  ring


/-! ### 3A. 角动量定理的微分形式

证明先对 `r ∧ p` 使用 Leibniz 乘积法则，再代入物理恒等式
`r' = v`、`p = m v` 与 `p' = F`。
-/

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

/-- 力矩定理：`d(r ∧ p)/dt = r ∧ F`。 -/
theorem angularMomentum_torque_theorem {n : ℕ} (m : ℝ)
    {r v : ℝ → VecN n} {a force : VecN n} {t : ℝ}
    (hr : HasDerivAt r (v t) t)
    (hv : HasDerivAt v a t)
    (hNewton : force = m • a) :
    HasDerivAt (fun s => angularMomentum (r s) m (v s))
      (wedge (r t) force) t := by
  have hp :
      HasDerivAt (fun s => momentum m (v s)) (momentum m a) t :=
    momentum_hasDerivAt m hv
  have hL := wedge_hasDerivAt hr hp
  have hparallel : wedge (v t) (momentum m (v t)) = 0 := by
    simpa [momentum] using central_force_zero_torque m (v t)
  rw [hparallel, zero_add] at hL
  rw [hNewton]
  simpa [angularMomentum, momentum] using hL

/-- 中心力使角动量的导数为零。 -/
theorem central_force_angularMomentum_hasDerivAt_zero {n : ℕ} (m c : ℝ)
    {r v : ℝ → VecN n} {a force : VecN n} {t : ℝ}
    (hr : HasDerivAt r (v t) t)
    (hv : HasDerivAt v a t)
    (hNewton : force = m • a)
    (hCentral : force = c • r t) :
    HasDerivAt (fun s => angularMomentum (r s) m (v s)) 0 t := by
  have hL := angularMomentum_torque_theorem m hr hv hNewton
  have hTorque : wedge (r t) force = 0 := by
    rw [hCentral]
    exact central_force_zero_torque c (r t)
  rw [hTorque] at hL
  exact hL


/-- 可微中心力轨迹的全局角动量守恒。结论给出任意两个时刻的角动量相等，而不只是
某一个时刻导数为零。 -/
theorem central_force_angularMomentum_conserved {n : ℕ} (m : ℝ)
    {r v a force : ℝ → VecN n}
    (hr : ∀ t, HasDerivAt r (v t) t)
    (hv : ∀ t, HasDerivAt v (a t) t)
    (hNewton : ∀ t, force t = m • a t)
    (hCentral : ∀ t, ∃ c : ℝ, force t = c • r t)
    (t₁ t₂ : ℝ) :
    angularMomentum (r t₁) m (v t₁) =
      angularMomentum (r t₂) m (v t₂) := by
  let L : ℝ → TwoForm n := fun t => angularMomentum (r t) m (v t)
  have hL : ∀ t, HasDerivAt L 0 t := by
    intro t
    obtain ⟨c, hc⟩ := hCentral t
    exact central_force_angularMomentum_hasDerivAt_zero
      m c (hr t) (hv t) (hNewton t) hc
  have hdiff : Differentiable ℝ L := by
    intro t
    apply differentiableAt_pi.mpr
    intro i
    apply differentiableAt_pi.mpr
    intro j
    have hij : HasDerivAt (fun s => L s i j) ((0 : TwoForm n) i j) t :=
      (hasDerivAt_pi.mp (hasDerivAt_pi.mp (hL t) i) j)
    exact hij.differentiableAt
  ext i j
  change L t₁ i j = L t₂ i j
  have hconst : (fun t => L t i j) t₁ = (fun t => L t i j) t₂ :=
    is_const_of_deriv_eq_zero
      (f := fun t => L t i j)
      (by
        intro t
        exact (hasDerivAt_pi.mp (hasDerivAt_pi.mp (hL t) i) j).differentiableAt)
      (by
        intro t
        simpa using (hasDerivAt_pi.mp (hasDerivAt_pi.mp (hL t) i) j).deriv)
      t₁ t₂
  exact hconst

theorem wedge_add_right {n : ℕ} (r p q : VecN n) :
    wedge r (p + q) = wedge r p + wedge r q := by
  ext i j
  simp [wedge]
  ring

theorem wedge_add_left {n : ℕ} (r s p : VecN n) :
    wedge (r + s) p = wedge r p + wedge s p := by
  ext i j
  simp [wedge]
  ring

def twoBodyAngularMomentumAt {n : ℕ}
    (origin r₁ r₂ p₁ p₂ : VecN n) : TwoForm n :=
  wedge (r₁ - origin) p₁ + wedge (r₂ - origin) p₂

theorem twoBodyAngularMomentum_origin_independent {n : ℕ}
    (o q r₁ r₂ p₁ p₂ : VecN n)
    (hMomentum : p₁ + p₂ = 0) :
    twoBodyAngularMomentumAt o r₁ r₂ p₁ p₂ =
      twoBodyAngularMomentumAt q r₁ r₂ p₁ p₂ := by
  ext i j
  have hi : p₂ i = -p₁ i := by
    have hcoord : p₁ i + p₂ i = 0 := by
      simpa using congrFun hMomentum i
    linarith
  have hj : p₂ j = -p₁ j := by
    have hcoord : p₁ j + p₂ j = 0 := by
      simpa using congrFun hMomentum j
    linarith
  simp [twoBodyAngularMomentumAt, wedge, hi, hj]
  ring

/-! ## 4. 功、动能与机械能 -/

def kineticEnergy (m speed : ℝ) : ℝ :=
  (1 / 2 : ℝ) * m * speed ^ 2


/-! ### 4A. 功—能定理的微分形式 -/

def kineticEnergyVec {n : ℕ} (m : ℝ) (v : VecN n) : ℝ :=
  (1 / 2 : ℝ) * m * dotProduct v v

theorem kineticEnergyVec_hasDerivAt {n : ℕ} (m : ℝ)
    {v : ℝ → VecN n} {a : VecN n} {t : ℝ}
    (hv : HasDerivAt v a t) :
    HasDerivAt (fun s => kineticEnergyVec m (v s))
      (m * dotProduct (v t) a) t := by
  have hdot := dotProduct_hasDerivAt hv hv
  have hscaled := HasDerivAt.const_mul ((1 / 2 : ℝ) * m) hdot
  unfold kineticEnergyVec
  convert hscaled using 1
  all_goals
    first
    | (rw [dotProduct_comm (v t) a]; ring)
    | rfl

/-- 瞬时功—能定理：`dT/dt = F · v`。 -/
theorem work_energy_power_theorem {n : ℕ} (m : ℝ)
    {v : ℝ → VecN n} {a force : VecN n} {t : ℝ}
    (hv : HasDerivAt v a t)
    (hNewton : force = m • a) :
    HasDerivAt (fun s => kineticEnergyVec m (v s))
      (dotProduct force (v t)) t := by
  have hK := kineticEnergyVec_hasDerivAt m hv
  convert hK using 1
  rw [hNewton, smul_dotProduct, dotProduct_comm a (v t)]
  simp

theorem constant_acceleration_work_energy (m v₀ v₁ a s : ℝ)
    (hv : v₁ ^ 2 = v₀ ^ 2 + 2 * a * s) :
    kineticEnergy m v₁ - kineticEnergy m v₀ = m * a * s := by
  rw [kineticEnergy, kineticEnergy, hv]
  ring

def mechanicalEnergy (kinetic potential : ℝ) : ℝ := kinetic + potential

theorem exchange_keeps_mechanical_energy
    (T₀ T₁ V₀ V₁ : ℝ) (h : T₁ - T₀ = -(V₁ - V₀)) :
    mechanicalEnergy T₁ V₁ = mechanicalEnergy T₀ V₀ := by
  simp [mechanicalEnergy]
  linarith

theorem kineticEnergy_nonneg (m speed : ℝ) (hm : 0 ≤ m) :
    0 ≤ kineticEnergy m speed := by
  unfold kineticEnergy
  exact mul_nonneg (mul_nonneg (by norm_num) hm) (sq_nonneg speed)

def dampingPower (c speed : ℝ) : ℝ := -(c * speed ^ 2)

theorem dampingPower_nonpos (c speed : ℝ) (hc : 0 ≤ c) :
    dampingPower c speed ≤ 0 := by
  unfold dampingPower
  exact neg_nonpos.mpr (mul_nonneg hc (sq_nonneg speed))

/-! ## 5. 质量矩阵、刚度矩阵与广义特征对 -/

abbrev Vec2 := ℝ × ℝ

def massAction (m : ℝ) (q : Vec2) : Vec2 :=
  (m * q.1, m * q.2)

def stiffnessAction (k : ℝ) (q : Vec2) : Vec2 :=
  (2 * k * q.1 - k * q.2, -k * q.1 + 2 * k * q.2)

def inPhaseMode : Vec2 := (1, 1)
def antiPhaseMode : Vec2 := (1, -1)

theorem inPhase_generalized_eigenpair (m k : ℝ) (hm : m ≠ 0) :
    stiffnessAction k inPhaseMode =
      massAction m ((k / m) • inPhaseMode) := by
  ext <;> simp [stiffnessAction, massAction, inPhaseMode]
  <;> field_simp [hm]
  <;> ring

theorem antiPhase_stiffness (k : ℝ) :
    stiffnessAction k antiPhaseMode = (3 * k) • antiPhaseMode := by
  ext <;> simp [stiffnessAction, antiPhaseMode]
  <;> ring

theorem antiPhase_generalized_eigenpair (m k : ℝ) (hm : m ≠ 0) :
    stiffnessAction k antiPhaseMode =
      massAction m (((3 * k) / m) • antiPhaseMode) := by
  ext <;> simp [stiffnessAction, massAction, antiPhaseMode]
  <;> field_simp [hm]
  <;> ring

def modeCoordinates (q : Vec2) : Vec2 :=
  ((q.1 + q.2) / 2, (q.1 - q.2) / 2)

theorem mode_decomposition (q : Vec2) :
    (modeCoordinates q).1 • inPhaseMode +
      (modeCoordinates q).2 • antiPhaseMode = q := by
  ext <;> simp [modeCoordinates, inPhaseMode, antiPhaseMode]
  <;> ring

def dot2 (q r : Vec2) : ℝ := q.1 * r.1 + q.2 * r.2

theorem normalModes_mass_orthogonal (m : ℝ) :
    dot2 inPhaseMode (massAction m antiPhaseMode) = 0 := by
  simp [dot2, inPhaseMode, antiPhaseMode, massAction]

def stiffnessEnergy (k : ℝ) (q : Vec2) : ℝ :=
  k * (q.1 ^ 2 - q.1 * q.2 + q.2 ^ 2)

theorem stiffnessEnergy_nonneg (k : ℝ) (q : Vec2) (hk : 0 ≤ k) :
    0 ≤ stiffnessEnergy k q := by
  have hcore : 0 ≤ q.1 ^ 2 - q.1 * q.2 + q.2 ^ 2 := by
    nlinarith [sq_nonneg (q.1 - q.2), sq_nonneg q.1, sq_nonneg q.2]
  exact mul_nonneg hk hcore

/-! ## 6. 惯性张量与 Euler 方程 -/

structure PrincipalInertia where
  I₁ : ℝ
  I₂ : ℝ
  I₃ : ℝ

def rotationalEnergy (I : PrincipalInertia) (ω₁ ω₂ ω₃ : ℝ) : ℝ :=
  (1 / 2 : ℝ) * (I.I₁ * ω₁ ^ 2 + I.I₂ * ω₂ ^ 2 + I.I₃ * ω₃ ^ 2)

def dumbbellIy (m a : ℝ) : ℝ := m * a ^ 2 + m * (-a) ^ 2

theorem dumbbell_Iy (m a : ℝ) : dumbbellIy m a = 2 * m * a ^ 2 := by
  unfold dumbbellIy
  ring

def normSq {n : ℕ} (r : VecN n) : ℝ :=
  ∑ i, (r i) ^ 2

def pointInertiaTensor {n : ℕ} (m : ℝ) (r : VecN n) : TwoForm n :=
  fun i j => m * ((if i = j then normSq r else 0) - r i * r j)

theorem pointInertiaTensor_symmetric {n : ℕ}
    (m : ℝ) (r : VecN n) (i j : Fin n) :
    pointInertiaTensor m r i j = pointInertiaTensor m r j i := by
  by_cases hij : i = j
  · subst j
    rfl
  · have hji : j ≠ i := Ne.symm hij
    simp only [pointInertiaTensor, hij, hji]
    ring

structure EulerResidual where
  first : ℝ
  second : ℝ
  third : ℝ

def eulerResidual (I : PrincipalInertia)
    (ω₁ ω₂ ω₃ α₁ α₂ α₃ τ₁ τ₂ τ₃ : ℝ) : EulerResidual where
  first := I.I₁ * α₁ + (I.I₃ - I.I₂) * ω₂ * ω₃ - τ₁
  second := I.I₂ * α₂ + (I.I₁ - I.I₃) * ω₃ * ω₁ - τ₂
  third := I.I₃ * α₃ + (I.I₂ - I.I₁) * ω₁ * ω₂ - τ₃

theorem principal_axis_free_rotation (I : PrincipalInertia) (ω : ℝ) :
    eulerResidual I ω 0 0 0 0 0 0 0 0 = ⟨0, 0, 0⟩ := by
  simp [eulerResidual]

theorem freeEuler_energy_rate_zero
    (I₁ I₂ I₃ ω₁ ω₂ ω₃ α₁ α₂ α₃ : ℝ)
    (h₁ : I₁ * α₁ + (I₃ - I₂) * ω₂ * ω₃ = 0)
    (h₂ : I₂ * α₂ + (I₁ - I₃) * ω₃ * ω₁ = 0)
    (h₃ : I₃ * α₃ + (I₂ - I₁) * ω₁ * ω₂ = 0) :
    I₁ * ω₁ * α₁ + I₂ * ω₂ * α₂ + I₃ * ω₃ * α₃ = 0 := by
  linear_combination ω₁ * h₁ + ω₂ * h₂ + ω₃ * h₃

theorem freeEuler_angularMomentumNorm_rate_zero
    (I₁ I₂ I₃ ω₁ ω₂ ω₃ α₁ α₂ α₃ : ℝ)
    (h₁ : I₁ * α₁ + (I₃ - I₂) * ω₂ * ω₃ = 0)
    (h₂ : I₂ * α₂ + (I₁ - I₃) * ω₃ * ω₁ = 0)
    (h₃ : I₃ * α₃ + (I₂ - I₁) * ω₁ * ω₂ = 0) :
    I₁ ^ 2 * ω₁ * α₁ + I₂ ^ 2 * ω₂ * α₂ +
      I₃ ^ 2 * ω₃ * α₃ = 0 := by
  linear_combination (I₁ * ω₁) * h₁ + (I₂ * ω₂) * h₂ +
    (I₃ * ω₃) * h₃


/-! ### 6A. 由真实导数表述的 Euler 方程与守恒律 -/

/-- 若角速度各分量确实具有导数 `αᵢ`，并满足自由刚体 Euler 方程，则转动能的导数为零。 -/
theorem freeEuler_rotationalEnergy_hasDerivAt_zero
    (I : PrincipalInertia)
    {ω₁ ω₂ ω₃ : ℝ → ℝ} {α₁ α₂ α₃ t : ℝ}
    (hω₁ : HasDerivAt ω₁ α₁ t)
    (hω₂ : HasDerivAt ω₂ α₂ t)
    (hω₃ : HasDerivAt ω₃ α₃ t)
    (h₁ : I.I₁ * α₁ + (I.I₃ - I.I₂) * ω₂ t * ω₃ t = 0)
    (h₂ : I.I₂ * α₂ + (I.I₁ - I.I₃) * ω₃ t * ω₁ t = 0)
    (h₃ : I.I₃ * α₃ + (I.I₂ - I.I₁) * ω₁ t * ω₂ t = 0) :
    HasDerivAt (fun s => rotationalEnergy I (ω₁ s) (ω₂ s) (ω₃ s)) 0 t := by
  have h₁sq := HasDerivAt.const_mul I.I₁ (hω₁.mul hω₁)
  have h₂sq := HasDerivAt.const_mul I.I₂ (hω₂.mul hω₂)
  have h₃sq := HasDerivAt.const_mul I.I₃ (hω₃.mul hω₃)
  have hsum := (h₁sq.add h₂sq).add h₃sq
  have henergy := HasDerivAt.const_mul (1 / 2 : ℝ) hsum
  have hderiv :
      (1 / 2 : ℝ) *
        (I.I₁ * (α₁ * ω₁ t + ω₁ t * α₁) +
          I.I₂ * (α₂ * ω₂ t + ω₂ t * α₂) +
          I.I₃ * (α₃ * ω₃ t + ω₃ t * α₃)) =
        I.I₁ * ω₁ t * α₁ + I.I₂ * ω₂ t * α₂ +
          I.I₃ * ω₃ t * α₃ := by
    ring
  rw [hderiv] at henergy
  have henergy' :
      HasDerivAt (fun s => rotationalEnergy I (ω₁ s) (ω₂ s) (ω₃ s))
        (I.I₁ * ω₁ t * α₁ + I.I₂ * ω₂ t * α₂ + I.I₃ * ω₃ t * α₃) t := by
    simpa only [rotationalEnergy, Pi.mul_apply, Pi.add_apply, pow_two]
      using henergy
  have hrate :
      I.I₁ * ω₁ t * α₁ + I.I₂ * ω₂ t * α₂ + I.I₃ * ω₃ t * α₃ = 0 :=
    freeEuler_energy_rate_zero I.I₁ I.I₂ I.I₃
      (ω₁ t) (ω₂ t) (ω₃ t) α₁ α₂ α₃ h₁ h₂ h₃
  rw [hrate] at henergy'
  exact henergy'


/-- 自由刚体转动能的全局守恒。 -/
theorem freeEuler_rotationalEnergy_conserved
    (I : PrincipalInertia)
    {ω₁ ω₂ ω₃ α₁ α₂ α₃ : ℝ → ℝ}
    (hω₁ : ∀ t, HasDerivAt ω₁ (α₁ t) t)
    (hω₂ : ∀ t, HasDerivAt ω₂ (α₂ t) t)
    (hω₃ : ∀ t, HasDerivAt ω₃ (α₃ t) t)
    (h₁ : ∀ t, I.I₁ * α₁ t + (I.I₃ - I.I₂) * ω₂ t * ω₃ t = 0)
    (h₂ : ∀ t, I.I₂ * α₂ t + (I.I₁ - I.I₃) * ω₃ t * ω₁ t = 0)
    (h₃ : ∀ t, I.I₃ * α₃ t + (I.I₂ - I.I₁) * ω₁ t * ω₂ t = 0)
    (t₁ t₂ : ℝ) :
    rotationalEnergy I (ω₁ t₁) (ω₂ t₁) (ω₃ t₁) =
      rotationalEnergy I (ω₁ t₂) (ω₂ t₂) (ω₃ t₂) := by
  let E : ℝ → ℝ := fun t => rotationalEnergy I (ω₁ t) (ω₂ t) (ω₃ t)
  have hE : ∀ t, HasDerivAt E 0 t := by
    intro t
    exact freeEuler_rotationalEnergy_hasDerivAt_zero I
      (hω₁ t) (hω₂ t) (hω₃ t) (h₁ t) (h₂ t) (h₃ t)
  have hdiff : Differentiable ℝ E := fun t => (hE t).differentiableAt
  have hderiv : ∀ t, deriv E t = 0 := fun t => (hE t).deriv
  exact is_const_of_deriv_eq_zero hdiff hderiv t₁ t₂

/-! ## 7. 达朗贝尔原理与 Lagrange 残差 -/

theorem dalembert_implies_newton (F m a : ℝ)
    (h : ∀ δ : ℝ, (F - m * a) * δ = 0) : F = m * a := by
  apply sub_eq_zero.mp
  simpa using h 1

def virtualPower {n : ℕ} (residual variation : VecN n) : ℝ :=
  dotProduct residual variation

theorem dalembert_iff_newton_vector {n : ℕ}
    (force acceleration : VecN n) (m : ℝ) :
    (∀ δ, virtualPower (force - m • acceleration) δ = 0) ↔
      force = m • acceleration := by
  constructor
  · intro h
    apply sub_eq_zero.mp
    apply (dotProduct_self_eq_zero
      (v := force - m • acceleration)).mp
    simpa [virtualPower] using h (force - m • acceleration)
  · intro h δ
    simp [virtualPower, h]

def eulerLagrangeResidual (dpdt dLdq nonconservativeForce : ℝ) : ℝ :=
  dpdt - dLdq - nonconservativeForce

theorem eulerLagrangeResidual_eq_zero_iff (dpdt dLdq Q : ℝ) :
    eulerLagrangeResidual dpdt dLdq Q = 0 ↔ dpdt - dLdq = Q := by
  simp [eulerLagrangeResidual, sub_eq_zero]

def harmonicEnergy (m k q v : ℝ) : ℝ :=
  (1 / 2 : ℝ) * m * v ^ 2 + (1 / 2 : ℝ) * k * q ^ 2

def harmonicEnergyRate (m k q v a : ℝ) : ℝ :=
  m * v * a + k * q * v

theorem harmonicEnergyRate_eq_zero
    (m k q v a : ℝ) (hMotion : m * a + k * q = 0) :
    harmonicEnergyRate m k q v a = 0 := by
  unfold harmonicEnergyRate
  linear_combination v * hMotion


/-! ### 7A. 以真实导数表述的 Lagrange 力学与能量守恒 -/

def harmonicLagrangian (m k q v : ℝ) : ℝ :=
  (1 / 2 : ℝ) * m * v ^ 2 - (1 / 2 : ℝ) * k * q ^ 2

section ScalarLagrangianCalculus

-- 实值导数命题统一使用 Mathlib 的赋范空间结构，从而避免在复合求导法则时混用
-- 外延相等但实例不同的代数 `ℝ`-模结构与分析 `ℝ`-模结构。
local instance : AddCommGroup ℝ := Real.normedAddCommGroup.toAddCommGroup
local instance : Module ℝ ℝ := RCLike.toInnerProductSpaceReal.toModule

/-- 把偏导数 `∂L/∂v = m v` 表述为真正的导数命题。 -/
theorem harmonicLagrangian_hasDerivAt_velocity
    (m k q v : ℝ) :
    HasDerivAt (fun w => harmonicLagrangian m k q w) (m * v) v := by
  have hsq := (hasDerivAt_id v).mul (hasDerivAt_id v)
  have hkin := hsq.mul_const ((1 / 2 : ℝ) * m)
  have hfull := hkin.sub
    (hasDerivAt_const v ((1 / 2 : ℝ) * k * q ^ 2))
  simp only [Pi.mul_apply, id_eq] at hfull
  have hderiv :
      (1 * v + v * 1) * ((1 / 2 : ℝ) * m) - 0 = m * v := by ring
  rw [hderiv] at hfull
  have hfun :
      ((fun y : ℝ => y * y * ((1 / 2 : ℝ) * m)) -
          fun _ : ℝ => (1 / 2 : ℝ) * k * q ^ 2) =
        (fun w => harmonicLagrangian m k q w) := by
    funext w
    simp only [harmonicLagrangian, Pi.sub_apply, pow_two]
    ring
  rw [hfun] at hfull
  exact hfull

/-- 把偏导数 `∂L/∂q = -k q` 表述为真正的导数命题。 -/
theorem harmonicLagrangian_hasDerivAt_position
    (m k q v : ℝ) :
    HasDerivAt (fun x => harmonicLagrangian m k x v) (-k * q) q := by
  have hsq := (hasDerivAt_id q).mul (hasDerivAt_id q)
  have hpot := hsq.mul_const ((1 / 2 : ℝ) * k)
  have hfull := (hasDerivAt_const q ((1 / 2 : ℝ) * m * v ^ 2)).sub hpot
  simp only [Pi.mul_apply, id_eq] at hfull
  have hderiv :
      0 - (1 * q + q * 1) * ((1 / 2 : ℝ) * k) = -k * q := by ring
  rw [hderiv] at hfull
  have hfun :
      ((fun _ : ℝ => (1 / 2 : ℝ) * m * v ^ 2) -
          fun y : ℝ => y * y * ((1 / 2 : ℝ) * k)) =
        (fun x => harmonicLagrangian m k x v) := by
    funext x
    simp only [harmonicLagrangian, Pi.sub_apply, pow_two]
    ring
  rw [hfun] at hfull
  exact hfull

/-- 对谐振子，Newton 方程等价于 Euler–Lagrange 关系
`d/dt(∂L/∂v) = ∂L/∂q`。 -/
theorem harmonic_eulerLagrange_equation
    (m k : ℝ) {q v : ℝ → ℝ} {a t : ℝ}
    (hv : HasDerivAt v a t)
    (hMotion : m * a + k * q t = 0) :
    HasDerivAt (fun s => m * v s) (-k * q t) t := by
  have hp := HasDerivAt.const_mul m hv
  have hma : m * a = -k * q t := by
    linarith
  rw [hma] at hp
  exact hp

/-- 真正的守恒量命题：若 `q' = v`、`v' = a` 且 `m a + k q = 0`，则机械能的
导数为零。 -/
theorem harmonicEnergy_hasDerivAt_zero
    (m k : ℝ) {q v : ℝ → ℝ} {a t : ℝ}
    (hq : HasDerivAt q (v t) t)
    (hv : HasDerivAt v a t)
    (hMotion : m * a + k * q t = 0) :
    HasDerivAt (fun s => harmonicEnergy m k (q s) (v s)) 0 t := by
  have hkin :
      HasDerivAt (fun s => (1 / 2 : ℝ) * m * (v s) ^ 2)
        (m * v t * a) t := by
    have hscaled := (hv.mul hv).mul_const ((1 / 2 : ℝ) * m)
    have hderiv :
        (a * v t + v t * a) * ((1 / 2 : ℝ) * m) =
          m * v t * a := by ring
    rw [hderiv] at hscaled
    simp only [Pi.mul_apply] at hscaled
    have hfun :
        (fun s => v s * v s * ((1 / 2 : ℝ) * m)) =
          (fun s => (1 / 2 : ℝ) * m * (v s) ^ 2) := by
      funext s
      simp only [pow_two]
      ring
    rw [hfun] at hscaled
    exact hscaled
  have hpot :
      HasDerivAt (fun s => (1 / 2 : ℝ) * k * (q s) ^ 2)
        (k * q t * v t) t := by
    have hscaled := (hq.mul hq).mul_const ((1 / 2 : ℝ) * k)
    have hderiv :
        (v t * q t + q t * v t) * ((1 / 2 : ℝ) * k) =
          k * q t * v t := by ring
    rw [hderiv] at hscaled
    simp only [Pi.mul_apply] at hscaled
    have hfun :
        (fun s => q s * q s * ((1 / 2 : ℝ) * k)) =
          (fun s => (1 / 2 : ℝ) * k * (q s) ^ 2) := by
      funext s
      simp only [pow_two]
      ring
    rw [hfun] at hscaled
    exact hscaled
  have hsum := hkin.add hpot
  have hrate : m * v t * a + k * q t * v t = 0 := by
    linear_combination (v t) * hMotion
  have hfun :
      ((fun s => (1 / 2 : ℝ) * m * (v s) ^ 2) +
          fun s => (1 / 2 : ℝ) * k * (q s) ^ 2) =
        (fun s => harmonicEnergy m k (q s) (v s)) := by
    funext s
    simp only [harmonicEnergy, Pi.add_apply]
  rw [hfun, hrate] at hsum
  exact hsum


/-- 由逐点导数定理与中值定理推出谐振子能量的全局守恒。 -/
theorem harmonicEnergy_conserved
    (m k : ℝ) {q v a : ℝ → ℝ}
    (hq : ∀ t, HasDerivAt q (v t) t)
    (hv : ∀ t, HasDerivAt v (a t) t)
    (hMotion : ∀ t, m * a t + k * q t = 0)
    (t₁ t₂ : ℝ) :
    harmonicEnergy m k (q t₁) (v t₁) =
      harmonicEnergy m k (q t₂) (v t₂) := by
  let E : ℝ → ℝ := fun t => harmonicEnergy m k (q t) (v t)
  have hE : ∀ t, HasDerivAt E 0 t := by
    intro t
    exact harmonicEnergy_hasDerivAt_zero m k (hq t) (hv t) (hMotion t)
  have hdiff : Differentiable ℝ E := fun t => (hE t).differentiableAt
  have hderiv : ∀ t, deriv E t = 0 := fun t => (hE t).deriv
  exact is_const_of_deriv_eq_zero hdiff hderiv t₁ t₂

end ScalarLagrangianCalculus

/-! ## 8. 中心力约化与 Kepler 圆锥轨道的代数核心 -/

structure RegularKeplerData where
  mass : ℝ
  gravitationalParameter : ℝ
  angularMomentum : ℝ
  radius : ℝ → ℝ

def RegularKeplerData.Valid (o : RegularKeplerData) : Prop :=
  o.mass > 0 ∧
  o.gravitationalParameter > 0 ∧
  o.angularMomentum ≠ 0 ∧
  ∀ t, o.radius t > 0

def conicRadius (p e θ : ℝ) : ℝ := p / (1 + e * Real.cos θ)

theorem conicRadius_characterization (p e θ : ℝ)
    (h : 1 + e * Real.cos θ ≠ 0) :
    conicRadius p e θ * (1 + e * Real.cos θ) = p := by
  rw [conicRadius]
  exact div_mul_cancel₀ p h

@[simp] theorem conicRadius_zero (p e : ℝ) :
    conicRadius p e 0 = p / (1 + e) := by
  simp [conicRadius]

@[simp] theorem conicRadius_pi (p e : ℝ) :
    conicRadius p e Real.pi = p / (1 - e) := by
  simp [conicRadius, sub_eq_add_neg]

theorem ellipse_has_negative_energy (E e β : ℝ)
    (hβ : 0 < β) (he : e ^ 2 < 1)
    (hE : E = (e ^ 2 - 1) / β) : E < 0 := by
  rw [hE]
  exact div_neg_of_neg_of_pos (sub_neg.mpr he) hβ

theorem parabola_has_zero_energy (E e β : ℝ)
    (_hβ : β ≠ 0) (he : e ^ 2 = 1)
    (hE : E = (e ^ 2 - 1) / β) : E = 0 := by
  rw [hE, he]
  simp

theorem hyperbola_has_positive_energy (E e β : ℝ)
    (hβ : 0 < β) (he : 1 < e ^ 2)
    (hE : E = (e ^ 2 - 1) / β) : 0 < E := by
  rw [hE]
  exact div_pos (sub_pos.mpr he) hβ

theorem kepler_third_law_from_area_and_ellipse
    (m μ a b h T : ℝ)
    (hh : h ≠ 0)
    (hArea : T * h = 2 * m * Real.pi * a * b)
    (hAngular : h ^ 2 * a = m ^ 2 * μ * b ^ 2) :
    T ^ 2 * μ = 4 * Real.pi ^ 2 * a ^ 3 := by
  have hT : T = (2 * m * Real.pi * a * b) / h := by
    exact (eq_div_iff hh).2 hArea
  rw [hT]
  calc
    ((2 * m * Real.pi * a * b) / h) ^ 2 * μ =
        (4 * Real.pi ^ 2 * a ^ 2 * (m ^ 2 * μ * b ^ 2)) /
          h ^ 2 := by
      field_simp [hh]
      ring
    _ = (4 * Real.pi ^ 2 * a ^ 2 * (h ^ 2 * a)) / h ^ 2 := by
      rw [← hAngular]
    _ = 4 * Real.pi ^ 2 * a ^ 3 := by
      field_simp [hh]

end LeanPath.Dynamics

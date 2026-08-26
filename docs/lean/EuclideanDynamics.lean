import Mathlib

noncomputable section

namespace LeanPath.Dynamics

abbrev VecN (n : ℕ) := Fin n → ℝ
abbrev TwoForm (n : ℕ) := Matrix (Fin n) (Fin n) ℝ

/-! ## 1. Kinematics and Newton's equation -/

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

/-! ## 2. Momentum and impulse -/

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

/-! ## 3. Angular momentum as an antisymmetric tensor -/

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

/-! ## 4. Work, kinetic energy and mechanical energy -/

def kineticEnergy (m speed : ℝ) : ℝ :=
  (1 / 2 : ℝ) * m * speed ^ 2

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

/-! ## 5. Mass, stiffness and a generalized eigenpair -/

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

/-! ## 6. Inertia tensor and Euler equations -/

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

/-! ## 7. D'Alembert and Lagrange residuals -/

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

/-! ## 8. Central force reduction and the Kepler conic core -/

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

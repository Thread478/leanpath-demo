/-!
# LeanPath Physics: Euclidean dynamics

This file is the final exhibit for Unit III.  It deliberately separates two
layers:

* transparent finite-dimensional definitions used by the course;
* algebraic lemmas that Mathlib can check without hiding the physical model.

The trajectory derivative operators below are explicit arguments.  A complete
ODE development would additionally choose a differentiability API and prove
existence, uniqueness, maximal interval and collision-avoidance results.  The
Kepler section therefore formalizes the conservation/conic algebraic core under
regular non-collision assumptions; it does not claim that every initial-value
problem has already been constructed here.
-/

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
  field_simp [impulse, hm]
  <;> ring

theorem inelastic_collision_velocity (m₁ m₂ v₁ v₂ : ℝ)
    (hm : m₁ + m₂ ≠ 0) :
    (m₁ + m₂) * ((m₁ * v₁ + m₂ * v₂) / (m₁ + m₂)) =
      m₁ * v₁ + m₂ * v₂ := by
  field_simp [hm]

/-! ## 3. Angular momentum as an antisymmetric tensor -/

def wedge {n : ℕ} (r p : VecN n) : TwoForm n :=
  fun i j => r i * p j - r j * p i

def angularMomentum {n : ℕ} (r : VecN n) (m : ℝ)
    (v : VecN n) : TwoForm n :=
  wedge r (momentum m v)

theorem wedge_skew {n : ℕ} (r p : VecN n) (i j : Fin n) :
    wedge r p i j = -wedge r p j i := by
  simp [wedge]
  ring

theorem wedge_self {n : ℕ} (r : VecN n) : wedge r r = 0 := by
  ext i j
  simp [wedge]

theorem central_force_zero_torque {n : ℕ} (c : ℝ) (r : VecN n) :
    wedge r (c • r) = 0 := by
  ext i j
  simp [wedge]
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

theorem antiPhase_stiffness (k : ℝ) :
    stiffnessAction k antiPhaseMode = (3 * k) • antiPhaseMode := by
  ext <;> simp [stiffnessAction, antiPhaseMode]
  <;> ring

/-! ## 6. Inertia tensor and Euler equations -/

structure PrincipalInertia where
  I₁ : ℝ
  I₂ : ℝ
  I₃ : ℝ

def rotationalEnergy (I : PrincipalInertia) (ω₁ ω₂ ω₃ : ℝ) : ℝ :=
  (1 / 2 : ℝ) * (I.I₁ * ω₁ ^ 2 + I.I₂ * ω₂ ^ 2 + I.I₃ * ω₃ ^ 2)

def dumbbellIy (m a : ℝ) : ℝ := m * a ^ 2 + m * (-a) ^ 2

theorem dumbbell_Iy (m a : ℝ) : dumbbellIy m a = 2 * m * a ^ 2 := by
  simp [dumbbellIy]
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
  ext <;> simp [eulerResidual]

/-! ## 7. D'Alembert and Lagrange residuals -/

theorem dalembert_implies_newton (F m a : ℝ)
    (h : ∀ δ : ℝ, (F - m * a) * δ = 0) : F = m * a := by
  apply sub_eq_zero.mp
  simpa using h 1

def eulerLagrangeResidual (dpdt dLdq nonconservativeForce : ℝ) : ℝ :=
  dpdt - dLdq - nonconservativeForce

theorem eulerLagrangeResidual_eq_zero_iff (dpdt dLdq Q : ℝ) :
    eulerLagrangeResidual dpdt dLdq Q = 0 ↔ dpdt - dLdq = Q := by
  simp [eulerLagrangeResidual, sub_eq_zero]

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
  field_simp [conicRadius, h]

theorem ellipse_has_negative_energy (E e β : ℝ)
    (hβ : 0 < β) (he : e ^ 2 < 1)
    (hE : E = (e ^ 2 - 1) / β) : E < 0 := by
  rw [hE]
  exact div_neg_of_neg_of_pos (sub_neg.mpr he) hβ

theorem parabola_has_zero_energy (E e β : ℝ)
    (hβ : β ≠ 0) (he : e ^ 2 = 1)
    (hE : E = (e ^ 2 - 1) / β) : E = 0 := by
  rw [hE, he]
  simp

theorem hyperbola_has_positive_energy (E e β : ℝ)
    (hβ : 0 < β) (he : 1 < e ^ 2)
    (hE : E = (e ^ 2 - 1) / β) : 0 < E := by
  rw [hE]
  exact div_pos (sub_pos.mpr he) hβ

end LeanPath.Dynamics

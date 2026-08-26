import Mathlib
import Physlib.Units.WithDim.Speed

/-!
# LeanPath Physics: units and dimensions

This file is the complete chapter-one exhibit.  It builds a small transparent
model of SI dimensions and dimension-indexed quantities, proves the most useful
dimension identities, and finally connects the model to a theorem originating
in PhysLean and now maintained in the merged Physlib project.
-/

namespace LeanPathPhysics

/-- The seven base quantities of the International System of Quantities. -/
inductive BaseDimension where
  | time
  | length
  | mass
  | electricCurrent
  | temperature
  | amountOfSubstance
  | luminousIntensity
  deriving DecidableEq, Repr

/-- The coherent SI unit symbol attached to each base quantity. -/
def baseUnitSymbol : BaseDimension → String
  | .time => "s"
  | .length => "m"
  | .mass => "kg"
  | .electricCurrent => "A"
  | .temperature => "K"
  | .amountOfSubstance => "mol"
  | .luminousIntensity => "cd"

/-- A dimension is the integer exponent of every SI base dimension. -/
structure Dimension where
  exponent : BaseDimension → ℤ

namespace Dimension

/-- Two dimensions are equal when all seven exponents are equal. -/
@[ext]
theorem ext (d₁ d₂ : Dimension)
    (h : ∀ b, d₁.exponent b = d₂.exponent b) : d₁ = d₂ := by
  cases d₁ with
  | mk e₁ =>
    cases d₂ with
    | mk e₂ =>
      have he : e₁ = e₂ := funext h
      cases he
      rfl

/-- The dimensionless dimension. -/
instance : One Dimension where
  one := ⟨fun _ => 0⟩

/-- Multiplying dimensions adds their exponent vectors. -/
instance : Mul Dimension where
  mul d₁ d₂ := ⟨fun b => d₁.exponent b + d₂.exponent b⟩

/-- Inverting a dimension negates every exponent. -/
instance : Inv Dimension where
  inv d := ⟨fun b => -d.exponent b⟩

/-- Dividing dimensions subtracts exponent vectors. -/
instance : Div Dimension where
  div d₁ d₂ := d₁ * d₂⁻¹

/-- Integer powers multiply every exponent by the power. -/
instance : HPow Dimension ℤ Dimension where
  hPow d n := ⟨fun b => n * d.exponent b⟩

@[simp] theorem exponent_one (b) : (1 : Dimension).exponent b = 0 := rfl
@[simp] theorem exponent_mul (d₁ d₂ : Dimension) (b) :
    (d₁ * d₂).exponent b = d₁.exponent b + d₂.exponent b := rfl
@[simp] theorem exponent_inv (d : Dimension) (b) :
    (d⁻¹).exponent b = -d.exponent b := rfl
@[simp] theorem exponent_div (d₁ d₂ : Dimension) (b) :
    (d₁ / d₂).exponent b = d₁.exponent b - d₂.exponent b := by
  change d₁.exponent b + -d₂.exponent b =
    d₁.exponent b - d₂.exponent b
  exact (sub_eq_add_neg _ _).symm
@[simp] theorem exponent_zpow (d : Dimension) (n : ℤ) (b) :
    (d ^ n).exponent b = n * d.exponent b := rfl

/-- Dimension multiplication is associative. -/
theorem mul_assoc (a b c : Dimension) : (a * b) * c = a * (b * c) := by
  ext i
  simp [Int.add_assoc]

/-- Dimension multiplication is commutative. -/
theorem mul_comm (a b : Dimension) : a * b = b * a := by
  ext i
  simp [Int.add_comm]

/-- The zero exponent vector is a multiplicative identity. -/
theorem one_mul (a : Dimension) : 1 * a = a := by
  ext i
  simp

/-- Every dimension cancels its inverse. -/
theorem inv_mul (a : Dimension) : a⁻¹ * a = 1 := by
  ext i
  simp

/-- The basis dimension associated with one SI base quantity. -/
def basis (b : BaseDimension) : Dimension :=
  ⟨fun i => if i = b then 1 else 0⟩

@[simp] theorem basis_same (b) : (basis b).exponent b = 1 := by
  simp [basis]

@[simp] theorem basis_other (b i) (h : i ≠ b) :
    (basis b).exponent i = 0 := by
  simp [basis, h]

end Dimension

open BaseDimension
open _root_.LeanPathPhysics.Dimension

/-! ## SI base dimensions -/

def timeDim : Dimension := basis .time
def lengthDim : Dimension := basis .length
def massDim : Dimension := basis .mass
def currentDim : Dimension := basis .electricCurrent
def temperatureDim : Dimension := basis .temperature
def amountDim : Dimension := basis .amountOfSubstance
def luminousIntensityDim : Dimension := basis .luminousIntensity
def dimensionless : Dimension := 1

/-! ## Frequently used derived dimensions -/

def areaDim : Dimension := lengthDim ^ (2 : ℤ)
def volumeDim : Dimension := lengthDim ^ (3 : ℤ)
def frequencyDim : Dimension := 1 / timeDim
def speedDim : Dimension := lengthDim / timeDim
def accelerationDim : Dimension := speedDim / timeDim
def forceDim : Dimension := massDim * accelerationDim
def energyDim : Dimension := forceDim * lengthDim
def powerDim : Dimension := energyDim / timeDim
def pressureDim : Dimension := forceDim / areaDim
def chargeDim : Dimension := currentDim * timeDim
def voltageDim : Dimension := energyDim / chargeDim

/-! ## Dimension identities behind familiar physical equations -/

theorem speed_mul_time : speedDim * timeDim = lengthDim := by
  ext b
  cases b <;> rfl

theorem acceleration_mul_time : accelerationDim * timeDim = speedDim := by
  ext b
  cases b <;> rfl

theorem mass_mul_acceleration : massDim * accelerationDim = forceDim := by
  rfl

theorem force_mul_length : forceDim * lengthDim = energyDim := by
  rfl

theorem kinetic_energy_dimension :
    massDim * speedDim ^ (2 : ℤ) = energyDim := by
  ext b
  cases b <;> rfl

theorem charge_mul_voltage : chargeDim * voltageDim = energyDim := by
  ext b
  cases b <;> rfl

theorem pressure_mul_volume : pressureDim * volumeDim = energyDim := by
  ext b
  cases b <;> rfl

/-! ## Dimension-indexed physical quantities -/

/-- `Quantity d` contains a real magnitude whose dimension is fixed by its type. -/
structure Quantity (d : Dimension) where
  value : ℝ

namespace Quantity

/-- Addition is available only for two quantities of the same dimension. -/
def add {d : Dimension} (x y : Quantity d) : Quantity d :=
  ⟨x.value + y.value⟩

/-- Negation preserves dimension. -/
def neg {d : Dimension} (x : Quantity d) : Quantity d :=
  ⟨-x.value⟩

/-- Subtraction is available only at one fixed dimension. -/
def sub {d : Dimension} (x y : Quantity d) : Quantity d :=
  ⟨x.value - y.value⟩

/-- Multiplication computes the product dimension in its return type. -/
def mul {d₁ d₂ : Dimension} (x : Quantity d₁) (y : Quantity d₂) :
    Quantity (d₁ * d₂) :=
  ⟨x.value * y.value⟩

/-- Division computes the quotient dimension in its return type. -/
noncomputable def div {d₁ d₂ : Dimension} (x : Quantity d₁) (y : Quantity d₂) :
    Quantity (d₁ / d₂) :=
  ⟨x.value / y.value⟩

/-- Multiplication by a pure number does not change dimension. -/
def scale {d : Dimension} (c : ℝ) (x : Quantity d) : Quantity d :=
  ⟨c * x.value⟩

@[simp] theorem add_value {d} (x y : Quantity d) :
    (add x y).value = x.value + y.value := rfl
@[simp] theorem mul_value {d₁ d₂} (x : Quantity d₁) (y : Quantity d₂) :
    (mul x y).value = x.value * y.value := rfl
@[simp] theorem scale_value {d} (c : ℝ) (x : Quantity d) :
    (scale c x).value = c * x.value := rfl

end Quantity

/-! ## Units as representations of one dimension -/

/-- A linear unit selects a scale relative to a coherent SI unit.

For example, one kilometre has scale `1000` relative to one metre.  Keeping the
dimension in the type prevents converting a length with a time unit.
-/
structure LinearUnit (d : Dimension) where
  symbol : String
  scaleToSI : ℝ

namespace LinearUnit

/-- Express a magnitude written in `u` as a coherent SI magnitude. -/
def toSI {d : Dimension} (u : LinearUnit d) (value : ℝ) : ℝ :=
  value * u.scaleToSI

/-- Express a coherent SI magnitude in `u`. -/
noncomputable def fromSI {d : Dimension} (u : LinearUnit d) (value : ℝ) : ℝ :=
  value / u.scaleToSI

/-- Convert between two units of the same dimension. -/
noncomputable def convert {d : Dimension} (source target : LinearUnit d)
    (value : ℝ) : ℝ :=
  target.fromSI (source.toSI value)

theorem toSI_convert {d : Dimension} (source target : LinearUnit d)
    (value : ℝ) (hto : target.scaleToSI ≠ 0) :
    target.toSI (convert source target value) = source.toSI value := by
  simp [convert, fromSI, toSI, hto]

end LinearUnit

/-- An affine unit additionally records a zero-point offset.

This is needed for absolute Celsius temperatures.  It must not be replaced by a
plain scale factor; temperature differences are a separate linear use case.
-/
structure AffineUnit (d : Dimension) where
  symbol : String
  scaleToSI : ℝ
  offsetToSI : ℝ

namespace AffineUnit

def toSI {d : Dimension} (u : AffineUnit d) (value : ℝ) : ℝ :=
  value * u.scaleToSI + u.offsetToSI

end AffineUnit

/-- A unit system chooses one nonzero scale for every SI base quantity. -/
structure UnitSystem where
  name : String
  baseScaleToSI : BaseDimension → ℝ
  scale_ne_zero : ∀ b, baseScaleToSI b ≠ 0

/-- The coherent SI system uses scale one for every base quantity. -/
def siUnitSystem : UnitSystem where
  name := "SI"
  baseScaleToSI := fun _ => 1
  scale_ne_zero := by
    intro b
    norm_num

/-! ## The seven coherent SI base units -/

def second : Quantity timeDim := ⟨1⟩
def meter : Quantity lengthDim := ⟨1⟩
def kilogram : Quantity massDim := ⟨1⟩
def ampere : Quantity currentDim := ⟨1⟩
def kelvin : Quantity temperatureDim := ⟨1⟩
def mole : Quantity amountDim := ⟨1⟩
def candela : Quantity luminousIntensityDim := ⟨1⟩

def metreUnit : LinearUnit lengthDim := ⟨"m", 1⟩
def kilometreUnit : LinearUnit lengthDim := ⟨"km", 1000⟩
noncomputable def centimetreUnit : LinearUnit lengthDim := ⟨"cm", 1 / 100⟩
def secondUnit : LinearUnit timeDim := ⟨"s", 1⟩
def hourUnit : LinearUnit timeDim := ⟨"h", 3600⟩
def metrePerSecondUnit : LinearUnit speedDim := ⟨"m/s", 1⟩
noncomputable def kilometrePerHourUnit : LinearUnit speedDim := ⟨"km/h", 5 / 18⟩

/-- Absolute degrees Celsius form an affine scale relative to kelvin. -/
def degreeCelsius : AffineUnit temperatureDim := ⟨"°C", 1, 273.15⟩

theorem zero_celsius_in_kelvin : degreeCelsius.toSI 0 = 273.15 := by
  norm_num [degreeCelsius, AffineUnit.toSI]

theorem celsius_temperature_difference (a b : ℝ) :
    degreeCelsius.toSI a - degreeCelsius.toSI b = a - b := by
  simp only [AffineUnit.toSI, degreeCelsius]
  ring

theorem three_square_kilometres_in_square_metres :
    (3 : ℝ) * kilometreUnit.scaleToSI ^ 2 = 3_000_000 := by
  norm_num [kilometreUnit]

/-! ## Scaled units and an exact conversion theorem -/

def kilometer : Quantity lengthDim := ⟨1000⟩
def hour : Quantity timeDim := ⟨3600⟩

noncomputable def meterPerSecond : Quantity speedDim :=
  Quantity.div meter second

noncomputable def kilometerPerHour : Quantity speedDim :=
  Quantity.div kilometer hour

theorem thirtySix_kilometers_per_hour :
    (Quantity.scale 36 kilometerPerHour).value =
      (Quantity.scale 10 meterPerSecond).value := by
  norm_num [Quantity.scale, kilometerPerHour, meterPerSecond,
    Quantity.div, kilometer, hour, meter, second]


/-! ## Structural dimensional analysis: integer nullspaces and Π groups -/

namespace DimensionalAnalysis

/-- Mass density has dimension `M L⁻³`. -/
def densityDim : Dimension := massDim / volumeDim

/-- Dynamic viscosity has dimension `M L⁻¹ T⁻¹ = pressure × time`. -/
def dynamicViscosityDim : Dimension := pressureDim * timeDim

/-- The dimension of a monomial `T^a L^b g^c` built from period, length,
and acceleration.  Integer exponents are enough to capture the squared-period
form of the elementary pendulum Π group. -/
def pendulumMonomialDim (a b c : ℤ) : Dimension :=
  timeDim ^ a * lengthDim ^ b * accelerationDim ^ c

/-- A pendulum monomial is dimensionless exactly when its time and length
exponents satisfy the two linear balance equations.  This is the dimensional
matrix written as an exact theorem rather than as an informal table. -/
theorem pendulumMonomial_dimensionless_iff (a b c : ℤ) :
    pendulumMonomialDim a b c = dimensionless ↔
      a - 2 * c = 0 ∧ b + c = 0 := by
  constructor
  · intro h
    have ht := congrArg (fun d : Dimension => d.exponent .time) h
    have hl := congrArg (fun d : Dimension => d.exponent .length) h
    simp [pendulumMonomialDim, dimensionless, accelerationDim, speedDim,
      timeDim, lengthDim, Dimension.basis] at ht hl
    constructor <;> omega
  · rintro ⟨ht, hl⟩
    ext d
    cases d <;>
      simp [pendulumMonomialDim, dimensionless, accelerationDim, speedDim,
        timeDim, lengthDim, Dimension.basis] <;> omega

/-- The integer nullspace for `(T,L,g)` is one-dimensional: every
integer-exponent dimensionless monomial is a power of `T² g / L`. -/
theorem pendulum_dimensionless_iff_multiple (a b c : ℤ) :
    pendulumMonomialDim a b c = dimensionless ↔
      ∃ k : ℤ, a = 2 * k ∧ b = -k ∧ c = k := by
  rw [pendulumMonomial_dimensionless_iff]
  constructor
  · rintro ⟨ht, hl⟩
    refine ⟨c, ?_, ?_, rfl⟩ <;> omega
  · rintro ⟨k, rfl, rfl, rfl⟩
    constructor <;> ring

/-- The canonical squared-period Π group `T² g / L` is dimensionless. -/
theorem pendulumPiSquared_dimensionless :
    pendulumMonomialDim 2 (-1) 1 = dimensionless := by
  rw [pendulum_dimensionless_iff_multiple]
  exact ⟨1, by norm_num, by norm_num, by norm_num⟩

/-- The dimension of a monomial `ρ^a v^b L^c μ^d`. -/
def reynoldsMonomialDim (a b c d : ℤ) : Dimension :=
  densityDim ^ a * speedDim ^ b * lengthDim ^ c * dynamicViscosityDim ^ d

/-- The Reynolds dimensional matrix: mass, time and length balance give three
independent integer equations. -/
theorem reynoldsMonomial_dimensionless_iff (a b c d : ℤ) :
    reynoldsMonomialDim a b c d = dimensionless ↔
      a + d = 0 ∧ -b - d = 0 ∧ -3 * a + b + c - d = 0 := by
  constructor
  · intro h
    have hm := congrArg (fun q : Dimension => q.exponent .mass) h
    have ht := congrArg (fun q : Dimension => q.exponent .time) h
    have hl := congrArg (fun q : Dimension => q.exponent .length) h
    simp [reynoldsMonomialDim, densityDim, dynamicViscosityDim,
      dimensionless, pressureDim, forceDim, accelerationDim, speedDim,
      areaDim, volumeDim, massDim, lengthDim, timeDim, Dimension.basis] at hm ht hl
    constructor
    · omega
    · constructor <;> omega
  · rintro ⟨hm, ht, hl⟩
    ext q
    cases q <;>
      simp [reynoldsMonomialDim, densityDim, dynamicViscosityDim,
        dimensionless, pressureDim, forceDim, accelerationDim, speedDim,
        areaDim, volumeDim, massDim, lengthDim, timeDim, Dimension.basis] <;> omega

/-- The integer nullspace for `(ρ,v,L,μ)` is one-dimensional.  Thus every
integer-exponent dimensionless monomial is a power of the Reynolds number
`ρ v L / μ`. -/
theorem reynolds_dimensionless_iff_multiple (a b c d : ℤ) :
    reynoldsMonomialDim a b c d = dimensionless ↔
      ∃ k : ℤ, a = k ∧ b = k ∧ c = k ∧ d = -k := by
  rw [reynoldsMonomial_dimensionless_iff]
  constructor
  · rintro ⟨hm, ht, hl⟩
    refine ⟨a, rfl, ?_, ?_, ?_⟩ <;> omega
  · rintro ⟨k, rfl, rfl, rfl, rfl⟩
    constructor
    · ring
    · constructor <;> ring

/-- The usual Reynolds number `ρ v L / μ` is dimensionless. -/
theorem reynoldsNumber_dimensionless :
    reynoldsMonomialDim 1 1 1 (-1) = dimensionless := by
  rw [reynolds_dimensionless_iff_multiple]
  exact ⟨1, rfl, rfl, rfl, by norm_num⟩

end DimensionalAnalysis

/-! ## Conversion maps form a coherent groupoid on nondegenerate units -/

namespace LinearUnit

/-- Converting a value from a nondegenerate unit back to itself changes
nothing. -/
theorem convert_self {d : Dimension} (u : LinearUnit d) (value : ℝ)
    (hu : u.scaleToSI ≠ 0) :
    convert u u value = value := by
  unfold convert fromSI toSI
  field_simp [hu]

/-- Unit conversion composes transitively: an intermediate nonzero unit scale
cancels exactly. -/
theorem convert_trans {d : Dimension} (source middle target : LinearUnit d)
    (value : ℝ) (hmiddle : middle.scaleToSI ≠ 0) :
    convert middle target (convert source middle value) =
      convert source target value := by
  unfold convert fromSI toSI
  rw [div_mul_cancel₀ (value * source.scaleToSI) hmiddle]

/-- Conversion along two nondegenerate units is reversible. -/
theorem convert_roundtrip {d : Dimension} (source target : LinearUnit d)
    (value : ℝ) (hsource : source.scaleToSI ≠ 0)
    (htarget : target.scaleToSI ≠ 0) :
    convert target source (convert source target value) = value := by
  rw [convert_trans source target source value htarget]
  exact convert_self source value hsource

/-- Two coordinate descriptions related by unit conversion represent the same
SI magnitude; conversely, for a nonzero target scale this relation determines
the converted coordinate uniquely. -/
theorem convert_characterization {d : Dimension}
    (source target : LinearUnit d) (x y : ℝ)
    (htarget : target.scaleToSI ≠ 0) :
    convert source target x = y ↔
      source.toSI x = target.toSI y := by
  constructor
  · intro h
    rw [← h]
    exact (toSI_convert source target x htarget).symm
  · intro h
    unfold convert fromSI
    rw [h]
    unfold toSI
    field_simp [htarget]

end LinearUnit

/-! ## Bridge from the PhysLean lineage to current Physlib -/

open LTMCTUnitChoices

/--
This conversion originated in the PhysLean line of work and is available under
the current `Physlib.*` module path after the Physlib/QuantumInfo merger.
-/
example : DimSpeed.oneKilometerPerHour SI = ⟨5 / 18⟩ := by
  exact DimSpeed.oneKilometerPerHour_in_SI

end LeanPathPhysics

import Mathlib
import Physlib.Units.WithDim.Speed

/-!
# LeanPath Physics：单位与量纲

本文件是第一单元的完整成果。内容从透明的 SI 量纲模型出发，构造以量纲为类型指标的
物理量，证明常用量纲恒等式与单位换算定理，并在最后连接源自 PhysLean、现由合并后
Physlib 项目维护的换算定理。
-/

namespace LeanPathPhysics

/-- 国际量制（ISQ）的七个基本量。 -/
inductive BaseDimension where
  | time
  | length
  | mass
  | electricCurrent
  | temperature
  | amountOfSubstance
  | luminousIntensity
  deriving DecidableEq, Repr

/-- 每个基本量对应的 SI 一贯单位符号。 -/
def baseUnitSymbol : BaseDimension → String
  | .time => "s"
  | .length => "m"
  | .mass => "kg"
  | .electricCurrent => "A"
  | .temperature => "K"
  | .amountOfSubstance => "mol"
  | .luminousIntensity => "cd"

/-- 量纲由七个 SI 基本量纲的整数指数共同确定。 -/
structure Dimension where
  exponent : BaseDimension → ℤ

namespace Dimension

/-- 若两个量纲的七个指数逐项相等，则这两个量纲相等。 -/
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

/-- 无量纲量对应的零指数向量。 -/
instance : One Dimension where
  one := ⟨fun _ => 0⟩

/-- 量纲相乘对应指数向量相加。 -/
instance : Mul Dimension where
  mul d₁ d₂ := ⟨fun b => d₁.exponent b + d₂.exponent b⟩

/-- 量纲取逆对应每个指数取负。 -/
instance : Inv Dimension where
  inv d := ⟨fun b => -d.exponent b⟩

/-- 量纲相除对应指数向量相减。 -/
instance : Div Dimension where
  div d₁ d₂ := d₁ * d₂⁻¹

/-- 量纲取整数次幂对应每个指数乘以该整数。 -/
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

/-- 量纲乘法满足结合律。 -/
theorem mul_assoc (a b c : Dimension) : (a * b) * c = a * (b * c) := by
  ext i
  simp [Int.add_assoc]

/-- 量纲乘法满足交换律。 -/
theorem mul_comm (a b : Dimension) : a * b = b * a := by
  ext i
  simp [Int.add_comm]

/-- 零指数向量是量纲乘法的单位元。 -/
theorem one_mul (a : Dimension) : 1 * a = a := by
  ext i
  simp

/-- 任意量纲与其逆量纲相乘后约去为无量纲量。 -/
theorem inv_mul (a : Dimension) : a⁻¹ * a = 1 := by
  ext i
  simp

/-- 与一个 SI 基本量对应的基量纲。 -/
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

/-! ## 1. SI 基本量纲 -/

def timeDim : Dimension := basis .time
def lengthDim : Dimension := basis .length
def massDim : Dimension := basis .mass
def currentDim : Dimension := basis .electricCurrent
def temperatureDim : Dimension := basis .temperature
def amountDim : Dimension := basis .amountOfSubstance
def luminousIntensityDim : Dimension := basis .luminousIntensity
def dimensionless : Dimension := 1

/-! ## 2. 常用导出量纲 -/

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

/-! ## 3. 常见物理方程背后的量纲恒等式 -/

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

/-! ## 4. 以量纲为类型指标的物理量 -/

/-- `Quantity d` 包含一个实数值，其量纲由类型指标 `d` 固定。 -/
structure Quantity (d : Dimension) where
  value : ℝ

namespace Quantity

/-- 只有量纲相同的两个物理量才能相加。 -/
def add {d : Dimension} (x y : Quantity d) : Quantity d :=
  ⟨x.value + y.value⟩

/-- 物理量取负不改变量纲。 -/
def neg {d : Dimension} (x : Quantity d) : Quantity d :=
  ⟨-x.value⟩

/-- 只有量纲相同的两个物理量才能相减。 -/
def sub {d : Dimension} (x y : Quantity d) : Quantity d :=
  ⟨x.value - y.value⟩

/-- 物理量相乘时，返回类型记录两个量纲的乘积。 -/
def mul {d₁ d₂ : Dimension} (x : Quantity d₁) (y : Quantity d₂) :
    Quantity (d₁ * d₂) :=
  ⟨x.value * y.value⟩

/-- 物理量相除时，返回类型记录两个量纲的商。 -/
noncomputable def div {d₁ d₂ : Dimension} (x : Quantity d₁) (y : Quantity d₂) :
    Quantity (d₁ / d₂) :=
  ⟨x.value / y.value⟩

/-- 物理量乘以纯数不改变量纲。 -/
def scale {d : Dimension} (c : ℝ) (x : Quantity d) : Quantity d :=
  ⟨c * x.value⟩

@[simp] theorem add_value {d} (x y : Quantity d) :
    (add x y).value = x.value + y.value := rfl
@[simp] theorem mul_value {d₁ d₂} (x : Quantity d₁) (y : Quantity d₂) :
    (mul x y).value = x.value * y.value := rfl
@[simp] theorem scale_value {d} (c : ℝ) (x : Quantity d) :
    (scale c x).value = c * x.value := rfl

end Quantity

/-! ## 5. 同一量纲的不同单位表示 -/

/-- 线性单位记录相对于 SI 一贯单位的比例因子。

例如，一千米相对于一米的比例因子为 `1000`。把量纲保留在类型中，可以从类型层面
排除使用时间单位换算长度等错误。
-/
structure LinearUnit (d : Dimension) where
  symbol : String
  scaleToSI : ℝ

namespace LinearUnit

/-- 把以单位 `u` 表示的数值换算为 SI 一贯单位下的数值。 -/
def toSI {d : Dimension} (u : LinearUnit d) (value : ℝ) : ℝ :=
  value * u.scaleToSI

/-- 把 SI 一贯单位下的数值换算为以单位 `u` 表示的数值。 -/
noncomputable def fromSI {d : Dimension} (u : LinearUnit d) (value : ℝ) : ℝ :=
  value / u.scaleToSI

/-- 在同一量纲的两个单位之间换算数值。 -/
noncomputable def convert {d : Dimension} (source target : LinearUnit d)
    (value : ℝ) : ℝ :=
  target.fromSI (source.toSI value)

theorem toSI_convert {d : Dimension} (source target : LinearUnit d)
    (value : ℝ) (hto : target.scaleToSI ≠ 0) :
    target.toSI (convert source target value) = source.toSI value := by
  simp [convert, fromSI, toSI, hto]

end LinearUnit

/-- 仿射单位除比例因子外还记录零点偏移。

绝对摄氏温度的换算需要这种结构，不能仅用比例因子代替；温差则属于另一种线性换算情形。
-/
structure AffineUnit (d : Dimension) where
  symbol : String
  scaleToSI : ℝ
  offsetToSI : ℝ

namespace AffineUnit

def toSI {d : Dimension} (u : AffineUnit d) (value : ℝ) : ℝ :=
  value * u.scaleToSI + u.offsetToSI

end AffineUnit

/-- 单位制为每个 SI 基本量选择一个非零比例因子。 -/
structure UnitSystem where
  name : String
  baseScaleToSI : BaseDimension → ℝ
  scale_ne_zero : ∀ b, baseScaleToSI b ≠ 0

/-- SI 一贯单位制为每个基本量选择比例因子 `1`。 -/
def siUnitSystem : UnitSystem where
  name := "SI"
  baseScaleToSI := fun _ => 1
  scale_ne_zero := by
    intro b
    norm_num

/-! ## 6. 七个 SI 一贯基本单位 -/

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

/-- 绝对摄氏温标相对于开尔文温标构成仿射单位。 -/
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

/-! ## 7. 比例单位与精确换算定理 -/

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


/-! ## 8. 结构化量纲分析：整数核与 Π 群 -/

namespace DimensionalAnalysis

/-- 质量密度的量纲为 `M L⁻³`。 -/
def densityDim : Dimension := massDim / volumeDim

/-- 动力黏度的量纲为 `M L⁻¹ T⁻¹ = 压强 × 时间`。 -/
def dynamicViscosityDim : Dimension := pressureDim * timeDim

/-- 由周期、长度和重力加速度组成的单项式 `T^a L^b g^c` 的量纲。
整数指数已经足以表示单摆 Π 群中含周期平方的标准形式。 -/
def pendulumMonomialDim (a b c : ℤ) : Dimension :=
  timeDim ^ a * lengthDim ^ b * accelerationDim ^ c

/-- 单摆单项式无量纲，当且仅当它的时间指数与长度指数满足两条线性平衡方程。
这一结论把通常以表格给出的量纲矩阵写成了精确的定理。 -/
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

/-- `(T,L,g)` 的整数核是一维的：每个具有整数指数的无量纲单项式都是
`T² g / L` 的整数次幂。 -/
theorem pendulum_dimensionless_iff_multiple (a b c : ℤ) :
    pendulumMonomialDim a b c = dimensionless ↔
      ∃ k : ℤ, a = 2 * k ∧ b = -k ∧ c = k := by
  rw [pendulumMonomial_dimensionless_iff]
  constructor
  · rintro ⟨ht, hl⟩
    refine ⟨c, ?_, ?_, rfl⟩ <;> omega
  · rintro ⟨k, rfl, rfl, rfl⟩
    constructor <;> ring

/-- 标准的周期平方 Π 群 `T² g / L` 是无量纲量。 -/
theorem pendulumPiSquared_dimensionless :
    pendulumMonomialDim 2 (-1) 1 = dimensionless := by
  rw [pendulum_dimensionless_iff_multiple]
  exact ⟨1, by norm_num, by norm_num, by norm_num⟩

/-- 单项式 `ρ^a v^b L^c μ^d` 的量纲。 -/
def reynoldsMonomialDim (a b c d : ℤ) : Dimension :=
  densityDim ^ a * speedDim ^ b * lengthDim ^ c * dynamicViscosityDim ^ d

/-- Reynolds 量纲矩阵：质量、时间和长度的平衡给出三条相互独立的整数方程。 -/
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

/-- `(ρ,v,L,μ)` 的整数核是一维的。因此，每个具有整数指数的无量纲单项式
都是 Reynolds 数 `ρ v L / μ` 的整数次幂。 -/
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

/-- 通常的 Reynolds 数 `ρ v L / μ` 是无量纲量。 -/
theorem reynoldsNumber_dimensionless :
    reynoldsMonomialDim 1 1 1 (-1) = dimensionless := by
  rw [reynolds_dimensionless_iff_multiple]
  exact ⟨1, rfl, rfl, rfl, by norm_num⟩

end DimensionalAnalysis

/-! ## 9. 非退化单位之间的换算映射构成相干群胚 -/

namespace LinearUnit

/-- 数值从一个非退化单位换算回该单位自身时保持不变。 -/
theorem convert_self {d : Dimension} (u : LinearUnit d) (value : ℝ)
    (hu : u.scaleToSI ≠ 0) :
    convert u u value = value := by
  unfold convert fromSI toSI
  field_simp [hu]

/-- 单位换算满足传递复合律：中间单位的非零比例因子会精确约去。 -/
theorem convert_trans {d : Dimension} (source middle target : LinearUnit d)
    (value : ℝ) (hmiddle : middle.scaleToSI ≠ 0) :
    convert middle target (convert source middle value) =
      convert source target value := by
  unfold convert fromSI toSI
  rw [div_mul_cancel₀ (value * source.scaleToSI) hmiddle]

/-- 两个非退化单位之间的换算是可逆的。 -/
theorem convert_roundtrip {d : Dimension} (source target : LinearUnit d)
    (value : ℝ) (hsource : source.scaleToSI ≠ 0)
    (htarget : target.scaleToSI ≠ 0) :
    convert target source (convert source target value) = value := by
  rw [convert_trans source target source value htarget]
  exact convert_self source value hsource

/-- 由单位换算联系的两个坐标表示对应同一个 SI 数值；反之，当目标单位的比例因子
非零时，这一关系唯一确定换算后的坐标。 -/
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

/-! ## 10. 从 PhysLean 历史来源连接到现行 Physlib -/

open LTMCTUnitChoices

/-- 这一换算定理源自 PhysLean 项目；Physlib 与 QuantumInfo 合并后，当前版本通过
`Physlib.*` 模块路径提供该定理。 -/
example : DimSpeed.oneKilometerPerHour SI = ⟨5 / 18⟩ := by
  exact DimSpeed.oneKilometerPerHour_in_SI

end LeanPathPhysics

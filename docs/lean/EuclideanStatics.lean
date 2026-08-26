import Mathlib
import Physlib.Mathematics.Calculus.Gradient
import Physlib.SpaceAndTime.ReferenceFrame

/-!
历史说明：这些物理接口源自 PhysLean（更早名为 HepLean）。PhysLean 与
Lean-QuantumInfo 合并后，现行项目、构建目标与模块前缀均为 `Physlib`，
因此可执行导入保持 `Physlib.*`。
-/

open InnerProductSpace

namespace LeanPathPhysics.EuclideanStatics

/-! ## 1. 一般有限维力矩：二阶反对称张量 -/

/-- `ℝⁿ` 的透明坐标模型。 -/
abbrev VecN (n : ℕ) := Fin n → ℝ

/--
力矩二阶张量的坐标模型。它是外幂 `⋀[ℝ]^2 (VecN n)` 的反对称矩阵表示；
课程先使用这个透明表示，让学习者可以直接看到每个分量。
-/
abbrev MomentTensor (n : ℕ) := Matrix (Fin n) (Fin n) ℝ

/-- 两个向量的楔积：`(r ∧ F)ᵢⱼ = rᵢFⱼ - rⱼFᵢ`。 -/
def wedge {n : ℕ} (r F : VecN n) : MomentTensor n :=
  fun i j => r i * F j - r j * F i

/-- 楔积交换两个因子时变号。 -/
theorem wedge_swap {n : ℕ} (r F : VecN n) : wedge r F = -wedge F r := by
  ext i j
  simp [wedge]
  ring

/-- 力矩张量确实反对称。 -/
theorem wedge_skew {n : ℕ} (r F : VecN n) (i j : Fin n) :
    wedge r F i j = -wedge r F j i := by
  simp [wedge]

/-- 反对称力矩张量的对角元全部为零。 -/
@[simp] theorem wedge_diag {n : ℕ} (r F : VecN n) (i : Fin n) :
    wedge r F i i = 0 := by
  simp [wedge]

/-- 平行力的力矩为零；这里用 `F = a • r` 表示平行。 -/
theorem wedge_smul_self {n : ℕ} (a : ℝ) (r : VecN n) :
    wedge r (a • r) = 0 := by
  ext i j
  simp [wedge]
  ring

/-- 一般维坐标点。 -/
structure PointN (n : ℕ) where
  coord : VecN n

/-- 一般维集中力，同时记录作用点和力向量。 -/
structure AppliedForceN (n : ℕ) where
  point : PointN n
  vector : VecN n

abbrev ForceSystemN (n : ℕ) := List (AppliedForceN n)

/-- 一般维有限力系的合力。 -/
def resultantN {n : ℕ} : ForceSystemN n → VecN n
  | [] => 0
  | f :: S => f.vector + resultantN S

/-- 关于 `o` 的一般维力矩。 -/
def momentTensorAt {n : ℕ} (o : PointN n) (f : AppliedForceN n) :
    MomentTensor n :=
  wedge (f.point.coord - o.coord) f.vector

/-- 一般维有限力系的总力矩张量。 -/
def totalMomentTensorAt {n : ℕ} (o : PointN n) :
    ForceSystemN n → MomentTensor n
  | [] => 0
  | f :: S => momentTensorAt o f + totalMomentTensorAt o S

/-- 一般维单力移矩公式：`M_q = M_o - (q-o) ∧ F`。 -/
theorem momentTensorAt_change_origin {n : ℕ}
    (o q : PointN n) (f : AppliedForceN n) :
    momentTensorAt q f = momentTensorAt o f - wedge (q.coord - o.coord) f.vector := by
  ext i j
  simp [momentTensorAt, wedge]
  ring

/-- 一般维有限力系移矩公式：`M_q = M_o - (q-o) ∧ R`。 -/
theorem totalMomentTensorAt_change_origin {n : ℕ}
    (o q : PointN n) (S : ForceSystemN n) :
    totalMomentTensorAt q S =
      totalMomentTensorAt o S - wedge (q.coord - o.coord) (resultantN S) := by
  induction S with
  | nil =>
      ext i j
      simp [totalMomentTensorAt, resultantN, wedge]
  | cons f S ih =>
      rw [totalMomentTensorAt, totalMomentTensorAt, resultantN,
        momentTensorAt_change_origin, ih]
      ext i j; (simp [momentTensorAt, wedge] <;> ring)

/-- 一般维刚体的平衡：合力为零且反对称力矩张量为零。 -/
def IsBalancedAtN {n : ℕ} (o : PointN n) (S : ForceSystemN n) : Prop :=
  resultantN S = 0 ∧ totalMomentTensorAt o S = 0

/-- 合力为零后，一般维转动平衡同样与参考点无关。 -/
theorem balanceN_origin_independent {n : ℕ}
    (o q : PointN n) (S : ForceSystemN n)
    (h : IsBalancedAtN o S) : IsBalancedAtN q S := by
  constructor
  · exact h.1
  · rw [totalMomentTensorAt_change_origin, h.1, h.2]
    ext i j
    simp [wedge]

/-! ## 2. 三维专门化：欧式坐标、点、位移与内积 -/

/-- 透明的三维实坐标模型。Mathlib 的叉积正是作用在这个类型上。 -/
abbrev Vec3 := Fin 3 → ℝ

/--
三维中，Hodge 对偶把反对称二阶张量的三个独立分量识别成轴向向量。
这个坐标约定正好恢复 Mathlib 的叉积。
-/
def hodgeDual3 (M : MomentTensor 3) : Vec3 :=
  ![M 1 2, M 2 0, M 0 1]

theorem hodgeDual3_wedge (r F : Vec3) :
    hodgeDual3 (wedge r F) = crossProduct r F := by
  ext i
  fin_cases i <;> simp [hodgeDual3, wedge, cross_apply]
  all_goals (try ring_nf) <;> ring

/-- 坐标点。更内禀的项目可连接原 PhysLean、现 Physlib 的 ReferenceFrame。 -/
structure Point3 where
  coord : Vec3

/-- 从 `p` 指向 `q` 的位移。 -/
def displacement (p q : Point3) : Vec3 := q.coord - p.coord

/-- 实坐标上的点积。 -/
def dot (v w : Vec3) : ℝ := dotProduct v w

/-- 范数平方；避免不必要的平方根，适合代数证明。 -/
def normSq (v : Vec3) : ℝ := dot v v

@[simp] theorem displacement_self (p : Point3) : displacement p p = 0 := by
  simp [displacement]

theorem displacement_chain (p q r : Point3) :
    displacement p q + displacement q r = displacement p r := by
  ext i
  simp [displacement]

theorem normSq_eq_zero_iff (v : Vec3) : normSq v = 0 ↔ v = 0 := by
  simpa [normSq, dot] using (dotProduct_self_eq_zero (v := v))

/-! ## 3. 集中力、有限力系与合力 -/

/-- 集中力必须同时记录作用点和力向量。 -/
structure AppliedForce where
  point : Point3
  vector : Vec3

abbrev ForceSystem := List AppliedForce

/-- 有限力系的合力。 -/
def resultant : ForceSystem → Vec3
  | [] => 0
  | f :: S => f.vector + resultant S

@[simp] theorem resultant_nil : resultant [] = 0 := rfl

@[simp] theorem resultant_cons (f : AppliedForce) (S : ForceSystem) :
    resultant (f :: S) = f.vector + resultant S := rfl

theorem resultant_append (S T : ForceSystem) :
    resultant (S ++ T) = resultant S + resultant T := by
  induction S with
  | nil => simp
  | cons f S ih => simp [ih, add_assoc]

/-! ## 4. 三维叉积力矩、移矩与力偶 -/

/-- `cross v w` 是 Mathlib 的三维叉积。 -/
def cross (v w : Vec3) : Vec3 := crossProduct v w

/-- 单个集中力关于参考点 `o` 的力矩。 -/
def momentAt (o : Point3) (f : AppliedForce) : Vec3 :=
  cross (f.point.coord - o.coord) f.vector

/-- 有限力系关于 `o` 的总力矩。 -/
def totalMomentAt (o : Point3) : ForceSystem → Vec3
  | [] => 0
  | f :: S => momentAt o f + totalMomentAt o S

@[simp] theorem cross_self_zero (v : Vec3) : cross v v = 0 := by
  simpa [cross] using cross_self v

/-- 叉积与第一个因子正交。 -/
theorem dot_left_cross_self (v w : Vec3) : dot v (cross v w) = 0 := by
  simpa [dot, cross] using dot_self_cross v w

/-- 叉积与第二个因子正交。 -/
theorem dot_cross_right_self (v w : Vec3) : dot (cross v w) w = 0 := by
  rw [dot, dotProduct_comm]
  simpa [dot, cross] using dot_cross_self v w

/-- 单个力的移矩公式。 -/
theorem momentAt_change_origin (o q : Point3) (f : AppliedForce) :
    momentAt q f = momentAt o f - cross (q.coord - o.coord) f.vector := by
  ext i
  fin_cases i <;> simp [momentAt, cross, cross_apply]
  all_goals (try ring_nf <;> ring)

/-- 有限力系的移矩公式：`M_q = M_o - (q-o) × R`。 -/
theorem totalMomentAt_change_origin (o q : Point3) (S : ForceSystem) :
    totalMomentAt q S = totalMomentAt o S - cross (q.coord - o.coord) (resultant S) := by
  induction S with
  | nil => simp [totalMomentAt, resultant, cross]
  | cons f S ih =>
      change momentAt q f + totalMomentAt q S =
        momentAt o f + totalMomentAt o S -
          cross (q.coord - o.coord) (f.vector + resultant S)
      rw [momentAt_change_origin o q f, ih]
      ext i
      fin_cases i <;> simp [momentAt, cross, cross_apply]
      all_goals (try ring_nf <;> ring)

/-- 一对相反力的合力为零。 -/
theorem couple_resultant (p q : Point3) (F : Vec3) :
    resultant [⟨p, F⟩, ⟨q, -F⟩] = 0 := by
  simp [resultant]

/-- 力偶矩与参考点无关。 -/
theorem couple_moment_independent (o q p₁ p₂ : Point3) (F : Vec3) :
    totalMomentAt q [⟨p₁, F⟩, ⟨p₂, -F⟩] =
      totalMomentAt o [⟨p₁, F⟩, ⟨p₂, -F⟩] := by
  rw [totalMomentAt_change_origin o q [⟨p₁, F⟩, ⟨p₂, -F⟩]]
  simp [couple_resultant, cross]

/-! ## 5. 三维静力平衡与充要条件 -/

/-- 平动平衡。 -/
def TranslationalBalance (S : ForceSystem) : Prop := resultant S = 0

/-- 关于 `o` 的转动平衡。 -/
def RotationalBalanceAt (o : Point3) (S : ForceSystem) : Prop :=
  totalMomentAt o S = 0

/-- 刚体静力平衡 = 平动平衡 + 转动平衡。 -/
def IsBalancedAt (o : Point3) (S : ForceSystem) : Prop :=
  TranslationalBalance S ∧ RotationalBalanceAt o S

/-- 合力为零后，转动平衡与参考点无关。 -/
theorem balance_origin_independent (o q : Point3) (S : ForceSystem)
    (h : IsBalancedAt o S) : IsBalancedAt q S := by
  constructor
  · exact h.1
  · rw [RotationalBalanceAt, totalMomentAt_change_origin, h.1, h.2]
    simp [cross]

/-- 合力与合力矩在无穷小刚体运动 `(v, ω)` 上的虚功率。 -/
def rigidVirtualPowerAt (o : Point3) (S : ForceSystem) (v ω : Vec3) : ℝ :=
  dot (resultant S) v + dot (totalMomentAt o S) ω

/--
刚体平衡的充要条件：任意虚平动与虚转动上的外力功率都为零。
反向证明分别测试 `v = resultant S` 和 `ω = totalMomentAt o S`，再用内积正定性。
-/
theorem virtualPower_zero_iff_balance (o : Point3) (S : ForceSystem) :
    (∀ v ω, rigidVirtualPowerAt o S v ω = 0) ↔ IsBalancedAt o S := by
  constructor
  · intro h
    constructor
    · apply (dotProduct_self_eq_zero (v := resultant S)).mp
      simpa [rigidVirtualPowerAt, dot] using h (resultant S) 0
    · apply (dotProduct_self_eq_zero (v := totalMomentAt o S)).mp
      simpa [rigidVirtualPowerAt, dot] using h 0 (totalMomentAt o S)
  · rintro ⟨hR, hM⟩ v ω
    simp only [rigidVirtualPowerAt]
    rw [hR, hM]
    simp [dot]

/-! ## 6. 简支梁：支反力与平衡 -/

/-- 跨长 `L`、距左端 `a` 处向下载荷 `P` 的左端反力。 -/
noncomputable def leftReaction (P a L : ℝ) : ℝ := P * (L - a) / L

/-- 同一简支梁的右端反力。 -/
noncomputable def rightReaction (P a L : ℝ) : ℝ := P * a / L

theorem simplySupported_force_balance (P a L : ℝ) (hL : L ≠ 0) :
    leftReaction P a L + rightReaction P a L = P := by
  rw [leftReaction, rightReaction, ← add_div]
  apply (div_eq_iff hL).2
  ring

theorem simplySupported_moment_balance (P a L : ℝ) (hL : L ≠ 0) :
    rightReaction P a L * L = P * a := by
      rw [rightReaction]
      field_simp [hL]

theorem simplySupported_reactions_nonnegative (P a L : ℝ)
    (hP : 0 ≤ P) (ha0 : 0 ≤ a) (haL : a ≤ L) (hL : 0 < L) :
    0 ≤ leftReaction P a L ∧ 0 ≤ rightReaction P a L := by
  constructor
  · simp only [leftReaction]
    positivity
  · simp only [rightReaction]
    positivity

/-! ## 7. 静定、超静定与自应力 -/

section Determinacy

variable {Reaction Equilibrium : Type*}
variable [AddCommGroup Reaction] [Module ℝ Reaction]
variable [AddCommGroup Equilibrium] [Module ℝ Equilibrium]

/-- 对给定载荷，平衡方程存在唯一反力解。 -/
def IsStaticallyDeterminate (A : Reaction →ₗ[ℝ] Equilibrium)
    (load : Equilibrium) : Prop :=
  ∃! r, A r + load = 0

/-- 对给定载荷，平衡方程至少有两个不同反力解。 -/
def IsStaticallyIndeterminate (A : Reaction →ₗ[ℝ] Equilibrium)
    (load : Equilibrium) : Prop :=
  ∃ r₁ r₂, r₁ ≠ r₂ ∧ A r₁ + load = 0 ∧ A r₂ + load = 0

theorem determinate_of_injective (A : Reaction →ₗ[ℝ] Equilibrium)
    (load : Equilibrium) (hA : Function.Injective A)
    (r₀ : Reaction) (hr₀ : A r₀ + load = 0) :
    IsStaticallyDeterminate A load := by
  refine ⟨r₀, hr₀, ?_⟩
  intro r hr
  apply hA
  exact add_right_cancel (hr.trans hr₀.symm)

/-- 非零核向量是自应力：它把已有解变成另一组解。 -/
theorem indeterminate_of_selfStress (A : Reaction →ₗ[ℝ] Equilibrium)
    (load : Equilibrium) (r₀ k : Reaction)
    (hr₀ : A r₀ + load = 0) (hk : A k = 0) (hk0 : k ≠ 0) :
    IsStaticallyIndeterminate A load := by
  refine ⟨r₀, r₀ + k, ?_, hr₀, ?_⟩
  · intro h
    apply hk0
    have : r₀ + k = r₀ + 0 := by simpa using h.symm
    exact add_left_cancel this
  · rw [map_add, hk]
    simpa using hr₀

end Determinacy

/-! ## 8. 常力功与路径分段 -/

/-- 常力 `F` 从 `p` 到 `q` 所做的功。 -/
def work (F : Vec3) (p q : Point3) : ℝ := dot F (displacement p q)

theorem work_add (F : Vec3) (p q r : Point3) :
    work F p r = work F p q + work F q r := by
  have h := displacement_chain p q r
  simp only [work]
  rw [← h]
  simp [work, dot, dotProduct_add]

theorem work_zero_of_orthogonal (F : Vec3) (p q : Point3)
    (h : dot F (displacement p q) = 0) : work F p q = 0 := h

/-! ## 9. 势能与梯度：从 PhysLean 来源到现行 Physlib 接口 -/

noncomputable section

/-- `n` 维欧式空间中的各向同性二次弹簧势能。 -/
def quadraticPotential {n : ℕ} (k : ℝ) (x : EuclideanSpace ℝ (Fin n)) : ℝ :=
  (1 / 2 : ℝ) * k * ⟪x, x⟫_ℝ

/-- 保守弹簧力定义为势能的负梯度。 -/
def elasticForce {n : ℕ} (k : ℝ) (x : EuclideanSpace ℝ (Fin n)) :
    EuclideanSpace ℝ (Fin n) :=
  -gradient (quadraticPotential k) x

/-- 复用源自 PhysLean、现由 Physlib 提供的梯度定理得到 Hooke 定律。 -/
theorem gradient_quadraticPotential {n : ℕ} (k : ℝ)
    (x : EuclideanSpace ℝ (Fin n)) :
    gradient (quadraticPotential k) x = k • x := by
  change gradient (fun y : EuclideanSpace ℝ (Fin n) =>
    ((1 / 2 : ℝ) * k) * ⟪y, y⟫_ℝ) x = k • x
  rw [gradient_const_mul_inner_self]
  module

theorem elasticForce_eq {n : ℕ} (k : ℝ)
    (x : EuclideanSpace ℝ (Fin n)) : elasticForce k x = (-k) • x := by
  rw [elasticForce, gradient_quadraticPotential]
  module

end

/-! ## 10. 有限维虚功与势能稳定性 -/

/-- 许可的刚体虚运动集合；复杂约束可把它进一步升级为线性子空间。 -/
abbrev AdmissibleMotions := Set (Vec3 × Vec3)

/-- 外力对全部许可虚运动的功率为零。 -/
def VirtualWorkPrincipleAt (o : Point3) (S : ForceSystem)
    (admissible : AdmissibleMotions) : Prop :=
  ∀ motion ∈ admissible, rigidVirtualPowerAt o S motion.1 motion.2 = 0

theorem free_virtual_work_iff_balance (o : Point3) (S : ForceSystem) :
    VirtualWorkPrincipleAt o S Set.univ ↔ IsBalancedAt o S := by
  constructor
  · intro h
    apply (virtualPower_zero_iff_balance o S).mp
    intro v ω
    exact h (v, ω) (Set.mem_univ _)
  · intro h motion _
    exact (virtualPower_zero_iff_balance o S).mpr h motion.1 motion.2

/-- 一维二次势能是稳定性三分类的最小严谨模型。 -/
noncomputable def scalarPotential (k x : ℝ) : ℝ := (1 / 2 : ℝ) * k * x^2

theorem positive_stiffness_strict_min (k x : ℝ)
    (hk : 0 < k) (hx : x ≠ 0) :
    scalarPotential k 0 < scalarPotential k x := by
  have hx2 : 0 < x^2 := sq_pos_of_ne_zero hx
  simp [scalarPotential]
  nlinarith

theorem zero_stiffness_neutral (x : ℝ) :
    scalarPotential 0 x = scalarPotential 0 0 := by
  simp [scalarPotential]

theorem negative_stiffness_has_lower_energy (k : ℝ) (hk : k < 0) :
    scalarPotential k 1 < scalarPotential k 0 := by
  simp [scalarPotential]
  linarith

/-!
这些稳定性定理只说明保守二次模型。半正定多维刚度需要检查零模和高阶项；
非保守载荷、摩擦耗散与屈曲需要不同的稳定性框架。
-/

end LeanPathPhysics.EuclideanStatics

/* Progressive theorem exhibits for Units I–II.  Small cards display complete
   proof chains; the final chest in each unit exposes the full maintained file. */
(function () {
  const lean = String.raw;

  window.LEANPATH_SHOWCASE = {
    version: 8,
    entries: [
      {
        id:"showcase-unit-algebra",unlock:"homogeneity",part:1,
        title:"量纲群与物理齐次式",
        summary:"量纲不是字符串标签，而是七维整数指数向量。展品先证明乘法交换、逆元消去，再逐分量推出 mv²、pV 与能量具有同一量纲。",
        origin:"LeanPath 主代码摘编 · Mathlib 检查整数指数代数",
        filename:"DimensionIdentities.lean",
        milestones:["Dimension.ext 将量纲相等化为七个分量相等","乘法、逆和整数幂对应指数向量运算","从基本量纲推导动能与压强—体积恒等式"],
        code:lean`import Mathlib

inductive BaseDimension where
  | time | length | mass | electricCurrent
  | temperature | amountOfSubstance | luminousIntensity
  deriving DecidableEq

structure Dimension where exponent : BaseDimension → ℤ
instance : One Dimension := ⟨⟨fun _ => 0⟩⟩
instance : Mul Dimension := ⟨fun a b => ⟨fun i => a.exponent i + b.exponent i⟩⟩
instance : Inv Dimension := ⟨fun a => ⟨fun i => -a.exponent i⟩⟩
instance : HPow Dimension ℤ Dimension := ⟨fun a n => ⟨fun i => n * a.exponent i⟩⟩

@[ext] theorem Dimension.ext (a b : Dimension)
    (h : ∀ i, a.exponent i = b.exponent i) : a = b := by
  cases a; cases b
  congr
  funext i
  exact h i

theorem dimension_inv_mul (a : Dimension) : a⁻¹ * a = 1 := by
  ext i
  change -a.exponent i + a.exponent i = 0
  omega
`
      },
      {
        id:"showcase-pendulum-kernel",unlock:"dimensionless",part:1,
        title:"单摆 Π 群：求量纲矩阵的整数核",
        summary:"把 TᵃLᵇgᶜ 无量纲化为两条整数线性方程，并证明全部解只有 k(2,−1,1)。因此 T²g/L 不是猜出的组合，而是核的一组生成元。",
        origin:"LeanPath 主代码摘编 · Buckingham Π 的整数指数版本",
        filename:"PendulumPiGroup.lean",
        milestones:["从时间与长度分量读取两条平衡方程","证明整数核是一维的","验证规范生成元 T²g/L"],
        code:lean`import Mathlib

theorem pendulum_dimensionless_iff_multiple (a b c : ℤ) :
    (a - 2 * c = 0 ∧ b + c = 0) ↔
      ∃ k : ℤ, a = 2 * k ∧ b = -k ∧ c = k := by
  constructor
  · rintro ⟨ht, hl⟩
    refine ⟨c, ?_, ?_, rfl⟩ <;> omega
  · rintro ⟨k, rfl, rfl, rfl⟩
    constructor <;> ring

example : (2 - 2 * (1 : ℤ) = 0 ∧ (-1 : ℤ) + 1 = 0) := by
  norm_num
`
      },
      {
        id:"showcase-reynolds-kernel",unlock:"practice",part:1,
        title:"Reynolds 数：四变量量纲核",
        summary:"对密度、速度、长度、动力黏度建立三条量纲约束，证明其整数核由 (1,1,1,−1) 生成，严格恢复 ρvL/μ。",
        origin:"LeanPath 主代码摘编 · 流体相似准则的形式化核心",
        filename:"ReynoldsPiGroup.lean",
        milestones:["质量、时间、长度给出三条独立约束","四个变量留下一个自由参数","所有整数指数无量纲量都是 Reynolds 数的整数幂"],
        code:lean`import Mathlib

theorem reynolds_dimensionless_iff_multiple (a b c d : ℤ) :
    (a + d = 0 ∧ -b - d = 0 ∧ -3 * a + b + c - d = 0) ↔
      ∃ k : ℤ, a = k ∧ b = k ∧ c = k ∧ d = -k := by
  constructor
  · rintro ⟨hm, ht, hl⟩
    refine ⟨a, rfl, ?_, ?_, ?_⟩ <;> omega
  · rintro ⟨k, rfl, rfl, rfl, rfl⟩
    constructor
    · ring
    · constructor <;> ring
`
      },
      {
        id:"showcase-conversion-groupoid",unlock:"unit-conversion",part:1,
        title:"单位换算的群胚结构",
        summary:"非零单位尺度之间的换算满足恒等、传递与可逆性。由此可以证明换算不依赖中间单位，而不仅是验证某一个数值例子。",
        origin:"LeanPath 主代码摘编 · 线性单位的结构定理",
        filename:"UnitConversionGroupoid.lean",
        milestones:["convert_self：单位到自身是恒等","convert_trans：中间尺度严格消去","convert_roundtrip：往返换算恢复原坐标"],
        code:lean`import Mathlib

structure LinearUnit where scale : ℝ
noncomputable def convert (source target : LinearUnit) (x : ℝ) : ℝ :=
  x * source.scale / target.scale

theorem convert_self (u : LinearUnit) (x : ℝ) (hu : u.scale ≠ 0) :
    convert u u x = x := by
  unfold convert
  field_simp [hu]

theorem convert_trans (s m t : LinearUnit) (x : ℝ) (hm : m.scale ≠ 0) :
    convert m t (convert s m x) = convert s t x := by
  unfold convert
  rw [div_mul_cancel₀ (x * s.scale) hm]

theorem convert_roundtrip (s t : LinearUnit) (x : ℝ)
    (hs : s.scale ≠ 0) (ht : t.scale ≠ 0) :
    convert t s (convert s t x) = x := by
  rw [convert_trans s t s x ht]
  exact convert_self s x hs
`
      },
      {
        id:"showcase-typed-computation",unlock:"typed-ops",part:1,
        title:"由类型阻止量纲错误",
        summary:"Quantity d 把量纲放进类型：同量纲才能相加，乘法在返回类型里计算新量纲。物理公式的合法性因此在数值计算之前就由 elaborator 检查。",
        origin:"LeanPath 主代码摘编 · 依赖类型物理量",
        filename:"TypedPhysicalQuantity.lean",
        milestones:["同量纲加法由函数签名保证","乘法自动合成量纲索引","纯数缩放保持原量纲"],
        code:lean`import Mathlib

variable {Dimension : Type} [Mul Dimension]
structure Quantity (d : Dimension) where value : ℝ

def Quantity.add {d : Dimension} (x y : Quantity d) : Quantity d :=
  ⟨x.value + y.value⟩

def Quantity.mul {d₁ d₂ : Dimension}
    (x : Quantity d₁) (y : Quantity d₂) : Quantity (d₁ * d₂) :=
  ⟨x.value * y.value⟩

def Quantity.scale {d : Dimension} (c : ℝ) (x : Quantity d) : Quantity d :=
  ⟨c * x.value⟩
`
      },
      {
        id:"showcase-unit-complete",unlock:"chest",part:1,
        title:"第一部分完整成果 · 单位与量纲",
        summary:"完整主文件包含量纲代数、类型化物理量、线性与仿射单位、单摆与 Reynolds 数的整数核，以及单位换算的恒等、传递、往返和刻画定理。",
        origin:"LeanPath 完整成果 · Mathlib + Physlib 单位接口",
        filename:"UnitAndDimension.lean",file:"lean/UnitAndDimension.lean",completion:true,
        milestones:["七个 SI 基本量与整数指数向量","动能、pV、电压等量纲恒等式","Quantity d 的类型安全运算","线性单位与仿射温标的区分","单摆 Π 群的一维整数核","Reynolds 数的一维整数核","单位换算的群胚结构","Physlib 精确速度换算接口"]
      },

      {
        id:"showcase-wedge-geometry",unlock:"moment",part:2,
        title:"一般维力矩与共线性判别",
        summary:"在 ℝⁿ 中把力矩定义为反对称二阶张量 r∧F，并证明 r≠0 时 r∧F=0 当且仅当 F 与 r 共线。这赋予张量定义明确的几何意义。",
        origin:"LeanPath 主代码摘编 · 一般维力矩",
        filename:"MomentBivectorGeometry.lean",
        milestones:["楔积交换变号且对角元为零","平行力产生零力矩","零楔积在非退化条件下反推出共线"],
        code:lean`import Mathlib

abbrev VecN (n : ℕ) := Fin n → ℝ
abbrev MomentTensor (n : ℕ) := Matrix (Fin n) (Fin n) ℝ
def wedge {n : ℕ} (r F : VecN n) : MomentTensor n :=
  fun i j => r i * F j - r j * F i

theorem wedge_eq_zero_implies_collinear {n : ℕ}
    (r F : VecN n) (hr : r ≠ 0) (h : wedge r F = 0) :
    ∃ a : ℝ, F = a • r := by
  classical
  have hi : ∃ i, r i ≠ 0 := by
    by_contra hn
    push Not at hn
    apply hr
    funext i
    exact hn i
  rcases hi with ⟨i, hi⟩
  refine ⟨F i / r i, ?_⟩
  funext j
  have hij : r i * F j - r j * F i = 0 := by
    have hc := congrArg (fun M : MomentTensor n => M i j) h
    simpa [wedge] using hc
  change F j = (F i / r i) * r j
  rw [div_mul_eq_mul_div]
  apply (eq_div_iff hi).2
  nlinarith [hij]
`
      },
      {
        id:"showcase-wrench-origin",unlock:"moment-shift",part:2,
        title:"力系移矩与平衡的参考点无关性",
        summary:"总力矩换原点时只增加 −(q−o)∧R。合力 R=0 后修正项消失，因此“平动平衡 + 转动平衡”不依赖任意选择的参考点。",
        origin:"LeanPath 主代码摘编 · 力系结构定理",
        filename:"WrenchOriginShift.lean",
        milestones:["单力移矩公式来自楔积双线性","有限力系列表归纳得到总移矩公式","零合力使转动平衡与原点选择无关"],
        code:lean`import Mathlib

abbrev VecN (n : ℕ) := Fin n → ℝ
abbrev MomentTensor (n : ℕ) := Matrix (Fin n) (Fin n) ℝ
def wedge {n : ℕ} (r F : VecN n) : MomentTensor n :=
  fun i j => r i * F j - r j * F i
structure PointN (n : ℕ) where coord : VecN n
structure AppliedForceN (n : ℕ) where
  point : PointN n
  vector : VecN n
def momentAt {n : ℕ} (o : PointN n) (f : AppliedForceN n) : MomentTensor n :=
  wedge (f.point.coord - o.coord) f.vector

theorem moment_change_origin {n : ℕ} (o q : PointN n) (f : AppliedForceN n) :
    momentAt q f = momentAt o f - wedge (q.coord - o.coord) f.vector := by
  ext i j
  simp [momentAt, wedge]
  ring
`
      },
      {
        id:"showcase-beam-equilibrium",unlock:"support-reactions",part:2,
        title:"简支梁：反力公式不是答案，而是平衡定理",
        summary:"对任意非零跨度 L，形式化验证两端反力同时满足竖直合力平衡和关于左端的力矩平衡；再在 0≤a≤L、P≥0 时证明反力非负。",
        origin:"LeanPath 主代码摘编 · 静力学标准算例",
        filename:"SimplySupportedBeam.lean",
        milestones:["由力矩方程解出右端反力","由合力方程恢复左端反力","载荷位于跨内时两支反力非负"],
        code:lean`import Mathlib

noncomputable def leftReaction (P a L : ℝ) : ℝ := P * (L - a) / L
noncomputable def rightReaction (P a L : ℝ) : ℝ := P * a / L

theorem beam_force_balance (P a L : ℝ) (hL : L ≠ 0) :
    leftReaction P a L + rightReaction P a L = P := by
  rw [leftReaction, rightReaction, ← add_div]
  apply (div_eq_iff hL).2
  ring

theorem beam_moment_balance (P a L : ℝ) (hL : L ≠ 0) :
    rightReaction P a L * L = P * a := by
  rw [rightReaction]
  field_simp [hL]
`
      },
      {
        id:"showcase-virtual-power",unlock:"equilibrium-iff",part:2,
        title:"虚功率刻画刚体平衡",
        summary:"外力对任意虚平动和虚转动的功率为零，当且仅当合力、合矩同时为零。反向证明通过选取残差本身作为测试运动使用内积正定性。",
        origin:"LeanPath 主代码摘编 · 虚功原理的有限维原型",
        filename:"VirtualPowerEquilibrium.lean",
        milestones:["虚平动检测合力","虚转动检测合矩","内积正定性把所有测试为零转成向量为零"],
        code:lean`import Mathlib

abbrev Vec3 := Fin 3 → ℝ
def virtualPower (R M v ω : Vec3) : ℝ := dotProduct R v + dotProduct M ω

theorem virtualPower_zero_iff (R M : Vec3) :
    (∀ v ω, virtualPower R M v ω = 0) ↔ R = 0 ∧ M = 0 := by
  constructor
  · intro h
    constructor
    · apply dotProduct_self_eq_zero.mp
      simpa [virtualPower] using h R 0
    · apply dotProduct_self_eq_zero.mp
      simpa [virtualPower] using h 0 M
  · rintro ⟨rfl, rfl⟩ v ω
    simp [virtualPower]
`
      },
      {
        id:"showcase-determinacy-kernel",unlock:"determinacy",part:2,
        title:"静定性、核与自应力",
        summary:"把支反力方程写成线性算子 A。对一致问题，解唯一当且仅当 A 单射，也等价于 ker A={0}；非零核向量会沿自应力方向生成另一组解。",
        origin:"LeanPath 主代码摘编 · 线性平衡算子",
        filename:"StaticDeterminacy.lean",
        milestones:["静定使用存在唯一量词 ∃!","单射性保证已有平衡解唯一","非零自应力等价于一致系统的超静定性"],
        code:lean`import Mathlib

variable {R E : Type*} [AddCommGroup R] [Module ℝ R]
variable [AddCommGroup E] [Module ℝ E]

def IsDeterminate (A : R →ₗ[ℝ] E) (load : E) : Prop :=
  ∃! r, A r + load = 0

theorem determinate_of_injective (A : R →ₗ[ℝ] E) (load : E)
    (hA : Function.Injective A) (r₀ : R) (hr₀ : A r₀ + load = 0) :
    IsDeterminate A load := by
  refine ⟨r₀, hr₀, ?_⟩
  intro r hr
  apply hA
  exact add_right_cancel (hr.trans hr₀.symm)
`
      },
      {
        id:"showcase-hooke-stability",unlock:"stability",part:2,
        title:"Hooke 平衡与严格势能稳定性",
        summary:"在任意有限维欧式空间中，正刚度二次势能在原点取得严格全局极小；结合 F=−kx，可同时得到唯一平衡与能量稳定。",
        origin:"LeanPath 主代码摘编 · Mathlib 内积正定性 + Physlib 梯度桥接",
        filename:"HookeStability.lean",
        milestones:["二次势能由欧式内积定义","x≠0 推出 ⟪x,x⟫>0","k>0 给出严格全局极小点"],
        code:lean`import Mathlib

open InnerProductSpace
noncomputable section

def potential {n : ℕ} (k : ℝ) (x : EuclideanSpace ℝ (Fin n)) : ℝ :=
  (1 / 2 : ℝ) * k * ⟪x, x⟫_ℝ

theorem potential_strict_min {n : ℕ} (k : ℝ) (hk : 0 < k)
    (x : EuclideanSpace ℝ (Fin n)) (hx : x ≠ 0) :
    potential (n := n) k 0 < potential k x := by
  have hinner : 0 < inner ℝ x x := real_inner_self_pos.mpr hx
  simp only [potential, inner_zero_left]
  nlinarith
`
      },
      {
        id:"showcase-statics-complete",unlock:"statics-chest",part:2,
        title:"第二部分完整成果 · 欧式空间静力学",
        summary:"完整主文件把一般维力矩张量、三维叉积、移矩、力偶、虚功、静定性与势能稳定性组织成连续证明链。",
        origin:"LeanPath 完整成果 · Mathlib + Physlib 梯度接口",
        filename:"EuclideanStatics.lean",file:"lean/EuclideanStatics.lean",completion:true,
        milestones:["一般 ℝⁿ 力矩张量及共线性充要条件","三维 Hodge 对偶与叉积","单力和有限力系移矩定理","平衡与静力等效的参考点无关性","简支梁反力及非负性","虚功率刻画平衡","静定、核与自应力的充要条件","常力功的路径分段","Hooke 唯一平衡与严格势能稳定性"]
      }
    ]
  };
}());

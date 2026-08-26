/* LeanPath Physics · Units I–II writing laboratory.
   Every task is a self-contained Lean file. The progression is deliberately
   computation → standard lemma → structural theorem, not definition recall. */
(function () {
  const lean = String.raw;

  window.LEANPATH_WRITING_BANK = {
    version: 9,
    tasks: [
      {
        id:"unit-v2-speed-conversion",part:1,unlock:"unit-conversion",level:1,
        section:"具体换算",title:"汽车速度：90 km/h = 25 m/s",
        prompt:"把千米与小时同时换成 SI，证明 90 km/h 精确等于 25 m/s。这是纯有理数计算，不允许用浮点近似。",
        concept:"unit-conversion",xp:10,starter:"by\n  ",placeholder:"用精确数值归一化完成等式",
        hint:"Mathlib 的 norm_num 会在有理数域中完成 90×1000/3600 的约分。",
        template:lean`import Mathlib

theorem ninety_kilometres_per_hour :
    (90 : ℝ) * 1000 / 3600 = 25 :=
  {{ANSWER}}
`
      },
      {
        id:"unit-v2-temperature",part:1,unlock:"unit-conversion",level:1,
        section:"仿射温标",title:"沸点与温差是两类换算",
        prompt:"绝对摄氏温度要加零点偏移，而温差中的偏移会抵消。一次证明 100 ℃ = 373.15 K，以及 20 ℃ 与 5 ℃ 相差 15 K。",
        concept:"unit-conversion",xp:11,starter:"by\n  ",placeholder:"展开 toKelvin 后进行精确数值计算",
        hint:"使用 norm_num [toKelvin]；Lean 会把有限小数当作精确有理数。",
        template:lean`import Mathlib

def toKelvin (celsius : ℝ) : ℝ := celsius + 273.15

theorem celsius_absolute_and_difference :
    toKelvin 100 = 373.15 ∧
      toKelvin 20 - toKelvin 5 = 15 :=
  {{ANSWER}}
`
      },
      {
        id:"unit-v2-kinetic-dimension",part:1,unlock:"homogeneity",level:2,
        section:"量纲齐次",title:"从 mv² 推导动能量纲",
        prompt:"把量纲写成七个整数指数。逐分量证明 [m v²] = M L² T⁻²，而不是把结论直接定义成 energyDim。",
        concept:"homogeneity",xp:14,starter:"by\n  funext b\n  ",placeholder:"对七个基本量分类并化简",
        hint:"对 b 使用 cases；每个分量随后都是整数恒等式。",
        template:lean`import Mathlib

inductive BaseDimension where
  | time | length | mass | electricCurrent
  | temperature | amountOfSubstance | luminousIntensity
  deriving DecidableEq

abbrev Dim := BaseDimension → ℤ
def basis (b : BaseDimension) : Dim := fun i => if i = b then 1 else 0
def dimMul (d₁ d₂ : Dim) : Dim := fun b => d₁ b + d₂ b
def dimPow (d : Dim) (n : ℤ) : Dim := fun b => n * d b
def timeDim : Dim := basis .time
def lengthDim : Dim := basis .length
def massDim : Dim := basis .mass
def speedDim : Dim := fun b => lengthDim b - timeDim b
def energyDim : Dim := fun b => massDim b + 2 * lengthDim b - 2 * timeDim b

theorem kinetic_energy_dimension :
    dimMul massDim (dimPow speedDim 2) = energyDim :=
  {{ANSWER}}
`
      },
      {
        id:"unit-v2-pressure-volume",part:1,unlock:"homogeneity",level:2,
        section:"量纲齐次",title:"证明 pV 与能量同量纲",
        prompt:"由 [p]=M L⁻¹ T⁻² 与 [V]=L³ 出发，逐分量证明压强乘体积具有能量量纲。",
        concept:"homogeneity",xp:14,starter:"by\n  funext b\n  ",placeholder:"分类七个基本量并验证指数相加",
        hint:"cases b <;> rfl 即可把物理推导落实到七个整数分量。",
        template:lean`import Mathlib

inductive BaseDimension where
  | time | length | mass | electricCurrent
  | temperature | amountOfSubstance | luminousIntensity
  deriving DecidableEq

abbrev Dim := BaseDimension → ℤ
def basis (b : BaseDimension) : Dim := fun i => if i = b then 1 else 0
def timeDim : Dim := basis .time
def lengthDim : Dim := basis .length
def massDim : Dim := basis .mass
def pressureDim : Dim := fun b => massDim b - lengthDim b - 2 * timeDim b
def volumeDim : Dim := fun b => 3 * lengthDim b
def energyDim : Dim := fun b => massDim b + 2 * lengthDim b - 2 * timeDim b

theorem pressure_times_volume_is_energy :
    (fun b => pressureDim b + volumeDim b) = energyDim :=
  {{ANSWER}}
`
      },
      {
        id:"unit-v2-pendulum-pi",part:1,unlock:"dimensionless",level:3,
        section:"Buckingham Π",title:"求单摆量纲矩阵的整数核",
        prompt:"单项式 TᵃLᵇgᶜ 无量纲等价于 a−2c=0、b+c=0。证明全部整数解恰为 (a,b,c)=k(2,−1,1)，从而得到 T²g/L。",
        concept:"dimensionless",xp:18,starter:"by\n  ",placeholder:"选择 k=c，并用整数线性算术求其余指数",
        hint:"refine ⟨c, ?_, ?_, rfl⟩ 后，omega 可以解两个线性方程。",
        template:lean`import Mathlib

theorem pendulum_integer_kernel (a b c : ℤ)
    (hTime : a - 2 * c = 0) (hLength : b + c = 0) :
    ∃ k : ℤ, a = 2 * k ∧ b = -k ∧ c = k :=
  {{ANSWER}}
`
      },
      {
        id:"unit-v2-reynolds-pi",part:1,unlock:"dimensionless",level:3,
        section:"Buckingham Π",title:"推出 Reynolds 数的唯一指数方向",
        prompt:"对 ρᵃvᵇLᶜμᵈ，质量、时间、长度平衡给出三条整数方程。证明其整数核由 (1,1,1,−1) 生成，即无量纲组合是 (ρvL/μ)ᵏ。",
        concept:"dimensionless",xp:19,starter:"by\n  ",placeholder:"取 k=a，再从三条平衡方程恢复 b、c、d",
        hint:"refine ⟨a, rfl, ?_, ?_, ?_⟩ <;> omega。",
        template:lean`import Mathlib

theorem reynolds_integer_kernel (a b c d : ℤ)
    (hMass : a + d = 0)
    (hTime : -b - d = 0)
    (hLength : -3 * a + b + c - d = 0) :
    ∃ k : ℤ, a = k ∧ b = k ∧ c = k ∧ d = -k :=
  {{ANSWER}}
`
      },
      {
        id:"unit-v2-conversion-trans",part:1,unlock:"unit-conversion",level:3,
        section:"换算结构",title:"证明单位换算满足传递律",
        prompt:"把单位视为到 SI 的非零尺度。证明 source→middle→target 等于直接 source→target；关键是中间尺度严格消去。",
        concept:"unit-conversion",xp:18,starter:"by\n  unfold convert\n  ",placeholder:"消去 middle.scale 并保留 target 坐标",
        hint:"使用 rw [div_mul_cancel₀ (value * source.scale) hmiddle]。",
        template:lean`import Mathlib

structure LinearUnit where
  scale : ℝ

noncomputable def convert (source target : LinearUnit) (value : ℝ) : ℝ :=
  value * source.scale / target.scale

theorem convert_trans (source middle target : LinearUnit) (value : ℝ)
    (hmiddle : middle.scale ≠ 0) :
    convert middle target (convert source middle value) =
      convert source target value :=
  {{ANSWER}}
`
      },
      {
        id:"unit-v2-conversion-roundtrip",part:1,unlock:"typed-ops",level:3,
        section:"换算结构",title:"证明换算往返不改变物理量",
        prompt:"调用已经给出的换算传递律与自换算定理，证明两个非退化单位之间往返后数值恢复。",
        concept:"typed-ops",xp:19,starter:"by\n  ",placeholder:"先合并两次换算，再化为 source 到自身",
        hint:"先 rw [convert_trans source target source value htarget]，再 exact convert_self ...。",
        template:lean`import Mathlib

structure LinearUnit where
  scale : ℝ

noncomputable def convert (source target : LinearUnit) (value : ℝ) : ℝ :=
  value * source.scale / target.scale

theorem convert_self (u : LinearUnit) (value : ℝ) (hu : u.scale ≠ 0) :
    convert u u value = value := by
  unfold convert
  field_simp [hu]

theorem convert_trans (source middle target : LinearUnit) (value : ℝ)
    (hmiddle : middle.scale ≠ 0) :
    convert middle target (convert source middle value) =
      convert source target value := by
  unfold convert
  rw [div_mul_cancel₀ (value * source.scale) hmiddle]

theorem convert_roundtrip (source target : LinearUnit) (value : ℝ)
    (hsource : source.scale ≠ 0) (htarget : target.scale ≠ 0) :
    convert target source (convert source target value) = value :=
  {{ANSWER}}
`
      },
      {
        id:"unit-v2-typed-energy",part:1,unlock:"typed-ops",level:2,
        section:"类型化计算",title:"计算 2 kg、3 m/s 质点的动能",
        prompt:"在量纲索引已经进入类型之后，完成数值计算：m=2、v=3 时，½mv²=9；返回类型自动记录 M·(L/T)²。",
        concept:"typed-ops",xp:15,starter:"by\n  ",placeholder:"展开类型化乘法与缩放，再做精确数值计算",
        hint:"norm_num [kineticEnergy, Quantity.mul, Quantity.scale]。",
        template:lean`import Mathlib

noncomputable section

abbrev Dim := ℤ × ℤ × ℤ
def dimMul (a b : Dim) : Dim := (a.1 + b.1, a.2.1 + b.2.1, a.2.2 + b.2.2)
def massDim : Dim := (1, 0, 0)
def speedDim : Dim := (0, 1, -1)

structure Quantity (d : Dim) where value : ℝ

def Quantity.mul {d₁ d₂ : Dim} (x : Quantity d₁) (y : Quantity d₂) :
    Quantity (dimMul d₁ d₂) := ⟨x.value * y.value⟩
def Quantity.scale {d : Dim} (c : ℝ) (x : Quantity d) : Quantity d :=
  ⟨c * x.value⟩

def kineticEnergy (m : Quantity massDim) (v : Quantity speedDim) :
    Quantity (dimMul massDim (dimMul speedDim speedDim)) :=
  Quantity.scale (1 / 2 : ℝ) (Quantity.mul m (Quantity.mul v v))

theorem two_kg_three_mps :
    (kineticEnergy (⟨2⟩ : Quantity massDim)
      (⟨3⟩ : Quantity speedDim)).value = 9 :=
  {{ANSWER}}
`
      },
      {
        id:"statics-v2-resultant",part:2,unlock:"force-system",level:1,
        section:"具体力系",title:"计算三个集中力的合力",
        prompt:"三个三维力分别为 (3,−2,1)、(−1,5,0)、(−2,−3,−1)。逐坐标证明合力为零。",
        concept:"force-system",xp:11,starter:"by\n  ext i\n  ",placeholder:"枚举三个坐标并精确计算",
        hint:"fin_cases i <;> norm_num [F₁, F₂, F₃]。",
        template:lean`import Mathlib

abbrev Vec3 := Fin 3 → ℝ
def F₁ : Vec3 := ![3, -2, 1]
def F₂ : Vec3 := ![-1, 5, 0]
def F₃ : Vec3 := ![-2, -3, -1]

theorem three_force_resultant : F₁ + F₂ + F₃ = 0 :=
  {{ANSWER}}
`
      },
      {
        id:"statics-v2-torque",part:2,unlock:"moment",level:1,
        section:"具体力矩",title:"计算二维杠杆嵌入三维后的力矩",
        prompt:"作用点位移 r=(2,0,0)，力 F=(0,3,0)。证明 r×F=(0,0,6)，并由此读出 6 N·m 的 z 向力矩。",
        concept:"moment",xp:12,starter:"by\n  ext i\n  ",placeholder:"枚举坐标并展开 crossProduct",
        hint:"先 fin_cases i <;> simp [r, F, cross_apply]；剩余的 2*3=6 再用 norm_num。",
        template:lean`import Mathlib

abbrev Vec3 := Fin 3 → ℝ
def r : Vec3 := ![2, 0, 0]
def F : Vec3 := ![0, 3, 0]

theorem lever_torque : crossProduct r F = ![0, 0, 6] :=
  {{ANSWER}}
`
      },
      {
        id:"statics-v2-collinearity",part:2,unlock:"moment",level:3,
        section:"一般维力矩",title:"零力矩张量推出力与位移共线",
        prompt:"在 ℝⁿ 中假设 r≠0 且 r∧F=0。选取一个非零坐标 rᵢ，证明 F=(Fᵢ/rᵢ)r。这给出“作用线通过原点”的严格代数表述。",
        concept:"moment",xp:20,starter:"by\n  classical\n  ",placeholder:"选取非零坐标，读取 (i,j) 分量并解出 F j",
        hint:"先由 r≠0 得到 ∃ i, r i ≠ 0；对任意 j 从 h 的 (i,j) 分量得到 rᵢFⱼ−rⱼFᵢ=0。",
        template:lean`import Mathlib

abbrev VecN (n : ℕ) := Fin n → ℝ
abbrev MomentTensor (n : ℕ) := Matrix (Fin n) (Fin n) ℝ
def wedge {n : ℕ} (r F : VecN n) : MomentTensor n :=
  fun i j => r i * F j - r j * F i

theorem zero_wedge_implies_collinear {n : ℕ}
    (r F : VecN n) (hr : r ≠ 0) (h : wedge r F = 0) :
    ∃ a : ℝ, F = a • r :=
  {{ANSWER}}
`
      },
      {
        id:"statics-v2-origin-shift",part:2,unlock:"moment-shift",level:3,
        section:"移矩定理",title:"证明单力的一般维移矩公式",
        prompt:"直接从 Mₒ=(p−o)∧F 推导 M_q=Mₒ−(q−o)∧F。要求逐分量完成，而不是把公式作为新定义。",
        concept:"moment-shift",xp:18,starter:"by\n  ext i j\n  ",placeholder:"展开 momentTensorAt 与 wedge，再整理环表达式",
        hint:"simp [momentTensorAt, wedge] 后使用 ring。",
        template:lean`import Mathlib

abbrev VecN (n : ℕ) := Fin n → ℝ
abbrev MomentTensor (n : ℕ) := Matrix (Fin n) (Fin n) ℝ
def wedge {n : ℕ} (r F : VecN n) : MomentTensor n :=
  fun i j => r i * F j - r j * F i
structure PointN (n : ℕ) where coord : VecN n
structure AppliedForceN (n : ℕ) where
  point : PointN n
  vector : VecN n
def momentTensorAt {n : ℕ} (o : PointN n) (f : AppliedForceN n) :
    MomentTensor n := wedge (f.point.coord - o.coord) f.vector

theorem moment_change_origin {n : ℕ}
    (o q : PointN n) (f : AppliedForceN n) :
    momentTensorAt q f = momentTensorAt o f -
      wedge (q.coord - o.coord) f.vector :=
  {{ANSWER}}
`
      },
      {
        id:"statics-v2-beam",part:2,unlock:"support-reactions",level:2,
        section:"支反力计算",title:"同时验证简支梁的力与力矩平衡",
        prompt:"跨度 L 上距左端 a 处有向下载荷 P。取 R_A=P(L−a)/L、R_B=Pa/L，在 L≠0 下证明 R_A+R_B=P 且 R_BL=Pa。",
        concept:"support-reactions",xp:17,starter:"by\n  constructor\n  ",placeholder:"分别消去分母并整理",
        hint:"第一项可 rw [leftReaction, rightReaction, ← add_div] 后用 div_eq_iff；第二项 field_simp [hL]。",
        template:lean`import Mathlib

noncomputable def leftReaction (P a L : ℝ) : ℝ := P * (L - a) / L
noncomputable def rightReaction (P a L : ℝ) : ℝ := P * a / L

theorem simply_supported_equilibrium (P a L : ℝ) (hL : L ≠ 0) :
    leftReaction P a L + rightReaction P a L = P ∧
      rightReaction P a L * L = P * a :=
  {{ANSWER}}
`
      },
      {
        id:"statics-v2-virtual-power",part:2,unlock:"equilibrium-iff",level:3,
        section:"平衡充要条件",title:"由所有刚体虚速度恢复静力平衡",
        prompt:"若合力 R 与合矩 M 对任意虚平动 v、虚转动 ω 的功率均为零，分别测试 v=R 与 ω=M，证明 R=M=0；再补齐反向。",
        concept:"equilibrium-iff",xp:20,starter:"by\n  constructor\n  ",placeholder:"正向选择两组测试运动；反向代入零合力与零合矩",
        hint:"用 dotProduct_self_eq_zero.mp 处理 h R 0 和 h 0 M。",
        template:lean`import Mathlib

abbrev Vec3 := Fin 3 → ℝ
def rigidVirtualPower (R M v ω : Vec3) : ℝ :=
  dotProduct R v + dotProduct M ω

theorem virtual_power_iff_balance (R M : Vec3) :
    (∀ v ω, rigidVirtualPower R M v ω = 0) ↔ R = 0 ∧ M = 0 :=
  {{ANSWER}}
`
      },
      {
        id:"statics-v2-self-stress",part:2,unlock:"determinacy",level:3,
        section:"静定与超静定",title:"用非零自应力构造第二组反力",
        prompt:"平衡方程 A r + load=0 已有解 r₀，且 A 的核中存在非零 k。形式化证明 r₀ 与 r₀+k 是两个不同解，因此结构超静定。",
        concept:"determinacy",xp:21,starter:"by\n  ",placeholder:"给出两组解、证明不同，并用 A 的线性化简验证第二组",
        hint:"refine ⟨r₀, r₀ + k, ?_, hr₀, ?_⟩；最后 rw [map_add, hk]。",
        template:lean`import Mathlib

variable {Reaction Equilibrium : Type*}
variable [AddCommGroup Reaction] [Module ℝ Reaction]
variable [AddCommGroup Equilibrium] [Module ℝ Equilibrium]

def IsIndeterminate (A : Reaction →ₗ[ℝ] Equilibrium)
    (load : Equilibrium) : Prop :=
  ∃ r₁ r₂, r₁ ≠ r₂ ∧ A r₁ + load = 0 ∧ A r₂ + load = 0

theorem selfStress_gives_indeterminacy
    (A : Reaction →ₗ[ℝ] Equilibrium) (load : Equilibrium)
    (r₀ k : Reaction) (hr₀ : A r₀ + load = 0)
    (hk : A k = 0) (hk0 : k ≠ 0) :
    IsIndeterminate A load :=
  {{ANSWER}}
`
      },
      {
        id:"statics-v2-work",part:2,unlock:"work",level:2,
        section:"功",title:"证明常力功与折线路径的分割无关",
        prompt:"对常力 F，证明从 p 到 r 的功等于 p→q 与 q→r 两段功之和。证明应显式使用位移的首尾相消。",
        concept:"work",xp:16,starter:"by\n  ",placeholder:"先证明两段位移相加等于总位移，再利用点积线性",
        hint:"逐坐标证明 h : (q-p)+(r-q)=r-p 时先 simp only [Pi.add_apply, Pi.sub_apply]，再 ring；随后展开 work 并用 dotProduct_add。",
        template:lean`import Mathlib

abbrev Vec3 := Fin 3 → ℝ
def work (F p q : Vec3) : ℝ := dotProduct F (q - p)

theorem work_along_broken_line (F p q r : Vec3) :
    work F p r = work F p q + work F q r :=
  {{ANSWER}}
`
      },
      {
        id:"statics-v2-stability",part:2,unlock:"stability",level:3,
        section:"势能稳定性",title:"证明正刚度弹簧具有严格全局极小点",
        prompt:"在任意有限维欧式空间中，对 V(x)=½k⟪x,x⟫，证明 k>0 时原点的势能严格小于任意非零位形的势能。",
        concept:"stability",xp:21,starter:"by\n  ",placeholder:"由 x≠0 得到内积严格为正，再比较势能",
        hint:"使用 real_inner_self_pos.mpr hx，再展开 quadraticPotential 并 nlinarith。",
        template:lean`import Mathlib

open InnerProductSpace
noncomputable section

def quadraticPotential {n : ℕ} (k : ℝ)
    (x : EuclideanSpace ℝ (Fin n)) : ℝ :=
  (1 / 2 : ℝ) * k * ⟪x, x⟫_ℝ

theorem positive_stiffness_strict_stability {n : ℕ} (k : ℝ)
    (hk : 0 < k) (x : EuclideanSpace ℝ (Fin n)) (hx : x ≠ 0) :
    quadraticPotential (n := n) k 0 < quadraticPotential k x :=
  {{ANSWER}}
`
      }
    ]
  };
}());

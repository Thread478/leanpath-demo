/* LeanPath Physics · Units and dimensions writing laboratory. */
(function () {
  const basePrelude = "import Mathlib\n\ninductive BaseDimension where\n  | time | length | mass | electricCurrent\n  | temperature | amountOfSubstance | luminousIntensity\n  deriving DecidableEq, Repr\n\nabbrev Dim := BaseDimension → Int\n";
  const opsPrelude = basePrelude + "\ndef basis (b : BaseDimension) : Dim :=\n  fun i => if i = b then 1 else 0\n\ndef dimOne : Dim := fun _ => 0\ndef dimMul (d₁ d₂ : Dim) : Dim := fun b => d₁ b + d₂ b\ndef dimInv (d : Dim) : Dim := fun b => -d b\ndef dimDiv (d₁ d₂ : Dim) : Dim := dimMul d₁ (dimInv d₂)\ndef dimPow (d : Dim) (n : Int) : Dim := fun b => n * d b\n\ndef timeDim : Dim := basis .time\ndef lengthDim : Dim := basis .length\ndef massDim : Dim := basis .mass\ndef currentDim : Dim := basis .electricCurrent\n";

  window.LEANPATH_WRITING_BANK = {
    version: 4,
    tasks: [
      {
        id:"unit-write-symbol",level:1,section:"SI 基本量",title:"写出七个基本单位符号",
        prompt:"用模式匹配补全 baseUnitSymbol，依次返回 s、m、kg、A、K、mol、cd。",
        concept:"si-seven",xp:6,starter:"fun\n  ",placeholder:"逐一匹配七个构造器",
        hint:"每个分支形如 | .time => \"s\"；七个构造器必须全部覆盖。",
        template:"import Mathlib\n\ninductive BaseDimension where\n  | time | length | mass | electricCurrent\n  | temperature | amountOfSubstance | luminousIntensity\n\ndef baseUnitSymbol : BaseDimension → String :=\n  {{ANSWER}}\n\nexample : baseUnitSymbol .time = \"s\" := by rfl\nexample : baseUnitSymbol .mass = \"kg\" := by rfl\nexample : baseUnitSymbol .luminousIntensity = \"cd\" := by rfl\n"
      },
      {
        id:"unit-write-length-basis",level:1,section:"量纲构造",title:"构造长度基量纲",
        prompt:"补全 lengthDim：长度分量为 1，其他六个分量为 0。",
        concept:"dimension-vector",xp:7,starter:"fun b =>\n  ",placeholder:"判断 b 是否等于 .length",
        hint:"可使用 if b = .length then 1 else 0。",
        template:basePrelude + "\ndef lengthDim : Dim :=\n  {{ANSWER}}\n\nexample : lengthDim .length = 1 := by rfl\nexample : lengthDim .time = 0 := by rfl\nexample : lengthDim .mass = 0 := by rfl\n"
      },
      {
        id:"unit-write-dim-mul",level:1,section:"量纲代数",title:"实现量纲乘法",
        prompt:"补全 dimMul，使两个量纲的每个基本指数相加。",
        concept:"dimension-algebra",xp:8,starter:"fun b =>\n  ",placeholder:"相加 d₁ 与 d₂ 在 b 上的指数",
        hint:"d₁ b 和 d₂ b 是对应分量的两个整数指数。",
        template:basePrelude + "\ndef dimMul (d₁ d₂ : Dim) : Dim :=\n  {{ANSWER}}\n\nexample (d₁ d₂ : Dim) (b : BaseDimension) :\n    dimMul d₁ d₂ b = d₁ b + d₂ b := by rfl\n"
      },
      {
        id:"unit-write-dim-inv",level:1,section:"量纲代数",title:"实现逆量纲",
        prompt:"补全 dimInv：把每个基本指数取负。",
        concept:"dimension-algebra",xp:8,starter:"fun b =>\n  ",placeholder:"返回 d b 的相反数",
        hint:"整数取负写作 -d b。",
        template:basePrelude + "\ndef dimInv (d : Dim) : Dim :=\n  {{ANSWER}}\n\nexample (d : Dim) (b : BaseDimension) : dimInv d b = -d b := by rfl\n"
      },
      {
        id:"unit-write-dim-power",level:1,section:"量纲代数",title:"实现量纲整数幂",
        prompt:"补全 dimPow，使每个指数乘以整数 n。",
        concept:"dimension-algebra",xp:8,starter:"fun b =>\n  ",placeholder:"用 n 缩放 d b",
        hint:"结果分量为 n * d b。",
        template:basePrelude + "\ndef dimPow (d : Dim) (n : Int) : Dim :=\n  {{ANSWER}}\n\nexample (d : Dim) (n : Int) (b : BaseDimension) :\n    dimPow d n b = n * d b := by rfl\n"
      },
      {
        id:"unit-write-speed",level:2,section:"导出量纲",title:"由长度和时间构造速度",
        prompt:"补全 speedDim，使它等于长度量纲除以时间量纲。",
        concept:"derived-dimension",xp:9,starter:"",placeholder:"调用 dimDiv",
        hint:"长度除时间写作 dimDiv lengthDim timeDim。",
        template:opsPrelude + "\ndef speedDim : Dim :=\n  {{ANSWER}}\n\nexample : speedDim .length = 1 := by rfl\nexample : speedDim .time = -1 := by rfl\nexample : speedDim .mass = 0 := by rfl\n"
      },
      {
        id:"unit-write-acceleration",level:2,section:"导出量纲",title:"构造加速度量纲",
        prompt:"已定义 speedDim，补全 accelerationDim = speed/time。",
        concept:"derived-dimension",xp:9,starter:"",placeholder:"速度量纲再除以时间量纲",
        hint:"调用 dimDiv speedDim timeDim。",
        template:opsPrelude + "\ndef speedDim : Dim := dimDiv lengthDim timeDim\n\ndef accelerationDim : Dim :=\n  {{ANSWER}}\n\nexample : accelerationDim .length = 1 := by rfl\nexample : accelerationDim .time = -2 := by rfl\n"
      },
      {
        id:"unit-write-energy",level:2,section:"导出量纲",title:"从力构造能量量纲",
        prompt:"补全 energyDim：先由质量和加速度得到力，再让力乘长度。",
        concept:"derived-dimension",xp:10,starter:"",placeholder:"组合 forceDim 与 lengthDim",
        hint:"量纲乘法使用 dimMul；energyDim = dimMul forceDim lengthDim。",
        template:opsPrelude + "\ndef speedDim : Dim := dimDiv lengthDim timeDim\ndef accelerationDim : Dim := dimDiv speedDim timeDim\ndef forceDim : Dim := dimMul massDim accelerationDim\n\ndef energyDim : Dim :=\n  {{ANSWER}}\n\nexample : energyDim .mass = 1 := by rfl\nexample : energyDim .length = 2 := by rfl\nexample : energyDim .time = -2 := by rfl\n"
      },
      {
        id:"unit-write-cancel",level:2,section:"无量纲量",title:"证明同量纲相除为无量纲",
        prompt:"证明任意 d 除以自身得到零指数向量 dimOne。",
        concept:"dimensionless",xp:10,starter:"by\n  funext b\n  ",placeholder:"展开定义并化简整数加法",
        hint:"simp [dimDiv, dimMul, dimInv, dimOne] 可以处理 x + -x。",
        template:opsPrelude + "\ntheorem self_div_dimensionless (d : Dim) : dimDiv d d = dimOne :=\n  {{ANSWER}}\n"
      },
      {
        id:"unit-write-kmh",level:2,section:"单位换算",title:"严格证明 36 km/h = 10 m/s",
        prompt:"完成实数上的精确单位换算等式。",
        concept:"scale-conversion",xp:10,starter:"by\n  ",placeholder:"使用数值归一化",
        hint:"norm_num 会把闭合的有理数表达式精确归一化。",
        template:"import Mathlib\n\ntheorem thirtySix_kmh_in_mps :\n    (36 : ℝ) * 1000 / 3600 = 10 :=\n  {{ANSWER}}\n"
      },
      {
        id:"unit-write-area",level:2,section:"单位换算",title:"证明面积换算因子平方",
        prompt:"证明 3 km² = 3 000 000 m²。",
        concept:"scale-conversion",xp:10,starter:"by\n  ",placeholder:"使用 norm_num",
        hint:"长度因子 1000 需要整体平方。",
        template:"import Mathlib\n\ntheorem three_square_kilometers :\n    (3 : ℝ) * 1000^2 = 3_000_000 :=\n  {{ANSWER}}\n"
      },
      {
        id:"unit-write-temperature",level:2,section:"仿射单位",title:"区分绝对温度与温差",
        prompt:"证明摄氏温标平移后，20 ℃ 与 10 ℃ 的温差仍是 10 K。",
        concept:"affine-unit",xp:11,starter:"by\n  ",placeholder:"精确化简小数",
        hint:"Lean 把十进制字面量精确解释为有理数；使用 norm_num。",
        template:"import Mathlib\n\ntheorem celsius_difference :\n    ((20 : ℝ) + 273.15) - ((10 : ℝ) + 273.15) = 10 :=\n  {{ANSWER}}\n"
      },
      {
        id:"unit-write-safe-add",level:3,section:"依赖类型物理量",title:"实现同量纲加法",
        prompt:"补全 Quantity.add；输入和输出共享量纲 d。",
        concept:"typed-quantity",xp:12,starter:"",placeholder:"构造 value 字段",
        hint:"使用 { value := x.value + y.value }。",
        template:opsPrelude + "\nstructure Quantity (d : Dim) where\n  value : ℝ\n\ndef Quantity.add {d : Dim} (x y : Quantity d) : Quantity d :=\n  {{ANSWER}}\n\nexample {d : Dim} (x y : Quantity d) :\n    (Quantity.add x y).value = x.value + y.value := by rfl\n"
      },
      {
        id:"unit-write-safe-mul",level:3,section:"依赖类型物理量",title:"实现量纲合成乘法",
        prompt:"补全 Quantity.mul，使返回类型的量纲索引为 dimMul d₁ d₂。",
        concept:"typed-operations",xp:12,starter:"",placeholder:"相乘底层 value 并构造结果",
        hint:"结果字段为 x.value * y.value；目标类型已经给出正确量纲。",
        template:opsPrelude + "\nstructure Quantity (d : Dim) where\n  value : ℝ\n\ndef Quantity.mul {d₁ d₂ : Dim} (x : Quantity d₁) (y : Quantity d₂) :\n    Quantity (dimMul d₁ d₂) :=\n  {{ANSWER}}\n\nexample {d₁ d₂ : Dim} (x : Quantity d₁) (y : Quantity d₂) :\n    (Quantity.mul x y).value = x.value * y.value := by rfl\n"
      },
      {
        id:"unit-write-speed-time",level:3,section:"量纲齐次性",title:"证明速度乘时间得到长度",
        prompt:"逐分量证明 dimMul speedDim timeDim = lengthDim。",
        concept:"dimension-equality",xp:12,starter:"by\n  funext b\n  ",placeholder:"对七个基本量分类",
        hint:"cases b 后每个分量都是可归约的闭合整数等式。",
        template:opsPrelude + "\ndef speedDim : Dim := dimDiv lengthDim timeDim\n\ntheorem speed_times_time : dimMul speedDim timeDim = lengthDim :=\n  {{ANSWER}}\n"
      },
      {
        id:"unit-write-kinetic-dimension",level:3,section:"量纲齐次性",title:"验证动能量纲",
        prompt:"证明质量乘速度平方的量纲等于能量量纲。",
        concept:"homogeneity",xp:14,starter:"by\n  funext b\n  ",placeholder:"对基本量分类并归约",
        hint:"cases b <;> rfl 可以验证七个闭合指数分量。",
        template:opsPrelude + "\ndef speedDim : Dim := dimDiv lengthDim timeDim\ndef accelerationDim : Dim := dimDiv speedDim timeDim\ndef forceDim : Dim := dimMul massDim accelerationDim\ndef energyDim : Dim := dimMul forceDim lengthDim\n\ntheorem kinetic_energy_dimension :\n    dimMul massDim (dimPow speedDim 2) = energyDim :=\n  {{ANSWER}}\n"
      },
      {
        id:"unit-write-physlib",level:3,section:"Physlib",title:"引用 Physlib 的精确换算定理",
        prompt:"调用 Physlib 已验证定理，证明 1 km/h 在 SI 中是 5/18 m/s。",
        concept:"physlib-withdim",xp:14,starter:"by\n  ",placeholder:"使用 exact 和完整限定名",
        hint:"目标与 DimSpeed.oneKilometerPerHour_in_SI 的类型一致。",
        template:"import Physlib.Units.WithDim.Speed\n\nopen LTMCTUnitChoices\n\nexample : DimSpeed.oneKilometerPerHour SI = ⟨5 / 18⟩ :=\n  {{ANSWER}}\n"
      },
      {
        id:"statics-write-vec3",part:2,unlock:"euclidean-vectors",level:1,section:"欧式向量",title:"构造三维零向量",
        prompt:"补全 Vec3 的零向量定义；每个 Fin 3 坐标都取 0。",
        concept:"euclidean-space",xp:8,starter:"fun _ =>\n  ",placeholder:"返回实数 0",
        hint:"Vec3 是 Fin 3 → ℝ，因此答案是一个接收坐标索引的函数。",
        template:"import Mathlib\n\nabbrev Vec3 := Fin 3 → ℝ\n\ndef zeroVec : Vec3 :=\n  {{ANSWER}}\n\nexample (i : Fin 3) : zeroVec i = 0 := by rfl\n"
      },
      {
        id:"statics-write-dot",part:2,unlock:"inner-metric",level:1,section:"内积与度量",title:"调用 Mathlib 点积",
        prompt:"补全 dot，让它复用 Mathlib 的 dotProduct。",
        concept:"dot-metric",xp:9,starter:"",placeholder:"填写完整限定名",
        hint:"直接写 dotProduct。",
        template:"import Mathlib\n\nabbrev Vec3 := Fin 3 → ℝ\n\ndef dot (v w : Vec3) : ℝ :=\n  {{ANSWER}}\n\nexample (v w : Vec3) : dot v w = dotProduct v w := by rfl\n"
      },
      {
        id:"statics-write-displacement",part:2,unlock:"affine-points",level:1,section:"仿射点",title:"定义两点位移",
        prompt:"补全从 p 指向 q 的位移，注意终点减起点。",
        concept:"affine-space",xp:9,starter:"",placeholder:"使用 q.coord 与 p.coord",
        hint:"写作 q.coord - p.coord。",
        template:"import Mathlib\n\nabbrev Vec3 := Fin 3 → ℝ\nstructure Point3 where coord : Vec3\n\ndef displacement (p q : Point3) : Vec3 :=\n  {{ANSWER}}\n\nexample (p : Point3) : displacement p p = 0 := by\n  simp [displacement]\n"
      },
      {
        id:"statics-write-force",part:2,unlock:"applied-force",level:1,section:"集中力",title:"构造作用力",
        prompt:"补全 mkForce，把作用点 p 与力向量 f 放进 AppliedForce。",
        concept:"force-vector",xp:9,starter:"",placeholder:"使用结构字段语法",
        hint:"答案形如 { point := p, vector := f }。",
        template:"import Mathlib\n\nabbrev Vec3 := Fin 3 → ℝ\nstructure Point3 where coord : Vec3\nstructure AppliedForce where\n  point : Point3\n  vector : Vec3\n\ndef mkForce (p : Point3) (f : Vec3) : AppliedForce :=\n  {{ANSWER}}\n\nexample (p : Point3) (f : Vec3) : (mkForce p f).vector = f := by rfl\n"
      },
      {
        id:"statics-write-resultant",part:2,unlock:"force-system",level:2,section:"力系",title:"递归定义合力",
        prompt:"用列表模式匹配补全 resultant：空表为零，非空表把首力向量与余项合力相加。",
        concept:"force-system",xp:11,starter:"fun\n  | [] => 0\n  ",placeholder:"补全 cons 分支",
        hint:"第二个分支形如 | f :: rest => f.vector + resultant rest。",
        template:"import Mathlib\n\nabbrev Vec3 := Fin 3 → ℝ\nstructure Point3 where coord : Vec3\nstructure AppliedForce where point : Point3; vector : Vec3\n\ndef resultant : List AppliedForce → Vec3 :=\n  {{ANSWER}}\n\nexample : resultant [] = 0 := by rfl\n"
      },
      {
        id:"statics-write-moment",part:2,unlock:"moment",level:2,section:"力矩",title:"用叉积定义力矩",
        prompt:"补全关于 o 的力矩：(作用点−参考点) 叉乘力向量。",
        concept:"moment-cross",xp:12,starter:"",placeholder:"调用 crossProduct",
        hint:"crossProduct (f.point.coord - o.coord) f.vector。",
        template:"import Mathlib.LinearAlgebra.CrossProduct\n\nabbrev Vec3 := Fin 3 → ℝ\nstructure Point3 where coord : Vec3\nstructure AppliedForce where point : Point3; vector : Vec3\n\ndef momentAt (o : Point3) (f : AppliedForce) : Vec3 :=\n  {{ANSWER}}\n\nexample (o : Point3) (F : Vec3) :\n    momentAt o { point := o, vector := F } = 0 := by\n  simp [momentAt]\n"
      },
      {
        id:"statics-write-cross-self",part:2,unlock:"moment",level:2,section:"力矩",title:"引用叉积自反为零",
        prompt:"调用 Mathlib 定理证明任意向量与自身叉积为零。",
        concept:"moment-cross",xp:12,starter:"by\n  ",placeholder:"使用 exact 与 cross_self",
        hint:"目标正是 cross_self v。",
        template:"import Mathlib.LinearAlgebra.CrossProduct\n\nabbrev Vec3 := Fin 3 → ℝ\n\nexample (v : Vec3) : crossProduct v v = 0 :=\n  {{ANSWER}}\n"
      },
      {
        id:"statics-write-shift",part:2,unlock:"moment-shift",level:3,section:"移矩定理",title:"证明单个力的移矩公式",
        prompt:"展开三维叉积坐标，证明换参考点的力矩公式。",
        concept:"moment-origin",xp:15,starter:"by\n  ext i\n  fin_cases i <;>\n    ",placeholder:"展开并交给 ring",
        hint:"simp [momentAt, cross_apply] <;> ring。",
        template:"import Mathlib.LinearAlgebra.CrossProduct\n\nabbrev Vec3 := Fin 3 → ℝ\nstructure Point3 where coord : Vec3\nstructure AppliedForce where point : Point3; vector : Vec3\n\ndef momentAt (o : Point3) (f : AppliedForce) : Vec3 :=\n  crossProduct (f.point.coord - o.coord) f.vector\n\ntheorem momentAt_change_origin (o q : Point3) (f : AppliedForce) :\n    momentAt q f = momentAt o f -\n      crossProduct (q.coord - o.coord) f.vector :=\n  {{ANSWER}}\n"
      },
      {
        id:"statics-write-balance",part:2,unlock:"equilibrium",level:2,section:"静力平衡",title:"组合平动与转动平衡",
        prompt:"补全 IsBalanced，把合力为零与总力矩为零组成合取。",
        concept:"equilibrium-balance",xp:12,starter:"",placeholder:"写出两个等式的 ∧",
        hint:"resultant S = 0 ∧ totalMoment S = 0。",
        template:"import Mathlib\n\nabbrev Vec3 := Fin 3 → ℝ\nvariable {AppliedForce : Type}\nvariable (resultant totalMoment : List AppliedForce → Vec3)\n\ndef IsBalanced (S : List AppliedForce) : Prop :=\n  {{ANSWER}}\n\nexample (S : List AppliedForce) (h : IsBalanced resultant totalMoment S) :\n    resultant S = 0 := h.1\n"
      },
      {
        id:"statics-write-virtual-power",part:2,unlock:"equilibrium-iff",level:2,section:"平衡充要条件",title:"定义刚体虚功率",
        prompt:"补全 R、M 对虚平动 v 与虚转动 ω 的配对。",
        concept:"rigid-virtual-motion",xp:13,starter:"",placeholder:"两个点积相加",
        hint:"dotProduct R v + dotProduct M ω。",
        template:"import Mathlib\n\nabbrev Vec3 := Fin 3 → ℝ\n\ndef rigidVirtualPower (R M v ω : Vec3) : ℝ :=\n  {{ANSWER}}\n\nexample (v ω : Vec3) : rigidVirtualPower 0 0 v ω = 0 := by\n  simp [rigidVirtualPower]\n"
      },
      {
        id:"statics-write-equilibrium-iff",part:2,unlock:"equilibrium-iff",level:3,section:"平衡充要条件",title:"用虚功率反推出平衡",
        prompt:"证明若所有 v、ω 上的虚功率为零，则 R=M=0。",
        concept:"rigid-virtual-motion",xp:16,starter:"by\n  intro h\n  constructor\n  ",placeholder:"分别测试 (R,0) 与 (0,M)",
        hint:"从 h R 0 与 h 0 M 得到自点积为零，再用 dotProduct_self_eq_zero.mp。",
        template:"import Mathlib\n\nabbrev Vec3 := Fin 3 → ℝ\n\ndef rigidVirtualPower (R M v ω : Vec3) : ℝ :=\n  dotProduct R v + dotProduct M ω\n\ntheorem virtualPower_zero_implies_balance (R M : Vec3)\n    (h : ∀ v ω, rigidVirtualPower R M v ω = 0) : R = 0 ∧ M = 0 :=\n  {{ANSWER}}\n"
      },
      {
        id:"statics-write-beam",part:2,unlock:"support-reactions",level:2,section:"支反力",title:"验证简支梁反力",
        prompt:"在 L≠0 下验证 R_B=P a/L 满足关于 A 的力矩方程。",
        concept:"reactions",xp:13,starter:"by\n  ",placeholder:"消去分母并归一化",
        hint:"field_simp [hL] 后 ring。",
        template:"import Mathlib\n\ndef reactionB (P a L : ℝ) : ℝ := P * a / L\n\ntheorem reactionB_moment (P a L : ℝ) (hL : L ≠ 0) :\n    reactionB P a L * L = P * a :=\n  {{ANSWER}}\n"
      },
      {
        id:"statics-write-determinate",part:2,unlock:"determinacy",level:2,section:"静定性",title:"用 ∃! 定义静定",
        prompt:"补全定义：给定平衡算子 A 与载荷 load，存在唯一反力 r 使 A r + load = 0。",
        concept:"static-determinacy",xp:13,starter:"",placeholder:"使用 ∃! r, ...",
        hint:"写作 ∃! r, A r + load = 0。",
        template:"import Mathlib\n\nvariable {R E : Type*} [AddCommGroup R] [AddCommGroup E]\nvariable [Module ℝ R] [Module ℝ E]\n\ndef IsStaticallyDeterminate (A : R →ₗ[ℝ] E) (load : E) : Prop :=\n  {{ANSWER}}\n"
      },
      {
        id:"statics-write-selfstress",part:2,unlock:"determinacy",level:3,section:"超静定",title:"由自应力生成另一组解",
        prompt:"证明 r₀ 是解且非零 k 在 A 的核中时，r₀+k 仍是解。",
        concept:"self-stress",xp:15,starter:"by\n  ",placeholder:"用 map_add、hr 与 hk 化简",
        hint:"simp [map_add, hr, hk]。",
        template:"import Mathlib\n\nvariable {R E : Type*} [AddCommGroup R] [AddCommGroup E]\nvariable [Module ℝ R] [Module ℝ E]\n\ntheorem add_selfStress_is_solution (A : R →ₗ[ℝ] E) (load : E)\n    (r₀ k : R) (hr : A r₀ + load = 0) (hk : A k = 0) :\n    A (r₀ + k) + load = 0 :=\n  {{ANSWER}}\n"
      },
      {
        id:"statics-write-work",part:2,unlock:"work",level:2,section:"功",title:"证明常力功分段可加",
        prompt:"证明从 p 经 q 到 r 的两段常力功等于直接从 p 到 r 的功。",
        concept:"work-dot",xp:14,starter:"by\n  ",placeholder:"展开 work 和 dotProduct 后线性化简",
        hint:"simp [work, sub_eq_add_neg, dotProduct_add]；必要时 ring。",
        template:"import Mathlib\n\nabbrev Vec3 := Fin 3 → ℝ\n\ndef work (F p q : Vec3) : ℝ := dotProduct F (q - p)\n\ntheorem work_add (F p q r : Vec3) :\n    work F p r = work F p q + work F q r :=\n  {{ANSWER}}\n"
      },
      {
        id:"statics-write-potential",part:2,unlock:"potential",level:2,section:"势能",title:"调用 Physlib 求二次势能梯度",
        prompt:"复用 gradient_const_mul_inner_self，证明 V(x)=½k⟪x,x⟫ 的梯度是 k•x。",
        concept:"conservative-potential",xp:14,starter:"by\n  ",placeholder:"使用 Physlib 梯度定理并化简系数",
        hint:"先 change 展开 springPotential，再 rw [gradient_const_mul_inner_self]，最后用 module 化简数乘。",
        template:"import Mathlib\nimport Physlib.Mathematics.Calculus.Gradient\n\nopen InnerProductSpace\nnoncomputable section\n\nvariable {n : ℕ}\n\ndef springPotential (k : ℝ) (x : EuclideanSpace ℝ (Fin n)) : ℝ :=\n  (1 / 2 : ℝ) * k * ⟪x, x⟫_ℝ\n\ntheorem springPotential_gradient (k : ℝ)\n    (x : EuclideanSpace ℝ (Fin n)) :\n    gradient (springPotential k) x = k • x :=\n  {{ANSWER}}\n"
      },
      {
        id:"statics-write-virtual-work",part:2,unlock:"virtual-work",level:3,section:"虚功",title:"自由刚体虚功等价于平衡",
        prompt:"在已给出的反向引理基础上，完成“所有虚功为零 iff R=M=0”的正向方向。",
        concept:"virtual-work",xp:16,starter:"by\n  constructor\n  · exact virtualPower_zero_implies_balance R M\n  ",placeholder:"代入 h.1、h.2 并 simp",
        hint:"第二方向 intro h v ω; simp [rigidVirtualPower, h.1, h.2]。",
        template:"import Mathlib\n\nabbrev Vec3 := Fin 3 → ℝ\n\ndef rigidVirtualPower (R M v ω : Vec3) : ℝ :=\n  dotProduct R v + dotProduct M ω\n\ntheorem virtualPower_zero_implies_balance (R M : Vec3)\n    (h : ∀ v ω, rigidVirtualPower R M v ω = 0) : R = 0 ∧ M = 0 := by\n  constructor\n  · apply dotProduct_self_eq_zero.mp\n    simpa [rigidVirtualPower] using h R 0\n  · apply dotProduct_self_eq_zero.mp\n    simpa [rigidVirtualPower] using h 0 M\n\ntheorem virtualWork_iff_balance (R M : Vec3) :\n    (∀ v ω, rigidVirtualPower R M v ω = 0) ↔ R = 0 ∧ M = 0 :=\n  {{ANSWER}}\n"
      },
      {
        id:"statics-write-stability",part:2,unlock:"stability",level:3,section:"能量稳定性",title:"证明正刚度给出严格极小",
        prompt:"在 k>0 且 x≠0 时证明二次势能在 x 比在 0 大。",
        concept:"stability-energy",xp:16,starter:"by\n  ",placeholder:"展开定义并使用平方为正",
        hint:"have hx2 : 0 < x^2 := sq_pos_of_ne_zero hx；再 nlinarith。",
        template:"import Mathlib\n\ndef scalarPotential (k x : ℝ) : ℝ := (1 / 2 : ℝ) * k * x^2\n\ntheorem positive_stiffness_strict_min (k x : ℝ)\n    (hk : 0 < k) (hx : x ≠ 0) :\n    scalarPotential k 0 < scalarPotential k x :=\n  {{ANSWER}}\n"
      },
      {
        id:"statics-write-physlib",part:2,unlock:"statics-physlib",level:3,section:"Mathlib / Physlib",title:"检查静力学所需库接口",
        prompt:"补全示例：直接引用 Mathlib 已验证的叉积自反为零定理。上方 #check 同时展示 Physlib 梯度桥。",
        concept:"library-statics",xp:16,starter:"by\n  ",placeholder:"exact cross_self v",
        hint:"直接引用 cross_self。",
        template:"import Mathlib.LinearAlgebra.CrossProduct\nimport Physlib.Mathematics.Calculus.Gradient\n\n#check gradient_inner_self\nabbrev Vec3 := Fin 3 → ℝ\n\nexample (v : Vec3) : crossProduct v v = 0 :=\n  {{ANSWER}}\n"
      }
    ]
  };
}());

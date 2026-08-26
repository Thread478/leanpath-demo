/* Progressive code exhibits unlocked by course completion. */
(function () {
  window.LEANPATH_SHOWCASE = {
    version: 4,
    entries: [
      {
        id:"showcase-si-seven",
        unlock:"si-base",
        part:1,
        title:"SI 七个基本量",
        summary:"用归纳类型完整枚举 SI 基本量，并为后续模式匹配提供有限、无遗漏的分类。",
        origin:"LeanPath 教学模型 · 自定义代码",
        filename:"SIBaseDimensions.lean",
        code:"import Mathlib\n\ninductive BaseDimension where\n  | time\n  | length\n  | mass\n  | electricCurrent\n  | temperature\n  | amountOfSubstance\n  | luminousIntensity\n  deriving DecidableEq, Repr\n\ndef baseUnitSymbol : BaseDimension → String\n  | .time => \"s\"\n  | .length => \"m\"\n  | .mass => \"kg\"\n  | .electricCurrent => \"A\"\n  | .temperature => \"K\"\n  | .amountOfSubstance => \"mol\"\n  | .luminousIntensity => \"cd\"\n"
      },
      {
        id:"showcase-dimension-algebra",
        unlock:"dimension-ops",
        part:1,
        title:"量纲指数与代数运算",
        summary:"把量纲构造成七个整数指数，并让乘、除、逆、整数幂对应指数向量运算。",
        origin:"LeanPath 教学模型 · 自定义代码",
        filename:"DimensionAlgebra.lean",
        code:"import Mathlib\n\ninductive BaseDimension where\n  | time | length | mass | electricCurrent\n  | temperature | amountOfSubstance | luminousIntensity\n  deriving DecidableEq\n\nstructure Dimension where\n  exponent : BaseDimension → ℤ\n\ninstance : One Dimension := ⟨⟨fun _ => 0⟩⟩\ninstance : Mul Dimension :=\n  ⟨fun d₁ d₂ => ⟨fun b => d₁.exponent b + d₂.exponent b⟩⟩\ninstance : Inv Dimension :=\n  ⟨fun d => ⟨fun b => -d.exponent b⟩⟩\ninstance : Div Dimension := ⟨fun d₁ d₂ => d₁ * d₂⁻¹⟩\ninstance : HPow Dimension ℤ Dimension :=\n  ⟨fun d n => ⟨fun b => n * d.exponent b⟩⟩\n"
      },
      {
        id:"showcase-typed-quantity",
        unlock:"typed-ops",
        part:1,
        title:"类型安全的物理量",
        summary:"Quantity d 将量纲变成类型索引：同量纲量才能相加，乘除在返回类型中计算新量纲。",
        origin:"LeanPath 教学模型 · 自定义代码；设计思想与上游带量纲接口相衔接",
        filename:"TypedQuantity.lean",
        code:"import Mathlib\n\nvariable {Dimension : Type} [Mul Dimension] [Div Dimension]\n\nstructure Quantity (d : Dimension) where\n  value : ℝ\n\ndef Quantity.add {d : Dimension}\n    (x y : Quantity d) : Quantity d :=\n  ⟨x.value + y.value⟩\n\ndef Quantity.mul {d₁ d₂ : Dimension}\n    (x : Quantity d₁) (y : Quantity d₂) :\n    Quantity (d₁ * d₂) :=\n  ⟨x.value * y.value⟩\n\nnoncomputable def Quantity.div {d₁ d₂ : Dimension}\n    (x : Quantity d₁) (y : Quantity d₂) :\n    Quantity (d₁ / d₂) :=\n  ⟨x.value / y.value⟩\n"
      },
      {
        id:"showcase-physlib-bridge",
        unlock:"physlib-units",
        part:1,
        title:"从 PhysLean 传统连接现行 Physlib",
        summary:"原 PhysLean（更早名为 HepLean）已合并进入现行 Physlib；这里使用当前 Physlib.* 导入路径，复用 1 km/h 的精确 SI 换算定理。",
        origin:"上游真实接口 · 源自 PhysLean，当前项目/包名为 Physlib",
        filename:"PhyslibUnits.lean",
        code:"import Physlib.Units.Dimension\nimport Physlib.Units.WithDim.Basic\nimport Physlib.Units.WithDim.Speed\n\nopen LTMCTUnitChoices\n\n#check Dimension\n#check WithDim\n#check DimSpeed.oneKilometerPerHour_in_SI\n\nexample : DimSpeed.oneKilometerPerHour SI = ⟨5 / 18⟩ := by\n  exact DimSpeed.oneKilometerPerHour_in_SI\n"
      },
      {
        id:"showcase-unit-complete",
        unlock:"chest",
        part:1,
        title:"第一部分完整成果 · 单位与量纲",
        summary:"完整、可复制的 LeanPath 章节成果：本站定义 SI 教学模型、量纲代数、单位制与 Quantity d，并在末尾连接源自 PhysLean、现属于 Physlib 的单位定理。",
        origin:"LeanPath 完整成果 · 自定义主体 + 现行 Physlib 单位接口",
        filename:"UnitAndDimension.lean",
        file:"lean/UnitAndDimension.lean",
        completion:true,
        milestones:[
          "七个 SI 基本量与单位",
          "整数指数向量和逐分量外延性",
          "乘法、除法、逆与整数幂",
          "速度、加速度、力、能量、功率、压强、电荷和电压",
          "速度×时间、动能、压强×体积等量纲恒等式",
          "线性单位、仿射温标与单位制的类型化构造",
          "Quantity d 的同量纲加法和量纲合成乘除",
          "36 km/h = 10 m/s 的精确证明",
          "原 PhysLean、现 Physlib 单位换算定理复用"
        ]
      },
      {
        id:"showcase-euclidean-vectors",
        unlock:"inner-metric",
        part:2,
        title:"欧式向量与内积",
        summary:"以 Fin n → ℝ 构造透明的一般有限维坐标，再把 Vec3 作为专门化；直接复用 Mathlib 点积正定性，为平衡充要条件准备数学基础。",
        origin:"LeanPath 教学模型 · 底层定理来自 Mathlib",
        filename:"EuclideanVectors.lean",
        code:"import Mathlib\n\nabbrev VecN (n : ℕ) := Fin n → ℝ\nabbrev Vec3 := VecN 3\n\ndef dot {n : ℕ} (v w : VecN n) : ℝ := dotProduct v w\ndef normSq {n : ℕ} (v : VecN n) : ℝ := dot v v\n\ntheorem normSq_eq_zero_iff {n : ℕ} (v : VecN n) :\n    normSq v = 0 ↔ v = 0 := by\n  simpa [normSq, dot] using\n    (dotProduct_self_eq_zero (v := v))\n"
      },
      {
        id:"showcase-force-moment",
        unlock:"moment-shift",
        part:2,
        title:"一般维力矩与三维叉积",
        summary:"用反对称矩阵透明实现 ℝⁿ 中的二阶张量力矩，证明反对称性与一般维移矩公式；三维叉积作为 Hodge 对偶专门化保留。",
        origin:"LeanPath 自主形式化 · 矩阵与三维叉积来自 Mathlib",
        filename:"ForceAndMoment.lean",
        code:"import Mathlib\nimport Mathlib.LinearAlgebra.CrossProduct\n\nabbrev VecN (n : ℕ) := Fin n → ℝ\nabbrev MomentTensor (n : ℕ) := Matrix (Fin n) (Fin n) ℝ\n\ndef wedge {n : ℕ} (r F : VecN n) : MomentTensor n :=\n  fun i j => r i * F j - r j * F i\n\ntheorem wedge_skew {n : ℕ} (r F : VecN n) (i j : Fin n) :\n    wedge r F i j = -wedge r F j i := by\n  simp [wedge]\n  ring\n\nstructure PointN (n : ℕ) where coord : VecN n\nstructure AppliedForceN (n : ℕ) where\n  point : PointN n\n  vector : VecN n\n\ndef momentTensorAt {n : ℕ} (o : PointN n)\n    (f : AppliedForceN n) : MomentTensor n :=\n  wedge (f.point.coord - o.coord) f.vector\n\n-- M_q = M_o - (q-o) ∧ resultant\n-- n = 3 时，Hodge 对偶恢复 crossProduct。\n"
      },
      {
        id:"showcase-equilibrium",
        unlock:"equilibrium-iff",
        part:2,
        title:"平衡与刚体虚功率",
        summary:"把平动、转动条件组合成刚体平衡，并用内积正定性证明：任意刚体虚运动上的功率为零，当且仅当合力与合力矩都为零。",
        origin:"LeanPath 自主形式化 · 内积正定性来自 Mathlib",
        filename:"RigidEquilibrium.lean",
        code:"import Mathlib\n\nabbrev Vec3 := Fin 3 → ℝ\n\ndef rigidVirtualPower (R M v ω : Vec3) : ℝ :=\n  dotProduct R v + dotProduct M ω\n\ntheorem virtualPower_zero_iff (R M : Vec3) :\n    (∀ v ω, rigidVirtualPower R M v ω = 0) ↔\n      R = 0 ∧ M = 0 := by\n  constructor\n  · intro h\n    constructor\n    · apply dotProduct_self_eq_zero.mp\n      simpa [rigidVirtualPower] using h R 0\n    · apply dotProduct_self_eq_zero.mp\n      simpa [rigidVirtualPower] using h 0 M\n  · rintro ⟨rfl, rfl⟩ v ω\n    simp [rigidVirtualPower]\n"
      },
      {
        id:"showcase-energy-stability",
        unlock:"stability",
        part:2,
        title:"虚功与二次势能稳定性",
        summary:"将虚功限制在许可运动上，并以一维二次势能严格展示正刚度稳定、零刚度中性和负刚度不稳定三种情形。",
        origin:"LeanPath 自主形式化 · 实数序与代数工具来自 Mathlib",
        filename:"VirtualWorkAndStability.lean",
        code:"import Mathlib\n\ndef scalarPotential (k x : ℝ) : ℝ :=\n  (1 / 2 : ℝ) * k * x^2\n\ntheorem positive_stiffness_strict_min (k x : ℝ)\n    (hk : 0 < k) (hx : x ≠ 0) :\n    scalarPotential k 0 < scalarPotential k x := by\n  have hx2 : 0 < x^2 := sq_pos_of_ne_zero hx\n  simp [scalarPotential]\n  nlinarith\n\ntheorem zero_stiffness_neutral (x : ℝ) :\n    scalarPotential 0 x = scalarPotential 0 0 := by\n  simp [scalarPotential]\n"
      },
      {
        id:"showcase-statics-complete",
        unlock:"statics-chest",
        part:2,
        title:"第二部分完整成果 · 欧式空间静力学",
        summary:"完整 LeanPath 章节成果：一般维反对称张量力矩及其三维叉积专门化、力系、移矩和平衡、支反力、静定性、功与稳定性；参考系和梯度部分连接原 PhysLean、现 Physlib 的接口。",
        origin:"LeanPath 完整成果 · 自定义静力学主体 + Mathlib + 现行 Physlib 接口",
        filename:"EuclideanStatics.lean",
        file:"lean/EuclideanStatics.lean",
        completion:true,
        milestones:[
          "一般 ℝⁿ 坐标、反对称二阶力矩张量与楔积",
          "力矩反对称性、对角元为零及平行力零力矩",
          "一般维单力/力系移矩与平衡的原点无关性",
          "三维 Hodge 对偶与 Mathlib 叉积专门化",
          "三维欧式坐标、点积正定性与仿射位移",
          "集中力、有限力系、合力与总力矩",
          "Mathlib 叉积的反交换与正交性",
          "力偶合力为零及力偶矩参考点不变",
          "刚体平衡等价于所有自由虚运动功率为零",
          "简支梁两个反力公式及平衡验证",
          "线性平衡算子、静定唯一性与超静定自应力",
          "常力功的分段可加性",
          "原 PhysLean、现 Physlib 的梯度接口与弹簧势能桥接",
          "有限维虚功与正/零/负刚度稳定性分类",
          "连续介质、摩擦接触和屈曲的明确模型边界"
        ]
      }
    ]
  };
}());

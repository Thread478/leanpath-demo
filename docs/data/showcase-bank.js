/* Progressive code exhibits unlocked by course completion. */
(function () {
  window.LEANPATH_SHOWCASE = {
    version: 2,
    entries: [
      {
        id:"showcase-si-seven",
        unlock:"si-base",
        part:1,
        title:"SI 七个基本量",
        summary:"用归纳类型完整枚举 SI 基本量，并为后续模式匹配提供有限、无遗漏的分类。",
        filename:"SIBaseDimensions.lean",
        code:"import Mathlib\n\ninductive BaseDimension where\n  | time\n  | length\n  | mass\n  | electricCurrent\n  | temperature\n  | amountOfSubstance\n  | luminousIntensity\n  deriving DecidableEq, Repr\n\ndef baseUnitSymbol : BaseDimension → String\n  | .time => \"s\"\n  | .length => \"m\"\n  | .mass => \"kg\"\n  | .electricCurrent => \"A\"\n  | .temperature => \"K\"\n  | .amountOfSubstance => \"mol\"\n  | .luminousIntensity => \"cd\"\n"
      },
      {
        id:"showcase-dimension-algebra",
        unlock:"dimension-ops",
        part:1,
        title:"量纲指数与代数运算",
        summary:"把量纲构造成七个整数指数，并让乘、除、逆、整数幂对应指数向量运算。",
        filename:"DimensionAlgebra.lean",
        code:"import Mathlib\n\ninductive BaseDimension where\n  | time | length | mass | electricCurrent\n  | temperature | amountOfSubstance | luminousIntensity\n  deriving DecidableEq\n\nstructure Dimension where\n  exponent : BaseDimension → ℤ\n\ninstance : One Dimension := ⟨⟨fun _ => 0⟩⟩\ninstance : Mul Dimension :=\n  ⟨fun d₁ d₂ => ⟨fun b => d₁.exponent b + d₂.exponent b⟩⟩\ninstance : Inv Dimension :=\n  ⟨fun d => ⟨fun b => -d.exponent b⟩⟩\ninstance : Div Dimension := ⟨fun d₁ d₂ => d₁ * d₂⁻¹⟩\ninstance : HPow Dimension ℤ Dimension :=\n  ⟨fun d n => ⟨fun b => n * d.exponent b⟩⟩\n"
      },
      {
        id:"showcase-typed-quantity",
        unlock:"typed-ops",
        part:1,
        title:"类型安全的物理量",
        summary:"Quantity d 将量纲变成类型索引：同量纲量才能相加，乘除在返回类型中计算新量纲。",
        filename:"TypedQuantity.lean",
        code:"import Mathlib\n\nvariable {Dimension : Type} [Mul Dimension] [Div Dimension]\n\nstructure Quantity (d : Dimension) where\n  value : ℝ\n\ndef Quantity.add {d : Dimension}\n    (x y : Quantity d) : Quantity d :=\n  ⟨x.value + y.value⟩\n\ndef Quantity.mul {d₁ d₂ : Dimension}\n    (x : Quantity d₁) (y : Quantity d₂) :\n    Quantity (d₁ * d₂) :=\n  ⟨x.value * y.value⟩\n\nnoncomputable def Quantity.div {d₁ d₂ : Dimension}\n    (x : Quantity d₁) (y : Quantity d₂) :\n    Quantity (d₁ / d₂) :=\n  ⟨x.value / y.value⟩\n"
      },
      {
        id:"showcase-physlib-bridge",
        unlock:"physlib-units",
        part:1,
        title:"连接 Physlib 单位框架",
        summary:"从教学模型过渡到真实库，直接复用 Physlib 对 1 km/h 的精确 SI 换算定理。",
        filename:"PhyslibUnits.lean",
        code:"import Physlib.Units.Dimension\nimport Physlib.Units.WithDim.Basic\nimport Physlib.Units.WithDim.Speed\n\nopen LTMCTUnitChoices\n\n#check Dimension\n#check WithDim\n#check DimSpeed.oneKilometerPerHour_in_SI\n\nexample : DimSpeed.oneKilometerPerHour SI = ⟨5 / 18⟩ := by\n  exact DimSpeed.oneKilometerPerHour_in_SI\n"
      },
      {
        id:"showcase-unit-complete",
        unlock:"chest",
        part:1,
        title:"第一部分完整成果 · 单位与量纲",
        summary:"完整、可复制的章节成果：SI 七基本量、量纲向量与代数、导出量纲、线性与仿射单位、单位制、齐次性、Quantity d 和 Physlib 桥接。",
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
          "Physlib 单位换算定理复用"
        ]
      },
      {
        id:"showcase-euclidean-vectors",
        unlock:"inner-metric",
        part:2,
        title:"欧式向量与内积",
        summary:"以 Fin 3 → ℝ 构造透明三维坐标，并直接复用 Mathlib 点积正定性，为平衡充要条件准备数学基础。",
        filename:"EuclideanVectors.lean",
        code:"import Mathlib\n\nabbrev Vec3 := Fin 3 → ℝ\n\ndef dot (v w : Vec3) : ℝ := dotProduct v w\ndef normSq (v : Vec3) : ℝ := dot v v\n\ntheorem normSq_eq_zero_iff (v : Vec3) :\n    normSq v = 0 ↔ v = 0 := by\n  simpa [normSq, dot] using\n    (dotProduct_self_eq_zero (v := v))\n"
      },
      {
        id:"showcase-force-moment",
        unlock:"moment-shift",
        part:2,
        title:"力系、力矩与移矩",
        summary:"集中力同时记录作用点和向量；合力与总力矩递归叠加，并证明换参考点时的修正项。",
        filename:"ForceAndMoment.lean",
        code:"import Mathlib.LinearAlgebra.CrossProduct\n\nabbrev Vec3 := Fin 3 → ℝ\nstructure Point3 where coord : Vec3\nstructure AppliedForce where\n  point : Point3\n  vector : Vec3\n\ndef resultant : List AppliedForce → Vec3\n  | [] => 0\n  | f :: S => f.vector + resultant S\n\ndef momentAt (o : Point3) (f : AppliedForce) : Vec3 :=\n  crossProduct (f.point.coord - o.coord) f.vector\n\ndef totalMomentAt (o : Point3) : List AppliedForce → Vec3\n  | [] => 0\n  | f :: S => momentAt o f + totalMomentAt o S\n\n-- M_q = M_o - (q-o) × resultant\n"
      },
      {
        id:"showcase-equilibrium",
        unlock:"equilibrium-iff",
        part:2,
        title:"平衡与刚体虚功率",
        summary:"把平动、转动条件组合成刚体平衡，并用内积正定性证明：任意刚体虚运动上的功率为零，当且仅当合力与合力矩都为零。",
        filename:"RigidEquilibrium.lean",
        code:"import Mathlib\n\nabbrev Vec3 := Fin 3 → ℝ\n\ndef rigidVirtualPower (R M v ω : Vec3) : ℝ :=\n  dotProduct R v + dotProduct M ω\n\ntheorem virtualPower_zero_iff (R M : Vec3) :\n    (∀ v ω, rigidVirtualPower R M v ω = 0) ↔\n      R = 0 ∧ M = 0 := by\n  constructor\n  · intro h\n    constructor\n    · apply dotProduct_self_eq_zero.mp\n      simpa [rigidVirtualPower] using h R 0\n    · apply dotProduct_self_eq_zero.mp\n      simpa [rigidVirtualPower] using h 0 M\n  · rintro ⟨rfl, rfl⟩ v ω\n    simp [rigidVirtualPower]\n"
      },
      {
        id:"showcase-energy-stability",
        unlock:"stability",
        part:2,
        title:"虚功与二次势能稳定性",
        summary:"将虚功限制在许可运动上，并以一维二次势能严格展示正刚度稳定、零刚度中性和负刚度不稳定三种情形。",
        filename:"VirtualWorkAndStability.lean",
        code:"import Mathlib\n\ndef scalarPotential (k x : ℝ) : ℝ :=\n  (1 / 2 : ℝ) * k * x^2\n\ntheorem positive_stiffness_strict_min (k x : ℝ)\n    (hk : 0 < k) (hx : x ≠ 0) :\n    scalarPotential k 0 < scalarPotential k x := by\n  have hx2 : 0 < x^2 := sq_pos_of_ne_zero hx\n  simp [scalarPotential]\n  nlinarith\n\ntheorem zero_stiffness_neutral (x : ℝ) :\n    scalarPotential 0 x = scalarPotential 0 0 := by\n  simp [scalarPotential]\n"
      },
      {
        id:"showcase-statics-complete",
        unlock:"statics-chest",
        part:2,
        title:"第二部分完整成果 · 欧式空间静力学",
        summary:"完整章节成果：欧式向量与仿射点、集中力与力系、叉积力矩、移矩和力偶、平衡充要条件、简支梁反力、线性静定性、自应力、功、虚功及二次势能稳定性。",
        filename:"EuclideanStatics.lean",
        file:"lean/EuclideanStatics.lean",
        completion:true,
        milestones:[
          "三维欧式坐标、点积正定性与仿射位移",
          "集中力、有限力系、合力与总力矩",
          "Mathlib 叉积的反交换与正交性",
          "单力及有限力系的移矩定理",
          "力偶合力为零及力偶矩参考点不变",
          "刚体平衡等价于所有自由虚运动功率为零",
          "简支梁两个反力公式及平衡验证",
          "线性平衡算子、静定唯一性与超静定自应力",
          "常力功的分段可加性",
          "Physlib 梯度接口与弹簧势能桥接",
          "有限维虚功与正/零/负刚度稳定性分类",
          "连续介质、摩擦接触和屈曲的明确模型边界"
        ]
      }
    ]
  };
}());

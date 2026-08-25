/* Progressive code exhibits unlocked by course completion. */
(function () {
  window.LEANPATH_SHOWCASE = {
    version: 1,
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
      }
    ]
  };
}());

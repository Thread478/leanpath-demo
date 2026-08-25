/* LeanPath Physics · Units and dimensions writing laboratory. */
(function () {
  const basePrelude = "import Mathlib\n\ninductive BaseDimension where\n  | time | length | mass | electricCurrent\n  | temperature | amountOfSubstance | luminousIntensity\n  deriving DecidableEq, Repr\n\nabbrev Dim := BaseDimension → Int\n";
  const opsPrelude = basePrelude + "\ndef basis (b : BaseDimension) : Dim :=\n  fun i => if i = b then 1 else 0\n\ndef dimOne : Dim := fun _ => 0\ndef dimMul (d₁ d₂ : Dim) : Dim := fun b => d₁ b + d₂ b\ndef dimInv (d : Dim) : Dim := fun b => -d b\ndef dimDiv (d₁ d₂ : Dim) : Dim := dimMul d₁ (dimInv d₂)\ndef dimPow (d : Dim) (n : Int) : Dim := fun b => n * d b\n\ndef timeDim : Dim := basis .time\ndef lengthDim : Dim := basis .length\ndef massDim : Dim := basis .mass\ndef currentDim : Dim := basis .electricCurrent\n";

  window.LEANPATH_WRITING_BANK = {
    version: 3,
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
      }
    ]
  };
}());

/* Lecture-style theory cards shown before every mainline physics quiz. */
(function () {
  const U1 = "第一部分 · 单位与量纲";
  const U2 = "第二部分 · 欧式空间中的静力学";

  function section(title, text, code, cases) {
    return {title:title, text:text, code:code || "", cases:cases || []};
  }

  function guide(part, index, title, summary, sections, scope) {
    return {part:part, index:index, title:title, summary:summary, sections:sections, scope:scope};
  }

  window.LEANPATH_LESSON_GUIDES = {
    version: 3,
    guides: {
      quantity: guide(U1, "01 / 13", "物理量不只是一个数",
        "本关的核心目标是引导您将自然语言描述的物理陈述，解构为 Lean 能够严格处理的类型化对象：测量的数值、所绑定的单位、所属的量纲，以及该物理过程所依赖的理想化模型。",[
          section("从一次测速开始", 
                  "当汽车仪表盘显示 $72 \\text{ km/h}$ 时，$72$ 仅仅是相对于 $\\text{km/h}$ 这个单位标尺的坐标。若进行单位换算为 $20 \\text{ m/s}$，汽车的客观运动状态并未改变，其速度量纲 $\\mathsf{L}\\mathsf{T}^{-1}$ 也保持恒定。因此，如果在形式化时认为“物理量就是裸实数（Bare Real Numbers）”，将会丢失物理公式齐次性（Homogeneity）检验等关键信息。", 
                  `structure QuantityRecord where
  value : ℝ
  unit : Unit
  dimension : Dimension`),
          section("形式化时还要记录模型地位", 
                  "将重力加速度赋值为 $g = 9.8 \\text{ m/s}^2$ 后，Lean 能够严格推导出该参数在特定模型下产生的结论，但这并不能赋予它作为“真实世界实测值”的本体论地位。现实中的测量值必然包含不确定度，而物理学中的理想化参数则通常被设定为精确值。我们必须在类型系统上区分纯粹逻辑证明的严格性与模型对物理现实的拟合度。", 
                  `structure Measurement where
  centralValue : ℝ
  uncertainty : ℝ

def freeFallModel (g : Acceleration) := ...`, 
                  ["精确常数：如光速 $c$ 或单位定义中的换算因子，形式化中可视为无误差常量。","实验输入：必须同时记录测量中心值、不确定度（如 $\\Delta x$）以及仪器环境的上下文。","理想参数：作为公理引入，其推导的结论仅在满足该假设的模型（如无空气阻力的自由落体）中成立。"]),
          section("零值也有物理类型", 
                  "当竖直上抛的小球到达最高点时，其速度数值为 $0$，但 $0 \\text{ m/s}$ 本质上依然是一个速度向量，绝不能在公式中与 $0 \\text{ s}$（时间）或 $0 \\text{ N}$（力）进行加减运算。在 Lean 中，我们可以通过依赖类型理论，让不同的零值分别栖身于 \`Quantity speedDim\` 和 \`Quantity timeDim\` 等不同的类型宇宙中，从而在编译阶段就阻止违背物理直觉的非法操作。", 
                  `def zeroSpeed : Quantity speedDim := ⟨0⟩
def zeroTime  : Quantity timeDim  := ⟨0⟩

-- 在完善的类型系统中，zeroSpeed + zeroTime 将因类型不匹配而报错。`)
        ], "本关仅建立“数值—单位—量纲—模型”这四个层级的形式化区分；关于误差传播（Error Propagation）与统计推断的 Lean 实现，将留至后续的实验数据专题探讨。"),

      "si-base": guide(U1,"02 / 13","SI 基本量是一组生成基底",
        "七个 SI 基本量不是七个必须死记的符号，而是一组用于生成常用量纲的独立坐标方向。理解“基底”后，导出单位就成为组合，而不是新的例外清单。",[
          section("为什么需要基本量","若要比较两个公式的物理类型，需要先选一组彼此独立的参照量。SI 采用时间、长度、质量、电流、热力学温度、物质的量和发光强度。力、能量和电荷都能由这些方向组合，因此无需再增加基本坐标。",`inductive BaseDimension where
  | time | length | mass | electricCurrent
  | temperature | amountOfSubstance
  | luminousIntensity`),
          section("基本与导出是结构关系","牛顿 N 不是第八个基本单位，因为 F=ma 给出 N=kg·m·s⁻²；焦耳 J=N·m，库仑 C=A·s。Lean 的归纳类型保证七种情况穷尽，定义单位符号时编译器会检查是否漏掉分支。",`def baseUnitSymbol : BaseDimension → String
  | .time => "s"
  | .length => "m"
  | .mass => "kg"
  | .electricCurrent => "A"
  | .temperature => "K"
  | .amountOfSubstance => "mol"
  | .luminousIntensity => "cd"`),
          section("基底选择与物理约定","自然单位制可令 c=1、ℏ=1，厘米克秒制也采用不同标尺。这不说明 SI 错误，而说明“基本量”包含体系选择。改变基底必须保持各公式之间的关系可一致转换。",`-- 教学目标：把基底选择显式化
structure DimensionBasis where
  coordinate : PhysicalKind → BaseDimension → ℚ`,["SI：适合跨领域测量与工程交流。","CGS：基础尺度不同，电磁学约定也需特别小心。","自然单位：压缩量纲表达，但必须保留恢复单位的方法。"])
        ],"本课程固定采用七维 SI 基底；自然单位和电磁单位制只用于说明选择性，不展开其完整换算。"),

      "dimension-model": guide(U1,"03 / 13","把量纲构造成指数向量",
        "选定七个基本量后，一个量纲就由七个指数唯一描述。这样，物理公式的类型检查被转化为精确的向量等式。",[
          section("从乘积写出坐标","若 Q=MᵃLᵇTᶜIᵈΘᵉNᶠJᵍ，就把它记录成函数 BaseDimension→ℤ。例如力的时间、长度、质量指数分别为 −2、1、1，其余为 0。函数表示比固定七元组更便于按基本量索引。",`abbrev Dim := BaseDimension → Int

def forceDim : Dim
  | .time => -2
  | .length => 1
  | .mass => 1
  | _ => 0`),
          section("齐次性成为逐分量相等","两个量纲相等，当且仅当对每个基本量，它们的指数都相等。因此证明 [F]=[ma] 不需要处理单位名称，只需逐分量化简整数运算。未知常数的量纲也可以从等式中移项求出。",`theorem dim_ext {d₁ d₂ : Dim}
    (h : ∀ b, d₁ b = d₂ b) : d₁ = d₂ := by
  funext b
  exact h b

-- [G] = [F] [r]^2 / [m]^2`),
          section("整数指数模型的边界","速度、力和能量都使用整数指数，但 √L 会产生 1/2 次幂，不能直接放入 BaseDimension→ℤ。若根式内部的指数均可整除，可在最终结果中回到整数模型；否则应把指数域升级为 ℚ。",`abbrev IntegralDim := BaseDimension → ℤ
abbrev RationalDim := BaseDimension → ℚ`,["所有指数为整数：当前模型直接表达。","开方前指数皆为偶数：先证明可整除，再取根。","真正的分数次量纲：显式改用有理指数，不能暗中截断。"])
        ],"这里的量纲是代数分类，不包含方向、张量阶数或“能量/力矩”等更细的物理语义。"),

      "dimension-ops": guide(U1,"04 / 13","量纲乘除就是指数代数",
        "指数向量模型的价值在于，它把大量单位记忆转化为三条统一规则：乘法加指数，除法减指数，幂次整体缩放。",[
          section("乘法与除法的推导","若 x 的某个基本指数为 a，y 的对应指数为 b，则 xy 中该基本量出现 a+b 次，而 x/y 中出现 a−b 次。这不是人为算法，而是幂律 xᵃxᵇ=xᵃ⁺ᵇ 的直接结果。",`def dimMul (d₁ d₂ : Dim) : Dim :=
  fun b => d₁ b + d₂ b

def dimInv (d : Dim) : Dim :=
  fun b => - d b

def dimDiv d₁ d₂ := dimMul d₁ (dimInv d₂)`),
          section("幂次必须作用于全部分量","面积 L²、转动惯量 ML² 与速度平方 L²T⁻² 都要求把所有指数同时乘以幂次。只平方数值而忘记单位，是面积和体积换算中最常见的错误。",`def dimPow (d : Dim) (n : Int) : Dim :=
  fun b => n * d b

-- [v^2] = (L T⁻¹)^2 = L² T⁻²`),
          section("先判断运算是否合法","乘除总能形成新量纲；加减则只有在量纲相同时才有物理意义。力矩 r∧F 和功 F·r 在量纲代数中都得到 ML²T⁻²，但几何配对不同，不能仅凭指数相同就视为同一种对象。",`add : Quantity d → Quantity d → Quantity d
mul : Quantity d₁ → Quantity d₂ → Quantity (dimMul d₁ d₂)`,["加减：先证明量纲相同。","乘除：生成新的量纲。","同量纲异语义：继续检查标量、向量或张量结构。"])
        ],"量纲代数只决定指数如何组合；公式的符号、系数和几何运算仍需物理定律决定。"),

      "derived-dimensions": guide(U1,"05 / 13","从定义式推导常用量纲",
        "导出量纲最好沿物理定义逐层构造。这样不但能得到答案，还能看出每个量从哪里来，并在 Lean 中复用前一步定义。",[
          section("从运动学到力","速度是位移除以时间，所以 [v]=LT⁻¹；加速度再除以时间，得到 LT⁻²；牛顿第二定律 F=ma 随后给出 [F]=MLT⁻²。每一步都对应一个可检查的量纲运算。",`def speedDim := lengthDim / timeDim
def accelerationDim := speedDim / timeDim
def forceDim := massDim * accelerationDim`),
          section("从功到功率与压强","常力沿同向位移做功 W=Fs，因此 [W]=ML²T⁻²。功率是单位时间做功，压强是单位面积受力，分别得到 ML²T⁻³ 与 ML⁻¹T⁻²。这里也能看出压强和能量密度同量纲。",`def energyDim := forceDim * lengthDim
def powerDim := energyDim / timeDim
def pressureDim := forceDim / (lengthDim ^ (2 : ℤ))`),
          section("电学量同样从关系式生成","电荷 Q=It 给出 [Q]=IT；电压是单位电荷获得的能量，所以 [V]=ML²T⁻³I⁻¹。导出顺序可以不同，但最终指数必须一致，这提供了交叉检查。",`def chargeDim := currentDim * timeDim
def voltageDim := energyDim / chargeDim`,["若两条独立推导得到同一指数，模型更可信。","若指数冲突，先检查定义、分母和幂次。","指数相同仍不保证物理对象可以互换。"])
        ],"本关推导的是量纲而非具体单位；N、J、Pa、V 是这些组合在 SI 中的专名。"),

      dimensionless: guide(U1,"06 / 13","无量纲量仍然携带物理语义",
        "全部基本指数抵消只说明尺度变换下没有剩余单位，并不说明数值恒为 1，更不说明不同无量纲量可以互换。",[
          section("为什么比例会无量纲","应变 ε=ΔL/L、折射率 n=c/v 都是同类量之比。分子分母的指数逐分量相消，得到零向量。这个结论与使用米还是厘米无关，所以无量纲量特别适合跨尺度比较。",`def dimOne : Dim := fun _ => 0

theorem self_div_dimensionless (d : Dim) :
    dimDiv d d = dimOne := by
  funext b
  simp [dimDiv, dimMul, dimInv, dimOne]`),
          section("函数自变量为何常要求无量纲","exp x=1+x+x²/2!+⋯ 的各项必须能相加。若 x 带非零量纲，则 1、x、x² 具有不同量纲，级数失去物理意义；sin 与 log 也有同样要求。角度可用 rad 保留语义，但其指数仍为零。",`def Dimensionless (q : Quantity d) : Prop := d = dimOne

-- sin、exp、log 的输入类型可专门限制为 Quantity dimOne`),
          section("常见的三种情况","无量纲量之间仍有不同来源和解释。雷诺数描述惯性与黏性效应之比，应变描述相对伸长，角度描述几何转动；把它们都压成裸实数会丢失语义。","",["纯比例：同类物理量相除。","相似准则：多个量组合后刻画机制竞争。","带专名单位：rad、sr 等用名称保留几何含义。"])
        ],"课程的 Quantity d 只编码量纲；若要禁止“应变+角度”，还需增加物理种类标签。"),

      "unit-systems": guide(U1,"07 / 13","单位制是量纲空间的坐标选择",
        "量纲说明物理量沿哪些基本方向变化，单位则为每个方向选择一把标尺。单位制变化类似坐标变化：表示改变，对象与物理关系不变。",[
          section("单位标尺如何作用","若长度单位扩大 1000 倍，同一长度的数值缩小 1000 倍。对复合量纲，换算因子按各基本指数相乘。因此单位制可以由每个基本量的正尺度统一描述。",`structure UnitSystem where
  scale : BaseDimension → ℝ
  positive : ∀ b, 0 < scale b

-- 复合量纲 d 的总尺度：各 scale b 按 d b 次幂相乘`),
          section("自然单位不是删除量纲","令 c=1 把时间与长度的尺度关联，令 ℏ=1 又把能量与频率关联。计算表达式会变短，但恢复 SI 时必须重新插入这些常数的幂。形式化最好记录采用了哪组约定，而不是只留下一个无来源的实数。",`structure NaturalUnitConvention where
  setCOne : Bool
  setHbarOne : Bool
  restorationRule : Dimension → SIConversion`),
          section("单位制变化的分类","纯乘法单位可用一个正尺度处理；温标等仿射单位还含平移；对数单位则根本不是线性坐标。它们不能塞进同一个简单乘法函数。","",["线性单位：m↔cm、kg↔g。","仿射单位：℃↔K，绝对值换算含平移。","非线性表示：dB、星等等需单独定义语义。"])
        ],"本关构造乘法型单位制；仿射温标在下一关处理，对数单位不进入当前成果代码。"),

      "unit-conversion": guide(U1,"08 / 13","单位换算是带幂次的坐标变换",
        "换算不应靠记忆零的个数，而应从基本单位尺度与量纲指数推导。这样长度、面积、速度和温度可以在同一框架下分类处理。",[
          section("线性单位与幂次传播","1 km=1000 m，所以面积单位的因子是 1000²，体积则是 1000³。速度 36 km/h 同时包含长度因子 1000 与时间因子 3600⁻¹，精确得到 10 m/s。",`example : (36 : ℝ) * 1000 / 3600 = 10 := by
  norm_num

example : (3 : ℝ) * 1000^2 = 3_000_000 := by
  norm_num`),
          section("绝对温度是仿射换算","摄氏温度到开尔文需要 T_K=T_℃+273.15；但温差中的平移会抵消，所以 20℃−10℃=10 K。把温标误作纯乘法单位会在绝对温度公式中出错。",`structure AffineUnit where
  scale : ℝ
  offset : ℝ

def toSI (u : AffineUnit) (x : ℝ) :=
  u.scale * x + u.offset`),
          section("换算前的检查顺序","先确认源和目标具有相同量纲，再判断换算是线性、幂次传播还是仿射，最后才计算数值。若分母可能为零或尺度非正，也要把条件写成假设。","",["同量纲 + 线性标尺：直接乘尺度比。","面积/体积/导出量：按指数传播尺度。","绝对温标：尺度与平移；温差只保留尺度。"])
        ],"本关使用精确实数等式；测量数据的有效数字与舍入规则不在证明中自动产生。"),

      "typed-quantity": guide(U1,"09 / 13","让量纲成为 Lean 类型的一部分",
        "量纲分析若只写在注释里，编译器无法阻止错误公式。把 d 放进 Quantity d 的类型后，“能否相加”变成 Lean 在 elaboration 阶段就会检查的问题。",[
          section("依赖类型表达物理约束","Quantity d 是一族类型，而不是一个统一容器。Quantity lengthDim 与 Quantity timeDim 即使内部都存 ℝ，也属于不同类型；同量纲加法则共享同一个隐式参数 d。",`structure Quantity (d : Dim) where
  valueSI : ℝ

def Quantity.add {d : Dim}
    (x y : Quantity d) : Quantity d :=
  ⟨x.valueSI + y.valueSI⟩`),
          section("类型正确仍不等于物理正确","力矩与能量同量纲，路程与位移也同量纲；仅用 d 作为索引仍允许它们混在一起。若应用需要更严格语义，可以再增加 Kind 索引，或让标量、向量、张量使用不同结构。",`inductive PhysicalKind where
  | energy | torque | distance | displacement

structure TypedQuantity (kind : PhysicalKind) (d : Dim) where
  value : Representation kind`),
          section("底层数值如何选择","教学模型统一存 SI 实数，简化换算与定理。工程代码可能需要有理数保证精确换算、浮点数处理测量，或区间数保存误差；这些选择不应与量纲索引混为一谈。","",["ℚ：精确比例换算，不能表示所有测量。","ℝ：适合定理陈述，但通常不可计算。","Float/区间：适合计算，需要额外误差语义。"])
        ],"Quantity d 展示依赖类型思想；它不是对实验数值、几何类型和误差模型的完整封装。"),

      "typed-ops": guide(U1,"10 / 13","让公式的结构出现在返回类型中",
        "依赖类型真正有用之处，不只是拒绝错误加法，还能让乘除的返回类型自动记录所得物理量。函数签名因而成为一条可读的量纲定律。",[
          section("加法保持量纲，乘法合成量纲","两个长度相加仍是长度；力乘时间得到冲量；力乘位移得到能量。Lean 函数的输入输出可以直接表达这些规则，调用者无需再读注释猜测。",`add : Quantity d → Quantity d → Quantity d

mul : Quantity d₁ → Quantity d₂ →
  Quantity (dimMul d₁ d₂)

div : Quantity d₁ → Quantity d₂ →
  Quantity (dimDiv d₁ d₂)`),
          section("以动能为例逐层检查","K=½mv² 中，v² 先产生 L²T⁻²，再与质量相乘得到 ML²T⁻²；½ 是无量纲系数，不改变量纲。类型系统能证明结果是能量量纲，但系数 ½ 仍来自力学推导。",`def kineticEnergy
    (m : Quantity massDim) (v : Quantity speedDim) :
    Quantity energyDim :=
  (dimensionless (1/2)) * m * (v ^ 2)`),
          section("运算符重载的边界","为了让表达式像数学公式，可为 Quantity 定义 Mul、Div 等实例。但过度自动化会隐藏转换与模型假设，因此教学阶段先保留显式函数，再逐步引入记号。","",["定义阶段：显式写 dimMul，便于看清类型。","使用阶段：在定理稳定后增加运算符实例。","单位换算：不应由隐式强制转换悄悄完成。"])
        ],"类型系统检查公式的量纲形状；动力学定律、数值系数和适用条件仍需定理证明。"),

      homogeneity: guide(U1,"11 / 13","量纲齐次是物理公式的必要检查",
        "若等式两侧或求和各项的量纲不同，公式必然有问题；反过来，量纲正确只说明它通过了必要检查，不能证明它就是正确的物理定律。",[
          section("为什么求和要求同量纲","等式 A=B 可以在共同单位下比较数值；A+B 更要求两个对象属于同一可加空间。运动方程 x=x₀+v₀t+½at² 的三项都必须是长度，这可逐项验证。",`def HomogeneousEquation (lhs rhs : Dim) : Prop :=
  lhs = rhs

example :
  dimMul speedDim timeDim = lengthDim := by ...`),
          section("量纲分析能反推什么","若阻力写成 F=bv，则 [b]=[F]/[v]=MT⁻¹；若周期只依赖 ℓ 与 g，可解指数得到 T∝√(ℓ/g)。这种推导确定幂律形状，却通常留下一个无量纲常数。",`-- 假设 T ∝ ℓ^a g^b
-- 比较 L、T 指数：
-- a + b = 0,  -2b = 1
-- 得 a = 1/2, b = -1/2`),
          section("齐次但仍错误的三类公式","x=2vt 与 x=vt 同样齐次，却可能有错误系数；力矩与能量同量纲却几何类型不同；缺少初始条件或阻力项的方程也可能齐次。","",["无量纲系数错误：量纲无法识别。","几何对象错误：标量、向量、张量需另行检查。","模型项遗漏：需要守恒律、对称性或实验判断。"])
        ],"量纲齐次是筛错工具，不是物理定律的充分证明；网站会在答案解释中持续强调这一边界。"),

      "physlib-units": guide(U1,"12 / 13","从 PhysLean 教学传统连接到现行 Physlib",
        "PhysLean（更早名为 HepLean）已与 Lean-QuantumInfo 合并为现行 Physlib。现在的仓库、构建目标和导入路径使用 Physlib；课程的透明量纲模型用于教学，真实接口则按当前包名调用。",[
          section("为什么先学透明模型","直接阅读成熟库会遇到类型参数、实例和命名空间。先理解指数向量、单位制和 WithDim 的物理意义，再用 #check 查看真实签名，能够区分数学结构与 API 细节。",`import Physlib.Units.Dimension
import Physlib.Units.WithDim.Basic

#check Dimension
#check WithDim`),
          section("复用已经形式化的换算","现行 Physlib 在 Physlib.Units 下保存源自原 PhysLean 工作的单位框架。1 km/h=5/18 m/s 已作为精确定理提供；课程题目应调用它，而不是再次手写一个未经连接的常数。",`import Physlib.Units.WithDim.Speed

open LTMCTUnitChoices

example : DimSpeed.oneKilometerPerHour SI = ⟨5 / 18⟩ := by
  exact DimSpeed.oneKilometerPerHour_in_SI`),
          section("名称与归属要分清","课程自建的 BaseDimension、Quantity d 和 MomentTensor n 是为了可读性，不应声称来自库；Dimension、WithDim、Gradient 等真实接口则应注明现行模块路径。历史介绍可写 PhysLean，但可执行代码必须写 Physlib。","",["历史项目：PhysLean / HepLean。","当前合并项目与包：Physlib。","本站教学层：LeanPath 自定义的透明模型。"])
        ],"库 API 会随版本演化；提交写作题前应以当前 Lean 环境中的 #check 结果为准。"),

      practice: guide(U1,"13 / 13","把量纲工具用于完整建模检查",
        "综合实验不再按概念逐题提示。面对一个公式，应按“识别对象—统一单位—推导量纲—检查模型边界”的顺序完成，而不是只寻找熟悉的关键词。",[
          section("第一步：识别对象与单位","先标出每个量是标量、向量还是更高阶对象，再记录量纲与当前单位。若需要数值计算，先转换到一致单位；若只比较量纲，则无需提前代入数值。",`structure ModelInput where
  geometricKind : GeometricKind
  dimension : Dim
  unit : Unit
  value : ℝ`),
          section("第二步：沿定义推导","把复杂表达式拆为乘、除、幂与允许的加法。每一步都写出中间量纲，比直接猜最终单位更容易发现分母、平方和温标平移错误。",`def checkFormula (f : Formula) : Prop :=
  additionsHaveEqualDimensions f ∧
  equationSidesAgree f`),
          section("第三步：说明结论强度","通过量纲检查后，还要问：系数是否已由物理原理推出？几何对象是否匹配？参数来自实验还是理想化？只有把这些问题答清，形式化才不只是“单位计算器”。","",["量纲失败：公式必需修改。","量纲通过：继续检查系数、方向和假设。","模型通过：仍需区分数学验证与实验有效性。"])
        ],"本关是第一部分综合卷；完成后图鉴展示可执行的完整章节代码，而非关前讲义中结构草图的简单拼接。"),

      "euclidean-vectors": guide(U2,"01 / 17","从 ℝⁿ 的向量结构开始静力学",
        "静力学首先需要一个能够相加和数乘的空间来表示位移与力。课程从透明坐标 VecN n 开始，再在需要叉积、角速度和梁模型时专门化到三维。",[
          section("向量从何而来","在选定正交坐标系后，一个 n 维向量由 n 个实数组成，可写成 Fin n→ℝ。位移、速度、加速度和力虽然量纲不同，但共享向量加法的几何结构。",`abbrev VecN (n : ℕ) := Fin n → ℝ
abbrev Vec3 := VecN 3

def addVec (v w : VecN n) : VecN n :=
  fun i => v i + w i`),
          section("合成遵循线性结构","连续两次位移的总位移是向量和，多力合力也是向量和。交换律说明力的列举顺序不影响合力，结合律允许先计算子系统再合并。",`theorem add_assoc (u v w : VecN n) :
  (u + v) + w = u + (v + w) := by
  ext i
  ring`),
          section("坐标模型与几何对象","VecN n 便于初学者查看分量，但坐标依赖基底。真正内禀的欧式空间还需要内积；点则属于仿射空间而非向量空间。后两关会依次补上这些结构。","",["n=1：共线运动和一维杆。","n=2：平面静力学，力矩只有一个独立分量。","n=3：日常空间，可使用 Mathlib 叉积。","n≥4：适合统一理论，力矩保留二形式。"])
        ],"本章不假设所有物理空间真的高维；一般 n 用于揭示哪些结论依赖三维特殊结构。"),

      "inner-metric": guide(U2,"02 / 17","内积把向量结构升级为欧式几何",
        "只有向量加法还不能谈长度、夹角和正交。内积提供这些度量概念，也把力与位移配对成标量功。",[
          section("点积的三个作用","坐标点积 v·w=Σvᵢwᵢ 是双线性的；v·v≥0 且只在 v=0 时取零；由此定义 ‖v‖=√(v·v)。正交条件 v·w=0 也是静力学中判断零功的基础。",`def dot {n : ℕ} (v w : VecN n) : ℝ :=
  dotProduct v w

def normSq (v : VecN n) : ℝ := dot v v`),
          section("正定性如何进入证明","若某个向量 R 与所有测试向量 v 的点积都为零，可特别取 v=R，得到 R·R=0，再由正定性推出 R=0。平衡充要条件的反向证明正是使用这个思路，而不是枚举坐标。",`theorem normSq_eq_zero_iff (v : VecN n) :
    normSq v = 0 ↔ v = 0 := by
  simpa [normSq, dot] using
    (dotProduct_self_eq_zero (v := v))`),
          section("不要混淆两种乘积","F·r 是标量功，r∧F 是反对称力矩张量。在三维中 r×F 是一个轴向向量。三者量纲关系可能相同，但值域与几何意义不同。","",["点积：两个向量→标量，依赖度量。","楔积：两个向量→二形式，表达有向面积。","叉积：三维中二形式经 Hodge 对偶→轴向向量。"])
        ],"课程使用标准正定实内积；非正定时空度量和一般黎曼度量将在后续单元处理。"),

      "affine-points": guide(U2,"03 / 17","点与向量属于不同的几何层次",
        "刚体上的作用点不能直接当作自由向量。两点之差是位移向量，点加位移得到新点；选原点后才可把点写成坐标。",[
          section("仿射空间的基本运算","若 P、Q 是点，则 Q−P 是从 P 指向 Q 的位移。P+v 有意义，但 P+Q 没有自然意义。坐标实现把这些对象都落到 ℝⁿ，却仍应通过不同类型阻止非法运算。",`structure PointN (n : ℕ) where
  coord : VecN n

def displacement (p q : PointN n) : VecN n :=
  q.coord - p.coord`),
          section("位移链式关系","从 P 到 Q 再从 Q 到 R，位移相加为从 P 到 R。这一恒等式是常力功分段可加、力矩移原点等证明的共同代数基础。",`theorem displacement_chain (p q r : PointN n) :
    displacement p q + displacement q r =
      displacement p r := by
  ext i
  simp [displacement]
  ring`),
          section("参考原点的影响","平移坐标原点会改变每个点的位置坐标，却不改变两点之差。合力因此与原点无关；力矩使用 P−O，故会随参考点改变，但变化遵循精确的移矩公式。","",["只含位移的结论：通常平移不变。","含位置向量的结论：必须注明参考点。","含距离和夹角：还依赖所选欧式度量。"])
        ],"成果代码使用透明 coord 字段；更内禀的参考系接口来自原 PhysLean、现 Physlib 的 ReferenceFrame 模块。"),

      "applied-force": guide(U2,"04 / 17","集中力必须记录作用点",
        "一个自由向量只描述力的大小与方向；刚体效应还取决于作用线。AppliedForce 因而同时保存 point 与 vector。",[
          section("为什么作用点不可省略","在门把手和转轴附近施加相同方向、相同大小的力，平动合力相同，转动效果却不同。关于 O 的力矩由力臂 r=P−O 与 F 的楔积决定，P 的信息不可从 F 中恢复。",`structure AppliedForceN (n : ℕ) where
  point : PointN n
  vector : VecN n

def momentTensorAt O f :=
  wedge (f.point.coord - O.coord) f.vector`),
          section("沿作用线滑移为何不改力矩","把作用点改为 P+aF 后，新力臂为 r+aF。由于 F∧F=0，有 (r+aF)∧F=r∧F。这给出了“滑移向量”的代数原因，而不是额外背诵的规则。",`wedge (r + a • F) F
  = wedge r F + a • wedge F F
  = wedge r F`),
          section("集中力的模型边界","分布载荷需要对位置相关的力密度积分；接触力还可能满足单边不等式；随动力的方向会依赖当前构型。它们都不能仅靠一个固定 AppliedForce 完整表达。","",["集中力：当前结构直接表示。","有限个集中力：用 List 组成力系。","分布载荷：先定义密度与积分。","接触/随动力：还需约束或构型依赖。"])
        ],"本章处理给定作用点的有限集中力；刚体形状和接触几何由更高层模型提供。"),

      "force-system": guide(U2,"05 / 17","力系的平动效应由合力概括",
        "有限力系可用列表保存。把全部力向量相加得到合力 R，但仅有 R 不能区分一对相反力形成的力偶，因此还必须保留总力矩。",[
          section("递归定义合力","空力系没有外力，合力为零；加入首个力 f 后，新合力是 f.vector 与余下力系合力之和。这个物理叠加原则恰好对应 List 的递归结构。",`def resultantN : List (AppliedForceN n) → VecN n
  | [] => 0
  | f :: S => f.vector + resultantN S`),
          section("子系统可以模块化合并","若把机翼、机身和尾翼载荷分别求合力，再相加，结果与逐个遍历所有外力相同。数学上这是 resultant 对列表拼接保持加法，可用归纳证明。",`theorem resultant_append (S T : ForceSystemN n) :
    resultantN (S ++ T) = resultantN S + resultantN T := by
  induction S with
  | nil => simp [resultantN]
  | cons f S ih => simp [resultantN, ih, add_assoc]`),
          section("合力为零仍可能转动","两力 F 与 −F 自动使 R=0；若作用线不同，它们的力矩相加却可能非零。这说明刚体力系的完整一阶静力信息是 (R,M_O)，而不是单个向量。","",["R≠0：存在净平动效应。","R=0、M≠0：纯力偶，仍有转动效应。","R=0、M=0：才满足自由刚体外力平衡。"])
        ],"力系列表没有编码材料内部应力；它只组织外部集中力数据。"),

      moment: guide(U2,"06 / 17","一般维力矩是反对称二阶张量",
        "三维叉积把力矩画成一个轴向向量，但这种识别依赖三维。统一定义应从力臂张成的有向面积出发：M=r∧F。",[
          section("从有向面积得到分量公式","关于 O 令 r=P−O。二阶张量 M 的 ij 分量取 rᵢFⱼ−rⱼFᵢ；交换 i、j 会变号，对角元自动为零。这正是反对称性，独立分量数为 n(n−1)/2。",`abbrev MomentTensor n := Matrix (Fin n) (Fin n) ℝ

def wedge (r F : VecN n) : MomentTensor n :=
  fun i j => r i * F j - r j * F i

theorem wedge_skew : wedge r F i j = - wedge r F j i := by
  simp [wedge]
  ring`),
          section("三维叉积如何恢复","当 n=3 时，反对称矩阵只有 M₁₂、M₂₀、M₀₁ 三个独立分量。用欧式度量和定向做 Hodge 对偶，把它们排列为向量，就得到通常的 r×F。叉积不是被抛弃，而是被解释为三维专门化。",`def hodgeDual3 (M : MomentTensor 3) : Vec3 :=
  ![M 1 2, M 2 0, M 0 1]

theorem hodgeDual3_wedge (r F : Vec3) :
  hodgeDual3 (wedge r F) = crossProduct r F := by ...`),
          section("按维数分类理解","二维力矩只有一个独立分量，可写成带正负号的标量；三维可对偶成轴向向量；四维及以上通常保留二形式。若 r 与 F 平行，则所有维数中 r∧F=0。","",["n=1：Λ²=0，不存在独立转动平面。","n=2：1 个独立分量，平面力矩标量。","n=3：3 个分量，可用叉积向量。","n≥4：n(n−1)/2 个分量，不自然等同于向量。"])
        ],"成果代码用反对称矩阵透明表示 Λ²；后续可桥接 Mathlib ExteriorAlgebra，而不改变物理定义。"),

      "moment-shift": guide(U2,"07 / 17","移矩定理精确描述参考点变化",
        "力矩依赖参考点，但不是任意变化。将参考点从 O 移到 Q 后，全部变化由原点位移与合力决定。",[
          section("单个力的推导","设 r_O=P−O、a=Q−O，则 r_Q=P−Q=r_O−a。利用楔积对第一变量线性，r_Q∧F=r_O∧F−a∧F。这就是单力移矩公式。",`momentTensorAt Q f
  = wedge (P - Q) F
  = wedge ((P - O) - (Q - O)) F
  = momentTensorAt O f - wedge (Q - O) F`),
          section("有限力系为何只出现合力","对每个力求和后，公共位移 a 可提出：Σ(a∧Fᵢ)=a∧ΣFᵢ=a∧R。因此 M_Q=M_O−a∧R。Lean 中沿力系列表归纳即可把单力公式提升到总力矩。",`theorem totalMoment_change_origin :
  M Q S = M O S - wedge (Q - O) (resultantN S) := by
  induction S with
  | nil => simp
  | cons f S ih => ...`),
          section("特殊情形决定物理解释","若 R=0，修正项消失，总力矩与参考点无关；力偶因此可视为自由力矩。若 R≠0，一般不能假设总有参考点使 M=0，三维还可能保留沿 R 的不可消去分量。","",["R=0：M_Q=M_O，力矩成为自由二形式。","R≠0 且存在合适 Q：部分力矩可由移原点消去。","一般三维力系：可能存在沿合力方向的固有力偶分量。"])
        ],"中心轴与螺旋理论不是本关目标；这里只证明对所有有限维都成立的移矩恒等式。"),

      equilibrium: guide(U2,"08 / 17","静力平衡同时约束平动与转动",
        "刚体不能只用质点的 ΣF=0 判断平衡。它还可能在合力为零时受到纯力偶，因此必须同时令总力矩为零。",[
          section("一般维定义","在 ℝⁿ 中，合力 R 是 n 维向量，总力矩 M_O 是反对称二阶张量。自由刚体平衡定义为 R=0 且 M_O=0；两部分分别排除平动和各二维转动平面上的外力效应。",`def IsBalancedAtN (O : PointN n) (S : ForceSystemN n) : Prop :=
  resultantN S = 0 ∧
  totalMomentTensorAt O S = 0`),
          section("为什么定义不依赖原点","已知 R=0 与 M_O=0，移矩公式给出 M_Q=M_O−(Q−O)∧R=0。证明的逻辑顺序很重要：先用平动平衡消去修正项，再运输转动平衡。",`theorem balance_origin_independent
    (h : IsBalancedAtN O S) : IsBalancedAtN Q S := by
  constructor
  · exact h.1
  · rw [totalMomentTensorAt_change_origin, h.1, h.2]
    simp [wedge]`),
          section("方程数量与退化","一般 n 维有 n 个合力分量和 n(n−1)/2 个力矩分量，共 n(n+1)/2 个标量条件；但几何约束可能使部分方程相关。三维最多六个，平面问题通常只保留两个力分量和一个力矩。","",["一般空间刚体：检查全部独立分量。","平面力系：2 个平动 + 1 个转动方程。","共线力系：某些力矩方程自动为零。","受约束系统：反力与许可运动需另行处理。"])
        ],"静力平衡只刻画外力瞬时效应；它不自动保证接触可行，也不说明带非零初速度的物体会静止。"),

      "equilibrium-iff": guide(U2,"09 / 17","用虚功率刻画三维刚体平衡",
        "三维刚体的无穷小运动可拆成参考点的平动速度 v 与角速度 ω。外力对它的瞬时功率是 R·v+M·ω。",[
          section("平衡推出零虚功率","若 R=0 且 M=0，则对任意 v、ω 两个点积都为零。这一方向只是把平衡定义代入虚功率表达式。",`def rigidVirtualPower (R M v ω : Vec3) : ℝ :=
  dotProduct R v + dotProduct M ω

R = 0 ∧ M = 0 →
  ∀ v ω, rigidVirtualPower R M v ω = 0`),
          section("零虚功率反推出平衡","若对所有 v、ω 功率为零，先取 v=R、ω=0，得到 R·R=0，故 R=0；再取 v=0、ω=M，得到 M·M=0，故 M=0。关键是欧式内积正定，而不是对六个坐标逐一计算。",`have hR : dotProduct R R = 0 := by
  simpa [rigidVirtualPower] using h R 0
have : R = 0 := dotProduct_self_eq_zero.mp hR

-- 对 M 重复同一测试`),
          section("受约束时结论会减弱","若只允许某个虚运动子空间，功率在该子空间上为零只说明载荷泛函属于其正交补，不能推出所有外力分量为零；理想约束反力正是这样被保留下来。","",["自由刚体：所有 v、ω 可取，等价于 R=M=0。","理想约束：只测试许可方向，约束反力可非零。","非理想约束：摩擦等可能对许可运动做功。"])
        ],"本关把虚转动写成三维角速度；一般 n 维需使用反对称角速度张量及其自然配对。"),

      "support-reactions": guide(U2,"10 / 17","支反力由约束与平衡共同决定",
        "简支梁把抽象平衡落到一个可完整推导的物理例子：两个支座提供未知竖直反力，集中载荷的位置决定它们如何分配。",[
          section("建立自由体图对应的方程","跨长 L 的梁在距左端 a 处受向下载荷 P。取向上为正，合力平衡给 R_A+R_B=P；以左支点 A 取矩，R_A 力臂为零，得到 R_B L=P a。",`-- 平动平衡
R_A + R_B = P

-- 关于 A 的转动平衡
R_B * L = P * a`),
          section("解反力并验证","当 L≠0 时，R_B=Pa/L，代回得到 R_A=P(L−a)/L。Lean 证明必须显式提供 L≠0；若还要证明反力非负，则需要 P≥0、0≤a≤L 和 L>0。",`def leftReaction P a L := P * (L - a) / L
def rightReaction P a L := P * a / L

theorem force_balance (hL : L ≠ 0) :
  leftReaction P a L + rightReaction P a L = P := by
  field_simp [leftReaction, rightReaction, hL]
  ring`),
          section("按载荷位置分类","载荷在跨内时两个反力非负；恰在支点时另一个反力可为零；若 a<0 或 a>L，公式仍代数成立，但某个反力变负，说明需要能够承受拉力的约束或模型已不再是普通简支。","",["0<a<L：通常两个支反力均为正。","a=0 或 a=L：载荷落在支点，一个反力为零。","a∉[0,L]：外伸载荷可能产生负反力，需检查支座可行性。","L=0：几何退化，方程不能除以跨长。"])
        ],"本关只求外部支反力；剪力、弯矩和应力分布需要梁的连续体模型。"),

      determinacy: guide(U2,"11 / 17","静定性是平衡算子的可解性与唯一性",
        "未知反力可组成向量 r，平衡方程写成线性映射 A r+load=0。静定、超静定和机构问题可由解集与核统一分类。",[
          section("把平衡写成线性方程","A 把每组候选反力映到合力与合力矩残差。对固定载荷，若恰有一个 r 使残差为零，结构对该载荷静定。Lean 的 ∃! 同时表达存在与唯一。",`def IsStaticallyDeterminate
    (A : Reaction →ₗ[ℝ] Equilibrium) (load : Equilibrium) : Prop :=
  ∃! r, A r + load = 0`),
          section("非零核产生自应力","若 k≠0 且 Ak=0，已有解 r₀ 可改成 r₀+k，而平衡残差不变。这证明仅靠静力方程不能唯一确定反力；材料刚度和变形协调条件必须进入下一层模型。",`A (r₀ + k) + load
  = A r₀ + A k + load
  = A r₀ + load

k ∈ LinearMap.ker A`),
          section("必须区分三种失败方式","未知量多于独立方程常提示超静定，但仅数数并不总够；真正分类应看方程是否相容以及核是否非零。","",["存在唯一解：静定。","存在多个解：超静定，通常有自应力方向。","无解：给定载荷与约束不相容。","位移自由度未被约束：可能形成机构，需转向运动学分析。"])
        ],"本关在有限维线性平衡层分类；几何非线性、材料本构和屈曲可能改变结论。"),

      work: guide(U2,"12 / 17","常力功来自内积配对",
        "功不是“力乘距离”的无方向版本，而是力与位移的内积。它只取位移在力方向上的分量，因此自然得到正、负和零三种情况。",[
          section("定义与符号","常力 F 从 P 到 Q 的功为 W=F·(Q−P)=‖F‖‖Δr‖cosθ。锐角时做正功，钝角时做负功，正交时为零。",`def work (F : Vec3) (p q : Point3) : ℝ :=
  dotProduct F (q.coord - p.coord)`),
          section("为什么可以分段相加","位移满足 R−P=(Q−P)+(R−Q)，点积对第二变量线性，所以 W(P,R)=W(P,Q)+W(Q,R)。这里路径分段不改变结果，是因为力被假设为常向量。",`theorem work_add (F : Vec3) (p q r : Point3) :
    work F p r = work F p q + work F q r := by
  rw [show r.coord - p.coord =
    (q.coord - p.coord) + (r.coord - q.coord) by ext i; ring]
  simp [work, dotProduct_add]`),
          section("变力时必须分类","若 F 依赖位置，功应为曲线积分；保守力的积分只依赖端点，非保守力一般依赖路径。不能把常力的分段等式直接解释成所有力都路径无关。","",["常力：点积定义，端点决定。","保守变力：曲线积分可由势能差表示。","一般变力：功依赖具体路径。","理想约束力：在许可虚位移上可能做零功。"])
        ],"本关只形式化常力功；一般曲线积分将在动力学或微分几何单元引入。"),

      potential: guide(U2,"13 / 17","保守力是势能下降最快的方向",
        "势能 V 把每个构型映到一个标量。欧式内积把微分 dV 识别成梯度 ∇V，保守力定义为 F=−∇V。",[
          section("梯度为何出现","对任意微小位移 δx，势能的一阶变化为 dV_x(δx)=⟪∇V(x),δx⟫。若保守力做功等于势能减少，则 F·δx=−dV_x(δx)，对所有 δx 成立迫使 F=−∇V。",`def elasticForce (V : E → ℝ) (x : E) : E :=
  - gradient V x

-- dV_x(δx) = ⟪gradient V x, δx⟫`),
          section("二次弹簧势能","各向同性弹簧取 V(x)=½k⟪x,x⟫。梯度为 k•x，因此 F=−k•x；负号说明力指向平衡点。现行 Physlib（由原 PhysLean 合并而来）的 Gradient 模块提供所需二次型规则。",`import Physlib.Mathematics.Calculus.Gradient

def quadraticPotential k x :=
  (1 / 2 : ℝ) * k * ⟪x, x⟫_ℝ

theorem gradient_quadraticPotential :
  gradient (quadraticPotential k) x = k • x := by
  rw [gradient_const_mul_inner_self]
  module`),
          section("势能方法的适用分类","势能可加常数而不改力；多维刚度可能有零模；摩擦、速度相关力和某些随动力通常不能由单值势能表示。","",["保守力：局部可写为 −∇V。","势能加常数：物理力不变。","耗散力：需功率或耗散函数，不能直接套势能极小。","非保守随动力：稳定性可能不能由势能判断。"])
        ],"本关使用有限维欧式梯度与二次势能。一般流形上的微分与梯度不属于当前三单元主线，可作为结项后的扩展方向。"),

      "virtual-work": guide(U2,"14 / 17","虚功原理只测试许可方向",
        "约束系统中，物体并不能沿任意方向发生无穷小位移。虚功原理的关键不是“位移是假的”，而是测试满足线性化约束的方向。",[
          section("许可虚运动的定义","对三维刚体，可用 (v,ω) 表示无穷小平动与转动。约束选择一个许可集合或子空间 admissible；外力虚功率只需在其中为零。",`abbrev AdmissibleMotions := Set (Vec3 × Vec3)

def VirtualWorkPrincipleAt O S admissible : Prop :=
  ∀ motion ∈ admissible,
    rigidVirtualPowerAt O S motion.1 motion.2 = 0`),
          section("理想约束为何消去反力","理想约束反力只作用在被禁止的方向，与所有许可虚位移正交。因此在虚功方程中不出现，却仍可能在真实平衡中非零。这让我们无需先求出每个约束反力。",`-- admissible 是许可子空间
-- reaction ∈ admissibleᗮ
-- 所以 ∀ δ ∈ admissible, dot reaction δ = 0`),
          section("自由与受约束情形不能混用","自由刚体的许可集合是全部运动，此时零虚功等价于 R=M=0；受约束时只得到载荷泛函在许可子空间上为零。若摩擦等非理想约束会对许可运动做功，还需额外模型。","",["自由系统：测试全部方向。","完整约束：许可空间维数降低。","理想约束：反力对许可方向零功。","非理想约束：必须保留摩擦或耗散功。"])
        ],"当前成果用 Set 表示许可运动；线性约束的正式升级应使用 LinearSubspace 及其正交补。"),

      stability: guide(U2,"15 / 17","势能极值与稳定性要分类讨论",
        "平衡点只说明一阶变化为零；是否稳定还取决于附近势能的二阶乃至高阶结构。最小模型 V(x)=½kx² 已能清楚展示三种不同情形。",[
          section("正刚度给出严格极小","若 k>0 且 x≠0，则 x²>0，所以 V(x)>V(0)。位移会增加势能，保守力 F=−kx 指回原点；在这一二次保守模型中，原点是稳定平衡。",`theorem positive_stiffness_strict_min
    (hk : 0 < k) (hx : x ≠ 0) :
    scalarPotential k 0 < scalarPotential k x := by
  have hx2 : 0 < x^2 := sq_pos_of_ne_zero hx
  simp [scalarPotential]
  nlinarith`),
          section("零与负刚度的不同","k=0 时势能在所有 x 上相同，二次模型只能判为中性；k<0 时任意非零小位移都降低势能，原点不可能是局部极小。两者不能都笼统称为“不稳定”。",`k = 0 → V x = V 0
k < 0 → V 1 < V 0`),
          section("高维与退化情形","多维二次势能由对称刚度矩阵 K 决定。正定时严格稳定；半正定时存在零模，必须检查高阶项或约束；不定时存在负方向。非保守系统则可能即使没有势能也需用动力学谱判断。","",["K 正定：所有非零方向增能。","K 半正定：有零模，二阶判据不充分。","K 不定：存在降能方向。","无势能系统：改用动力学或 Lyapunov 方法。"])
        ],"本关只证明保守二次模型的局部分类，不覆盖屈曲后的分支、摩擦耗散和一般非线性稳定性。"),

      "statics-physlib": guide(U2,"16 / 17","区分课程模型与 PhysLean/Physlib 接口",
        "本章不是在宣称 Physlib 已经提供完整静力学 API。正确做法是：Mathlib 承担通用数学，现行 Physlib 承担已有物理基础接口，LeanPath 自己定义教学所需的力系与力矩层。",[
          section("项目名称的历史关系","原 PhysLean（此前名 HepLean）与 Lean-QuantumInfo 合并后形成当前 Physlib。官方仓库、构建目标和模块前缀现为 Physlib；所以历史说明可以提 PhysLean，而可执行 import 应保持 Physlib.*。",`-- 当前可执行路径
import Physlib.SpaceAndTime.ReferenceFrame
import Physlib.Mathematics.Calculus.Gradient

-- PhysLean 是来源项目名，不是当前模块前缀。`),
          section("三层代码分别做什么","Mathlib 提供 Matrix、ExteriorAlgebra、dotProduct、crossProduct 和 LinearMap；Physlib 提供参考系、梯度和单位等物理化接口；AppliedForceN、ForceSystemN、MomentTensor 等是本站为了教学透明性定义的模型。",`import Mathlib.LinearAlgebra.ExteriorAlgebra.Basic
import Mathlib.LinearAlgebra.CrossProduct
import Physlib.Mathematics.Calculus.Gradient

#check ExteriorAlgebra
#check crossProduct
#check gradient`),
          section("如何验证一个真实接口","先查看仓库当前路径，再 import 最小模块并 #check 完整名称；不要从旧教程复制已经移动的命名空间。若课程自建定义与库中定义相似，也应明确二者没有自动等同。","",["Mathlib 定理：通用数学结果。","Physlib 定理：当前合并物理库中的接口。","PhysLean：历史来源与相关论文的项目名。","LeanPath 定义：本站课程层，不冒充上游库内容。"])
        ],"库处于持续演化中；成果代码的可重复构建最终需要固定 Lean、Mathlib 与 Physlib 版本。"),

      "statics-practice": guide(U2,"17 / 17","用统一检查流程贯穿整章静力学",
        "综合实验将不再告诉你应调用哪一节。面对问题时，应先判断几何对象，再建立平衡或能量关系，最后审查假设与适用范围。",[
          section("对象层：先分清类型","点不能直接相加，位移和力是向量，一般维力矩是反对称二阶张量，功与势能是标量。量纲相同也不能越过这些几何类型。",`structure StaticsModel n where
  points : List (PointN n)
  forces : ForceSystemN n
  referencePoint : PointN n`),
          section("方程层：选择合适原理","外部刚体平衡使用 R=0 与 M=0；支反力问题同时加入约束未知量；虚功只测试许可方向；保守稳定性则检查势能在约束集合上的极值。",`def passesExternalBalance (model : StaticsModel n) : Prop :=
  resultantN model.forces = 0 ∧
  totalMomentTensorAt model.referencePoint model.forces = 0`),
          section("边界层：给结论加上条件","相同代数公式在退化几何、单边支座、零刚度或非保守载荷下可能有完全不同的解释。答题前应主动分类，而不是等错误选项提醒。","",["几何是否退化：L=0、共线、维数降低。","方程是否相容：有唯一解、多解或无解。","约束是否可行：反力符号、许可方向。","能量法是否适用：保守性、正定性、高阶项。"])
        ],"完成综合实验后，图鉴解锁的成果会明确标注：一般维力矩为本站形式化，梯度与参考系接口来自现行 Physlib。")
    }
  };
}());

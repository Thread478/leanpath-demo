/* LeanPath Physics · Part I: Units and Dimensions */
(function () {
  const concepts = {
    "quantity-triad": {title:"物理量的三个层次",body:"物理量不是一个裸数值。数值依赖所选单位，单位规定尺度，量纲描述它属于哪一类物理量。改变单位会改变数值，却不会改变量纲。",code:"36 km/h = 10 m/s\n-- 数值不同，速度量纲同为 L·T⁻¹"},
    "exact-real": {title:"定理中的数值通常使用 ℝ",body:"Float 适合有限精度计算；ℝ 适合陈述精确等式和不等式。单位换算可以先在 ℝ 中严格证明，再单独讨论数值近似。",code:"example : (36 : ℝ) * 1000 / 3600 = 10 := by\n  norm_num"},
    "si-seven": {title:"SI 的七个基本量",body:"时间、长度、质量、电流、热力学温度、物质的量和发光强度构成 SI 的七个基本量。对应基本单位是 s、m、kg、A、K、mol、cd。",code:"inductive BaseDimension where\n  | time | length | mass | electricCurrent\n  | temperature | amountOfSubstance\n  | luminousIntensity"},
    "dimension-vector": {title:"量纲是整数指数向量",body:"给每个基本量指定一个整数指数即可构造量纲。例如力是 T⁻²L¹M¹，其余四个指数为零。用 BaseDimension → ℤ 表示可避免依赖坐标顺序。",code:"structure Dimension where\n  exponent : BaseDimension → ℤ"},
    "dimension-equality": {title:"量纲相等是逐分量相等",body:"两个量纲相等，当且仅当七个基本指数全部相等。Lean 中可以用 ext 把量纲相等目标化为每个基本量上的指数相等。",code:"ext b\ncases b <;> rfl"},
    "dimension-algebra": {title:"量纲构成乘法代数",body:"物理量相乘时量纲指数相加，相除时相减，取倒数时取负，整数次幂时所有指数乘以该整数。无量纲量是零指数向量，也是乘法单位元。",code:"[xy] = [x] * [y]\n[x/y] = [x] / [y]\n[xⁿ] = [x]ⁿ"},
    "rational-exponent": {title:"根式需要有理指数",body:"若只用整数指数，√length 不能在该量纲类型中表示。完整库常允许有理指数；若物理公式最终要求普通量纲，则需要证明根式内部的指数可相应约分。",code:"-- 整数模型：BaseDimension → ℤ\n-- Physlib：指数允许 ℚ，可表达平方根量纲"},
    "derived-dimension": {title:"导出量纲由代数运算构造",body:"速度、力、能量等不是额外的基本量，而是七个基本量纲的乘除组合。先通过定义构造，再证明不同公式给出的构造一致。",code:"speed := length / time\nforce := mass * acceleration\nenergy := force * length"},
    "dimensionless": {title:"无量纲不等于没有物理语义",body:"比例、应变、折射率、雷诺数以及平面角都具有零指数向量，但它们不可因此任意互换。rad、sr、百分数等仍可作为表达语义的单位。",code:"[v/c] = 1\n[ΔL/L] = 1\n[angle] = 1"},
    "unit-system": {title:"单位制选择表示，不改变量纲",body:"SI、CGS 与自然单位制对同一量纲选择不同基准尺度。令 c=1 或 ℏ=1 是单位制约定，并非把有量纲常数变成纯粹无量纲数学对象。",code:"quantity = numericalValue × chosenUnit\n-- 改变 chosenUnit 时 numericalValue 反向变化"},
    "scale-conversion": {title:"线性单位换算由尺度因子控制",body:"若单位 u₁ = k·u₂，则同一物理量的数值满足 x₂ = kx₁。面积和体积的换算因子分别平方和立方，不能沿用长度的一次因子。",code:"1 km = 1000 m\n1 km² = 10⁶ m²\n1 km³ = 10⁹ m³"},
    "affine-unit": {title:"温标是需要分类处理的仿射单位",body:"开尔文与摄氏度的温差尺度相同，但零点不同：T_K = T_℃ + 273.15。绝对温度换算含平移；温差换算则只有尺度，不能混为一谈。",code:"absolute:  T_K = T_C + 273.15\ndifference: ΔT_K = ΔT_C"},
    "typed-quantity": {title:"让量纲成为 Quantity 的类型索引",body:"裸 ℝ 无法区分米和秒。Quantity d 把量纲 d 放进类型，使长度和时间成为不同类型；非法加法在 elaboration 阶段失败。",code:"structure Quantity (d : Dimension) where\n  value : ℝ"},
    "typed-operations": {title:"物理运算在返回类型中计算量纲",body:"加减法保持同一个 d；乘法返回 Quantity (d₁*d₂)，除法返回 Quantity (d₁/d₂)，纯数缩放保持量纲。",code:"add : Quantity d → Quantity d → Quantity d\nmul : Quantity d₁ → Quantity d₂ → Quantity (d₁*d₂)"},
    "homogeneity": {title:"量纲齐次性是公式成立的必要条件",body:"等号两侧必须同量纲，同一加法中的各项也必须同量纲；sin、exp、log 等函数的自变量通常必须无量纲。但齐次性不能确定无量纲常数和具体函数形式。",code:"[E] = [m c²]\n[T] = [√(m/k)]\n-- 必要，但通常不充分"},
    "physlib-dimension": {title:"Physlib 的 Dimension",body:"Physlib 已实现更成熟的量纲代数，使用基本量类型 B 和有理指数，并给出交换群及有理幂结构。课程中的透明模型用于理解，研究代码应优先复用库。",code:"import Physlib.Units.Dimension\n-- Dimension B，指数取 ℚ"},
    "physlib-withdim": {title:"Physlib 的 WithDim",body:"WithDim d M 把底层数值类型 M 与量纲 d 绑定。相同量纲可相加，乘除自动组合量纲；Dimensionful 再处理单位制选择和换算。",code:"import Physlib.Units.WithDim.Basic\n#check WithDim\n#check DimSpeed.oneKilometerPerHour_in_SI"},
    "model-boundary": {title:"量纲检查不替代物理建模",body:"量纲齐次只能排除一类错误。x = vt 与 x = 2vt 同样齐次，但系数和适用条件不同；形式化还需定义系统、假设、定律和实验解释。",code:"dimensionally valid ≠ physically established"}
  };

  function deck(label, desc, xp, questions, draw) {
    return {label:label, desc:desc, xp:xp, draw:draw || 6, mix:[2,2,2], questions:questions};
  }

  const decks = {
    quantity: deck("物理量的三层结构","区分物理量、数值、单位与量纲，并明确精确实数模型的边界。",10,[
      {id:"q-triad",level:1,concept:"quantity-triad",p:"完整记录一个物理测量，至少要区分哪三个层次？",c:"36 km/h",o:["数值、单位、量纲","变量名、颜色、文件名","整数、字符串、布尔值"],a:0,e:"36 是数值，km/h 是单位，LT⁻¹ 是量纲。"},
      {id:"q-unit-change",level:1,concept:"quantity-triad",p:"同一速度从 36 km/h 改写为 10 m/s，什么保持不变？",c:"36 km/h = 10 m/s",o:["物理量及其速度量纲","数值","单位符号"],a:0,e:"表示改变了，物理量和量纲没有改变。"},
      {id:"q-real",level:1,concept:"exact-real",p:"精确证明单位换算时，数值优先声明为什么类型？",c:"variable (x : ___)",o:["ℝ","Float","String"],a:0,e:"ℝ 支持精确实数等式；Float 适合近似计算。"},
      {id:"q-dimension-vs-unit",level:2,concept:"quantity-triad",p:"m/s 与 km/h 的关系是？",c:"[m/s] ? [km/h]",o:["同量纲、不同单位尺度","不同量纲、同数值","同单位、不同量纲"],a:0,e:"二者都表示速度，但到 SI 的尺度因子不同。"},
      {id:"q-name-no-type",level:2,concept:"typed-quantity",p:"若 distance 和 time 都只是 ℝ，Lean 会阻止 distance + time 吗？",c:"variable (distance time : ℝ)\n#check distance + time",o:["不会；变量名不参与类型检查","会；英语名字自带量纲","会；ℝ 自带 SI 单位"],a:0,e:"必须显式编码量纲或在运算时检查。"},
      {id:"q-prop",level:2,concept:"exact-real",p:"单位换算等式在 Lean 中属于什么类型？",c:"#check ((36 : ℝ) * 1000 / 3600 = 10)",o:["Prop","ℝ","Bool"],a:0,e:"等式是一条命题，证明是该命题类型的项。"},
      {id:"q-measurement",level:3,concept:"model-boundary",p:"Lean 证明换算等式后，是否已经验证测速仪的实验读数？",c:"example : (36 : ℝ)*1000/3600 = 10 := by norm_num",o:["没有；这里只验证数学换算","有；Lean 自动连接仪器","有；任何 ℝ 等式都是实验事实"],a:0,e:"演绎验证与经验测量是不同层次。"},
      {id:"q-zero-value",level:3,concept:"quantity-triad",p:"数值为 0 的量是否仍可能有量纲？",c:"0 m/s",o:["是；零速度仍有速度量纲","否；0 会删除单位","仅在 Float 中有"],a:0,e:"数值为零不抹去量的类别。"},
      {id:"q-same-dim-semantics",level:3,concept:"model-boundary",p:"力矩与能量都具有 ML²T⁻²，是否因此是同一物理概念？",c:"[torque] = [energy]",o:["不是；同量纲不等于同语义","是；量纲相同就可互换","是；二者数值恒等"],a:0,e:"量纲分类较粗，不能取代对象的物理定义。"}
    ]),

    "si-base": deck("七个 SI 基本量","系统掌握 SI 基本量、基本单位以及基本量与导出量的区别。",12,[
      {id:"si-time",level:1,concept:"si-seven",p:"SI 中时间的基本单位是？",c:"time",o:["second (s)","hour (h)","hertz (Hz)"],a:0,e:"秒是 SI 基本单位，小时是可与 SI 并用的非 SI 单位。"},
      {id:"si-mass",level:1,concept:"si-seven",p:"SI 质量基本单位是？",c:"mass",o:["kilogram (kg)","gram (g)","newton (N)"],a:0,e:"千克是七个基本单位中名称自带前缀的特殊者。"},
      {id:"si-current",level:1,concept:"si-seven",p:"电流和物质的量的基本单位分别是？",c:"electricCurrent / amountOfSubstance",o:["ampere / mole","coulomb / gram","volt / candela"],a:0,e:"A 对应电流，mol 对应物质的量。"},
      {id:"si-seven-list",level:2,concept:"si-seven",p:"哪一组恰好都是 SI 基本单位？",c:"___",o:["s, m, kg, A, K, mol, cd","s, m, N, J, Pa, V, W","h, km, g, C, ℃, L, lm"],a:0,e:"第二组多为导出单位，第三组含非 SI 或可并用单位。"},
      {id:"si-kelvin",level:2,concept:"si-seven",p:"热力学温度的 SI 基本单位是？",c:"temperature",o:["kelvin (K)","degree Celsius (℃)","joule (J)"],a:0,e:"摄氏度与开尔文有仿射关系，但基本单位是 K。"},
      {id:"si-candela",level:2,concept:"si-seven",p:"坎德拉 cd 对应哪个基本量？",c:"cd",o:["发光强度","光通量","照度"],a:0,e:"光通量 lm 和照度 lx 都是导出量。"},
      {id:"si-charge-derived",level:3,concept:"derived-dimension",p:"电荷为何不是第八个基本量？",c:"Q = I·t",o:["它可由电流乘时间导出","因为电荷没有单位","因为库不支持电学"],a:0,e:"库仑 C = A·s。"},
      {id:"si-angle",level:3,concept:"dimensionless",p:"平面角的 SI 地位是什么？",c:"radian",o:["具有专名单位 rad 的无量纲导出量","第八个基本量","长度量"],a:0,e:"角的量纲指数为零，但 rad 保留语义。"},
      {id:"si-basis-choice",level:3,concept:"unit-system",p:"“基本量”是否完全由自然唯一决定？",c:"choice of basis",o:["体系选择有约定性，但必须能一致生成所需量纲","完全任意且无需独立","由变量名自动决定"],a:0,e:"SI 选七个基本量；其他理论可采用等价基底或自然单位约定。"}
    ]),

    "dimension-model": deck("构造量纲向量","用七个基本指数定义 Dimension，并学习基向量与外延性。",14,[
      {id:"dm-inductive",level:1,concept:"si-seven",p:"在 Lean 中枚举七个基本量，适合使用什么声明？",c:"___ BaseDimension where\n  | time | length | mass | ...",o:["inductive","theorem","namespace"],a:0,e:"归纳类型列出所有基本构造器。"},
      {id:"dm-function",level:1,concept:"dimension-vector",p:"哪种类型最直接表达“为每个基本量记录整数指数”？",c:"exponent : ___",o:["BaseDimension → ℤ","List String","ℝ → Bool"],a:0,e:"函数表示不依赖固定坐标排列。"},
      {id:"dm-basis",level:1,concept:"dimension-vector",p:"长度基量纲的指数应满足什么？",c:"basis .length",o:["length 分量为 1，其余为 0","所有分量为 1","length 分量为 −1"],a:0,e:"它是指数空间中的标准基向量。"},
      {id:"dm-force-vector",level:2,concept:"dimension-vector",p:"按顺序 (T,L,M,I,Θ,N,J)，力的指数向量是？",c:"[F] = MLT⁻²",o:["(−2,1,1,0,0,0,0)","(2,1,1,0,0,0,0)","(−2,2,1,0,0,0,0)"],a:0,e:"时间 −2、长度 1、质量 1。"},
      {id:"dm-ext",level:2,concept:"dimension-equality",p:"证明两个 Dimension 相等时，ext b 的作用是？",c:"⊢ d₁ = d₂",o:["化为任意基本量 b 上指数相等","删除所有指数","只比较长度分量"],a:0,e:"结构外延性把整体相等化成逐分量相等。"},
      {id:"dm-dimensionless-zero",level:2,concept:"dimension-vector",p:"无量纲量对应哪个指数向量？",c:"dimensionless",o:["七个分量全为 0","七个分量全为 1","只有时间为 0"],a:0,e:"它是量纲乘法的单位元。"},
      {id:"dm-order-free",level:3,concept:"dimension-vector",p:"使用 BaseDimension → ℤ 相比长度为 7 的列表有何优势？",c:"Dimension.exponent",o:["索引带语义且不会因列表位置混淆","自动证明所有公式","可省略七个基本量"],a:0,e:"函数索引明确每个指数属于哪个基本量。"},
      {id:"dm-integer-limit",level:3,concept:"rational-exponent",p:"整数指数模型不能直接表达哪种形式？",c:"___",o:["√length 的量纲 L^(1/2)","速度 LT⁻¹","能量 ML²T⁻²"],a:0,e:"平方根量纲需要有理指数或额外可整除条件。"},
      {id:"dm-equality-all",level:3,concept:"dimension-equality",p:"两个量纲有六个指数相同、一个不同，它们是否相等？",c:"∀ b ≠ b₀, e₁ b = e₂ b",o:["不相等","相等，因为多数相同","只在 SI 中相等"],a:0,e:"量纲相等要求所有基本分量一致。"}
    ]),

    "dimension-ops": deck("量纲代数","掌握乘法、除法、逆和整数幂，并辨析根式与加法的特殊情况。",16,[
      {id:"do-mul",level:1,concept:"dimension-algebra",p:"量纲相乘时指数如何变化？",c:"LᵃTᵇ · LᶜTᵈ",o:["逐分量相加","逐分量相乘","只保留左侧"],a:0,e:"结果是 Lᵃ⁺ᶜTᵇ⁺ᵈ。"},
      {id:"do-div",level:1,concept:"dimension-algebra",p:"量纲相除对应什么运算？",c:"d₁ / d₂",o:["指数向量相减","指数向量相加","交换两个向量"],a:0,e:"除法等于乘以逆量纲。"},
      {id:"do-inv",level:1,concept:"dimension-algebra",p:"频率是时间的倒数，其量纲为？",c:"frequency = 1 / time",o:["T⁻¹","T","L⁻¹"],a:0,e:"取逆把时间指数 1 变为 −1。"},
      {id:"do-power",level:2,concept:"dimension-algebra",p:"面积量纲如何由长度构造？",c:"areaDim",o:["lengthDim ^ (2 : ℤ)","lengthDim * timeDim","lengthDim / 2"],a:0,e:"整数幂将长度指数乘以 2。"},
      {id:"do-cancel",level:2,concept:"dimension-algebra",p:"d⁻¹ * d 的结果是什么？",c:"d⁻¹ * d",o:["无量纲 1","d²","零物理量"],a:0,e:"指数 −e + e = 0。注意无量纲不是数值零。"},
      {id:"do-add",level:2,concept:"typed-operations",p:"两个同量纲物理量相加后，结果量纲怎样？",c:"x : Quantity d\ny : Quantity d",o:["仍为 d","变成 d²","变成无量纲"],a:0,e:"加法不是量纲乘法；它保持共同量纲。"},
      {id:"do-assoc",level:3,concept:"dimension-algebra",p:"为什么 (d₁d₂)d₃ = d₁(d₂d₃)？",c:"Dimension.mul_assoc",o:["整数指数加法满足结合律","物理量数值总为 1","单位名称相同"],a:0,e:"量纲乘法逐分量使用整数加法。"},
      {id:"do-sqrt",level:3,concept:"rational-exponent",p:"若 d 的每个整数指数都是偶数，√d 的指数怎样得到？",c:"sqrt dimension",o:["各指数除以 2","各指数乘以 2","全部置零"],a:0,e:"偶数条件保证结果仍落在整数指数模型中。"},
      {id:"do-comm",level:3,concept:"dimension-algebra",p:"量纲乘法为何交换？",c:"d₁ * d₂ = d₂ * d₁",o:["指数整数加法交换","所有物理乘法都交换","Lean 忽略顺序"],a:0,e:"这里说的是量纲代数；具体对象乘法未必交换。"}
    ]),

    "derived-dimensions": deck("导出量纲","从七个基本量推导力学、电学与热学常用量纲。",18,[
      {id:"dd-speed",level:1,concept:"derived-dimension",p:"速度的量纲是？",c:"speed = length / time",o:["LT⁻¹","LT","L⁻¹T"],a:0,e:"长度除以时间。"},
      {id:"dd-force",level:1,concept:"derived-dimension",p:"由 F = ma 得到力的量纲？",c:"[F] = [m][a]",o:["MLT⁻²","MLT⁻¹","ML²T⁻²"],a:0,e:"质量乘加速度。"},
      {id:"dd-energy",level:1,concept:"derived-dimension",p:"功与能量的量纲是？",c:"W = F·s",o:["ML²T⁻²","MLT⁻²","ML²T⁻³"],a:0,e:"力乘长度。"},
      {id:"dd-power",level:2,concept:"derived-dimension",p:"功率的量纲是？",c:"P = E/t",o:["ML²T⁻³","ML²T⁻²","MLT⁻³"],a:0,e:"能量再除以时间。"},
      {id:"dd-pressure",level:2,concept:"derived-dimension",p:"压强 F/A 的量纲是？",c:"pressure = force / area",o:["ML⁻¹T⁻²","MLT⁻²","ML²T⁻²"],a:0,e:"MLT⁻² 除以 L² 得 ML⁻¹T⁻²。"},
      {id:"dd-charge",level:2,concept:"derived-dimension",p:"电荷量纲由什么构造？",c:"Q = I t",o:["IT","I/T","MLT⁻²"],a:0,e:"电流乘时间。"},
      {id:"dd-voltage",level:3,concept:"derived-dimension",p:"电压 V = E/Q 的量纲是？",c:"energy / charge",o:["ML²T⁻³I⁻¹","ML²T⁻²I","MLT⁻²I⁻¹"],a:0,e:"ML²T⁻² 除以 IT 得 ML²T⁻³I⁻¹。"},
      {id:"dd-kinetic",level:3,concept:"homogeneity",p:"m v² 的量纲为什么等于能量？",c:"massDim * speedDim^2",o:["M·(LT⁻¹)² = ML²T⁻²","M·LT⁻¹ = MLT⁻¹","M²L²T⁻²"],a:0,e:"平方作用在速度量纲的全部指数上。"},
      {id:"dd-same-dim",level:3,concept:"model-boundary",p:"压强与能量密度 E/V 的量纲关系是？",c:"[E/V]",o:["相同，都是 ML⁻¹T⁻²","不同，因为概念名不同","相同且物理定义完全等价"],a:0,e:"它们同量纲，但具体物理语义仍由模型决定。"}
    ]),

    dimensionless: deck("无量纲量","理解零指数向量、带专名单位的无量纲量以及量纲分析的语义边界。",16,[
      {id:"dl-ratio",level:1,concept:"dimensionless",p:"同类长度之比 ΔL/L 的量纲是？",c:"strain = ΔL / L",o:["无量纲","长度","面积"],a:0,e:"L/L 的指数抵消。"},
      {id:"dl-angle",level:1,concept:"dimensionless",p:"平面角在 SI 中是什么量纲？",c:"arcLength / radius",o:["无量纲，专名单位 rad","长度","时间"],a:0,e:"弧长与半径之比为无量纲。"},
      {id:"dl-refractive",level:1,concept:"dimensionless",p:"折射率 n = c/v 的量纲是？",c:"n = c / v",o:["无量纲","速度","加速度"],a:0,e:"两个速度量纲相除。"},
      {id:"dl-sin",level:2,concept:"homogeneity",p:"sin(x) 的自变量通常应满足什么量纲条件？",c:"Real.sin x",o:["x 必须无量纲（角可用 rad 表示）","x 必须是长度","x 必须是力"],a:0,e:"幂级数各项要能相加，要求自变量无量纲。"},
      {id:"dl-percent",level:2,concept:"dimensionless",p:"50% 与 0.5 的关系是？",c:"50 %",o:["同一无量纲比例的不同表示","不同量纲","一个是长度一个是时间"],a:0,e:"百分号提供尺度和语义，但量纲指数仍为零。"},
      {id:"dl-reynolds",level:2,concept:"dimensionless",p:"雷诺数无量纲意味着什么？",c:"Re = ρvL/μ",o:["各基本指数抵消，可比较不同尺度流动","它没有物理意义","它的数值恒为 1"],a:0,e:"无量纲群常用于相似性分析，但数值可任意变化。"},
      {id:"dl-semantic",level:3,concept:"dimensionless",p:"角度与应变都无量纲，能否直接相加？",c:"angle + strain",o:["量纲分析不反对，但语义类型可进一步区分","一定可以且物理上自然","一定不能由 Lean 表达"],a:0,e:"Quantity d 只编码量纲；更细语义需额外类型或结构。"},
      {id:"dl-zero-vs-one",level:3,concept:"dimension-algebra",p:"dimensionless = 1 表示什么？",c:"(1 : Dimension)",o:["量纲乘法单位元，不是物理数值必须等于 1","所有无量纲数值都等于 1","零物理量"],a:0,e:"量纲单位元的指数全零，数值仍可为任意实数。"},
      {id:"dl-log",level:3,concept:"homogeneity",p:"log(x/x₀) 为何量纲合法？",c:"Real.log (x / x₀)",o:["比值无量纲","log 自动删除单位","x 与 x₀ 必须数值相等"],a:0,e:"对数自变量应为无量纲比值。"}
    ]),

    "unit-systems": deck("单位与单位制","区分量纲空间、单位基准和数值坐标，并比较 SI、CGS 与自然单位。",16,[
      {id:"us-unit-role",level:1,concept:"unit-system",p:"单位在物理量表示中扮演什么角色？",c:"q = x · u",o:["为该量纲选择基准尺度 u","改变物理量本身","决定量纲指数"],a:0,e:"数值 x 是物理量相对于单位 u 的坐标。"},
      {id:"us-si-cgs",level:1,concept:"unit-system",p:"SI 与 CGS 表示同一长度时，什么不同？",c:"1 m = 100 cm",o:["单位尺度和数值","长度量纲","几何对象"],a:0,e:"量纲保持 L。"},
      {id:"us-coherent",level:1,concept:"unit-system",p:"SI 相干导出单位 N 的定义是？",c:"newton",o:["kg·m·s⁻²","kg·m·s⁻¹","g·cm·s⁻²"],a:0,e:"相干意味着公式中不额外引入数值换算因子。"},
      {id:"us-coordinate",level:2,concept:"unit-system",p:"单位从 u 改为 u' = k u，同一量的数值怎样变化？",c:"x u = x' u'",o:["x' = x/k","x' = kx","x' = x+k"],a:0,e:"单位变大 k 倍，数值缩小 k 倍。"},
      {id:"us-natural",level:2,concept:"unit-system",p:"自然单位中写 c = 1 的正确理解是？",c:"c = 1",o:["选择单位使时间与长度尺度由 c 联系","证明光速无量纲且无物理意义","令真实光速变成 1 m/s"],a:0,e:"这是单位约定，不是改变物理规律。"},
      {id:"us-base-change",level:2,concept:"unit-system",p:"换一组独立基本量后，同一导出量纲应如何处理？",c:"basis change",o:["对指数坐标作一致基变换","保留旧坐标不变","删除导出量"],a:0,e:"量纲对象不变，坐标描述随基底变化。"},
      {id:"us-prefix-kg",level:3,concept:"si-seven",p:"处理毫克等质量前缀时为什么要特别小心？",c:"1 mg",o:["SI 质量基本单位本身是 kg，不是 g","mg 是时间单位","前缀不影响数值"],a:0,e:"1 mg = 10⁻⁶ kg。"},
      {id:"us-affine",level:3,concept:"affine-unit",p:"摄氏温度为何不能仅用“单位倍数”描述？",c:"T_K = T_C + 273.15",o:["绝对温标零点不同，需要平移","摄氏度没有量纲","开尔文是对数单位"],a:0,e:"这是仿射换算，而非纯线性尺度变换。"},
      {id:"us-constant",level:3,concept:"unit-system",p:"在 ℏ = c = 1 的单位制中，能量、质量和逆长度为何可用同一数值单位？",c:"E = mc², E = ℏc/L",o:["单位选择用有量纲常数建立尺度同构","三者物理概念完全相同","量纲代数失效"],a:0,e:"恢复 c、ℏ 后仍能追踪原始 SI 量纲。"}
    ]),

    "unit-conversion": deck("单位换算","严格处理线性、幂次、仿射与特殊单位换算。",18,[
      {id:"uc-kmh",level:1,concept:"scale-conversion",p:"36 km/h 等于多少 m/s？",c:"(36 : ℝ) * 1000 / 3600",o:["10","36","100"],a:0,e:"1000/3600 = 5/18。"},
      {id:"uc-area",level:1,concept:"scale-conversion",p:"1 km² 等于多少 m²？",c:"(1000 m)^2",o:["10⁶ m²","10³ m²","10⁹ m²"],a:0,e:"面积换算因子是长度因子的平方。"},
      {id:"uc-newton",level:1,concept:"scale-conversion",p:"1 N 展开成 SI 基本单位是？",c:"F = ma",o:["1 kg·m·s⁻²","1 kg·m²·s⁻²","1 g·cm·s⁻²"],a:0,e:"N 是相干 SI 导出单位。"},
      {id:"uc-celsius",level:2,concept:"affine-unit",p:"0 ℃ 的绝对温度是多少？",c:"T_K = T_C + 273.15",o:["273.15 K","0 K","−273.15 K"],a:0,e:"摄氏和开尔文零点相差 273.15。"},
      {id:"uc-temp-diff",level:2,concept:"affine-unit",p:"温差 10 ℃ 等于多少 K？",c:"ΔT",o:["10 K","283.15 K","−263.15 K"],a:0,e:"温差只比较尺度，不加入零点偏移。"},
      {id:"uc-volume",level:2,concept:"scale-conversion",p:"1 cm³ 等于多少 m³？",c:"(10⁻² m)^3",o:["10⁻⁶ m³","10⁻² m³","10⁻⁴ m³"],a:0,e:"体积换算因子立方。"},
      {id:"uc-general",level:3,concept:"scale-conversion",p:"若 u₁ = k u₂，数值 x₁ 对应的 u₂ 数值是？",c:"x₁ u₁ = x₂ u₂",o:["x₂ = k x₁","x₂ = x₁/k","x₂ = x₁+k"],a:0,e:"代入 u₁ = ku₂ 即得。"},
      {id:"uc-log",level:3,concept:"affine-unit",p:"分贝 dB 为什么不能当作普通线性单位直接乘尺度因子？",c:"10 log₁₀(P/P₀)",o:["它是无量纲比值的对数表示","它属于长度量纲","它与开尔文完全相同"],a:0,e:"对数单位需要参考值和对数规则。"},
      {id:"uc-negative-k",level:3,concept:"affine-unit",p:"−5 ℃ 与 −5 K 的物理可行性有何区别？",c:"absolute temperature",o:["−5 ℃ 可对应正 K；负绝对温度需另有特殊理论语境","二者都等于 −5 K","摄氏不能为负"],a:0,e:"普通热力学绝对温度下 0 K 是下界；摄氏零点不同。"}
    ]),

    "typed-quantity": deck("依赖类型物理量","把量纲索引放入类型，并理解其能力与表达边界。",20,[
      {id:"tq-structure",level:1,concept:"typed-quantity",p:"哪一定义把量纲 d 放进物理量类型？",c:"___ Quantity (d : Dimension) where\n  value : ℝ",o:["structure","theorem","open"],a:0,e:"Quantity 是由量纲参数索引的结构。"},
      {id:"tq-different",level:1,concept:"typed-quantity",p:"Quantity lengthDim 与 Quantity timeDim 的类型关系是？",c:"distance / duration",o:["不同类型","完全相同","都是 String"],a:0,e:"索引 d 参与类型构造。"},
      {id:"tq-value",level:1,concept:"typed-quantity",p:"x.value 表示什么？",c:"x : Quantity d",o:["选定表示下的底层实数值","量纲指数向量","单位名称"],a:0,e:"当前简化模型将数值存为 ℝ。"},
      {id:"tq-safe-add",level:2,concept:"typed-quantity",p:"哪个 add 类型能在编译期禁止长度加时间？",c:"___",o:["Quantity d → Quantity d → Quantity d","Quantity d₁ → Quantity d₂ → ℝ","ℝ → ℝ → ℝ"],a:0,e:"两个输入必须共享同一个 d。"},
      {id:"tq-zero",level:2,concept:"typed-quantity",p:"长度零与时间零能否使用同一个未标注常量？",c:"0",o:["需要由上下文确定 Quantity 的量纲索引","可以无条件互换","零没有任何类型"],a:0,e:"数值零可嵌入多种量纲，但具体项仍有确定类型。"},
      {id:"tq-unit-missing",level:2,concept:"unit-system",p:"Quantity d 只存 value : ℝ 时还缺少哪一层？",c:"structure Quantity (d) where value : ℝ",o:["单位制/尺度选择","量纲索引","实数加法"],a:0,e:"该教学模型假设值已用统一单位表示；生产模型还需单位层。"},
      {id:"tq-semantic-limit",level:3,concept:"model-boundary",p:"能量与力矩同量纲时，Quantity energyDim 是否自动区分二者？",c:"[energy] = [torque]",o:["不能；还需额外语义类型或标签","能；量纲已包含全部物理意义","能；数值总不同"],a:0,e:"依赖量纲索引解决兼容性，不解决所有概念区分。"},
      {id:"tq-elaboration",level:3,concept:"typed-quantity",p:"distance + time 被拒绝发生在哪一阶段？",c:"Quantity.add distance time",o:["elaboration/类型检查阶段","实验测量阶段","网页随机组卷阶段"],a:0,e:"Lean 无法统一两个不同量纲索引。"},
      {id:"tq-proof-index",level:3,concept:"dimension-equality",p:"若两个量纲经证明相等，怎样在类型层连接 Quantity d₁ 与 Quantity d₂？",c:"h : d₁ = d₂",o:["沿 h 进行类型运输或改写","直接忽略 h","把值转成 String"],a:0,e:"依赖类型中的等式可用于 transport；良好 API 会封装这一步。"}
    ]),

    "typed-ops": deck("类型安全运算","为加减乘除、缩放和幂设计正确的量纲类型。",20,[
      {id:"to-add",level:1,concept:"typed-operations",p:"同量纲加法的返回类型是？",c:"add (x y : Quantity d)",o:["Quantity d","Quantity (d*d)","ℝ"],a:0,e:"相加保持量纲。"},
      {id:"to-mul",level:1,concept:"typed-operations",p:"乘法 x·y 的返回量纲应是？",c:"x : Quantity d₁\ny : Quantity d₂",o:["d₁ * d₂","d₁","1"],a:0,e:"乘法在类型中合成量纲。"},
      {id:"to-div",level:1,concept:"typed-operations",p:"长度除以时间应返回什么类型？",c:"Quantity.div distance duration",o:["Quantity speedDim","Quantity lengthDim","Quantity dimensionless"],a:0,e:"返回索引是 lengthDim/timeDim。"},
      {id:"to-scale",level:2,concept:"typed-operations",p:"纯实数 c 缩放 Quantity d 后量纲怎样？",c:"scale c x",o:["仍为 d","变成 d^c","变成无量纲"],a:0,e:"纯数被视为无量纲。"},
      {id:"to-sub",level:2,concept:"typed-operations",p:"温度绝对值的“相减”为何需要额外注意？",c:"T₁ - T₂",o:["结果是温差，语义上与绝对温标是仿射点/向量之别","结果必为绝对温度","量纲不同所以不能减"],a:0,e:"量纲相同只是必要条件；仿射量需要更细类型。"},
      {id:"to-power",level:2,concept:"typed-operations",p:"Quantity d 的平方应返回？",c:"x²",o:["Quantity (d^2)","Quantity d","Quantity 1"],a:0,e:"数值平方同时把量纲指数乘 2。"},
      {id:"to-speed-time",level:3,concept:"typed-operations",p:"为什么 speed × time 可作为 length 使用？",c:"speed_mul_time : speedDim * timeDim = lengthDim",o:["需要量纲恒等式把返回索引化简为 lengthDim","因为变量名相似","任何乘积都是长度"],a:0,e:"定义化简或显式等式证明连接两个索引。"},
      {id:"to-div-zero",level:3,concept:"model-boundary",p:"类型正确的 x/y 是否保证 y 数值非零？",c:"Quantity.div x y",o:["不保证；非零是额外值级假设","保证；量纲会证明非零","只有 y 无量纲时保证"],a:0,e:"量纲类型与数值域条件是两类约束。"},
      {id:"to-noncomm",level:3,concept:"dimension-algebra",p:"量纲乘法交换是否意味着所有物理对象乘法都交换？",c:"d₁*d₂ = d₂*d₁",o:["不意味着；矩阵、算符等对象乘法可不交换","意味着所有运算交换","只在时间量纲中不交换"],a:0,e:"返回量纲相同，不等于具体乘法项相等。"}
    ]),

    homogeneity: deck("量纲齐次性","用量纲检查公式，并明确必要性、不充分性及函数自变量条件。",22,[
      {id:"h-equality",level:1,concept:"homogeneity",p:"物理等式成立的首要量纲条件是？",c:"lhs = rhs",o:["左右量纲相同","左右数值都为 1","左右单位符号完全相同"],a:0,e:"单位可不同但必须可换算且量纲一致。"},
      {id:"h-sum",level:1,concept:"homogeneity",p:"表达式 a+b 合法时，a 与 b 应满足？",c:"a + b",o:["具有相同量纲","数值相等","单位字符串相同"],a:0,e:"可先换到同一单位表示，再做加法。"},
      {id:"h-emc",level:1,concept:"homogeneity",p:"E = mc² 是否量纲齐次？",c:"[m][c]^2",o:["是，结果 ML²T⁻²","否，结果是力","仅在 c=1 时齐次"],a:0,e:"质量乘速度平方是能量量纲。"},
      {id:"h-wrong",level:2,concept:"homogeneity",p:"哪一位置公式量纲错误？",c:"x₀ : L, v : LT⁻¹, a : LT⁻², t : T",o:["x = x₀ + v + a t²","x = x₀ + vt","x = x₀ + vt + 1/2 at²"],a:0,e:"第一式把速度直接与长度相加。"},
      {id:"h-period",level:2,concept:"rational-exponent",p:"弹簧振子周期 T ∝ √(m/k) 的根式量纲是什么？",c:"[k] = MT⁻²",o:["T","T²","无量纲"],a:0,e:"m/k 的量纲是 T²，平方根得到 T。"},
      {id:"h-exp",level:2,concept:"homogeneity",p:"衰减 e^(−t/τ) 为什么量纲合法？",c:"Real.exp (-t/τ)",o:["t/τ 无量纲","exp 会自动换算秒","τ 必须为长度"],a:0,e:"指数函数的自变量必须无量纲。"},
      {id:"h-not-sufficient",level:3,concept:"model-boundary",p:"x=vt 与 x=2vt 都齐次，说明什么？",c:"[x] = [v][t]",o:["量纲齐次是必要条件但不充分","两式都必然是同一物理定律","系数 2 会改变量纲"],a:0,e:"量纲分析通常不能决定无量纲常数。"},
      {id:"h-function-form",level:3,concept:"model-boundary",p:"量纲分析能否区分 sin(t/τ) 与 exp(−t/τ)？",c:"both arguments dimensionless",o:["不能仅靠量纲区分函数形式","能，因为 sin 有角度单位","能，因为 exp 没有类型"],a:0,e:"动力学方程、边界条件或实验信息决定具体函数。"},
      {id:"h-zero",level:3,concept:"homogeneity",p:"等式 lhs = 0 是否可以忽略 lhs 的量纲？",c:"F = 0",o:["不应忽略；0 应在目标量纲中解释","可以；0 永远无量纲","只有力可以等于 0"],a:0,e:"类型化零值由上下文获得与 lhs 相同的量纲。"}
    ]),

    "physlib-units": deck("调用 Physlib","认识 Physlib 的量纲、带量纲值与单位制 API，并复用真实定理。",24,[
      {id:"pl-import-dim",level:1,concept:"physlib-dimension",p:"只使用 Physlib 量纲定义时，聚焦导入是？",c:"___",o:["import Physlib.Units.Dimension","import String","open SI"],a:0,e:"聚焦导入明确依赖来源。"},
      {id:"pl-withdim",level:1,concept:"physlib-withdim",p:"Physlib 中把数值类型 M 与量纲 d 绑定的结构是？",c:"___ d M",o:["WithDim","Float","BaseDimension"],a:0,e:"WithDim d M 是量纲索引值。"},
      {id:"pl-check",level:1,concept:"physlib-withdim",p:"调用库定理前应先使用什么？",c:"___ DimSpeed.oneKilometerPerHour_in_SI",o:["#check","#eval","inductive"],a:0,e:"#check 显示参数与结论。"},
      {id:"pl-rational",level:2,concept:"physlib-dimension",p:"Physlib 的量纲指数允许 ℚ 有什么价值？",c:"Dimension B",o:["可表达平方根等有理幂量纲","使所有物理量无量纲","删除基本量"],a:0,e:"比纯整数指数模型更适合根式和一般标度。"},
      {id:"pl-kmh",level:2,concept:"physlib-withdim",p:"Physlib 已证明 1 km/h 的 SI 数值是？",c:"DimSpeed.oneKilometerPerHour_in_SI",o:["5/18 m/s","18/5 m/s","1000 m/s"],a:0,e:"1000/3600 约分为 5/18。"},
      {id:"pl-dimensionful",level:2,concept:"unit-system",p:"Dimensionful 层主要补充什么？",c:"toDimensionful SI ...",o:["不同单位制下的表示与换算","新的基本量纲","实验传感器连接"],a:0,e:"WithDim 处理量纲，Dimensionful 进一步组织单位选择。"},
      {id:"pl-custom-vs-lib",level:3,concept:"physlib-dimension",p:"课程自建 Dimension 与 Physlib 的关系应如何理解？",c:"transparent model / production library",o:["自建模型用于理解，项目代码优先复用库","两者必须互相删除","自建模型已覆盖 Physlib 全部功能"],a:0,e:"透明教学模型帮助掌握原理，成熟库提供更广 API 与审查。"},
      {id:"pl-exact",level:3,concept:"exact-real",p:"exact DimSpeed.oneKilometerPerHour_in_SI 做了什么？",c:"example : ... := by exact ...",o:["把已验证库定理直接用于同型目标","运行浮点近似","让 AI 猜测换算"],a:0,e:"正确性来自 Lean 内核检查的定理复用。"},
      {id:"pl-boundary",level:3,concept:"model-boundary",p:"Physlib 接受单位定理后还需审查什么？",c:"Lean: accepted",o:["模型定义、单位约定与应用语境","定理是否有类型","加法字符颜色"],a:0,e:"库验证演绎关系，不代替实验与领域解释。"}
    ]),

    practice: deck("单位与量纲综合实验","跨越概念、代数、换算、依赖类型与 Physlib 的分层随机组卷。",30,[
      {id:"p-si",level:1,concept:"si-seven",p:"哪一个不是 SI 基本单位？",c:"___",o:["newton","kelvin","mole"],a:0,e:"N 是 kg·m·s⁻² 的导出单位。"},
      {id:"p-speed",level:1,concept:"derived-dimension",p:"速度的时间指数是？",c:"LT^?",o:["−1","1","−2"],a:0,e:"速度为长度除时间。"},
      {id:"p-zero-vector",level:1,concept:"dimensionless",p:"无量纲量对应？",c:"Dimension",o:["零指数向量","零数值","单位长度向量"],a:0,e:"数值与量纲需区分。"},
      {id:"p-force",level:1,concept:"derived-dimension",p:"力的 SI 基本单位展开是？",c:"N",o:["kg·m·s⁻²","kg·m²·s⁻²","A·s"],a:0,e:"由 F=ma。"},
      {id:"p-mul",level:2,concept:"dimension-algebra",p:"d/d 的结果量纲是？",c:"d / d",o:["1","d²","0 数值"],a:0,e:"指数相减为零。"},
      {id:"p-km2",level:2,concept:"scale-conversion",p:"2 km² 等于多少 m²？",c:"2*(1000)^2",o:["2×10⁶","2×10³","2×10⁹"],a:0,e:"面积因子平方。"},
      {id:"p-add",level:2,concept:"typed-operations",p:"哪个表达式应被量纲类型拒绝？",c:"length : Quantity L\ntime : Quantity T",o:["add length time","div length time","add length length"],a:0,e:"加法要求相同量纲索引。"},
      {id:"p-temp",level:2,concept:"affine-unit",p:"20 ℃ 与 10 ℃ 之差是多少 K？",c:"ΔT",o:["10 K","283.15 K","−263.15 K"],a:0,e:"温差不使用 273.15 平移。"},
      {id:"p-kinetic",level:3,concept:"homogeneity",p:"1/2 mv² 中 1/2 对量纲有什么影响？",c:"K = 1/2 m v²",o:["无影响；它是无量纲常数","把能量变成一半量纲","增加时间指数"],a:0,e:"无量纲数值系数不改变量纲。"},
      {id:"p-sqrt",level:3,concept:"rational-exponent",p:"√(m/k) 可得到时间量纲的关键是？",c:"[m/k]",o:["m/k 的量纲为 T²","m/k 无量纲","平方根删除所有指数"],a:0,e:"指数 2 除以 2 得 1。"},
      {id:"p-limit",level:3,concept:"model-boundary",p:"量纲正确能否证明公式的数值系数正确？",c:"x = C v t",o:["不能；C 是无量纲系数","能；C 必为 1","只有 SI 能"],a:0,e:"还需要动力学推导、边界条件或实验。"},
      {id:"p-physlib",level:3,concept:"physlib-withdim",p:"研究代码中已有成熟单位 API 时应优先？",c:"___",o:["检查并复用 Physlib 定义与定理","复制变量名模拟单位","只用 Float"],a:0,e:"复用经审查的库能减少重复定义。"}
    ],6),

    daily: deck("单位与量纲练习场","每日跨关卡复习；从基本识别、概念连接和综合判断各抽两题。",5,[
      {id:"daily-seven",level:1,concept:"si-seven",p:"SI 有几个基本量？",c:"International System of Quantities",o:["7","3","9"],a:0,e:"七个基本量对应七个基本单位。"},
      {id:"daily-energy",level:1,concept:"derived-dimension",p:"能量量纲是？",c:"F·L",o:["ML²T⁻²","MLT⁻²","ML²T⁻³"],a:0,e:"力乘长度。"},
      {id:"daily-charge",level:1,concept:"derived-dimension",p:"库仑 C 展开为？",c:"charge",o:["A·s","A/s","kg·m/s"],a:0,e:"电流乘时间。"},
      {id:"daily-dimless",level:1,concept:"dimensionless",p:"应变 ΔL/L 的量纲？",c:"ΔL/L",o:["1","L","L²"],a:0,e:"同类长度相除。"},
      {id:"daily-op",level:2,concept:"dimension-algebra",p:"量纲取逆如何作用于指数？",c:"d⁻¹",o:["全部取负","全部加一","顺序反转"],a:0,e:"e ↦ −e。"},
      {id:"daily-celsius",level:2,concept:"affine-unit",p:"25 ℃ 的 K 数值是？",c:"25 + 273.15",o:["298.15","25","248.15"],a:0,e:"绝对温度换算包含零点平移。"},
      {id:"daily-safe",level:2,concept:"typed-quantity",p:"Quantity d 的 d 是？",c:"structure Quantity (d : Dimension)",o:["类型索引","运行时单位字符串","随机数"],a:0,e:"它使量纲参与类型检查。"},
      {id:"daily-area",level:2,concept:"scale-conversion",p:"cm² 到 m² 的因子是？",c:"(10⁻²)^2",o:["10⁻⁴","10⁻²","10⁻⁶"],a:0,e:"面积因子平方。"},
      {id:"daily-exp",level:3,concept:"homogeneity",p:"exp(−t/τ) 的量纲条件？",c:"t/τ",o:["无量纲","长度","能量"],a:0,e:"指数函数自变量需无量纲。"},
      {id:"daily-torque",level:3,concept:"model-boundary",p:"同量纲是否必为同一物理概念？",c:"torque / energy",o:["不是","是","只在 CGS 中是"],a:0,e:"量纲不能编码全部语义。"},
      {id:"daily-root",level:3,concept:"rational-exponent",p:"Physlib 允许有理量纲指数的主要意义？",c:"ℚ exponents",o:["表达根式量纲","让单位换算变近似","删除类型检查"],a:0,e:"平方根对应指数乘 1/2。"},
      {id:"daily-kmh",level:3,concept:"physlib-withdim",p:"1 km/h 的 SI 数值是？",c:"DimSpeed.oneKilometerPerHour_in_SI",o:["5/18","18/5","1000"],a:0,e:"精确换算为 5/18 m/s。"}
    ])
  };

  window.LEANPATH_CONCEPTS = concepts;
  window.LEANPATH_QUESTION_BANKS = decks;
  window.LEANPATH_QUESTION_SOURCES = [
    {id:"si",name:"BIPM SI Brochure",url:"https://www.bipm.org/en/publications/si-brochure",license:"BIPM publication"},
    {id:"workshop",name:"暑校 Type Theory / Inductive Type 物理量练习",license:"课程材料"},
    {id:"physlib",name:"Physlib",url:"https://github.com/leanprover-community/Physlib",license:"Apache-2.0"},
    {id:"mil",name:"Mathematics in Lean",url:"https://github.com/leanprover-community/mathematics_in_lean",license:"Apache-2.0"}
  ];
}());

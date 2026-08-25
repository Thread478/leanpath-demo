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
    "model-boundary": {title:"量纲检查不替代物理建模",body:"量纲齐次只能排除一类错误。x = vt 与 x = 2vt 同样齐次，但系数和适用条件不同；形式化还需定义系统、假设、定律和实验解释。",code:"dimensionally valid ≠ physically established"},
    "euclidean-space": {title:"欧式向量先从有限坐标开始",body:"本章用 Vec3 := Fin 3 → ℝ 表示三维坐标向量，再通过 Mathlib 的 EuclideanSpace 与 Physlib 的 ReferenceFrame 连接到一般有限维内积空间。坐标模型透明，库模型更适合复用定理。",code:"abbrev Vec3 := Fin 3 → ℝ\n#check EuclideanSpace ℝ (Fin 3)"},
    "dot-metric": {title:"内积同时产生长度、角度与正交",body:"点积是双线性的；v·v 非负，并且等于零当且仅当 v=0。范数由 √(v·v) 得到，距离是两点位移的范数，正交则由点积为零定义。",code:"dot v w := dotProduct v w\n‖v‖² = v ⬝ᵥ v"},
    "affine-space": {title:"点与向量不是同一类对象",body:"向量可以相加，点通常不能；两点之差是位移向量，而点加位移仍是点。初级坐标模型会记录 point.coord，高阶实现可调用 Physlib.ReferenceFrame 区分原点、基底与空间点。",code:"displacement p q := q.coord - p.coord"},
    "force-vector": {title:"力需要大小方向，也需要作用点",body:"单个集中力可建模为 AppliedForce，含作用点和力向量。合力只依赖力向量之和；关于原点的力矩还依赖作用点。把两者分开能避免把自由向量与滑移向量混淆。",code:"structure AppliedForce where\n  point : Point3\n  vector : Vec3"},
    "force-system": {title:"力系用有限列表和叠加表示",body:"有限力系可以用 List AppliedForce 表示。合力是全部力向量之和，总力矩是各力矩之和；递归定义使空力系和加一项的定理可直接用 simp 与归纳证明。",code:"resultant [] = 0\nresultant (f :: S) = f.vector + resultant S"},
    "moment-cross": {title:"三维力矩由叉积定义",body:"关于 O 的力矩 M_O = (P−O)×F。Mathlib 的 crossProduct 是 Fin 3 坐标上的线性映射，并提供叉积反交换、与两个因子正交、混合积等定理。",code:"momentAt o f := (f.point.coord - o.coord) ⨯₃ f.vector"},
    "moment-origin": {title:"移矩定理追踪参考点变化",body:"把参考点从 O 改到 Q 时，总力矩满足 M_Q = M_O − (Q−O)×R，其中 R 是合力。因此平衡力系的总力矩与参考点无关；一般力系则不能忽略原点。",code:"M q S = M o S - (q-o) × resultant S"},
    "couple": {title:"力偶的合力为零而力矩不为零",body:"一对大小相等、方向相反、作用线不重合的力构成力偶。它的合力为零，所以力偶矩不随参考点改变；这也是仅用合力无法完整描述刚体效应的原因。",code:"F + (-F) = 0\nM_q = M_o"},
    "equilibrium-balance": {title:"刚体静力平衡包含两个向量方程",body:"有限刚体力系关于 O 平衡，定义为合力 R=0 且总力矩 M_O=0。第一项排除平动趋势，第二项排除转动趋势；在 R=0 时，选哪个参考点检查 M 都等价。",code:"IsBalancedAt o S := resultant S = 0 ∧ totalMomentAt o S = 0"},
    "rigid-virtual-motion": {title:"刚体虚运动由平动与转动组成",body:"三维无穷小刚体运动可用一对 (v,ω) 表示。外力在该虚运动上的功率为 R·v + M·ω。它对所有 v、ω 都为零，当且仅当 R 与 M 都为零。",code:"virtualPower v ω := R ⬝ᵥ v + M ⬝ᵥ ω"},
    "reactions": {title:"支反力是与约束相容的未知量",body:"静力题把支座提供的未知反力加入外力系，再求解平衡方程。简支梁在竖直集中载荷下给出两个未知反力，可由一个竖直合力方程和一个力矩方程唯一确定。",code:"R_A + R_B = P\nR_B L = P a"},
    "static-determinacy": {title:"静定性是平衡算子的唯一可解性",body:"把未知反力 r 映到平衡残差的线性映射 A 称为平衡算子。对给定载荷，若 A r + load = 0 有唯一解，则静定；若有多个解，则仅靠静力平衡不能确定全部反力。",code:"∃! r, A r + load = 0"},
    "self-stress": {title:"超静定与平衡算子的核相连",body:"非零 k 若满足 A k=0，就代表不改变外部平衡的自应力模式。已有一组反力 r₀ 时，r₀+t k 都满足同一平衡方程；还需材料刚度和变形协调条件才能选出物理解。",code:"k ∈ LinearMap.ker A\nr₀ + k is another solution"},
    "work-dot": {title:"常力功是力与位移的内积",body:"常力 F 从 P 到 Q 所做的功 W=F·(Q−P)。内积线性立即给出路径分段可加性；但变力功需要积分，本章只在势能桥接中说明而不展开一般曲线积分。",code:"work F p q := F ⬝ᵥ (q.coord - p.coord)"},
    "conservative-potential": {title:"保守力由势能的负梯度给出",body:"在欧式空间中，势能 V 的梯度指出增长最快方向，保守力定义为 F=−∇V。Physlib 已提供梯度运算与二次型示例所需定理，可验证弹簧势能 ½k‖x‖² 对应 F=−kx。",code:"V x = (k/2) * ⟪x,x⟫\nF x = -gradient V x"},
    "virtual-work": {title:"约束系统只测试许可的虚位移",body:"虚功原理不是让所有位移都可取，而是对满足线性化约束的虚运动测试外力功率。理想约束的反力在许可虚运动上不做功，从而可从方程中消去。",code:"∀ δ ∈ admissible, virtualPower δ = 0"},
    "stability-energy": {title:"局部势能极小给出保守系统的稳定判据",body:"一维二次势能 V(x)=½kx² 中，k>0 时原点严格极小，k=0 时为中性平坦，k<0 时任意邻域都有更低势能方向。一般非线性系统还需局部性、约束和保守性假设。",code:"k > 0 → V 0 < V x  (x ≠ 0)"},
    "library-statics": {title:"Mathlib 与 Physlib 各自承担一层",body:"Mathlib 提供 EuclideanSpace、内积、线性映射、核与三维叉积；Physlib 提供物理参考系和梯度等桥接。当前 Physlib 尚无覆盖整章静力学的统一 API，因此课程定义轻量 AppliedForce 与 ForceSystem，并把底层数学交给库。",code:"import Mathlib.LinearAlgebra.CrossProduct\nimport Physlib.Mathematics.Calculus.Gradient"},
    "statics-scope": {title:"本章的适用边界是有限维刚体",body:"课程形式化有限个集中力、线性支反力、刚体虚运动和二次势能。连续介质弱形式、摩擦接触互补、随动力、屈曲和一般非线性稳定性留给后续专题，避免用一个过强的势能口号覆盖不同物理机制。",code:"finite rigid system ≠ continuum mechanics"}
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

    "euclidean-vectors": deck("欧式空间与坐标向量","从 Fin 3 → ℝ 进入有限维欧式空间，掌握向量运算与坐标外延性。",12,[
      {id:"ev-type",level:1,concept:"euclidean-space",p:"三维实坐标向量的透明类型可以写成？",c:"abbrev Vec3 := ___",o:["Fin 3 → ℝ","ℝ → Fin 3","List ℝ"],a:0,e:"Fin 3 提供恰好三个坐标。"},
      {id:"ev-zero",level:1,concept:"euclidean-space",p:"(0 : Vec3) 的每个坐标是什么？",c:"fun i => ?",o:["0","i","1"],a:0,e:"函数空间的零向量逐坐标为零。"},
      {id:"ev-add",level:1,concept:"euclidean-space",p:"向量加法 v+w 如何作用在坐标 i？",c:"(v + w) i",o:["v i + w i","v i * w i","v (w i)"],a:0,e:"函数空间继承逐点加法。"},
      {id:"ev-ext",level:2,concept:"euclidean-space",p:"证明 v=w 时，ext i 把目标变成什么？",c:"⊢ v = w",o:["⊢ v i = w i","⊢ ‖v‖ = ‖w‖","⊢ i = 0"],a:0,e:"函数外延性要求逐坐标相等。"},
      {id:"ev-smul",level:2,concept:"euclidean-space",p:"标量 a 对向量 v 的作用满足？",c:"(a • v) i",o:["a * v i","a + v i","v (a*i)"],a:0,e:"实向量空间的数乘逐坐标进行。"},
      {id:"ev-euclidean",level:2,concept:"euclidean-space",p:"Mathlib 的标准有限维欧式空间类型是？",c:"___ ℝ (Fin 3)",o:["EuclideanSpace","TopologicalSpace","ForceSystem"],a:0,e:"EuclideanSpace ℝ ι 是带标准内积结构的坐标空间。"},
      {id:"ev-finite",level:3,concept:"statics-scope",p:"本章先固定三维有限坐标的主要理由是？",c:"finite rigid statics",o:["叉积和刚体力矩可直接计算且学习曲线平缓","物理空间必然只有三个点","Mathlib 不支持一般维数"],a:0,e:"一般内积结果仍可在 EuclideanSpace 中复用。"},
      {id:"ev-basis",level:3,concept:"euclidean-space",p:"标准基向量 eᵢ 的第 j 坐标由什么决定？",c:"eᵢ j",o:["i=j 时为 1，否则为 0","总为 i+j","总为 1"],a:0,e:"它是有限函数空间的单坐标基。"},
      {id:"ev-point",level:3,concept:"affine-space",p:"为什么不把空间点的加法当作基本物理操作？",c:"P + Q",o:["点是仿射对象，没有天然原点时不能相加","实数不能相加","Lean 禁止任何结构相加"],a:0,e:"点之差才天然给出位移向量。"}
    ]),

    "inner-metric": deck("内积、范数与距离","用点积组织长度、距离、夹角与正交，并调用正定性。",14,[
      {id:"im-dot",level:1,concept:"dot-metric",p:"三维点积的坐标公式是？",c:"v ⬝ᵥ w",o:["Σ i, v i * w i","v ⨯₃ w","Σ i, v i + w i"],a:0,e:"点积是对应坐标乘积之和。"},
      {id:"im-orth",level:1,concept:"dot-metric",p:"v 与 w 正交的代数条件是？",c:"orthogonal",o:["v·w = 0","v×w = 0","v=w"],a:0,e:"实内积空间中正交由内积为零定义。"},
      {id:"im-distance",level:1,concept:"dot-metric",p:"两点 p、q 的欧式距离应由什么给出？",c:"dist p q",o:["‖q-p‖","‖q+p‖","q·p"],a:0,e:"距离是位移向量的范数。"},
      {id:"im-sym",level:2,concept:"dot-metric",p:"实点积交换 v·w=w·v 的依据是？",c:"dot symmetry",o:["实内积的对称性","叉积反交换","列表排序"],a:0,e:"复内积是共轭对称，本章标量为 ℝ。"},
      {id:"im-positive",level:2,concept:"dot-metric",p:"v·v=0 可以推出什么？",c:"dotProduct_self_eq_zero",o:["v=0","‖v‖=1","v 的坐标和为 0"],a:0,e:"点积正定，不允许非零零长度向量。"},
      {id:"im-cauchy",level:2,concept:"dot-metric",p:"Cauchy–Schwarz 控制哪个量？",c:"|v·w|",o:["≤ ‖v‖‖w‖","= ‖v+w‖","≥ ‖v‖+‖w‖"],a:0,e:"它保证夹角余弦的绝对值不超过 1。"},
      {id:"im-normsq",level:3,concept:"dot-metric",p:"计算与证明中先用 normSq v := v·v 有什么优势？",c:"squared norm",o:["避免平方根并保留多项式结构","改变向量量纲","让负长度合法"],a:0,e:"许多平衡与稳定性证明可交给 ring/nlinarith。"},
      {id:"im-degenerate",level:3,concept:"dot-metric",p:"若只用任意双线性型而没有正定性，v·v=0⇒v=0 是否仍成立？",c:"bilinear form",o:["不一定","一定","只对零维不成立"],a:0,e:"正定性是欧式度量的关键假设。"},
      {id:"im-library",level:3,concept:"library-statics",p:"研究代码为何优先使用 EuclideanSpace 的范数而非重写平方根？",c:"Mathlib",o:["可复用完备的内积与拓扑定理","范数不需要证明","自定义代码不能运行"],a:0,e:"透明坐标定义仍用于教学和叉积计算。"}
    ]),

    "affine-points": deck("点、位移与参考原点","区分空间点和自由向量，并理解参考系坐标。",14,[
      {id:"ap-diff",level:1,concept:"affine-space",p:"从 p 指向 q 的位移向量是？",c:"displacement p q",o:["q.coord - p.coord","p.coord + q.coord","p.coord - q.coord"],a:0,e:"终点减起点。"},
      {id:"ap-zero",level:1,concept:"affine-space",p:"p 到自身的位移是多少？",c:"displacement p p",o:["0","p.coord","1"],a:0,e:"逐坐标相减为零。"},
      {id:"ap-chain",level:1,concept:"affine-space",p:"位移的首尾相接关系是？",c:"(q-p)+(r-q)",o:["r-p","p-r","q"],a:0,e:"中间点 q 消去。"},
      {id:"ap-origin",level:2,concept:"affine-space",p:"点 p 的“位置向量”依赖什么选择？",c:"p - O",o:["参考原点 O","力的单位","时间参数"],a:0,e:"改变原点会改变坐标位置向量。"},
      {id:"ap-vector-free",level:2,concept:"affine-space",p:"同一个位移向量换原点后怎样？",c:"q-p",o:["保持不变","加上新原点","变为相反数"],a:0,e:"两点差消去了共同的原点平移。"},
      {id:"ap-frame",level:2,concept:"library-statics",p:"Physlib ReferenceFrame 额外记录什么？",c:"reference frame",o:["原点与基底","只有单位字符串","只有力列表"],a:0,e:"参考系把仿射点转换为坐标向量。"},
      {id:"ap-rotate",level:3,concept:"affine-space",p:"换一个正交基底时，点积为何保持？",c:"orthonormal frame",o:["正交变换保持内积","所有矩阵都保持内积","坐标完全不变"],a:0,e:"坐标变了，欧式几何量不变。"},
      {id:"ap-moment",level:3,concept:"moment-origin",p:"为什么力矩必须声明参考点？",c:"r × F",o:["位置向量 r 依赖原点","叉积没有类型","力的方向依赖质量"],a:0,e:"合力不为零时不同参考点得到不同总力矩。"},
      {id:"ap-model",level:3,concept:"statics-scope",p:"用 Point3.coord 的教学模型牺牲了什么？",c:"coordinate model",o:["仿射不变性在类型中的显式表达","三维坐标","实数运算"],a:0,e:"最终展品用注释与 Physlib bridge 说明这层边界。"}
    ]),

    "applied-force": deck("力与作用点","把集中力建模为作用点和向量，区分合力与转动效应。",16,[
      {id:"af-fields",level:1,concept:"force-vector",p:"AppliedForce 至少需要哪两个字段？",c:"force",o:["point 与 vector","mass 与 time","unit 与 string"],a:0,e:"同一力向量作用在不同点可产生不同力矩。"},
      {id:"af-free",level:1,concept:"force-vector",p:"若只关心质点平动，力通常可视为什么？",c:"F",o:["自由向量","空间点","无量纲数"],a:0,e:"刚体转动问题还必须保留作用点。"},
      {id:"af-line",level:1,concept:"force-vector",p:"沿自身作用线平移力的作用点，关于任一点的力矩如何？",c:"(r+tF)×F",o:["不变","增加 tF","变为零且仅当 t=0"],a:0,e:"F×F=0，所以沿作用线的附加项消失。"},
      {id:"af-newton",level:2,concept:"force-vector",p:"力向量的量纲来自？",c:"F = ma",o:["MLT⁻²","ML²T⁻²","LT⁻¹"],a:0,e:"质量乘加速度。"},
      {id:"af-neg",level:2,concept:"force-vector",p:"-F 表示什么？",c:"vector negation",o:["大小相同方向相反的力向量","负质量","删除作用点"],a:0,e:"作用点需要另行指定。"},
      {id:"af-structure",level:2,concept:"force-vector",p:"Lean 中读取 f 的力向量字段写作？",c:"f : AppliedForce",o:["f.vector","vector(f.point)","f[force]"],a:0,e:"结构投影使用点记法。"},
      {id:"af-equivalent",level:3,concept:"moment-origin",p:"两个集中力对刚体静力等效通常需什么相同？",c:"wrench",o:["合力与关于同一点的力矩","仅大小","仅作用点"],a:0,e:"这对有限刚体的平动和转动效应都相同。"},
      {id:"af-distributed",level:3,concept:"statics-scope",p:"分布载荷能否直接当作一个 AppliedForce 而不作假设？",c:"distributed load",o:["不能；需积分或先证明等效合力与作用点","能；任何函数都是集中力","只能在一维能"],a:0,e:"本章仅用已等效化的有限集中力。"},
      {id:"af-contact",level:3,concept:"statics-scope",p:"带库仑摩擦的接触反力为什么不在基础模型中自动解决？",c:"friction cone",o:["它含不等式、接触状态与互补条件","叉积不能计算","摩擦没有量纲"],a:0,e:"这里只处理已知线性约束方向的反力。"}
    ]),

    "force-system": deck("力系与合力","用 List 组织有限力系，理解叠加、顺序无关与等效。",16,[
      {id:"fs-empty",level:1,concept:"force-system",p:"空力系的合力应定义为？",c:"resultant []",o:["0","1","undefined"],a:0,e:"零向量是力叠加的单位元。"},
      {id:"fs-cons",level:1,concept:"force-system",p:"resultant (f::S) 的递归式是？",c:"list recursion",o:["f.vector + resultant S","f.vector × resultant S","resultant S"],a:0,e:"有限力叠加就是向量求和。"},
      {id:"fs-pair",level:1,concept:"force-system",p:"F 与 -F 两力的合力是？",c:"F + (-F)",o:["0","2F","F"],a:0,e:"向量相消。"},
      {id:"fs-append",level:2,concept:"force-system",p:"两个力系列表拼接后的合力满足？",c:"resultant (S ++ T)",o:["resultant S + resultant T","resultant S × resultant T","resultant S"],a:0,e:"可由列表归纳证明。"},
      {id:"fs-order",level:2,concept:"force-system",p:"交换列表中两项会改变合力吗？",c:"F₁+F₂",o:["不会，因为向量加法交换","会，因为 List 有顺序","只改变单位"],a:0,e:"存储有顺序，合力的数学值与顺序无关。"},
      {id:"fs-zeroR",level:2,concept:"force-system",p:"合力为零是否足以保证刚体平衡？",c:"resultant S = 0",o:["不够，还需总力矩为零","足够","只需再检查质量"],a:0,e:"力偶正是合力零但仍有转动效应的例子。"},
      {id:"fs-reduce",level:3,concept:"moment-origin",p:"一般三维力系关于点 O 的静力信息可归约为何？",c:"force-couple system",o:["合力 R 与总力矩 M_O","单个力大小","三个单位符号"],a:0,e:"也称力—力偶或 wrench 表示。"},
      {id:"fs-semantic",level:3,concept:"force-system",p:"List AppliedForce 是否编码刚体形状和接触几何？",c:"data model",o:["没有；它只记录外力数据","完整编码","只要列表足够长就编码"],a:0,e:"系统边界与几何可作为更高层结构添加。"},
      {id:"fs-induction",level:3,concept:"force-system",p:"证明所有有限力系的求和恒等式最自然用什么？",c:"S : List AppliedForce",o:["对 S 做归纳","只检查三个样例","浮点采样"],a:0,e:"nil 和 cons 分支覆盖全部有限列表。"}
    ]),

    moment: deck("力矩与叉积","调用 Mathlib 三维叉积，掌握方向、正交性和量纲。",18,[
      {id:"mo-def",level:1,concept:"moment-cross",p:"关于 O 的集中力矩公式是？",c:"P @ F",o:["(P-O)×F","P·F","F×F"],a:0,e:"力臂位移叉乘力。"},
      {id:"mo-order",level:1,concept:"moment-cross",p:"交换叉积顺序会怎样？",c:"F × r",o:["得到原力矩的相反数","不变","得到点积"],a:0,e:"叉积反交换。"},
      {id:"mo-unit",level:1,concept:"moment-cross",p:"力矩的量纲是？",c:"r×F",o:["ML²T⁻²","MLT⁻²","ML²T⁻¹"],a:0,e:"长度乘力。数值单位常写 N·m。"},
      {id:"mo-perp-r",level:2,concept:"moment-cross",p:"r×F 与 r 的点积是多少？",c:"r·(r×F)",o:["0","‖r‖²","r·F"],a:0,e:"叉积垂直于两个因子。"},
      {id:"mo-parallel",level:2,concept:"moment-cross",p:"若 r 与 F 平行，力矩如何？",c:"r × F",o:["0","r·F","无定义"],a:0,e:"平行向量夹角为零，叉积为零。"},
      {id:"mo-lever",level:2,concept:"moment-cross",p:"力矩大小可写成？",c:"‖r×F‖",o:["‖r‖‖F‖sinθ","‖r‖+‖F‖","‖r‖‖F‖cosθ"],a:0,e:"等于力乘垂直力臂。"},
      {id:"mo-mathlib",level:3,concept:"library-statics",p:"Mathlib 三维叉积的类型为何是线性映射？",c:"crossProduct v",o:["固定第一个向量后对第二个向量线性","叉积对两个变量一起线性","因为返回标量"],a:0,e:"它也对第一变量线性，但不是把二元对整体当一元线性映射。"},
      {id:"mo-energy",level:3,concept:"model-boundary",p:"力矩与能量同为 N·m，能直接作为同一物理类型吗？",c:"torque vs energy",o:["不应；同量纲但语义与变换性质不同","可以且总相等","只有数值非零时可以"],a:0,e:"本章用 Vec3 表示力矩、用 ℝ 表示功来保留差异。"},
      {id:"mo-2d",level:3,concept:"statics-scope",p:"平面静力学中力矩常写成标量，三维模型中对应什么？",c:"planar moment",o:["垂直平面的轴向分量","合力大小","势能"],a:0,e:"三维叉积能统一平面与空间问题。"}
    ]),

    "moment-shift": deck("移矩定理与力偶","证明换参考点公式，并识别力偶矩的不变性。",20,[
      {id:"ms-formula",level:1,concept:"moment-origin",p:"从 O 换到 Q 的总力矩公式是？",c:"M_Q",o:["M_O − (Q−O)×R","M_O + R","M_O"],a:0,e:"展开 P−Q=(P−O)−(Q−O)。"},
      {id:"ms-balanced",level:1,concept:"moment-origin",p:"若 R=0，M_Q 与 M_O 的关系是？",c:"zero resultant",o:["相等","互为相反数","都必须非零"],a:0,e:"参考点修正项消失。"},
      {id:"ms-couple",level:1,concept:"couple",p:"力偶为何能作为自由力矩移动？",c:"couple",o:["它的合力为零，所以力矩与参考点无关","两个力作用点相同","叉积恒为零"],a:0,e:"力偶矩仍可能非零。"},
      {id:"ms-sign",level:2,concept:"moment-origin",p:"若误写 M_Q=M_O+(Q−O)×R，主要错误是什么？",c:"origin shift",o:["位移分解的符号反了","量纲不齐次","叉积应换成点积"],a:0,e:"P−Q=(P−O)−(Q−O)。"},
      {id:"ms-proof",level:2,concept:"moment-origin",p:"单个力移矩定理的代数核心是？",c:"(a-b)×F",o:["叉积对加减法的线性","点积正定","范数三角不等式"],a:0,e:"再对力系列表归纳即可得总公式。"},
      {id:"ms-axis",level:2,concept:"couple",p:"一对 ±F 相距 d 的力偶矩可写成？",c:"couple moment",o:["d×F","d·F","2F"],a:0,e:"d 是两条作用线之间的位移向量。"},
      {id:"ms-equivalence",level:3,concept:"moment-origin",p:"两力系在 O 有相同 R 和 M_O，换到 Q 后是否仍静力等效？",c:"same wrench",o:["是，移矩公式给出相同 M_Q","不一定","仅当 Q=O"],a:0,e:"两者使用相同的参考点修正项。"},
      {id:"ms-zero-moment",level:3,concept:"moment-origin",p:"能否总能选择 Q 使一般空间力系的 M_Q=0？",c:"central axis",o:["不能；存在不可消去的沿 R 力偶分量","总能","只要 R=0 就能"],a:0,e:"本章不展开螺旋理论，但保留这一模型边界。"},
      {id:"ms-origin-ind",level:3,concept:"equilibrium-balance",p:"证明平衡定义不依赖参考点时，先用哪个条件？",c:"R=0 ∧ M_O=0",o:["R=0","M_O=0 单独","‖R‖=1"],a:0,e:"R=0 让移矩修正项消失，再运输 M_O=0。"}
    ]),

    equilibrium: deck("静力平衡","把平动与转动平衡写成一个可复用的 Lean 命题。",20,[
      {id:"eq-def",level:1,concept:"equilibrium-balance",p:"刚体关于 O 平衡的定义是？",c:"IsBalancedAt O S",o:["R=0 ∧ M_O=0","R=M_O","R·M_O=0"],a:0,e:"需要两个三分量向量方程。"},
      {id:"eq-trans",level:1,concept:"equilibrium-balance",p:"平动平衡对应哪个条件？",c:"translation",o:["ΣF=0","ΣM=0","ΣW=0"],a:0,e:"合力为零。"},
      {id:"eq-rot",level:1,concept:"equilibrium-balance",p:"转动平衡对应哪个条件？",c:"rotation",o:["ΣM_O=0","ΣF=0","V=0"],a:0,e:"关于一点的总力矩为零。"},
      {id:"eq-components",level:2,concept:"equilibrium-balance",p:"三维刚体平衡通常提供多少个标量方程？",c:"R,M ∈ ℝ³",o:["最多 6 个","3 个","9 个"],a:0,e:"合力三分量、合力矩三分量。独立性仍由几何决定。"},
      {id:"eq-particle",level:2,concept:"equilibrium-balance",p:"质点模型为何常只写 ΣF=0？",c:"particle",o:["质点没有需独立追踪的取向与力偶","力矩恒为能量","质点没有位置"],a:0,e:"刚体模型则必须检查转动效应。"},
      {id:"eq-origin",level:2,concept:"moment-origin",p:"已知关于 O 平衡，关于 Q 的总力矩怎样证明为零？",c:"M_Q = M_O-(Q-O)×R",o:["代入 M_O=0 与 R=0","只代入 Q=O","使用单位换算"],a:0,e:"因此平衡与参考点选择无关。"},
      {id:"eq-sufficient",level:3,concept:"equilibrium-balance",p:"R=0 与 M=0 对本章的有限刚体静力模型是什么？",c:"balance",o:["定义上的充要条件","仅必要不充分","实验定律的完整证明"],a:0,e:"它刻画外力对任意无穷小刚体运动的功率为零。"},
      {id:"eq-contact",level:3,concept:"statics-scope",p:"满足平衡方程是否自动保证单边接触反力方向可行？",c:"reaction ≥ 0",o:["不保证，还要检查接触不等式","保证","只要力矩为零就保证"],a:0,e:"平衡是方程；接触可行性还含不等式。"},
      {id:"eq-dynamics",level:3,concept:"statics-scope",p:"瞬时 R=0、M=0 是否证明物体永远静止？",c:"initial velocity",o:["不证明；还需初速度和动力学假设","证明","仅需质量为正"],a:0,e:"静力平衡与运动状态是不同层次。"}
    ]),

    "equilibrium-iff": deck("平衡充要条件","用任意刚体虚速度上的功率为零刻画合力与合矩同时为零。",22,[
      {id:"ei-power",level:1,concept:"rigid-virtual-motion",p:"刚体虚功率的有限维表达式是？",c:"P(v,ω)",o:["R·v + M·ω","R×v + M×ω","R+M"],a:0,e:"平动速度与合力配对，角速度与合力矩配对。"},
      {id:"ei-forward",level:1,concept:"rigid-virtual-motion",p:"若 R=0 且 M=0，任意虚功率是多少？",c:"P(v,ω)",o:["0","1","取决于原点"],a:0,e:"两个点积项都为零。"},
      {id:"ei-testR",level:1,concept:"rigid-virtual-motion",p:"要从“所有虚功率为零”推出 R=0，可选哪组测试？",c:"v=?, ω=?",o:["v=R, ω=0","v=0, ω=R","v=M, ω=R"],a:0,e:"得到 R·R=0，再用内积正定性。"},
      {id:"ei-testM",level:2,concept:"rigid-virtual-motion",p:"推出 M=0 时选什么？",c:"v=?, ω=?",o:["v=0, ω=M","v=M, ω=0","v=R, ω=R"],a:0,e:"得到 M·M=0。"},
      {id:"ei-positive",level:2,concept:"dot-metric",p:"上述反向证明关键调用哪个事实？",c:"x·x=0",o:["正定性给出 x=0","叉积反交换","列表长度非负"],a:0,e:"若配对退化，结论不再成立。"},
      {id:"ei-six",level:2,concept:"rigid-virtual-motion",p:"“对所有 v,ω”与六个基方向测试的关系是？",c:"linearity",o:["在线性模型中等价","六个测试永远不够","只需一个随机方向"],a:0,e:"线性泛函在基上为零即处处为零。"},
      {id:"ei-constraints",level:3,concept:"virtual-work",p:"有约束时只对许可虚运动功率为零，能否仍推出全部 R=M=0？",c:"admissible subspace",o:["一般不能，只能推出载荷泛函在许可子空间上为零","总能","只推出 R=M"],a:0,e:"约束反力可位于许可子空间的正交补。"},
      {id:"ei-origin",level:3,concept:"moment-origin",p:"虚功率表达式换参考点时，平动速度应如何配套变换？",c:"rigid twist",o:["按刚体运动学调整，物理功率保持不变","不需任何处理","把点积换成叉积"],a:0,e:"本课程在固定参考点陈述定理，避免隐藏坐标变换。"},
      {id:"ei-theorem",level:3,concept:"rigid-virtual-motion",p:"该充要条件在 Lean 中最适合写成？",c:"equilibrium",o:["theorem ... : (∀ v ω, P v ω = 0) ↔ R=0 ∧ M=0","def P := True","#eval equilibrium"],a:0,e:"↔ 同时包含两个方向的证明。"}
    ]),

    "support-reactions": deck("约束与支反力","用简支梁把未知反力、平衡方程与解的可行性连接起来。",20,[
      {id:"sr-unknown",level:1,concept:"reactions",p:"支反力在静力模型中是什么？",c:"support",o:["约束施加的未知力或力矩","已知势能常数","单位换算系数"],a:0,e:"由平衡与约束关系共同确定。"},
      {id:"sr-beam-sum",level:1,concept:"reactions",p:"竖直向下集中载荷 P 下，简支梁合力方程是？",c:"up positive",o:["R_A+R_B=P","R_A-R_B=P","R_AR_B=P"],a:0,e:"向上反力平衡向下载荷。"},
      {id:"sr-beam-moment",level:1,concept:"reactions",p:"以 A 点取矩，跨长 L、载荷距 A 为 a 时？",c:"ΣM_A=0",o:["R_B L = P a","R_A L = P a","R_A+R_B=0"],a:0,e:"A 点反力力臂为零。"},
      {id:"sr-solA",level:2,concept:"reactions",p:"由两式解得 R_A？",c:"L ≠ 0",o:["P(L-a)/L","Pa/L","P/L"],a:0,e:"先得 R_B=Pa/L，再代回合力方程。"},
      {id:"sr-solB",level:2,concept:"reactions",p:"R_B 等于？",c:"L ≠ 0",o:["Pa/L","P(L-a)/L","PL/a"],a:0,e:"由 A 点力矩方程直接得到。"},
      {id:"sr-assumption",level:2,concept:"reactions",p:"Lean 证明反力公式为何显式要求 L≠0？",c:"division",o:["除以跨长需要非零假设","梁必须无质量","力必须为整数"],a:0,e:"物理上通常还要求 0≤a≤L。"},
      {id:"sr-positive",level:3,concept:"reactions",p:"若 P≥0 且 0≤a≤L、L>0，两个反力怎样？",c:"simple supports",o:["都非负","都为零","必一正一负"],a:0,e:"这验证单边支承在该载荷情形下可行。"},
      {id:"sr-fixed",level:3,concept:"reactions",p:"固定端相对铰支座还能提供什么反力分量？",c:"fixed support",o:["约束力矩","质量","势能单位"],a:0,e:"不同支座类型决定未知反力空间。"},
      {id:"sr-model",level:3,concept:"statics-scope",p:"求得反力后是否已经得到梁内应力分布？",c:"beam mechanics",o:["没有，还需截面、材料与连续体/梁理论","已经得到","只需换单位"],a:0,e:"本章在刚体外部平衡层停止。"}
    ]),

    determinacy: deck("静定与超静定","以线性平衡算子的解与核精确定义唯一性和自应力。",22,[
      {id:"dt-unique",level:1,concept:"static-determinacy",p:"对给定载荷静定意味着？",c:"A r + load = 0",o:["反力解存在且唯一","没有反力","任意反力都可"],a:0,e:"Lean 中可用 ∃! 表达。"},
      {id:"dt-hyper",level:1,concept:"static-determinacy",p:"超静定的直接代数表现是？",c:"equilibrium equations",o:["平衡方程有多个反力解","平衡方程无解","合力单位错误"],a:0,e:"还需变形协调和本构关系选解。"},
      {id:"dt-kernel",level:1,concept:"self-stress",p:"A 的非零核向量 k 表示？",c:"A k=0",o:["自应力模式","外载荷","刚体位移"],a:0,e:"它不改变平衡残差。"},
      {id:"dt-addk",level:2,concept:"self-stress",p:"若 r₀ 是解且 Ak=0，则哪一个仍是解？",c:"reaction family",o:["r₀+k","A+r₀","load+k"],a:0,e:"A(r₀+k)+load=(Ar₀+load)+Ak=0。"},
      {id:"dt-inj",level:2,concept:"static-determinacy",p:"已有解时，A 的什么性质保证唯一？",c:"LinearMap",o:["Injective A","Surjective A","Continuous A"],a:0,e:"两解相减落入核；单射使核只有零。"},
      {id:"dt-count",level:2,concept:"static-determinacy",p:"只数“未知数=方程数”为何不总能证明静定？",c:"rank",o:["方程可能线性相关，需检查秩/单射性","实数不能计数","力矩不是方程"],a:0,e:"几何退化会降低平衡算子的秩。"},
      {id:"dt-inconsistent",level:3,concept:"static-determinacy",p:"若载荷不在 A 的像加可平衡范围内，会怎样？",c:"no solution",o:["没有平衡反力解","自动成为超静定","核自动非零"],a:0,e:"无解不是超静定，而是约束/载荷模型不相容。"},
      {id:"dt-compat",level:3,concept:"self-stress",p:"超静定结构为何要引入材料与变形？",c:"compatibility",o:["平衡只确定到核方向，兼容与本构补足条件","材料改变量纲","为了计算合力"],a:0,e:"这正是从刚体静力向弹性力学扩展的入口。"},
      {id:"dt-library",level:3,concept:"library-statics",p:"Mathlib 哪个对象直接表达平衡算子？",c:"A : R →ₗ[ℝ] E",o:["LinearMap","SetLike","Float"],a:0,e:"LinearMap.ker 表达自应力空间。"}
    ]),

    work: deck("功的形式化","从常力点积功出发，证明路径分段可加并划定变力边界。",22,[
      {id:"wk-def",level:1,concept:"work-dot",p:"常力 F 从 p 到 q 做功是？",c:"W",o:["F·(q-p)","F×(q-p)","‖F‖+‖q-p‖"],a:0,e:"功是标量。"},
      {id:"wk-unit",level:1,concept:"work-dot",p:"功的 SI 单位是？",c:"force × displacement",o:["J = N·m","N","W"],a:0,e:"瓦特 W 是功率单位。"},
      {id:"wk-zero",level:1,concept:"work-dot",p:"位移与力正交时常力功？",c:"F·d",o:["0","‖F‖‖d‖","负无穷"],a:0,e:"点积为零。"},
      {id:"wk-add",level:2,concept:"work-dot",p:"经中间点 q 的分段功满足？",c:"p→q→r",o:["W(p,r)=W(p,q)+W(q,r)","W(p,r)=W(p,q)W(q,r)","仅当 q=0"],a:0,e:"位移首尾相接与点积线性。"},
      {id:"wk-sign",level:2,concept:"work-dot",p:"F 与位移方向相反时功的符号？",c:"θ=π",o:["负","正","必为零"],a:0,e:"cos π=-1。"},
      {id:"wk-origin",level:2,concept:"affine-space",p:"常力功是否依赖坐标原点？",c:"F·(q-p)",o:["不依赖","依赖","只在 F=0 时不依赖"],a:0,e:"两点差消去共同原点。"},
      {id:"wk-variable",level:3,concept:"statics-scope",p:"空间变力 F(x) 的功一般需要什么？",c:"path γ",o:["沿路径的线积分","只用终点点积","叉积求和"],a:0,e:"本章不展开一般曲线积分。"},
      {id:"wk-path",level:3,concept:"conservative-potential",p:"何时变力功只依赖端点？",c:"conservative",o:["力场保守且区域条件适当","任何连续力场","只要路径直线"],a:0,e:"此时可由势能差表示。"},
      {id:"wk-torque",level:3,concept:"model-boundary",p:"功和力矩都用 N·m，为什么一个是标量一个是向量？",c:"semantics",o:["它们来自不同几何配对与变换规则","单位决定类型相同","三维中功也是向量"],a:0,e:"同量纲不代表同对象类型。"}
    ]),

    potential: deck("势能与保守力","连接负梯度、弹簧二次势能与功—势能关系。",22,[
      {id:"pt-force",level:1,concept:"conservative-potential",p:"保守力由势能 V 怎样定义？",c:"F(x)",o:["−∇V(x)","∇V(x)","V(x)·x"],a:0,e:"力指向势能下降方向。"},
      {id:"pt-spring",level:1,concept:"conservative-potential",p:"各向同性线性弹簧的势能是？",c:"k stiffness",o:["½k‖x‖²","kx","½k‖x‖"],a:0,e:"二次势能的梯度为 kx。"},
      {id:"pt-hooke",level:1,concept:"conservative-potential",p:"上述势能对应的力？",c:"-gradient",o:["−k x","k x","−k‖x‖"],a:0,e:"这就是向原点恢复的 Hooke 力。"},
      {id:"pt-constant",level:2,concept:"conservative-potential",p:"给势能加常数 C 会改变力吗？",c:"V+C",o:["不会，常数梯度为零","会增加 C","会反向"],a:0,e:"势能零点可以任意选择。"},
      {id:"pt-work",level:2,concept:"conservative-potential",p:"保守力从 p 到 q 的功等于？",c:"potential difference",o:["V(p)-V(q)","V(q)-V(p)","V(p)+V(q)"],a:0,e:"力是负梯度。"},
      {id:"pt-gradient",level:2,concept:"library-statics",p:"Physlib 哪个模块提供本章使用的梯度规则？",c:"import",o:["Physlib.Mathematics.Calculus.Gradient","Physlib.Units.Dimension","Mathlib.Data.String"],a:0,e:"可复用 gradient_inner_self 等结果。"},
      {id:"pt-diff",level:3,concept:"conservative-potential",p:"陈述 F=−∇V 默认需要 V 具有什么性质？",c:"gradient",o:["在所讨论点可微","只需可排序","必须是多项式"],a:0,e:"二次势能满足该条件。"},
      {id:"pt-nonconservative",level:3,concept:"statics-scope",p:"摩擦力通常能否由全局单值势能表示？",c:"dry friction",o:["通常不能","总能","仅单位换成 J 即可"],a:0,e:"因此势能极小判据不能覆盖所有静力系统。"},
      {id:"pt-phys",level:3,concept:"model-boundary",p:"Lean 证明 −∇V=−kx 后还未验证什么？",c:"model",o:["真实装置确实服从该势能模型","代数等式","梯度类型"],a:0,e:"形式化验证的是给定模型内部推导。"}
    ]),

    "virtual-work": deck("虚功原理","在有限维刚体与线性约束范围内形式化许可虚运动。",24,[
      {id:"vw-def",level:1,concept:"virtual-work",p:"虚位移首先必须满足什么？",c:"δq",o:["线性化约束/许可条件","真实时间演化方程","单位数值为 1"],a:0,e:"虚位移是瞬时可容许变化，不一定是真实轨迹。"},
      {id:"vw-power",level:1,concept:"rigid-virtual-motion",p:"刚体虚运动 (v,ω) 上外力虚功率是？",c:"δP",o:["R·v+M·ω","R×v+M×ω","V(v)+V(ω)"],a:0,e:"这是力系与刚体 twist 的自然配对。"},
      {id:"vw-ideal",level:1,concept:"virtual-work",p:"理想约束反力的特点是？",c:"reaction",o:["对所有许可虚位移不做虚功","合力必为零","势能必为零"],a:0,e:"这允许在虚功方程中消去反力。"},
      {id:"vw-free",level:2,concept:"rigid-virtual-motion",p:"无约束刚体允许所有 v、ω 时，虚功原理等价于？",c:"∀ v ω",o:["R=0∧M=0","R=M","V=0"],a:0,e:"这就是上一关的充要条件。"},
      {id:"vw-subspace",level:2,concept:"virtual-work",p:"线性许可空间 A 上虚功为零表示载荷泛函位于？",c:"annihilator",o:["A 的零化子/正交补","A 自身必为零","所有空间"],a:0,e:"约束反力正位于未许可方向。"},
      {id:"vw-beam",level:2,concept:"virtual-work",p:"只允许梁绕 A 微转时，虚功方程主要恢复哪个平衡式？",c:"virtual rotation",o:["关于 A 的力矩平衡","水平合力","单位换算"],a:0,e:"选择合适虚运动可直接提取平衡分量。"},
      {id:"vw-finite",level:3,concept:"statics-scope",p:"本章为何把虚功限制在有限维？",c:"scope",o:["避免在入门章引入函数空间、弱导数和积分边界项","虚功只在三维成立","Mathlib 无集合"],a:0,e:"连续介质弱形式可作为后续研究专题。"},
      {id:"vw-nonideal",level:3,concept:"virtual-work",p:"若约束力对许可位移做功，能否直接删除它？",c:"non-ideal constraint",o:["不能","可以","只要合力为零"],a:0,e:"必须把该力显式保留在虚功方程中。"},
      {id:"vw-static",level:3,concept:"statics-scope",p:"虚功为零本身是否说明动力过程耗散？",c:"static virtual work",o:["不说明；这是静力/瞬时变分条件","说明无耗散","说明动能为零"],a:0,e:"动力学与耗散需要额外结构。"}
    ]),

    stability: deck("势能极值与稳定性","在保守的一维二次模型中严格区分稳定、中性与不稳定。",24,[
      {id:"st-pos",level:1,concept:"stability-energy",p:"V(x)=½kx² 且 k>0 时，x=0 是？",c:"quadratic potential",o:["严格全局极小点","严格极大点","非驻点"],a:0,e:"x≠0 时 x²>0。"},
      {id:"st-zero",level:1,concept:"stability-energy",p:"k=0 时势能图像怎样？",c:"V(x)",o:["处处相等，对应中性平坦","严格极小","向下开口"],a:0,e:"势能法不提供恢复刚度。"},
      {id:"st-neg",level:1,concept:"stability-energy",p:"k<0 时 x=0 是？",c:"V(x)",o:["严格极大且存在降能方向","严格极小","中性"],a:0,e:"任意非零小位移都使势能更低。"},
      {id:"st-first",level:2,concept:"stability-energy",p:"势能平衡点通常先满足什么一阶条件？",c:"equilibrium",o:["∇V=0","V=0","V=1"],a:0,e:"保守力 F=−∇V 在平衡点为零。"},
      {id:"st-second",level:2,concept:"stability-energy",p:"多维二次势能的稳定性由什么控制？",c:"Hessian/stiffness",o:["刚度二次型的正定性","坐标和","单位字符串"],a:0,e:"正定给出各许可方向上的正二阶变化。"},
      {id:"st-neutral",level:2,concept:"stability-energy",p:"半正定而非正定时应警惕什么？",c:"zero modes",o:["零模与高阶项，需要进一步分析","自动严格稳定","量纲不齐次"],a:0,e:"二阶判据可能退化。"},
      {id:"st-local",level:3,concept:"stability-energy",p:"一般势能极小判据为何强调局部？",c:"nonlinear V",o:["远处可能有其他极值或模型失效","Lean 不能比较全局","物理空间无全局点"],a:0,e:"稳定性关注平衡附近扰动。"},
      {id:"st-buckling",level:3,concept:"statics-scope",p:"屈曲为何不能被一个标量弹簧 k 的例子完整覆盖？",c:"buckling",o:["涉及构型空间、几何非线性与载荷类型","没有势能","只发生在二维"],a:0,e:"本章只建立后续学习所需的最小严谨原型。"},
      {id:"st-friction",level:3,concept:"statics-scope",p:"势能严格极小是否适用于任意摩擦耗散系统？",c:"nonconservative",o:["不直接适用","总适用","只需 k>0"],a:0,e:"非保守力需要 Lyapunov、耗散或微分包含等框架。"}
    ]),

    "statics-physlib": deck("调用 Mathlib 与 Physlib","把透明教学定义连接到叉积、欧式空间、参考系、线性映射核与梯度 API。",24,[
      {id:"sp-cross",level:1,concept:"library-statics",p:"三维叉积来自哪个 Mathlib 模块？",c:"import",o:["Mathlib.LinearAlgebra.CrossProduct","Mathlib.Data.Nat.Basic","Physlib.Units.Dimension"],a:0,e:"其中定义 crossProduct 与 Matrix 作用域中的 ⨯₃ 记号。"},
      {id:"sp-frame",level:1,concept:"library-statics",p:"物理参考系的点/向量桥接来自？",c:"Physlib",o:["Physlib.SpaceAndTime.ReferenceFrame","Physlib.Units.WithDim.Speed","Mathlib.Tactic"],a:0,e:"它区分空间点、原点、基底和坐标向量。"},
      {id:"sp-grad",level:1,concept:"library-statics",p:"验证二次势能负梯度需要导入？",c:"gradient",o:["Physlib.Mathematics.Calculus.Gradient","Physlib.SpaceAndTime.Time","String"],a:0,e:"Physlib 提供 gradient_inner_self 等规则。"},
      {id:"sp-check",level:2,concept:"library-statics",p:"调用陌生库定理前最安全的第一步是？",c:"___ theoremName",o:["#check","#eval","inductive"],a:0,e:"先确认命名空间、参数和假设。"},
      {id:"sp-kernel",level:2,concept:"self-stress",p:"自应力空间可直接写成？",c:"A : R →ₗ[ℝ] E",o:["LinearMap.ker A","Set.range A","Matrix.det R"],a:0,e:"核中元素映到零平衡残差。"},
      {id:"sp-dotzero",level:2,concept:"dot-metric",p:"由 v·v=0 推出 v=0 可复用？",c:"Mathlib",o:["dotProduct_self_eq_zero","cross_anticomm","gradient_add_const"],a:0,e:"这是平衡充要条件的关键数学引理。"},
      {id:"sp-gap",level:3,concept:"library-statics",p:"Physlib 当前没有整章统一静力学 API 时，合理策略是？",c:"library gap",o:["定义轻量领域结构，底层数学继续复用库","伪造不存在的定理名","完全不用库"],a:0,e:"展品的 AppliedForce/ForceSystem 正是这一桥层。"},
      {id:"sp-coordinate",level:3,concept:"affine-space",p:"最终作品为何仍保留 Vec3 坐标版本？",c:"teaching artifact",o:["便于完整证明移矩、力偶和梁反力，再标注参考系升级路径","Physlib 只能用 Vec3","坐标比几何更真实"],a:0,e:"教学透明性与库复用并不冲突。"},
      {id:"sp-boundary",level:3,concept:"statics-scope",p:"库中有 gradient 是否就自动获得一般稳定性定理？",c:"API reuse",o:["不会，还需势能正则性、约束、局部极小等假设","会","只需 import Mathlib"],a:0,e:"复用计算规则不等于省略物理假设。"}
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

    "statics-practice": deck("欧式静力学综合实验","跨越向量、力矩、平衡、静定性、虚功与势能稳定性的分层随机组卷。",35,[
      {id:"stp-vec",level:1,concept:"euclidean-space",p:"Vec3 := Fin 3 → ℝ 中向量相等怎样证明？",c:"v=w",o:["逐坐标 ext","比较列表长度","比较单位"],a:0,e:"函数外延性覆盖三个坐标。"},
      {id:"stp-dot",level:1,concept:"dot-metric",p:"v·v=0 在欧式空间中推出？",c:"positive definite",o:["v=0","v=1","Σvᵢ=0"],a:0,e:"内积正定。"},
      {id:"stp-force",level:1,concept:"force-system",p:"有限力系的合力是？",c:"S",o:["各力向量之和","各作用点之和","各力矩叉积"],a:0,e:"作用点只影响力矩。"},
      {id:"stp-moment",level:1,concept:"moment-cross",p:"M_O 的公式是？",c:"force at P",o:["(P-O)×F","(P-O)·F","P+F"],a:0,e:"叉积给出轴向力矩。"},
      {id:"stp-shift",level:2,concept:"moment-origin",p:"合力为零时换参考点，总力矩怎样？",c:"R=0",o:["不变","反号","总为零"],a:0,e:"力偶矩可能非零但参考点无关。"},
      {id:"stp-balance",level:2,concept:"equilibrium-balance",p:"三维刚体平衡需要？",c:"static",o:["R=0 且 M=0","R=0 即可","R·M=0"],a:0,e:"分别排除平动和转动。"},
      {id:"stp-reaction",level:2,concept:"reactions",p:"简支梁 R_A+R_B=P 且 R_BL=Pa，R_B 是？",c:"L≠0",o:["Pa/L","P(L-a)/L","PL/a"],a:0,e:"由力矩方程直接解得。"},
      {id:"stp-kernel",level:2,concept:"self-stress",p:"Ak=0 且 k≠0 说明？",c:"equilibrium operator",o:["存在自应力方向","载荷无解","结构一定失稳"],a:0,e:"已有解可沿 k 生成另一解。"},
      {id:"stp-work",level:3,concept:"work-dot",p:"常力功为何可沿中间点分段相加？",c:"F·(r-p)",o:["位移相加与点积线性","叉积反交换","势能必为零"],a:0,e:"r-p=(q-p)+(r-q)。"},
      {id:"stp-vw",level:3,concept:"virtual-work",p:"有约束虚功原理只测试？",c:"δq",o:["许可虚位移","所有空间向量","真实加速度"],a:0,e:"约束反力可能在禁阻方向非零。"},
      {id:"stp-stable",level:3,concept:"stability-energy",p:"V=½kx² 且 k<0 时原点？",c:"energy",o:["不稳定，有降能方向","严格稳定","中性"],a:0,e:"任意非零 x 都使 V(x)<V(0)。"},
      {id:"stp-scope",level:3,concept:"statics-scope",p:"本章结论不能直接覆盖哪一项？",c:"scope",o:["连续体屈曲与摩擦接触","有限集中力合力","三维叉积"],a:0,e:"那些需要更丰富的函数空间与非线性/不等式结构。"}
    ],6),

    daily: deck("物理学形式化练习场","每日从已学习路线跨关卡复习，按难度随机抽题。",5,[
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
      {id:"daily-kmh",level:3,concept:"physlib-withdim",p:"1 km/h 的 SI 数值是？",c:"DimSpeed.oneKilometerPerHour_in_SI",o:["5/18","18/5","1000"],a:0,e:"精确换算为 5/18 m/s。"},
      {id:"daily-vec3",level:1,concept:"euclidean-space",p:"Fin 3 → ℝ 表示？",c:"Vec3",o:["三维实坐标向量","三个实数的集合命题","三维整数"],a:0,e:"Fin 3 是三个坐标索引。"},
      {id:"daily-dot",level:1,concept:"dot-metric",p:"正交向量的点积是？",c:"v ⟂ w",o:["0","1","‖v‖+‖w‖"],a:0,e:"正交由内积为零定义。"},
      {id:"daily-force",level:1,concept:"force-vector",p:"刚体集中力为何记录作用点？",c:"AppliedForce",o:["作用点影响力矩","作用点改变量纲","作用点决定质量"],a:0,e:"同力异点可有不同转动效应。"},
      {id:"daily-moment",level:1,concept:"moment-cross",p:"力矩使用哪个运算？",c:"r ? F",o:["叉积","点积","除法"],a:0,e:"M=r×F。"},
      {id:"daily-shift",level:2,concept:"moment-origin",p:"移矩公式的修正项含什么？",c:"M_Q-M_O",o:["−(Q−O)×R","Q·R","V(Q)-V(O)"],a:0,e:"修正项由原点位移和合力决定。"},
      {id:"daily-balance",level:2,concept:"equilibrium-balance",p:"刚体平动与转动平衡合写为？",c:"static equilibrium",o:["R=0∧M=0","R=M","R×M=0"],a:0,e:"两个向量条件都需要。"},
      {id:"daily-beam",level:2,concept:"reactions",p:"简支梁以 A 取矩的优势是？",c:"ΣM_A",o:["A 点反力力臂为零","合力自动为零","不需 L≠0"],a:0,e:"可先独立求另一端反力。"},
      {id:"daily-unique",level:2,concept:"static-determinacy",p:"静定在 Lean 中适合用哪个量词结构？",c:"reaction solution",o:["∃!","∀!","¬∃"],a:0,e:"存在唯一解。"},
      {id:"daily-virtual",level:3,concept:"rigid-virtual-motion",p:"对所有 v,ω 有 R·v+M·ω=0 推出？",c:"free rigid body",o:["R=0∧M=0","R=M","R×M=0"],a:0,e:"分别测试 v=R 与 ω=M。"},
      {id:"daily-potential",level:3,concept:"conservative-potential",p:"V=½k‖x‖² 对应力？",c:"F=-∇V",o:["−kx","kx","−k‖x‖"],a:0,e:"二次势能梯度为 kx。"},
      {id:"daily-selfstress",level:3,concept:"self-stress",p:"非零 ker A 主要提示？",c:"equilibrium map",o:["超静定/自应力自由度","势能必为负","合力单位错误"],a:0,e:"平衡方程不能唯一确定核方向。"},
      {id:"daily-stability",level:3,concept:"stability-energy",p:"正刚度二次势能的原点是？",c:"k>0",o:["严格极小","严格极大","中性"],a:0,e:"非零扰动增加势能。"}
    ])
  };

  window.LEANPATH_CONCEPTS = concepts;
  window.LEANPATH_QUESTION_BANKS = decks;
  window.LEANPATH_QUESTION_SOURCES = [
    {id:"si",name:"BIPM SI Brochure",url:"https://www.bipm.org/en/publications/si-brochure",license:"BIPM publication"},
    {id:"workshop",name:"暑校 Type Theory / Inductive Type 物理量练习",license:"课程材料"},
    {id:"physlib",name:"Physlib",url:"https://github.com/leanprover-community/Physlib",license:"Apache-2.0"},
    {id:"mil",name:"Mathematics in Lean",url:"https://github.com/leanprover-community/mathematics_in_lean",license:"Apache-2.0"},
    {id:"mathlib-cross",name:"Mathlib CrossProduct",url:"https://github.com/leanprover-community/mathlib4/blob/master/Mathlib/LinearAlgebra/CrossProduct.lean",license:"Apache-2.0"},
    {id:"physlib-frame",name:"Physlib ReferenceFrame",url:"https://github.com/leanprover-community/Physlib/blob/master/Physlib/SpaceAndTime/ReferenceFrame.lean",license:"Apache-2.0"},
    {id:"physlib-gradient",name:"Physlib Gradient",url:"https://github.com/leanprover-community/Physlib/blob/master/Physlib/Mathematics/Calculus/Gradient.lean",license:"Apache-2.0"}
  ];
}());

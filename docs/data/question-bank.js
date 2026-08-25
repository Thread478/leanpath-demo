/* LeanPath Physics · physics-first question bank for Parts I–II */
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
    quantity: deck("物理量的三层结构","从测速、受力与实验误差出发，区分物理量、单位、量纲和模型值。",10,[
      {id:"q-triad",level:1,concept:"quantity-triad",p:"汽车速度表读数为 72 km/h。要把这条观测写完整，至少要保留什么？",c:"72 km/h",o:["数值 72、单位 km/h、速度量纲 LT⁻¹","只有数值 72","只有变量名 speed"],a:0,e:"数值会随单位改变，量纲标记它属于速度这一物理类别。"},
      {id:"q-unit-change",level:1,concept:"quantity-triad",p:"同一辆车的速度从 72 km/h 改写为 20 m/s，什么保持不变？",c:"72 km/h = 20 m/s",o:["所描述的物理速度及其量纲","数值","单位符号"],a:0,e:"表示改变了，物理量和速度量纲没有改变。"},
      {id:"q-real",level:1,concept:"exact-real",p:"模型把重力加速度设为 g=9.8 m/s² 并推出落体时间。这个 9.8 在证明中首先是什么？",c:"h = 1/2 · g · t²",o:["模型采用的精确参数，不自动等于当地实测值","由 Lean 测得的实验数据","没有单位的浮点误差"],a:0,e:"形式化可精确推导给定参数的后果，但参数与真实装置的对应需另行验证。"},
      {id:"q-dimension-vs-unit",level:2,concept:"quantity-triad",p:"风速 10 m/s 与 36 km/h 在风洞模型中应如何比较？",c:"10 m/s = 36 km/h",o:["同一速度量纲，换算后数值也相等","量纲不同，不能比较","单位不同，所以代表不同物理量"],a:0,e:"二者都表示速度，换到共同单位后可以直接比较。"},
      {id:"q-name-no-type",level:2,concept:"typed-quantity",p:"跑者沿 400 m 跑道一圈回到起点，用时 80 s。平均速率与平均速度分别是？",c:"distance = 400 m\ndisplacement = 0 m",o:["5 m/s 与 0 m/s","都是 5 m/s","都是 0 m/s"],a:0,e:"速率用路程，速度用位移；同量纲不代表同一物理定义。"},
      {id:"q-prop",level:2,concept:"exact-real",p:"质量 2 kg 的质点具有 3 m/s² 的加速度。按 F=ma，合力是多少？",c:"F = (2 kg) · (3 m/s²)",o:["6 N","5 N","6 J"],a:0,e:"数值相乘得 6，量纲 ML T⁻² 对应牛顿。"},
      {id:"q-measurement",level:3,concept:"model-boundary",p:"长度记录为 (2.00 ± 0.01) m。只证明 200 cm = 2 m，尚未处理哪件事？",c:"measurement = value ± uncertainty",o:["测量不确定度及其传播","单位换算本身","长度的量纲"],a:0,e:"精确换算只解决表示等价；实验误差需要单独的数据与传播模型。"},
      {id:"q-zero-value",level:3,concept:"quantity-triad",p:"竖直上抛小球在最高点瞬时速度为 0。此时速度量纲怎样？",c:"v(t_top) = 0 m/s",o:["仍是 LT⁻¹，且加速度可非零","变成无量纲","变成加速度量纲"],a:0,e:"数值为零不会抹去物理量的类别；最高点仍受重力加速度。"},
      {id:"q-same-dim-semantics",level:3,concept:"model-boundary",p:"力矩与能量都具有 ML²T⁻²，是否因此是同一物理概念？",c:"[torque] = [energy]",o:["不是；同量纲不等于同语义","是；量纲相同就可互换","是；二者数值恒等"],a:0,e:"量纲分类较粗，不能取代对象的物理定义。"}
    ]),

    "si-base": deck("七个 SI 基本量","在力学、热学与电学情境中识别基本量，并把导出量还原到 SI 基础。",12,[
      {id:"si-time",level:1,concept:"si-seven",p:"高速摄影测得碰撞持续 250 ms。写成 SI 基本单位是多少？",c:"250 ms",o:["0.250 s","250 s","0.025 s"],a:0,e:"毫秒是 10⁻³ s，所以 250 ms=0.250 s。"},
      {id:"si-mass",level:1,concept:"si-seven",p:"实验砝码标为 750 g。作为 SI 质量值应写成？",c:"750 g",o:["0.750 kg","750 kg","7.50 kg"],a:0,e:"质量基本单位是 kg，750 g=0.750 kg。"},
      {id:"si-current",level:1,concept:"si-seven",p:"恒定电流 2 A 流过导线 3 s，输运的电荷量为？",c:"Q = I t",o:["6 C","1.5 C","6 V"],a:0,e:"C=A·s，所以 Q=2×3=6 C。"},
      {id:"si-seven-list",level:2,concept:"si-seven",p:"哪一组恰好都是 SI 基本单位？",c:"___",o:["s, m, kg, A, K, mol, cd","s, m, N, J, Pa, V, W","h, km, g, C, ℃, L, lm"],a:0,e:"第二组多为导出单位，第三组含非 SI 或可并用单位。"},
      {id:"si-kelvin",level:2,concept:"si-seven",p:"在理想气体状态方程 pV=nRT 中，20 ℃ 应先换成哪个温度？",c:"T = 20 ℃",o:["293.15 K","20 K","253.15 K"],a:0,e:"热力学公式使用绝对温度；20+273.15=293.15 K。"},
      {id:"si-candela",level:2,concept:"si-seven",p:"点光源在某方向标为 10 cd，这个值直接描述的是？",c:"10 cd",o:["该方向的发光强度","接收面的照度","光源总光通量"],a:0,e:"cd 是发光强度基本单位；照度 lx 和光通量 lm 是导出单位。"},
      {id:"si-charge-derived",level:3,concept:"derived-dimension",p:"电荷为何不是第八个基本量？",c:"Q = I·t",o:["它可由电流乘时间导出","因为电荷没有单位","因为库不支持电学"],a:0,e:"库仑 C = A·s。"},
      {id:"si-angle",level:3,concept:"dimensionless",p:"半径 2 m 的圆上，弧长 π m 对应的圆心角是多少？",c:"θ = s/r",o:["π/2 rad","2π rad","π m"],a:0,e:"θ=(π m)/(2 m)=π/2；长度约去但 rad 保留角度语义。"},
      {id:"si-basis-choice",level:3,concept:"unit-system",p:"“基本量”是否完全由自然唯一决定？",c:"choice of basis",o:["体系选择有约定性，但必须能一致生成所需量纲","完全任意且无需独立","由变量名自动决定"],a:0,e:"SI 选七个基本量；其他理论可采用等价基底或自然单位约定。"}
    ]),

    "dimension-model": deck("构造量纲向量","把物理公式翻译为七维指数向量，并用它反推未知参数的量纲。",14,[
      {id:"dm-inductive",level:1,concept:"si-seven",p:"位移满足 x = 1/2·a·t²。由量纲齐次性，加速度的 (T,L,M) 指数是？",c:"[a] = [x]/[t]²",o:["(−2,1,0)","(−1,1,0)","(2,1,0)"],a:0,e:"长度指数为 1，时间平方移到分母给出 −2。"},
      {id:"dm-function",level:1,concept:"dimension-vector",p:"万有引力 F=Gm₁m₂/r²。G 的量纲是？",c:"[G] = [F][r]²/[m]²",o:["M⁻¹L³T⁻²","MLT⁻²","M⁻²L²T⁻¹"],a:0,e:"(MLT⁻²)L²/M²=M⁻¹L³T⁻²。"},
      {id:"dm-basis",level:1,concept:"dimension-vector",p:"胡克定律 F=kx 中，弹簧刚度 k 的量纲是？",c:"[k] = [F]/[x]",o:["MT⁻²","MLT⁻²","ML²T⁻²"],a:0,e:"力除以长度得到 MT⁻²。"},
      {id:"dm-force-vector",level:2,concept:"dimension-vector",p:"按顺序 (T,L,M,I,Θ,N,J)，力的指数向量是？",c:"[F] = MLT⁻²",o:["(−2,1,1,0,0,0,0)","(2,1,1,0,0,0,0)","(−2,2,1,0,0,0,0)"],a:0,e:"时间 −2、长度 1、质量 1。"},
      {id:"dm-ext",level:2,concept:"dimension-equality",p:"剪切应力 τ=μ(v/L)。由 [τ]=ML⁻¹T⁻²，动力黏度 μ 的量纲是？",c:"[μ] = [τ][L]/[v]",o:["ML⁻¹T⁻¹","MLT⁻²","M⁻¹LT⁻¹"],a:0,e:"(ML⁻¹T⁻²)L/(LT⁻¹)=ML⁻¹T⁻¹。"},
      {id:"dm-dimensionless-zero",level:2,concept:"dimension-vector",p:"Re=ρvL/μ 的七个指数全部抵消。这一结果说明？",c:"[Re] = 1",o:["雷诺数可作为跨尺度比较的无量纲参数","雷诺数数值恒为 1","流体没有质量量纲"],a:0,e:"零指数向量表示无量纲，但 Re 的数值仍随流动状态改变。"},
      {id:"dm-order-free",level:3,concept:"dimension-vector",p:"阻尼力 F=−bv。阻尼系数 b 的量纲是？",c:"[b] = [F]/[v]",o:["MT⁻¹","MT⁻²","MLT⁻¹"],a:0,e:"MLT⁻² 除以 LT⁻¹，得到 MT⁻¹。"},
      {id:"dm-integer-limit",level:3,concept:"rational-exponent",p:"单摆周期 T=C√(ℓ/g) 中，根式为何仍得到普通时间量纲？",c:"[ℓ/g] = L/(LT⁻²)",o:["根号内为 T²，开方后为 T","根号会删除所有量纲","因为 C 必有时间量纲"],a:0,e:"ℓ/g 的时间指数为 2，可在整数指数模型中整除。"},
      {id:"dm-equality-all",level:3,concept:"dimension-equality",p:"动量 p 与能量 E 只有时间指数不同。能否把 p+E 写进同一物理方程？",c:"[p]=MLT⁻¹, [E]=ML²T⁻²",o:["不能；至少一个基本指数不同就不可直接相加","可以；二者都含 M、L、T","只在 SI 中可以"],a:0,e:"量纲相等要求每个基本指数都一致。"}
    ]),

    "dimension-ops": deck("量纲代数","通过冲量、压强、转动惯量和阻力公式练习量纲乘除与幂。",16,[
      {id:"do-mul",level:1,concept:"dimension-algebra",p:"恒力 F 作用时间 Δt 所产生的冲量 J=FΔt，其量纲是？",c:"[J] = [F][t]",o:["MLT⁻¹","MLT⁻²","ML²T⁻²"],a:0,e:"MLT⁻² 乘 T，得到与动量相同的 MLT⁻¹。"},
      {id:"do-div",level:1,concept:"dimension-algebra",p:"100 N 均匀作用在 0.5 m² 面积上，平均压强是多少？",c:"p = F/A",o:["200 Pa","50 Pa","200 N"],a:0,e:"100/0.5=200，N/m²=Pa。"},
      {id:"do-inv",level:1,concept:"dimension-algebra",p:"频率是时间的倒数，其量纲为？",c:"frequency = 1 / time",o:["T⁻¹","T","L⁻¹"],a:0,e:"取逆把时间指数 1 变为 −1。"},
      {id:"do-power",level:2,concept:"dimension-algebra",p:"质点绕轴的转动惯量 I=mr²，其量纲是？",c:"[I] = [m][r]²",o:["ML²","ML","ML²T⁻²"],a:0,e:"半径平方给出 L²，转动惯量本身不含时间指数。"},
      {id:"do-cancel",level:2,concept:"dimension-algebra",p:"长度为 2.00 m 的杆伸长 1.0 mm，应变 ε=ΔL/L 是多少？",c:"ε = 0.001/2.00",o:["5×10⁻⁴，无量纲","5×10⁻⁴ m","2×10³，无量纲"],a:0,e:"同类长度相除，数值为 0.0005。"},
      {id:"do-add",level:2,concept:"typed-operations",p:"两力 F₁=(3,0) N、F₂=(0,4) N 的合力大小是？",c:"R = F₁ + F₂",o:["5 N","7 N","12 N"],a:0,e:"先做同量纲向量加法得 (3,4) N，再取欧式范数。"},
      {id:"do-assoc",level:3,concept:"dimension-algebra",p:"二次阻力 F=CρAv² 中，若 C 无量纲，右侧是否具有力的量纲？",c:"[ρ]=ML⁻³, [A]=L², [v²]=L²T⁻²",o:["是，乘积为 MLT⁻²","否，乘积为 ML²T⁻²","只有 C 带时间量纲时才是"],a:0,e:"ML⁻³·L²·L²T⁻²=MLT⁻²。"},
      {id:"do-sqrt",level:3,concept:"rational-exponent",p:"T=2π√(ℓ/g) 的量纲运算给出什么？",c:"[ℓ/g] = T²",o:["T 的量纲为时间，2π 不改变量纲","T 无量纲","T 的量纲为时间平方"],a:0,e:"开方把 T² 变为 T；2π 是无量纲系数。"},
      {id:"do-comm",level:3,concept:"dimension-algebra",p:"rF 与 Fr 在量纲上都给 L·F。这能否推出力矩 r×F 与功 F·r 是同一种量？",c:"[torque] = [work] = ML²T⁻²",o:["不能；叉积与点积产生不同几何对象","能；量纲交换性保证概念相同","只有数值为零时不能"],a:0,e:"量纲代数交换只说明指数相同，不决定几何配对与物理语义。"}
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

    "typed-quantity": deck("量纲约束下的物理量","把量纲检查用于真实公式，同时识别量纲类型尚未覆盖的物理语义。",20,[
      {id:"tq-structure",level:1,concept:"typed-quantity",p:"抛体模型同时记录高度 h、飞行时间 t 与初速度 v₀。哪一个表达式应被量纲索引直接拒绝？",c:"h : Quantity L\nt : Quantity T\nv₀ : Quantity (L/T)",o:["h + t","v₀ * t","h / t"],a:0,e:"长度与时间不能相加；其余两式分别给长度和速度。"},
      {id:"tq-different",level:1,concept:"typed-quantity",p:"周期 T=0.02 s 的波，其频率 f=50 Hz。乘积 fT 应是什么？",c:"[f]=T⁻¹, [T]=T",o:["无量纲且数值为 1","时间量纲且数值 1","无量纲且数值 2.5"],a:0,e:"50×0.02=1，时间指数相消。"},
      {id:"tq-value",level:1,concept:"typed-quantity",p:"同一长度在两个记录中分别存为 value=2 与 value=200。要判断它们是否相等，还必须知道什么？",c:"2 m = 200 cm",o:["各 value 所采用的单位尺度","长度量纲","二者变量名"],a:0,e:"量纲相同仍不够；底层数值只有相对于单位制才有意义。"},
      {id:"tq-safe-add",level:2,concept:"typed-quantity",p:"位移 2 m 与 30 cm 相加时，物理上正确的处理是？",c:"2 m + 30 cm",o:["先换到同一尺度，结果为 2.30 m","因单位符号不同而禁止相加","直接把数值拼成 230 m"],a:0,e:"同量纲允许加法，但数值相加前必须统一单位。"},
      {id:"tq-zero",level:2,concept:"typed-quantity",p:"碰撞模型出现“零位移”和“零持续时间”。为何不能因数值都为 0 就互换？",c:"0 m  ≠  0 s as typed quantities",o:["它们承担不同量纲和不同方程角色","零会自动变成任意物理量","只有非零量才有量纲"],a:0,e:"多态零可由上下文实例化，但每个具体物理量仍有确定量纲。"},
      {id:"tq-unit-missing",level:2,concept:"unit-system",p:"模型只记录 g.value=9.81，却没记录单位制。最直接的风险是？",c:"g : Quantity accelerationDim",o:["无法判断它表示 m/s²、ft/s² 还是别的尺度","无法知道它是加速度量纲","实数不能相乘"],a:0,e:"量纲索引说明类别，单位层说明底层数值的尺度。"},
      {id:"tq-semantic-limit",level:3,concept:"model-boundary",p:"一项记录为 10 N·m。仅凭量纲索引，能否判断它是做功还是绕轴力矩？",c:"[work] = [torque] = ML²T⁻²",o:["不能；还要看它是标量配对还是轴向力矩","能；N·m 唯一表示功","能；N·m 唯一表示力矩"],a:0,e:"量纲类型防止不相容量相混，却不编码全部几何语义。"},
      {id:"tq-elaboration",level:3,concept:"affine-unit",p:"两个房间温度分别为 20 ℃ 和 10 ℃。哪种物理运算最自然？",c:"absolute temperatures",o:["相减得到 10 K 的温差","相加得到 30 ℃ 的绝对温度","相乘得到 200 K²"],a:0,e:"绝对温度更像仿射点；温度差才是可自由加减的向量量。"},
      {id:"tq-proof-index",level:3,concept:"dimension-equality",p:"由 v=x/t 得到的量纲 L/T，与预先定义的 speedDim 在类型层连接前，物理上需确认什么？",c:"lengthDim / timeDim = speedDim",o:["七个基本指数逐项一致","两个数值偶然相等","都使用字母 v"],a:0,e:"量纲恒等式是公式结果可作为速度使用的依据。"}
    ]),

    "typed-ops": deck("物理公式的类型安全运算","用同量纲加法、乘除合成和数值域假设检查常见力学公式。",20,[
      {id:"to-add",level:1,concept:"typed-operations",p:"水平两力分别为 +8 N 与 −3 N，合力是多少？",c:"R = F₁ + F₂",o:["+5 N","+11 N","−24 N"],a:0,e:"同量纲且同一直线上的有向力可直接相加。"},
      {id:"to-mul",level:1,concept:"typed-operations",p:"恒力 12 N 沿力方向推动物体 0.5 m，做功是多少？",c:"W = F·s",o:["6 J","24 J","6 N"],a:0,e:"12×0.5=6，力乘位移得到能量量纲。"},
      {id:"to-div",level:1,concept:"typed-operations",p:"质量 4 kg 均匀装在体积 0.002 m³ 内，平均密度是多少？",c:"ρ = m/V",o:["2000 kg/m³","0.0005 kg/m³","8 kg·m³"],a:0,e:"4/0.002=2000，返回质量/体积量纲。"},
      {id:"to-scale",level:2,concept:"typed-operations",p:"把同一物体的动量 p 整体乘无量纲系数 2，结果的量纲怎样？",c:"p' = 2p",o:["仍为动量量纲 MLT⁻¹","变为能量量纲","变为无量纲"],a:0,e:"纯数缩放改变大小，不改变量纲。"},
      {id:"to-sub",level:2,concept:"typed-operations",p:"温度绝对值的“相减”为何需要额外注意？",c:"T₁ - T₂",o:["结果是温差，语义上与绝对温标是仿射点/向量之别","结果必为绝对温度","量纲不同所以不能减"],a:0,e:"量纲相同只是必要条件；仿射量需要更细类型。"},
      {id:"to-power",level:2,concept:"typed-operations",p:"质量 2 kg、速率 3 m/s 的质点，动能 1/2 mv² 是多少？",c:"K = 1/2 · 2 · 3²",o:["9 J","6 J","18 N"],a:0,e:"速度平方带来 L²T⁻²，数值为 9。"},
      {id:"to-speed-time",level:3,concept:"typed-operations",p:"探测器以 1500 m/s 匀速飞行 0.2 s，位移是多少？",c:"Δx = vΔt",o:["300 m","7500 m","300 m/s"],a:0,e:"1500×0.2=300，速度乘时间化简为长度。"},
      {id:"to-div-zero",level:3,concept:"model-boundary",p:"用 Δx/Δt 定义区间平均速度时，量纲正确是否足以允许 Δt=0？",c:"v_avg = Δx / Δt",o:["不允许；还需 Δt≠0 的值级假设","允许；量纲检查会处理除零","仅当 Δx=0 时允许"],a:0,e:"量纲兼容不保证分母非零。"},
      {id:"to-noncomm",level:3,concept:"dimension-algebra",p:"两个空间旋转 R₁、R₂ 都无量纲。能否因此认定 R₁R₂=R₂R₁？",c:"R₁ R₂",o:["不能；三维旋转的复合通常不交换","能；无量纲对象的乘法必交换","只有角度有单位时不能"],a:0,e:"量纲乘法交换不意味着矩阵或算符乘法交换。"}
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

    "physlib-units": deck("用 Physlib 表达物理单位","把库中的有理量纲、带量纲值和单位制用于换算与公式检查。",24,[
      {id:"pl-import-dim",level:1,concept:"physlib-withdim",p:"列车速度 90 km/h 换成 SI 是多少？",c:"90 × (5/18) m/s",o:["25 m/s","50 m/s","5 m/s"],a:0,e:"Physlib 的精确换算因子为 5/18，90×5/18=25。"},
      {id:"pl-withdim",level:1,concept:"physlib-withdim",p:"使用 WithDim 表示 3 m 与 2 s 后，哪种模型错误会被量纲索引阻止？",c:"length + time",o:["把 3 m 与 2 s 直接相加","用 3 m 除以 2 s","把 3 m 乘无量纲系数"],a:0,e:"相加要求同量纲；除法会得到速度量纲。"},
      {id:"pl-check",level:1,concept:"physlib-withdim",p:"查看 `DimSpeed.oneKilometerPerHour_in_SI` 的结论后，可直接得到 1 km/h 等于？",c:"#check DimSpeed.oneKilometerPerHour_in_SI",o:["5/18 m/s","18/5 m/s","1000 m/s"],a:0,e:"这里保留一次真实 API 阅读训练，目标是复用精确物理换算结论。"},
      {id:"pl-rational",level:2,concept:"physlib-dimension",p:"弦上线性密度 μ、张力 T 给出波速 c=√(T/μ)。根号内的量纲是？",c:"[Tension]=MLT⁻², [μ]=ML⁻¹",o:["L²T⁻²","LT⁻¹","ML²T⁻²"],a:0,e:"两者相除得 L²T⁻²，Physlib 的有理指数可把它开方为速度。"},
      {id:"pl-kmh",level:2,concept:"physlib-withdim",p:"自行车以 18 km/h 骑行 10 s，在匀速模型中行程是多少？",c:"18 km/h = 5 m/s",o:["50 m","180 m","5 m"],a:0,e:"先用库定理换为 5 m/s，再乘 10 s。"},
      {id:"pl-dimensionful",level:2,concept:"unit-system",p:"两个实验组分别报告 1.2 m 与 120 cm。单位制层应把它们判定为？",c:"same length, different unit coordinates",o:["同一物理长度","不同量纲的量","数值相等但物理量不同"],a:0,e:"Dimensionful 组织尺度换算，使同量纲的不同单位表示可比较。"},
      {id:"pl-custom-vs-lib",level:3,concept:"physlib-dimension",p:"课程自建 Dimension 与 Physlib 的关系应如何理解？",c:"transparent model / production library",o:["自建模型用于理解，项目代码优先复用库","两者必须互相删除","自建模型已覆盖 Physlib 全部功能"],a:0,e:"透明教学模型帮助掌握原理，成熟库提供更广 API 与审查。"},
      {id:"pl-exact",level:3,concept:"exact-real",p:"已复用 1 km/h=5/18 m/s 的库定理。要证明 72 km/h=20 m/s，还需完成哪一步？",c:"72 · (5/18) = 20",o:["精确的实数算术化简","浮点采样若干次","重新定义速度量纲"],a:0,e:"单位关系由库提供，剩余目标是 72×5/18=20。"},
      {id:"pl-boundary",level:3,concept:"model-boundary",p:"Physlib 接受单位定理后还需审查什么？",c:"Lean: accepted",o:["模型定义、单位约定与应用语境","定理是否有类型","加法字符颜色"],a:0,e:"库验证演绎关系，不代替实验与领域解释。"}
    ]),

    "euclidean-vectors": deck("欧式空间与坐标向量","用三维坐标计算位移、相对运动与合力，并识别坐标选择背后的几何不变量。",12,[
      {id:"ev-type",level:1,concept:"euclidean-space",p:"质点相对原点的位置为 r=(1,2,2) m。它到原点的距离是多少？",c:"‖r‖ = √(1²+2²+2²)",o:["3 m","5 m","9 m"],a:0,e:"欧式范数为 √9=3 m。"},
      {id:"ev-zero",level:1,concept:"euclidean-space",p:"机器人从 A 出发依次位移 (2,0,0)、(0,3,0)、(−2,−3,0) m。总位移是？",c:"Σ Δr",o:["(0,0,0) m","(4,6,0) m","(0,0,1) m"],a:0,e:"三个坐标逐项相加后全部抵消。"},
      {id:"ev-add",level:1,concept:"euclidean-space",p:"飞机相对空气速度 (100,0,0) m/s，风速 (0,20,0) m/s。对地速度是？",c:"v_ground = v_air + v_wind",o:["(100,20,0) m/s","(100,0,20) m/s","(80,0,0) m/s"],a:0,e:"同一参考系中的速度按向量叠加。"},
      {id:"ev-ext",level:2,concept:"euclidean-space",p:"两次实验给出的力向量三个坐标分别相同。可得什么物理结论？",c:"∀ i∈{x,y,z}, F₁ᵢ = F₂ᵢ",o:["在该基底下 F₁=F₂","只有大小相同，方向可不同","只能推出合力为零"],a:0,e:"三维向量由全部坐标唯一确定。"},
      {id:"ev-smul",level:2,concept:"euclidean-space",p:"把力 F=(2,−1,0) N 放大 3 倍，得到？",c:"3F",o:["(6,−3,0) N","(5,2,3) N","(6,1,0) N"],a:0,e:"标量乘法逐坐标缩放，方向在正系数下保持。"},
      {id:"ev-euclidean",level:2,concept:"euclidean-space",p:"把实验坐标系绕原点旋转后，同一速度向量的坐标改变。哪一个量保持不变？",c:"orthonormal frame change",o:["速率 ‖v‖","每个坐标分量","位置向量与原点的表示"],a:0,e:"正交变换保持内积与范数。"},
      {id:"ev-finite",level:3,concept:"statics-scope",p:"本章在三维中用 r×F 表示力矩。若推广到四维，首先不能原样保留什么？",c:"cross product",o:["同型的三维叉积公式","向量加法","内积与范数"],a:0,e:"三维叉积依赖特殊维数结构；一般维数通常改用外代数或反对称张量。"},
      {id:"ev-basis",level:3,concept:"euclidean-space",p:"力 F=(3,4,0) N 在 x、y 方向的分量已知。其大小与单位方向分别是？",c:"‖F‖, F/‖F‖",o:["5 N 与 (3/5,4/5,0)","7 N 与 (3,4,0)","25 N 与 (4/5,3/5,0)"],a:0,e:"范数为 5，除以范数得到无量纲单位方向。"},
      {id:"ev-point",level:3,concept:"affine-space",p:"把参考原点整体平移 a 后，两个质点间位移 q−p 怎样变化？",c:"(q+a) − (p+a)",o:["保持 q−p 不变","增加 a","变成 p−q"],a:0,e:"共同平移相消，位移是与原点选择无关的自由向量。"}
    ]),

    "inner-metric": deck("内积、范数与距离","从功、投影、距离和能量中掌握欧式内积及其正定性。",14,[
      {id:"im-dot",level:1,concept:"dot-metric",p:"恒力 F=(3,4,0) N 使物体位移 d=(2,0,0) m，做功是多少？",c:"W = F·d",o:["6 J","14 J","10 J"],a:0,e:"点积为 3×2+4×0=6。"},
      {id:"im-orth",level:1,concept:"dot-metric",p:"物块水平滑动，理想水平地面对它的支持力竖直。支持力做功是多少？",c:"N ⟂ Δr",o:["0","N·‖Δr‖","−N·‖Δr‖"],a:0,e:"力与位移正交，点积为零。"},
      {id:"im-distance",level:1,concept:"dot-metric",p:"两质点坐标为 p=(1,1,0) m、q=(4,5,0) m，它们相距？",c:"‖q-p‖ = ‖(3,4,0)‖",o:["5 m","7 m","25 m"],a:0,e:"位移范数为 √(3²+4²)=5 m。"},
      {id:"im-sym",level:2,concept:"dot-metric",p:"计算功时 F·d 与 d·F 数值相同，但物理角色是否因此相同？",c:"F·d = d·F",o:["数值相同；力和位移的物理角色仍不同","角色也完全相同","交换后变成力矩"],a:0,e:"实内积对称，不会抹去两个输入的物理语义。"},
      {id:"im-positive",level:2,concept:"dot-metric",p:"质量 m>0 的质点动能 K=1/2 m(v·v) 为零，可推出？",c:"K = 0",o:["v=0","v 与任意力正交","m=0"],a:0,e:"m>0 且内积正定，所以 v·v=0 仅在 v=0 时发生。"},
      {id:"im-cauchy",level:2,concept:"dot-metric",p:"给定力大小 10 N、位移大小 2 m，常力功的绝对值最大为？",c:"|F·d| ≤ ‖F‖‖d‖",o:["20 J","12 J","5 J"],a:0,e:"Cauchy–Schwarz 给出上界；平行或反平行时取到。"},
      {id:"im-normsq",level:3,concept:"dot-metric",p:"速度 v=(vₓ,vᵧ,v_z) 的动能为何常先写成 1/2 m(vₓ²+vᵧ²+v_z²)？",c:"v·v",o:["避免平方根并直接得到二次能量形式","因为速度没有方向","因为范数可以为负"],a:0,e:"平方范数是多项式且正定，正好进入动能。"},
      {id:"im-degenerate",level:3,concept:"dot-metric",p:"若所谓“动能度量”允许非零 v 满足 v·v=0，会破坏哪条物理推论？",c:"non-positive metric",o:["零动能推出静止","正交力不做功","位移可首尾相接"],a:0,e:"正定性排除了非零零长度方向。"},
      {id:"im-library",level:3,concept:"library-statics",p:"把速度坐标从一个正交标架旋转到另一个标架，动能 1/2 m‖v‖² 如何？",c:"v' = Qv, QᵀQ=I",o:["保持不变","乘以 det Q","变成向量"],a:0,e:"正交变换保持内积，因此物理动能与坐标选择无关。"}
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

    "applied-force": deck("力与作用点","用作用线和等效载荷计算集中力的平动与转动效应。",16,[
      {id:"af-fields",level:1,concept:"force-vector",p:"力 F=(0,10,0) N 作用在 P=(2,0,0) m。关于原点的力矩是？",c:"M_O = P×F",o:["(0,0,20) N·m","(0,20,0) N·m","(0,0,10) N·m"],a:0,e:"eₓ×eᵧ=e_z，大小为 2×10。"},
      {id:"af-free",level:1,concept:"force-vector",p:"若只关心质点平动，力通常可视为什么？",c:"F",o:["自由向量","空间点","无量纲数"],a:0,e:"刚体转动问题还必须保留作用点。"},
      {id:"af-line",level:1,concept:"force-vector",p:"沿自身作用线平移力的作用点，关于任一点的力矩如何？",c:"(r+tF)×F",o:["不变","增加 tF","变为零且仅当 t=0"],a:0,e:"F×F=0，所以沿作用线的附加项消失。"},
      {id:"af-newton",level:2,concept:"force-vector",p:"力向量的量纲来自？",c:"F = ma",o:["MLT⁻²","ML²T⁻²","LT⁻¹"],a:0,e:"质量乘加速度。"},
      {id:"af-neg",level:2,concept:"force-vector",p:"-F 表示什么？",c:"vector negation",o:["大小相同方向相反的力向量","负质量","删除作用点"],a:0,e:"作用点需要另行指定。"},
      {id:"af-structure",level:2,concept:"force-vector",p:"长度 L 的梁承受均匀向下载荷 w。若只研究整体平衡，其等效集中力是？",c:"distributed load w on [0,L]",o:["大小 wL，作用在中点 L/2","大小 w，作用在端点","大小 wL²，作用在中点"],a:0,e:"积分得到总载荷 wL；均匀分布的形心在中点。"},
      {id:"af-equivalent",level:3,concept:"moment-origin",p:"两个集中力对刚体静力等效通常需什么相同？",c:"wrench",o:["合力与关于同一点的力矩","仅大小","仅作用点"],a:0,e:"这对有限刚体的平动和转动效应都相同。"},
      {id:"af-distributed",level:3,concept:"statics-scope",p:"分布载荷能否直接当作一个 AppliedForce 而不作假设？",c:"distributed load",o:["不能；需积分或先证明等效合力与作用点","能；任何函数都是集中力","只能在一维能"],a:0,e:"本章仅用已等效化的有限集中力。"},
      {id:"af-contact",level:3,concept:"statics-scope",p:"带库仑摩擦的接触反力为什么不在基础模型中自动解决？",c:"friction cone",o:["它含不等式、接触状态与互补条件","叉积不能计算","摩擦没有量纲"],a:0,e:"这里只处理已知线性约束方向的反力。"}
    ]),

    "force-system": deck("力系与合力","通过多力叠加、力偶与子系统合并理解有限力系。",16,[
      {id:"fs-empty",level:1,concept:"force-system",p:"空力系的合力应定义为？",c:"resultant []",o:["0","1","undefined"],a:0,e:"零向量是力叠加的单位元。"},
      {id:"fs-cons",level:1,concept:"force-system",p:"三力分别为 (4,0,0)、(−1,3,0)、(0,−2,0) N，合力是？",c:"R = ΣFᵢ",o:["(3,1,0) N","(5,5,0) N","(3,−5,0) N"],a:0,e:"逐坐标求和得到 (4−1,3−2,0)。"},
      {id:"fs-pair",level:1,concept:"force-system",p:"F 与 -F 两力的合力是？",c:"F + (-F)",o:["0","2F","F"],a:0,e:"向量相消。"},
      {id:"fs-append",level:2,concept:"force-system",p:"机翼左半部分载荷合力为 R_L=(0,5,−20) kN，右半部分为 R_R=(0,−5,−20) kN。整机翼合力是？",c:"R = R_L + R_R",o:["(0,0,−40) kN","(0,10,0) kN","(0,0,0) kN"],a:0,e:"对子系统先求合力再相加，与逐个叠加等价。"},
      {id:"fs-order",level:2,concept:"force-system",p:"交换列表中两项会改变合力吗？",c:"F₁+F₂",o:["不会，因为向量加法交换","会，因为 List 有顺序","只改变单位"],a:0,e:"存储有顺序，合力的数学值与顺序无关。"},
      {id:"fs-zeroR",level:2,concept:"force-system",p:"合力为零是否足以保证刚体平衡？",c:"resultant S = 0",o:["不够，还需总力矩为零","足够","只需再检查质量"],a:0,e:"力偶正是合力零但仍有转动效应的例子。"},
      {id:"fs-reduce",level:3,concept:"moment-origin",p:"一般三维力系关于点 O 的静力信息可归约为何？",c:"force-couple system",o:["合力 R 与总力矩 M_O","单个力大小","三个单位符号"],a:0,e:"也称力—力偶或 wrench 表示。"},
      {id:"fs-semantic",level:3,concept:"force-system",p:"List AppliedForce 是否编码刚体形状和接触几何？",c:"data model",o:["没有；它只记录外力数据","完整编码","只要列表足够长就编码"],a:0,e:"系统边界与几何可作为更高层结构添加。"},
      {id:"fs-induction",level:3,concept:"force-system",p:"一个力系分成三个子系统，合力依次为 R₁、R₂、R₃。先合并哪两个会影响最终合力吗？",c:"(R₁+R₂)+R₃ = R₁+(R₂+R₃)",o:["不影响；向量加法结合","影响；力必须按时间排序","只在三个合力共线时不影响"],a:0,e:"有限叠加的分组不改变结果，这使复杂装配可模块化求合力。"}
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
      {id:"ms-proof",level:2,concept:"moment-origin",p:"已知 R=(0,10,0) N、M_O=(0,0,30) N·m，且 Q−O=(2,0,0) m。M_Q 是？",c:"M_Q = M_O − (Q−O)×R",o:["(0,0,10) N·m","(0,0,50) N·m","(0,20,30) N·m"],a:0,e:"(Q−O)×R=(0,0,20)，故 M_Q=(0,0,10)。"},
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
      {id:"ei-positive",level:2,concept:"dot-metric",p:"若合力 R≠0，选择虚平移速度 v=R、虚角速度 ω=0，会测得怎样的虚功率？",c:"P(R,0)=R·R",o:["严格为正，因此不可能满足所有虚功率为零","恒为零","等于总力矩大小"],a:0,e:"欧式内积正定，所以 R≠0 时 R·R>0。"},
      {id:"ei-six",level:2,concept:"rigid-virtual-motion",p:"“对所有 v,ω”与六个基方向测试的关系是？",c:"linearity",o:["在线性模型中等价","六个测试永远不够","只需一个随机方向"],a:0,e:"线性泛函在基上为零即处处为零。"},
      {id:"ei-constraints",level:3,concept:"virtual-work",p:"有约束时只对许可虚运动功率为零，能否仍推出全部 R=M=0？",c:"admissible subspace",o:["一般不能，只能推出载荷泛函在许可子空间上为零","总能","只推出 R=M"],a:0,e:"约束反力可位于许可子空间的正交补。"},
      {id:"ei-origin",level:3,concept:"moment-origin",p:"虚功率表达式换参考点时，平动速度应如何配套变换？",c:"rigid twist",o:["按刚体运动学调整，物理功率保持不变","不需任何处理","把点积换成叉积"],a:0,e:"本课程在固定参考点陈述定理，避免隐藏坐标变换。"},
      {id:"ei-theorem",level:3,concept:"rigid-virtual-motion",p:"某力系 R=(1,0,0) N、M=(0,0,2) N·m。哪组虚运动最直接证明它不平衡？",c:"P(v,ω)=R·v+M·ω",o:["v=(1,0,0), ω=(0,0,0)","v=(0,1,0), ω=(1,0,0)","v=(0,0,0), ω=(1,0,0)"],a:0,e:"第一组给 P=1 W（按虚速度量纲解释），已足以否定对所有虚运动功率为零。"}
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

    determinacy: deck("静定与超静定","用梁与多支座实例分析反力唯一性、秩退化和自应力。",22,[
      {id:"dt-unique",level:1,concept:"static-determinacy",p:"简支梁在单个竖直载荷下有 R_A、R_B 两个未知量，并由竖直合力与取矩两式唯一解出。它属于？",c:"R_A+R_B=P, R_B L=Pa, L>0",o:["静定","超静定","机构"],a:0,e:"给定载荷后反力存在且唯一。"},
      {id:"dt-hyper",level:1,concept:"static-determinacy",p:"刚性水平杆由三个竖直支座承托，只用竖直合力与一个平面力矩方程。通常会怎样？",c:"3 reactions / 2 equilibrium equations",o:["反力不能仅靠平衡唯一确定，属于一次超静定","必然无解","三反力必相等"],a:0,e:"还需支座变形与杆的刚度兼容关系。"},
      {id:"dt-kernel",level:1,concept:"self-stress",p:"三个支座位于 x=0,1,2。反力增量 k=(1,−2,1) 满足什么？",c:"Σkᵢ=0, Σxᵢkᵢ=0",o:["不改变合力与合矩，是自应力方向","增加 4 个单位合力","只改变外载荷"],a:0,e:"1−2+1=0，且 0−2+2=0。"},
      {id:"dt-addk",level:2,concept:"self-stress",p:"若三支座反力 r₀ 已平衡外载荷，则 r₀+t(1,−2,1) 对任意 t 的平衡残差怎样？",c:"A(r₀+tk)+load",o:["仍为零，但接触可行性可能限制 t","随 t 线性增大且必非零","只在 t=1 时为零"],a:0,e:"Ak=0 保持外部平衡；各反力非负等条件仍需检查。"},
      {id:"dt-inj",level:2,concept:"static-determinacy",p:"平面悬臂梁固定端提供水平力、竖直力和约束力矩三个未知量；一般载荷下三个平衡分量可唯一确定它们。关键是？",c:"reaction → (ΣFₓ,ΣFᵧ,ΣM)",o:["反力到平衡残差的映射没有非零核","载荷总为零","固定端不传递力矩"],a:0,e:"无非零自平衡反力增量意味着已有解是唯一的。"},
      {id:"dt-count",level:2,concept:"static-determinacy",p:"三个未知拉力、三个平衡方程，却有两根拉索方向完全相同。为何仍不能仅凭 3=3 判定静定？",c:"dependent force directions",o:["几何可能使平衡方程矩阵降秩","拉索没有力的量纲","三个方程一定互相矛盾"],a:0,e:"静定性取决于独立约束的秩，不只是数量。"},
      {id:"dt-inconsistent",level:3,concept:"static-determinacy",p:"若载荷不在 A 的像加可平衡范围内，会怎样？",c:"no solution",o:["没有平衡反力解","自动成为超静定","核自动非零"],a:0,e:"无解不是超静定，而是约束/载荷模型不相容。"},
      {id:"dt-compat",level:3,concept:"self-stress",p:"超静定结构为何要引入材料与变形？",c:"compatibility",o:["平衡只确定到核方向，兼容与本构补足条件","材料改变量纲","为了计算合力"],a:0,e:"这正是从刚体静力向弹性力学扩展的入口。"},
      {id:"dt-library",level:3,concept:"library-statics",p:"固定—铰支梁仅靠整体平衡不能唯一给出全部支反力。下一步最需要加入哪类物理关系？",c:"compatibility + constitutive law",o:["挠度协调条件与材料/截面刚度","更多单位换算","把所有反力设为相等"],a:0,e:"超静定问题由变形协调和本构关系选择核方向上的物理解。"}
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
      {id:"pt-gradient",level:2,concept:"conservative-potential",p:"一维弹簧 k=200 N/m，在 x=0.10 m 处的保守力是多少？",c:"V=1/2 kx², F=−dV/dx",o:["−20 N","+20 N","−2 N"],a:0,e:"F=−kx=−200×0.10 N，方向指向平衡点。"},
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

    "statics-physlib": deck("用 Mathlib 与 Physlib 承载静力学","把叉积、参考系、线性映射和梯度库结构用于具体静力模型。",24,[
      {id:"sp-cross",level:1,concept:"library-statics",p:"位置 r=(1,0,0) m，力 F=(0,0,−5) N。按右手系叉积，r×F 是？",c:"r ⨯₃ F",o:["(0,5,0) N·m","(0,−5,0) N·m","(−5,0,0) N·m"],a:0,e:"eₓ×e_z=−eᵧ，因此 eₓ×(−5e_z)=5eᵧ。"},
      {id:"sp-frame",level:1,concept:"library-statics",p:"参考系原点从 O 平移到 O'=O+a，同一空间点坐标怎样变化？",c:"r=P−O, r'=P−O'",o:["r'=r−a","r'=r+a","r'=r"],a:0,e:"点没动，原点平移会反向改变位置坐标；两点位移仍不变。"},
      {id:"sp-grad",level:1,concept:"library-statics",p:"二维势能 V(x,y)=1/2(kₓx²+kᵧy²) 对应的保守力是？",c:"F=−∇V",o:["(−kₓx,−kᵧy)","(kₓx,kᵧy)","(−kₓ,−kᵧ)"],a:0,e:"梯度逐方向给出势能变化率，负号使力指向降能方向。"},
      {id:"sp-check",level:2,concept:"moment-cross",p:"把库中的叉积定理用于力矩前，必须核对哪项物理约定？",c:"crossProduct / ⨯₃",o:["坐标顺序与右手取向","力是否为整数","列表是否按大小排序"],a:0,e:"错误取向会整体翻转力矩符号，即使类型完全正确。"},
      {id:"sp-kernel",level:2,concept:"self-stress",p:"自应力空间可直接写成？",c:"A : R →ₗ[ℝ] E",o:["LinearMap.ker A","Set.range A","Matrix.det R"],a:0,e:"核中元素映到零平衡残差。"},
      {id:"sp-dotzero",level:2,concept:"dot-metric",p:"合力 R=(2,0,0) N。选虚平移 v=(2,0,0) m/s 时，平动虚功率是多少？",c:"R·v",o:["4 W","0 W","2 N·m"],a:0,e:"点积为 4；这一个测试方向就能否定自由刚体平衡。"},
      {id:"sp-gap",level:3,concept:"library-statics",p:"库已提供向量、叉积与梯度，但还没有完整 AppliedForce。应由课程的领域层补充什么？",c:"physics bridge",o:["作用点、力系、合力与合矩等物理定义","重新证明实数加法","用字符串代替向量"],a:0,e:"底层数学复用库，领域层负责明确系统边界与物理语义。"},
      {id:"sp-coordinate",level:3,concept:"affine-space",p:"正交变换 Q 同时作用于 r 和 F 后，力矩如何变换？",c:"(Qr)×(QF), det Q=1",o:["等于 Q(r×F)，物理力矩随标架协变","保持每个坐标分量不变","必变为零"],a:0,e:"正向正交变换保持叉积结构；坐标变了，几何关系不变。"},
      {id:"sp-boundary",level:3,concept:"statics-scope",p:"库中有 gradient 是否就自动获得一般稳定性定理？",c:"API reuse",o:["不会，还需势能正则性、约束、局部极小等假设","会","只需 import Mathlib"],a:0,e:"复用计算规则不等于省略物理假设。"}
    ]),

    practice: deck("单位与量纲综合实验","从实际数据出发完成换算、公式反推与量纲审查的分层随机组卷。",30,[
      {id:"p-si",level:1,concept:"derived-dimension",p:"300 N 的力作用在 0.020 m² 面积上，平均压强为？",c:"p=F/A",o:["15 kPa","6 Pa","150 kPa"],a:0,e:"300/0.020=15000 Pa=15 kPa。"},
      {id:"p-speed",level:1,concept:"derived-dimension",p:"质点在 4 s 内位移 12 m，区间平均速度大小是？",c:"v_avg=Δx/Δt",o:["3 m/s","48 m/s","0.33 m/s"],a:0,e:"12/4=3，量纲为 LT⁻¹。"},
      {id:"p-zero-vector",level:1,concept:"dimensionless",p:"飞行器速度 340 m/s，当地声速也是 340 m/s。马赫数是？",c:"Ma=v/c",o:["1，无量纲","1 m/s","115600，有速度平方量纲"],a:0,e:"同类速度相除得到无量纲相似参数。"},
      {id:"p-force",level:1,concept:"derived-dimension",p:"1200 kg 的汽车获得 2 m/s² 加速度，需要的合力是？",c:"F=ma",o:["2400 N","600 N","2400 J"],a:0,e:"1200×2=2400，kg·m·s⁻²=N。"},
      {id:"p-mul",level:2,concept:"dimension-algebra",p:"物体比动能 E/m 的量纲是什么？",c:"[E]/[m]",o:["L²T⁻²，与速度平方相同","ML²T⁻²","LT⁻¹"],a:0,e:"能量除以质量消去 M。"},
      {id:"p-km2",level:2,concept:"scale-conversion",p:"2 km² 等于多少 m²？",c:"2*(1000)^2",o:["2×10⁶","2×10³","2×10⁹"],a:0,e:"面积因子平方。"},
      {id:"p-add",level:2,concept:"typed-operations",p:"能量 E=10 J、功率 P=5 W。哪一式量纲不合法？",c:"E : energy, P : energy/time",o:["E+P","E/P","P·2 s"],a:0,e:"能量与功率不能直接相加；E/P 是时间，P·t 是能量。"},
      {id:"p-temp",level:2,concept:"affine-unit",p:"20 ℃ 与 10 ℃ 之差是多少 K？",c:"ΔT",o:["10 K","283.15 K","−263.15 K"],a:0,e:"温差不使用 273.15 平移。"},
      {id:"p-kinetic",level:3,concept:"homogeneity",p:"1/2 mv² 中 1/2 对量纲有什么影响？",c:"K = 1/2 m v²",o:["无影响；它是无量纲常数","把能量变成一半量纲","增加时间指数"],a:0,e:"无量纲数值系数不改变量纲。"},
      {id:"p-sqrt",level:3,concept:"rational-exponent",p:"√(m/k) 可得到时间量纲的关键是？",c:"[m/k]",o:["m/k 的量纲为 T²","m/k 无量纲","平方根删除所有指数"],a:0,e:"指数 2 除以 2 得 1。"},
      {id:"p-limit",level:3,concept:"model-boundary",p:"量纲正确能否证明公式的数值系数正确？",c:"x = C v t",o:["不能；C 是无量纲系数","能；C 必为 1","只有 SI 能"],a:0,e:"还需要动力学推导、边界条件或实验。"},
      {id:"p-physlib",level:3,concept:"physlib-withdim",p:"用 Physlib 已知 1 km/h=5/18 m/s。108 km/h 的风速应化为？",c:"108·5/18",o:["30 m/s","60 m/s","108 m/s"],a:0,e:"精确单位定理与实数算术结合得到 30 m/s。"}
    ],6),

    "statics-practice": deck("欧式静力学综合实验","跨越向量、力矩、平衡、静定性、虚功与势能稳定性的分层随机组卷。",35,[
      {id:"stp-vec",level:1,concept:"euclidean-space",p:"物体依次位移 (1,2,0) m 与 (2,−2,0) m，总位移是？",c:"Δr₁+Δr₂",o:["(3,0,0) m","(3,4,0) m","(1,−4,0) m"],a:0,e:"位移向量逐坐标相加。"},
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

    daily: deck("物理学形式化练习场","每日从已学习路线抽取物理计算、建模判据与边界检查。",5,[
      {id:"daily-seven",level:1,concept:"si-seven",p:"4 A 恒定电流持续 5 s，输运电荷是多少？",c:"Q=It",o:["20 C","0.8 C","20 V"],a:0,e:"A·s=C，数值为 4×5。"},
      {id:"daily-energy",level:1,concept:"derived-dimension",p:"12 N 恒力沿其方向推动 2.5 m，做功为？",c:"W=Fs",o:["30 J","4.8 J","30 W"],a:0,e:"12×2.5=30，N·m=J。"},
      {id:"daily-charge",level:1,concept:"derived-dimension",p:"0.5 A 电流持续 2 min，电荷量是多少？",c:"Q=IΔt",o:["60 C","1 C","240 C"],a:0,e:"2 min=120 s，0.5×120=60 C。"},
      {id:"daily-dimless",level:1,concept:"dimensionless",p:"1.0 m 杆伸长 0.5 mm，应变是多少？",c:"ε=ΔL/L",o:["5×10⁻⁴","0.5 m","2×10³"],a:0,e:"0.5 mm=5×10⁻⁴ m，同类长度相除。"},
      {id:"daily-op",level:2,concept:"dimension-algebra",p:"振动周期为 0.25 s，对应频率是多少？",c:"f=1/T",o:["4 Hz","0.25 Hz","2 Hz"],a:0,e:"频率是时间量纲的倒数。"},
      {id:"daily-celsius",level:2,concept:"affine-unit",p:"25 ℃ 的绝对温度是多少？",c:"25+273.15",o:["298.15 K","25 K","248.15 K"],a:0,e:"绝对温度换算包含零点平移。"},
      {id:"daily-safe",level:2,concept:"typed-quantity",p:"跑者 20 s 内完成 100 m 直线位移，平均速度大小为？",c:"v_avg=Δx/Δt",o:["5 m/s","2000 m/s","0.2 m/s"],a:0,e:"长度除以时间得到速度，100/20=5。"},
      {id:"daily-area",level:2,concept:"scale-conversion",p:"500 N 作用在 100 cm² 平板上，平均压强为？",c:"100 cm²=0.01 m²",o:["50 kPa","5 Pa","500 kPa"],a:0,e:"500/0.01=50000 Pa=50 kPa。"},
      {id:"daily-exp",level:3,concept:"homogeneity",p:"衰减模型 e^(−t/τ) 中 t=10 s、τ=5 s，指数是多少？",c:"−t/τ",o:["−2（无量纲）","−2 s","−0.5 s⁻¹"],a:0,e:"两个时间相除后量纲抵消。"},
      {id:"daily-torque",level:3,concept:"model-boundary",p:"20 N 垂直作用在 0.30 m 力臂上得到 6 N·m。仅凭单位能否称其为 6 J 的功？",c:"torque vs work",o:["不能；还需判断叉积力矩还是点积功","能；N·m 总是功","只有静止时能"],a:0,e:"力矩与功同量纲，但几何配对和物理语义不同。"},
      {id:"daily-root",level:3,concept:"rational-exponent",p:"弦张力 100 N、线密度 0.25 kg/m，波速 √(T/μ) 为？",c:"√(100/0.25)",o:["20 m/s","400 m/s","10 m/s"],a:0,e:"T/μ=400 m²/s²，开方得 20 m/s。"},
      {id:"daily-kmh",level:3,concept:"physlib-withdim",p:"54 km/h 换成 SI 速度是多少？",c:"54·5/18",o:["15 m/s","30 m/s","54 m/s"],a:0,e:"使用精确换算因子 5/18。"},
      {id:"daily-vec3",level:1,concept:"euclidean-space",p:"速度 v=(3,4,0) m/s 的速率是？",c:"‖v‖",o:["5 m/s","7 m/s","25 m/s"],a:0,e:"欧式范数为 √(3²+4²)=5。"},
      {id:"daily-dot",level:1,concept:"dot-metric",p:"50 N 竖直支持力作用于水平位移 3 m，做功为？",c:"N·d",o:["0 J","150 J","−150 J"],a:0,e:"两向量正交，点积为零。"},
      {id:"daily-force",level:1,concept:"force-vector",p:"15 N 的力垂直作用在距门轴 0.8 m 处，力矩大小为？",c:"M=rF",o:["12 N·m","18.75 N·m","15 N"],a:0,e:"垂直时 sinθ=1，0.8×15=12。"},
      {id:"daily-moment",level:1,concept:"moment-cross",p:"r=(2,0,0) m、F=(0,4,0) N，关于原点的力矩是？",c:"r×F",o:["(0,0,8) N·m","(0,8,0) N·m","8 J 的标量"],a:0,e:"eₓ×eᵧ=e_z。"},
      {id:"daily-shift",level:2,concept:"moment-origin",p:"M_O=10 e_z N·m、R=5 e_y N，且 Q−O=1 e_x m。M_Q 是？",c:"M_Q=M_O−(Q−O)×R",o:["5 e_z N·m","15 e_z N·m","10 e_y N·m"],a:0,e:"修正项为 5e_z，所以新力矩为 5e_z。"},
      {id:"daily-balance",level:2,concept:"equilibrium-balance",p:"两力大小相等、方向相反且作用在同一直线上。它们对刚体产生？",c:"F and −F, same line",o:["合力和合矩都为零","合力为零但必有力偶矩","合矩为零但合力非零"],a:0,e:"共线反向力既相消合力，也不形成非零力偶。"},
      {id:"daily-beam",level:2,concept:"reactions",p:"跨长 4 m 的简支梁承受 1000 N 载荷，载荷距 A 为 1 m。R_B 是？",c:"R_B·4=1000·1",o:["250 N","750 N","1000 N"],a:0,e:"关于 A 取矩，R_B=1000/4=250 N。"},
      {id:"daily-unique",level:2,concept:"static-determinacy",p:"刚性杆由三个竖直支座承托，只有合力与平面力矩两式。仅靠静力平衡通常属于？",c:"3 unknown reactions / 2 equations",o:["超静定","静定","必定无解"],a:0,e:"反力通常有一个自应力自由度。"},
      {id:"daily-virtual",level:3,concept:"rigid-virtual-motion",p:"R=(0,3,0) N。取 v=R、ω=0 时虚功率为？",c:"R·v+M·ω",o:["9 W","0 W","3 N·m"],a:0,e:"R·R=9>0，因此该力系不是自由刚体平衡。"},
      {id:"daily-potential",level:3,concept:"conservative-potential",p:"弹簧 k=50 N/m，在 x=0.20 m 处的恢复力是？",c:"F=−kx",o:["−10 N","+10 N","−2.5 N"],a:0,e:"负号表示指向平衡位置。"},
      {id:"daily-selfstress",level:3,concept:"self-stress",p:"三个等距支座的反力增量 (1,−2,1) 同时满足合力与合矩为零，说明它是？",c:"Ak=0",o:["自应力方向","外载荷方向","刚体平移"],a:0,e:"沿该方向改变反力不改变整体平衡。"},
      {id:"daily-stability",level:3,concept:"stability-energy",p:"二维势能 V=1/2(kₓx²+kᵧy²)，kₓ>0、kᵧ=0。二阶判据给出？",c:"semidefinite stiffness",o:["存在零模，不能仅凭二阶项断言严格稳定","严格稳定","严格不稳定"],a:0,e:"y 方向是平坦零模，需要高阶项或约束继续分析。"}
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

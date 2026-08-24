/* LeanPath Physics question bank: original adaptations of workshop notes, Mathlib and Physlib. */
(function () {
  const concepts = {
    "phys-real": {title:"连续物理量通常从 ℝ 开始",body:"位移、时间和速度在经典连续模型中常表示为实数。Float 适合近似计算；ℝ 更适合陈述和证明精确等式。",code:"variable (x t v : ℝ)\n#check x + v * t\n-- x + v * t : ℝ"},
    "phys-model": {title:"公式首先是一个模型",body:"Lean 会检查结论是否由写下的定义与假设推出，但不会替你判断这些假设是否正确描述现实。形式化时要把对象、条件和适用范围一起写清楚。",code:"def position (x₀ v t : ℝ) : ℝ := x₀ + v * t\n-- 这描述一维匀速模型，而不是所有运动"},
    "phys-dimension": {title:"用指数向量表示量纲",body:"一个量纲可以记录各基本量纲的整数指数。例如速度是 L¹T⁻¹，加速度是 L¹T⁻²。乘法对应指数相加，除法对应指数相减。",code:"inductive BaseDimension where | mass | length | time\nabbrev Dimension := BaseDimension → Int\n-- speed = length¹ · time⁻¹"},
    "phys-typed-quantity": {title:"让量纲进入类型",body:"若 Quantity 以量纲 d 为类型参数，那么加法可以只接受两个 Quantity d。米与秒相加会在编译阶段被拒绝，而不是运行后才发现。",code:"structure Quantity (d : Dimension) where\n  value : ℝ\n\ndef add (x y : Quantity d) : Quantity d :=\n  ⟨x.value + y.value⟩"},
    "phys-unit": {title:"单位与量纲不是一回事",body:"m/s 与 km/h 有相同的速度量纲，但数值尺度不同。可靠的形式化模型会同时记录量纲兼容性和单位到 SI 的换算。",code:"36 km/h = 36 * 1000 / 3600 m/s = 10 m/s"},
    "phys-dimensionless": {title:"无量纲量仍然有语义",body:"量纲指数全为零的量称为无量纲量。比例、计数和弧度常落在这里，但同为无量纲并不代表物理意义完全相同。",code:"-- L⁰ M⁰ T⁰\nReynoldsNumber : Dimensionless\nangleRadians    : Dimensionless"},
    "phys-function": {title:"把状态写成时间的函数",body:"轨迹是从时间到状态的函数。先学习 ℝ → ℝ 的一维模型，后续可以把输出替换为向量、相空间或更一般的状态类型。",code:"def trajectory (x₀ v : ℝ) : ℝ → ℝ :=\n  fun t => x₀ + v * t"},
    "phys-assumption": {title:"假设也是定理输入",body:"质量为正、半径非零、时间范围有效等条件都应成为显式参数。Lean 只允许在已经拥有相应证明时使用除法、平方根等定理。",code:"theorem example (m r : ℝ)\n    (hm : 0 < m) (hr : 0 < r) : ... := by\n  ..."},
    "phys-ring": {title:"ring 处理多项式恒等式",body:"很多初等物理公式的代数部分可归约为交换环恒等式。ring 会规范化两边；它不会自动补充物理假设，也不负责微分方程本身。",code:"example (a b : ℝ) : (a + b)^2 = a^2 + 2*a*b + b^2 := by\n  ring"},
    "phys-positivity": {title:"正性条件驱动安全推理",body:"positivity 能组合已知的非负或正值事实。它常用于质量、半径、能量和平方根，但前提必须已经出现在上下文中。",code:"example (m v : ℝ) (hm : 0 ≤ m) :\n    0 ≤ m * v^2 := by\n  positivity"},
    "phys-conservation": {title:"守恒律需要系统边界",body:"守恒量并非只是一条代数等式。形式化陈述还要说明系统、相互作用和外力等条件；Lean 检查的是这些条件下的推导。",code:"hclosed : NoExternalImpulse system interval\n⊢ momentum system t₁ = momentum system t₂"},
    "phys-physlib": {title:"Physlib：按物理领域组织的 Lean 库",body:"Physlib 在 Mathlib 之上提供单位、经典力学、相对论、量子力学等模块。先用 #check 阅读签名，再把库定理实例化到当前模型。",code:"import Physlib\n#check DimSpeed.oneKilometerPerHour_in_SI\n#check ClassicalMechanics.HarmonicOscillator.ω_sq"},
    "phys-namespace": {title:"用命名空间定位物理定理",body:"大型库用命名空间避免速度、能量等常见名称冲突。#check 完整限定名是阅读和调用陌生定理最可靠的第一步。",code:"#check ClassicalMechanics.VisViva.speedCircular_sq\n-- 先确认参数、假设和结论"}
  };

  const decks = {
    quantities:{label:"物理量与类型",desc:"先区分数值、物理语义与 Lean 类型，再把一维经典物理写成可检查表达式。",xp:10,draw:6,mix:[2,2,2],questions:[
      {id:"q-real-type",level:1,concept:"phys-real",p:"在精确的经典力学定理中，位移 x 通常先声明为什么类型？",c:"variable (x : ___)",o:["ℝ","Float","String"],a:0,e:"ℝ 是实数类型，适合陈述精确等式与不等式。"},
      {id:"q-prop-eq",level:1,concept:"phys-model",p:"表达式 x = x₀ + v * t 在 Lean 中属于什么？",c:"variable (x x₀ v t : ℝ)\n#check x = x₀ + v * t",o:["Prop","Bool","ℝ"],a:0,e:"等式是一条命题，证明则是该 Prop 的一个项。"},
      {id:"q-check-value",level:1,concept:"phys-real",p:"哪条命令只查看重力加速度数值的类型？",c:"___ (9.81 : ℝ)",o:["#check","#eval","theorem"],a:0,e:"#check 报告类型而不执行数值近似计算。"},
      {id:"q-position-result",level:2,concept:"phys-function",p:"这个位置函数的返回类型是什么？",c:"def position (x₀ v t : ℝ) := x₀ + v * t",o:["ℝ","ℝ → ℝ","Prop"],a:0,e:"三个参数都已给出时，右侧计算出一个实数位置。"},
      {id:"q-trajectory-type",level:2,concept:"phys-function",p:"一维轨迹“输入时间，输出位置”的类型应写成什么？",c:"#check ___",o:["ℝ → ℝ","ℝ × ℝ","ℝ = ℝ"],a:0,e:"轨迹把每个实数时间映到一个实数位置。"},
      {id:"q-float-vs-real",level:2,concept:"phys-real",p:"为什么证明公式时通常不直接用 Float 代替 ℝ？",c:"-- 目标：证明任意变量下的精确恒等式",o:["Float 是有限精度计算类型，ℝ 更适合精确定理","Float 不能表示任何小数","ℝ 只能表示整数"],a:0,e:"Float 服务于计算近似；ℝ 支持数学上的实数推理。"},
      {id:"q-raw-real-limit",level:3,concept:"phys-typed-quantity",p:"若 distance 与 time 都只声明为 ℝ，Lean 能自动阻止 distance + time 吗？",c:"variable (distance time : ℝ)\n#check distance + time",o:["不能；两者类型相同，必须另行编码量纲","能；变量名会告诉 Lean 物理意义","能；ℝ 自带 SI 单位"],a:0,e:"变量名和注释不参与类型检查；量纲需要进入数据或类型。"},
      {id:"q-curried-model",level:3,concept:"phys-function",p:"position 的完整函数类型如何结合？",c:"def position (x₀ v t : ℝ) : ℝ := x₀ + v * t\n#check position",o:["ℝ → ℝ → ℝ → ℝ","(ℝ × ℝ × ℝ) → ℝ","ℝ → (ℝ × ℝ)"],a:0,e:"Lean 的多参数函数经过柯里化，箭头向右结合。"},
      {id:"q-model-scope",level:3,concept:"phys-model",p:"Lean 接受 position x₀ v t = x₀ + v*t 能说明什么？",c:"def position (x₀ v t : ℝ) := x₀ + v * t\nexample : position x₀ v t = x₀ + v*t := by rfl",o:["该结论由当前定义推出，不等于模型已获实验证实","所有真实物体都严格匀速","变量已经自动带有 SI 单位"],a:0,e:"内核验证推导；模型选择与经验有效性仍需物理论证。"}
    ]},

    dimensions:{label:"基本量纲",desc:"把质量、长度、时间组织成指数向量，并理解量纲乘除与类型安全加法。",xp:10,draw:6,mix:[2,2,2],questions:[
      {id:"d-base-inductive",level:1,concept:"phys-dimension",p:"哪个声明枚举了质量、长度、时间三个基本量纲？",c:"___ BaseDimension where\n  | mass | length | time",o:["inductive","theorem","instance"],a:0,e:"inductive 用构造器列出这一类型的全部基本情形。"},
      {id:"d-speed-exp",level:1,concept:"phys-dimension",p:"速度 L/T 的时间指数是多少？",c:"speed = L¹ · T___",o:["⁻¹","¹","²"],a:0,e:"除以时间对应时间指数 −1。"},
      {id:"d-acc-exp",level:1,concept:"phys-dimension",p:"加速度的量纲是什么？",c:"acceleration = speed / time",o:["L¹T⁻²","L¹T⁻¹","M¹L¹T⁻²"],a:0,e:"速度再除以一次时间，得到 L¹T⁻²。"},
      {id:"d-dimension-type",level:2,concept:"phys-dimension",p:"若量纲记录每个基本量纲的整数指数，Dimension 可定义为什么？",c:"abbrev Dimension := ___",o:["BaseDimension → Int","List String","ℝ → Bool"],a:0,e:"函数为每个基本量纲返回对应指数。"},
      {id:"d-force",level:2,concept:"phys-dimension",p:"由 F = m a 推出力的量纲是什么？",c:"[F] = [m] [a]",o:["M¹L¹T⁻²","M¹L¹T⁻¹","L¹T⁻²"],a:0,e:"质量 M 乘加速度 LT⁻²，得到 MLT⁻²。"},
      {id:"d-multiply",level:2,concept:"phys-dimension",p:"两个物理量相乘时，量纲指数怎样组合？",c:"LᵃTᵇ · LᶜTᵈ",o:["对应指数相加","对应指数相乘","只保留左侧指数"],a:0,e:"相乘得到 Lᵃ⁺ᶜTᵇ⁺ᵈ。"},
      {id:"d-safe-add",level:3,concept:"phys-typed-quantity",p:"哪个 add 的类型会禁止“长度 + 时间”？",c:"structure Quantity (d : Dimension) where value : ℝ",o:["add : Quantity d → Quantity d → Quantity d","add : Quantity d₁ → Quantity d₂ → ℝ","add : ℝ → ℝ → ℝ"],a:0,e:"两个输入和输出共享同一量纲参数 d。"},
      {id:"d-speed-time",level:3,concept:"phys-typed-quantity",p:"类型安全乘法中，速度乘时间应得到什么量纲？",c:"Quantity speedDim → Quantity timeDim → Quantity ___",o:["lengthDim","speedDim","accelerationDim"],a:0,e:"(L/T)·T = L。"},
      {id:"d-naive-bug",level:3,concept:"phys-typed-quantity",p:"把 Quantity 简单定义为 ℝ × Dimension 有什么典型风险？",c:"abbrev Quantity := ℝ × Dimension",o:["若 add 不检查维度，米和秒仍可能相加","Lean 无法保存实数","任何乘法都会成为语法错误"],a:0,e:"仅把维度作为普通字段还不够，运算必须保持或检查不变量。"}
    ]},

    units:{label:"单位与换算",desc:"在相同量纲下处理不同尺度，建立 SI 换算与无量纲量的基本直觉。",xp:15,draw:6,mix:[2,2,2],questions:[
      {id:"u-kilometer",level:1,concept:"phys-unit",p:"1 千米等于多少米？",c:"1 km = ___ m",o:["1000","100","3600"],a:0,e:"kilo- 表示 10³。"},
      {id:"u-hour",level:1,concept:"phys-unit",p:"1 小时等于多少秒？",c:"1 h = ___ s",o:["3600","60","1000"],a:0,e:"1 h = 60 min，1 min = 60 s。"},
      {id:"u-same-dim",level:1,concept:"phys-unit",p:"m/s 与 km/h 的关系是什么？",c:"[m/s] ___ [km/h]",o:["量纲相同、尺度不同","量纲不同、尺度相同","都不是速度单位"],a:0,e:"两者都是速度量纲 L/T，但换算因子不同。"},
      {id:"u-36",level:2,concept:"phys-unit",p:"36 km/h 换算成 m/s 是多少？",c:"(36 : ℝ) * 1000 / 3600",o:["10","36","100"],a:0,e:"公里换米乘 1000，小时换秒除 3600。"},
      {id:"u-newton",level:2,concept:"phys-unit",p:"牛顿 N 的 SI 基本单位展开是什么？",c:"F = m a",o:["kg·m·s⁻²","kg·m·s⁻¹","m·s⁻²"],a:0,e:"由 F = ma 得 kg·m/s²。"},
      {id:"u-dimensionless",level:2,concept:"phys-dimensionless",p:"速度比 v/c 的量纲是什么？",c:"[v/c] = [v] / [c]",o:["无量纲","速度","时间"],a:0,e:"相同速度量纲相除，所有指数抵消。"},
      {id:"u-conversion-safety",level:3,concept:"phys-unit",p:"可靠的单位换算函数必须保持什么？",c:"convert : Quantity d unit₁ → Quantity ___ unit₂",o:["d","lengthDim","dimensionless"],a:0,e:"换算改变数值尺度和单位表示，不改变物理量纲 d。"},
      {id:"u-physlib-speed",level:3,concept:"phys-physlib",source:"physlib-adapted",p:"Physlib 中 oneKilometerPerHour_in_SI 证明的核心结果是什么？",c:"#check DimSpeed.oneKilometerPerHour_in_SI",o:["1 km/h 的 SI 数值是 5/18 m/s","1 km/h = 1 m/s","速度没有量纲"],a:0,e:"1000/3600 约分为 5/18。"},
      {id:"u-semantic-limit",level:3,concept:"phys-dimensionless",p:"两个量都无量纲，是否就一定可以互换？",c:"angle : Dimensionless\nrefractiveIndex : Dimensionless",o:["不一定；量纲一致不等于物理语义相同","一定；类型会证明语义相同","一定；它们的数值总相等"],a:0,e:"量纲分析排除一类错误，但不是完整的物理语义系统。"}
    ]},

    practice:{label:"量纲实验",desc:"跨越实数、量纲和单位的随机实验；每次从三个难度层重新组卷。",xp:20,draw:6,mix:[2,2,2],questions:[
      {id:"p-real",level:1,concept:"phys-real",p:"经典连续时间变量最常用哪个类型？",c:"variable (t : ___)",o:["ℝ","Nat","String"],a:0,e:"ℝ 同时允许负值、分数和连续变化。"},
      {id:"p-momentum-dim",level:1,concept:"phys-dimension",p:"动量 p = mv 的量纲是什么？",c:"[p] = [m][v]",o:["MLT⁻¹","MLT⁻²","L²T⁻²"],a:0,e:"质量 M 乘速度 LT⁻¹。"},
      {id:"p-energy-dim",level:1,concept:"phys-dimension",p:"动能 K = 1/2 mv² 的量纲是什么？",c:"[K] = [m][v]²",o:["ML²T⁻²","MLT⁻¹","MLT⁻²"],a:0,e:"M·(LT⁻¹)² = ML²T⁻²。"},
      {id:"p-speed-fun",level:2,concept:"phys-function",p:"哪个定义表示匀速轨迹？",c:"variable (x₀ v : ℝ)",o:["fun t : ℝ => x₀ + v*t","fun t : ℝ => v/t","fun t : ℝ => x₀ + t^2"],a:0,e:"一维匀速位置随时间线性变化。"},
      {id:"p-bad-add",level:2,concept:"phys-typed-quantity",p:"哪一表达式应被量纲安全接口拒绝？",c:"distance : Quantity lengthDim\ntime : Quantity timeDim",o:["distance + time","distance / time","distance + distance"],a:0,e:"不同量纲不能相加；长度除时间则能形成速度。"},
      {id:"p-ratio",level:2,concept:"phys-dimensionless",p:"应变 ΔL/L 属于什么量纲？",c:"[ΔL/L]",o:["无量纲","长度","面积"],a:0,e:"长度比长度，指数抵消。"},
      {id:"p-sqrt-assumption",level:3,concept:"phys-assumption",p:"定义 v = √(GM/r) 前，最关键的一组物理/数学条件是什么？",c:"Real.sqrt (G * M / r)",o:["0 ≤ G、0 ≤ M 且 0 < r","r = 0","G、M、r 都是字符串"],a:0,e:"正性保证除法与平方根对应预期的实数速度。"},
      {id:"p-check-model",level:3,concept:"phys-model",p:"一个形式化物理题最完整的结构是？",c:"___",o:["对象与量纲 + 模型假设 + Lean 定理 + 物理解释","只写最终公式","只让 AI 判断答案"],a:0,e:"这四层把数学正确性与模型适用性同时公开。"},
      {id:"p-type-benefit",level:3,concept:"phys-typed-quantity",p:"量纲进入类型最直接的收益是什么？",c:"add : Quantity d → Quantity d → Quantity d",o:["不相容量纲在 elaboration 阶段失败","自动证明所有物理定律","自动读取实验仪器"],a:0,e:"类型系统可以提前排除不合法的运算组合。"}
    ]},

    kinematics:{label:"一维运动学",desc:"用函数表达位置与速度，并把匀加速公式的代数关系交给 Lean 验证。",xp:12,draw:6,mix:[2,2,2],questions:[
      {id:"k-uniform",level:1,concept:"phys-function",p:"匀速模型的位置函数是哪一个？",c:"x₀ v t : ℝ",o:["x₀ + v*t","v + t","x₀*t^2"],a:0,e:"初始位置加速度乘时间。"},
      {id:"k-velocity",level:1,concept:"phys-model",p:"匀加速模型中的速度公式是哪一个？",c:"v₀ a t : ℝ",o:["v₀ + a*t","v₀*t + a*t^2/2","a/t"],a:0,e:"速度以斜率 a 随时间线性变化。"},
      {id:"k-position",level:1,concept:"phys-model",p:"匀加速位移 s(t) 应写成什么？",c:"v₀ a t : ℝ",o:["v₀*t + a*t^2/2","v₀ + a*t","v₀*t + a/t"],a:0,e:"位移包含初速度项和二次加速度项。"},
      {id:"k-initial-x",level:2,concept:"phys-ring",p:"如何证明 position x₀ v 0 = x₀？",c:"def position (x₀ v t : ℝ) := x₀ + v*t\nexample : position x₀ v 0 = x₀ := by\n  ___",o:["simp [position]","intro","constructor"],a:0,e:"展开定义后，simp 化简乘零和加零。"},
      {id:"k-zero-a",level:2,concept:"phys-ring",p:"当 a = 0 时，匀加速速度退化为什么？",c:"v = v₀ + a*t\nh : a = 0",o:["v = v₀","v = t","v = 0"],a:0,e:"代入零加速度后剩下初速度。"},
      {id:"k-domain",level:2,concept:"phys-assumption",p:"若模型只讨论实验开始后的时间，应该怎样表达？",c:"variable (t : ℝ)",o:["增加假设 ht : 0 ≤ t","把 t 改名为 future","Lean 会从变量名自动知道"],a:0,e:"时间范围是模型条件，应成为显式假设。"},
      {id:"k-torricelli",level:3,concept:"phys-ring",p:"代入 v = v₀+at 与 s = v₀t+at²/2 后，哪种策略适合证明 v² = v₀²+2as？",c:"example (v₀ a t : ℝ) :\n  (v₀ + a*t)^2 = v₀^2 + 2*a*(v₀*t + a*t^2/2) := by\n  ___",o:["ring","rfl","intro"],a:0,e:"展开后是实数上的多项式恒等式，ring 可以规范化两边。"},
      {id:"k-function-state",level:3,concept:"phys-function",p:"从一维位置推广到三维位置，最自然的第一步是什么？",c:"trajectory : ℝ → ___",o:["EuclideanSpace ℝ (Fin 3)","String","Prop → Bool"],a:0,e:"三维位置可表示为三维欧氏空间中的向量。"},
      {id:"k-derivative-scope",level:3,concept:"phys-model",p:"仅证明两个运动学公式代数相容，是否已经证明它们满足真实轨迹的微分定义？",c:"by ring",o:["没有；还需把速度/加速度与导数联系起来","有；ring 会自动证明所有导数结论","有；任何多项式都是实验事实"],a:0,e:"代数恒等式是重要一步，但连续动力学还需要导数与初值模型。"}
    ]},

    modeling:{label:"模型与假设",desc:"学习把正性、非零条件、系统边界和适用范围写进定理签名。",xp:15,draw:6,mix:[2,2,2],questions:[
      {id:"m-positive-mass",level:1,concept:"phys-assumption",p:"如何在定理中表达质量 m 为正？",c:"theorem demo (m : ℝ) ___ : ...",o:["(hm : 0 < m)","(m : Positive)","-- m is positive"],a:0,e:"把 0 < m 的证明作为显式参数。"},
      {id:"m-nonzero-radius",level:1,concept:"phys-assumption",p:"若公式含有 1/r，至少要提供什么条件？",c:"1 / r",o:["hr : r ≠ 0","hr : r = 0","无需条件"],a:0,e:"分母非零是代数推理的必要条件。"},
      {id:"m-forall",level:1,concept:"phys-model",p:"theorem 中的 (t : ℝ) 表示结论对什么成立？",c:"theorem law (t : ℝ) : P t := ...",o:["任意传入的实数 t","只对 t = 0","只对计算机选中的 t"],a:0,e:"显式参数在定理外部被普遍量化。"},
      {id:"m-structure",level:2,concept:"phys-model",p:"要把质量、位置、速度打包为一个状态，适合使用什么？",c:"___ ParticleState where\n  mass : ℝ\n  position : ℝ\n  velocity : ℝ",o:["structure","example","open"],a:0,e:"structure 把相关字段组织为一个新类型。"},
      {id:"m-let",level:2,concept:"phys-model",p:"定理中想给中间量 v 与 s 命名，适合使用什么？",c:"___ v := v₀ + a*t\n___ s := v₀*t + a*t^2/2",o:["let / let","def / theorem","intro / exact"],a:0,e:"let 为当前表达式或证明建立局部名字。"},
      {id:"m-closed-system",level:2,concept:"phys-conservation",p:"声明总动量守恒时，为什么要写“无外冲量”等条件？",c:"hclosed : NoExternalImpulse system interval",o:["它决定守恒律的适用系统边界","它只用于改变变量颜色","Lean 会忽略所有假设"],a:0,e:"守恒结论依赖模型条件；条件应可见、可检查、可讨论。"},
      {id:"m-dependent",level:3,concept:"phys-typed-quantity",p:"Quantity (d : Dimension) 中 d 的作用是什么？",c:"structure Quantity (d : Dimension) where\n  value : ℝ",o:["让量纲参与 Quantity 的类型","把所有数值变成整数","自动选择实验数据"],a:0,e:"不同 d 产生不同的索引类型，从而约束可用运算。"},
      {id:"m-sqrt",level:3,concept:"phys-assumption",p:"要把 (Real.sqrt x)^2 化为 x，通常必须知道什么？",c:"Real.sq_sqrt ___",o:["0 ≤ x","x ≠ x","x 是字符串"],a:0,e:"实平方根的平方定理需要被开方数非负。"},
      {id:"m-validation-boundary",level:3,concept:"phys-model",p:"一份高质量形式化物理练习应怎样报告 Lean 的结论？",c:"Lean accepted theorem T",o:["在给定定义与假设下 T 已被形式验证","T 已经由实验无条件证实","T 不再需要任何物理解释"],a:0,e:"必须区分演绎验证与经验验证。"}
    ]},

    conservation:{label:"方程与守恒",desc:"使用 rw、ring、nlinarith 与 positivity 验证初等力学中的代数核心。",xp:15,draw:6,mix:[2,2,2],questions:[
      {id:"c-rw-law",level:1,concept:"phys-ring",p:"已知 h : F = m*a，怎样把目标中的 F 替换为 m*a？",c:"h : F = m*a\n⊢ F*t = m*a*t",o:["rw [h]","intro h","constructor"],a:0,e:"rw 按已知等式重写匹配的表达式。"},
      {id:"c-ring",level:1,concept:"phys-ring",p:"证明展开平方等式最适合哪种策略？",c:"example (v J m : ℝ) :\n  (v + J/m)^2 = v^2 + 2*v*(J/m) + (J/m)^2 := by\n  ___",o:["ring","cases v","rfl"],a:0,e:"这是交换环中的恒等式。"},
      {id:"c-square",level:1,concept:"phys-positivity",p:"任意实数速度 v 的 v² 有什么性质？",c:"sq_nonneg v",o:["0 ≤ v²","v² < 0","v² = v"],a:0,e:"实数平方总非负。"},
      {id:"c-kinetic",level:2,concept:"phys-positivity",p:"若 hm : 0 ≤ m，证明 0 ≤ (1/2)*m*v² 适合用什么？",c:"example (m v : ℝ) (hm : 0 ≤ m) : 0 ≤ (1/2)*m*v^2 := by\n  ___",o:["positivity","intro","contradiction"],a:0,e:"positivity 能组合 1/2、m 和 v² 的非负性。"},
      {id:"c-momentum",level:2,concept:"phys-conservation",p:"两物体碰撞前后总动量相同，应写成哪条等式？",c:"m₁ m₂ u₁ u₂ v₁ v₂ : ℝ",o:["m₁*u₁ + m₂*u₂ = m₁*v₁ + m₂*v₂","u₁ + u₂ = v₁*v₂","m₁ + m₂ = u₁ + v₂"],a:0,e:"总动量是各物体质量乘速度之和。"},
      {id:"c-nlinarith",level:2,concept:"phys-ring",p:"上下文含多个实数等式与不等式，要组合推出多项式目标，可尝试什么？",c:"h₁ : x = v₀*t + a*t^2/2\nh₂ : v = v₀ + a*t\n⊢ ...",o:["nlinarith","namespace","inductive"],a:0,e:"nlinarith 可组合多项式等式与序关系；是否适用仍取决于目标形状。"},
      {id:"c-divide-mass",level:3,concept:"phys-assumption",p:"从 p = m*v 推出 v = p/m，必须避免遗漏什么？",c:"h : p = m*v",o:["hm : m ≠ 0","hp : p = 0","hname : String"],a:0,e:"除以质量需要质量非零；物理上通常给出更强的 0 < m。"},
      {id:"c-internal-force",level:3,concept:"phys-conservation",p:"为什么仅凭牛顿第三定律不能无条件宣布任意选取系统的动量守恒？",c:"F₁₂ = -F₂₁",o:["还需处理系统边界、外力/外冲量与时间演化","因为 Lean 不支持负数","因为动量不是实数"],a:0,e:"内力抵消只是推导的一环，系统闭合条件不可省略。"},
      {id:"c-theorem-vs-formula",level:3,concept:"phys-model",p:"哪一个更接近可复用的守恒定理？",c:"___",o:["theorem momentum_conserved (hclosed : ClosedSystem S) : p S t₁ = p S t₂ := ...","#eval 1 + 1","def p := \"momentum\""],a:0,e:"定理把系统条件、时间和守恒结论共同暴露在类型中。"}
    ]},

    physlib:{label:"调用 Physlib",desc:"从 import 与 #check 开始，阅读单位、简谐振子和圆轨道的现有形式化成果。",xp:20,draw:6,mix:[2,2,2],questions:[
      {id:"l-import",level:1,concept:"phys-physlib",source:"physlib-adapted",p:"要一次导入 Physlib 的公开模块，可写什么？",c:"___",o:["import Physlib","open Physics","#eval Physlib"],a:0,e:"import Physlib 使用库的汇总入口。"},
      {id:"l-check",level:1,concept:"phys-namespace",p:"调用陌生物理定理前，最可靠的第一步是什么？",c:"___ ClassicalMechanics.HarmonicOscillator.ω_sq",o:["#check","#eval","simp only"],a:0,e:"#check 显示参数、假设和结论。"},
      {id:"l-focused-import",level:1,concept:"phys-physlib",p:"只练习速度单位时，哪种导入更聚焦？",c:"___",o:["import Physlib.Units.WithDim.Speed","import String","namespace Speed"],a:0,e:"聚焦导入减少无关环境，也明确依赖来源。"},
      {id:"l-kmh",level:2,concept:"phys-physlib",source:"physlib-adapted",p:"Physlib 已形式化的 1 km/h SI 数值是什么？",c:"DimSpeed.oneKilometerPerHour_in_SI",o:["5/18","18/5","1000"],a:0,e:"1 km/h = 1000/3600 m/s = 5/18 m/s。"},
      {id:"l-omega",level:2,concept:"phys-namespace",source:"physlib-adapted",p:"简谐振子定理 ω_sq 对应哪条关系？",c:"ClassicalMechanics.HarmonicOscillator.ω_sq",o:["ω² = k/m","ω = k*m","ω² = m/k"],a:0,e:"角频率由弹簧常数与质量之比决定。"},
      {id:"l-orbit",level:2,concept:"phys-namespace",source:"physlib-adapted",p:"圆轨道速度平方定理对应哪条关系？",c:"ClassicalMechanics.VisViva.speedCircular_sq",o:["v² = GM/r","v² = GMr","v = GM/r²"],a:0,e:"圆轨道向心条件给出 v² = GM/r。"},
      {id:"l-library-proof",level:3,concept:"phys-model",p:"引用 Physlib 定理后，Lean 实际保证了什么？",c:"exact ClassicalMechanics.HarmonicOscillator.ω_sq ...",o:["结论由库中的定义、假设与已验证定理推出","该模型已覆盖所有现实振子","所有实验误差自动为零"],a:0,e:"库复用增强演绎可靠性，但不会消除建模边界。"},
      {id:"l-namespace",level:3,concept:"phys-namespace",p:"为什么完整名称 ClassicalMechanics.VisViva.speedCircular_sq 很长？",c:"#check ClassicalMechanics.VisViva.speedCircular_sq",o:["命名空间表达领域与模块归属并避免冲突","Lean 定理必须至少 40 个字符","名称长度代表证明难度"],a:0,e:"限定名让大型库中的来源与语境保持清晰。"},
      {id:"l-contribution",level:3,concept:"phys-physlib",p:"学生小组怎样把课程成果推进为研究型产出？",c:"model → theorem → tests → documentation → ___",o:["向项目仓库提交可审查 PR 或独立成库","只保留截图","删除所有假设"],a:0,e:"可复现代码、文档和审查记录比孤立演示更接近形式化研究。"}
    ]},

    daily:{label:"物理练习场",desc:"跨单元随机复习物理语义、量纲、Lean 建模和定理调用。",xp:5,draw:6,mix:[2,2,2],questions:[
      {id:"daily-real",level:1,concept:"phys-real",p:"哪种类型最适合精确陈述连续位置公式？",c:"x : ___",o:["ℝ","Float","Char"],a:0,e:"实数 ℝ 是经典连续模型的常用起点。"},
      {id:"daily-speed-dim",level:1,concept:"phys-dimension",p:"速度的量纲是什么？",c:"[v]",o:["LT⁻¹","LT","MLT⁻²"],a:0,e:"速度是长度除以时间。"},
      {id:"daily-force-dim",level:1,concept:"phys-dimension",p:"力的量纲是什么？",c:"[F] = [m][a]",o:["MLT⁻²","ML²T⁻²","MT⁻¹"],a:0,e:"质量乘加速度得到 MLT⁻²。"},
      {id:"daily-check",level:1,concept:"phys-namespace",p:"哪条命令查看物理定理签名？",c:"___ theoremName",o:["#check","#eval","let"],a:0,e:"#check 是阅读 API 的第一步。"},
      {id:"daily-unit",level:2,concept:"phys-unit",p:"72 km/h 等于多少 m/s？",c:"72 * 1000 / 3600",o:["20","72","200"],a:0,e:"换算因子为 5/18。"},
      {id:"daily-bad-add",level:2,concept:"phys-typed-quantity",p:"哪种运算应在类型检查时失败？",c:"length : Quantity lengthDim\ntime : Quantity timeDim",o:["length + time","length / time","length + length"],a:0,e:"加法要求量纲相同。"},
      {id:"daily-ring",level:2,concept:"phys-ring",p:"多项式形式的运动学恒等式优先尝试什么？",c:"example (v₀ a t : ℝ) : (...) = (...) := by\n  ___",o:["ring","induction t","#eval"],a:0,e:"ring 规范化交换环表达式。"},
      {id:"daily-positive",level:2,concept:"phys-positivity",p:"使用平方根速度公式时，哪个条件最相关？",c:"Real.sqrt (G*M/r)",o:["0 ≤ G*M/r","r 是字符串","G = false"],a:0,e:"被开方数非负是平方根定理的关键条件。"},
      {id:"daily-model",level:3,concept:"phys-model",p:"Lean 通过一个物理定理后，仍需人工审查什么？",c:"Lean: no errors",o:["模型定义、假设和现实适用范围","加号是否存在","证明是否有类型"],a:0,e:"内核负责推导可靠性，领域判断负责模型有效性。"},
      {id:"daily-conserve",level:3,concept:"phys-conservation",p:"动量守恒陈述中最容易被遗漏的部分是什么？",c:"p(t₁) = p(t₂)",o:["系统边界与无外冲量条件","变量字体","代码文件名"],a:0,e:"守恒律必须绑定到明确系统与条件。"},
      {id:"daily-omega",level:3,concept:"phys-physlib",p:"Physlib 简谐振子中 ω² 等于什么？",c:"#check ClassicalMechanics.HarmonicOscillator.ω_sq",o:["k/m","m/k","k*m"],a:0,e:"ω² = k/m。"},
      {id:"daily-orbit",level:3,concept:"phys-physlib",p:"圆轨道速度平方关系是哪一个？",c:"v² = ___",o:["GM/r","GMr","GM/r²"],a:0,e:"v² = GM/r。"}
    ]}
  };

  window.LEANPATH_CONCEPTS = concepts;
  window.LEANPATH_QUESTION_BANKS = decks;
  window.LEANPATH_QUESTION_SOURCES = [
    {id:"workshop",name:"暑校 Type Theory / Inductive Type 讲义中的物理量练习",license:"课程材料"},
    {id:"physlib",name:"Physlib",url:"https://github.com/leanprover-community/Physlib",license:"Apache-2.0"},
    {id:"tpil",name:"Theorem Proving in Lean 4",url:"https://github.com/leanprover/theorem_proving_in_lean4",license:"Apache-2.0"},
    {id:"mil",name:"Mathematics in Lean",url:"https://github.com/leanprover-community/mathematics_in_lean",license:"Apache-2.0"}
  ];
}());

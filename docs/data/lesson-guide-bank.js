/* Theory cards shown before every mainline physics quiz. */
(function () {
  window.LEANPATH_LESSON_GUIDES = {
    version: 1,
    guides: {
      quantity: {
        part:"第一部分 · 单位与量纲", index:"01 / 13", title:"物理量不只是一个数",
        summary:"一次物理记录至少要区分数值、单位与量纲；形式化还要说明它属于哪个模型，以及数值是测量值、约定值还是理想化参数。",
        points:["同一物理量换单位后数值会改变，量纲不变。","数值为零不会让量纲消失；0 m/s 仍然是速度。","形式证明检查模型内部推导，不自动验证实验参数。"],
        pseudo:`structure MeasuredQuantity where
  value : ℝ
  unit : Unit
  uncertainty : Option ℝ

-- 72 km/h 与 20 m/s 可表示同一速度`,
        scope:"本关先建立三层语言，暂不处理误差分布与实验校准。"
      },
      "si-base": {
        part:"第一部分 · 单位与量纲", index:"02 / 13", title:"SI 基本量是一组生成基底",
        summary:"SI 选择时间、长度、质量、电流、热力学温度、物质的量和发光强度七个基本量；其他常见物理量由它们组合得到。",
        points:["基本量并非“更真实”，而是单位制选定的独立生成元。","牛顿、焦耳、帕斯卡等都是导出单位。","绝对温度与摄氏温标的差别会在仿射换算中出现。"],
        pseudo:`inductive BaseDimension where
  | time | length | mass | electricCurrent
  | temperature | amount | luminousIntensity

baseUnitSymbol .mass = "kg"`,
        scope:"本课程采用现行 SI 的七维基底，同时允许后续讨论其他单位制。"
      },
      "dimension-model": {
        part:"第一部分 · 单位与量纲", index:"03 / 13", title:"量纲是基本量指数向量",
        summary:"把量纲表示成七个整数指数，就能把公式的量纲推导变成逐分量代数。例如力是 M¹L¹T⁻²。",
        points:["每个分量对应一个 SI 基本量的幂指数。","两个量纲相等，当且仅当全部基本指数相等。","未知参数的量纲可以从齐次方程中反解。"],
        pseudo:`abbrev Dim := BaseDimension → Int

forceDim .time   = -2
forceDim .length = 1
forceDim .mass   = 1`,
        scope:"整数指数足以覆盖本章；根式量纲需要额外的可整除条件或有理指数模型。"
      },
      "dimension-ops": {
        part:"第一部分 · 单位与量纲", index:"04 / 13", title:"乘除和幂变成指数运算",
        summary:"物理量相乘时量纲指数相加，相除时相减，取整数幂时整体缩放。量纲代数因此是一个交换群式结构。",
        points:["[xy]=[x][y] 对应指数向量相加。","[x/y]=[x][y]⁻¹，对应指数相减。","[xⁿ]=[x]ⁿ，对所有基本指数乘 n。"],
        pseudo:`dimMul d₁ d₂ b := d₁ b + d₂ b
dimInv d b := - d b
dimPow d n b := n * d b`,
        scope:"这些运算只追踪物理类别，不计算实际数值或单位换算因子。"
      },
      "derived-dimensions": {
        part:"第一部分 · 单位与量纲", index:"05 / 13", title:"从基本量生成常用物理量",
        summary:"速度、加速度、力、能量、功率、压强和电压都可通过定义式推导量纲；推导过程也揭示公式中的物理结构。",
        points:["[v]=LT⁻¹，[a]=LT⁻²，[F]=MLT⁻²。","[E]=[F]L=ML²T⁻²，[P]=[E]T⁻¹。","导出单位只是为常用组合命名，不产生新的基本量。"],
        pseudo:`speedDim := lengthDim / timeDim
forceDim := massDim * accelerationDim
energyDim := forceDim * lengthDim`,
        scope:"本关用定义关系推导量纲，不把同量纲对象误认为同一物理概念。"
      },
      dimensionless: {
        part:"第一部分 · 单位与量纲", index:"06 / 13", title:"无量纲不等于没有物理意义",
        summary:"当全部基本指数抵消时得到无量纲量。应变、角度、折射率、雷诺数等虽同为零指数向量，仍有不同语义。",
        points:["同类量之比通常无量纲，但数值不必为 1。","sin、exp、log 的自变量通常要求无量纲。","rad 等专名单位可以保留语义而不改变量纲。"],
        pseudo:`dimOne : Dim := fun _ => 0

theorem self_div (d : Dim) :
  d / d = dimOne := by ...`,
        scope:"量纲系统是粗粒度类型系统；更细语义需靠不同结构或额外标签表达。"
      },
      "unit-systems": {
        part:"第一部分 · 单位与量纲", index:"07 / 13", title:"单位制是同一量纲空间的不同坐标",
        summary:"SI、厘米克秒制和自然单位制改变表示尺度或选择约定，但不改变一个量属于长度、时间还是能量。",
        points:["单位提供量纲的数值标尺。","换单位制时应先明确每个基本单位的尺度。","令 c=1 或 ℏ=1 是建模约定，不是把物理常数删除。"],
        pseudo:`structure UnitSystem where
  scale : BaseDimension → ℝ
  positive : ∀ b, 0 < scale b

toSI system d value := value * scaleFactor system d`,
        scope:"本关关注乘法型单位制；带平移的温标在下一关单独处理。"
      },
      "unit-conversion": {
        part:"第一部分 · 单位与量纲", index:"08 / 13", title:"换算因子必须随幂次传播",
        summary:"长度换算是线性的，但面积、体积和导出单位必须把尺度因子提升到相应幂次；摄氏温标则是仿射变换。",
        points:["1 km=1000 m，因此 1 km²=10⁶ m²。","36 km/h=10 m/s 同时换长度和时间尺度。","绝对温度需要平移，温差只需要尺度变换。"],
        pseudo:`def LinearUnit where scale : ℝ
def AffineUnit where scale offset : ℝ

toSI_linear u x := u.scale * x
toSI_affine u x := u.scale * x + u.offset`,
        scope:"所有换算都应先确认源、目标单位具有同一量纲。"
      },
      "typed-quantity": {
        part:"第一部分 · 单位与量纲", index:"09 / 13", title:"让量纲进入类型",
        summary:"Quantity d 把量纲 d 作为类型索引。这样错误的加法在程序运行前就会被 Lean 拒绝，而不是留给测试发现。",
        points:["Quantity lengthDim 与 Quantity timeDim 是不同类型。","同量纲只保证可进行某些运算，不保证语义完全相同。","单位换算后可以把数值统一存入 SI 表示。"],
        pseudo:`structure Quantity (d : Dim) where
  valueSI : ℝ

add : Quantity d → Quantity d → Quantity d
-- length + time 在类型检查阶段失败`,
        scope:"这是教学型依赖类型模型；实际库还要处理单位选择、表示精度与标量类型。"
      },
      "typed-ops": {
        part:"第一部分 · 单位与量纲", index:"10 / 13", title:"公式结构反映在返回类型中",
        summary:"同量纲加法保持类型，乘除则在返回类型中合成量纲。这让冲量、功、密度和动能等公式携带可检查的物理签名。",
        points:["x+y 要求两个输入具有同一量纲。","x·y 的类型是 Quantity (d₁*d₂)。","标量系数必须明确是无量纲还是带量纲参数。"],
        pseudo:`add : Quantity d → Quantity d → Quantity d
mul : Quantity d₁ → Quantity d₂ → Quantity (d₁ * d₂)
div : Quantity d₁ → Quantity d₂ → Quantity (d₁ / d₂)`,
        scope:"类型安全排除量纲错误，但不会自动证明公式系数、方向或边界条件正确。"
      },
      homogeneity: {
        part:"第一部分 · 单位与量纲", index:"11 / 13", title:"量纲齐次是必要条件，不是充分条件",
        summary:"物理等式两侧必须具有相同量纲，求和的每一项也必须同量纲；但齐次公式仍可能具有错误系数或错误动力学。",
        points:["加法是最严格的检查点：不同量纲不能相加。","齐次性可用于反推参数量纲和发现漏项。","无量纲常数无法仅靠量纲分析确定。"],
        pseudo:`def Homogeneous (lhs rhs : Dim) : Prop := lhs = rhs

-- [x] = [v*t] 是必要条件
-- 但不能推出 x = v*t 一定适用`,
        scope:"量纲分析不替代守恒律、运动方程、初边值条件或实验验证。"
      },
      "physlib-units": {
        part:"第一部分 · 单位与量纲", index:"12 / 13", title:"从教学模型连接 Physlib",
        summary:"Physlib 已提供 Dimension、WithDim 与若干单位定义和精确换算定理。课程先展示透明模型，再让库承担可复用的工程实现。",
        points:["先用 #check 查看真实 API 的参数和返回类型。","复用已证明的换算定理优于重复展开底层定义。","库接口可能比伪代码更抽象，但物理含义应保持一致。"],
        pseudo:`import Physlib.Units.WithDim.Speed
open LTMCTUnitChoices

#check DimSpeed.oneKilometerPerHour_in_SI
example : DimSpeed.oneKilometerPerHour SI = ⟨5/18⟩ := by ...`,
        scope:"卡片中的代码展示阅读路径；写作实验室中的完整模板才交给 Lean 服务检查。"
      },
      practice: {
        part:"第一部分 · 单位与量纲", index:"13 / 13", title:"把量纲当成建模检查器",
        summary:"综合实验会混合数值换算、指数运算、依赖类型和模型边界。解题时先识别对象，再写量纲关系，最后计算数值。",
        points:["先统一单位，再进行数值计算。","先检查可加性，再组合乘除和幂。","结论若只来自量纲分析，要明确它还不能决定什么。"],
        pseudo:`def solve (problem : PhysicsProblem) :=
  let dimsOK := checkHomogeneity problem
  let normalized := convertToSI problem
  deriveUnderAssumptions normalized`,
        scope:"这是本部分随机综合卷；完成后可在成果图鉴查看整章 Lean 代码。"
      },

      "euclidean-vectors": {
        part:"第二部分 · 欧式空间中的静力学", index:"01 / 17", title:"先确定向量空间，再谈力学",
        summary:"位移、速度和力都可用 ℝⁿ 中的向量表示。静力学计算常在 n=2 或 n=3 中进行，但合力和一般维力矩可以统一定义。",
        points:["VecN n = Fin n → ℝ 是透明的坐标模型。","向量加法表示位移或力的叠加。","具体坐标依赖基底，几何结论应尽量不依赖坐标编号。"],
        pseudo:`abbrev VecN (n : ℕ) := Fin n → ℝ
abbrev Vec3 := VecN 3

resultant : List (VecN n) → VecN n`,
        scope:"本章的一般维部分使用坐标模型；涉及叉积、角速度和梁时专门化到三维或平面。"
      },
      "inner-metric": {
        part:"第二部分 · 欧式空间中的静力学", index:"02 / 17", title:"内积提供长度、角度与功",
        summary:"欧式结构不只是一组坐标。内积给出范数和正交性，也把力与位移配对成标量功。正定性是许多平衡充要条件的关键。",
        points:["v·v≥0，且 v·v=0 当且仅当 v=0。","距离由两点位移的范数得到。","F·δr 是标量，而 r∧F 是反对称张量。"],
        pseudo:`dot v w := dotProduct v w
normSq v := dot v v

theorem normSq_eq_zero_iff :
  normSq v = 0 ↔ v = 0 := ...`,
        scope:"本关只用有限维实内积空间，不讨论非欧几何或无限维函数空间。"
      },
      "affine-points": {
        part:"第二部分 · 欧式空间中的静力学", index:"03 / 17", title:"点不是向量，点之差才是位移",
        summary:"作用点属于仿射空间：两个点不能自然相加，但 Q−P 是向量，P 加一个位移仍是点。选原点只是获得坐标的方法。",
        points:["displacement P Q = Q−P，方向不可颠倒。","换参考原点改变位置向量，不改变两点几何位移。","力矩依赖参考点，合力不依赖参考点。"],
        pseudo:`structure PointN (n : ℕ) where
  coord : VecN n

displacement p q := q.coord - p.coord`,
        scope:"教学代码用 coord 暴露坐标；更内禀的版本可连接 Physlib 的 ReferenceFrame。"
      },
      "applied-force": {
        part:"第二部分 · 欧式空间中的静力学", index:"04 / 17", title:"力向量必须和作用点一起记录",
        summary:"同一个力向量施加在不同作用线上，对平动效应相同，对转动效应却可能不同。因此集中力应包含 point 与 vector。",
        points:["vector 决定大小和方向。","point 决定关于参考点的力臂。","沿作用线移动作用点不会改变该刚体力的力矩。"],
        pseudo:`structure AppliedForceN (n : ℕ) where
  point : PointN n
  vector : VecN n`,
        scope:"集中力是理想化；分布载荷需要积分后才能进入当前有限力系模型。"
      },
      "force-system": {
        part:"第二部分 · 欧式空间中的静力学", index:"05 / 17", title:"有限力系先求合力，再保留合力矩",
        summary:"合力 R=ΣFᵢ 描述总平动效应，但不足以描述转动。刚体外力系通常要用一对 (R,M_O) 归约。",
        points:["空力系合力为零向量。","子系统合力可以分组相加。","合力为零仍可能存在非零力偶矩。"],
        pseudo:`def resultantN : List (AppliedForceN n) → VecN n
  | [] => 0
  | f :: S => f.vector + resultantN S`,
        scope:"列表只记录有限个外力，不自动编码刚体形状、接触或材料。"
      },
      moment: {
        part:"第二部分 · 欧式空间中的静力学", index:"06 / 17", title:"一般 ℝⁿ 中的力矩是 r∧F",
        summary:"三维叉积并不是力矩的唯一定义。对 r=P−O，令 M_O=r∧F；其分量 Mᵢⱼ=rᵢFⱼ−rⱼFᵢ，构成反对称二阶张量。",
        points:["Mᵢⱼ=−Mⱼᵢ 且 Mᵢᵢ=0，所以有 n(n−1)/2 个独立分量。","二维只有一个独立分量；三维经 Hodge 对偶成为 r×F。","n≥4 时通常保留二形式/反对称张量，而不强行变成向量。"],
        pseudo:`abbrev MomentTensor n := Matrix (Fin n) (Fin n) ℝ

def wedge (r F : VecN n) : MomentTensor n :=
  fun i j => r i * F j - r j * F i

momentTensorAt O P F := wedge (P - O) F`,
        scope:"成果代码使用透明的反对称矩阵表示；Mathlib 的完整外代数可作为后续升级接口。"
      },
      "moment-shift": {
        part:"第二部分 · 欧式空间中的静力学", index:"07 / 17", title:"换参考点只增加一个合力修正项",
        summary:"由 P−Q=(P−O)−(Q−O) 和楔积线性，得到 M_Q=M_O−(Q−O)∧R。这个公式在任意有限维成立。",
        points:["修正项只依赖两原点位移与合力。","R=0 时总力矩与参考点无关。","三维 Hodge 对偶后，∧ 变成熟悉的 ×。"],
        pseudo:`theorem totalMoment_change_origin :
  M q S = M o S - wedge (q - o) (resultantN S) := by
  induction S with
  | nil => simp
  | cons f S ih => ...`,
        scope:"一般空间力系不总能通过换原点消掉全部力矩；三维中心轴理论留作拓展。"
      },
      equilibrium: {
        part:"第二部分 · 欧式空间中的静力学", index:"08 / 17", title:"平衡同时排除平动与转动",
        summary:"刚体静力平衡定义为合力向量为零，并且关于一点的总力矩反对称张量为零。移矩定理保证该定义与参考点无关。",
        points:["平动平衡：R=0。","转动平衡：M_O=0。","一般 n 维共有 n+n(n−1)/2=n(n+1)/2 个标量分量。"],
        pseudo:`def IsBalancedAtN (o : PointN n) (S : ForceSystemN n) :=
  resultantN S = 0 ∧
  totalMomentTensorAt o S = 0`,
        scope:"平衡方程不自动保证接触反力可行，也不包含物体初速度与动力学演化。"
      },
      "equilibrium-iff": {
        part:"第二部分 · 欧式空间中的静力学", index:"09 / 17", title:"三维平衡可由所有刚体虚功率刻画",
        summary:"在三维中，无穷小刚体运动由平动速度 v 与角速度 ω 表示。外力功率 R·v+M·ω 对所有 v、ω 为零，当且仅当 R=M=0。",
        points:["正向由 R=M=0 立即得到。","反向分别测试 (v,ω)=(R,0) 与 (0,M)。","内积正定性把 R·R=0、M·M=0 转成向量为零。"],
        pseudo:`rigidVirtualPower R M v ω := dot R v + dot M ω

(∀ v ω, rigidVirtualPower R M v ω = 0)
  ↔ R = 0 ∧ M = 0`,
        scope:"一般 n 维版本需把角速度和力矩都视为反对称张量并选择自然配对，本章不强行展开。"
      },
      "support-reactions": {
        part:"第二部分 · 欧式空间中的静力学", index:"10 / 17", title:"支反力是由约束引入的未知量",
        summary:"简支梁是把模型、方程和可行性连起来的最小例子：两个竖直反力由一个合力方程和一个取矩方程求出。",
        points:["R_A+R_B=P。","以 A 取矩得到 R_B L=P a。","还要检查 L>0、0≤a≤L 与反力非负。"],
        pseudo:`leftReaction P a L := P * (L - a) / L
rightReaction P a L := P * a / L

theorem force_balance (hL : L ≠ 0) :
  leftReaction P a L + rightReaction P a L = P := ...`,
        scope:"求得外部反力不等于求得梁内应力；后者需要梁或连续体理论。"
      },
      determinacy: {
        part:"第二部分 · 欧式空间中的静力学", index:"11 / 17", title:"静定性是平衡方程的唯一可解性",
        summary:"把反力映到平衡残差的线性映射记为 A。给定载荷后存在唯一 r 满足 Ar+load=0，称为静定；非零核则产生自应力方向。",
        points:["唯一性可由 A 的单射性保证。","k≠0 且 Ak=0 表示自应力。","若 r₀ 是解，则 r₀+k 仍是同一载荷下的解。"],
        pseudo:`IsDeterminate A load := ∃! r, A r + load = 0

k ∈ LinearMap.ker A
-- r₀ 与 r₀+k 具有相同平衡残差`,
        scope:"超静定结构的真实反力还需材料刚度与变形协调关系。"
      },
      work: {
        part:"第二部分 · 欧式空间中的静力学", index:"12 / 17", title:"常力功是力与位移的内积",
        summary:"常力 F 从 P 到 Q 所做的功为 W=F·(Q−P)。点积的线性与位移链式关系直接给出分段可加性。",
        points:["功是标量，量纲为能量。","F 与位移正交时功为零。","变力沿路径做功需要曲线积分。"],
        pseudo:`work F p q := dot F (q.coord - p.coord)

theorem work_add :
  work F p r = work F p q + work F q r := ...`,
        scope:"本关只证明常力情形，不把路径无关性误用于任意变力。"
      },
      potential: {
        part:"第二部分 · 欧式空间中的静力学", index:"13 / 17", title:"保守力是势能的负梯度",
        summary:"欧式空间中若存在势能 V，则保守力 F=−∇V。二次势能 V(x)=½k‖x‖² 给出胡克型恢复力 F=−kx。",
        points:["梯度依赖内积结构。","负号让力指向势能下降方向。","势能只确定到加法常数，但力不变。"],
        pseudo:`quadraticPotential k x := (1/2) * k * ⟪x,x⟫
elasticForce k x := - gradient (quadraticPotential k) x

theorem elasticForce_eq : elasticForce k x = (-k) • x := ...`,
        scope:"并非所有力都是保守力；摩擦和随动力不能直接纳入同一势能模型。"
      },
      "virtual-work": {
        part:"第二部分 · 欧式空间中的静力学", index:"14 / 17", title:"虚功只测试许可的无穷小运动",
        summary:"有约束时并非所有位移都可取。虚功原理要求外力泛函在许可虚运动集合上为零，理想约束反力因而可以从方程中消去。",
        points:["虚位移是约束的线性化方向，不是实际时间演化。","自由刚体时许可集合是全部 (v,ω)。","受约束时虚功为零一般不能推出全部外力为零。"],
        pseudo:`AdmissibleMotions := Set (Vec3 × Vec3)

VirtualWorkPrincipleAt o S admissible :=
  ∀ motion ∈ admissible,
    rigidVirtualPowerAt o S motion.1 motion.2 = 0`,
        scope:"本章使用有限维集合模型；复杂约束可升级为线性子空间或切空间。"
      },
      stability: {
        part:"第二部分 · 欧式空间中的静力学", index:"15 / 17", title:"势能极值需要在模型假设内解释",
        summary:"对一维保守二次模型 V(x)=½kx²，k>0 给出严格极小，k=0 是中性平坦，k<0 存在降能方向。",
        points:["正刚度对应局部恢复趋势。","零刚度需要检查高阶项或零模。","负刚度使原点不是局部极小。"],
        pseudo:`scalarPotential k x := (1/2) * k * x^2

k > 0 → V 0 < V x  -- x ≠ 0
k = 0 → V x = V 0
k < 0 → V 1 < V 0`,
        scope:"该判据依赖保守、静态和二次近似；屈曲、耗散与非线性稳定性需另建框架。"
      },
      "statics-physlib": {
        part:"第二部分 · 欧式空间中的静力学", index:"16 / 17", title:"让库承担基础数学，让课程承担物理模型",
        summary:"Mathlib 提供矩阵、外代数、内积、叉积和线性映射；Physlib 提供参考系与梯度。课程只定义目前库中尚无统一封装的轻量静力学对象。",
        points:["一般力矩先用反对称矩阵坐标表示，再可桥接 ⋀²。","三维数值题复用 Mathlib crossProduct。","势能力调用 Physlib gradient，而不是自造微分算子。"],
        pseudo:`import Mathlib.LinearAlgebra.ExteriorAlgebra.Basic
import Mathlib.LinearAlgebra.CrossProduct
import Physlib.Mathematics.Calculus.Gradient

#check ExteriorAlgebra
#check crossProduct
#check gradient`,
        scope:"库接口的存在不等于已有整章静力学；AppliedForce 与 ForceSystem 仍是课程层模型。"
      },
      "statics-practice": {
        part:"第二部分 · 欧式空间中的静力学", index:"17 / 17", title:"从对象类型一路检查到模型边界",
        summary:"综合实验会把向量、张量力矩、平衡、静定性、功、虚功与稳定性混合出现。建议按“对象—方程—假设—结论”四步作答。",
        points:["先判断对象是点、向量、反对称张量还是标量。","再写合力、移矩或能量关系，并列出非零/可行性假设。","最后判断结论属于刚体、约束系统还是更窄的保守模型。"],
        pseudo:`structure ModelCheck where
  objectsTyped : Prop
  equationsBalanced : Prop
  assumptionsSatisfied : Prop
  conclusionWithinScope : Prop`,
        scope:"完成后会解锁包含一般维力矩与三维静力学专门化的完整章节成果。"
      }
    }
  };
}());

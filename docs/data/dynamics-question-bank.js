/* Unit III · physics-first randomized question pools. */
(function () {
  const concepts = window.LEANPATH_CONCEPTS;
  const banks = window.LEANPATH_QUESTION_BANKS;
  if (!concepts || !banks) return;

  Object.assign(concepts, {
    "dyn-trajectory": {title:"轨迹的正则性先于动力学方程",body:"速度与加速度分别是轨迹的一阶、二阶导数。写牛顿方程前必须说明导数存在；二阶运动方程通常还需要位置和速度两份初值。",code:"r : ℝ → VecN n\nv t := deriv r t\na t := deriv v t"},
    "dyn-newton": {title:"牛顿第二定律是惯性系中的向量方程",body:"恒质量质点满足 F_net(t)=m a(t)。质量正性允许由力求加速度；合力必须按选定系统边界计算。",code:"force t = m • acceleration r t"},
    "dyn-momentum": {title:"外力控制总动量变化",body:"恒质量时 p=mv 且 dp/dt=F。多质点系统中成对内力相消，得到 dP/dt=F_ext；外力合量为零时总动量守恒。",code:"P(t₁) - P(t₀) = impulse_external"},
    "dyn-angular": {title:"角动量属于一般维反对称张量",body:"L=r∧p，分量 Lᵢⱼ=rᵢpⱼ-rⱼpᵢ；其导数等于外力矩。三维叉积向量是 Hodge 对偶专门化。",code:"angularMomentum r p := wedge r p"},
    "dyn-energy": {title:"动能定理是牛顿方程沿速度的投影",body:"dT/dt=F·v。保守且不显含时间时，F=-∇V 使 d(T+V)/dt=0；阻尼或时变势会改变机械能。",code:"T = 1/2 * m * ‖v‖²\nE = T + V"},
    "dyn-matrices": {title:"M 与 K 来自动能和势能二次型",body:"小振动方程 Mq¨+Kq=0 中，质量矩阵定义动能度量，刚度矩阵是势能 Hessian。奇异 M、零模 K 和负刚度方向必须分别处理。",code:"T = 1/2 qdotᵀ M qdot\nV = 1/2 qᵀ K q"},
    "dyn-modal": {title:"正常模态满足广义特征值问题",body:"谐波试探解产生 Kφ=ω²Mφ。对称 K 与正定 M 给出实的非负频率平方；不同特征值的模态在 M-内积下正交。",code:"K.mulVec φ = ω^2 • M.mulVec φ"},
    "dyn-inertia": {title:"惯性张量编码转动动能",body:"I=Σm(‖r‖²1-rrᵀ)，且 T_rot=1/2 ωᵀIω。I 对称半正定；其特征方向是主轴，特征值是主惯量。",code:"rotEnergy = 1/2 * dotProduct ω (I.mulVec ω)"},
    "dyn-euler": {title:"欧拉方程是旋转基底中的角动量定理",body:"在主轴随体系中 Iω˙+ω×(Iω)=τ。耦合项来自基底旋转；无外力矩不代表随体系角动量分量恒定。",code:"I₁*ω̇₁ + (I₃-I₂)*ω₂*ω₃ = τ₁"},
    "dyn-dalembert": {title:"达朗贝尔原理把惯性项放进虚功",body:"对许可虚位移，Σ(Fᵢ-mᵢaᵢ)·δrᵢ=0。理想约束反力不做虚功，因此可从切向运动方程中消去。",code:"∀ δr ∈ admissible, dot (F - m • a) δr = 0"},
    "dyn-lagrange": {title:"拉格朗日方程来自广义坐标化的达朗贝尔原理",body:"对完整理想约束，L=T-V 满足 d/dt(∂L/∂q̇ⱼ)-∂L/∂qⱼ=Qⱼⁿᶜ。循环坐标给出共轭动量守恒。",code:"d/dt (∂L/∂qdot) - ∂L/∂q = Qnc"},
    "dyn-central": {title:"中心力由角动量守恒降维",body:"中心力矩为零，轨道在固定平面内。利用 ℓ=mr²θ̇ 可把能量写成径向动能加有效势 V_eff=V+ℓ²/(2mr²)。",code:"effectivePotential m ell V r := V r + ell^2/(2*m*r^2)"},
    "dyn-kepler": {title:"反平方律轨道是圆锥曲线",body:"令 u=1/r，反平方力给出 Binet 方程 u''+u=1/p，故 r=p/(1+e cos(θ-θ₀))。能量符号决定椭圆、抛物线或双曲线。",code:"e^2 = 1 + 2*E*ell^2/(mu^2*m^3)"}
  });

  function deck(label, desc, xp, questions, draw, mix) {
    return {label:label, desc:desc, xp:xp, draw:draw || 6, mix:mix || [2,2,2], questions:questions};
  }

  Object.assign(banks, {
    "trajectory-kinematics": deck("轨迹、速度与加速度","从显式轨迹、恒加速度和参考系变换中读取一阶与二阶运动学。",28,[
      {id:"dyn-tr-velocity",level:1,concept:"dyn-trajectory",p:"一维轨迹 x(t)=3t²+2t，速度 v(t) 是？",c:"x(t)=3t²+2t",o:["6t+2","3t+2","6"],a:0,e:"速度是一阶导数。"},
      {id:"dyn-tr-acceleration",level:1,concept:"dyn-trajectory",p:"同一轨迹的加速度为？",c:"x(t)=3t²+2t",o:["6","6t+2","3t²"],a:0,e:"再求一次导数得到常加速度 6。"},
      {id:"dyn-tr-constant-v",level:1,concept:"dyn-trajectory",p:"若 r(t)=r₀+vt，其中 v 为常向量，则加速度？",c:"r(t)=r₀+vt",o:["0","v","r₀"],a:0,e:"速度为 v，二阶导数为零。"},
      {id:"dyn-tr-initial-data",level:2,concept:"dyn-trajectory",p:"一般二阶运动方程要选定唯一解，通常需要哪组初值？",c:"r¨=f(t,r,r˙)",o:["r(t₀) 与 r˙(t₀)","只要 r(t₀)","只要 r¨(t₀)"],a:0,e:"二阶方程通常需要位置和速度两份初值。"},
      {id:"dyn-tr-frame",level:2,concept:"dyn-trajectory",p:"两个惯性系以恒定速度相对平移，质点的哪个量保持相同？",c:"r'=r-Ut",o:["加速度","速度","位置坐标"],a:0,e:"速度相差常向量 U，再求导后加速度相同。"},
      {id:"dyn-tr-projectile",level:2,concept:"dyn-trajectory",p:"恒定重力下 r(t)=r₀+v₀t+½gt²。代入 t=0 可同时恢复什么？",c:"r(0), r˙(0)",o:["r₀ 与 v₀","r₀ 与 g","v₀ 与 0"],a:0,e:"轨迹与一阶导数在零时刻给出两份初值。"},
      {id:"dyn-tr-regularity",level:3,concept:"dyn-trajectory",p:"轨迹只保证连续时，哪一项可能尚未定义？",c:"r : ℝ → E continuous",o:["速度和加速度","位置","时间参数"],a:0,e:"连续函数不必可微。"},
      {id:"dyn-tr-noninertial",level:3,concept:"dyn-trajectory",p:"在加速参考系中直接把坐标二阶导数代入 F=ma，缺少什么？",c:"accelerating frame",o:["惯性力或参考系修正项","质量单位","位移定义"],a:0,e:"牛顿简单形式只适用于惯性系。"}
    ]),

    "newton-laws": deck("牛顿定律的数学表述","从合力、质量正性、作用反作用与系统边界建立运动方程。",30,[
      {id:"dyn-n-force",level:1,concept:"dyn-newton",p:"质量 2 kg 的质点加速度为 (3,−1) m/s²，合力是？",c:"F=m a",o:["(6,−2) N","(5,1) N","(3,−1) N"],a:0,e:"向量每个分量都乘质量 2。"},
      {id:"dyn-n-zero-force",level:1,concept:"dyn-newton",p:"m>0 且合力恒为零，运动一定是？",c:"m r¨=0",o:["速度恒定","位置恒定","速度大小恒为零"],a:0,e:"加速度为零，只推出速度是常向量。"},
      {id:"dyn-n-accel",level:1,concept:"dyn-newton",p:"恒力 12 N 作用在 3 kg 质点上，加速度大小？",c:"a=F/m",o:["4 m/s²","36 m/s²","9 m/s²"],a:0,e:"12/3=4。"},
      {id:"dyn-n-third",level:2,concept:"dyn-newton",p:"F₁₂=-F₂₁ 最直接用于哪一步？",c:"two-particle internal forces",o:["封闭系统求和时内力相消","证明每个质点合力为零","证明动能一定守恒"],a:0,e:"第三定律使成对内力在总动量方程中消去。"},
      {id:"dyn-n-system",level:2,concept:"dyn-newton",p:"只研究地球时，太阳对地球的引力属于？",c:"system = Earth",o:["外力","内力","惯性力"],a:0,e:"太阳不在选定系统内部。"},
      {id:"dyn-n-constant-force",level:2,concept:"dyn-newton",p:"恒质量、恒力下轨迹中的二次项系数是？",c:"r=r₀+v₀t+C t²",o:["F/(2m)","F/m","m/(2F)"],a:0,e:"a=F/m，而位移二次项为 ½at²。"},
      {id:"dyn-n-zero-mass",level:3,concept:"dyn-newton",p:"为什么从 m a=0 推出 a=0 时必须有 m≠0？",c:"m a = 0",o:["零质量时乘法不能消去 m","因为 a 没有单位","因为力必非零"],a:0,e:"代数消去需要非零因子，经典质点还要求 m>0。"},
      {id:"dyn-n-variable-mass",level:3,concept:"dyn-newton",p:"火箭质量随时间减少时，为什么不能机械套用 F_ext=m a？",c:"p=m(t)v(t)",o:["p˙ 还包含 m˙v 与边界动量通量","速度不能求导","火箭不满足动量守恒"],a:0,e:"变质量开放系统需明确喷流跨边界的动量。"}
    ]),

    "momentum-dynamics": deck("动量定理与守恒","通过冲量、碰撞、质心与开放系统辨认总动量方程。",32,[
      {id:"dyn-p-basic",level:1,concept:"dyn-momentum",p:"2 kg 物体以 5 m/s 运动，动量大小？",c:"p=mv",o:["10 kg·m/s","2.5 kg·m/s","25 J"],a:0,e:"2×5=10。"},
      {id:"dyn-p-impulse",level:1,concept:"dyn-momentum",p:"恒力 4 N 作用 3 s，冲量大小？",c:"J=F Δt",o:["12 N·s","7 N·s","4 N/s"],a:0,e:"冲量等于力的时间积分。"},
      {id:"dyn-p-change",level:1,concept:"dyn-momentum",p:"物体动量从 6 变为 −2 kg·m/s，合冲量为？",c:"J=p₁-p₀",o:["−8 N·s","4 N·s","8 N·s"],a:0,e:"−2−6=−8。"},
      {id:"dyn-p-inelastic",level:2,concept:"dyn-momentum",p:"相同质量两物体速度分别 v 与 −v，完全非弹性碰后共同速度？",c:"total momentum = 0",o:["0","v","2v"],a:0,e:"总动量为零，总质量非零。"},
      {id:"dyn-p-center",level:2,concept:"dyn-momentum",p:"封闭系统外力为零，质心做什么运动？",c:"M R¨cm=Fext=0",o:["匀速直线运动","必静止","必绕原点转动"],a:0,e:"质心速度恒定。"},
      {id:"dyn-p-internal",level:2,concept:"dyn-momentum",p:"封闭两体系统内部发生爆炸，忽略外冲量。爆炸前后什么守恒？",c:"internal energy release",o:["总动量","总动能","每个物体动量"],a:0,e:"内部能可转为动能，但总动量守恒。"},
      {id:"dyn-p-open",level:3,concept:"dyn-momentum",p:"沙子不断落入移动小车时，简单封闭系统动量方程失效的原因？",c:"mass crosses boundary",o:["有跨边界动量通量","重力没有量纲","车速不可定义"],a:0,e:"开放系统需计入进入质量携带的动量。"},
      {id:"dyn-p-conservation-scope",level:3,concept:"dyn-momentum",p:"总动量守恒的充分物理条件是？",c:"dP/dt=Fext",o:["选定系统的外力合量为零","每个质点不受力","所有内力都为零"],a:0,e:"系统内部相互作用可以非零。"}
    ]),

    "angular-momentum": deck("角动量定理与守恒","从一般维外积、中心力、面积速度与参考点选择理解转动守恒。",34,[
      {id:"dyn-l-zero",level:1,concept:"dyn-angular",p:"若位置 r 与动量 p 平行，则关于原点的角动量？",c:"L=r∧p",o:["0","r+p","|r||p|"],a:0,e:"平行向量外积为零。"},
      {id:"dyn-l-torque",level:1,concept:"dyn-angular",p:"角动量变化率等于？",c:"dL/dt = ?",o:["外力矩","外力","机械能"],a:0,e:"角动量定理为 L˙=τext。"},
      {id:"dyn-l-central",level:1,concept:"dyn-angular",p:"中心力的外力矩为何为零？",c:"F=f(r)r",o:["r 与 F 平行","F 数值为零","r 恒定"],a:0,e:"r∧F=f(r)r∧r=0。"},
      {id:"dyn-l-dimension",level:2,concept:"dyn-angular",p:"一般 ℝ⁴ 中角动量有多少个独立反对称分量？",c:"dim Λ²ℝⁿ=n(n−1)/2",o:["6","4","3"],a:0,e:"4×3/2=6。"},
      {id:"dyn-l-area",level:2,concept:"dyn-angular",p:"三维中心力下面积速度是？",c:"L=m r×v",o:["|L|/(2m)","|L|/m","2m|L|"],a:0,e:"小三角面积率为 ½|r×v|。"},
      {id:"dyn-l-plane",level:2,concept:"dyn-angular",p:"L≠0 且恒定时，轨道位于哪个平面？",c:"r·L=0",o:["过力心且垂直于 L 的固定平面","任意移动平面","垂直于速度的平面"],a:0,e:"r 与 v 始终垂直于恒定角动量向量。"},
      {id:"dyn-l-zero-degenerate",level:3,concept:"dyn-angular",p:"中心力轨道若 L=0，最需要单独处理什么？",c:"zero angular momentum",o:["纯径向运动与中心碰撞可能性","圆轨道稳定性","模态正交性"],a:0,e:"L=0 时极角约化和固定轨道平面公式退化。"},
      {id:"dyn-l-kepler2",level:3,concept:"dyn-angular",p:"仅从等面积定律可以推出引力必为反平方律吗？",c:"constant areal velocity",o:["不能，只能推出零力矩/中心力","能，唯一确定 1/r²","能，且能量必为负"],a:0,e:"任意中心力都给出等面积定律。"}
    ]),

    "energy-dynamics": deck("动能与机械能","从功率、势能、阻尼与可达区域判断能量关系。",34,[
      {id:"dyn-e-kinetic",level:1,concept:"dyn-energy",p:"2 kg 物体速度 3 m/s，动能？",c:"T=1/2 m v²",o:["9 J","6 J","18 J"],a:0,e:"½×2×9=9。"},
      {id:"dyn-e-power",level:1,concept:"dyn-energy",p:"力 F 与速度 v 垂直时瞬时功率？",c:"P=F·v",o:["0","|F||v|","负值"],a:0,e:"内积为零。"},
      {id:"dyn-e-work",level:1,concept:"dyn-energy",p:"合外力做功 12 J，动能变化量？",c:"ΔT=Wnet",o:["12 J","0 J","144 J"],a:0,e:"动能定理直接给出。"},
      {id:"dyn-e-turning",level:2,concept:"dyn-energy",p:"一维保守系统总能量 E，转向点满足？",c:"E=T+V",o:["V(x)=E","V(x)=0","V(x)>E"],a:0,e:"转向点速度为零，动能为零。"},
      {id:"dyn-e-reachable",level:2,concept:"dyn-energy",p:"质量为正时，保守轨迹的可达区域必须满足？",c:"T=E-V≥0",o:["V≤E","V≥E","V=0"],a:0,e:"动能非负。"},
      {id:"dyn-e-damping",level:2,concept:"dyn-energy",p:"线性阻尼 Fd=−cv、c>0 时机械能变化率？",c:"E˙=Fd·v",o:["−c‖v‖²≤0","+c‖v‖²","恒为零"],a:0,e:"阻尼力与速度反向。"},
      {id:"dyn-e-time-potential",level:3,concept:"dyn-energy",p:"F=−∇V 但 V(q,t) 显含时间，机械能一定守恒吗？",c:"∂V/∂t ≠ 0",o:["不一定，E˙ 可含 ∂V/∂t","一定守恒","只有动量守恒"],a:0,e:"外部时变参数可注入能量。"},
      {id:"dyn-e-not-trajectory",level:3,concept:"dyn-energy",p:"知道 E 守恒通常不能直接得到什么？",c:"1/2 m xdot² + V(x)=E",o:["完整的时间参数轨迹 x(t)","可达区域","转向点"],a:0,e:"还需积分一阶方程并处理初值。"}
    ]),

    "mass-stiffness": deck("质量矩阵与刚度矩阵","从能量二次型、矩阵正定性和退化方向判断小振动模型。",36,[
      {id:"dyn-mk-mass",level:1,concept:"dyn-matrices",p:"对独立质量 m₁,m₂，常用质量矩阵是？",c:"T=1/2(m₁q̇₁²+m₂q̇₂²)",o:["diag(m₁,m₂)","diag(1/m₁,1/m₂)","全零矩阵"],a:0,e:"动能二次型的系数即质量矩阵。"},
      {id:"dyn-mk-stiffness",level:1,concept:"dyn-matrices",p:"一维弹簧 V=½kx² 的刚度矩阵是？",c:"K=Hess V",o:["[k]","[1/k]","[m]"],a:0,e:"二阶导数为 k。"},
      {id:"dyn-mk-equation",level:1,concept:"dyn-matrices",p:"无阻尼小振动矩阵方程是？",c:"linear conservative system",o:["Mq¨+Kq=0","Kq¨+Mq=0","Mq˙+K=0"],a:0,e:"质量乘加速度加恢复力为零。"},
      {id:"dyn-mk-positive-m",level:2,concept:"dyn-matrices",p:"M 正定的直接物理意义？",c:"q̇ᵀMq̇>0 for q̇≠0",o:["任意非零广义速度具有正动能","所有频率相同","势能必为零"],a:0,e:"M 定义动能度量。"},
      {id:"dyn-mk-zero-mode",level:2,concept:"dyn-matrices",p:"K 有非零零模 Kφ=0，可能表示？",c:"zero stiffness direction",o:["刚体运动或中性方向","质量为负","时间不存在"],a:0,e:"沿该方向二阶势能不变。"},
      {id:"dyn-mk-negative",level:2,concept:"dyn-matrices",p:"存在 φ 使 φᵀKφ<0，线性平衡如何？",c:"negative stiffness direction",o:["存在不稳定方向","必稳定","只是零频"],a:0,e:"势能二次项沿该方向下降。"},
      {id:"dyn-mk-singular",level:3,concept:"dyn-matrices",p:"M 奇异时最谨慎的解释是？",c:"det M = 0",o:["可能有冗余坐标或代数约束，不能直接求 q¨","所有频率为零","系统没有质量"],a:0,e:"需要约束消元或微分代数系统。"},
      {id:"dyn-mk-linearization",level:3,concept:"dyn-matrices",p:"为什么 K 是势能在平衡点的 Hessian，而非梯度？",c:"∇V(q₀)=0",o:["平衡点一阶项消失，首个恢复项是二阶项","Hessian 总等于梯度","因为 K 必是常数"],a:0,e:"Taylor 展开的一阶项在平衡点为零。"}
    ]),

    "modal-eigen": deck("广义特征值与正常模态","用频率平方、Rayleigh 商和 M-正交性分析线性振动。",38,[
      {id:"dyn-mode-ansatz",level:1,concept:"dyn-modal",p:"把 q=φ cos ωt 代入 Mq¨+Kq=0 得到？",c:"q¨=−ω²q",o:["Kφ=ω²Mφ","Mφ=ωKφ","Kφ=−ωMφ"],a:0,e:"约去 cos ωt 后移项。"},
      {id:"dyn-mode-frequency",level:1,concept:"dyn-modal",p:"广义特征值 λ 与固有频率关系？",c:"Kφ=λMφ",o:["λ=ω²","λ=ω","λ=1/ω"],a:0,e:"来自二阶时间导数。"},
      {id:"dyn-mode-zero",level:1,concept:"dyn-modal",p:"λ=0 对应什么频率？",c:"ω²=0",o:["零频模","无限频率","复频率"],a:0,e:"ω=0。"},
      {id:"dyn-mode-rayleigh",level:2,concept:"dyn-modal",p:"Rayleigh 商是？",c:"φ≠0",o:["(φᵀKφ)/(φᵀMφ)","(φᵀMφ)/(φᵀKφ)","φᵀ(K+M)φ"],a:0,e:"对特征向量它等于 ω²。"},
      {id:"dyn-mode-orthogonal",level:2,concept:"dyn-modal",p:"不同特征值模态的正确正交关系？",c:"M,K symmetric",o:["φᵢᵀMφⱼ=0","φᵢᵀKφᵢ=0","φᵢ=φⱼ"],a:0,e:"质量矩阵定义模态内积。"},
      {id:"dyn-mode-two-mass",level:2,concept:"dyn-modal",p:"相同两质量三弹簧系统中，反相模态为何频率更高？",c:"φ=(1,−1)",o:["中间弹簧形变更大，等效刚度更高","质量消失","动量不守恒"],a:0,e:"反相运动额外拉伸中间弹簧。"},
      {id:"dyn-mode-negative",level:3,concept:"dyn-modal",p:"λ<0 时 q 的时间行为更接近？",c:"q¨+λq=0",o:["指数增长/衰减","实频简谐振动","恒速运动"],a:0,e:"ω² 为负时频率为虚数。"},
      {id:"dyn-mode-repeated",level:3,concept:"dyn-modal",p:"重特征值下模态是否自动唯一？",c:"lambda multiplicity > 1",o:["不唯一，可在特征子空间选 M-正交基","唯一","必须全部平行"],a:0,e:"重特征空间内有基底自由度。"}
    ]),

    "inertia-tensor": deck("惯性张量","从离散质点、主轴、平行轴和对称性计算转动惯性。",38,[
      {id:"dyn-i-definition",level:1,concept:"dyn-inertia",p:"单质点 m 位于 r，惯性张量贡献是？",c:"point mass",o:["m(‖r‖²1−rrᵀ)","m rrᵀ","m‖r‖1"],a:0,e:"叉积范数恒等式给出该对称张量。"},
      {id:"dyn-i-energy",level:1,concept:"dyn-inertia",p:"转动动能是？",c:"angular velocity ω",o:["½ωᵀIω","Iω","½I²ω"],a:0,e:"惯性张量定义角速度的二次型。"},
      {id:"dyn-i-axis",level:1,concept:"dyn-inertia",p:"主轴在数学上是什么？",c:"I e = lambda e",o:["惯性张量的特征方向","角速度的任意方向","合力方向"],a:0,e:"I 对称，可选正交特征基。"},
      {id:"dyn-i-dumbbell",level:2,concept:"dyn-inertia",p:"两点质量位于 x 轴 ±a，绕 x 轴惯量？",c:"all mass lies on axis",o:["0","2ma²","ma²"],a:0,e:"质点到转轴距离为零。"},
      {id:"dyn-i-dumbbell-y",level:2,concept:"dyn-inertia",p:"同一哑铃绕 y 轴惯量？",c:"distance=a for both masses",o:["2ma²","0","4ma²"],a:0,e:"两质点各贡献 ma²。"},
      {id:"dyn-i-parallel",level:2,concept:"dyn-inertia",p:"参考轴从质心平移距离 d 后，关于平行轴的标量惯量？",c:"total mass M",o:["I_O=I_C+Md²","I_O=I_C−Md²","I_O=MI_Cd"],a:0,e:"平行轴定理增加 Md²。"},
      {id:"dyn-i-spherical",level:3,concept:"dyn-inertia",p:"球对称刚体的惯性张量形式？",c:"rotational symmetry",o:["c·1","任意非对称矩阵","秩一矩阵"],a:0,e:"旋转对称迫使 I 与所有旋转交换，因此为标量矩阵。"},
      {id:"dyn-i-semidefinite",level:3,concept:"dyn-inertia",p:"惯性张量半正定而可能非正定的几何原因？",c:"thin/degenerate mass distribution",o:["可能存在绕质量支撑线转动而速度全零的方向","质量可以为负","角速度无单位"],a:0,e:"退化质量分布可产生零转动能方向。"}
    ]),

    "euler-equations": deck("欧拉刚体动力学","用主轴分量、运输定理和守恒量判断自由刚体转动。",40,[
      {id:"dyn-eu-vector",level:1,concept:"dyn-euler",p:"欧拉方程的向量形式？",c:"body principal frame",o:["Iω˙+ω×(Iω)=τ","Iω+ω˙=τ","ω×I=0"],a:0,e:"运输项为 ω×L。"},
      {id:"dyn-eu-spherical",level:1,concept:"dyn-euler",p:"I₁=I₂=I₃ 且 τ=0 时，随体角速度如何？",c:"spherical rotor",o:["恒定","指数增长","必须为零"],a:0,e:"所有耦合系数差为零。"},
      {id:"dyn-eu-principal",level:1,concept:"dyn-euler",p:"只绕主轴 1 转动且无外力矩时，是否为精确解？",c:"ω₂=ω₃=0",o:["是，ω₁ 恒定","否，必产生 ω₂","只有 I₁=I₂ 时"],a:0,e:"耦合乘积项均为零。"},
      {id:"dyn-eu-component",level:2,concept:"dyn-euler",p:"第一欧拉方程中耦合系数是？",c:"I₁ω̇₁ + ___ ω₂ω₃ = τ₁",o:["I₃−I₂","I₁−I₂","I₁+I₃"],a:0,e:"来自 ω×Iω 的第一分量。"},
      {id:"dyn-eu-space-body",level:2,concept:"dyn-euler",p:"τ=0 时哪个量在惯性空间中恒定？",c:"free rigid body",o:["角动量向量","随体每个角动量分量","随体角速度每个分量"],a:0,e:"坐标分量可因基底旋转而变。"},
      {id:"dyn-eu-energy",level:2,concept:"dyn-euler",p:"自由刚体还守恒什么标量？",c:"τ=0",o:["转动动能","每个 ωᵢ","每个主惯量的差"],a:0,e:"无外力矩不做功，转动动能守恒。"},
      {id:"dyn-eu-intermediate",level:3,concept:"dyn-euler",p:"三轴刚体绕哪个主轴转动通常线性不稳定？",c:"I₁<I₂<I₃",o:["中间主惯量轴 I₂","最小轴 I₁","最大轴 I₃"],a:0,e:"这是中间轴定理。"},
      {id:"dyn-eu-not-static",level:3,concept:"dyn-euler",p:"无外力矩为何不意味着 ω˙=0？",c:"tau=0",o:["随体系仍有 ω×Iω 耦合项","惯性张量恒为零","角动量不守恒"],a:0,e:"非球形刚体中角速度可相对随体系进动。"}
    ]),

    dalembert: deck("达朗贝尔原理","通过动力学残差、许可虚位移和理想约束消去反力。",40,[
      {id:"dyn-da-residual",level:1,concept:"dyn-dalembert",p:"达朗贝尔动力学残差是？",c:"Newton equation rearranged",o:["F−ma","F+ma","mv"],a:0,e:"牛顿方程移项。"},
      {id:"dyn-da-free",level:1,concept:"dyn-dalembert",p:"无约束且对所有 δr 有 (F−ma)·δr=0，可推出？",c:"Euclidean inner product",o:["F=ma","F=0","a=0"],a:0,e:"取 δr=F−ma 并用正定性。"},
      {id:"dyn-da-constraint",level:1,concept:"dyn-dalembert",p:"理想约束反力为何可从虚功式消去？",c:"R·δr",o:["它与所有许可虚位移正交","它数值恒为零","它没有量纲"],a:0,e:"反力可能非零，但不做许可虚功。"},
      {id:"dyn-da-inertial-force",level:2,concept:"dyn-dalembert",p:"−ma 被称为惯性力时，最准确的理解？",c:"F + (-ma) virtual balance",o:["运动方程的重写项，不是新的相互作用","真实接触力","保守势能"],a:0,e:"它把动力学写成瞬时虚功平衡。"},
      {id:"dyn-da-subspace",level:2,concept:"dyn-dalembert",p:"只对约束子空间 C 测试残差正交，能推出残差？",c:"R·δ=0 for δ∈C",o:["属于 C 的正交补","恒为零","属于 C"],a:0,e:"约束反力可位于法向空间。"},
      {id:"dyn-da-ring",level:2,concept:"dyn-dalembert",p:"无摩擦圆环约束下，哪种虚位移可用？",c:"particle on fixed circle",o:["沿圆切向","任意径向","脱离圆环"],a:0,e:"许可虚位移属于约束曲线切空间。"},
      {id:"dyn-da-friction",level:3,concept:"dyn-dalembert",p:"有滑动摩擦时为何不能默认约束力虚功为零？",c:"friction tangent to contact",o:["摩擦沿许可切向可做负功","摩擦必为零","质量矩阵奇异"],a:0,e:"非理想约束需保留摩擦广义力。"},
      {id:"dyn-da-not-static",level:3,concept:"dyn-dalembert",p:"达朗贝尔式等于零是否说明质点静止？",c:"Σ(F−ma)·δr=0",o:["不说明，式中包含加速度","说明速度为零","说明位置不变"],a:0,e:"它是动力学残差的虚功条件。"}
    ]),

    "lagrange-equations": deck("欧式约束下的拉格朗日方程","从广义坐标、单摆、循环坐标和非保守广义力理解方程。",42,[
      {id:"dyn-la-L",level:1,concept:"dyn-lagrange",p:"保守系统的拉格朗日量通常定义为？",c:"L=?",o:["T−V","T+V","V−T"],a:0,e:"L=T−V。"},
      {id:"dyn-la-equation",level:1,concept:"dyn-lagrange",p:"无非保守力时的方程是？",c:"coordinate q_j",o:["d/dt(∂L/∂q̇ⱼ)−∂L/∂qⱼ=0","∂L/∂q̇ⱼ=0","dL/dt=0"],a:0,e:"欧拉—拉格朗日方程。"},
      {id:"dyn-la-pendulum-T",level:1,concept:"dyn-lagrange",p:"长度 ℓ 的单摆动能？",c:"speed=ℓ θdot",o:["½mℓ²θ̇²","½mℓθ̇","mℓ²θ"],a:0,e:"速度平方为 ℓ²θ̇²。"},
      {id:"dyn-la-pendulum-eq",level:2,concept:"dyn-lagrange",p:"理想单摆精确方程？",c:"V=mgℓ(1−cos θ)",o:["mℓ²θ¨+mgℓ sinθ=0","mℓθ¨+mg cosθ=0","θ¨=0"],a:0,e:"对 L=T−V 计算偏导。"},
      {id:"dyn-la-cyclic",level:2,concept:"dyn-lagrange",p:"若 ∂L/∂qⱼ=0，则什么守恒？",c:"cyclic coordinate",o:["pⱼ=∂L/∂q̇ⱼ","qⱼ 本身","势能必为零"],a:0,e:"共轭动量守恒。"},
      {id:"dyn-la-constraint",level:2,concept:"dyn-lagrange",p:"单摆方程中绳张力为何不出现？",c:"q=theta satisfies length constraint",o:["理想约束反力对许可虚位移不做功","张力为零","质量为零"],a:0,e:"广义坐标已消去约束方向。"},
      {id:"dyn-la-nonconservative",level:3,concept:"dyn-lagrange",p:"存在非保守广义力 Qⱼ 时，方程右端？",c:"d/dt ∂L/∂qdot - ∂L/∂q",o:["Qⱼ","0","−L"],a:0,e:"非保守主动作用保留在右端。"},
      {id:"dyn-la-small-angle",level:3,concept:"dyn-lagrange",p:"把 sinθ 换成 θ 属于哪一步？",c:"pendulum",o:["方程得到后的局部线性化","拉格朗日量定义","精确恒等式"],a:0,e:"小角近似不是精确方程的一部分。"}
    ]),

    "central-force": deck("中心力与有效势","利用角动量、面积速度和有效势分析径向运动与圆轨道。",44,[
      {id:"dyn-cf-torque",level:1,concept:"dyn-central",p:"F=f(r)r 的力矩？",c:"tau=r×F",o:["0","f(r)","r²"],a:0,e:"r 与 F 平行。"},
      {id:"dyn-cf-ell",level:1,concept:"dyn-central",p:"平面极坐标中的角动量大小？",c:"mass m",o:["ℓ=mr²θ̇","ℓ=mrθ̇","ℓ=mθ̇/r"],a:0,e:"来自 r×v。"},
      {id:"dyn-cf-area",level:1,concept:"dyn-central",p:"面积速度是？",c:"ell conserved",o:["ℓ/(2m)","2ℓ/m","m/(2ℓ)"],a:0,e:"A˙=½r²θ˙。"},
      {id:"dyn-cf-effective",level:2,concept:"dyn-central",p:"有效势的离心项是？",c:"Veff=V+?",o:["ℓ²/(2mr²)","ℓ/(mr)","mr²/2"],a:0,e:"由角动能消去 θ˙ 得到。"},
      {id:"dyn-cf-turning",level:2,concept:"dyn-central",p:"径向转向点满足？",c:"E=1/2 m rdot²+Veff",o:["E=Veff(r)","Veff=0","Veff>E"],a:0,e:"径向速度为零。"},
      {id:"dyn-cf-circular",level:2,concept:"dyn-central",p:"圆轨道半径 r₀ 的必要条件？",c:"r constant",o:["Veff'(r₀)=0","Veff(r₀)=0","ell=0"],a:0,e:"径向有效力必须为零。"},
      {id:"dyn-cf-stable",level:3,concept:"dyn-central",p:"圆轨道径向稳定的二阶条件？",c:"Veff'(r₀)=0",o:["Veff''(r₀)>0","Veff''(r₀)<0","Veff''(r₀)=−1"],a:0,e:"有效势严格局部极小。"},
      {id:"dyn-cf-zero-ell",level:3,concept:"dyn-central",p:"ℓ=0 时哪项分析退化？",c:"zero angular momentum",o:["离心势垒与极角轨道约化","径向位置","质量"],a:0,e:"运动可沿径向穿向中心。"}
    ]),

    "kepler-orbits": deck("开普勒定理与圆锥轨道","从 Binet 方程、偏心率、能量和椭圆几何判断行星轨道。",46,[
      {id:"dyn-k-binet",level:1,concept:"dyn-kepler",p:"反平方引力下 u=1/r 满足哪类方程？",c:"u''+u=?",o:["常数","与 u² 成正比","0 且仅有直线解"],a:0,e:"右端为 μm²/ℓ²。"},
      {id:"dyn-k-conic",level:1,concept:"dyn-kepler",p:"圆锥轨道的极坐标形式？",c:"focus at force center",o:["r=p/(1+e cos(θ−θ₀))","r=p(1+eθ)","r=e^θ"],a:0,e:"这是以力心为焦点的圆锥曲线。"},
      {id:"dyn-k-circle",level:1,concept:"dyn-kepler",p:"e=0 对应？",c:"conic eccentricity",o:["圆","抛物线","双曲线"],a:0,e:"半径恒为 p。"},
      {id:"dyn-k-ellipse",level:2,concept:"dyn-kepler",p:"束缚椭圆轨道的能量符号？",c:"0≤e<1",o:["E<0","E=0","E>0"],a:0,e:"偏心率—能量关系给出。"},
      {id:"dyn-k-parabola",level:2,concept:"dyn-kepler",p:"逃逸临界抛物线轨道满足？",c:"e=1",o:["E=0","E<0","ell=0 必然"],a:0,e:"抛物线对应零总能量。"},
      {id:"dyn-k-hyperbola",level:2,concept:"dyn-kepler",p:"双曲线散射轨道满足？",c:"e>1",o:["E>0","E=0","E<0"],a:0,e:"正能量允许无穷远仍有非零速度。"},
      {id:"dyn-k-second-general",level:3,concept:"dyn-kepler",p:"三条开普勒定律中，只依赖中心力的是？",c:"not specifically inverse square",o:["第二定律","第一定律","第三定律"],a:0,e:"等面积来自角动量守恒。"},
      {id:"dyn-k-third",level:3,concept:"dyn-kepler",p:"椭圆轨道周期 T 与半长轴 a 满足？",c:"gravitational parameter mu",o:["T²=(4π²/μ)a³","T=(4π²/μ)a³","T²=μ/a³"],a:0,e:"面积速度与椭圆面积给出第三定律。"}
    ]),

    "dynamics-practice": deck("欧式动力学综合实验","跨越牛顿方程、守恒量、振动模态、刚体与开普勒轨道的综合审计。",48,[
      {id:"dyn-pr-flow",level:1,concept:"dyn-newton",p:"建立动力学模型的合理顺序？",c:"___",o:["系统边界→自由度→运动方程→守恒量→特殊情形","先选 tactic→再猜物理量","先数值模拟→忽略单位"],a:0,e:"先确定物理结构，再进入证明或计算。"},
      {id:"dyn-pr-momentum",level:1,concept:"dyn-momentum",p:"外力合量为零但外力矩非零时，哪项一定守恒？",c:"Fext=0, tau_ext≠0",o:["总线动量","总角动量","机械能"],a:0,e:"P˙=Fext=0。"},
      {id:"dyn-pr-angular",level:1,concept:"dyn-angular",p:"中心力系统最先应利用哪个守恒量降维？",c:"F=f(r)r",o:["角动量","温度","刚度矩阵"],a:0,e:"零力矩给出固定轨道平面。"},
      {id:"dyn-pr-energy",level:1,concept:"dyn-energy",p:"保守自治系统判断位置是否可达，最直接检查？",c:"E=T+V",o:["V≤E","V≥E","F=0"],a:0,e:"动能必须非负。"},
      {id:"dyn-pr-mode",level:2,concept:"dyn-modal",p:"线性振动出现负广义特征值，意味着？",c:"lambda<0",o:["存在指数不稳定模态","只是频率较低","系统必有动量守恒"],a:0,e:"ω²<0。"},
      {id:"dyn-pr-euler",level:2,concept:"dyn-euler",p:"自由三轴刚体绕中间主轴的纯转动是？",c:"I1<I2<I3",o:["精确解但通常不稳定","不是解","恒稳定"],a:0,e:"存在性与稳定性必须分开。"},
      {id:"dyn-pr-dalembert",level:2,concept:"dyn-dalembert",p:"理想约束系统想消去反力，优先使用？",c:"admissible virtual displacements",o:["达朗贝尔原理","仅动量守恒","量纲分析"],a:0,e:"反力对许可虚位移不做功。"},
      {id:"dyn-pr-lagrange",level:2,concept:"dyn-lagrange",p:"约束可由独立广义坐标参数化时，拉格朗日方程的主要优势？",c:"q coordinates",o:["自动满足约束并减少未知反力","保证所有方程线性","不再需要质量"],a:0,e:"约束几何进入坐标参数化。"},
      {id:"dyn-pr-impulse",level:3,concept:"dyn-momentum",p:"卫星受到瞬时外冲量后，旧的轨道能量和角动量数值还能沿用吗？",c:"p jumps by J",o:["不能，应由新速度重新计算","可以，中心力永远不变","只有能量不变"],a:0,e:"冲量改变动量，从而改变守恒常数。"},
      {id:"dyn-pr-collision",level:3,concept:"dyn-kepler",p:"圆锥轨道方程在近心点穿过天体半径时，物理上还需做什么？",c:"r_peri < R_body",o:["判定发生碰撞，分段模型并停止无碰撞轨道解释","继续把质点穿过天体","修改量纲"],a:0,e:"数学圆锥正确不等于无碰撞模型适用。"},
      {id:"dyn-pr-degenerate",level:3,concept:"dyn-central",p:"推导有效势前为什么要单列 ℓ=0？",c:"divide by ell / use theta",o:["零角动量时极角约化和离心项退化","因为能量没有定义","因为质量必为零"],a:0,e:"径向运动需独立处理。"},
      {id:"dyn-pr-scope",level:3,concept:"dyn-trajectory",p:"Lean 接受某条轨道定理后，仍需审查什么？",c:"theorem compiled",o:["正则性、非碰撞、参考系和力模型假设","公式字体","题目随机顺序"],a:0,e:"内核只验证形式化假设下的演绎。"}
    ],8,[3,3,2])
  });
}());

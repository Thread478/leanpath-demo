/* Unit III · Euclidean dynamics lecture notes. Markdown + TeX source. */
(function () {
  const root = window.LEANPATH_LESSON_GUIDES;
  if (!root || !root.guides) return;

  const U3 = "第三单元 · 欧式空间中的动力学";
  const md = String.raw;

  function section(title, text, code, cases) {
    return {title:title, text:text, code:code || "", cases:cases || []};
  }

  function step(formula, text) {
    return {formula:formula, text:text};
  }

  function mapping(physics, lean, reason) {
    return {physics:physics, lean:lean, reason:reason};
  }

  function worked(title, problem, steps, result) {
    return {title:title, problem:problem, steps:steps, result:result};
  }

  function guide(index, title, summary, goals, motivation, sections, derivation, leanMap, example, takeaways, checkpoint, scope) {
    return {
      part:U3, index:index, title:title, summary:summary,
      goals:goals, motivation:motivation, sections:sections,
      derivation:derivation, leanMap:leanMap, worked:example,
      takeaways:takeaways, checkpoint:checkpoint, scope:scope
    };
  }

  Object.assign(root.guides, {
    "trajectory-kinematics": guide(
      "01 / 14",
      "轨迹先于运动方程",
      md`动力学首先研究一条随时间变化的欧式空间轨迹 $\mathbf r:I\to E$。速度和加速度不是额外数据，而是轨迹的一阶、二阶导数；在写 $\mathbf F=m\ddot{\mathbf r}$ 之前，必须先说明这些导数存在。`,
      ["从轨迹定义速度与加速度", "区分位置、位移、速度和加速度的几何类型", "理解初值对二阶运动方程的作用"],
      md`静力学只检查某一时刻的平衡；动力学则比较相邻时刻。若轨迹只有连续性，位置有意义但速度未必存在；若只可微一次，加速度仍未定义。因此正则性假设是运动方程能够书写的前提，而不是技术性装饰。`,
      [
        section("轨迹与导数", md`设 $E=\mathbb R^n$。轨迹是函数 $\mathbf r:I\to E$；速度为 $\mathbf v(t)=\dot{\mathbf r}(t)$，加速度为 $\mathbf a(t)=\ddot{\mathbf r}(t)$。两者属于平移向量空间，而 $\mathbf r(t)$ 在更内禀的模型中属于仿射点空间。`, `abbrev VecN (n : ℕ) := Fin n → ℝ
abbrev Trajectory (n : ℕ) := ℝ → VecN n

-- 数学接口示意
velocity r t := deriv r t
acceleration r t := deriv (velocity r) t`),
        section("二阶方程需要两份初值", md`二阶运动方程通常不能只由初始位置确定。给定 $\mathbf r(t_0)=\mathbf r_0$ 与 $\dot{\mathbf r}(t_0)=\mathbf v_0$，才可能选定唯一轨迹。形式化时，“这是该方程的解”与“该解存在且唯一”应分成不同命题。`, `structure InitialData (n : ℕ) where
  t₀ : ℝ
  r₀ : VecN n
  v₀ : VecN n`),
        section("参考系与导数", md`在惯性系之间做恒速平移时，加速度不变；在加速或旋转参考系中，坐标二阶导数会出现惯性项。第三单元默认固定一个惯性欧式参考系，直到刚体与达朗贝尔原理处再明确讨论广义坐标。`, "", ["惯性系：牛顿第二定律直接使用实际合力。", "匀速平移坐标：速度改变常向量，加速度不变。", "加速或旋转坐标：必须加入惯性力，不能直接照搬 $\mathbf F=m\mathbf a$。"])
      ],
      [
        step(md`$$\mathbf v(t)=\frac{d\mathbf r}{dt}(t)$$`, "速度是轨迹在时刻 $t$ 的切向变化率。"),
        step(md`$$\mathbf a(t)=\frac{d\mathbf v}{dt}(t)=\frac{d^2\mathbf r}{dt^2}(t)$$`, "加速度要求更强的二阶正则性。"),
        step(md`$$\mathbf r(t_0)=\mathbf r_0,\qquad \mathbf v(t_0)=\mathbf v_0$$`, "两份初值与二阶方程的阶数相匹配。"),
        step(md`$$\mathbf r(t)=\mathbf r_0+\mathbf v_0\Delta t+\frac12\mathbf a\Delta t^2$$`, "仅在加速度恒定时得到熟悉的多项式轨迹。")
      ],
      [
        mapping("轨迹", "Trajectory n := ℝ → VecN n", "先采用透明的全时间坐标模型。"),
        mapping("速度与加速度", "deriv r t / deriv (deriv r) t", "复用 Mathlib 导数接口，并把可微性作为假设。"),
        mapping("初值", "InitialData n", "位置和速度共同约束二阶解。")
      ],
      worked("例：恒加速度轨迹", md`质点满足常加速度 $\mathbf a$，且在 $t=0$ 时位置、速度为 $\mathbf r_0,\mathbf v_0$。`, [
        md`积分 $\dot{\mathbf v}=\mathbf a$，得到 $\mathbf v(t)=\mathbf v_0+\mathbf a t$。`,
        md`再次积分得到 $\mathbf r(t)=\mathbf r_0+\mathbf v_0t+\tfrac12\mathbf a t^2$。`,
        md`代入 $t=0$ 检查两份初值。`,
        md`对轨迹求两次导数恢复 $\mathbf a$，完成反向核验。`
      ], md`运动学公式来自积分和初值；若 $\mathbf a$ 依赖位置或速度，就不能继续使用该二次多项式。`),
      ["轨迹的正则性决定能否谈速度和加速度。", "二阶运动方程通常需要位置、速度两份初值。", "本单元默认固定惯性欧式参考系。"],
      {question:md`为什么仅给出 $\mathbf r(t_0)$ 通常不能唯一决定满足二阶方程的轨迹？`,answer:"因为不同初速度可以从同一位置出发并满足同一个二阶方程；还需要速度初值或等价边界条件。"},
      "这里只把导数接口与物理对象对齐，不形式化一般常微分方程的存在唯一性；后续关卡把需要的轨迹正则性作为显式假设。"
    ),

    "newton-laws": guide(
      "02 / 14",
      "牛顿定律作为欧式向量方程",
      md`牛顿第二定律不是三个互不相关的标量式，而是惯性系中的向量方程 $\mathbf F_{\mathrm{net}}(t)=m\ddot{\mathbf r}(t)$。质量的正性、合力的系统边界和参考系选择都应进入形式化陈述。`,
      ["写出牛顿三定律的数学角色", "由合力和质量恢复加速度", "分类处理零合力、零质量和非惯性系"],
      md`第一定律确定“哪些参考系允许第二定律采用简单形式”；第二定律给出演化方程；第三定律描述相互作用的成对结构。把三者全部压成一句 $F=ma$ 会丢失系统边界和内力消去的理由。`,
      [
        section("第二定律的类型结构", md`对质量 $m>0$ 的质点，合外力与加速度同属 $E$，等式 $\mathbf F=m\mathbf a$ 是向量等式。由它可得 $\mathbf a=m^{-1}\mathbf F$；若不假设 $m\ne0$，除法步骤在数学上就不合法。`, `def NewtonSecondLaw {n : ℕ}
    (m : ℝ) (force accel : VecN n) : Prop :=
  force = m • accel`),
        section("第三定律与系统边界", md`两质点相互作用时，$\mathbf F_{12}=-\mathbf F_{21}$。把两质点视为同一封闭系统后，这对内力在总动量方程中相消；若只研究其中一个质点，对方施加的力就是外力，不能删除。`, `def ActionReaction {n : ℕ}
    (F₁₂ F₂₁ : VecN n) : Prop :=
  F₁₂ = -F₂₁`),
        section("特殊情形", md`当 $\mathbf F=0$ 且 $m>0$ 时，$\mathbf a=0$，速度为常向量；这不是说位置不变。$m=0$ 的经典质点不在模型内。非惯性系中必须把坐标加速度产生的惯性项加入方程。`, "", ["$\mathbf F=0,m>0$：匀速直线运动，包括静止。", "$m=0$：经典质点模型退化，不能从 $m\mathbf a=0$ 推出 $\mathbf a=0$。", "变质量系统：$\mathbf F=m\mathbf a$ 通常不足，应使用动量通量方程。"])
      ],
      [
        step(md`$$\mathbf F_{\mathrm{net}}(t)=m\ddot{\mathbf r}(t)$$`, "这是惯性参考系中的二阶向量微分方程。"),
        step(md`$$m>0\Longrightarrow\ddot{\mathbf r}=\frac1m\mathbf F_{\mathrm{net}}$$`, "质量正性保证可以除以 $m$。"),
        step(md`$$\mathbf F_{12}+\mathbf F_{21}=0$$`, "作用反作用在封闭系统求和中消去。"),
        step(md`$$\mathbf F_{\mathrm{net}}=0\Longrightarrow\dot{\mathbf r}=\text{constant}$$`, "还需轨迹可微与时间区间连通等分析条件。")
      ],
      [
        mapping("合外力", "force : ℝ → VecN n", "先声明系统边界后再求和。"),
        mapping("质量正性", "(hm : 0 < m)", "同时给出非零性和物理可接受性。"),
        mapping("牛顿方程", "∀ t, force t = m • acceleration r t", "逐时刻陈述向量等式。")
      ],
      worked("例：恒力质点", md`质量 $m>0$ 的质点受恒力 $\mathbf F_0$，求加速度与轨迹。`, [
        md`由牛顿第二定律得 $\mathbf a=\mathbf F_0/m$。`,
        md`恒力与恒质量使加速度为常向量。`,
        md`积分得到 $\mathbf v(t)=\mathbf v_0+(\mathbf F_0/m)t$。`,
        md`再次积分得到 $\mathbf r(t)=\mathbf r_0+\mathbf v_0t+(\mathbf F_0/2m)t^2$。`
      ], md`这个显式解依赖恒力、恒质量和惯性系；任何一个条件改变都需要重新建立运动方程。`),
      ["第一定律确定惯性系，第二定律给出演化，第三定律组织相互作用。", "质量正性是求加速度时不可省略的假设。", "内力是否消去取决于系统边界。"],
      {question:md`为什么 $\mathbf F_{\mathrm{net}}=0$ 推出的是速度恒定，而不是位置恒定？`,answer:md`因为它先给出 $\ddot{\mathbf r}=0$；积分后 $\dot{\mathbf r}=\mathbf v_0$，只有再假设 $\mathbf v_0=0$ 才得到位置恒定。`},
      "采用恒质量经典质点与惯性参考系；不覆盖相对论、变质量火箭、冲击产生的分布力或一般弱解。"
    ),

    "momentum-dynamics": guide(
      "03 / 14",
      "动量定理与系统守恒",
      md`动量 $\mathbf p=m\mathbf v$ 把牛顿方程改写成 $\dot{\mathbf p}=\mathbf F_{\mathrm{ext}}$。对多质点系统求和后，成对内力消去，从而得到总动量定理与质心运动方程。`,
      ["从牛顿定律推导动量定理", "说明内力消去的条件", "区分瞬时守恒与冲量形式"],
      md`动量语言特别适合系统边界清晰、内力满足作用反作用的多体系统。守恒并不是“没有任何力”，而是外力合量为零；系统内部仍可发生剧烈相互作用。`,
      [
        section("单质点与冲量", md`恒质量时 $\mathbf p=m\mathbf v$，所以 $\dot{\mathbf p}=m\mathbf a=\mathbf F$。在时间区间上积分得到 $\mathbf p(t_1)-\mathbf p(t_0)=\int_{t_0}^{t_1}\mathbf F(t)\,dt$。`, `def momentum {n : ℕ} (m : ℝ) (v : VecN n) := m • v

def impulseBalance (p₀ p₁ J : VecN n) : Prop :=
  p₁ - p₀ = J`),
        section("多质点系统", md`总动量 $\mathbf P=\sum_i m_i\mathbf v_i$。若内力满足 $\mathbf F_{ij}=-\mathbf F_{ji}$，双重求和中每对内力相消，只留下外力：$\dot{\mathbf P}=\mathbf F_{\mathrm{ext}}$。`, `def totalMomentum (particles : List (ℝ × VecN n)) : VecN n :=
  particles.foldr (fun x acc => x.1 • x.2 + acc) 0`),
        section("质心与分类", md`总质量 $M=\sum_i m_i>0$ 时，质心速度满足 $M\dot{\mathbf R}_{\mathrm{cm}}=\mathbf P$，进而 $M\ddot{\mathbf R}_{\mathrm{cm}}=\mathbf F_{\mathrm{ext}}$。若系统交换质量，边界通量会破坏这个简单形式。`, "", ["封闭系统且外力零：总动量守恒。", "外力冲量有限：总动量按冲量改变。", "开放或变质量系统：必须加入跨边界动量通量。"])
      ],
      [
        step(md`$$\mathbf p=m\mathbf v$$`, "恒质量质点的线动量。"),
        step(md`$$\dot{\mathbf p}=\mathbf F_{\mathrm{ext}}$$`, "动量定理是牛顿第二定律的更适合系统求和的形式。"),
        step(md`$$\mathbf P(t_1)-\mathbf P(t_0)=\int_{t_0}^{t_1}\mathbf F_{\mathrm{ext}}(t)\,dt$$`, "积分形式允许处理有限时间冲量。"),
        step(md`$$\mathbf F_{\mathrm{ext}}=0\Longrightarrow\mathbf P=\text{constant}$$`, "守恒只要求外力合量为零。")
      ],
      [
        mapping("单质点动量", "momentum m v", "由实数数乘欧式向量。"),
        mapping("总动量", "List.sum", "有限系统逐项求和。"),
        mapping("守恒", "∀ t, P t = P t₀", "应区分导数为零与全局常值结论所需的分析假设。")
      ],
      worked("例：一维完全非弹性碰撞", md`质量 $m_1,m_2>0$ 的两物体碰后粘在一起，碰前速度为 $v_1,v_2$，忽略外冲量。`, [
        md`封闭系统总动量守恒：$m_1v_1+m_2v_2=(m_1+m_2)v$。`,
        md`总质量正，所以可除以 $m_1+m_2$。`,
        md`得到 $v=(m_1v_1+m_2v_2)/(m_1+m_2)$。`,
        md`动能通常不守恒；损失转化为内能、形变等。`
      ], md`动量守恒不蕴含机械能守恒。碰撞类型必须通过额外恢复系数或能量条件区分。`),
      ["动量定理的系统形式只保留外力。", "冲量等于动量增量。", "动量守恒与动能守恒是独立条件。"],
      {question:"为什么碰撞过程中内力很大，却仍可能使用总动量守恒？",answer:"若把两个物体一起作为系统，内力成对相消；只要碰撞时间内外冲量可忽略，总动量仍守恒。"},
      "只处理有限个恒质量质点和经典作用反作用内力；连续介质、火箭方程与冲击的测度论处理留作后续扩展。"
    ),

    "angular-momentum": guide(
      "04 / 14",
      "角动量是位置与动量的外积",
      md`一般 $\mathbb R^n$ 中，关于点 $o$ 的角动量应定义为反对称二阶张量 $\mathbf L_o=(\mathbf r-o)\wedge\mathbf p$。其导数等于外力矩；三维角动量向量只是 Hodge 对偶后的专门表示。`,
      ["在一般维数定义角动量", "推导角动量定理", "由中心力推出角动量与轨道平面守恒"],
      md`静力学中的力矩 $\mathbf r\wedge\mathbf F$ 与动力学中的角动量 $\mathbf r\wedge\mathbf p$ 属于同一个几何空间 $\Lambda^2E$，这使定理 $\dot{\mathbf L}=\boldsymbol\tau$ 成为外积乘法法则的直接结果。`,
      [
        section("一般维定义", md`设 $\mathbf p=m\dot{\mathbf r}$。角动量分量为 $L_{ij}=r_ip_j-r_jp_i$，自动满足 $L_{ij}=-L_{ji}$。在三维选择定向后，它对应 $\mathbf r\times\mathbf p$。`, `def angularMomentum {n : ℕ} (r p : VecN n) : MomentTensor n :=
  wedge r p`),
        section("角动量定理", md`求导得到 $\dot{\mathbf L}=\dot{\mathbf r}\wedge\mathbf p+\mathbf r\wedge\dot{\mathbf p}$。第一项因 $\mathbf p=m\dot{\mathbf r}$ 平行于速度而为零；第二项用 $\dot{\mathbf p}=\mathbf F$ 化成力矩。`, `-- 证明结构：
-- deriv (wedge r p)
-- = wedge (deriv r) p + wedge r (deriv p)
-- = 0 + wedge r F`),
        section("守恒与平面性", md`若外力矩为零，则角动量守恒。中心力 $\mathbf F=f(r)\mathbf r$ 与位置平行，因此 $\mathbf r\wedge\mathbf F=0$。三维中非零恒定角动量向量垂直于 $\mathbf r$ 与 $\mathbf v$，轨道被限制在固定平面。`, "", ["$\mathbf L=0$：可能是径向运动，不能由角动量确定唯一轨道平面。", "$\mathbf L\ne0$：三维轨道位于垂直于 $\mathbf L$ 的固定平面。", "非中心外力矩：角动量按 $\dot{\mathbf L}=\boldsymbol\tau$ 改变。"])
      ],
      [
        step(md`$$\mathbf L_o=(\mathbf r-o)\wedge\mathbf p$$`, "一般维角动量是二形式。"),
        step(md`$$\dot{\mathbf L}=\dot{\mathbf r}\wedge\mathbf p+\mathbf r\wedge\dot{\mathbf p}$$`, "使用外积的乘法求导法则。"),
        step(md`$$\dot{\mathbf r}\wedge m\dot{\mathbf r}=0$$`, "平行向量的外积为零。"),
        step(md`$$\dot{\mathbf L}=\mathbf r\wedge\mathbf F=\boldsymbol\tau$$`, "得到角动量定理。")
      ],
      [
        mapping("角动量", "wedge r (momentum m v)", "与一般维力矩共享 MomentTensor n。"),
        mapping("角动量定理", "HasDerivAt", "导数乘法法则需要轨迹和动量可微。"),
        mapping("守恒", "torque = 0", "再用导数为零推出连通区间上常值。")
      ],
      worked("例：中心力为什么给出等面积定律", md`三维质点受 $\mathbf F=f(r)\mathbf r$，且角动量 $\mathbf L\ne0$。`, [
        md`中心力与 $\mathbf r$ 平行，所以 $\boldsymbol\tau=\mathbf r\times\mathbf F=0$。`,
        md`角动量定理给 $\dot{\mathbf L}=0$，故 $\mathbf L$ 恒定。`,
        md`单位时间扫过面积为 $\dot A=\tfrac12\lVert\mathbf r\times\mathbf v\rVert=\lVert\mathbf L\rVert/(2m)$。`,
        md`因此相等时间扫过相等面积，这正是开普勒第二定律的动力学来源。`
      ], md`等面积定律对任意中心力成立，并不依赖力一定是反平方律。`),
      ["一般维角动量属于反对称二阶张量空间。", "角动量定理由外积求导和动量定理给出。", "中心力直接推出角动量守恒与等面积定律。"],
      {question:"开普勒第二定律为什么不能反过来单独确定引力一定是反平方律？",answer:"等面积定律只说明力矩为零，即力是中心力；许多不同径向依赖的中心力都满足它。"},
      "角动量导数推导把乘法求导、动量定理与轨迹正则性作为假设；三维轨道平面结论另需非零角动量。"
    ),

    "energy-dynamics": guide(
      "05 / 14",
      "动能定理与机械能守恒",
      md`动能定理来自把牛顿方程与速度做内积：$\dot T=\langle\mathbf F,\mathbf v\rangle$。若力来自势能 $V$，则 $\dot V=-\langle\mathbf F,\mathbf v\rangle$，两式相加得到机械能守恒。`,
      ["由牛顿第二定律推导动能定理", "证明保守力下机械能守恒", "分类处理耗散力与显含时间势能"],
      md`能量方法把向量运动方程投影到实际速度方向，得到一个标量守恒量。它通常比完整轨迹信息弱，却足以分类可达区域、转向点与轨道类型。`,
      [
        section("瞬时功率与动能", md`对恒质量质点，$T=\tfrac12m\lVert\mathbf v\rVert^2$。求导并代入 $m\dot{\mathbf v}=\mathbf F$，得到 $\dot T=\langle\mathbf F,\mathbf v\rangle$。`, `def kineticEnergy {n : ℕ} (m : ℝ) (v : VecN n) : ℝ :=
  (1 / 2 : ℝ) * m * dotProduct v v`),
        section("保守力与机械能", md`若 $\mathbf F=-\nabla V$ 且 $V$ 不显含时间，则沿轨迹 $\dot V=\langle\nabla V,\mathbf v\rangle=-\langle\mathbf F,\mathbf v\rangle$。所以 $E=T+V$ 的导数为零。`, `def mechanicalEnergy (T V : ℝ) : ℝ := T + V

-- dT/dt = power
-- dV/dt = -power
-- hence d(T+V)/dt = 0`),
        section("耗散与特殊情况", md`若存在线性阻尼 $\mathbf F_d=-c\mathbf v$，则 $\dot E=-c\lVert\mathbf v\rVert^2\le0$。若势能显含时间，机械能变化还包含 $\partial V/\partial t$。因此“有势能”与“机械能守恒”之间还需要时间不变性。`, "", ["保守、自治系统：$E=T+V$ 守恒。", "阻尼系统：机械能单调下降，但总能量包含环境热量后仍可守恒。", "显含时间势能：即使力为梯度型，机械能也可被外部参数注入或抽取。"])
      ],
      [
        step(md`$$T=\frac12m\lVert\mathbf v\rVert^2$$`, "动能由速度的欧式范数定义。"),
        step(md`$$\dot T=m\langle\dot{\mathbf v},\mathbf v\rangle$$`, "使用内积对称性与乘法求导。"),
        step(md`$$\dot T=\langle\mathbf F,\mathbf v\rangle=P$$`, "牛顿方程把质量乘加速度替换成合力。"),
        step(md`$$\mathbf F=-\nabla V\Longrightarrow\frac d{dt}(T+V)=0$$`, "链式法则使势能变化率抵消功率。")
      ],
      [
        mapping("动能", "kineticEnergy m v", "标量值，但依赖欧式内积。"),
        mapping("瞬时功率", "dotProduct F v", "力与速度的内积。"),
        mapping("机械能", "kineticEnergy m v + V r", "守恒证明需要导数与链式法则假设。")
      ],
      worked("例：一维势阱的可达区域", md`质量 $m>0$ 的质点在势能 $V(x)$ 中运动，总能量为常数 $E$。`, [
        md`由 $E=\tfrac12m\dot x^2+V(x)$ 得 $\tfrac12m\dot x^2=E-V(x)$。`,
        md`动能非负，所以可达位置必须满足 $V(x)\le E$。`,
        md`满足 $V(x)=E$ 的位置是转向点，此时瞬时速度为零。`,
        md`若可达集合分成多个连通分支，轨迹不能在有限连续运动中跨越禁止区 $V>E$。`
      ], md`能量守恒能确定可达区域和转向点，但通常不能单独给出 $x(t)$ 的显式表达。`),
      ["动能定理是牛顿方程沿速度方向的投影。", "保守且自治时机械能守恒。", "能量守恒可用于分类轨道，而不必先求解时间参数。"],
      {question:"为什么受阻尼的质点仍可满足总能量守恒，却不满足机械能守恒？",answer:"机械能转化为环境内能；若把环境也纳入封闭系统，总能量仍守恒，但质点的 $T+V$ 下降。"},
      "只处理恒质量、有限维欧式空间中的光滑轨迹；不展开碰撞跃变、非光滑势能与热力学环境的完整形式化。"
    ),

    "mass-stiffness": guide(
      "06 / 14",
      "质量矩阵与刚度矩阵",
      md`多自由度小振动在平衡点附近可写为 $M\ddot q+Kq=0$。质量矩阵 $M$ 定义动能度量，刚度矩阵 $K$ 是势能 Hessian；对稳定、无约束系统，二者通常对称且 $M$ 正定、$K$ 半正定或正定。`,
      ["从能量二次型理解 M 与 K", "由平衡点线性化得到小振动方程", "分类正定、半正定与奇异矩阵"],
      md`矩阵并非从离散算法中凭空出现：$M$ 来自动能关于广义速度的二次型，$K$ 来自势能在平衡点的二阶 Taylor 项。它们的对称性和正定性具有直接物理含义。`,
      [
        section("能量二次型", md`对广义坐标 $q\in\mathbb R^N$，线性系统的动能与势能写成 $T=\tfrac12\dot q^{\mathsf T}M\dot q$、$V=\tfrac12q^{\mathsf T}Kq$。$M>0$ 表示任何非零速度都具有正动能。`, `def quadraticEnergy {N : ℕ}
    (A : Matrix (Fin N) (Fin N) ℝ) (x : Fin N → ℝ) : ℝ :=
  (1 / 2 : ℝ) * dotProduct x (A.mulVec x)`),
        section("线性化来源", md`在平衡点 $q_0$ 处令 $\eta=q-q_0$。势能一阶项因 $\nabla V(q_0)=0$ 消失，二阶项由 Hessian 给出 $K$。忽略三阶及以上项后得到 $M\ddot\eta+K\eta=0$。`, `structure LinearOscillator (N : ℕ) where
  mass : Matrix (Fin N) (Fin N) ℝ
  stiffness : Matrix (Fin N) (Fin N) ℝ`),
        section("退化分类", md`$M$ 奇异通常表示坐标含冗余或系统带代数约束；$K$ 有零模可能表示刚体运动或中性方向；$K$ 有负方向则意味着所选平衡点在线性近似下不稳定。`, "", ["$M>0,K>0$：所有固有频率平方为正。", "$M>0,K\ge0$：可能存在零频刚体模或对称模。", "$K$ 不定：存在指数增长方向。", "$M$ 奇异：不能直接化成普通二阶 ODE。"])
      ],
      [
        step(md`$$T=\frac12\dot q^{\mathsf T}M\dot q$$`, "质量矩阵定义广义速度空间上的动能二次型。"),
        step(md`$$V(q_0+\eta)=V(q_0)+\frac12\eta^{\mathsf T}K\eta+O(\lVert\eta\rVert^3)$$`, "刚度矩阵是平衡点处 Hessian。"),
        step(md`$$M\ddot\eta+K\eta=0$$`, "保留二阶能量项得到线性小振动方程。"),
        step(md`$$M>0,\quad K\ge0$$`, "分别编码正动能与非负二阶势能。")
      ],
      [
        mapping("质量/刚度矩阵", "Matrix (Fin N) (Fin N) ℝ", "有限自由度下的坐标表示。"),
        mapping("对称性", "Matrix.IsSymm", "来自二次型与 Hessian。"),
        mapping("正定性", "∀ x ≠ 0, 0 < dotProduct x (M.mulVec x)", "直接表达任意非零速度动能为正。")
      ],
      worked("例：两个相同质量、三根弹簧", md`两质量均为 $m$，两端与中间弹簧刚度均为 $k$，位移为 $q=(x_1,x_2)$。`, [
        md`动能 $T=\tfrac12m(\dot x_1^2+\dot x_2^2)$，所以 $M=mI$。`,
        md`势能 $V=\tfrac12k x_1^2+\tfrac12k(x_2-x_1)^2+\tfrac12k x_2^2$。`,
        md`展开得到 $K=k\begin{pmatrix}2&-1\\-1&2\end{pmatrix}$。`,
        md`$K$ 的两个方向 $(1,1)$、$(1,-1)$ 分别对应同相与反相振动。`
      ], md`矩阵条目由能量几何推导；后续广义特征值问题给出两个固有频率。`),
      ["M 来自动能二次型，K 来自势能 Hessian。", "对称性与正定性不是数值便利，而是物理结构。", "奇异与零模必须按约束和刚体运动分类。"],
      {question:"为什么自由刚体系统的 K 常有零模？",answer:"整体平移或转动不改变内部弹性势能，因此沿这些刚体方向二阶势能为零。"},
      "只讨论有限自由度、无陀螺项和小振幅线性化；阻尼、非保守随动力与奇异约束需更一般的矩阵铅笔。"
    ),

    "modal-eigen": guide(
      "07 / 14",
      "广义特征值决定固有频率",
      md`把试探解 $q(t)=\phi e^{i\omega t}$ 代入 $M\ddot q+Kq=0$，得到 $K\phi=\omega^2M\phi$。这不是普通 $K$ 的特征值问题，因为质量矩阵定义了真正的正交结构。`,
      ["推导广义特征值问题", "理解固有频率平方与稳定性的关系", "证明不同模态的 M-正交性"],
      md`模态分析把耦合振动分解为若干互不耦合的正常模式。精确理论依赖 $M$ 正定、$K$ 对称；若这些条件失败，特征值可能为零、负数甚至复数。`,
      [
        section("从谐波试探解到矩阵方程", md`取 $q(t)=\phi\cos\omega t$，则 $\ddot q=-\omega^2q$。代回运动方程并约去时间因子，得到 $(K-\omega^2M)\phi=0$。`, `def GeneralizedEigenpair {N : ℕ}
    (M K : Matrix (Fin N) (Fin N) ℝ)
    (lambda : ℝ) (phi : Fin N → ℝ) : Prop :=
  phi ≠ 0 ∧ K.mulVec phi = lambda • M.mulVec phi`),
        section("频率与稳定性", md`当 $M>0$、$K\ge0$ 时，Rayleigh 商 $\lambda=(\phi^{\mathsf T}K\phi)/(\phi^{\mathsf T}M\phi)\ge0$，故 $\omega=\sqrt\lambda$ 为实数。$\lambda=0$ 是零频模，$\lambda<0$ 对应指数增长而非振荡。`, ""),
        section("M-正交性", md`若 $K\phi_i=\lambda_iM\phi_i$、$K\phi_j=\lambda_jM\phi_j$，且 $M,K$ 对称，则两式交叉配对并相减得到 $(\lambda_i-\lambda_j)\phi_i^{\mathsf T}M\phi_j=0$。不同特征值时即得 $M$-正交。`, "", ["不同特征值：自动 $M$-正交。", "重特征值：需在特征子空间内选择 $M$-正交基。", "零特征值：检查刚体模、对称性或欠约束。"])
      ],
      [
        step(md`$$q(t)=\phi\cos\omega t$$`, "正常模态保持固定空间形状，只让振幅随时间振荡。"),
        step(md`$$\ddot q(t)=-\omega^2\phi\cos\omega t$$`, "时间二阶导数产生 $-\omega^2$。"),
        step(md`$$K\phi=\omega^2M\phi$$`, "得到广义特征值问题。"),
        step(md`$$\lambda=\omega^2=\frac{\phi^{\mathsf T}K\phi}{\phi^{\mathsf T}M\phi}$$`, "Rayleigh 商连接能量比与固有频率。")
      ],
      [
        mapping("模态向量", "phi : Fin N → ℝ", "非零广义坐标方向。"),
        mapping("广义特征对", "GeneralizedEigenpair M K lambda phi", "直接保存 $K\phi=\lambda M\phi$。"),
        mapping("M-内积", "dotProduct x (M.mulVec y)", "质量矩阵定义模态正交。")
      ],
      worked("例：两质量系统的两个频率", md`沿用上一关 $M=mI$、$K=k\begin{pmatrix}2&-1\\-1&2\end{pmatrix}$。`, [
        md`对同相模态 $\phi_1=(1,1)$，有 $K\phi_1=k\phi_1$。`,
        md`所以 $\omega_1^2=k/m$。`,
        md`对反相模态 $\phi_2=(1,-1)$，有 $K\phi_2=3k\phi_2$。`,
        md`所以 $\omega_2^2=3k/m$，且 $\phi_1^{\mathsf T}M\phi_2=0$。`
      ], md`反相振动拉伸中间弹簧更多，因此具有更高固有频率。`),
      ["正常模态把耦合系统分解为标量振子。", "频率平方是广义特征值。", "正定质量矩阵决定正确的模态正交关系。"],
      {question:"为什么不能在一般情况下只求 $K$ 的普通特征值作为频率平方？",answer:"因为坐标方向的惯性权重由 M 决定；只有 M=I 或经过质量归一化后，问题才化为普通特征值问题。"},
      "只讨论实对称 $M,K$ 的有限维保守系统；非对称、阻尼和陀螺系统的复模态不在本关范围。"
    ),

    "inertia-tensor": guide(
      "08 / 14",
      "惯性张量是转动动能的二次型",
      md`刚体绕角速度 $\boldsymbol\omega$ 转动时，质点速度为 $\boldsymbol\omega\times\mathbf r$。把所有质点动能相加，可写成 $T=\tfrac12\boldsymbol\omega^{\mathsf T}I\boldsymbol\omega$，其中 $I$ 是对称半正定惯性张量。`,
      ["从质点系推导惯性张量", "理解主惯量与主轴", "推导平行轴定理并分类退化情况"],
      md`惯性张量不是三个转动惯量的列表，而是一个与参考点有关的对称线性算子。选到其正交特征基后，转动动能才分解为三个无交叉项。`,
      [
        section("质点系定义", md`相对参考点的位置为 $\mathbf r_a$，质量为 $m_a$。三维惯性张量为 $I=\sum_a m_a(\lVert\mathbf r_a\rVert^2\mathbf 1-\mathbf r_a\mathbf r_a^{\mathsf T})$。`, `def inertiaEntry
    (particles : List (ℝ × Vec3)) (i j : Fin 3) : ℝ :=
  particles.foldr (fun x acc =>
    x.1 * ((dotProduct x.2 x.2) * (if i = j then 1 else 0)
      - x.2 i * x.2 j) + acc) 0`),
        section("主轴", md`$I$ 对称，所以存在正交特征基。若 $I\mathbf e_i=I_i\mathbf e_i$，则 $T=\tfrac12(I_1\omega_1^2+I_2\omega_2^2+I_3\omega_3^2)$。重特征值意味着相应主轴不唯一。`, ""),
        section("平行轴与退化", md`总质量 $M$ 的刚体，参考点从质心平移 $\mathbf a$ 后，$I_O=I_C+M(\lVert\mathbf a\rVert^2\mathbf 1-\mathbf a\mathbf a^{\mathsf T})$。若所有质量点在同一直线上，绕该直线的惯量可为零。`, "", ["三维实体：通常 $I>0$。", "共线质点：沿直线方向可能出现零惯量。", "重主惯量：对应平面内任意正交方向都可作主轴。"])
      ],
      [
        step(md`$$\mathbf v_a=\boldsymbol\omega\times\mathbf r_a$$`, "刚体转动给出每个质点的速度。"),
        step(md`$$T=\frac12\sum_am_a\lVert\boldsymbol\omega\times\mathbf r_a\rVert^2$$`, "总动能为各质点动能之和。"),
        step(md`$$I=\sum_am_a(\lVert\mathbf r_a\rVert^2\mathbf1-\mathbf r_a\mathbf r_a^{\mathsf T})$$`, "使用叉积范数恒等式提取关于 $\boldsymbol\omega$ 的二次型。"),
        step(md`$$T=\frac12\boldsymbol\omega^{\mathsf T}I\boldsymbol\omega$$`, "惯性张量正是转动动能的矩阵。")
      ],
      [
        mapping("惯性张量", "Matrix (Fin 3) (Fin 3) ℝ", "三维坐标中的对称算子。"),
        mapping("主轴", "I.mulVec e = lambda • e", "普通对称特征值问题。"),
        mapping("正定/半正定", "dotProduct omega (I.mulVec omega)", "等于两倍转动动能。")
      ],
      worked("例：两点质量组成的哑铃", md`两个质量均为 $m$，位于 $x$ 轴上的 $\pm a$。`, [
        md`每个质点相对质心距离平方为 $a^2$。`,
        md`绕 $x$ 轴转动时质点都在轴上，速度为零，所以 $I_x=0$。`,
        md`绕 $y$ 或 $z$ 轴时每个质点贡献 $ma^2$，所以 $I_y=I_z=2ma^2$。`,
        md`惯性张量在标准基下为 $\operatorname{diag}(0,2ma^2,2ma^2)$。`
      ], md`这是半正定而非正定的退化刚体；连续有厚度实体通常消除该零惯量。`),
      ["惯性张量由转动动能二次型定义。", "主轴是对称惯性算子的正交特征方向。", "参考点变化由平行轴定理控制。"],
      {question:"为什么球形对称刚体的任意过质心轴都是主轴？",answer:"球对称使惯性张量为标量矩阵 $I=c\mathbf1$；每个方向都是同一特征值的特征向量。"},
      "采用三维刚体与离散质点近似；连续体版本需把有限和替换为质量测度积分。"
    ),

    "euler-equations": guide(
      "09 / 14",
      "欧拉方程描述刚体自转",
      md`在随体主轴系中，角动量分量为 $L_i=I_i\omega_i$，但基底本身正在转动，因此惯性系导数不是简单的分量导数。由 $\dot{\mathbf L}+\boldsymbol\omega\times\mathbf L=\boldsymbol\tau$ 得到欧拉动力学方程。`,
      ["从旋转基底求导推导欧拉方程", "分析无外力矩的特殊转动", "理解中间轴不稳定性的能量—角动量几何"],
      md`欧拉方程是“角动量定理在旋转坐标中的分量形式”。非线性耦合项来自基底转动，而不是新的经验力。`,
      [
        section("旋转基底求导", md`任意随体向量 $\mathbf A$ 满足 $(d\mathbf A/dt)_{\rm space}=(d\mathbf A/dt)_{\rm body}+\boldsymbol\omega\times\mathbf A$。令 $\mathbf A=\mathbf L$ 并使用空间角动量定理即可。`, ""),
        section("主轴分量方程", md`在 $I=\operatorname{diag}(I_1,I_2,I_3)$ 中，欧拉方程为 $I_1\dot\omega_1+(I_3-I_2)\omega_2\omega_3=\tau_1$ 及循环置换。`, `def EulerResidual
    (I₁ I₂ I₃ ω₁ ω₂ ω₃ dω₁ τ₁ : ℝ) : ℝ :=
  I₁ * dω₁ + (I₃ - I₂) * ω₂ * ω₃ - τ₁`),
        section("自由刚体分类", md`无外力矩时，空间角动量与转动动能守恒。绕最大或最小主惯量轴的小扰动通常稳定，绕中间主惯量轴不稳定；球形转子 $I_1=I_2=I_3$ 时耦合项全部消失。`, "", ["球形转子：任意轴匀速转动。", "轴对称转子：对称轴分量恒定，横向分量进动。", "三轴刚体：最大/最小轴稳定，中间轴不稳定。"])
      ],
      [
        step(md`$$\left(\frac{d\mathbf L}{dt}\right)_{\!s}=\left(\frac{d\mathbf L}{dt}\right)_{\!b}+\boldsymbol\omega\times\mathbf L$$`, "空间系与随体系导数相差运输项。"),
        step(md`$$\mathbf L=I\boldsymbol\omega$$`, "主轴系中惯性张量为对角矩阵。"),
        step(md`$$I\dot{\boldsymbol\omega}+\boldsymbol\omega\times(I\boldsymbol\omega)=\boldsymbol\tau$$`, "欧拉方程的向量形式。"),
        step(md`$$I_1\dot\omega_1+(I_3-I_2)\omega_2\omega_3=\tau_1$$`, "第一主轴分量；其余由循环置换得到。")
      ],
      [
        mapping("主惯量", "I₁ I₂ I₃ : ℝ", "假设已在主轴基中对角化。"),
        mapping("角速度分量", "omega : Fin 3 → ℝ", "随体坐标中的三个分量。"),
        mapping("欧拉方程", "EulerResidual = 0", "先形式化代数残差，再接入时间导数。")
      ],
      worked("例：绕主轴的无力矩匀速转动", md`初始只有 $\omega_1\ne0$，且 $\omega_2=\omega_3=0$，外力矩为零。`, [
        md`第一式变为 $I_1\dot\omega_1=0$，所以 $\omega_1$ 恒定。`,
        md`第二、三式中的乘积项都含零分量，因此 $\dot\omega_2=\dot\omega_3=0$。`,
        md`轨迹保持纯主轴转动。`,
        md`若加入小扰动，稳定性还取决于 $I_1$ 是最大、中间还是最小主惯量。`
      ], md`“主轴纯转动是解”与“该解稳定”是两个不同层次的结论。`),
      ["欧拉非线性项来自旋转基底的运输定理。", "主轴系使惯性张量对角化。", "自由刚体的稳定性必须按主惯量顺序分类。"],
      {question:"为什么无外力矩时随体系中的角动量分量仍可变化？",answer:"空间角动量恒定，但随体基底自身旋转；同一空间向量在旋转基底中的坐标会变化。"},
      "只处理以质心为固定点的三维刚体主轴方程；不展开姿态群 SO(3)、四元数积分与接触动力学。"
    ),

    dalembert: guide(
      "10 / 14",
      "达朗贝尔原理把动力学写成瞬时平衡",
      md`把惯性项移到力的一侧，可将运动方程写成对所有许可虚位移的零虚功条件：$\sum_i(\mathbf F_i-m_i\mathbf a_i)\cdot\delta\mathbf r_i=0$。这不是说系统真的静止，而是把动力学残差与约束几何配对。`,
      ["从牛顿方程推导达朗贝尔原理", "理解惯性力是重写而非新相互作用", "利用理想约束消去未知反力"],
      md`静力学虚功只含实际力；达朗贝尔原理在同一结构中加入 $-m\mathbf a$。因此前两单元的内积、虚功和约束子空间可以直接复用到动力学。`,
      [
        section("动力学残差", md`对每个质点定义残差 $\mathbf R_i=\mathbf F_i-m_i\mathbf a_i$。牛顿方程等价于每个残差为零，因此必然与任意虚位移正交。`, `def dynamicResidual {n : ℕ}
    (F a : VecN n) (m : ℝ) : VecN n :=
  F - m • a`),
        section("理想约束的消元", md`把实际力分成主动外力与约束反力。理想约束反力对所有许可虚位移不做功，因此总式中约束反力消失，只剩主动外力与惯性项。`, `def dAlembertPower {n : ℕ}
    (F a deltaR : VecN n) (m : ℝ) : ℝ :=
  dotProduct (dynamicResidual F a m) deltaR`),
        section("逻辑方向与退化", md`若对**全部**向量测试，正定内积可恢复残差为零；若只对约束子空间测试，只能推出残差属于其正交补，也就是由约束反力承担的方向。`, "", ["无约束：全空间测试恢复牛顿方程。", "理想完整约束：只恢复切向运动方程。", "摩擦或非理想约束：约束力虚功不能删除。"])
      ],
      [
        step(md`$$\mathbf F_i-m_i\mathbf a_i=0$$`, "牛顿第二定律移项后的动力学残差。"),
        step(md`$$\sum_i(\mathbf F_i-m_i\mathbf a_i)\cdot\delta\mathbf r_i=0$$`, "与任意许可虚位移配对并求和。"),
        step(md`$$\sum_i\mathbf R_i^{\rm constraint}\cdot\delta\mathbf r_i=0$$`, "理想约束反力不做虚功。"),
        step(md`$$\sum_i(\mathbf F_i^{\rm active}-m_i\mathbf a_i)\cdot\delta\mathbf r_i=0$$`, "得到便于引入广义坐标的达朗贝尔形式。")
      ],
      [
        mapping("动力学残差", "dynamicResidual F a m", "力与惯性项仍属于同一向量空间。"),
        mapping("许可虚位移", "deltaR ∈ constraintSpace", "约束几何限制测试方向。"),
        mapping("达朗贝尔条件", "∀ deltaR ∈ C, dAlembertPower ... = 0", "用全称量化表达正交性。")
      ],
      worked("例：无摩擦圆环上的质点", md`质点被约束在固定圆环上，受重力和法向约束力。`, [
        "许可虚位移沿圆的切向，法向约束力与它正交。",
        md`达朗贝尔式中只剩重力切向分量与 $-m\mathbf a$ 的切向分量。`,
        md`取角坐标 $\theta$ 后，$\delta\mathbf r=(\partial\mathbf r/\partial\theta)\delta\theta$。`,
        md`因 $\delta\theta$ 任意，得到一个标量角运动方程，而无需先求法向反力。`
      ], md`达朗贝尔原理消去了理想约束反力，但并未说明约束反力不存在。`),
      ["惯性力是运动方程的重写项。", "理想约束反力通过虚功正交性消去。", "测试空间决定能恢复多少运动方程。"],
      {question:"为什么达朗贝尔原理看起来像平衡方程，却仍然描述加速运动？",answer:"因为所谓“平衡”包含了负惯性项 $-m\mathbf a$；它是瞬时动力学残差的零虚功，而不是实际合力为零。"},
      "采用理想、双边、光滑约束；摩擦、碰撞、单边接触需使用不等式或非光滑力学。"
    ),

    "lagrange-equations": guide(
      "11 / 14",
      "从达朗贝尔原理到拉格朗日方程",
      md`若约束通过广义坐标 $q=(q_1,\dots,q_s)$ 参数化，许可虚位移为 $\delta\mathbf r_i=\sum_j(\partial\mathbf r_i/\partial q_j)\delta q_j$。代入达朗贝尔原理并利用 $\delta q_j$ 任意，得到欧拉—拉格朗日方程。`,
      ["从许可虚位移推导广义方程", "理解 $L=T-V$ 的来源", "分类循环坐标、显含时间和非保守广义力"],
      md`这里不另建一个“拉格朗日力学”大单元，而把它作为欧式多质点约束动力学的自然坐标化结果。这样无需先形式化一般流形，也能准确展示公式的物理来源。`,
      [
        section("广义坐标与虚位移", md`设 $\mathbf r_i=\mathbf r_i(q,t)$。固定时刻的虚位移只改变 $q$，所以 $\delta\mathbf r_i=\sum_j\partial_{q_j}\mathbf r_i\,\delta q_j$。`, `structure GeneralizedModel (s n : ℕ) where
  position : (Fin s → ℝ) → ℝ → Fin n → ℝ`),
        section("从动能恒等式到方程", md`惯性项满足 $\sum_i m_i\mathbf a_i\cdot\partial_{q_j}\mathbf r_i=\frac d{dt}(\partial T/\partial\dot q_j)-\partial T/\partial q_j$。保守力的广义分量为 $-\partial V/\partial q_j$，于是得到 $d/dt(\partial L/\partial\dot q_j)-\partial L/\partial q_j=0$。`, ""),
        section("守恒与外力", md`若 $q_j$ 是循环坐标，即 $\partial L/\partial q_j=0$，则共轭动量 $p_j=\partial L/\partial\dot q_j$ 守恒。非保守力则在右端加入广义力 $Q_j$。`, "", ["保守自治系统：$L=T-V$，能量常有守恒形式。", "循环坐标：对应共轭动量守恒。", "非保守主动外力：方程右端为 $Q_j$。", "奇异 Lagrangian：不能直接解出所有加速度。"])
      ],
      [
        step(md`$$\delta\mathbf r_i=\sum_j\frac{\partial\mathbf r_i}{\partial q_j}\delta q_j$$`, "约束切空间由广义坐标偏导张成。"),
        step(md`$$\sum_i(\mathbf F_i-m_i\mathbf a_i)\cdot\delta\mathbf r_i=0$$`, "代入达朗贝尔原理。"),
        step(md`$$L(q,\dot q,t)=T(q,\dot q,t)-V(q,t)$$`, "保守系统的拉格朗日量。"),
        step(md`$$\frac d{dt}\frac{\partial L}{\partial\dot q_j}-\frac{\partial L}{\partial q_j}=Q_j^{\rm nc}$$`, "得到带非保守广义力的拉格朗日方程。")
      ],
      [
        mapping("广义坐标", "q : Fin s → ℝ", "只保留独立自由度。"),
        mapping("拉格朗日量", "L : State → ℝ", "状态包含 q、qdot 与时间。"),
        mapping("方程谓词", "LagrangeEquation", "把偏导与时间导数接口作为参数分层实现。")
      ],
      worked("例：单摆方程", md`长度 $\ell$、质量 $m$ 的理想单摆，以角度 $\theta$ 为广义坐标。`, [
        md`位置参数化给速度大小 $\ell\dot\theta$，故 $T=\tfrac12m\ell^2\dot\theta^2$。`,
        md`取最低点为零势能，$V=mg\ell(1-\cos\theta)$。`,
        md`$L=T-V$，计算 $\partial L/\partial\dot\theta=m\ell^2\dot\theta$ 与 $\partial L/\partial\theta=-mg\ell\sin\theta$。`,
        md`得到 $m\ell^2\ddot\theta+mg\ell\sin\theta=0$；除以 $m\ell$ 需 $m,\ell\ne0$。`
      ], md`小角近似 $\sin\theta\approx\theta$ 是后续线性化，不属于精确拉格朗日方程本身。`),
      ["拉格朗日方程是达朗贝尔原理在独立坐标中的表达。", "L=T−V 依赖保守力假设。", "循环坐标给出共轭动量守恒。"],
      {question:"为什么单摆的拉格朗日方程中没有显式出现绳张力？",answer:"角坐标已自动满足长度约束；张力沿径向，对许可切向虚位移不做功，因此在达朗贝尔到广义坐标的过程中被消去。"},
      "只讨论欧式空间中由光滑广义坐标参数化的完整约束；不建立一般构型流形、作用量泛函空间或 Noether 定理。"
    ),

    "central-force": guide(
      "12 / 14",
      "中心力把三维问题降为一维径向问题",
      md`中心势 $V(r)$ 只依赖 $r=\lVert\mathbf r\rVert$，因此力沿径向，角动量守恒，非径向轨道被限制在固定平面。能量进一步给出有效势 $V_{\rm eff}(r)=V(r)+\ell^2/(2mr^2)$。`,
      ["由中心力证明轨道平面性", "推导极坐标径向方程与有效势", "用有效势分类圆轨道和转向点"],
      md`中心力问题的关键不是直接求二阶向量方程，而是先利用对称性得到角动量和能量两个守恒量。它们把轨道几何压缩到平面极坐标中的一维径向运动。`,
      [
        section("角动量与面积速度", md`$\mathbf F=f(r)\mathbf r$ 给出零力矩，所以 $\ell=m r^2\dot\theta$ 为常数。若 $\ell\ne0$，面积速度 $\dot A=\ell/(2m)$ 恒定。`, ""),
        section("有效势", md`平面极坐标动能为 $T=\tfrac12m(\dot r^2+r^2\dot\theta^2)$。用 $\dot\theta=\ell/(mr^2)$ 消去角速度，得到 $E=\tfrac12m\dot r^2+V_{\rm eff}(r)$。`, `def effectivePotential (m ell : ℝ) (V : ℝ → ℝ) (r : ℝ) : ℝ :=
  V r + ell^2 / (2 * m * r^2)`),
        section("圆轨道与特殊情形", md`圆轨道要求 $r=r_0$ 恒定，因此 $V_{\rm eff}'(r_0)=0$；小径向稳定性再要求 $V_{\rm eff}''(r_0)>0$。$\ell=0$ 时退化为径向直线运动，极角不再提供有效自由度。`, "", ["$\ell\ne0$：存在离心势垒，轨道在固定平面内。", "$\ell=0$：纯径向运动，可能碰到中心奇点。", "$V_{\rm eff}'=0,V_{\rm eff}''>0$：稳定圆轨道。", "$V_{\rm eff}''<0$：圆轨道径向不稳定。"])
      ],
      [
        step(md`$$\mathbf F=f(r)\mathbf r\Longrightarrow\boldsymbol\tau=\mathbf r\times\mathbf F=0$$`, "中心力给出零力矩。"),
        step(md`$$\ell=mr^2\dot\theta=\text{constant}$$`, "角动量守恒消去角速度。"),
        step(md`$$E=\frac12m\dot r^2+\frac{\ell^2}{2mr^2}+V(r)$$`, "总能量分解为径向动能与有效势。"),
        step(md`$$V_{\rm eff}(r)=V(r)+\frac{\ell^2}{2mr^2}$$`, "三维中心力轨道化为一维势阱问题。")
      ],
      [
        mapping("中心势", "V : ℝ → ℝ", "输入是径向距离。"),
        mapping("有效势", "effectivePotential m ell V r", "要求 $m\ne0,r\ne0$。"),
        mapping("圆轨道条件", "deriv Veff r₀ = 0", "稳定性另看二阶导数。")
      ],
      worked("例：反平方引力的圆轨道", md`取 $V(r)=-\mu m/r$，其中 $\mu>0$。`, [
        md`有效势为 $V_{\rm eff}=\ell^2/(2mr^2)-\mu m/r$。`,
        md`求导得 $V_{\rm eff}'=-\ell^2/(mr^3)+\mu m/r^2$。`,
        md`令导数为零，得到 $r_0=\ell^2/(\mu m^2)$。`,
        md`在该点二阶导数为正，因此非零角动量圆轨道径向稳定。`
      ], md`圆轨道半径由角动量决定；$\ell=0$ 时不存在有限半径圆轨道。`),
      ["中心力的第一步是利用角动量守恒降维。", "有效势把角运动编码为离心势垒。", "圆轨道存在性与稳定性是两个导数条件。"],
      {question:"为什么有效势中的离心项不是一种新的真实力势能？",answer:"它来自用守恒角动量消去角速度，是径向约化产生的运动学项；在完整向量方程中没有额外相互作用。"},
      "假设 $r>0$、恒质量和光滑中心势；中心碰撞、奇点延拓与弱解不在本关处理。"
    ),

    "kepler-orbits": guide(
      "13 / 14",
      "反平方律产生圆锥曲线轨道",
      md`对引力势 $V(r)=-\mu m/r$，中心力守恒量可把轨道方程化为 Binet 方程。令 $u(\theta)=1/r$，可解得 $r(\theta)=p/(1+e\cos(\theta-\theta_0))$，因此轨道按偏心率分类为椭圆、抛物线或双曲线。`,
      ["从反平方力推导 Binet 方程", "证明轨道具有圆锥曲线极坐标方程", "由能量判定偏心率与开普勒三定律"],
      md`完整形式化一般 ODE 解理论代价很高。本课程采取可完成的分层方式：把足够光滑、非碰撞轨迹和守恒量作为假设，严格验证轨道方程、偏心率—能量关系及椭圆周期律的代数几何核心。`,
      [
        section("Binet 约化", md`由 $\ell=mr^2\dot\theta$ 和 $u=1/r$，可把径向加速度写成 $-(\ell^2/m^2)u^2(u''+u)$。代入引力 $-\mu m u^2$ 后得到线性方程 $u''+u=\mu m^2/\ell^2$。`, ""),
        section("圆锥轨道", md`Binet 方程解为 $u=(1/p)(1+e\cos(\theta-\theta_0))$，其中 $p=\ell^2/(\mu m^2)>0$。取倒数得到焦点在力心的圆锥曲线极坐标方程。`, `def conicRadius (p e theta theta₀ : ℝ) : ℝ :=
  p / (1 + e * Real.cos (theta - theta₀))`),
        section("能量分类与三定律", md`偏心率满足 $e^2=1+2E\ell^2/(\mu^2m^3)$。所以 $E<0$ 对应 $e<1$ 的束缚椭圆，$E=0$ 为抛物线，$E>0$ 为双曲线。椭圆面积 $\pi ab$ 与恒定面积速度结合，得到 $T^2=(4\pi^2/\mu)a^3$。`, "", ["$e=0$：圆轨道。", "$0<e<1$：椭圆束缚轨道。", "$e=1$：抛物线逃逸临界轨道。", "$e>1$：双曲线散射轨道。", "$\ell=0$：径向碰撞/逃逸，圆锥极角公式退化。"])
      ],
      [
        step(md`$$u(\theta)=\frac1{r(\theta)},\qquad \ell=mr^2\dot\theta$$`, "用角动量守恒把时间导数改写成角度导数。"),
        step(md`$$u''+u=\frac{\mu m^2}{\ell^2}=\frac1p$$`, "反平方律恰好使 Binet 方程右端为常数。"),
        step(md`$$r(\theta)=\frac{p}{1+e\cos(\theta-\theta_0)}$$`, "轨道是以力心为焦点的圆锥曲线。"),
        step(md`$$e^2=1+\frac{2E\ell^2}{\mu^2m^3}$$`, "能量符号决定圆锥类型。")
      ],
      [
        mapping("圆锥半径", "conicRadius p e theta theta₀", "直接形式化轨道的极坐标图像。"),
        mapping("轨道类型", "e < 1 / e = 1 / 1 < e", "按偏心率分类讨论。"),
        mapping("开普勒第三定律", "period_sq_eq", "在椭圆几何与面积速度基础上证明。")
      ],
      worked("例：由能量判断行星轨道类型", md`给定非零角动量 $\ell$ 的反平方引力轨道，总机械能为 $E$。`, [
        md`计算 $e^2=1+2E\ell^2/(\mu^2m^3)$。`,
        md`若 $E<0$ 且非碰撞，则 $0\le e<1$，轨道为圆或椭圆。`,
        md`若 $E=0$，则 $e=1$，轨道为抛物线。`,
        md`若 $E>0$，则 $e>1$，轨道为双曲线；物体以非零无穷远速度逃逸。`
      ], md`开普勒第一定律来自反平方律；第二定律来自任意中心力；第三定律还使用椭圆面积和半长轴几何。`),
      ["反平方律把 Binet 方程化为常系数线性方程。", "偏心率—能量关系完成椭圆/抛物线/双曲线分类。", "开普勒三定律的动力学来源并不完全相同。"],
      {question:"为什么开普勒第二定律比第一、第三定律更一般？",answer:"第二定律只依赖零力矩即中心力；第一、第三定律的圆锥形状和周期—半长轴关系依赖反平方律。"},
      "证明针对足够光滑、非碰撞、非零角动量的经典轨迹；把一般 ODE 存在唯一性、碰撞正则化和圆锥几何等价封装为可独立验证的引理。"
    ),

    "dynamics-practice": guide(
      "14 / 14",
      "用守恒量和结构选择动力学工具",
      md`综合实验要求先判断系统类型，再选择牛顿、守恒量、模态、欧拉方程或广义坐标。没有一个 tactic 能代替这一步物理分类。`,
      ["建立动力学问题的统一审计顺序", "在守恒量、矩阵和广义坐标方法之间选择", "识别退化轨道、零模与非保守情形"],
      md`动力学最容易出现的错误不是最后一行代数，而是把不适用的守恒律用于开放系统、把静定性当稳定性，或在零角动量、奇异质量矩阵等退化情形中除以零。`,
      [
        section("第一步：确定系统与自由度", md`先说明粒子、刚体还是有限自由度振动；固定惯性系和系统边界；记录质量正性、约束与轨迹正则性。`, ""),
        section("第二步：寻找结构", md`平移对称提示动量，旋转对称提示角动量，自治保守系统提示机械能；小振动使用 $M,K$，刚体自转使用惯性张量与欧拉方程，完整约束使用达朗贝尔—拉格朗日。`, ""),
        section("第三步：分类边界", md`在求解前列出 $m=0$、$\ell=0$、$M$ 奇异、$K$ 零模、非保守力、显含时间与碰撞奇点等分支。只对满足假设的主分支应用除法、开方和守恒结论。`, "", ["外力/外冲量是否为零？", "势能是否存在且不显含时间？", "质量矩阵是否正定？", "角动量是否非零？", "轨迹是否避开 $r=0$ 奇点？"])
      ],
      [
        step(md`$$\text{model}\to\text{equation}\to\text{invariant}\to\text{classification}$$`, "先选模型，再寻找守恒量。"),
        step(md`$$\dot{\mathbf p}=\mathbf F_{\rm ext},\qquad\dot{\mathbf L}=\boldsymbol\tau_{\rm ext}$$`, "系统边界决定外力与外力矩。"),
        step(md`$$M\ddot q+Kq=0\quad\text{or}\quad\frac d{dt}\frac{\partial L}{\partial\dot q}-\frac{\partial L}{\partial q}=Q$$`, "根据自由度与约束选择表达。"),
        step(md`$$\text{Lean theorem}=\text{conclusion under explicit hypotheses}$$`, "把每个非退化条件留在定理签名中。")
      ],
      [
        mapping("系统状态", "structure DynamicsModel", "集中保存质量、轨迹、力和约束。"),
        mapping("守恒量", "IsConserved quantity", "区分导数为零与全局常值。"),
        mapping("分类假设", "m ≠ 0 / ell ≠ 0 / PositiveDefinite M", "避免隐藏除零和退化分支。")
      ],
      worked("综合例：卫星小扰动与轨道分类", md`卫星在反平方引力中绕行，现给定初始位置、速度和一次短时外冲量。`, [
        "冲量发生前后分别使用两段保守中心力轨道；冲量瞬间动量跳变。",
        md`由新速度计算角动量 $\ell$ 与总能量 $E$。`,
        md`若 $\ell=0$，进入径向碰撞/逃逸分支，不能使用普通圆锥极角公式。`,
        md`若 $\ell\ne0$，用 $e^2=1+2E\ell^2/(\mu^2m^3)$ 分类新轨道。`,
        "检查近心点是否穿过天体半径；纯数学圆锥轨道并不自动满足无碰撞物理条件。"
      ], md`守恒律要在事件分段内使用；冲量改变守恒常数，但不会否定每一段轨道的形式化推导。`),
      ["先审查系统边界，再调用守恒律。", "退化条件应在计算前分类。", "轨道方程正确仍需检查碰撞和模型适用性。"],
      {question:"为什么一次瞬时冲量后不能继续沿用冲量前的机械能与角动量数值？",answer:"冲量由外部作用改变动量，从而改变角动量和动能；冲量后的保守段会守恒新的常数。"},
      "综合关只整合本单元已经建立的有限维经典模型，不把形式化证明解释为对真实天体摄动、潮汐或相对论修正的验证。"
    )
  });

  root.version = 4;
}());

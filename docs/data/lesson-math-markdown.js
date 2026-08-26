/* KaTeX-ready Markdown equations for the first two lecture units. */
(function () {
  const root = window.LEANPATH_LESSON_GUIDES;
  if (!root || !root.guides) return;
  const md = String.raw;

  const formulas = {
    quantity: [
      String.raw`$$q=(x,\,u,\,d,\,\text{meaning})$$`,
      String.raw`$$72\,\mathrm{km\,h^{-1}}=20\,\mathrm{m\,s^{-1}}$$`,
      String.raw`$$[v]=LT^{-1}$$`,
      String.raw`$$\text{validity}=\text{logical deduction}+\text{model assumptions}$$`
    ],
    "si-base": [
      String.raw`$$\mathcal D\cong\mathbb Q^{7}$$`,
      String.raw`$$[F]=[m][a]=MLT^{-2}$$`,
      String.raw`$$[E]=[F][x]=ML^{2}T^{-2}$$`,
      String.raw`$$[Q]=[I][t]=IT$$`
    ],
    "dimension-model": [
      String.raw`$$[Q]=M^{a}L^{b}T^{c}I^{d}\Theta^{e}N^{f}J^{g}$$`,
      String.raw`$$[Q_1]=[Q_2]\iff \forall b,\ e_{Q_1}(b)=e_{Q_2}(b)$$`,
      String.raw`$$F=G\frac{m_1m_2}{r^2}\Longrightarrow [G]=\frac{[F][r]^2}{[m]^2}$$`,
      String.raw`$$[G]=M^{-1}L^3T^{-2}$$`
    ],
    "dimension-ops": [
      String.raw`$$d(xy)=d(x)+d(y)$$`,
      String.raw`$$d(x/y)=d(x)-d(y)$$`,
      String.raw`$$d(x^n)=n\,d(x)$$`,
      String.raw`$$x+y\ \text{defined}\Longrightarrow d(x)=d(y)$$`
    ],
    "derived-dimensions": [
      String.raw`$$[v]=LT^{-1},\qquad [a]=LT^{-2}$$`,
      String.raw`$$[F]=MLT^{-2},\qquad [E]=ML^2T^{-2}$$`,
      String.raw`$$[P]=ML^2T^{-3},\qquad [p]=ML^{-1}T^{-2}$$`,
      String.raw`$$[V]=\frac{[E]}{[Q]}=ML^2T^{-3}I^{-1}$$`
    ],
    dimensionless: [
      String.raw`$$\left[\frac{\Delta L}{L}\right]=1$$`,
      String.raw`$$\mathrm{Re}=\frac{\rho vL}{\mu}$$`,
      String.raw`$$e^x=1+x+\frac{x^2}{2!}+\cdots$$`,
      String.raw`$$d(x)=0\not\Longrightarrow x=1$$`
    ],
    "unit-systems": [
      String.raw`$$u_i'=\lambda_i u_i$$`,
      String.raw`$$q'=q\prod_i\lambda_i^{-a_i}$$`,
      String.raw`$$c=1\quad\text{is a unit convention}$$`,
      String.raw`$$T_{\mathrm K}=T_{^\circ\mathrm C}+273.15$$`
    ],
    "unit-conversion": [
      String.raw`$$1\,\mathrm{km\,h^{-1}}=\frac{5}{18}\,\mathrm{m\,s^{-1}}$$`,
      String.raw`$$1\,\mathrm{km^2}=10^6\,\mathrm{m^2}$$`,
      String.raw`$$T_{\mathrm K}=T_{^\circ\mathrm C}+273.15$$`,
      String.raw`$$\Delta T_{\mathrm K}=\Delta T_{^\circ\mathrm C}$$`
    ],
    "typed-quantity": [
      String.raw`$$\mathrm{Quantity}:\mathrm{Dimension}\to\mathrm{Type}$$`,
      String.raw`$$\mathrm{add}:Q[d]\to Q[d]\to Q[d]$$`,
      String.raw`$$\mathrm{mul}:Q[d_1]\to Q[d_2]\to Q[d_1d_2]$$`,
      String.raw`$$\text{dimension-safe}\not\Longrightarrow\text{semantically complete}$$`
    ],
    "typed-ops": [
      String.raw`$$m:Q[M],\qquad v:Q[LT^{-1}]$$`,
      String.raw`$$v^2:Q[L^2T^{-2}]$$`,
      String.raw`$$mv^2:Q[ML^2T^{-2}]$$`,
      String.raw`$$K=\frac12mv^2$$`
    ],
    homogeneity: [
      String.raw`$$x=y\Longrightarrow[x]=[y]$$`,
      String.raw`$$x+y\ \text{defined}\Longrightarrow[x]=[y]$$`,
      String.raw`$$T=C\ell^ag^b$$`,
      String.raw`$$\Pi=\prod_iq_i^{a_i},\qquad A\mathbf a=0$$`
    ],
    "physlib-units": [
      String.raw`$$\text{teaching layer}:\ \mathrm{BaseDimension}\to\mathbb Z$$`,
      String.raw`$$\text{library layer}:\ \mathrm{Physlib.Units.Dimension}$$`,
      String.raw`$$\mathrm{WithDim}\ d\ M$$`,
      String.raw`$$1\,\mathrm{km\,h^{-1}}=\frac5{18}\,\mathrm{m\,s^{-1}}$$`
    ],
    practice: [
      String.raw`$$\text{object}\to\text{dimension}\to\text{operation}\to\text{equation}$$`,
      String.raw`$$[c]=\frac{[\text{target}]}{[\text{known factors}]}$$`,
      String.raw`$$\text{convert units before numerical substitution}$$`,
      String.raw`$$\text{conclusion}+\text{assumptions}+\text{scope}$$`
    ],
    "euclidean-vectors": [
      String.raw`$$V_n=\mathbb R^n\cong(\mathrm{Fin}\ n\to\mathbb R)$$`,
      String.raw`$$v=\sum_i v_i e_i$$`,
      String.raw`$$\lVert v\rVert^2=\sum_i v_i^2$$`,
      String.raw`$$n=3\ \text{is a specialization, not the definition}$$`
    ],
    "inner-metric": [
      String.raw`$$\lVert v\rVert^2=\langle v,v\rangle$$`,
      String.raw`$$d(p,q)=\lVert q-p\rVert$$`,
      String.raw`$$\operatorname{proj}_u v=\frac{\langle v,u\rangle}{\langle u,u\rangle}u$$`,
      String.raw`$$\langle v,w\rangle=\lVert v\rVert\lVert w\rVert\cos\theta$$`
    ],
    "affine-points": [
      String.raw`$$q-p\in V$$`,
      String.raw`$$p+v\in P$$`,
      String.raw`$$(q-o)-(p-o)=q-p$$`,
      String.raw`$$r=p-o$$`
    ],
    "applied-force": [
      String.raw`$$f=(p,F)$$`,
      String.raw`$$R(f)=F$$`,
      String.raw`$$M_o(f)=(p-o)\wedge F$$`,
      String.raw`$$(p+\lambda F-o)\wedge F=(p-o)\wedge F$$`
    ],
    "force-system": [
      String.raw`$$R=\sum_iF_i$$`,
      String.raw`$$M_o=\sum_i(r_i\wedge F_i)$$`,
      String.raw`$$(R,M_o)\ \text{determines the external rigid-body effect}$$`,
      String.raw`$$R=0,\quad M_o\ne0\ \Longrightarrow\ \text{pure couple}$$`
    ],
    moment: [
      String.raw`$$M_{ij}=r_iF_j-r_jF_i$$`,
      String.raw`$$\dim\bigl(\Lambda^2\mathbb R^n\bigr)=\frac{n(n-1)}2$$`,
      String.raw`$$n=3:\quad \Lambda^2\mathbb R^3\cong\mathbb R^3$$`,
      String.raw`$$n\ne3:\quad \Lambda^2\mathbb R^n\not\cong\mathbb R^n\ \text{naturally}$$`
    ],
    "moment-shift": [
      String.raw`$$r_i'=p_i-o'=(p_i-o)+(o-o')$$`,
      String.raw`$$M_{o'}=\sum_i r_i'\wedge F_i$$`,
      String.raw`$$M_{o'}=M_o+(o-o')\wedge R$$`,
      String.raw`$$R=0\Longrightarrow M_{o'}=M_o$$`
    ],
    equilibrium: [
      String.raw`$$R=\sum_iF_i=0$$`,
      String.raw`$$M_o=\sum_i(r_i\wedge F_i)=0$$`,
      String.raw`$$R=0\Longrightarrow M_{o'}=M_o$$`,
      String.raw`$$\mathrm{Equilibrium}\iff R=0\ \land\ M_o=0$$`
    ],
    "equilibrium-iff": [
      String.raw`$$P(v,\Omega)=\langle R,v\rangle+\langle M,\Omega\rangle$$`,
      String.raw`$$R=0,\ M=0\Longrightarrow P(v,\Omega)=0$$`,
      String.raw`$$\forall v,\ P(v,0)=0\Longrightarrow v=R\Longrightarrow\lVert R\rVert^2=0$$`,
      String.raw`$$\forall\Omega,\ P(0,\Omega)=0\Longrightarrow\Omega=M\Longrightarrow\lVert M\rVert^2=0$$`
    ],
    "support-reactions": [
      String.raw`$$R_A+R_B=P$$`,
      String.raw`$$R_BL=Pa$$`,
      String.raw`$$R_B=\frac{Pa}{L},\qquad R_A=\frac{P(L-a)}{L}$$`,
      String.raw`$$0\le a\le L\Longrightarrow R_A,R_B\ge0$$`
    ],
    determinacy: [
      String.raw`$$A\mathbf r=\mathbf b$$`,
      String.raw`$$\ker A=\{0\}$$`,
      String.raw`$$\mathbf b\in\operatorname{range}A$$`,
      String.raw`$$\ker A\ne\{0\}\Longrightarrow\text{self-stress directions}$$`
    ],
    work: [
      String.raw`$$W=\langle F,q-p\rangle$$`,
      String.raw`$$q-p=(r-p)+(q-r)$$`,
      String.raw`$$W(p,q)=W(p,r)+W(r,q)$$`,
      String.raw`$$W[\gamma]=\int\langle F(\gamma(t)),\dot\gamma(t)\rangle\,dt$$`
    ],
    potential: [
      String.raw`$$dV_x(h)=\langle\nabla V(x),h\rangle$$`,
      String.raw`$$F(x)=-\nabla V(x)$$`,
      String.raw`$$V(x)=\frac12k\lVert x\rVert^2$$`,
      String.raw`$$\nabla V(x)=kx\Longrightarrow F(x)=-kx$$`
    ],
    "virtual-work": [
      String.raw`$$\delta q\in C_q$$`,
      String.raw`$$\delta W=\langle F_{\mathrm{ext}}+R_{\mathrm{constraint}},\delta q\rangle$$`,
      String.raw`$$\langle R_{\mathrm{constraint}},\delta q\rangle=0$$`,
      String.raw`$$\mathrm{equilibrium}\iff\forall\delta q\in C_q,\ \langle F_{\mathrm{ext}},\delta q\rangle=0$$`
    ],
    stability: [
      String.raw`$$\nabla V(q_0)=0$$`,
      String.raw`$$V(q_0+\eta)=V(q_0)+\frac12\langle H\eta,\eta\rangle+O(\lVert\eta\rVert^3)$$`,
      String.raw`$$H>0\Longrightarrow q_0\ \text{is a strict local minimum}$$`,
      String.raw`$$H\ \text{indefinite}\Longrightarrow\text{instability}$$`
    ],
    "statics-physlib": [
      String.raw`$$\text{Mathlib}:\ \text{general mathematics}$$`,
      String.raw`$$\text{Physlib}:\ \text{current physics library}$$`,
      String.raw`$$\text{PhysLean}:\ \text{historical source project}$$`,
      String.raw`$$\text{LeanPath}:\ \text{transparent teaching layer}$$`
    ],
    "statics-practice": [
      String.raw`$$\text{objects}:\ P,\ V,\ F,\ M$$`,
      String.raw`$$\text{balance}:\ R=0,\quad M=0$$`,
      String.raw`$$\text{constraints}:\ A\mathbf r=\mathbf b\ \text{or}\ \delta q\in C$$`,
      String.raw`$$\text{energy}:\ \nabla V=0,\quad \operatorname{Hess}V$$`
    ]
  };

  Object.keys(formulas).forEach(function (id) {
    const guide = root.guides[id];
    if (!guide || !guide.derivation) return;
    formulas[id].forEach(function (formula, index) {
      if (guide.derivation[index]) guide.derivation[index].formula = formula;
    });
  });

  /*
   * The original notes predate KaTeX support and contain many compact Unicode
   * formula fragments inside otherwise ordinary Chinese prose.  Replace only
   * reviewed fragments; Lean source and type signatures remain untouched.
   * Tokens prevent a later short rule from rewriting TeX produced by an
   * earlier long rule.
   */
  const inlineMath = [
    /* Unit I · units and dimensions */
    ["Q=MᵃLᵇTᶜIᵈΘᵉNᶠJᵍ", md`$Q=M^{a}L^{b}T^{c}I^{d}\Theta^{e}N^{f}J^{g}$`],
    ["[p]=[F]/[A]=M L T⁻²/L²=M L⁻¹ T⁻²", md`$[p]=[F]/[A]=MLT^{-2}/L^2=ML^{-1}T^{-2}$`],
    ["M¹⁻² L¹⁺² T⁻²=M⁻¹L³T⁻²", md`$M^{1-2}L^{1+2}T^{-2}=M^{-1}L^3T^{-2}$`],
    ["[v₀²/g]=(L²T⁻²)/(LT⁻²)=L", md`$[v_0^2/g]=(L^2T^{-2})/(LT^{-2})=L$`],
    ["[b]=[F]/[v]=MT⁻¹", md`$[b]=[F]/[v]=MT^{-1}$`],
    ["[T/μ]=L²T⁻²", md`$[T/\mu]=L^2T^{-2}$`],
    ["[F]=M·(L T⁻²)=M L T⁻²", md`$[F]=M(LT^{-2})=MLT^{-2}$`],
    ["[F]=MLT⁻²", md`$[F]=MLT^{-2}$`],
    ["[W]=ML²T⁻²", md`$[W]=ML^2T^{-2}$`],
    ["[V]=ML²T⁻³I⁻¹", md`$[V]=ML^2T^{-3}I^{-1}$`],
    ["[p]=MLT⁻²/L²=ML⁻¹T⁻²", md`$[p]=MLT^{-2}/L^2=ML^{-1}T^{-2}$`],
    ["[u]=ML²T⁻²/L³=ML⁻¹T⁻²", md`$[u]=ML^2T^{-2}/L^3=ML^{-1}T^{-2}$`],
    ["[ρ]=ML⁻³", md`$[\rho]=ML^{-3}$`],
    ["[μ]=ML⁻¹T⁻¹", md`$[\mu]=ML^{-1}T^{-1}$`],
    ["M·(LT⁻¹)²=ML²T⁻²", md`$M(LT^{-1})^2=ML^2T^{-2}$`],
    ["M·LT⁻¹=MLT⁻¹", md`$M\,LT^{-1}=MLT^{-1}$`],
    ["Lᵃ(LT⁻²)ᵇ=Lᵃ⁺ᵇT⁻²ᵇ", md`$L^a(LT^{-2})^b=L^{a+b}T^{-2b}$`],
    ["F=Gm₁m₂/r²", md`$F=Gm_1m_2/r^2$`],
    ["G=Fr²/(m₁m₂)", md`$G=Fr^2/(m_1m_2)$`],
    ["[m₁m₂]=M²", md`$[m_1m_2]=M^2$`],
    ["[r²]=L²", md`$[r^2]=L^2$`],
    ["[G]=M⁻¹L³T⁻²", md`$[G]=M^{-1}L^3T^{-2}$`],
    ["N=kg·m·s⁻²", md`$\mathrm N=\mathrm{kg\,m\,s^{-2}}$`],
    ["Pa=N/m²", md`$\mathrm{Pa}=\mathrm N/\mathrm m^2$`],
    ["J=N·m", md`$\mathrm J=\mathrm{N\,m}$`],
    ["C=A·s", md`$\mathrm C=\mathrm{A\,s}$`],
    ["F=ma", md`$F=ma$`],
    ["F=bv", md`$F=bv$`],
    ["W=Fs", md`$W=Fs$`],
    ["Q=It", md`$Q=It$`],
    ["Re=ρvL/μ", md`$\mathrm{Re}=\rho vL/\mu$`],
    ["exp x=1+x+x²/2!+⋯", md`$\exp x=1+x+x^2/2!+\cdots$`],
    ["1、x、x²", md`$1,x,x^2$`],
    ["3 km²=3×10⁶ m²", md`$3\,\mathrm{km^2}=3\times10^6\,\mathrm{m^2}$`],
    ["90 km/h=90×5/18=25 m/s", md`$90\,\mathrm{km/h}=90\times5/18=25\,\mathrm{m/s}$`],
    ["1 km=1000 m", md`$1\,\mathrm{km}=1000\,\mathrm m$`],
    ["36 km/h", md`$36\,\mathrm{km/h}$`],
    ["10 m/s", md`$10\,\mathrm{m/s}$`],
    ["1000²", md`$1000^2$`],
    ["1000³", md`$1000^3$`],
    ["3600⁻¹", md`$3600^{-1}$`],
    ["v²=2as", md`$v^2=2as$`],
    ["a=5 m/s²", md`$a=5\,\mathrm{m/s^2}$`],
    ["s=v²/(2a)", md`$s=v^2/(2a)$`],
    ["x=x₀+v₀t+½at²", md`$x=x_0+v_0t+\tfrac12at^2$`],
    ["T∝√(ℓ/g)", md`$T\propto\sqrt{\ell/g}$`],
    ["T=C√(ℓ/g)", md`$T=C\sqrt{\ell/g}$`],
    ["C=2π", md`$C=2\pi$`],
    ["R=v₀² sin(2θ)/g", md`$R=v_0^2\sin(2\theta)/g$`],
    ["sin(2θ)", md`$\sin(2\theta)$`],
    ["g≠0", md`$g\ne0$`],
    ["K=½mv²", md`$K=\tfrac12mv^2$`],
    ["p=mv", md`$p=mv$`],
    ["v²", md`$v^2$`],
    ["½", md`$\tfrac12$`],
    ["√(T/μ)", md`$\sqrt{T/\mu}$`],
    ["√L", md`$\sqrt L$`],
    ["LT⁻¹", md`$LT^{-1}$`],
    ["LT⁻²", md`$LT^{-2}$`],
    ["MLT⁻²", md`$MLT^{-2}$`],
    ["ML²T⁻²", md`$ML^2T^{-2}$`],
    ["ML²T⁻³", md`$ML^2T^{-3}$`],
    ["ML⁻¹T⁻²", md`$ML^{-1}T^{-2}$`],
    ["L²T⁻²", md`$L^2T^{-2}$`],
    ["L²", md`$L^2$`],
    ["ℤ⁷", md`$\mathbb Z^7$`],
    ["ℚ", md`$\mathbb Q$`],
    ["λᵢ", md`$\lambda_i$`],
    ["aᵢ", md`$a_i$`],
    ["108×(5/18)", md`$108\times(5/18)$`],
    ["xy 中该基本量出现 a+b 次", md`$xy$ 中该基本量出现 $a+b$ 次`],
    ["x/y 中出现 a−b 次", md`$x/y$ 中出现 $a-b$ 次`],
    ["xᵃxᵇ=xᵃ⁺ᵇ", md`$x^a x^b=x^{a+b}$`],
    ["3 km²", md`$3\,\mathrm{km^2}$`],
    ["m²", md`$\mathrm{m^2}$`],
    ["d₁*d₂", md`$d_1d_2$`],
    ["μ", md`$\mu$`],

    /* Unit II · Euclidean statics */
    ["ℝⁿ", md`$\mathbb R^n$`],
    ["大小为 F 的恒力与水平位移 s 夹角为 θ", md`大小为 $F$ 的恒力与水平位移 $s$ 夹角为 $\theta$`],
    ["ΣF=0", md`$\sum_i F_i=0$`],
    ["η≠0", md`$\eta\ne0$`],
    ["V(x)=kx²/2", md`$V(x)=kx^2/2$`],
    ["x=0", md`$x=0$`],
    ["θ", md`$\theta$`],
    ["W∥=⟪W,t⟫t，W⊥=⟪W,n⟫n", md`$W_{\parallel}=\langle W,t\rangle t$，$W_{\perp}=\langle W,n\rangle n$`],
    ["v·w=Σvᵢwᵢ", md`$v\cdot w=\sum_i v_iw_i$`],
    ["‖v‖=√(v·v)", md`$\lVert v\rVert=\sqrt{v\cdot v}$`],
    ["(⟪F,u⟫/⟪u,u⟫)u", md`$\bigl(\langle F,u\rangle/\langle u,u\rangle\bigr)u$`],
    ["‖r×F‖=‖r‖‖F‖sin θ", md`$\lVert r\times F\rVert=\lVert r\rVert\lVert F\rVert\sin\theta$`],
    ["x̄=M/R=(x₁F₁+x₂F₂)/(F₁+F₂)", md`$\bar x=M/R=(x_1F_1+x_2F_2)/(F_1+F_2)$`],
    ["Mᵢⱼ=rᵢFⱼ−rⱼFᵢ", md`$M_{ij}=r_iF_j-r_jF_i$`],
    ["rᵢFⱼ−rⱼFᵢ", md`$r_iF_j-r_jF_i$`],
    ["Mᵢⱼ=−Mⱼᵢ", md`$M_{ij}=-M_{ji}$`],
    ["M₁₂、M₂₃、M₃₁", md`$M_{12},M_{23},M_{31}$`],
    ["M₁₂、M₂₀、M₀₁", md`$M_{12},M_{20},M_{01}$`],
    ["⋀²ℝ⁴", md`$\Lambda^2\mathbb R^4$`],
    ["⋀²V", md`$\Lambda^2V$`],
    ["Λ²ℝⁿ", md`$\Lambda^2\mathbb R^n$`],
    ["Λ²", md`$\Lambda^2$`],
    ["n(n−1)/2", md`$n(n-1)/2$`],
    ["4×3/2=6", md`$4\times3/2=6$`],
    ["r_Q=P−Q=r_O−a", md`$r_Q=P-Q=r_O-a$`],
    ["r_O=P−O", md`$r_O=P-O$`],
    ["a=Q−O", md`$a=Q-O$`],
    ["r_Q∧F=r_O∧F−a∧F", md`$r_Q\wedge F=r_O\wedge F-a\wedge F$`],
    ["Σ(a∧Fᵢ)=a∧ΣFᵢ=a∧R", md`$\sum_i(a\wedge F_i)=a\wedge\sum_iF_i=a\wedge R$`],
    ["M_Q=M_O−a∧R", md`$M_Q=M_O-a\wedge R$`],
    ["M_Q=M_O−(Q−O)∧R=0", md`$M_Q=M_O-(Q-O)\wedge R=0$`],
    ["M_O=M_C+(C−O)∧R", md`$M_O=M_C+(C-O)\wedge R$`],
    ["(C−O)∧ΣFᵢ=(C−O)∧R", md`$(C-O)\wedge\sum_iF_i=(C-O)\wedge R$`],
    ["(o−o′)∧F", md`$(o-o')\wedge F$`],
    ["(r+aF)∧F=r∧F", md`$(r+aF)\wedge F=r\wedge F$`],
    ["F∧F=0", md`$F\wedge F=0$`],
    ["r∧F=0", md`$r\wedge F=0$`],
    ["M=r∧F", md`$M=r\wedge F$`],
    ["r∧F", md`$r\wedge F$`],
    ["r×F", md`$r\times F$`],
    ["F·r", md`$F\cdot r$`],
    ["R·v+M·ω", md`$R\cdot v+M\cdot\omega$`],
    ["R·R=0", md`$R\cdot R=0$`],
    ["M·M=0", md`$M\cdot M=0$`],
    ["⟪R,R⟫=0", md`$\langle R,R\rangle=0$`],
    ["‖R‖²=0", md`$\lVert R\rVert^2=0$`],
    ["R=M=0", md`$R=M=0$`],
    ["R=0、M≠0", md`$R=0$、$M\ne0$`],
    ["R=0 且 M_O=0", md`$R=0$ 且 $M_O=0$`],
    ["R=0 与 M_O=0", md`$R=0$ 与 $M_O=0$`],
    ["R=0", md`$R=0$`],
    ["R≠0", md`$R\ne0$`],
    ["M≠0", md`$M\ne0$`],
    ["M=0", md`$M=0$`],
    ["v=R", md`$v=R$`],
    ["ω=0", md`$\omega=0$`],
    ["ω=M", md`$\omega=M$`],
    ["v=0", md`$v=0$`],
    ["n≥4", md`$n\ge4$`],
    ["n=4", md`$n=4$`],
    ["n=3", md`$n=3$`],
    ["n=2", md`$n=2$`],
    ["n=1", md`$n=1$`],
    ["u≠0", md`$u\ne0$`],
    ["v·v≥0", md`$v\cdot v\ge0$`],
    ["v·v", md`$v\cdot v$`],
    ["v·w=0", md`$v\cdot w=0$`],
    ["v=0", md`$v=0$`],
    ["e=u/‖u‖", md`$e=u/\lVert u\rVert$`],
    ["⟪F,e⟫e", md`$\langle F,e\rangle e$`],
    ["⟪F,e⟫", md`$\langle F,e\rangle$`],
    ["⟪F,v⟫=0", md`$\langle F,v\rangle=0$`],
    ["⟪t,n⟫=0", md`$\langle t,n\rangle=0$`],
    ["⟪v,v⟫", md`$\langle v,v\rangle$`],
    ["‖v‖=0", md`$\lVert v\rVert=0$`],
    ["Q−P", md`$Q-P$`],
    ["P+v", md`$P+v$`],
    ["P+Q", md`$P+Q$`],
    ["P+aF", md`$P+aF$`],
    ["r+aF", md`$r+aF$`],
    ["r₁、r₂", md`$r_1,r_2$`],
    ["x₁、x₂", md`$x_1,x_2$`],
    ["F₁、F₂", md`$F_1,F_2$`],
    ["R=F₁+F₂", md`$R=F_1+F_2$`],
    ["M=x₁F₁+x₂F₂", md`$M=x_1F_1+x_2F_2$`],
    ["R_A=P(L−a)/L", md`$R_A=P(L-a)/L$`],
    ["R_B=Pa/L", md`$R_B=Pa/L$`],
    ["P≥0", md`$P\ge0$`],
    ["0≤a≤L", md`$0\le a\le L$`],
    ["L>0", md`$L>0$`],
    ["L≠0", md`$L\ne0$`],
    ["k≠0", md`$k\ne0$`],
    ["Ak=0", md`$Ak=0$`],
    ["r₀+k", md`$r_0+k$`],
    ["W=F·(Q−P)=‖F‖‖Δr‖cosθ", md`$W=F\cdot(Q-P)=\lVert F\rVert\lVert\Delta r\rVert\cos\theta$`],
    ["F cos θ", md`$F\cos\theta$`],
    ["W=Fs cos θ", md`$W=Fs\cos\theta$`],
    ["θ<π/2", md`$\theta<\pi/2$`],
    ["θ=π/2", md`$\theta=\pi/2$`],
    ["θ>π/2", md`$\theta>\pi/2$`],
    ["dV_x(δx)=⟪∇V(x),δx⟫", md`$dV_x(\delta x)=\langle\nabla V(x),\delta x\rangle$`],
    ["F·δx=−dV_x(δx)", md`$F\cdot\delta x=-dV_x(\delta x)$`],
    ["V(x)=½k⟪x,x⟫", md`$V(x)=\tfrac12k\langle x,x\rangle$`],
    ["F=−k•x", md`$F=-kx$`],
    ["k•x", md`$kx$`],
    ["F=−∇V", md`$F=-\nabla V$`],
    ["−∇(V+C)=−∇V", md`$-\nabla(V+C)=-\nabla V$`],
    ["−∇V", md`$-\nabla V$`],
    ["V(x)=k x²/2", md`$V(x)=kx^2/2$`],
    ["∇V(x)=kx", md`$\nabla V(x)=kx$`],
    ["(v,ω)", md`$(v,\omega)$`],
    ["⟪Nn,t⟫=0", md`$\langle Nn,t\rangle=0$`],
    ["⟪F_ext,t⟫=0", md`$\langle F_{\mathrm{ext}},t\rangle=0$`],
    ["V(x)=½kx²", md`$V(x)=\tfrac12kx^2$`],
    ["F=−kx", md`$F=-kx$`],
    ["V(x)>V(0)", md`$V(x)>V(0)$`],
    ["x²>0", md`$x^2>0$`],
    ["x≠0", md`$x\ne0$`],
    ["k>0", md`$k>0$`],
    ["q₀", md`$q_0$`]
  ].sort(function (a, b) { return b[0].length - a[0].length; });

  const leanLiterals = [
    ["BaseDimension→ℤ", "`BaseDimension → ℤ`"],
    ["Fin n→ℝ", "`Fin n → ℝ`"],
    ["Fin n → ℝ", "`Fin n → ℝ`"],
    ["Quantity lengthDim", "`Quantity lengthDim`"],
    ["Quantity timeDim", "`Quantity timeDim`"],
    ["Quantity d", "`Quantity d`"],
    ["ℝ", "`ℝ`"]
  ].sort(function (a, b) { return b[0].length - a[0].length; });

  function rewriteInlineFormula(value) {
    if (typeof value !== "string" || value.indexOf("$") >= 0) return value;
    const tokens = [];
    let output = value;
    inlineMath.concat(leanLiterals).forEach(function (rule) {
      if (output.indexOf(rule[0]) < 0) return;
      const token = "\u0000FORMULA" + tokens.length + "\u0000";
      tokens.push(rule[1]);
      output = output.split(rule[0]).join(token);
    });
    return output.replace(/\u0000FORMULA(\d+)\u0000/g, function (_, index) {
      return tokens[Number(index)] || "";
    });
  }

  function rewriteGuide(value, key) {
    if (typeof value === "string") {
      if (key === "code" || key === "lean" || key === "part" || key === "index") return value;
      return rewriteInlineFormula(value);
    }
    if (Array.isArray(value)) return value.map(function (item) { return rewriteGuide(item, key); });
    if (value && typeof value === "object") {
      Object.keys(value).forEach(function (childKey) {
        value[childKey] = rewriteGuide(value[childKey], childKey);
      });
    }
    return value;
  }

  Object.keys(formulas).forEach(function (id) {
    if (root.guides[id]) rewriteGuide(root.guides[id], "guide");
  });
}());

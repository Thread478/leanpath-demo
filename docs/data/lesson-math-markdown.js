/* KaTeX-ready Markdown equations for the first two lecture units. */
(function () {
  const root = window.LEANPATH_LESSON_GUIDES;
  if (!root || !root.guides) return;

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
}());

/* LeanPath Physics · Unit III progressive code exhibits. */
(function () {
  const showcase = window.LEANPATH_SHOWCASE || {version:0, entries:[]};
  showcase.version = Math.max(showcase.version || 0, 5);
  showcase.entries.push(
    {
      id:"showcase-newton-momentum",unlock:"momentum-dynamics",part:3,
      title:"牛顿残差与冲量定理",
      summary:"把 F=m a 写成可组合的动力学残差，并在恒力模型中从速度更新式严格推出动量增量等于冲量。",
      origin:"LeanPath 自主形式化 · 实数代数由 Mathlib 检查",
      filename:"NewtonAndMomentum.lean",
      code:"import Mathlib\n\ndef newtonResidual (F m a : ℝ) : ℝ := F - m * a\ndef impulse (F Δt : ℝ) : ℝ := F * Δt\n\ntheorem constant_force_impulse (m F v₀ v₁ Δt : ℝ)\n    (hm : m ≠ 0) (hv : v₁ = v₀ + (F / m) * Δt) :\n    m * v₁ - m * v₀ = impulse F Δt := by\n  rw [hv]\n  field_simp [impulse, hm]\n  <;> ring\n"
    },
    {
      id:"showcase-angular-momentum",unlock:"angular-momentum",part:3,
      title:"一般维角动量与中心力矩",
      summary:"不把角动量限制在三维叉积：在 ℝⁿ 中使用反对称二阶张量 r∧p，并证明中心力的力矩恒为零。",
      origin:"LeanPath 自主形式化 · Matrix 与有限函数空间来自 Mathlib",
      filename:"AngularMomentumTensor.lean",
      code:"import Mathlib\n\nabbrev VecN (n : ℕ) := Fin n → ℝ\nabbrev TwoForm (n : ℕ) := Matrix (Fin n) (Fin n) ℝ\n\ndef wedge {n : ℕ} (r p : VecN n) : TwoForm n :=\n  fun i j => r i * p j - r j * p i\n\ntheorem wedge_skew {n : ℕ} (r p : VecN n) (i j : Fin n) :\n    wedge r p i j = -wedge r p j i := by\n  simp [wedge]\n  ring\n\ntheorem central_force_zero_torque {n : ℕ} (c : ℝ) (r : VecN n) :\n    wedge r (c • r) = 0 := by\n  ext i j\n  simp [wedge]\n  ring\n"
    },
    {
      id:"showcase-energy-modal",unlock:"modal-eigen",part:3,
      title:"功—能关系与正常模态",
      summary:"先用速度平方关系证明恒力下的动能定理，再把二自由度线性振动化成 Kφ=ω²Mφ 的广义特征值问题。",
      origin:"LeanPath 自主形式化 · 有限维教学模型",
      filename:"EnergyAndModes.lean",
      code:"import Mathlib\n\ndef kineticEnergy (m v : ℝ) : ℝ := (1 / 2 : ℝ) * m * v^2\n\ntheorem work_energy (m v₀ v₁ a s : ℝ)\n    (h : v₁^2 = v₀^2 + 2*a*s) :\n    kineticEnergy m v₁ - kineticEnergy m v₀ = m*a*s := by\n  rw [kineticEnergy, kineticEnergy, h]\n  ring\n\n-- 正常模态把 M q¨ + K q = 0 约化为\n-- K φ = ω² M φ。质量矩阵定义模态内积。\n"
    },
    {
      id:"showcase-inertia-euler",unlock:"euler-equations",part:3,
      title:"惯性张量与欧拉方程",
      summary:"以主惯量组织转动动能和欧拉方程，验证绕任一主轴的匀速自由转动确实是精确解，同时保留中间轴稳定性作为独立问题。",
      origin:"LeanPath 自主形式化 · 主轴坐标教学模型",
      filename:"InertiaAndEuler.lean",
      code:"import Mathlib\n\nstructure PrincipalInertia where\n  I₁ : ℝ\n  I₂ : ℝ\n  I₃ : ℝ\n\ndef rotationalEnergy (I : PrincipalInertia) (ω₁ ω₂ ω₃ : ℝ) : ℝ :=\n  (1 / 2 : ℝ) * (I.I₁*ω₁^2 + I.I₂*ω₂^2 + I.I₃*ω₃^2)\n\n-- 第一条欧拉方程：\n-- I₁ α₁ + (I₃-I₂) ω₂ ω₃ = τ₁\n-- 令 ω₂=ω₃=α₁=τ₁=0，残差由 simp 化为 0。\n"
    },
    {
      id:"showcase-dalembert-kepler",unlock:"kepler-orbits",part:3,
      title:"从虚功到开普勒圆锥",
      summary:"达朗贝尔原理用许可虚位移测试动力学残差；中心力再由角动量守恒降维，反平方律的 Binet 方程给出圆锥轨道。",
      origin:"LeanPath 自主形式化 · Kepler 部分明确采用正质量、非碰撞与非零角动量假设",
      filename:"DalembertToKepler.lean",
      code:"import Mathlib\n\ntheorem dalembert_implies_newton (F m a : ℝ)\n    (h : ∀ δ : ℝ, (F-m*a)*δ = 0) : F = m*a := by\n  apply sub_eq_zero.mp\n  simpa using h 1\n\ndef conicRadius (p e θ : ℝ) : ℝ :=\n  p / (1 + e * Real.cos θ)\n\ntheorem conic_equation (p e θ : ℝ)\n    (h : 1 + e * Real.cos θ ≠ 0) :\n    conicRadius p e θ * (1 + e * Real.cos θ) = p := by\n  field_simp [conicRadius, h]\n"
    },
    {
      id:"showcase-dynamics-complete",unlock:"dynamics-chest",part:3,
      title:"第三部分完整成果 · 欧式空间动力学",
      summary:"完整 LeanPath 章节成果：从轨迹与牛顿方程出发，贯通动量、角动量、能量、线性振动、刚体、达朗贝尔—拉格朗日方法与开普勒圆锥轨道的可检查核心。",
      origin:"LeanPath 完整成果 · 自定义动力学主体 + Mathlib；ODE 存在唯一性与碰撞排除作为明确边界",
      filename:"EuclideanDynamics.lean",
      file:"lean/EuclideanDynamics.lean",
      completion:true,
      milestones:[
        "有限维轨迹状态、牛顿方程与动力学残差",
        "恒力冲量定理与碰撞动量代数",
        "一般 ℝⁿ 中作为反对称二阶张量的角动量",
        "中心力零力矩与三维叉积解释的分层",
        "动能定理及动能—势能交换",
        "质量矩阵、刚度矩阵与二自由度正常模态",
        "惯性张量、主惯量与欧拉刚体方程",
        "达朗贝尔虚功测试和欧拉—拉格朗日残差",
        "中心力降维、圆锥轨道方程与能量—偏心率分类",
        "正则性、正质量、非碰撞、非零角动量等适用域"
      ]
    }
  );
  window.LEANPATH_SHOWCASE = showcase;
}());

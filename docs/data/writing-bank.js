/*
 * LeanPath writing bank
 *
 * The learner only edits {{ANSWER}}. The theorem statement and verification
 * examples remain immutable, so a successful result is a real Lean check rather
 * than a text comparison. Exercises are original and follow the learning order
 * used by Theorem Proving in Lean 4 and Mathematics in Lean.
 */
(function () {
  window.LEANPATH_WRITING_BANK = {
    version: 1,
    tasks: [
      {
        id: "write-double",
        level: 1,
        section: "基础表达式",
        title: "写出 double",
        prompt: "补全函数体，让 double 对任意自然数都返回它的两倍。",
        concept: "def",
        xp: 6,
        starter: "",
        placeholder: "在这里写一个 Nat 表达式",
        hint: "函数体中可以直接使用参数 n；自然数加法写作 n + n。",
        template: "import Mathlib\n\ndef double (n : Nat) : Nat :=\n  {{ANSWER}}\n\nexample (n : Nat) : double n = n + n := by\n  rfl\n"
      },
      {
        id: "write-compose",
        level: 1,
        section: "基础表达式",
        title: "组合两个函数",
        prompt: "补全 twiceAfterInc：先给 n 加一，再调用 double。",
        concept: "compose",
        xp: 6,
        starter: "",
        placeholder: "调用已有函数完成定义",
        hint: "Lean 用空格应用函数；先执行的表达式放在括号里。",
        template: "import Mathlib\n\ndef inc (n : Nat) : Nat := n + 1\ndef double (n : Nat) : Nat := n + n\n\ndef twiceAfterInc (n : Nat) : Nat :=\n  {{ANSWER}}\n\nexample (n : Nat) : twiceAfterInc n = (n + 1) + (n + 1) := by\n  rfl\n"
      },
      {
        id: "write-identity",
        level: 1,
        section: "命题与证明",
        title: "恒等蕴含",
        prompt: "写一个策略证明：对任意命题 P，由 P 推出 P。",
        concept: "intro",
        xp: 8,
        starter: "by\n  ",
        placeholder: "先 intro，再交付已有证明",
        hint: "intro 会把箭头左侧的证明放进上下文，exact 可以关闭同类型目标。",
        template: "import Mathlib\n\ntheorem leanpath_identity (P : Prop) : P → P :=\n  {{ANSWER}}\n"
      },
      {
        id: "write-and-swap",
        level: 2,
        section: "命题与证明",
        title: "交换合取",
        prompt: "证明 P ∧ Q 可以推出 Q ∧ P。",
        concept: "constructor",
        xp: 8,
        starter: "by\n  intro h\n  ",
        placeholder: "拆分目标，并使用 h 的两个投影",
        hint: "constructor 把合取目标拆成两项；h.1 与 h.2 分别是左右分量。",
        template: "import Mathlib\n\ntheorem leanpath_and_swap (P Q : Prop) : P ∧ Q → Q ∧ P :=\n  {{ANSWER}}\n"
      },
      {
        id: "write-add-zero",
        level: 2,
        section: "等式证明",
        title: "加零不变",
        prompt: "证明任意自然数 n 加零仍等于 n。",
        concept: "simp",
        xp: 8,
        starter: "by\n  ",
        placeholder: "使用化简策略或引用定理",
        hint: "simp 知道自然数加法的单位元定律；也可以精确引用 Nat.add_zero。",
        template: "import Mathlib\n\ntheorem leanpath_add_zero (n : Nat) : n + 0 = n :=\n  {{ANSWER}}\n"
      },
      {
        id: "write-add-comm",
        level: 2,
        section: "等式证明",
        title: "引用交换律",
        prompt: "引用 Lean 已有定理，证明自然数加法交换律。",
        concept: "theoremCall",
        xp: 10,
        starter: "by\n  ",
        placeholder: "引用 Nat 命名空间中的定理",
        hint: "先想一想 #check Nat.add_comm 会显示什么类型。",
        template: "import Mathlib\n\ntheorem leanpath_add_comm (a b : Nat) : a + b = b + a :=\n  {{ANSWER}}\n"
      },
      {
        id: "write-inter-subset",
        level: 2,
        section: "集合",
        title: "交集包含于左集",
        prompt: "证明 s ∩ t ⊆ s。成员交集的证明同时包含左右两个成员事实。",
        concept: "set-subset",
        xp: 10,
        starter: "by\n  intro x hx\n  ",
        placeholder: "从 hx 取得 x ∈ s",
        hint: "子集证明先引入 x 和成员证明 hx；交集证明的第一项是左侧成员事实。",
        guide: {
          title: "集合成员与子集",
          body: "在 Mathlib 中，Set α 可以看作 α → Prop。s ⊆ t 展开后表示：任意 x 若属于 s，就属于 t。",
          code: "x ∈ s     -- s x\ns ⊆ t     -- ∀ ⦃x⦄, x ∈ s → x ∈ t\nhx.1      -- 交集成员的左侧证明"
        },
        template: "import Mathlib\n\nopen Set\nvariable {α : Type*}\n\ntheorem leanpath_inter_subset_left (s t : Set α) : s ∩ t ⊆ s :=\n  {{ANSWER}}\n"
      },
      {
        id: "write-set-ext",
        level: 3,
        section: "集合",
        title: "集合外延性",
        prompt: "已知每个元素属于 s 当且仅当属于 t，证明 s = t。",
        concept: "set-ext",
        xp: 10,
        starter: "by\n  ",
        placeholder: "使用 ext 把集合相等化为成员等价",
        hint: "ext x 会把目标 s = t 转换为 x ∈ s ↔ x ∈ t。",
        guide: {
          title: "集合外延性 ext",
          body: "两个集合相等，当且仅当它们拥有完全相同的元素。ext 策略把集合相等目标转换为逐点成员等价。",
          code: "ext x\n-- 新目标：x ∈ s ↔ x ∈ t"
        },
        template: "import Mathlib\n\nopen Set\nvariable {α : Type*}\n\ntheorem leanpath_set_ext (s t : Set α)\n    (h : ∀ x, x ∈ s ↔ x ∈ t) : s = t :=\n  {{ANSWER}}\n"
      },
      {
        id: "write-group-inverse",
        level: 3,
        section: "代数结构",
        title: "调用群的逆元定律",
        prompt: "在任意群 G 中证明 g⁻¹ * g = 1。",
        concept: "group-class",
        xp: 12,
        starter: "by\n  ",
        placeholder: "使用 simp 或逆元定理",
        hint: "[Group G] 让 Lean 自动获得群运算和群公理；simp 能使用逆元化简规则。",
        guide: {
          title: "类型类参数 [Group G]",
          body: "方括号参数不是一个额外数学变量，而是要求 Lean 为 G 找到群结构实例。找到后，乘法、单位元、逆元及其定理都会可用。",
          code: "variable {G : Type*} [Group G]\n#synth Group G\n#check mul_assoc"
        },
        template: "import Mathlib\n\nvariable {G : Type*} [Group G]\n\ntheorem leanpath_inv_mul (g : G) : g⁻¹ * g = 1 :=\n  {{ANSWER}}\n"
      },
      {
        id: "write-continuous-comp",
        level: 3,
        section: "拓扑",
        title: "连续映射的复合",
        prompt: "已知 f 与 g 连续，证明复合函数 g ∘ f 连续。",
        concept: "continuous-comp",
        xp: 12,
        starter: "by\n  ",
        placeholder: "调用连续性证明上的 comp",
        hint: "外层函数 g 的连续性证明 hg 调用 .comp，并接收内层函数的证明 hf。",
        guide: {
          title: "Continuous 与定理调用",
          body: "Continuous f 是“f 连续”的命题。hg.comp hf 把 g 的连续性和 f 的连续性组合成 g ∘ f 的连续性证明。",
          code: "hf : Continuous f\nhg : Continuous g\nhg.comp hf : Continuous (g ∘ f)"
        },
        template: "import Mathlib\n\nvariable {X Y Z : Type*}\nvariable [TopologicalSpace X] [TopologicalSpace Y] [TopologicalSpace Z]\n\ntheorem leanpath_continuous_comp (f : X → Y) (g : Y → Z)\n    (hf : Continuous f) (hg : Continuous g) : Continuous (g ∘ f) :=\n  {{ANSWER}}\n"
      }
    ]
  };
}());

/*
 * LeanPath question bank
 * Questions are original or substantially rewritten from the learning patterns in
 * Natural Number Game 4, Theorem Proving in Lean 4, and Mathematics in Lean.
 * Source and license details: ./README.md
 *
 * Schema:
 * id       stable unique id
 * level    1 foundation, 2 connection, 3 application
 * concept  one-time guide key
 * p        prompt
 * c        Lean snippet
 * o        options
 * a        correct option index
 * e        answer explanation
 */
(function () {
  "use strict";

  const concepts = {
    check:{title:"#check：先问类型",body:"#check 不执行表达式，只让 Lean 报告它的类型。阅读 Lean 代码时，遇到陌生定义或定理可以先检查类型。",code:"#check (2 + 3)  -- Nat"},
    eval:{title:"#eval：执行计算",body:"#eval 会编译并计算可执行表达式，然后显示结果。它适合检查函数的实际行为，但不能替代定理证明。",code:"#eval 2 + 3  -- 5"},
    literalTypes:{title:"字面量与基础类型",body:"自然数通常属于 Nat，true/false 属于 Bool，双引号文本属于 String，单引号字符属于 Char。",code:"#check \"Lean\"  -- String"},
    arrow:{title:"箭头：函数类型",body:"A → B 表示接收 A、返回 B 的函数类型。连续箭头向右结合：A → B → C 等同于 A → (B → C)。",code:"#check Nat → Nat"},
    annotation:{title:"冒号：类型标注",body:"表达式 e : T 表示 e 的类型应为 T；参数写作 (x : T)。标注能帮助 Lean 推断，也能更早发现错误。",code:"def inc (n : Nat) : Nat := n + 1"},
    product:{title:"积类型与列表类型",body:"A × B 的值是一对数据；List A 表示元素都属于 A 的列表。类型构造器本身也可以接收参数。",code:"#check (3, true)  -- Nat × Bool"},
    implicit:{title:"隐式参数",body:"花括号参数 {α : Type} 通常由 Lean 从后续实参推断，调用时不必显式写出 α。",code:"def id' {α : Type} (x : α) : α := x"},
    def:{title:"def：具名定义",body:"def 为值或函数建立可复用名字。等号左侧给出名字、参数和结果类型，右侧给出实现。",code:"def double (n : Nat) : Nat := n + n"},
    fun:{title:"fun：匿名函数",body:"fun x => body 创建没有名字的函数。需要时可写 fun (x : Nat) => ... 明确参数类型。",code:"fun x : Nat => x + 1"},
    let:{title:"let：局部绑定",body:"let 在一个局部表达式或证明中临时命名某个值；文件顶层的长期定义通常使用 def。",code:"#eval let n := 4; n * n"},
    application:{title:"函数应用",body:"Lean 用空格表示函数应用：f x。多个参数写作 f x y，并按从左到右的方式逐次应用。",code:"#eval Nat.succ 4  -- 5"},
    compose:{title:"函数复合",body:"g ∘ f 表示先运行 f，再把结果交给 g。也可以写成 fun x => g (f x)。",code:"fun x => g (f x)"},
    prop:{title:"Prop：命题的类型",body:"数学陈述属于 Prop。一个命题的证明就是该命题类型的一个项；这正是 Lean 中“命题即类型”的含义。",code:"#check (2 = 2)  -- Prop"},
    implication:{title:"蕴含也是函数",body:"当 P Q : Prop 时，P → Q 的证明是一个函数：它接收 P 的证明，并返回 Q 的证明。",code:"fun hP : P => hQ"},
    conjunction:{title:"合取 P ∧ Q",body:"P ∧ Q 的证明同时携带 P 与 Q 的证明。可用 And.intro 构造，也可在策略模式中使用 constructor。",code:"And.intro hP hQ"},
    disjunction:{title:"析取 P ∨ Q",body:"证明 P ∨ Q 只需给出其中一侧的证明。Or.inl hP 选择左侧，Or.inr hQ 选择右侧。",code:"Or.inl hP"},
    theorem:{title:"theorem 与 example",body:"theorem 给证明命名，之后可以反复引用；example 用来练习或验证一个不需要长期命名的结论。",code:"theorem add_zero_demo (n : Nat) : n + 0 = n := by simp"},
    by:{title:"by：进入策略证明",body:"by 开始策略模式。Lean 展示当前上下文与目标，你逐步使用策略构造最终证明项。",code:"example (P : Prop) : P → P := by"},
    intro:{title:"intro：引入输入",body:"当目标以 ∀ 或 → 开头时，intro 把变量或前提移入上下文，并为它命名。",code:"intro hP"},
    exact:{title:"exact：精确交付",body:"如果上下文中某个证明项的类型与目标完全一致，exact 可以直接用它关闭目标。",code:"exact hP"},
    apply:{title:"apply：反向套用",body:"apply h 从 h 的结论匹配当前目标，并把 h 仍然需要的前提变成新的子目标。",code:"apply hPQ"},
    constructor:{title:"constructor：按构造器拆目标",body:"合取等归纳类型的目标由构造器产生。constructor 会把 P ∧ Q 拆成目标 P 与目标 Q。",code:"constructor"},
    cases:{title:"cases：分析证明或数据",body:"cases 对归纳数据或证明分类讨论。例如对 h : P ∧ Q 使用 cases，可取得两部分证明。",code:"cases h with | intro hP hQ => ..."},
    rfl:{title:"rfl：反身性",body:"rfl 证明两侧定义上相同的等式。它不依赖搜索，而是让 Lean 的内核检查两边是否归约为同一个表达式。",code:"example (x : Nat) : x = x := by rfl"},
    rw:{title:"rw：按等式改写",body:"若 h : A = B，则 rw [h] 把目标中的 A 替换为 B。方括号中也可以连续放入多个等式。",code:"rw [h]"},
    rwReverse:{title:"反向改写",body:"rw [← h] 沿等式的反方向改写，把 B 替换回 A。箭头 ← 在 VS Code 中可用 \\l 输入。",code:"rw [← h]"},
    rwAt:{title:"在假设中改写",body:"rw [h] at h₂ 会改写假设 h₂，而不是当前目标；写 at * 可在全部假设和目标中改写。",code:"rw [h] at h₂"},
    simp:{title:"simp：受控化简",body:"simp 使用被登记为化简规则的定理反复归约目标。它适合单位元、布尔化简等标准形变。",code:"example (n : Nat) : n + 0 = n := by simp"},
    checkTheorem:{title:"先检查定理签名",body:"调用陌生定理前先用 #check 查看参数顺序、隐式参数和完整结论，比猜测调用方式更可靠。",code:"#check Nat.add_comm"},
    namespace:{title:"命名空间",body:"namespace 把相关定义组织在一起并避免重名。外部引用时使用完整名称 N.name，或先 open N。",code:"#check Nat.add_comm"},
    theoremCall:{title:"定理可以像函数一样调用",body:"具名定理本身是一个证明函数。给它传入对象或前提，就得到更具体命题的证明。",code:"exact Nat.add_comm a b"},
    simpaUsing:{title:"simpa using",body:"using 后给出一个几乎符合目标的证明；simpa 会先化简该证明的类型和当前目标，再进行匹配。",code:"simpa using one_mul x"}
  };

  const decks = {
    hello:{label:"Hello, Lean!",desc:"从读取反馈开始，区分类型检查、求值和基础字面量。题目按基础、辨析、应用逐步推进。",xp:10,draw:6,mix:[2,2,2],questions:[
      {id:"hello-check-nat",level:1,concept:"check",p:"Lean 会报告哪个类型？",c:"#check (7 : Nat)",o:["Nat","Bool","String"],a:0,e:"#check 只报告类型；显式标注已经给出 Nat。"},
      {id:"hello-eval-add",level:1,concept:"eval",p:"这条命令显示什么结果？",c:"#eval 2 + 3",o:["5","Nat","2 + 3"],a:0,e:"#eval 执行自然数加法并显示 5。"},
      {id:"hello-string",level:1,concept:"literalTypes",p:"双引号字面量属于什么类型？",c:"#check \"Lean\"",o:["String","Char","List Nat"],a:0,e:"双引号文本属于 String。"},
      {id:"hello-bool",level:2,concept:"literalTypes",p:"false 的类型是什么？",c:"#check false",o:["Bool","Prop","Nat"],a:0,e:"false 是布尔值，类型为 Bool。"},
      {id:"hello-char",level:2,concept:"literalTypes",p:"单引号中的 L 属于什么类型？",c:"#check 'L'",o:["Char","String","Bool"],a:0,e:"单个字符使用 Char；字符串使用双引号。"},
      {id:"hello-prop",level:2,concept:"prop",p:"等式 2 + 2 = 4 的类型是什么？",c:"#check (2 + 2 = 4)",o:["Prop","Bool","Nat"],a:0,e:"等式是一条数学命题，因此属于 Prop。"},
      {id:"hello-if",level:3,concept:"eval",p:"Lean 会选择哪个分支？",c:"#eval if true then 10 else 20",o:["10","20","Bool"],a:0,e:"条件为 true，所以计算结果是 10。"},
      {id:"hello-check-fun",level:3,concept:"arrow",p:"匿名加一函数的类型是什么？",c:"#check (fun x : Nat => x + 1)",o:["Nat → Nat","Nat","Prop"],a:0,e:"它接收 Nat 并返回 Nat。"},
      {id:"hello-check-vs-eval",level:3,concept:"check",p:"只想知道 double 4 的类型而不计算，应使用哪条命令？",c:"def double (n : Nat) := n + n",o:["#check double 4","#eval double 4","#synth double 4"],a:0,e:"#check 检查类型，#eval 才会执行计算。"}
    ]},

    types:{label:"类型与表达式",desc:"从基础类型过渡到函数、积、列表和隐式参数，逐渐建立类型推断直觉。",xp:10,draw:6,mix:[2,2,2],questions:[
      {id:"types-nat",level:1,concept:"literalTypes",p:"自然数 42 默认属于什么类型？",c:"#check 42",o:["Nat","Int","Float"],a:0,e:"在没有其他约束时，自然数字面量默认推断为 Nat。"},
      {id:"types-bool",level:1,concept:"literalTypes",p:"true 属于哪个基础类型？",c:"#check true",o:["Bool","Prop","String"],a:0,e:"true 与 false 是 Bool 的两个值。"},
      {id:"types-annotation",level:1,concept:"annotation",p:"哪个写法把参数 n 标注为 Nat？",c:"def inc ___ : Nat := n + 1",o:["(n : Nat)","[n = Nat]","{Nat n}"],a:0,e:"显式参数使用圆括号和冒号标注类型。"},
      {id:"types-arrow",level:2,concept:"arrow",p:"“输入 Nat，输出 Bool”的函数类型是？",c:"#check ___",o:["Nat → Bool","Nat × Bool","Nat = Bool"],a:0,e:"箭头左侧是输入类型，右侧是输出类型。"},
      {id:"types-pair",level:2,concept:"product",p:"这个二元组的类型是什么？",c:"#check (3, true)",o:["Nat × Bool","List Nat","Nat → Bool"],a:0,e:"一对值形成积类型 Nat × Bool。"},
      {id:"types-list",level:2,concept:"product",p:"这个列表的元素类型是什么？",c:"#check [1, 2, 3]",o:["List Nat","Nat × Nat","Array Bool"],a:0,e:"所有元素都是自然数，因此类型为 List Nat。"},
      {id:"types-right-assoc",level:3,concept:"arrow",p:"Nat → Bool → String 如何结合？",c:"#check Nat → Bool → String",o:["Nat → (Bool → String)","(Nat → Bool) → String","Nat × Bool × String"],a:0,e:"函数箭头向右结合。"},
      {id:"types-polymorphic",level:3,concept:"implicit",p:"调用 id' true 时，隐式类型 α 被推断为什么？",c:"def id' {α : Type} (x : α) : α := x\n#check id' true",o:["Bool","Type","Prop"],a:0,e:"实参 true 让 Lean 推断 α = Bool。"},
      {id:"types-return-mismatch",level:3,concept:"annotation",p:"这个定义为何不能通过类型检查？",c:"def bad (n : Nat) : Bool := n + 1",o:["右侧是 Nat，不是 Bool","参数必须用方括号","def 不能定义函数"],a:0,e:"声明的返回类型 Bool 与右侧自然数表达式不一致。"}
    ]},

    define:{label:"定义函数",desc:"从具名定义和匿名函数开始，继续学习局部绑定、应用、复合与部分应用。",xp:15,draw:6,mix:[2,2,2],questions:[
      {id:"define-keyword",level:1,concept:"def",p:"哪个关键字开始具名定义？",c:"___ double (n : Nat) : Nat := n + n",o:["def","theorem","namespace"],a:0,e:"def 创建可计算的具名定义。"},
      {id:"define-fun",level:1,concept:"fun",p:"哪段代码是匿名加一函数？",c:"#check (___ : Nat → Nat)",o:["fun x => x + 1","def x := x + 1","theorem x + 1"],a:0,e:"fun 创建匿名函数。"},
      {id:"define-application",level:1,concept:"application",p:"如何把 double 应用于 5？",c:"def double (n : Nat) := n + n",o:["double 5","double(5 :)","5 double"],a:0,e:"Lean 用空格表示函数应用。"},
      {id:"define-let",level:2,concept:"let",p:"补全局部绑定关键字。",c:"#eval ___ n := 4; n * n",o:["let","def","intro"],a:0,e:"let 在当前表达式中临时绑定 n。"},
      {id:"define-return",level:2,concept:"annotation",p:"空格处应填写哪个返回类型？",c:"def isZero (n : Nat) : ___ := n == 0",o:["Bool","Nat","String"],a:0,e:"== 是可判定相等测试，这里返回 Bool。"},
      {id:"define-two-args",level:2,concept:"application",p:"如何调用两个参数的 add？",c:"def add (a b : Nat) := a + b",o:["add 2 3","add (2, 3)","2 add 3"],a:0,e:"多参数函数通过连续空格逐次应用。"},
      {id:"define-compose",level:3,concept:"compose",p:"哪个函数表示先 inc 再 double？",c:"def inc (n : Nat) := n + 1\ndef double (n : Nat) := n + n",o:["fun x => double (inc x)","fun x => inc (double x)","double + inc"],a:0,e:"最内层 inc 先运行，再把结果交给 double。"},
      {id:"define-partial",level:3,concept:"application",p:"add 2 的类型是什么？",c:"def add (a b : Nat) := a + b\n#check add 2",o:["Nat → Nat","Nat","Nat × Nat"],a:0,e:"只提供第一个参数后，仍得到等待第二个参数的函数。"},
      {id:"define-poly-id",level:3,concept:"implicit",p:"哪个定义能对任意类型返回原值？",c:"___",o:["def id' {α : Type} (x : α) : α := x","def id' (x : Nat) : Bool := x","def id' : Nat := 0"],a:0,e:"隐式类型参数 α 使同一定义适用于任意类型。"}
    ]},

    practice:{label:"快速练习",desc:"跨越命令、类型和函数定义的综合题；每次从分层题池重新组卷。",xp:20,draw:6,mix:[2,2,2],questions:[
      {id:"practice-eval",level:1,concept:"eval",p:"哪条命令会计算 square 4？",c:"def square (n : Nat) := n * n",o:["#eval square 4","#check square 4","#check square"],a:0,e:"#eval 执行函数调用并得到 16。"},
      {id:"practice-type",level:1,concept:"arrow",p:"double 的类型是什么？",c:"def double (n : Nat) : Nat := n + n",o:["Nat → Nat","Nat","Prop"],a:0,e:"double 接收并返回自然数。"},
      {id:"practice-string",level:1,concept:"literalTypes",p:"哪个值能作为 String 参数？",c:"def greet (name : String) := \"Hi, \" ++ name",o:["\"Lean\"","'L'","true"],a:0,e:"双引号文本才是 String。"},
      {id:"practice-annotation",level:2,concept:"annotation",p:"哪个定义具有 Bool 返回类型？",c:"___",o:["def positive (n : Nat) : Bool := decide (0 < n)","def positive (n : Nat) : Nat := true","def positive : Bool → Nat := 1"],a:0,e:"0 < n 是可判定命题，decide 把判定结果计算为 Bool。"},
      {id:"practice-let",level:2,concept:"let",p:"这段程序计算出什么？",c:"#eval let x := 3; let y := 4; x + y",o:["7","12","Nat → Nat"],a:0,e:"两个局部值相加得到 7。"},
      {id:"practice-fun",level:2,concept:"fun",p:"哪个匿名函数返回输入是否为零？",c:"#check (___ : Nat → Bool)",o:["fun n => n == 0","fun n => n + 0","fun n => \"0\""],a:0,e:"n == 0 返回 Bool。"},
      {id:"practice-infer",level:3,concept:"implicit",p:"pair true 3 中 α 与 β 分别是什么？",c:"def pair {α β : Type} (a : α) (b : β) := (a, b)",o:["Bool 与 Nat","Nat 与 Bool","Type 与 Type"],a:0,e:"Lean 分别从两个实参推断隐式类型。"},
      {id:"practice-compose",level:3,concept:"compose",p:"这段复合计算的结果是什么？",c:"def inc (n : Nat) := n + 1\ndef double (n : Nat) := n + n\n#eval (double ∘ inc) 3",o:["8","7","6"],a:0,e:"先 inc 3 = 4，再 double 4 = 8。"},
      {id:"practice-error",level:3,concept:"arrow",p:"哪个调用会产生类型错误？",c:"def negateBool (b : Bool) : Bool := !b",o:["negateBool 1","negateBool true","negateBool false"],a:0,e:"1 默认是 Nat，不能传给要求 Bool 的函数。"}
    ]},

    prop:{label:"命题即类型",desc:"从 Prop 出发，依次理解蕴含、合取、析取以及证明项的构造方式。",xp:12,draw:6,mix:[2,2,2],questions:[
      {id:"prop-type",level:1,concept:"prop",p:"命题 True 的类型是什么？",c:"#check True",o:["Prop","Bool","Type"],a:0,e:"True 是一个命题，所以属于 Prop。"},
      {id:"prop-equality",level:1,concept:"prop",p:"n = 0 是什么？",c:"variable (n : Nat)\n#check n = 0",o:["一个 Prop","一个 Bool","一个 Nat"],a:0,e:"Lean 的等式形成命题，而不是布尔值。"},
      {id:"prop-bool-diff",level:1,concept:"prop",p:"哪一个表达式是 Bool 而不是 Prop？",c:"___",o:["true","True","2 = 2"],a:0,e:"小写 true 是 Bool 值；True 与等式属于 Prop。"},
      {id:"prop-imp",level:2,concept:"implication",p:"P → Q 的证明需要做什么？",c:"variable (P Q : Prop)",o:["把 P 的证明变成 Q 的证明","同时给出 P 与 Q","只给出 P 的证明"],a:0,e:"蕴含在类型论中就是证明之间的函数。"},
      {id:"prop-and",level:2,concept:"conjunction",p:"已有 hP : P 与 hQ : Q，如何构造 P ∧ Q？",c:"hP : P\nhQ : Q\n⊢ P ∧ Q",o:["And.intro hP hQ","Or.inl hP","hP hQ"],a:0,e:"And.intro 接收合取两侧的证明。"},
      {id:"prop-or",level:2,concept:"disjunction",p:"已有 hP : P，如何证明 P ∨ Q？",c:"hP : P\n⊢ P ∨ Q",o:["Or.inl hP","And.intro hP","exact Q"],a:0,e:"Or.inl 选择析取的左侧。"},
      {id:"prop-proof-fun",level:3,concept:"implication",p:"哪个证明项证明 P → P？",c:"variable (P : Prop)\n#check ___",o:["fun h : P => h","And.intro P P","Or.inl P"],a:0,e:"接收 P 的证明并原样返回，就得到 P → P。"},
      {id:"prop-and-elim",level:3,concept:"conjunction",p:"从 h : P ∧ Q 如何取得 Q？",c:"h : P ∧ Q\n⊢ Q",o:["exact h.2","exact h.1","exact h"],a:0,e:"合取证明的第二个投影 h.2 是 Q 的证明。"},
      {id:"prop-theorem",level:3,concept:"theorem",p:"哪个关键字适合声明可复用的具名证明？",c:"___ identity (P : Prop) : P → P := fun h => h",o:["theorem","let","structure"],a:0,e:"theorem 为证明建立长期可引用的名字。"}
    ]},

    strategy:{label:"证明策略",desc:"从读目标开始，逐步掌握 intro、exact、apply、constructor 与 cases。",xp:15,draw:6,mix:[2,2,2],questions:[
      {id:"strategy-by",level:1,concept:"by",p:"哪个关键字开始策略证明？",c:"example (P : Prop) : P → P := ___",o:["by","where","match"],a:0,e:"by 进入策略模式。"},
      {id:"strategy-intro",level:1,concept:"intro",p:"目标是 P → P，第一步是什么？",c:"⊢ P → P",o:["intro hP","exact P","rw [P]"],a:0,e:"intro 把箭头左侧前提加入上下文。"},
      {id:"strategy-exact",level:1,concept:"exact",p:"已有 hP : P，如何关闭目标 P？",c:"hP : P\n⊢ P",o:["exact hP","intro hP","apply P"],a:0,e:"hP 的类型与目标完全一致。"},
      {id:"strategy-apply",level:2,concept:"apply",p:"已有 hPQ : P → Q，目标为 Q，使用什么？",c:"hPQ : P → Q\n⊢ Q",o:["apply hPQ","rw [hPQ]","constructor"],a:0,e:"apply 把目标 Q 反推为需要证明 P。"},
      {id:"strategy-constructor",level:2,concept:"constructor",p:"目标 P ∧ Q 应如何拆分？",c:"⊢ P ∧ Q",o:["constructor","intro","rfl"],a:0,e:"constructor 产生 P 与 Q 两个子目标。"},
      {id:"strategy-cases",level:2,concept:"cases",p:"已有 h : P ∧ Q，哪种策略可以分析它的两部分？",c:"h : P ∧ Q",o:["cases h","rw [h]","rfl"],a:0,e:"cases 按 And 的构造器展开合取证明。"},
      {id:"strategy-trans",level:3,concept:"apply",p:"完成蕴含传递时，空格处应是什么？",c:"example (P Q R : Prop) (hPQ : P → Q) (hQR : Q → R) : P → R := by\n  intro hP\n  apply hQR\n  ___",o:["exact hPQ hP","exact hP","constructor"],a:0,e:"apply hQR 后目标变成 Q，而 hPQ hP 正是 Q 的证明。"},
      {id:"strategy-swap",level:3,concept:"constructor",p:"证明 Q ∧ P 时，第一步应使用哪个策略？",c:"example (P Q : Prop) (h : P ∧ Q) : Q ∧ P := by\n  ___",o:["constructor","intro","rfl"],a:0,e:"先将合取目标拆为 Q 和 P，再分别使用 h.2、h.1。"},
      {id:"strategy-exact-call",level:3,concept:"exact",p:"哪个完整证明能证明 P → P？",c:"example (P : Prop) : P → P := by",o:["intro h; exact h","exact P","constructor"],a:0,e:"先引入 P 的证明，再原样交付。"}
    ]},

    rewrite:{label:"等式改写",desc:"从反身性和单步替换推进到反向改写、假设改写和自动化简。",xp:15,draw:6,mix:[2,2,2],questions:[
      {id:"rewrite-rfl",level:1,concept:"rfl",source:"nng4-adapted",p:"哪个策略直接证明 x = x？",c:"example (x : Nat) : x = x := by\n  ___",o:["rfl","intro","apply x"],a:0,e:"两侧定义上相同，rfl 直接关闭目标。"},
      {id:"rewrite-rw",level:1,concept:"rw",source:"nng4-adapted",p:"已知 h : y = x + 7，如何把目标中的 y 替换掉？",c:"h : y = x + 7\n⊢ 2 * y = 2 * (x + 7)",o:["rw [h]","exact h","intro y"],a:0,e:"rw [h] 将 y 改写成 x + 7。"},
      {id:"rewrite-simp",level:1,concept:"simp",p:"最适合证明 n + 0 = n 的策略是？",c:"example (n : Nat) : n + 0 = n := by\n  ___",o:["simp","constructor","intro"],a:0,e:"simp 会使用 Nat.add_zero。"},
      {id:"rewrite-reverse",level:2,concept:"rwReverse",source:"nng4-adapted",p:"若 h : a = b，如何把目标中的 b 改写回 a？",c:"h : a = b\n⊢ b = a",o:["rw [← h]","rw [h]","exact b"],a:0,e:"左箭头指定沿等式反方向改写。"},
      {id:"rewrite-chain",level:2,concept:"rw",p:"如何连续使用 h₁ 和 h₂ 改写？",c:"h₁ : a = b\nh₂ : b = c\n⊢ a = c",o:["rw [h₁, h₂]","rw h₁ h₂","exact h₁"],a:0,e:"rw 的方括号可以按顺序列出多个等式。"},
      {id:"rewrite-at",level:2,concept:"rwAt",p:"想只改写假设 h₂，应使用哪个写法？",c:"h₁ : a = b\nh₂ : f a = c",o:["rw [h₁] at h₂","rw [h₂] at h₁","rw [h₁]"],a:0,e:"at h₂ 把改写目标指定为假设 h₂。"},
      {id:"rewrite-defeq",level:3,concept:"rfl",p:"哪个目标最适合直接用 rfl？",c:"___",o:["example (x : Nat) : (fun y => y) x = x := by rfl","example (x : Nat) : x + 0 = x := by rfl","example (a b : Nat) : a + b = b + a := by rfl"],a:0,e:"匿名恒等函数应用后定义归约为 x；另外两项一般需要定理。"},
      {id:"rewrite-targeted",level:3,concept:"rw",p:"目标中有多个加法，怎样指定交换 a 与 c？",c:"⊢ b + c + a = b + (a + c)",o:["rw [Nat.add_comm a c]","rw [Nat.add_comm]","rfl"],a:0,e:"显式提供参数可以让改写命中想要的子表达式。"},
      {id:"rewrite-simp-hyp",level:3,concept:"simp",p:"如何同时化简假设 h 和当前目标？",c:"h : n + 0 = m\n⊢ m + 0 = n",o:["simp at h ⊢","simp only","exact h"],a:0,e:"at h ⊢ 指定假设 h 与目标都参与化简。"}
    ]},

    reuse:{label:"引用定理",desc:"学习检查签名、处理命名空间并把通用定理实例化为当前证明。",xp:20,draw:6,mix:[2,2,2],questions:[
      {id:"reuse-check",level:1,concept:"checkTheorem",p:"引用陌生定理前，先用什么查看完整类型？",c:"___ Nat.add_comm",o:["#check","#eval","#print axioms"],a:0,e:"#check 显示参数顺序与结论。"},
      {id:"reuse-qualified",level:1,concept:"namespace",p:"自然数加法交换律的完整限定名是？",c:"#check ___",o:["Nat.add_comm","Set.add_comm","Group.Nat"],a:0,e:"该定理位于 Nat 命名空间。"},
      {id:"reuse-call",level:1,concept:"theoremCall",p:"如何取得 a + b = b + a 的证明？",c:"a b : Nat\n⊢ a + b = b + a",o:["exact Nat.add_comm a b","exact Nat.add_comm","rw [Nat]"],a:0,e:"给通用定理传入 a、b 得到具体证明。"},
      {id:"reuse-theorem",level:2,concept:"theorem",p:"哪段声明会留下可引用名字 identity？",c:"___ identity (P : Prop) : P → P := fun h => h",o:["theorem","example","let"],a:0,e:"theorem 建立具名证明；example 不建立长期名字。"},
      {id:"reuse-open",level:2,concept:"namespace",p:"执行 open Set 后有什么作用？",c:"open Set",o:["可在当前作用域省略部分 Set. 前缀","创建新的集合","导入整个 Mathlib"],a:0,e:"open 只影响名称解析，不创建对象也不导入文件。"},
      {id:"reuse-implicit",level:2,concept:"implicit",p:"定理的隐式类型参数通常怎样提供？",c:"theorem idProof {P : Prop} (h : P) : P := h",o:["由 Lean 从 h 和目标推断","必须每次手写 P","由 #eval 计算"],a:0,e:"花括号参数通常从显式实参或目标中推断。"},
      {id:"reuse-simpa",level:3,concept:"simpaUsing",p:"已有 one_mul x 的结论与目标仅差化简，适合使用什么？",c:"variable {M : Type*} [Monoid M]\nexample (x : M) : 1 * x = x := by\n  ___",o:["simpa using one_mul x","intro x","rfl"],a:0,e:"simpa using 先化简证明类型和目标再匹配。"},
      {id:"reuse-method",level:3,concept:"theoremCall",p:"已知 hf、hg 连续，如何调用复合定理？",c:"hf : Continuous f\nhg : Continuous g\n⊢ Continuous (g ∘ f)",o:["exact hg.comp hf","exact hf.comp hg","rw [Continuous]"],a:0,e:"外层函数 g 的连续性 hg 调用 comp，并传入内层 hf。"},
      {id:"reuse-check-args",level:3,concept:"checkTheorem",p:"若不确定 mul_assoc 的参数顺序，最可靠的做法是？",c:"___",o:["先写 #check mul_assoc","反复猜测并运行","用 #eval mul_assoc"],a:0,e:"#check 是检查定理调用签名的直接方式。"}
    ]},

    daily:{label:"练习场",desc:"跨单元随机复习；每次从基础、连接、应用三个层次各抽题，避免固定顺序记答案。",xp:5,draw:6,mix:[2,2,2],questions:[
      {id:"daily-check",level:1,concept:"check",p:"哪条命令只查看表达式类型？",c:"___ (fun x : Nat => x)",o:["#check","#eval","#reduce"],a:0,e:"#check 不执行表达式。"},
      {id:"daily-def",level:1,concept:"def",p:"补全具名函数定义。",c:"___ previous (n : Nat) := n - 1",o:["def","example","open"],a:0,e:"def 创建具名可计算定义。"},
      {id:"daily-prop",level:1,concept:"prop",p:"哪一个表达式属于 Prop？",c:"___",o:["3 ≤ 5","true","\"Prop\""],a:0,e:"序关系形成命题；true 属于 Bool。"},
      {id:"daily-rfl",level:1,concept:"rfl",p:"证明 8 = 8 最直接的策略是？",c:"example : 8 = 8 := by\n  ___",o:["rfl","intro","apply"],a:0,e:"两边相同，使用反身性。"},
      {id:"daily-pair",level:2,concept:"product",p:"(true, 4) 的类型是什么？",c:"#check (true, 4)",o:["Bool × Nat","Nat × Bool","List Bool"],a:0,e:"二元组按分量顺序形成积类型。"},
      {id:"daily-apply",level:2,concept:"apply",p:"已有 h : P → Q 且目标为 Q，应先做什么？",c:"h : P → Q\n⊢ Q",o:["apply h","rw [h]","rfl"],a:0,e:"apply 把 Q 反推为需要证明 P。"},
      {id:"daily-rw",level:2,concept:"rw",p:"已知 h : x = 3，怎样替换目标中的 x？",c:"h : x = 3\n⊢ x + x = 6",o:["rw [h]","exact h","intro x"],a:0,e:"rw [h] 替换所有匹配的 x。"},
      {id:"daily-and",level:2,concept:"conjunction",p:"已有 hP 与 hQ，哪个证明 P ∧ Q？",c:"hP : P\nhQ : Q",o:["And.intro hP hQ","Or.inl hP","hP hQ"],a:0,e:"And.intro 同时打包两侧证明。"},
      {id:"daily-compose",level:3,concept:"compose",p:"先 square 再 inc 应写成什么？",c:"def square (n : Nat) := n * n\ndef inc (n : Nat) := n + 1",o:["inc ∘ square","square ∘ inc","inc square"],a:0,e:"复合符号右侧的函数先执行。"},
      {id:"daily-reverse",level:3,concept:"rwReverse",p:"h : a = b 时，怎样将 b 改回 a？",c:"h : a = b\n⊢ b = a",o:["rw [← h]","rw [h]","simp only [b]"],a:0,e:"左箭头指定反向改写。"},
      {id:"daily-namespace",level:3,concept:"namespace",p:"集合像的完整名称是什么？",c:"#check ___",o:["Set.image","Nat.image","image.Set"],a:0,e:"image 定义位于 Set 命名空间。"},
      {id:"daily-proof-call",level:3,concept:"theoremCall",p:"如何直接引用自然数乘法结合律？",c:"a b c : Nat\n⊢ a * b * c = a * (b * c)",o:["exact Nat.mul_assoc a b c","exact Nat.add_assoc a b c","rfl"],a:0,e:"Nat.mul_assoc 的具体实例正好匹配目标。"}
    ]}
  };

  const sources = [
    {id:"nng4",name:"Natural Number Game 4",url:"https://github.com/leanprover-community/NNG4",license:"Apache-2.0"},
    {id:"tpil",name:"Theorem Proving in Lean 4",url:"https://github.com/leanprover/theorem_proving_in_lean4",license:"Apache-2.0"},
    {id:"mil",name:"Mathematics in Lean",url:"https://github.com/leanprover-community/mathematics_in_lean",license:"Apache-2.0"}
  ];

  window.LEANPATH_CONCEPTS = concepts;
  window.LEANPATH_QUESTION_BANKS = decks;
  window.LEANPATH_QUESTION_SOURCES = sources;
}());

# LeanPath — Lean 4 互动学习 Demo

一个类似多邻国学习路径的 Lean 4 中文入门网站。Demo 覆盖基础语法、命题与证明、集合、代数结构、拓扑空间，并提供即时判题、XP、学习进度和可复制的语法手册。

## 直接预览

静态 GitHub Pages 版本是单文件应用：直接用浏览器打开 `docs/index.html` 即可，不需要安装依赖或启动服务器。

主要功能：

- 5 个学习单元、21 个关卡的课程地图
- “定义函数”三题互动练习，包含正确／错误反馈
- 基础语法、定理证明、集合、代数结构、拓扑五类语法手册
- 使用浏览器 `localStorage` 保存 XP 与练习完成状态
- 桌面端、平板与手机响应式布局
- 无外部字体、图片或运行时依赖

## 发布到 GitHub Pages

项目已包含 `.github/workflows/pages.yml`。把整个项目推送到 GitHub 仓库的 `main` 分支后：

1. 打开仓库的 **Settings → Pages**。
2. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
3. 推送一次 `main` 分支，或在 **Actions** 页手动运行 `Deploy LeanPath to GitHub Pages`。
4. 部署成功后，Pages 页面会显示公开网址。

工作流直接发布 `docs/`，无需 Node.js 构建。GitHub Pages 的入口文件是 `docs/index.html`。

## 两种源码形态

- `docs/index.html`：自包含静态版，专用于 GitHub Pages。
- `app/page.tsx` 与 `app/globals.css`：React/Vinext 增强版，便于继续扩展课程数据、账号与在线 Lean 编译。

## 内容范围

| 单元 | 重点 |
| --- | --- |
| 与 Lean 初次见面 | `#check`、`#eval`、`def`、`fun`、`structure` |
| 命题与证明 | `theorem`、`example`、`by`、`exact`、`apply`、`rw`、`simp` |
| 集合与函数 | `Set α`、`∈`、`⊆`、并交、像与原像、外延性 |
| 结构与代数 | `structure`、`class`、`instance`、`Monoid`、`Group`、`Ring`、`Field` |
| 拓扑初步 | `TopologicalSpace`、`IsOpen`、`IsClosed`、`Continuous`、`Tendsto` |

## 下一步扩展建议

- 接入 Lean 4 WebAssembly 或远程 Lean Server，替换 Demo 的前端判题
- 将课程数据拆分成 JSON，逐步补齐所有关卡
- 增加账号、云端进度、错题本与每日复习
- 加入 Mathlib 版本固定、代码补全与错误消息讲解

## 许可证

Demo 源码可作为你的项目起点继续修改；正式公开前建议补充项目许可证与贡献指南。

# 🎤 VBTI · 测测你的灵魂歌姬

> 39 道题，深入你的术力口人格，测出那位与你灵魂共振的虚拟歌姬！
<!--
<p align="center">
  <img src="" alt="VBTI Screenshot" width="600" />
  TODO: 添加截图地址
</p>
-->

<p align="center">
  <a href="https://vbti-test.com/"><strong>🔗 开始测试</strong></a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="https://github.com/project-cvsa/vbti"><strong>📦 GitHub 仓库</strong></a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#"><strong>💬 交流群：747501305</strong></a>
</p>

## 📖 简介

**VBTI** 是一款基于 MBTI 性格模型的虚拟歌姬匹配测试。通过 39 道精心设计的题目，算法将从数十位虚拟歌姬中，为你找出性格最契合的那一位。

> ⚠️ 测试结果仅供娱乐参考。愿你无论测出哪位歌姬，都能在自己的世界闪闪发光！

## 🎵 特别鸣谢

**策划 & 开发**：Crimson茜（墨白茜兔）

**新构架支持**：星火映渊（星寒）

**核心内容协力**：特瑞嗷、周刊虚拟歌手中文曲排行榜（失落的分别，物质的量_mol）、变大河河、诺诺小熊猫

**测试感谢**：花儿不哭、-森久保行野-、鬼面P、CARDINAL星海、Semaa小赛、半只金蓝、鱼丸君、侨汣、绿洲计划、-朝尘-、诐狐

**BGM**：拼凑的断音 - Toa

## 技术栈

| 类别 | 技术 |
|---|---|
| 框架 | React 19 + TypeScript |
| 路由 | React Router v7 |
| 状态管理 | Jotai |
| UI 组件 | shadcn/ui (Radix UI) |
| 样式 | Tailwind CSS v4 |
| 构建工具 | Vite 8 + Bun |
| 代码规范 | Biome |
| 测试 | Vitest |
| 部署 | Cloudflare Pages |
| 辅助开发 | DeepSeek-V4 |

## 项目结构

```
vbti/
├── index.html              # 入口 HTML
├── package.json            # 项目清单
├── vite.config.ts          # Vite 构建配置
├── biome.json              # Lint & 格式化配置
├── tsconfig*.json          # TypeScript 配置
├── public/                 # 静态资源（角色图片、BGM、favicon 等）
├── scripts/                # 数据维护脚本
├── dist/                   # 构建产物
└── src/
    ├── main.tsx            # 应用入口
    ├── App.tsx             # 根组件 & 路由
    ├── index.css           # Tailwind CSS 入口
    ├── core/               # 核心算法（MBTI 计算、角色匹配、调整函数）
    │   └── specials/       # 特殊调整逻辑（语言偏好、角色偏好、冷热门等）
    ├── data/               # 静态数据（角色、题库、彩蛋题库）
    ├── state/              # 全局状态 (Jotai atoms)
    ├── lib/                # 工具函数 (为shadcn兼容性而保留)
    ├── pages/              # 页面级组件
    └── components/         # UI 组件
        ├── screens/        # 全屏视图（首页、测试、结果）
        ├── layout/         # 布局组件（AppShell、BGM 控制）
        ├── modals/         # 弹窗（答题回顾、彩蛋、Staff 名单）
        ├── test/           # 测试相关组件（题目卡片、进度条）
        └── ui/             # 基础 UI 组件（shadcn/ui）
```

## 核心算法

角色匹配算法的核心流程如下：

### 1. 初始化概率分布

算法启动时，所有候选角色获得**均等的初始概率**，即每个角色的选中概率完全相同。

### 2. 调整函数

根据被测者在不同题目中的回答，依次应用以下调整函数来修正概率分布：

| 调整函数 | 作用 |
|---|---|
| `adjustCharacterPref` | 若在特定题目中选择了某位歌姬，提升对应角色的概率 |
| `adjustLangPref` | 若体现出中 V / 日 V 偏好，整体调整对应语言角色的概率 |
| `determineLang` | 若在第 33/34 题明确选择语言偏好，排除不符语言的角色 |
| `adjustMBTI` | 根据被测者 MBTI 计算结果，调整匹配角色的概率 |
| `adjustPopularity` | 根据用户对冷 / 热门角色的偏好，增强或削弱对应角色 |

### 3. 策略分支（第 0 题）

第 0 题作为「偏好导向题」，决定整套调整策略的走向：

- **"性格越像我越好"** → MBTI 为主，语言偏好为辅
- **"和我爱听的术力口一致"** → 角色偏好为主，MBTI 为辅
- **"越冷门越特别"** → 大幅增强冷门角色，降低热门角色概率
- **"随便"** → 通用均衡策略

不同分支调用不同顺序与权重的调整函数组合，详见 `src/core/findChar.ts`。

### 4. 随机采样

最终概率分布经过**归一化**后，将用户的完整回答作为种子送入一个 PRNG，生成随机数。将概率分布转化为 CDF，返回随机数落点对应的区间，即为最终匹配到的角色。

> 同一个答题结果在多次测试中会得到**一致的角色**，保证结果的稳定性与可复现性。

## 开发

```bash
# 安装依赖
bun install

# 启动开发服务器
bun run dev

# 构建生产版本
bun run build

# 运行测试
bun run test

# 代码检查与格式化
bun run lint
bun run format
```

## 贡献

欢迎反馈与建议！可以通过 [GitHub Issues](https://github.com/project-cvsa/vbti/issues) 提交问题或通过交流群（747501305）联系我们。

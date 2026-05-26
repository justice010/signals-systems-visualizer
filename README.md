# Signals & Systems Visualizer

> **全景交互式《信号与系统》物理引擎与可视化教材**

![License](https://img.shields.io/badge/license-MIT-red.svg)
![React](https://img.shields.io/badge/React-18.x-61DAFB.svg?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC.svg?logo=tailwind-css)

**Signals & Systems Visualizer** 是一个基于 React + HTML5 Canvas 构建的硬核工程教育项目。它旨在将郑君里《信号与系统》等经典教材中枯燥的微积分方程、抽象的复平面变换，转化为**直观、实时、可交互的物理可视化引擎**。

摒弃死记硬背，让极点动起来，让噪声滚起来，让系统逼近的过程肉眼可见！

---

## ✨ 核心特性 (The 12 Chapters)

本项目通过“策略模式 (Strategy Pattern)”实现了全书 12 大核心模块的动态渲染联动：

- ⏱️ **时域与频域分析：** 包含时域卷积动画、傅里叶级数合成，直观展示信号如何在时频两域相互映射。
- 📐 **复频域 (s域) 稳定性：** 动态极点拖拽，实时观察连续系统的冲激响应形态变化与稳定性边界。
- 🌀 **离散系统 (z域)：** 引入 3D 视角，展示单位圆上的极点分布如何决定离散序列的振荡与收敛。
- 🚀 **状态空间与相平面：** 告别枯燥的矩阵特征值计算，在 2D 相平面上画出极其优雅的状态轨迹图。
- 📐 **矢量空间与 Parseval 定理：** 将抽象信号转化为 3D 正交基上的几何投影，柱状图实时验证能量守恒。
- 🔄 **线性反馈与根轨迹：** 内置“平衡物理实验室”。拖动反馈增益滑块，亲眼见证实轴极点相撞爆开的根轨迹，以及超调振荡波形。
- 🎛️ **滤波器系统逼近：** 巴特沃斯 (Butterworth) 半圆极点分布 vs. 切比雪夫 (Chebyshev) 椭圆涟波响应的极限对比。
- 🎲 **随机信号与有色噪声：** 实时滚动的双轨射频示波器。调整系统带宽，观察狂躁白噪声如何被平滑过滤为有色噪声。

## 🛠️ 技术栈与架构设计

- **核心框架：** React + TypeScript + Vite
- **状态管理：** Zustand (全局参数注入与路由状态机)
- **绘图引擎：** 原生 HTML5 Canvas API (高性能动画流渲染)
- **UI 布局：** Tailwind CSS (极客风暗色主题，自适应分屏响应)
- **架构亮点：** 采用完全解耦的**多策略模式 (Strategy Pattern)**。新增章节只需在 `strategies/` 目录下新建类并实现 `draw()` 方法，无需侵入核心业务逻辑。

## 🚀 快速启动

1. 克隆仓库到本地：

```bash
git clone https://github.com/justice010/signals-systems-visualizer.git
cd signals-systems-visualizer
```

2. 安装依赖

```bash
npm install
```

3. 启动本地开发服务器

```bash
npm run dev
```

## 🤝 贡献与许可

欢迎任何形式的贡献。

> _"数学是工具，物理是灵魂，工程是归宿。"_ —— 献给所有电子与通信工程的学子们。

---

### ⚖️ 知识产权声明

本项目的所有核心代码和可视化策略遵循 [MIT License](https://opensource.org/licenses/MIT)。
**特别声明：** 本项目所包含的知识库文案、交互逻辑设计及对《信号与系统》教材的教学重构内容，享有著作权。未经作者许可，严禁将其直接用于任何商业课程、付费咨询或以获利为目的的分发。

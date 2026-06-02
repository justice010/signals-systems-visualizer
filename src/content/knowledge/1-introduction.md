---
title: 信号的本质：分类、运算与分解
description: 从分类到运算，从阶跃到冲激，建立信号分析的基础语言
---

## 信号的分类

### 确定性信号与随机信号

能被表示为一个确定时间函数的信号即为**确定性信号**，比如 $f(t) = \cos(t)$；反之，不能被表示为确定时间函数的信号为**随机信号**。

### 周期信号与非周期信号

周期信号就是信号以固定周期重复，经过一个周期后与上一周期的函数图像完全重合：

$$f(t) = f(t + nT), \quad n = 0, \pm1, \pm2, \ldots$$

### 连续时间信号与离散时间信号

**连续时间信号**：在讨论的时间间隔内，除了若干不连续的点之外，任意取一个时间 $t$，都能找到 $f(t)$ 的值，比如 $f(t) = \cos(t)$。

**离散时间信号**：只在某些离散时刻 $t$ 才有 $f(t)$ 的值，比如：

$$f(t) = \{-2, -1, 0, 1, 2\}, \quad t \in \{-2, -1, 0, 1, 2\}$$

---

## 信号的运算

### 移位、反褶与尺度变换

- **移位**（左加右减）：$f(t+2)$ 是 $f(t)$ 沿时间轴**向左**移动 2 个单位
- **反褶**：$f(t) \to f(-t)$，函数图像以 $t=0$ 为轴翻转
- **尺度变换**：$f(at)$ 中，$a > 1$ 时图像**压缩**，$a < 1$ 时图像**扩展**

### 微分与积分

微分：

$$\frac{\mathrm{d}f(t)}{\mathrm{d}t}$$

积分：

$$\int_{-\infty}^{\tau} f(\tau)\,\mathrm{d}\tau$$

### 两信号相加与相乘

设 $f_1(t) = \sin\omega t$，$f_2(t) = \cos\omega t$，则：

$$f_1(t) + f_2(t) = \sin\omega t + \cos\omega t$$

$$f_1(t) \cdot f_2(t) = \sin\omega t \cdot \cos\omega t$$

---

## 阶跃信号与冲激信号

### 斜变信号

$$f(t) = \begin{cases} 0 & (t < 0) \\ t & (t \geq 0) \end{cases}$$

### 单位阶跃信号

单位阶跃信号等于斜变信号的导数：

$$u(t) = \frac{\mathrm{d}f(t)}{\mathrm{d}t}$$

阶跃函数在 $t=0$ 处无意义，通常规定 $u(0) = \dfrac{1}{2}$。

**物理背景**：表示在 $t=0$ 时刻对某电路接入单位电源，并无限持续下去。

### 单位冲激信号 $\delta(t)$

**定义方式一（极限）**：一个宽为 $\tau$、高为 $\dfrac{1}{\tau}$ 的矩形脉冲，保持面积 $\tau \cdot \dfrac{1}{\tau} = 1$ 不变，令 $\tau \to 0$，脉冲幅度趋于无穷大，极限即为单位冲激信号。

**定义方式二（Dirac）**：

$$\begin{cases} \displaystyle\int_{-\infty}^{\infty} \delta(t)\,\mathrm{d}t = 1 \\ \delta(t) = 0 \quad (t \neq 0) \end{cases}$$

### 冲激函数的抽样性质

冲激函数与在 $t=0$ 处连续且处处有界的信号 $f(t)$ 相乘，结果为 $f(0)\delta(t)$，因此：

$$\int_{-\infty}^{\infty} \delta(t)f(t)\,\mathrm{d}t = f(0)$$

延迟 $t_0$ 的冲激函数：

$$\int_{-\infty}^{\infty} \delta(t - t_0)f(t)\,\mathrm{d}t = f(t_0)$$

### 冲激函数是偶函数

证明：

$$\int_{-\infty}^{\infty} \delta(-t)f(t)\,\mathrm{d}t = \int_{-\infty}^{\infty} \delta(\tau)f(-\tau)\,\mathrm{d}\tau = f(0)$$

$\delta(t)$ 和 $\delta(-t)$ 对 $f(t)$ 的作用完全相同，因此在效果上 $\delta(-t) = \delta(t)$，即**冲激函数是偶函数**。

> 要严格理解需要广义函数的知识，这里理解效果等价即可。

### 冲激函数的积分是阶跃函数

由 Dirac 定义：

$$\int_{-\infty}^{t} \delta(\tau)\,\mathrm{d}\tau = \begin{cases} 1 & (t > 0) \\ 0 & (t < 0) \end{cases}$$

与阶跃函数定义对比，得到：

$$\int_{-\infty}^{t} \delta(\tau)\,\mathrm{d}\tau = u(t)$$

反过来，**阶跃函数的导数就是冲激函数**：

$$\frac{\mathrm{d}}{\mathrm{d}t}u(t) = \delta(t)$$

### 冲激偶函数 $\delta'(t)$

冲激函数的微分，即阶跃函数的二阶导数，记为 $\delta'(t)$。

---

## 信号的分解

### 直流分量与交流分量

$$f(t) = f_D + f_A(t)$$

若此时间函数为电流信号，在时间间隔 $T$ 内流过单位电阻所产生的**平均功率**为：

$$P = \frac{1}{T}\int_{-T/2}^{T/2} f^2(t)\,\mathrm{d}t = f_D^2 + \frac{1}{T}\int_{-T/2}^{T/2} f_A^2(t)\,\mathrm{d}t$$

> 即总功率 = 直流功率 + 交流功率，两者互不干扰。

<details>
<summary>📐 平均功率公式的严格推导</summary>

**1. 瞬时功率**

在 $1\,\Omega$ 电阻上：$P = I^2 = f^2(t)$

**2. 平均功率定义**

$$P = \lim_{\tau \to \infty} \frac{1}{\tau}\int_{-\tau/2}^{\tau/2} f^2(t)\,\mathrm{d}t$$

**3. 利用周期性拆分**

对任意大的 $\tau$，写成 $\tau = nT + 2\varepsilon$，其中 $n = \left\lfloor\dfrac{\tau}{T}\right\rfloor$，$0 \leq \varepsilon < T$。

积分区间拆为 $n$ 个完整周期 + 两端残余：

$$\int_{-\tau/2}^{\tau/2} f^2(t)\,\mathrm{d}t = n\int_{-T/2}^{T/2} f^2(t)\,\mathrm{d}t + R$$

其中残余项 $|R| \leq 2MT$（$M$ 为 $f^2(t)$ 的上界），与 $n$ 无关。

**4. 取极限**

$$P = \lim_{n \to \infty} \frac{n}{nT + 2\varepsilon}\int_{-T/2}^{T/2} f^2(t)\,\mathrm{d}t + \underbrace{\lim_{n\to\infty}\frac{R}{nT+2\varepsilon}}_{=0}$$

第一项 $\dfrac{n}{nT+2\varepsilon} \to \dfrac{1}{T}$，第二项趋于 $0$，最终得：

$$\boxed{P = \frac{1}{T}\int_{-T/2}^{T/2} f^2(t)\,\mathrm{d}t}$$

</details>

### 奇分量与偶分量

- **偶分量**：$f_e(t) = f_e(-t)$
- **奇分量**：$f_o(t) = -f_o(-t)$

任意信号可分解为奇偶之和：

$$f(t) = \underbrace{\frac{1}{2}[f(t)+f(-t)]}_{f_e(t)} + \underbrace{\frac{1}{2}[f(t)-f(-t)]}_{f_o(t)}$$

### 脉冲分量

函数 $f(t)$ 可近似看成无数个窄脉冲的叠加。在 $t_1$ 时刻，矩形脉冲高度为 $f(t_1)$，宽度为 $\Delta t_1$：

$$f(t) \approx \sum_{t_1=-\infty}^{\infty} f(t_1)\frac{u(t-t_1)-u(t-t_1-\Delta t_1)}{\Delta t_1} \cdot \Delta t_1$$

令 $\Delta t_1 \to 0$，得到：

$$f(t) = \int_{-\infty}^{\infty} f(t_1)\delta(t - t_1)\,\mathrm{d}t_1$$

即 **任意信号可以用冲激函数的叠加来表示**，这是后续卷积积分的核心基础。

改写变量后，与冲激函数抽样性质完全一致：

$$f(t_0) = \int_{-\infty}^{\infty} f(t)\delta(t - t_0)\,\mathrm{d}t$$

### 实部分量与虚部分量

瞬时值为复数的信号 $f(t)$ 可分解为实部与虚部：

$$f(t) = f_r(t) + jf_i(t)$$

其共轭复函数为 $f^*(t) = f_r(t) - jf_i(t)$，因此：

$$f_r(t) = \frac{1}{2}[f(t) + f^*(t)], \quad jf_i(t) = \frac{1}{2}[f(t) - f^*(t)]$$

$$|f(t)|^2 = f(t)f^*(t) = f_r^2(t) + f_i^2(t)$$
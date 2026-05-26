export const chaptersContent: Record<string, string> = {
  fourier: `# 傅里叶变换核心知识库

欢迎来到频域的世界。这里我们将通过交互式可视化，带你深刻理解《信号与系统》中最重要的核心概念。

---

## 模块一：傅里叶级数与吉布斯现象

法国数学家傅里叶提出：**任何满足狄里赫利条件的周期信号，都可以分解为一系列不同频率的正弦波（或复指数信号）的叠加。**
其指数形式的傅里叶级数公式为：
$$x(t) = \\sum_{n=-\\infty}^{\\infty} X_n e^{jn\\omega_0 t}$$

当我们尝试用有限次谐波去合成一个理想的方波时，随着保留的谐波次数 $N$ 的增加，合成波形会越来越接近真实的方波。但是，在方波的突变处，无论 $N$ 多大，总会存在一个约占总跳变幅度 **9% 的过冲（Overshoot）**。这就是著名的**吉布斯现象（Gibbs Phenomenon）**。

<button class="not-prose interactive-btn bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 mb-4 transition-colors cursor-pointer" data-module="1" data-params='{"N": 3}'>▶ 演示：N=3 时的粗糙合成</button>
<br>
<button class="not-prose interactive-btn bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="1" data-params='{"N": 31}'>▶ 演示：N=31 见证吉布斯现象</button>

---

## 模块二：从离散到连续

自然界中大多数信号是非周期的。在理论推导上，我们将非周期信号视为**周期 $T \\to \\infty$** 的周期信号。

随着周期 $T$ 的不断增大，频域中原本离散的谐波谱线会变得越来越密集。当 $T \\to \\infty$ 时，相邻谱线无限靠近，最终融合为连续的频谱密度函数。这就是从傅里叶级数向**傅里叶变换**演变的本质：
$$X(j\\omega) = \\int_{-\\infty}^{\\infty} x(t)e^{-j\\omega t} dt$$

<button class="not-prose interactive-btn bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 mb-4 transition-colors cursor-pointer" data-module="2" data-params='{"T": 3}'>▶ 演示：周期 T=3 (离散谱)</button>
<br>
<button class="not-prose interactive-btn bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="2" data-params='{"T": 15}'>▶ 演示：周期 T=15 (逼近连续)</button>

---

## 模块三：傅里叶变换的尺度变换

在信号处理领域，时域与频域之间存在着一个极具物理意义的“跷跷板效应”：**信号在时域中被压缩，其频谱在频域中必然被扩展；反之亦然。** 并且，随着时域的压缩，信号的能量在频域被分摊到了更宽的频带上，导致频谱幅度整体下降。
其数学表达为：
$$x(at) \\leftrightarrow \\frac{1}{|a|} X\\left(j\\frac{\\omega}{a}\\right)$$

<button class="not-prose interactive-btn bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 mb-4 transition-colors cursor-pointer" data-module="3" data-params='{"a": 0.5}'>▶ 演示：时域扩展 (a=0.5)</button>
<br>
<button class="not-prose interactive-btn bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="3" data-params='{"a": 2.0}'>▶ 演示：时域压缩 (a=2.0)</button>

---

## 模块四：理想低通滤波器 (LPF)

线性时不变系统对信号的作用，在频域看来本质上就是**滤波**。理想低通滤波器允许低频成分无失真地通过，同时完全截断高于截止频率 $W_c$ 的高频成分。

高频成分通常代表了信号在时域中的“细节”和“突变边缘”。因此，经过低通滤波后，原本拥有锐利边缘的方波会失去细节，变得圆滑（同时可能伴随振铃现象）。

<button class="not-prose interactive-btn bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 mb-4 transition-colors cursor-pointer" data-module="4" data-params='{"Wc": 15}'>▶ 演示：宽通带 Wc=15 (保留边缘)</button>
<br>
<button class="not-prose interactive-btn bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="4" data-params='{"Wc": 3}'>▶ 演示：窄通带 Wc=3 (失去细节)</button>

---

## 模块五：抽样定理 (Nyquist)

模拟信号通向数字世界的桥梁是**抽样**。在时域中对信号进行理想冲激抽样，等效于在频域中将原始信号的频谱以抽样频率 $f_s$ 为间隔进行**周期性的无限搬移**。

为了能利用理想低通滤波器从抽样信号中无失真地恢复原连续信号，抽样频率必须大于等于信号最高频率 $f_m$ 的两倍，即 $f_s \\ge 2f_m$。否则，搬移的频谱发生重叠，就会产生无法消除的**混叠失真 (Aliasing)**。

<button class="not-prose interactive-btn bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded mt-2 mb-4 transition-colors cursor-pointer" data-module="5" data-params='{"fs": 3.0}'>▶ 演示：过抽样 fs=3.0 (完美恢复)</button>
<br>
<button class="not-prose interactive-btn bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="5" data-params='{"fs": 1.5}'>▶ 演示：欠抽样 fs=1.5 (发生混叠)</button>
`,
  'time-domain': `# 时域分析：卷积的奥秘

在时域分析中，最核心的概念莫过于**卷积 (Convolution)**。对于一个线性时不变 (LTI) 系统，其对输入信号 $x(t)$ 的响应 $y(t)$ 可以通过输入信号与系统冲激响应 $h(t)$ 的卷积来确定。

### 卷积积分定义
$$y(t) = x(t) * h(t) = \\int_{-\\infty}^{\\infty} x(\\tau)h(t-\\tau) d\\tau$$

这个公式在物理上可以理解为四个步骤：
1. **反褶 (Fold):** 将 $h(\\tau)$ 关于垂直轴翻转，得到 $h(-\\tau)$。
2. **平移 (Shift):** 将反褶后的信号沿时间轴平移 $t$ 个单位，得到 $h(t-\\tau)$。
3. **相乘 (Multiply):** 将 $x(\\tau)$ 与平移后的 $h(t-\\tau)$ 在每一个 $\\tau$ 时刻相乘。
4. **积分 (Integrate):** 计算相乘后波形下的面积，这个面积值就是 $t$ 时刻的输出 $y(t)$。

右侧的可视化展示了这一动态过程。你可以选择不同的信号类型，观察它们是如何“擦身而过”并产生结果的。

<button class="not-prose interactive-btn bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 mb-4 transition-colors cursor-pointer" data-module="timeDomain" data-params='{"signalType": "rect", "systemType": "rect", "t": -2, "autoPlay": true}'>▶ 演示：两个矩形脉冲的卷积</button>
<br>
<button class="not-prose interactive-btn bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="timeDomain" data-params='{"signalType": "rect", "systemType": "exp", "t": -2, "autoPlay": true}'>▶ 演示：矩形脉冲与指数衰减</button>
`,
  's-domain': `# s 域分析：系统稳定性与拉普拉斯变换

s 域（复频域）分析是理解线性时不变 (LTI) 系统稳定性的终极工具。通过将时域信号变换到复平面 $s = \\sigma + j\\omega$，我们可以利用“零极点”的分布来直观判定系统的行为。

### 核心概念：极点与稳定性
系统的冲激响应 $h(t)$ 的基本形式由其传递函数 $H(s)$ 的极点决定：
- **左半平面极点 ($\\sigma < 0$):** 对应指数衰减波形。系统是**稳定**的。
- **虚轴极点 ($\\sigma = 0$):** 对应等幅振荡或阶跃。系统处于**临界稳定**。
- **右半平面极点 ($\\sigma > 0$):** 对应指数爆炸波形。系统**不稳定**。

右侧的可视化展示了 s 平面与时域波形 $h(t)$ 的实时联动。

<button class="not-prose interactive-btn bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded mt-2 mb-4 transition-colors cursor-pointer" data-module="sDomain" data-params='{"sigma": -0.5, "omega": 5.0}'>▶ 演示：稳定系统 (衰减振荡)</button>
<br>
<button class="not-prose interactive-btn bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="sDomain" data-params='{"sigma": 0.0, "omega": 3.0}'>▶ 演示：临界稳定 (等幅正弦)</button>
<br>
<button class="not-prose interactive-btn bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="sDomain" data-params='{"sigma": 0.2, "omega": 4.0}'>▶ 演示：不稳定系统 (能量爆炸)</button>
`,
  'z-domain': `# z 域分析：单位圆、离散系统与稳定性

z 域分析是数字信号处理 (DSP) 的基石。它通过 $z$ 变换将离散序列映射到复平面上。与连续系统的 s 平面不同，离散系统的稳定性判据与**单位圆 (Unit Circle)** 紧密相关。

### 稳定性判据：单位圆结界
离散系统的稳定性完全取决于其传递函数 $H(z)$ 的极点在 z 平面上的位置：
- **极点在单位圆内 ($|z| < 1$):** 冲激响应 $h[n]$ 随时间衰减。系统**稳定**。
- **极点在单位圆上 ($|z| = 1$):** 对应等幅振荡（数字振荡器）。系统**临界稳定**。
- **极点在单位圆外 ($|z| > 1$):** 冲激响应 $h[n]$ 指数级增长。系统**不稳定**。

右侧的可视化动态展示了极点位置与离散时域序列 $h[n]$ 的联动。

<button class="not-prose interactive-btn bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 mb-4 transition-colors cursor-pointer" data-module="zDomain" data-params='{"poleRadius": 0.85, "poleAngle": 0.5}'>▶ 演示：稳定系统 (收敛 Stem 图)</button>
<br>
<button class="not-prose interactive-btn bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="zDomain" data-params='{"poleRadius": 1.0, "poleAngle": 0.3}'>▶ 演示：数字振荡器 (等幅序列)</button>
<br>
<button class="not-prose interactive-btn bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="zDomain" data-params='{"poleRadius": 1.1, "poleAngle": 0.4}'>▶ 演示：不稳定系统 (序列爆炸)</button>
`,
  'state-space': `# 状态空间分析：几何空间中的动力学

状态空间表示法是现代控制理论的核心。它不再关注输入与输出的单一映射，而是深入系统内部，观察多个内部**状态变量**如何随时间共同演化。

### 核心方程：线性动力系统
对于一个二阶系统，其演化规律由矩阵 $A$ 决定：
$$\\begin{bmatrix} x'_1 \\\\ x'_2 \\end{bmatrix} = A \\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix}$$

系统的命运完全由矩阵 $A$ 的**特征值**主宰：
- **特征值为负实部复数:** 轨迹呈螺旋线向原点坍缩（稳定）。
- **特征值为纯虚数:** 轨迹形成闭合椭圆（等幅振荡）。
- **特征值一正一负:** 轨迹呈现“鞍点”形状，从一个方向吸入，从另一个方向弹射（不稳定）。

右侧展示了**相平面 (Phase Portrait)** 与时域波形的实时联动。

<button class="not-prose interactive-btn bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 mb-4 transition-colors cursor-pointer" data-module="stateSpace" data-params='{"dynamicsType": "stable_focus"}'>▶ 演示：稳定焦点 (向内螺旋)</button>
<br>
<button class="not-prose interactive-btn bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="stateSpace" data-params='{"dynamicsType": "center"}'>▶ 演示：中心点 (闭合轨道)</button>
<br>
<button class="not-prose interactive-btn bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="stateSpace" data-params='{"dynamicsType": "saddle"}'>▶ 演示：鞍点 (双曲线发散)</button>
`,
};
export const chaptersContent: Record<string, string> = {
  'fourier': `# 傅里叶变换核心知识库

欢迎来到频域的世界。这里我们将通过交互式可视化，带你深刻理解《信号与系统》中最重要的核心概念。

---

## 模块一：傅里叶级数与吉布斯现象

法国数学家傅里叶提出：**任何满足狄里赫利条件的周期信号，都可以分解为一系列不同频率的正弦波（或复指数信号）的叠加。**
其指数形式的傅里叶级数公式为：
$$x(t) = \\sum_{n=-\\infty}^{\\infty} X_n e^{jn\\omega_0 t}$$

当我们尝试用有限次谐波去合成一个理想的方波时，随着保留的谐波次数 $N$ 的增加，合成波形会越来越接近真实的方波。但是，在方波的突变处，无论 $N$ 大小，总会存在一个约占总跳变幅度 **9% 的过冲（Overshoot）**。这就是著名的**吉布斯现象（Gibbs Phenomenon）**。

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

高频成分通常代表了信号格时域中的“细节”和“突变边缘”。因此，经过低通滤波后，原本拥有锐利边缘的方波会失去细节，变得圆滑（同时可能伴随振铃现象）。

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
  'vector-space': `# 信号与系统的矢量空间分析

信号处理不仅可以看作是时域的波形计算，还可以从**线性代数**的几何视角来审视。我们将信号 $x(t)$ 看作是无限维希尔伯特空间中的一个“矢量”。

### 信号的正交投影
就像在三维空间中将一个矢量投影到坐标轴上一样，我们可以将复杂信号投影到一组**正交基函数**（如正弦波组）上。
傅里叶级数的系数 $c_k$ 实际上就是原信号在第 $k$ 个正交基上的“投影长度”。

### Parseval 定理：能量守恒
Parseval 定理是矢量空间分析中最优美的结论之一：**信号的总能量等于其在所有正交基分量上的能量之和。**
$$\\int_{-\\infty}^{\\infty} x^2(t) dt = \\sum_{k=-\\infty}^{\\infty} |c_k|^2$$

右侧可视化展示了方波投影到前 $N$ 个正交基的过程，并实时计算能量守恒百分比。

<button class="not-prose interactive-btn bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 mb-4 transition-colors cursor-pointer" data-module="vectorSpace" data-params='{"projectionAxes": 3}'>▶ 演示：3 轴投影 (初步逼近)</button>
<br>
<button class="not-prose interactive-btn bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="vectorSpace" data-params='{"projectionAxes": 10}'>▶ 演示：10 轴投影 (高度逼近)</button>
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
  'state-space': `# 状态空间分析：几何视角下的系统动力学

状态空间分析是现代控制理论的核心。它不再仅仅关注单一的输入输出关系，而是将系统看作一个在多维空间中演化的状态向量 $x(t)$。

### 状态方程
对于一个线性二阶齐次系统，其演化遵循：
$$\\begin{bmatrix} x'_1 \\\\ x'_2 \\end{bmatrix} = A \\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix}$$

系统的命运（轨迹的几何形状）完全取决于矩阵 $A$ 的**特征值 (Eigenvalues)**。

### 特征值与相轨迹
- **稳定焦点 (Stable Focus):** 特征值为复数且实部为负。轨迹像漩涡一样**向内螺旋**，最终坍缩至原点。
- **中心点 (Center):** 特征值为纯虚数。轨迹形成完美的**闭合环路**，对应无损耗的简谐振荡。
- **鞍点 (Saddle):** 一个特征值为正，一个为负。轨迹在一个方向吸引，另一个方向排斥，形成**双曲线发散**。
- **不稳定节点 (Unstable Node):** 特征值均为正实数。轨迹从原点猛烈**向外抛射**。

右侧的可视化展示了相平面（左图）与状态变量时间序列（右图）的实时联动。

<button class="not-prose interactive-btn bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 mb-4 transition-colors cursor-pointer" data-module="stateSpace" data-params='{"dynamicsType": "stable_focus"}'>▶ 演示：稳定焦点 (螺旋坍缩)</button>
<br>
<button class="not-prose interactive-btn bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="stateSpace" data-params='{"dynamicsType": "center"}'>▶ 演示：中心点 (永恒简谐振荡)</button>
<br>
<button class="not-prose interactive-btn bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="stateSpace" data-params='{"dynamicsType": "saddle"}'>▶ 演示：鞍点 (双曲线发散)</button>
<br>
<button class="not-prose interactive-btn bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="stateSpace" data-params='{"dynamicsType": "unstable_node"}'>▶ 演示：不稳定节点 (猛烈爆炸)</button>
`,
  'feedback': `# 反馈系统与根轨迹分析

反馈是控制理论的灵魂。通过将输出信号引回输入端，我们可以改变系统的极点分布，从而让原本不稳定的系统变稳定，或让迟钝的系统变敏捷。

### 开环与闭环
假设开环传递函数为 $G(s)$，在负反馈增益 $K$ 的作用下，闭环传递函数变为：
$$T(s) = \\frac{K G(s)}{1 + K G(s)}$$

### 根轨迹 (Root Locus)
根轨迹是指当反馈增益 $K$ 从 $0 \\to \\infty$ 变化时，闭环极点在 s 平面上的移动轨迹。
通过观察根轨迹，我们可以：
- **判定稳定性：** 轨迹是否会进入右半平面？
- **优化性能：** 寻找能产生理想阻尼比的 $K$ 值。

右侧演示了一个双极点系统 $(s+2)(s+4)$ 的根轨迹演化。

<button class="not-prose interactive-btn bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 mb-4 transition-colors cursor-pointer" data-module="feedback" data-params='{"feedbackGain": 0.5}'>▶ 演示：小增益 (过阻尼)</button>
<br>
<button class="not-prose interactive-btn bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="feedback" data-params='{"feedbackGain": 1.0}'>▶ 演示：临界点 (K=1.0)</button>
<br>
<button class="not-prose interactive-btn bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="feedback" data-params='{"feedbackGain": 10.0}'>▶ 演示：大增益 (欠阻尼振荡)</button>
`,
  'filter-design': `# 系统逼近与滤波器设计

理想的“砖墙式”低通滤波器在物理上是因果不可实现的。工程上我们必须用有限阶数的系统去逼近它。

### 核心权衡：平坦度 vs 陡峭度
- **巴特沃斯 (Butterworth):** 极点分布在半圆上，主打通带“最大平坦”，牺牲了滚降速度。
- **切比雪夫 (Chebyshev):** 极点分布在椭圆上，允许通带内存在“涟波 (Ripple)”，换取了极陡峭的过渡带截断效果。

右侧可视化展示了极点排布与幅频响应的实时联动。您可以来回切换这两种滤波器，直观感受工程权衡的魅力。

<button class="not-prose interactive-btn bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 mb-4 transition-colors cursor-pointer" data-module="filterDesign" data-params='{"filterType": "butterworth", "filterOrder": 3}'>▶ 演示：巴特沃斯 (最大平坦)</button>
<br>
<button class="not-prose interactive-btn bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="filterDesign" data-params='{"filterType": "chebyshev", "filterOrder": 4}'>▶ 演示：切比雪夫 (陡峭滚降)</button>
`,
  'random-signals': `# 随机信号通过线性系统

现实世界充满了不可预测的噪声。理解随机信号通过线性系统后的统计特性演变，是通信与射频工程的基础。

### 白噪声与有色噪声
- **白噪声 (White Noise):** 功率谱密度（PSD）在全频段均匀分布，信号极度杂乱。
- **有色噪声 (Colored Noise):** 当白噪声通过一个具有特定带宽的低通滤波器时，高频分量被削弱，信号变得圆滑。

### 实时演示
右侧的实时射频示波器展示了这一“驯服”噪声的过程。下方的功率谱密度图直观地反映了系统对噪声能量分布的整形作用。

<button class="not-prose interactive-btn bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mt-2 mb-4 transition-colors cursor-pointer" data-module="randomSignals" data-params='{"noiseIntensity": 8, "systemBandwidth": 20}'>▶ 演示：全带宽白噪声</button>
<br>
<button class="not-prose interactive-btn bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="randomSignals" data-params='{"noiseIntensity": 6, "systemBandwidth": 2}'>▶ 演示：窄带平滑处理</button>
`,
};

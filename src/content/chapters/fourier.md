# 傅里叶变换核心知识库

欢迎来到频域的世界。这里我们将通过交互式可视化，带你深刻理解《信号与系统》中最重要的核心概念。

---

## 模块一：傅里叶级数与吉布斯现象

法国数学家傅里叶提出：**任何满足狄里赫利条件的周期信号，都可以分解为一系列不同频率的正弦波（或复指数信号）的叠加。**
其指数形式的傅里叶级数公式为：
$$x(t) = \sum_{n=-\infty}^{\infty} X_n e^{jn\omega_0 t}$$

当我们尝试用有限次谐波去合成一个理想的方波时，随着保留的谐波次数 $N$ 的增加，合成波形会越来越接近真实的方波。但是，在方波的突变处，无论 $N$ 多大，总会存在一个约占总跳变幅度 **9% 的过冲（Overshoot）**。这就是著名的**吉布斯现象（Gibbs Phenomenon）**。

<button class="not-prose interactive-btn bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 mb-4 transition-colors cursor-pointer" data-module="1" data-params='{"N": 3}'>▶ 演示：N=3 时的粗糙合成</button>
<br>
<button class="not-prose interactive-btn bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="1" data-params='{"N": 31}'>▶ 演示：N=31 见证吉布斯现象</button>

---

## 模块二：从离散到连续

自然界中大多数信号是非周期的。在理论推导上，我们将非周期信号视为**周期 $T \to \infty$** 的周期信号。

随着周期 $T$ 的不断增大，频域中原本离散的谐波谱线会变得越来越密集。当 $T \to \infty$ 时，相邻谱线无限靠近，最终融合为连续的频谱密度函数。这就是从傅里叶级数向**傅里叶变换**演变的本质：
$$X(j\omega) = \int_{-\infty}^{\infty} x(t)e^{-j\omega t} dt$$

<button class="not-prose interactive-btn bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 mb-4 transition-colors cursor-pointer" data-module="2" data-params='{"T": 3}'>▶ 演示：周期 T=3 (离散谱)</button>
<br>
<button class="not-prose interactive-btn bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="2" data-params='{"T": 15}'>▶ 演示：周期 T=15 (逼近连续)</button>

---

## 模块三：傅里叶变换的尺度变换

在信号处理领域，时域与频域之间存在着一个极具物理意义的“跷跷板效应”：**信号在时域中被压缩，其频谱在频域中必然被扩展；反之亦然。** 并且，随着时域的压缩，信号的能量在频域被分摊到了更宽的频带上，导致频谱幅度整体下降。
其数学表达为：
$$x(at) \leftrightarrow \frac{1}{|a|} X\left(j\frac{\omega}{a}\right)$$

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

为了能利用理想低通滤波器从抽样信号中无失真地恢复原连续信号，抽样频率必须大于等于信号最高频率 $f_m$ 的两倍，即 $f_s \ge 2f_m$。否则，搬移的频谱发生重叠，就会产生无法消除的**混叠失真 (Aliasing)**。

<button class="not-prose interactive-btn bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded mt-2 mb-4 transition-colors cursor-pointer" data-module="5" data-params='{"fs": 3.0}'>▶ 演示：过抽样 fs=3.0 (完美恢复)</button>
<br>
<button class="not-prose interactive-btn bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded mb-4 transition-colors cursor-pointer" data-module="5" data-params='{"fs": 1.5}'>▶ 演示：欠抽样 fs=1.5 (发生混叠)</button>
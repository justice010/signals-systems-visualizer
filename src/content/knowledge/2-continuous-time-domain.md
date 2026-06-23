---
title: 连续时间系统的时域分析
description:
---

## 建立系统数学模型，即微分方程

以元件约束特性和基尔霍夫定律为依据为系统简历微分方程，举例RLC并联电路：
激励信号为$i_{s}(t)$，支路电流分别为$i_{R}(t)、i_{C}(t)和i_{L}(t)$。
根据元件约束特性有：
$i_{R}(t)=\frac{1}{R}v(t)$
$i_{C}(t)=C\frac{\mathrm{d}}{\mathrm{d}t}v(t)$
$i_{L}(t)=\frac{1}{L}\int_{-\infty}^{t}v(t)$

根据基尔霍夫定律有：
$i_{s}(t) = i_{R}(t) + i_{C}(t) + i_{L}(t)$
即:
$i_{s}(t) = \frac{1}{R}v(t) + C\frac{\mathrm{d}}{\mathrm{d}t}v(t) + \frac{1}{L}\int_{-\infty}^{t}v(t)$
等式两边同时求导得：
$\frac{\mathrm{d}}{\mathrm{d}t}i_{s}(t) = \frac{1}{R}\frac{\mathrm{d}}{\mathrm{d}t}v(t) \frac{1}{L}v(t) + C\frac{\mathrm{d^2}}{\mathrm{d}t^2}v(t)$



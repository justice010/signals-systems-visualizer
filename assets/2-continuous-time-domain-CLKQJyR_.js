var e=`---\r
title: 连续时间系统的时域分析\r
description:\r
---\r
\r
## 建立系统数学模型，即微分方程\r
\r
以元件约束特性和基尔霍夫定律为依据为系统简历微分方程，举例RLC并联电路：\r
激励信号为$i_{s}(t)$，支路电流分别为$i_{R}(t)、i_{C}(t)和i_{L}(t)$。\r
根据元件约束特性有：\r
$i_{R}(t)=\\frac{1}{R}v(t)$\r
$i_{C}(t)=C\\frac{\\mathrm{d}}{\\mathrm{d}t}v(t)$\r
$i_{L}(t)=\\frac{1}{L}\\int_{-\\infty}^{t}v(t)$\r
\r
根据基尔霍夫定律有：\r
$i_{s}(t) = i_{R}(t) + i_{C}(t) + i_{L}(t)$\r
即:\r
$i_{s}(t) = \\frac{1}{R}v(t) + C\\frac{\\mathrm{d}}{\\mathrm{d}t}v(t) + \\frac{1}{L}\\int_{-\\infty}^{t}v(t)$\r
等式两边同时求导得：\r
$\\frac{\\mathrm{d}}{\\mathrm{d}t}i_{s}(t) = \\frac{1}{R}\\frac{\\mathrm{d}}{\\mathrm{d}t}v(t) \\frac{1}{L}v(t) + C\\frac{\\mathrm{d^2}}{\\mathrm{d}t^2}v(t)$\r
\r
\r
`;export{e as default};
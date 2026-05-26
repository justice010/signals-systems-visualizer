export type ModuleId = 1 | 2 | 3 | 4 | 5 | 'timeDomain';

export type SignalType = 'rect' | 'step' | 'sine' | 'tri';
export type SystemType = 'exp' | 'rect' | 'step';

export interface ModuleParams {
  mod1: { N: number };      // 谐波次数
  mod2: { T: number };      // 周期大小
  mod3: { a: number };      // 脉冲宽度尺度
  mod4: { Wc: number };     // 滤波器截止频率
  mod5: { fs: number };     // 抽样频率
  timeDomain: {
    signalType: SignalType;
    systemType: SystemType;
    t: number;              // 卷积时间进度
    autoPlay: boolean;      // 是否自动播放
  };
  sDomain: {
    sigma: number;          // 极点实部
    omega: number;          // 极点虚部
  };
  zDomain: {
    poleRadius: number;     // 极点半径 r
    poleAngle: number;      // 极点角度 theta (弧度)
  };
  stateSpace: {
    dynamicsType: 'stable_focus' | 'center' | 'saddle' | 'unstable_node';
  };
}

export interface AppState {
  activeModule: ModuleId;
  params: ModuleParams;
}

export type ModuleId = 
  | 1 | 2 | 3 | 4 | 5 
  | 'timeDomain' 
  | 'sDomain' 
  | 'zDomain' 
  | 'stateSpace' 
  | 'feedback' 
  | 'filterDesign' 
  | 'vectorSpace'
  | 'randomSignals';

export type SignalType = 'rect' | 'step' | 'sine' | 'tri';
export type SystemType = 'exp' | 'rect' | 'step';
export type FilterType = 'butterworth' | 'chebyshev';

export interface ModuleParams {
  mod1: { N: number };
  mod2: { T: number };
  mod3: { a: number };
  mod4: { Wc: number };
  mod5: { fs: number };
  timeDomain: {
    signalType: SignalType;
    systemType: SystemType;
    t: number;
    autoPlay: boolean;
  };
  sDomain: {
    sigma: number;
    omega: number;
  };
  zDomain: {
    poleRadius: number;
    poleAngle: number;
  };
  stateSpace: {
    dynamicsType: 'stable_focus' | 'center' | 'saddle' | 'unstable_node';
  };
  feedback: {
    feedbackGain: number;
    systemType: 'two-pole';
  };
  filterDesign: {
    filterType: FilterType;
    filterOrder: number;
  };
  vectorSpace: {
    projectionAxes: number;
  };
  randomSignals: {
    noiseIntensity: number;
    systemBandwidth: number;
  };
}

export interface AppState {
  activeModule: ModuleId;
  params: ModuleParams;
}

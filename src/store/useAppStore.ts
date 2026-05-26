import { create } from 'zustand';
import type { ModuleId, ModuleParams } from '../types';

interface AppState {
  activeModule: ModuleId;
  params: ModuleParams;
  // Actions
  setActiveModule: (id: ModuleId) => void;
  updateParam: (moduleId: ModuleId, paramName: string, value: number) => void;
  syncParams: (moduleId: ModuleId, newParams: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeModule: 1,
  params: {
    mod1: { N: 3 },
    mod2: { T: 3 },
    mod3: { a: 0.5 },
    mod4: { Wc: 15 },
    mod5: { fs: 3.0 },
    timeDomain: {
      signalType: 'rect',
      systemType: 'exp',
      t: -2.0,
      autoPlay: true
    },
    sDomain: {
      sigma: -1.0,
      omega: 5.0
    },
    zDomain: {
      poleRadius: 0.8,
      poleAngle: 0.5
    },
    stateSpace: {
      dynamicsType: 'stable_focus'
    }
  },
  setActiveModule: (id) => set({ activeModule: id }),
  updateParam: (moduleId, paramName, value) => set((state) => {
    // Handle both indexed modules (1-5) and named modules like 'timeDomain'
    const moduleKey = typeof moduleId === 'number' ? `mod${moduleId}` : moduleId;
    return {
      params: {
        ...state.params,
        [moduleKey]: {
          ...(state.params as any)[moduleKey],
          [paramName]: value
        }
      }
    };
  }),
  syncParams: (moduleId, newParams) => set((state) => {
    const moduleKey = typeof moduleId === 'number' ? `mod${moduleId}` : moduleId;
    return {
      activeModule: typeof moduleId === 'number' ? moduleId : state.activeModule,
      params: {
        ...state.params,
        [moduleKey]: {
          ...(state.params as any)[moduleKey],
          ...newParams
        }
      }
    };
  }),
}));
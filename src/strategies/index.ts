import type { ModuleId, ModuleParams } from '../types';
import { FourierStrategy } from './fourier';
import { TimeDomainStrategy } from './time-domain';
import { SDomainStrategy } from './s-domain';
import { ZDomainStrategy } from './z-domain';
import { StateSpaceStrategy } from './state-space';

export interface CanvasStrategy {
  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    activeModule: ModuleId,
    params: ModuleParams
  ): void;
}

export const getStrategy = (chapterId: string | undefined): CanvasStrategy | null => {
  switch (chapterId) {
    case 'fourier':
      return new FourierStrategy();
    case 'time-domain':
      return new TimeDomainStrategy();
    case 's-domain':
      return new SDomainStrategy();
    case 'z-domain':
      return new ZDomainStrategy();
    case 'state-space':
      return new StateSpaceStrategy();
    default:
      return null;
  }
};

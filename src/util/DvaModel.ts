import { ReducersMapObject, AnyAction } from 'redux';
import { EffectsCommandMap, Model } from 'dva';

export interface ActionWithPayload<T = any> extends AnyAction {
  payload: T;
}

interface EffectsMapObject {
  [key: string]: Effect | EffectWithType;
}

type Effect = (action: ActionWithPayload, effects: EffectsCommandMap) => void;
type EffectType = 'takeEvery' | 'takeLatest' | 'watcher' | 'throttle';
type EffectWithType = [Effect, { type: EffectType }];

// interface TypedEffectsCommandMap extends EffectsCommandMap {
//   call: <T, Arg>(fn: (arg: Arg) => Promise<T>, arg: Arg) => Generator<unknown, T>;
// }

export interface DvaModel<T> extends Omit<Model, 'reducers' | 'state' | 'effects'> {
  state: T;
  effects?: EffectsMapObject;
  // reducers: ReducersMapObject<{ [S in keyof any]: T }, ActionWithPayload>;
}

import { clamp } from "../../game-engine/physics";

export interface DapNieuState {
  power: number;
  combo: number;
  reward: number;
}

export const createDapNieuState = (): DapNieuState => ({
  power: 0,
  combo: 0,
  reward: 0,
});

export const updatePower = (state: DapNieuState, delta: number): DapNieuState => {
  const nextPower = clamp(state.power + delta, 0, 100);
  return {
    ...state,
    power: nextPower,
  };
};

export const resolveHit = (state: DapNieuState, hitZone: "gold" | "miss"): DapNieuState => {
  if (hitZone === "gold") {
    const nextCombo = state.combo + 1;
    return {
      ...state,
      combo: nextCombo,
      reward: state.reward + 100 * nextCombo,
    };
  }

  return {
    ...state,
    combo: 0,
  };
};

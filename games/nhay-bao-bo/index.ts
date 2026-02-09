export interface NhayBaoBoState {
  stamina: number;
  distance: number;
  isStumbling: boolean;
}

export const createNhayBaoBoState = (): NhayBaoBoState => ({
  stamina: 100,
  distance: 0,
  isStumbling: false,
});

export const spamJump = (state: NhayBaoBoState): NhayBaoBoState => {
  const nextStamina = Math.max(0, state.stamina - 5);
  const stumble = nextStamina === 0;

  return {
    ...state,
    stamina: nextStamina,
    distance: state.distance + (stumble ? 1 : 3),
    isStumbling: stumble,
  };
};

export const recoverStamina = (state: NhayBaoBoState, delta: number): NhayBaoBoState => ({
  ...state,
  stamina: Math.min(100, state.stamina + delta),
  isStumbling: false,
});

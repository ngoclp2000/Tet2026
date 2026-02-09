export interface BatDeState {
  lanternCharge: number;
  caught: boolean;
  hint: string;
}

export const createBatDeState = (): BatDeState => ({
  lanternCharge: 100,
  caught: false,
  hint: "listen",
});

export const drainLantern = (state: BatDeState, amount: number): BatDeState => ({
  ...state,
  lanternCharge: Math.max(0, state.lanternCharge - amount),
  hint: state.lanternCharge - amount <= 0 ? "dark" : state.hint,
});

export const registerCatch = (state: BatDeState): BatDeState => ({
  ...state,
  caught: true,
  hint: "caught",
});

export type RewardItem = "coin" | "fireworks" | "ao-dai" | "li-xi-vang";

export interface InventoryItem {
  type: RewardItem;
  quantity: number;
}

export interface InventoryStore {
  items: Record<RewardItem, InventoryItem>;
  addItem: (type: RewardItem, amount: number) => void;
  hasItem: (type: RewardItem, amount: number) => boolean;
}

export const createInventoryStore = (): InventoryStore => {
  const items: Record<RewardItem, InventoryItem> = {
    coin: { type: "coin", quantity: 0 },
    fireworks: { type: "fireworks", quantity: 0 },
    "ao-dai": { type: "ao-dai", quantity: 0 },
    "li-xi-vang": { type: "li-xi-vang", quantity: 0 },
  };

  const addItem = (type: RewardItem, amount: number) => {
    items[type].quantity += amount;
  };

  const hasItem = (type: RewardItem, amount: number) => items[type].quantity >= amount;

  return {
    items,
    addItem,
    hasItem,
  };
};

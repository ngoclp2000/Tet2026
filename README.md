# Tet2026

"Hội Làng Tết Online" là khung ý tưởng cho trải nghiệm lễ hội đầu năm với 3 mini-game, hệ thống lì xì, và vòng lặp viral.

## Cấu trúc thư mục đề xuất

```
/game-engine
  useGameLoop.ts
  physics.ts

/games
  dap-nieu
    index.ts
  nhay-bao-bo
    index.ts
  bat-de
    index.ts

/network
  socket.ts

/stores
  playerStore.ts
  inventoryStore.ts
```

## Mục tiêu gameplay

- **Đập niêu**: nhịp lực + combo để tăng lì xì.
- **Nhảy bao bố**: spam space để tạo clip share.
- **Bịt mắt bắt dê**: meme + âm thanh hướng.

## Lì xì & vòng lặp giữ chân

- Lì xì là tiến độ (coin, pháo hoa, áo dài, lì xì vàng).
- Daily login + thiếu coin để kích thích quay lại.
- Viral loop: mỗi người có "Nhà Tết" riêng, bạn bè chơi giúp nhận thưởng.

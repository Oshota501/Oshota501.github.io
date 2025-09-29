# SlotGame
## 進捗
- [x] slotに表示するオブジェクトの静的データ
- [x] slotの枠組み
- [ ] coin object
    - [ ] slotにコインを入れるエフェクト
    - [ ] ドラックアンドドロップ
- [x] slotの回転アニメーション
    - [x] newSlotジェネレーター
    - [x] slotScreen.speed を0より上 にすると回転開始 0 で静止
    - [x] newSlotからview変数に追加し最下層にあるデータを消す
    - [x] アニメーション関数でview変数の描画
- [x] stop start 関数
---
- [ ] ゲーム性の追加
    - [ ] ベット要素
    - [x] stop要素
```js
slot.screen.screen.forEach(elm=>{elm.start()})
setTimeout(function(){slot.screen.screen.forEach((elm,index)=>{setTimeout(()=>{elm.stop()},200*index)})},2000);
```
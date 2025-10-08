セットアップ手順

1. 依存関係をインストール

```bash
npm install
```

2. TypeScript を手動でコンパイルしてブラウザ向け ES モジュールを生成

```bash
npm run build
```

3. ブラウザで `index.html` を開く。出力はプロジェクトルートに `index.js` として生成され、既存の `index.html` が読み込みます。

注意点
- このプロジェクトは TypeScript を手動でコンパイルします（自動バンドラは使いません）。
- Three.js は npm のパッケージを使います。ブラウザで直接 CDN を使う場合は `index.html` の importmap を編集してください。

ブラウザでの確認

1. ローカルで静的サーバを立てる（例: macOS の場合）

```bash
# Python 3 の簡易サーバ
python3 -m http.server 8000

# その後ブラウザで http://localhost:8000 を開く
```

2. importmap による Three.js 読み込みについて

現在 `index.html` には importmap で CDN の three.module.js を指定していますが、TypeScript のビルドでは `import * as THREE from "three";` を使っており、生成された `dist/index.js` は `three` を外部モジュールとしてインポートします。CDN を使う場合は importmap を指すようにするか、ビルドでバンドルする方法（例: Vite, webpack）への移行を検討してください。

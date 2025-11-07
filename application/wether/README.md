## 前提
実行環境...
- macOS m4
    - Terminal
- Google Chrome
- VS code
    - Live server
## お天気APIについて
さて、今週のお題はお天気WebAPI
-> google検索
-> 気象庁公式WebAPIなるものが存在するのか！！！
[参考文献](https://anko.education/webapi/jma)...なるほど
## 早速使ってみる。
とりあえずjsonファイルの解析のために以下のコマンドを実行します。
```sh
curl https://www.jma.go.jp/bosai/forecast/data/overview_forecast/260000.json > overview_forecast.json
curl https://www.jma.go.jp/bosai/forecast/data/forecast/260000.json > forecast.json
```
見やすいように改行とインデントを追加します。（非常に億劫なのでAIに任せましょう）
Webサイトのコンソールに表示してみる。
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>お天気API</title>
        <link href="./style.css" rel="stylesheet" />
    </head>
    <body>
        <div>
            <h1>くそお天気サイト</h1>
        </div>
        <script src="./index.js"></script>
        <script>
            getWetherNow() ;
        </script>
    </body>
</html>
```
```js
const getWetherNow = ()=>{
    try{
        fetch("https://www.jma.go.jp/bosai/forecast/data/overview_forecast/260000.json").then(function(response) {
            return response.json();
        })
        .then(function(weather) {
            console.log(weather.text);
        });
    }catch(e){
        throw e;
    }
}
```
いいですね。表示されました。他も同じように表示できます。
## AIにまとめさせた。
### overview_forecast/260000.json
- `reportDatetime`: に時刻が表示されます。
- `text`: に現在の天気の詳細が文章で記載されているようです。
### forecast/260000.json
- 配列で複数の発表（publishingOffice, reportDatetime）を含む場合がある。
- 主なキー
  - `timeSeries`: 時系列データの配列。各要素は timeDefines（日時配列）と areas（地域ごとのデータ）を持つ。
    - `timeDefines`: データが対応する日時の配列（ISO 8601）。
    - `areas`: 地域ごとの配列。各地域オブジェクトは以下のようなフィールドを含むことが多い。
      - `area`: { name, code }（地域名とコード）
      - `weatherCodes`: 天気を表すコードの配列（timeDefines と対応）
      - `weathers`: 人間向けの天気文（timeDefines と対応）
      - `winds`: 風の説明（存在する場合）
      - `waves`: 海況（海域データがある場合）
      - `pops`: 降水確率（％、timeDefines と対応）
      - `temps` / `tempsMin` / `tempsMax`: 気温（短時間・日別で別キーになることがある）
      - `tempsMinUpper`/`Lower`, `tempsMaxUpper`/`Lower`: 予報の上限・下限（存在する場合）
      - `reliabilities`: 予報の信頼度（A/B/C 等、存在する場合）
- その他のセクション
  - `tempAverage`: 平均気温の目安（地域ごと）
  - `precipAverage`: 平均降水量の目安（地域ごと）
- 実用メモ
  - `timeDefines` の長さと areas 内の各配列の長さは一致するはず（対応関係に注意）。
  - 空文字列が混じることがある（データ未設定や該当なし）。
  - `weatherCodes` を参照してアイコン表示や条件分岐を実装すると便利。

## 完成品
https://Oshota501.github.io/application/wether
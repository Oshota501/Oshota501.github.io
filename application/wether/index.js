/**
 * @returns weather | null
 */
const getWether = async (url)=>{
    let weather ;
    try{
        await fetch(url).then(function(response) {
            return response.json();
        })
        .then(function(response_weather) {
            weather = response_weather ;
        });
        return weather ;
    }catch(e){
        throw e;
    }
}
/**
 * - forecast[i].timeSeries.Areas を処理するためのコンポーネント
 * @param {forecast} data 
 * @returns string
 */
function formatAreas (data,timeDefines) {
    let result = "" ;
    const weatherColor = function(weatherstring){
        return weatherstring
        .replace("晴れ","<span class='clear'>晴れ</span>")
        .replace("くもり","<span class='cloud'>くもり</span>")
        .replace("雨","<span class='rain'>雨</span>")
    }
    for(let i = 0 ; i < data.length ; i ++){
        const area = data[i] ;
        result += `<h3>${area.area.name}</h3>` ;
        for(let j = 0 ; j < timeDefines.length ; j++){
            result += `
                <p>${timeDefines[j].slice(8,10)}日 : ${weatherColor(area.weathers[i])}<br>
                ${area.winds[i]}</p>
            ` ;
        }
    }
    return result ;
}
(async function(){
    const overviewForecast = await getWether("https://www.jma.go.jp/bosai/forecast/data/overview_forecast/260000.json");
    const forecast = await getWether("https://www.jma.go.jp/bosai/forecast/data/forecast/260000.json");
    const id = document.getElementById("main");
    const AreasWether = formatAreas(
        forecast[0].timeSeries[0].areas,
        forecast[0].timeSeries[0].timeDefines)
    if(id){
        id.innerHTML = `
            <h2>京都府の天気の概要</h2>
            <div class="time">${overviewForecast.reportDatetime}</div><br>
            ${overviewForecast.text}
            <hr>
            <h2>府内の天気の概要</h2>
            <div>
                ${AreasWether}
            </div>
        `
    }else{
        console.error("HTML要素を取得できませんでした。")
    }
    
})()

/*
*　背景
*/
// Stageオブジェクトを作成します。表示リストのルートになります。
stage = new createjs.Stage("myCanvas");

// パーティクルシステム作成します。
particleSystem = new particlejs.ParticleSystem();

// パーティクルシステムの描画コンテナーを表示リストに登録します。
stage.addChild(particleSystem.container);

// Particle Developから保存したパラメーターを反映します。
particleSystem.importFromJson(
// JSONテキストのコピー＆ペースト ここから-- 
{
    "bgColor": "#00000",
    "width": 733,
    "height": 446,
    "emitFrequency": 300,
    "startX": 367,
    "startXVariance": "668",
    "startY": 223,
    "startYVariance": "378",
    "initialDirection": "192.5",
    "initialDirectionVariance": "148.5",
    "initialSpeed": 14.2,
    "initialSpeedVariance": "0",
    "friction": "0.0035",
    "accelerationSpeed": "0.0695",
    "accelerationDirection": "87.7",
    "startScale": 0.36,
    "startScaleVariance": "0.63",
    "finishScale": "0",
    "finishScaleVariance": 0.29,
    "lifeSpan": "136",
    "lifeSpanVariance": "500",
    "startAlpha": "0.51",
    "startAlphaVariance": "1",
    "finishAlpha": "0",
    "finishAlphaVariance": "0",
    "shapeIdList": [
        "blur_circle"
    ],
    "startColor": {
        "hue": 57,
        "hueVariance": 76,
        "saturation": "0",
        "saturationVariance": 0,
        "luminance": "100",
        "luminanceVariance": "47"
    },
    "blendMode": true,
    "alphaCurveType": "0",
    "VERSION": "1.0.0"
}
// JSONテキストのコピー＆ペースト ここまで--
);
// フレームレートの設定
createjs.Ticker.framerate = 60;
function handleTick() {
  // パーティクルの発生・更新
  particleSystem.update();

  // 描画を更新する
  stage.update();
}
// 定期的に呼ばれる関数を登録
createjs.Ticker.on("tick", handleTick);

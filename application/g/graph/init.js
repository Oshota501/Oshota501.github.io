class GraphFunc {
    f ;
    color = "#000000" ;
    afterPos = [0,0] ;
    constructor(func,graphCtx){
        this.f = func ;
        this.afterPos = [
            graphCtx.x.min ,
            func(graphCtx.x.min)
        ]
    }
}
class GraphCtx {
    width = 1000 ;
    x = {
        max : 6 ,
        min : -6
    }
    height = 800 ;
    y = {
        max : 1.2 ,
        min : -1.2
    } 
    X_to_Width (x) {
        // 座標系 x.min -> 0, x.max -> this.width に線形写像
        const span = this.x.max - this.x.min;
        if (span === 0) return 0;
        const scaleX = this.width / span;
        return (x - this.x.min) * scaleX;
    }
    Y_to_Height (y) {
        // キャンバスはYが下向きなので y.max -> 0, y.min -> this.height にマッピング
        const span = this.y.max - this.y.min;
        if (span === 0) return 0;
        const scaleY = this.height / span;
        return (this.y.max - y) * scaleY;
    }
    Width_to_X (width) {
        // 逆変換: 0 -> x.min, this.width -> x.max
        const span = this.x.max - this.x.min;
        if (this.width === 0) return this.x.min;
        const scaleX = this.width / span;
        return (width / scaleX) + this.x.min;
    }
    Height_to_Y (height) {
        // 逆変換: 0 -> y.max, this.height -> y.min
        const span = this.y.max - this.y.min;
        if (this.height === 0) return this.y.max;
        const scaleY = this.height / span;
        return this.y.max - (height / scaleY);
    }
   
    elm = null;
    ctx = null;
    constructor(){
        // canvas要素が存在することを確認してからコンテキストを取得し、サイズを合わせる
        this.elm = document.getElementById("graph");
        if(!this.elm){
            console.error("canvas#graph が見つかりません");
            return;
        }
        // canvas の表示サイズと内部ピクセルサイズを合わせる
        this.elm.width = this.width;
        this.elm.height = this.height;
        this.ctx = this.elm.getContext("2d");
        // 初期描画
        this.draw();
    }
    funcsX = [
    ] ;

    setGraphViewX(func){
        if(typeof func != "function"){
            return
        }
        // GraphFunc オブジェクトとして追加
        this.funcsX.push(new GraphFunc(func, this));
        this.clear();
        this.draw();
    }
    clear(){
        if(!this.ctx) return;
        this.ctx.beginPath();
        // 背景を黒で塗る（必要なければ clearRect に変更）
        this.ctx.clearRect(0,0,this.width,this.height);
        this.ctx.fillStyle = "#ffffffff";
        this.ctx.fillRect(0,0,this.width,this.height);
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#ff9999ff"
        this.ctx.moveTo(
            this.X_to_Width(this.x.min) ,
            this.Y_to_Height(0) 
        );
        this.ctx.lineTo(
            this.X_to_Width(this.x.max) ,
            this.Y_to_Height(0) 
        );
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#99ffffff"
        this.ctx.moveTo(
            this.X_to_Width(0) ,
            this.Y_to_Height(this.y.min) 
        );
        this.ctx.lineTo(
            this.X_to_Width(0) ,
            this.Y_to_Height(this.y.max) 
        );
        this.ctx.stroke();
    }
    draw(add=0){
        this.clear();
        if(!this.ctx) return;
        for(let i = 0 ; i < this.funcsX.length ; i ++){
            const gf = this.funcsX[i];
            this.ctx.beginPath();
            this.ctx.strokeStyle = gf.color || "#000000ff";
            this.ctx.lineWidth = 1;
            // 最初の点
            const startX = this.X_to_Width(this.x.min);
            const startY = this.Y_to_Height(gf.f(this.x.min,add));
            this.ctx.moveTo(startX, startY);
            // pixel 単位で描画
            for(let cx = 1 ; cx <= this.width ; cx ++){
                const x = this.Width_to_X(cx) ;
                const y = gf.f(x,add) ;
                this.ctx.lineTo(cx, this.Y_to_Height(y));
            }
            this.ctx.stroke();
        }
    }
}

const graph = new GraphCtx();

graph.setGraphViewX(function(x,i=0){
    return Math.sin(x-i*Math.PI/180);
})
graph.setGraphViewX(function(x,i=0){
    return Math.abs(Math.cos(x+i*Math.PI/180));
})

let counter = 0 ;
setInterval(function(){
    graph.draw(counter);
    counter ++ ;
},50)


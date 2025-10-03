class Coin_In extends PIXI.Graphics {
    judgeCollision = (value,x,y) =>{
        const cx = x 
        const cy = y 
        if(
            this.x <= cx && this.y <= cy &&
            this.width+this.x >= cx && this.height+this.y >= cy    
        ){
            slot.betCoin += value
            return true
        }
        return false
    }
    width = 255
    height = 50
    constructor(){
        super();
        
        // 黒色の長方形を描画（コイン投入口として）
        this.beginFill(0x000000);
        this.drawRect(0, 0,this.width, this.height);
        this.endFill();
        
        // 座標を設定
        this.x = 575;
        this.y = 760;
    }
}
//=====================================================================
// コイン
//=====================================================================
class SlotCoin extends GravityObject {
    coin
    size 
    setGraphics = (howmach) => {
        const getImg = function (m){
            return `../img/${m}.png` ;
        }
        this.texture = PIXI.Texture.from(getImg(howmach));
        this.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    }
    onPointerUp () {
        super.onPointerUp()
        if(slot.coin_in.judgeCollision(
            this.coin,
            this.x,
            this.y
        )){
            this.destroy();
        }
    }
    constructor(size,x,y){
        super(x,y)
        this.coin = size
        this.setGraphics(size)
        switch (size){
        case 1 :
            this.scale.set(4, 4);
            this.size = 4 * 16 ;
            break ;
        case 5 :
            this.scale.set(5, 5);
            this.size = 5 * 16 ;
            break ;
        case 10 :
            this.scale.set(6, 6);
            this.size = 6 * 16 ;
            break ;
        }
    }
}

//=====================================================================
// コイン
//=====================================================================
class SlotCoin extends PIXI.Sprite {
    coin
    size 
    setGraphics = (howmach) => {
        const getImg = function (m){
            return `../img/${m}.png` ;
        }
        this.texture = PIXI.Texture.from(getImg(howmach));
        this.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    }
    onPointerDown = () => {
        this.on('pointermove', this.move);
    }

    onPointerUp = () => {
        this.off('pointermove', this.move);
        this.isFall = true
    }
    move = (e) => {
        let position = e.data.getLocalPosition(slot.app.stage);
        this.x = position.x;
        this.y = position.y;
    }
    destroy() {
        // ティッカーから自身のfreem関数を削除
        slot.app.ticker.remove(this.freem);
        // 親クラスのdestroyを呼び出し
        super.destroy();
    }
    isFall = true
    velocityY = 0
    freem = () => {
        if (this.isFall) {
            // 1. 経過時間を秒単位で取得
            const deltaTime = slot.app.ticker.deltaMS / 1000;
            // 2. 重力加速度 (ピクセル/秒^2)
            const GRAVITY = 980.665;

            // 3. 速度を更新
            this.velocityY += GRAVITY * deltaTime;
            // 4. 位置を更新
            this.y += this.velocityY * deltaTime;
            // 地面に到達したか判定
            if (this.y >= slot.height-this.size/2) {
                this.y = slot.height-this.size/2; // 地面にめり込まないように調整
                this.isFall = false;   // 落下を停止
                this.velocityY = 0 
            }
        }
    }
    constructor(size,x,y){
        super()
        slot.app.ticker.add(this.freem);
        this.x = x ;
        this.y = y
        this.coin = size ;
        this.setGraphics(size);
        this.interactive = true;
        this.buttonMode = true;
        this.anchor.set(0.5, 0.5)
        // 押し下げ、離す、外側で離す、の3つのイベントを監視
        this.on('pointerdown', this.onPointerDown)
            .on('pointerup', this.onPointerUp)
            .on('pointerupoutside', this.onPointerUp); // これを追加

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

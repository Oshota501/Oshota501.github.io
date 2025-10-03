// 重力つきのpixi.sprite
class GravityObject extends PIXI.Sprite {
    size 
    onPointerDown () {
        this.on('pointermove', this.move);
        this.isFall = false ;
        this.velocityY = 0
    }

    onPointerUp () {
        this.off('pointermove', this.move);
        this.isFall = true
    }
    destroy() {
        // 自分自身を削除する
        // 1. 親コンテナ（coinBox）から削除
        if(this.parent){
            this.parent.removeChild(this);
        }
        // 2. ティッカーから削除
        slot.app.ticker.remove(this.freem);
        // 3. イベントリスナーを全て削除
        this.removeAllListeners();
        // 4. PIXIオブジェクトを破棄（メモリ解放）
        super.destroy();
    }
    move = (e) => {
        let position = e.data.getLocalPosition(slot.app.stage);
        this.x = position.x;
        this.y = position.y;
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
    constructor(x,y){
        super()
        slot.app.ticker.add(this.freem);
        this.x = x
        this.y = y
        this.interactive = true;
        this.buttonMode = true;
        this.anchor.set(0.5, 0.5)
        // 押し下げ、離す、外側で離す、の3つのイベントを監視
        this.on('pointerdown', this.onPointerDown)
            .on('pointerup', this.onPointerUp)
            .on('pointerupoutside', this.onPointerUp); // これを追加

    }
}

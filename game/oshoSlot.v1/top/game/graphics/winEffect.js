class WinEffect extends PIXI.Graphics {
    cellWidth
    cellHeight
    createEffect(poss){
        poss.forEach((elm,i)=>{
            setTimeout(()=>{
                this.effect(elm)
            },1500*i)
        })
    }
    effect(pos) {
        for(let i = 0 ; i < 5 ; i ++ )setTimeout(()=>{
            pos.forEach(p => {
                const dx = p.x * this.cellWidth;
                const dy = (2-p.y) * this.cellHeight;
                this.draw_win(dx,dy)
            });
        },300*i)
        for(let i = 0 ; i < 5 ; i ++ )setTimeout(()=>{
            this.clear();
        },300*i+150)
        
    }
    draw_win (dx,dy) {
        this.lineStyle(4, 0xFFD700); // 線の太さ4、色は金色
        this.drawRect(dx, dy, this.cellWidth, this.cellHeight);
    }
    
    constructor(w,h) {
        super();

        // スロット画面のセルサイズに基づいて位置を計算
        this.cellWidth = w / 5; // 5列
        this.cellHeight = h / 3; // 3行

        // 初期位置を設定
        this.x = 0;
        this.y = 0;
    }
}
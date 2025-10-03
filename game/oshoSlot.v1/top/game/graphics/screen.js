//=====================================================================
// 描画
//=====================================================================
class SlotGameScreen extends PIXI.Container{
    screen = [];
    width = 168 ;
    setWidth = function(w){
        this.width = Math.floor(w) ;
    }
    height = 450 ;
    setHeight = function(h){
        this.width = Math.floor(h) ;
    }
    constructor(app,objs){
        super()
        for(let i = 0 ; i < 5 ; i ++){
            const slotScreen = new SlotScreen(
                this.width ,
                this.height ,
                i,
                app,
                objs,
                this
            )   
            this.screen.push(slotScreen);

            this.addChild(slotScreen); // 2. 生成したスロットをコンテナに追加

            
            
        }
    }
}
class SlotScreen extends PIXI.Graphics {
    parent
    app
    size = {
        per : {
            width : 0.0 ,
            height : 0.0
        } ,
        nol : {
            width : 0.0 ,
            height : 0.0
        }
    }
    game = {
        // obj : [{
        //     name : "apple" ,
        //     id : 0 ,
        //     weight_b : 0 , // 確率の重み
        //     weight_t : 10 ,
        //     texture : PIXI.Texture.from("../img/apple.png"),
        //     score : function(bet){
        //         return bet * 2
        //     tag : ["fruits"] ,
        //     } , 
        // },{
        //     name : "bell" ,
        //     id : 1 ,
        //     weight_b : 10 , // 確率の重み
        //     weight_t : 15 ,
        //     texture : PIXI.Texture.from("../img/bell.png"),
        //     score : function(bet){
        //         return bet * 3
        //     } , 
        //     tag : [] ,
        // }],
        obj : [] ,
        sum_weight : 15
    }
    zero_fortune = []
    fortune = []
    /*
    {
        add : 2 ,
        name : "apple" ,
        fixed : false ,
        turn : 2 ,
    }
    */
   // スタート時に読み込まれて、turnが0以下のものは除外されます。
    fortune_opt = []
    setGameObj = function(objs){
        this.game.obj = []
        this.game.sum_weight = 0
        this.zero_fortune = []
        objs.forEach(elm => {
            this.game.obj.push ({
                name : elm.name ,
                id : elm.id ,
                weight_b : this.game.sum_weight ,
                weight_t : this.game.sum_weight + elm.weight ,
                texture : elm.texture ,
                score : elm.score ,
                tag : elm.tag
            })
            this.zero_fortune.push(elm.weight)
            this.game.sum_weight += elm.weight
        });
        this.fortune = this.zero_fortune.concat()
    }
    setFortuneOption(name,turn,fixid,add){
        for(let i = 0 ; i < this.game.obj.length ; i ++){
            if(this.game.obj[i].name == name){
                this.fortune_opt.push({
                    name : name ,
                    turn : turn ,
                    fixid : fixid ,
                    add : add ,
                })
            }
        }
    }
    fortuneOptionApplicable () {
        const addFortune = (name,add,fixed)=>{
            for(let i = 0 ; i < this.game.obj.length ; i ++){
                if(this.game.obj[i].name == name){
                    if(this.fortune[i]+add >= 0){
                        if(fixed){
                            this.fortune[i] = add ;
                        }else{
                            this.fortune[i] += add ;
                        }
                        
                    }else{
                        this.fortune[i] = 0 ;
                    }
                }
            }
        }
        this.fortune = this.zero_fortune.concat() ;
        let rv = [] ;
        for(let i = 0 ; i < this.fortune_opt.length ; i ++){
            const elm = this.fortune_opt[i] ;
            if(elm.turn > 0){
                elm.turn -- ;
                addFortune(elm.name,elm.add,elm.fixed)
            }else{
                rv.push (i)
            }
        }
        for(let i = 0 ; i < rv.length ; i ++){
            this.fortune_opt.splice(rv[0],1)
        }
        
    }
    
    changeObjsProbability = ( value ) => {
        let arr = [] ;
        if(typeof value == "object"){
            arr = value ;
        }else{
            return
        }
        let counter = 0 ;
        for(let i = 0 ; i < this.game.obj.length ; i++){
            const elm = this.game.obj[i] ;
            elm.weight_b = counter ;
            counter += arr[i] ;
            elm.weight_t = counter ;
        }
        this.game.sum_weight = counter ;
    }
    getGameObj = ()=>{
        this.changeObjsProbability(this.fortune) ;
        const rand = Math.floor(Math.random()*this.game.sum_weight)
        for (let i = 0 ; i < this.game.obj.length ; i ++){
            const elm = this.game.obj[i]
            if(elm.weight_b <= rand && elm.weight_t > rand ){
                return  {
                    name : elm.name ,
                    id : elm.id ,
                    texture : elm.texture ,
                    score : elm.score ,
                    tag : elm.tag
                }
            }   
        }
        console.error("SlotScreen.getGameObj : not found ")
        return
    }
    // 長さ 5 の配列 setingViewObj を参照
    view_obj = []
    setingViewObj = function(){
        for(let i = 0 ; i < 5; i ++){
            const elm = this.getGameObj();
            const sprite = new PIXI.Sprite(elm.texture) ;
            sprite.x = 0
            sprite.y = this.size.per.height *32*(4-i) - this.size.per.height *31
            elm.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            sprite.scale.set(6, 6)
            this.addChild ( sprite )
            this.view_obj.push ({
                data : {
                    name : elm.name ,
                    id : elm.id ,
                } ,
                sprite : sprite ,
                tag : elm.tag
            })
        }
    }
    setNextViewObj = function() {
        // Remove the top sprite
        const removedObj = this.view_obj.shift();
        if (removedObj && removedObj.sprite) {
            removedObj.sprite.destroy();
        }

        // Create a new sprite to add to the bottom
        const elm = this.getGameObj();
        const newSprite = new PIXI.Sprite(elm.texture);
        newSprite.x = 0;
        // y will be set in the loop below
        elm.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        newSprite.scale.set(6, 6);
        this.addChild(newSprite);

        // Add the new sprite to the array
        this.view_obj.push({
            data: {
                name: elm.name,
                id: elm.id,
            },
            sprite: newSprite ,
            tag : elm.tag
        });

        // Reposition all sprites in the reel
        for (let i = 0; i < this.view_obj.length; i++) {
            this.view_obj[i].sprite.y = this.size.per.height * 32 * (this.view_obj.length-i-1) - this.size.per.height * 63;
        }
    };
    // app.ticker.deltaMS  : 前のフレームから今のフレームまでの経過時間(ms)
    // view_obj[i].
    //1000ms毎px
    speed = 0 // float
    freem = () => {
        const tic = this.app.ticker.deltaMS;
        for(let i = 0 ; i < 5 ; i ++) {
            const elm = this.view_obj[i] ;
            
            elm.sprite.y += (this.speed/1000 )*tic ;
        }
        if(this.view_obj[0].sprite.y >= this.size.per.height*97){
            this.setNextViewObj()
            if(this.isWaitStop){
                this.isWaitStop = false ;
                this.speed = 0 ;
                this.isStarted = false ;
                slot.checkFinish()
            }
        }
    }
    isWaitStop = false 
    isStarted = false
    isButton = false
    stop = () => {
        if(!this.isStarted) return ;
        this.colorButton (false)
        this.isButton = false
        let counter = 0
        const id = setInterval(() => {
            counter ++ ;
            this.speed = 100 * (20-counter) ;
            if(counter >= 19){
                //this.speed = 0 ;
                this.isWaitStop = true
                clearInterval(id)
            }
        }, 35);
    }
    start = () => {
        this.colorButton (true)
        if(this.isStarted) return ;
        this.fortuneOptionApplicable()
        let counter = 0
        const id = setInterval(() => {
            counter ++ ;
            this.speed = 100 * counter ;
            if(counter >= 20){
                clearInterval(id)
                this.isStarted = true ;
                this.stopButton.beginFill(0x0000FF);
                this.isButton = true ;
            }
        }, 70);
    }
    // 明日の自分へ
    // stop start を作ったので対応するボタンを作ってください。
    // コンストラクタでnewしなくても多分大丈夫
    stopButton = new PIXI.Graphics () ;
    setButton = (i) => {
        this.stopButton.lineStyle(4, 0xFFFFFF);
        this.stopButton.beginFill(0xFFFFFF);
        this.stopButton.drawEllipse(
            this.size.per.width*i*100 + this.size.per.width*50, // 中心のx座標
            this.size.per.height*100 + this.size.per.width*40, // 中心のy座標
            this.size.per.width*46,                            // 横方向の半径 (半長)
            this.size.per.width*30                             // 縦方向の半径 (半短)
        );
        this.stopButton.endFill();
        this.stopButton.interactive = true;
        this.stopButton.buttonMode = true;
        this.stopButton.on('pointertap',()=>{
            if(this.isButton){
                this.stop()
            }
        });
        this.parent.addChild(this.stopButton);
        this.colorButton(false)
    }
    colorButton = (sw) => {
        if(sw){
            this.stopButton.tint = 0x0000FF;
        }else{
            this.stopButton.tint = 0x606080;
        }
    }
    

    constructor(width,height,i,app,objs,parent){
        super()
        this.parent = parent
        this.setGameObj(objs)
        this.size.per.width = width / 100
        this.size.per.height = height / 100
        this.size.per.nol = width
        this.size.per.nol = height
        this.beginFill(0x08090c)
            .drawRect(this.size.per.width*2 , 0, this.size.per.width*98, height) // 引数のwidth, heightで描画
            .endFill();

        const viewportMask = new PIXI.Graphics();
        viewportMask.beginFill(0x19201B); // マスクの色は何でも良いが、描画は必要
        viewportMask.drawRect(
            0,
            this.size.per.height,
            width,
            this.size.per.height*96); // (x, y, width, height)
        viewportMask.endFill();
        this.addChild(viewportMask); // マスク自体もステージに表示する必要がある
        this.mask = viewportMask

        this.pivot.x = Math.floor(this.width/2)
        this.pivot.y = Math.floor(this.height/2)
        this.x = i*this.width + Math.floor(this.width/2)
        this.y = Math.floor(this.height/2)

        this.setingViewObj()
        
        this.app = app
        this.app.ticker.add(this.freem);

        this.setButton(i)
    }
}
class SlotStartButton extends PIXI.Graphics {
    isButton = true
    colorButton = (sw) => {
        if(sw){
            this.tint = 0x0000FF;
        }else{
            this.tint = 0x606080;
        }
    }
    onIsButton = () => {
        this.isButton = true
        this.colorButton(true)
    }
    constructor (w,h) {
        super()
        this.lineStyle(4, 0xFFFFFF);
        this.beginFill(0xFFFFFF);
        this.drawEllipse(
            (w/11)*9, // 中心のx座標
            (h/15)*11, // 中心のy座標
            w/7, // 横方向の半径 (半長)
            w/15  // 縦方向の半径 (半短)
        );
        this.endFill();
        this.interactive = true;
        this.buttonMode = true;
        this.on('pointertap',()=>{
            if(this.isButton){
                this.isButton = false
                this.colorButton(false)
                if(slot.betCoin > 0 ){
                    slot.start()
                    
                }else{
                    setTimeout(()=>{
                        this.isButton = true
                        this.colorButton(true)
                    },700)
                    err.makeError("コインがベットされていません。<br>No coins staked")
                }

            }
            
        });
        this.colorButton(true)
    }
}
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
    // nameも対応
    changeObjsProbability = ( id , value ) => {
        let arr = [] ;
        if(typeof id == "number" && typeof value == "number"){
            for(let i = 0 ; i < this.game.obj.length ; i++){
                const elm = this.game.obj[i] ;
                arr.push (elm.weight_t-elm.weight_b)
                if(elm.id == id ){
                    arr[i] = value ;
                }
            }
        }else if(typeof id == "string" && typeof value == "number"){
            for(let i = 0 ; i < this.game.obj.length ; i++){
                const elm = this.game.obj[i] ;
                arr.push (elm.weight_t-elm.weight_b)
                if(elm.name == id ){
                    arr[i] = value ;
                }
            }
        }else if(typeof value == "object"){
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
        this.changeObjsProbability(null,this.fortune) ;
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
               slot.start()
            }
            this.isButton = false
            this.colorButton(false)
        });
        this.colorButton(true)
    }
}
class Slot {
    screen //スクリーンobj
    app //pixi obj
    main_container = new PIXI.Container()
    //=====================================================================
    // ゲームの環境変数
    //=====================================================================
    //---------------------------------------------------------------------
    // ポジション系 モバイル版等の制御もここでやりたい
    //---------------------------------------------------------------------
    width = 840
    height = 900
    //---------------------------------------------------------------------
    // ゲームで使う画像データ等の処理用配列と設定関数
    //---------------------------------------------------------------------
    slot_object = []
    //---------------------------------------------------------------------
    setSlotObject = function (objs){
        for (let i = 0 ; i < objs.length ; i ++) {
            const elm = objs [i] ;
            if( elm.score == undefined){
                this.addSlotObject (
                    elm.name,
                    elm.probability, // Float
                    elm.PATH_TO_IMAGE, // String
                    elm.obj_id, // Int
                    elm.tag
                )
            }else{
                this.addSlotObject (
                    elm.name,
                    elm.probability, // Float
                    elm.PATH_TO_IMAGE, // String
                    elm.obj_id, // Int
                    elm.tag ,
                    elm.score 
                )
            }
        }
    }
    addSlotObject = function(
        name ,// String
        probability, // Float
        PATH_TO_IMAGE, // String
        obj_id, // Int
        tag , // string[]
        score ,  // Function
    ){
            if (
                typeof probability !== 'number' ||
                typeof PATH_TO_IMAGE !== 'string' ||
                typeof obj_id!== 'number'  ||
                typeof name !== "string"
            ) {
                console.log(`slot : 正しいデータ形式でないため3番目引数 "name=${name}" を飛ばしています。`)
                return
            }
            if (
                typeof score !== 'function' && typeof func !== 'undefined'
            ) {
                console.log(`slot : 正しいデータ形式でないため3番目引数 "name=${name}" を飛ばしています。\nslot : object.socreが定義されていてかつ関数以外の型である`)
                return
            }
            this.slot_object.push({
                name : name ,
                id : obj_id ,
                weight : probability , // 確率の重み
                texture : PIXI.Texture.from(PATH_TO_IMAGE),
                score : score ,
                tag : tag 
            })
    }
    //---------------------------------------------------------------------
    deleteSlotObject = function(obj_id) {
        this.slot_object = this.slot_object.filter(elm => elm.id !== obj_id);
    }
    //---------------------------------------------------------------------
    start = function(){
        slot.screen.screen.forEach(elm=>{elm.start()})
        //setTimeout(function(){slot.screen.screen.forEach((elm,index)=>{setTimeout(()=>{elm.stop()},1000*index)})},2000);
    }
    //---------------------------------------------------------------------
    // スロットが回り終わったことを検知します。
    //---------------------------------------------------------------------
    checkFinish = () => {
        const sc = this.screen.screen ;
        let isFinish = true ;
        let scoreData = [] ;
        sc.forEach((elm)=>{
            if(elm.isStarted){
                isFinish = false ;
            }
        })
        if(!isFinish)return ;

        sc.forEach((elm)=>{
            scoreData.push([
                elm.view_obj [0] ,
                elm.view_obj [1] ,
                elm.view_obj [2] 
            ])
        })
        this.winDetection(scoreData);
    }
    //---------------------------------------------------------------------
    // ここは無理やり勝ちを検出します。
    //---------------------------------------------------------------------
    tagVr = [
        {
            name : "fruits" ,
            score : (win_score)=>{
                return win_score-1 ;
            } ,
        },{
            name : "programing" ,
            score : (win_score)=>{
                return win_score ;
            } ,
        }
    ]
    tagScore = (name,len) => {
        for(let i = 0 ; i < this.tagVr.length ; i ++){
            const elm = this.tagVr[i] ;
            if(elm.name == name){
                return elm.score (this.sameScore(name,len))
            }
        }
        console.log("非対応のタグが付いたオブジェクトが存在しています。")
        return 0
    }
    sameScore = (name,len) => {
        for(let i = 0 ; i < this.slot_object.length ; i ++){
            const elm = this.slot_object[i] ;
            if(elm.name == name){
                return elm.score (this.betCoin,len)
            }
        }
        return 1
    }
    allDetection = []
    winDetection = (m) => {
        let winScore = []
        let winPos = []
        let t1s = []
        let t2s = []
        function createWin (s,p,t1,t2){
            winScore.push (s)
            winPos.push(p)
            t1s.push(t1)
            t2s.push(t2)
        }
        // たて
        for(let x = 0 ; x < 5 ; x ++){
            const c = this.crossWin(m[x]) ;
            const t = this.tagWin(m[x]) ;
            if(c.reslut){
                createWin(this.sameScore(c.name,c.len),m[x],"same","vr")
            }else if(t.result){
                createWin(this.tagScore(t.name,t.len),m[x],"tag","vr")
            }
        }
        // よこ
        for(let y = 0 ; y < 3 ; y ++){
            const arr = [
                [m[0][y],m[1][y],m[2][y],m[3][y],m[4][y]],
                [m[0][y],m[1][y],m[2][y],m[3][y]],
                [m[1][y],m[2][y],m[3][y],m[4][y]],
                [m[0][y],m[1][y],m[2][y]],
                [m[1][y],m[2][y],m[3][y]],
                [m[2][y],m[3][y],m[4][y]],
            ]
            arr.forEach(elm=>{
                const c = this.crossWin(elm)
                const t = this.tagWin(elm)
                if(c.reslut){
                    createWin(this.sameScore(c.name,c.len),elm,"same","bs")
                }else if(t.result){
                    createWin(this.tagScore(t.name,t.len),elm,"tag","bs")
                }
            })
        }
        // 斜め
        const arr2 = [
            [m[0][0],m[1][1],m[2][2]],
            [m[1][0],m[2][1],m[3][2]],
            [m[2][0],m[3][1],m[4][2]],
            [m[0][2],m[1][1],m[2][0]],
            [m[1][2],m[2][1],m[3][0]],
            [m[2][2],m[3][1],m[4][0]],
        ]
        arr2.forEach(elm=>{
            const c = this.crossWin(elm)
            const t = this.tagWin(elm)
            if(c.reslut){
                createWin(this.sameScore(c.name,c.len),elm,"same","cr")
            }else if(t.result){
                createWin(this.tagScore(t.name,t.len),elm,"tag","cr")
            }
        })
        // 特殊
        const arr3 = [
            [],
            [m[0][0],m[1][0],m[2][0],m[3][0],m[4][0],m[1][1],m[2][1],m[3][1],m[2][2]],
            [m[0][2],m[1][2],m[2][2],m[3][2],m[4][2],m[1][1],m[2][1],m[3][1],m[2][0]],
            [m[0][0],m[0][1],m[0][2],m[1][0],m[1][1],m[1][2],m[2][0],m[2][1],m[2][2]],
            [m[3][0],m[3][1],m[3][2],m[1][0],m[1][1],m[1][2],m[2][0],m[2][1],m[2][2]],
            [m[3][0],m[3][1],m[3][2],m[4][0],m[4][1],m[4][2],m[2][0],m[2][1],m[2][2]],
        ]
        for(let x = 0 ; x < 5 ; x ++){
            for(let y = 0 ; y < 3 ; y ++){
                arr3[0].push(m[x][y])
            }
        }
        arr3.forEach(elm=>{
            const c = this.crossWin(elm)
            const t = this.tagWin(elm)
            if(c.reslut){
                createWin(this.sameScore(c.name,c.len),elm,"same","sp")
            }else if(t.result){
                createWin(this.tagScore(t.name,t.len),elm,"tag","sp")
            }
        })

        //初期化とエフェクト
        this.win(winScore,winPos,t1s,t2s)

        this.betCoin = 0 ;
    }

    crossWin = (arr) => {
        const name = arr[0].data.name ;
        for(let i = 1 ; i < arr.length ; i ++){
            const elm = arr[i]
            if(elm.data.name !== name){
                return {
                    reslut : false ,
                    name : name ,
                    len : arr.length
                }
            }
        }
        return {
            reslut : true ,
            name : name ,
            len : arr.length
        }
    }
    tagWin = (arr) => {
        let tag = []
        function findTag(name){
            let flag = 0
            for(let i = 1 ; i <= tag.length ; i ++){
                if(name==tag[i-1].name){
                    flag = i ;
                    break ;
                }
            }
            return flag
        }
        
        for(let i = 0 ; i < arr.length ; i ++){
            const elm = arr[i]
            for(let j = 0 ; j < elm.tag.length ; j ++){
                const c = findTag(elm.tag[j])
                if(c){
                    tag[c-1].count ++ 
                }else{         
                    tag.push({
                        name : elm.tag[j] ,
                        count : 1 ,
                    })
                }
                
            }
        }
        for(let i = 0 ; i < tag.length ; i ++){
            const elm = tag[i] ;
            if(elm.count == arr.length){
                return {
                    result : true ,
                    name : elm.name ,
                    len : arr.length 
                }
            }
        }
        return {
            result : false ,
            name : null ,
            len : arr.length 
        } ;
    }
    //---------------------------------------------------------------------
    //当たり処理
    //---------------------------------------------------------------------
    win = (score,position,type,type2) => {
        for(let i = 0 ; i < score.length ; i ++){
            if(score[i] <= 0 ) continue ;
            const p = position[i] ;
        }
        this.start_button.onIsButton()
    }
    //---------------------------------------------------------------------
    // スタートボタン
    //---------------------------------------------------------------------
    betCoin = 0 ;
    start_button ;
    //---------------------------------------------------------------------
    // コイン関係
    //---------------------------------------------------------------------
    setCoin = (value) => {
        while(value >= 10){
            value -= 10 ;
            this.coinBox.addChild(new SlotCoin(
                10,
                Math.random()*(this.width-100)+50,
                Math.random()*200,
            ));
        }
        while(value >= 5){
            value -= 5 ;
            this.coinBox.addChild(new SlotCoin(
                5,
                Math.random()*(this.width-100)+50,
                Math.random()*200,
            ));
        }
        while(value >= 1){
            value -= 1 ;
            this.coinBox.addChild(new SlotCoin(
                1,
                Math.random()*(this.width-100)+50,
                Math.random()*200,
            ));
        }
        
    }
    // 一円玉と十円玉しかない時5円を消すと挙動がバグるのでよう修正
    // ロジックそのものを見直すべき
    removeCoin = (value) => {
        const removeOneCoin = (coinValue) => {
            for (let i = this.coinBox.children.length - 1; i >= 0; i--) {
                const coin = this.coinBox.children[i];
                if (coin.coin === coinValue) {
                    this.coinBox.removeChild(coin);
                    coin.destroy();
                    return true;
                }
            }
            return false;
        };

        while (value >= 10) {
            if (removeOneCoin(10)) {
                value -= 10;
            } else {
                break;
            }
        }
        while (value >= 5) {
            if (removeOneCoin(5)) {
                value -= 5;
            } else {
                break;
            }
        }
        while (value >= 1) {
            if (removeOneCoin(1)) {
                value -= 1;
            } else {
                break;
            }
        }
    }
    sumCoin = () => {
        let coinCounter = 0
        for(let i = 0 ; i < slot.coinBox.children.length ; i ++){
            const elm = slot.coinBox.children[i] ;
            coinCounter += elm.coin ;
        }
        return coinCounter
    }
    constructor(w,h,useData){
        //super()
        this.width = w
        this.height = h
        //---------------------------------------------------------------------
        // Pixiアプリケーション生成
        //---------------------------------------------------------------------
        let app = new PIXI.Application({
            width: this.width,                 // スクリーン(ビュー)横幅 
            height: this.height,                // スクリーン(ビュー)縦幅  
            backgroundColor: 0x171D19,  // 背景色 16進 0xRRGGBB
            autoDensity: true,
        });
        

        let el = document.getElementById('app');
        el.appendChild(app.view);
        
        this.app = app
        //---------------------------------------------------------------------
        // 環境設定
        //---------------------------------------------------------------------
        this.setSlotObject(useData)
        //---------------------------------------------------------------------
        // スクリーン設定
        //---------------------------------------------------------------------

        this.screen = new SlotGameScreen(app,this.slot_object)
        this.screen.setWidth(w/5) ;
        this.screen.setHeight(h/2) ;
        this.main_container.addChild(this.screen)
        //---------------------------------------------------------------------
        // new SlotStartButton()
        //---------------------------------------------------------------------
        this.start_button = new SlotStartButton(w,h) ;
        this.screen.addChild(this.start_button)
        this.main_container.addChild(this.start_button )
        //---------------------------------------------------------------------
        // Coin box
        //---------------------------------------------------------------------
        this.coinBox = new PIXI.Container() ;
        this.main_container.addChild(this.coinBox)
        //---------------------------------------------------------------------
        this.app.stage.addChild(this.main_container)

        
    } 
}


//=====================================================================
// ゲーム開始用初期設定
//=====================================================================
const slot = new Slot(840,900,[
    {
        name : "bell" ,
        probability : 12, // Float
        PATH_TO_IMAGE : "../img/bell.png", // String
        obj_id : 0 , // Int
        tag : [] ,
        score : function(bet,size){
            return 5 * bet  * (size-2)
        } // Function
    },{
        name : "apple" ,
        probability : 20, // Float
        PATH_TO_IMAGE : "../img/apple.png", // String
        obj_id : 1 , // Int
        tag : ["fruits"] ,
        score : function(bet,size){
            return 3 * bet  * (size-2)
        } // Function
    },{
        name : "lemon" ,
        probability : 20, // Float
        PATH_TO_IMAGE : "../img/lemon.png", // String
        obj_id : 2 , // Int
        tag : ["fruits"] ,
        score : function(bet,size){
            return 2 * bet  * (size-2)
        } // Function
    },{
        name : "ruby" ,
        probability : 8, // Float
        PATH_TO_IMAGE : "../img/ruby.png", // String
        obj_id : 3 , // Int
        tag : [] ,
        score : function(bet,size){
            return 10 * bet  * (size-2)
        } // Function
    },{
        name : "seven" ,
        probability : 6, // Float
        PATH_TO_IMAGE : "../img/seven.png", // String
        obj_id : 4 , // Int
        tag : [] ,
        score : function(bet,size){
            return 100 * bet  * (size-2)
        } // Function
    },{
        name : "cpp" ,
        probability : 6, // Float
        PATH_TO_IMAGE : "../img/cpp.png", // String
        obj_id : 5 , // Int
        tag : ["programing"] ,
        score : function(bet,size){
            return 100 * bet  * (size-2)
        } // Function
    },{
        name : "java" ,
        probability : 6, // Float
        PATH_TO_IMAGE : "../img/java.png", // String
        obj_id : 6 , // Int
        tag : ["programing"] ,
        score : function(bet,size){
            return 100 * bet  * (size-2)
        } // Function
    },{
        name : "py" ,
        probability : 6, // Float
        PATH_TO_IMAGE : "../img/py.png", // String
        obj_id : 7 , // Int
        tag : ["programing"] ,
        score : function(bet,size){
            return 100 * bet  * (size-2)
        } // Function
    }
]) ;

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
    removeCoins = (value) => {
        let count = 0 ;
        let p = this.getCoinSum ().sum - value ;
        if(p<0){
            return 0
        }
        while(this.getCoinSum().sum > p ){
            const c = this.getCoinSum () ;
            if(c.coin._10 >= 1 && c.sum-p >= 10){
                if(this.removeCoin(10)){
                    count += 10 ;
                    continue ;
                }
            }
            if(c.coin._5 >= 1 && c.sum-p >= 5){
                if(this.removeCoin(5)){
                    count += 5 ;
                    continue ;
                }
            }
            if(c.coin._1 >= 1 && c.sum-p >= 1){
                if(this.removeCoin(1)){
                    count += 1 ;
                    continue ;
                }
            }
            if(c.sum-p > 0){
                if(c.coin._10 >= 1){
                    this.removeCoin(10)
                    this.setCoin(9);
                    count += 1
                    continue
                }
                if(c.coin._5 >= 1){
                    this.removeCoin(5)
                    this.setCoin(4);
                    count += 1
                    continue
                }
            }
            break ;
        }
        return count ;
    }
    removeCoin = (value) => {
        // 指定された値のコインを探して削除
        for(let i = 0; i < this.coinBox.children.length; i++){
            const coin = this.coinBox.children[i];
            // SlotCoinクラスのインスタンスで、指定された値と一致するかチェック
            if(coin instanceof SlotCoin && coin.coin === value){
                // coinBoxから削除
                this.coinBox.removeChild(coin);
                // メモリ解放のためにdestroy
                coin.destroy();
                return true;
            }
        }
        
        // 指定された値のコインが見つからなかった場合
        return false;
    }
    getCoinSum = () => {
        let count = 0 ;
        const coin = {
            _10 : 0 ,
            _5 : 0 ,
            _1 : 0 ,
        }
        for(let i = 0 ; i < this.coinBox.children.length ; i ++){
            count += this.coinBox.children[i].coin ;
            switch(this.coinBox.children[i].coin){
            case 10 :
                coin._10 ++ ;
                break ;
            case 5 :
                coin._5 ++ ;
                break ;
            case 1 :
                coin._1 ++ ;
                break ;
            }
        }
        return {
            sum : count ,
            coin : coin ,
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

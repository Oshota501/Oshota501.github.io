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
    constructor(app){
        super()
        for(let i = 0 ; i < 5 ; i ++){
            const slotScreen = new SlotScreen(
                this.width ,
                this.height ,
                i,
                app
            )   
            this.screen.push(slotScreen);

            this.addChild(slotScreen); // 2. 生成したスロットをコンテナに追加
        }
    }
}
class SlotScreen extends PIXI.Graphics {
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
    speed = 0 // float
    game = {
        obj : [{
            name : "apple" ,
            id : 0 ,
            weight_b : 0 , // 確率の重み
            weight_t : 10 ,
            texture : PIXI.Texture.from("../img/apple.png"),
            score : function(bet){
                return bet * 2
            } , 
        },{
            name : "bell" ,
            id : 1 ,
            weight_b : 10 , // 確率の重み
            weight_t : 15 ,
            texture : PIXI.Texture.from("../img/bell.png"),
            score : function(bet){
                return bet * 3
            } , 
        }],
        sum_weight : 15
    }
    setGameObj = function(objs){
        this.game.obj = []
        this.game.sum_weight = 0
        objs.forEach(elm => {
            this.game.obj.push ({
                name : elm.name ,
                id : elm.id ,
                weight_b : this.game.sum_weight ,
                weight_t : this.game.sum_weight + elm.weight ,
                texture : elm.texture ,
                score : elm.score 
            })
            this.game.sum_weight += elm.weight
        });
    }
    changeGameObj = function (id,obj) {
        found = false ;
        this.game.sum_weight = 0 ;
        for(let i = 0 ; i < this.game.obj.length ; i ++){
            const elm = this.game.obj[i] ;
            if (found ){
                elm.weight_b = this.game.sum_weight ;
                elm.weight_t = this.game.sum_weight + obj.weight ;
            }else {
                 if(elm.id == id){
                    found = true ;
                    elm = {
                        name : obj.name ,
                        id : obj.id ,
                        weight_b : this.game.sum_weight ,
                        weight_t : this.game.sum_weight + obj.weight ,
                        texture : obj.texture ,
                        score : obj.score  
                    }
                }
            }
            this.game.sum_weight += elm.weight ;
        }
        console.error(`SlotScreen.changeGameObj : not found id ${id}`)
        return
    }
    getGameObj = function(){
        const rand = Math.floor(Math.random()*this.game.sum_weight)
        for (let i = 0 ; i < this.game.obj.length ; i ++){
            const elm = this.game.obj[i]
            if(elm.weight_b <= rand && elm.weight_t > rand ){
                return  {
                    name : elm.name ,
                    id : elm.id ,
                    texture : elm.texture ,
                    score : elm.score 
                }
            }   
        }
        console.error("SlotScreen.getGameObj : not found ")
        return
    }
    view_obj = []
    setingViewObj = function(){
        for(let i = 0 ; i < 5; i ++){
            const elm = this.getGameObj();
            const sprite = new PIXI.Sprite(elm.texture) ;
            sprite.x = 0
            sprite.y = this.size.per.height *32*i - this.size.per.height *32
            elm.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            sprite.scale.set(6, 6)
            this.addChild ( sprite )
            this.view_obj.push ({
                data : {
                    name : elm.name ,
                    id : elm.id ,
                } ,
                sprite : sprite
            })
        }
    }
    //作成中
    //view_obj 配列をシフトして0番目にgetGameObj();ものを加える処理を書いてください。
    // sprite.destroy() を忘れずに
    // 同スプライトを使っている変数の参照を削除（配列から削除するだけで十分と思われる）
    setNextViewObj = function(){
        const elm = this.getGameObj();
    }
    //作成中
    // ticker add しているので回転するエフェクトをここに書き加えるだけ
    //     amountTime += delta;                    
    // // delta(app.ticker.deltaTime) : 前のフレームから今のフレームまでの経過時間を正規化した値？
    // // amountTime += app.ticker.deltaMS;    
    // // app.ticker.deltaMS  : 前のフレームから今のフレームまでの経過時間(ms)
    // view_obj[i].
    
    freem = function(){

    }
    constructor(width,height,i,app){
        super()
        this.size.per.width = width / 100
        this.size.per.height = height / 100
        this.size.per.nol = width
        this.size.per.nol = height
        this.beginFill(0x171D19)
            .drawRect(0, 0, width, height) // 引数のwidth, heightで描画
            .endFill();
        this.beginFill(0x19201B)
            .drawRect(
                this.size.per.width*10,
                this.size.per.width*10,
                this.size.per.width*90,
                this.size.per.height*90)
            .endFill();
        this.pivot.x = Math.floor(this.width/2)
        this.pivot.y = Math.floor(this.height/2)
        this.x = i*this.width + Math.floor(this.width/2)
        this.y = Math.floor(this.height/2)

        this.setingViewObj()

        this.app = app
        this.app.ticker.add(this.freem);
    }
}

class Slot {
    screen //スクリーンobj
    app //pixi obj

    //=====================================================================
    // ゲームの環境変数
    //=====================================================================
    //---------------------------------------------------------------------
    // ゲームで使う画像データ等の処理用配列と設定関数
    //---------------------------------------------------------------------
    slot_object = []
    //---------------------------------------------------------------------
    addSlotObject = function(
        name ,// String
        probability, // Float
        PATH_TO_IMAGE, // String
        obj_id, // Int
        score = function(bet,date){
            return date.bell * bet  
        } // Function
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
            })
    }
    //---------------------------------------------------------------------
    deleteSlotObject = function(obj_id) {
        this.slot_object = this.slot_object.filter(elm => elm.id !== obj_id);
    }
    //---------------------------------------------------------------------


    constructor(w,h,useData){
        //---------------------------------------------------------------------
        // Pixiアプリケーション生成
        //---------------------------------------------------------------------
        let app = new PIXI.Application({
            width: 840,                 // スクリーン(ビュー)横幅 
            height: 900,                // スクリーン(ビュー)縦幅  
            backgroundColor: 0x171D19,  // 背景色 16進 0xRRGGBB
            autoDensity: true,
        });
        

        let el = document.getElementById('app');
        el.appendChild(app.view);
        
        this.app = app

        //---------------------------------------------------------------------
        this.screen = new SlotGameScreen(app)
        this.screen.setWidth(w/5) ;
        this.screen.setHeight(h) ;
        app.stage.addChild(this.screen)

        //---------------------------------------------------------------------
        
        for (let i = 0 ; i < useData.length ; i ++) {
            const elm = useData [i] ;
            this.addSlotObject (
                elm.name,
                elm.probability, // Float
                elm.PATH_TO_IMAGE, // String
                elm.obj_id, // Int
            )
        }
        
    } 
}


//=====================================================================
// ゲーム開始用初期設定
//=====================================================================

const slot = new Slot(840,285,[
    {
        name : "bell" ,
        probability : 12, // Float
        PATH_TO_IMAGE : "../img/bell.png", // String
        obj_id : 0 , // Int
        score : function(bet){
            return 5 * bet  
        } // Function
    },{
        name : "apple" ,
        probability : 20, // Float
        PATH_TO_IMAGE : "../img/apple.png", // String
        obj_id : 1 , // Int
        score : function(bet){
            return 3 * bet  
        } // Function
    },{
        name : "lemon" ,
        probability : 20, // Float
        PATH_TO_IMAGE : "../img/lemon.png", // String
        obj_id : 2 , // Int
        score : function(bet){
            return 2 * bet  
        } // Function
    },{
        name : "ruby" ,
        probability : 8, // Float
        PATH_TO_IMAGE : "../img/ruby.png", // String
        obj_id : 3 , // Int
        score : function(bet){
            return 10 * bet  
        } // Function
    },{
        name : "seven" ,
        probability : 6, // Float
        PATH_TO_IMAGE : "../img/seven.png", // String
        obj_id : 4 , // Int
        score : function(bet){
            return 100 * bet  
        } // Function
    }
]) ;

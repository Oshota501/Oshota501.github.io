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
                objs
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
    game = {
        // obj : [{
        //     name : "apple" ,
        //     id : 0 ,
        //     weight_b : 0 , // 確率の重み
        //     weight_t : 10 ,
        //     texture : PIXI.Texture.from("../img/apple.png"),
        //     score : function(bet){
        //         return bet * 2
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
        // }],
        obj : [] ,
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
                sprite : sprite
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
            sprite: newSprite
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
            }
        }
    }
    isWaitStop = false 
    isStarted = false
    stop = () => {
        if(!this.isStarted) return ;

        let counter = 0
        const id = setInterval(() => {
            counter ++ ;
            this.speed = 100 * (20-counter) ;
            if(counter >= 19){
                //this.speed = 0 ;
                this.isWaitStop = true
                clearInterval(id)
            }
        }, 70);
    }
    start = () => {
        if(this.isStarted) return ;
        let counter = 0
        const id = setInterval(() => {
            counter ++ ;
            this.speed = 100 * counter ;
            if(counter >= 20){
                clearInterval(id)
                this.isStarted = true ;
            }
        }, 70);
    }
    // 明日の自分へ
    // stop start を作ったので対応するボタンを作ってください。
    // コンストラクタでnewしなくても多分大丈夫
    stopButton 

    constructor(width,height,i,app,objs){
        super()
        this.setGameObj(objs)
        this.size.per.width = width / 100
        this.size.per.height = height / 100
        this.size.per.nol = width
        this.size.per.nol = height
        this.beginFill(0x19201B)
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
        
        for (let i = 0 ; i < useData.length ; i ++) {
            const elm = useData [i] ;
            this.addSlotObject (
                elm.name,
                elm.probability, // Float
                elm.PATH_TO_IMAGE, // String
                elm.obj_id, // Int
            )
        }
        //---------------------------------------------------------------------

        this.screen = new SlotGameScreen(app,this.slot_object)
        this.screen.setWidth(w/5) ;
        this.screen.setHeight(h) ;
        app.stage.addChild(this.screen)

        //---------------------------------------------------------------------
        
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
    },{
        name : "cpp" ,
        probability : 6, // Float
        PATH_TO_IMAGE : "../img/cpp.png", // String
        obj_id : 5 , // Int
        score : function(bet){
            return 100 * bet  
        } // Function
    },{
        name : "java" ,
        probability : 6, // Float
        PATH_TO_IMAGE : "../img/java.png", // String
        obj_id : 6 , // Int
        score : function(bet){
            return 100 * bet  
        } // Function
    },{
        name : "py" ,
        probability : 6, // Float
        PATH_TO_IMAGE : "../img/py.png", // String
        obj_id : 7 , // Int
        score : function(bet){
            return 100 * bet  
        } // Function
    }
]) ;

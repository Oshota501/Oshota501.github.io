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
    constructor(){
        super()
        for(let i = 0 ; i < 5 ; i ++){
            const slotScreen = new SlotScreen(
                this.width ,
                this.height ,
                i
            )   
            this.screen.push(slotScreen);
            this.screen.push(slotScreen);
            this.addChild(slotScreen); // 2. 生成したスロットをコンテナに追加

        }
    }
}
class SlotScreen extends PIXI.Graphics {
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
    
    constructor(width,height,i){
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
    }
}

class Slot {
    screen = new SlotGameScreen() //スクリーンobj
    app //pixi obj

    //=====================================================================
    // ゲームの環境変数
    //=====================================================================
    //---------------------------------------------------------------------
    // ゲームで使う画像データ等の処理用配列と設定関数
    //---------------------------------------------------------------------
    slot_object = []
    //---------------------------------------------------------------------
    setSlotObject = function(
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
                texture : new PIXI.Sprite(new PIXI.Texture.from(PATH_TO_IMAGE)),
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

        this.screen.setWidth(w/5) ;
        this.screen.setHeight(h) ;
        app.stage.addChild(this.screen)

        //---------------------------------------------------------------------
        
        for (let i = 0 ; i < useData.length ; i ++) {
            const elm = useData [i] ;
            this.setSlotObject (
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

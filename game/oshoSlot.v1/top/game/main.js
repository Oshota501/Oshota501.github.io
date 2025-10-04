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
        win_p : "5倍" ,
        score : function(bet,size){
            return 5 * bet  * (size-2)
        } // Function
    },{
        name : "apple" ,
        probability : 20, // Float
        PATH_TO_IMAGE : "../img/apple.png", // String
        obj_id : 1 , // Int
        tag : [] ,
        win_p : "3倍" ,
        score : function(bet,size){
            return 3 * bet  * (size-2)
        } // Function
    },{
        name : "lemon" ,
        probability : 24, // Float
        PATH_TO_IMAGE : "../img/lemon.png", // String
        obj_id : 2 , // Int
        tag : [] ,
        win_p : "2倍" ,
        score : function(bet,size){
            return 2 * bet  * (size-2)
        } // Function
    },{
        name : "diamond" ,
        probability : 8, // Float
        PATH_TO_IMAGE : "../img/ruby.png", // String
        obj_id : 3 , // Int
        tag : [] ,
        win_p : "10倍" ,
        score : function(bet,size){
            return 10 * bet  * (size-2)
        } // Function
    },{
        name : "seven" ,
        probability : 6, // Float
        PATH_TO_IMAGE : "../img/seven.png", // String
        obj_id : 4 , // Int
        tag : [] ,
        win_p : "100倍" ,
        score : function(bet,size){
            return 100 * bet  * (size-2)
        } // Function
    },{
        name : "cpp" ,
        probability : 6, // Float
        PATH_TO_IMAGE : "../img/cpp.png", // String
        obj_id : 5 , // Int
        tag : ["programing"] ,
        win_p : "40倍<br>他の言語と一致して1円" ,
        score : function(bet,size){
            return 40 * bet  * (size-2)
        } // Function
    },{
        name : "java" ,
        probability : 6, // Float
        PATH_TO_IMAGE : "../img/java.png", // String
        obj_id : 6 , // Int
        tag : ["programing"] ,
        win_p : "40倍<br>他の言語と一致して1円" ,
        score : function(bet,size){
            return 40 * bet  * (size-2)
        } // Function
    },{
        name : "py" ,
        probability : 6, // Float
        PATH_TO_IMAGE : "../img/py.png", // String
        obj_id : 7 , // Int
        tag : ["programing"] ,
        win_p : "40倍<br>他の言語と一致して1円" ,
        score : function(bet,size){
            return 40 * bet  * (size-2)
        } // Function
    }
]) ;

// 初手の所持金
slot.setCoin(19)
slot.setCoin(1)

bank.coin = 0

// shopの内容物一覧と出現確率

shop.setItems([
    {
        price : 3 ,
        name : "nomal apple" ,
        lvl : 1 ,
        weight : 50 ,
        explain : "1ターンの間 リンゴが出る確率が少し上がる。",
        textureURL : "../img/10.png" ,
        opt : [{
            add : 3 ,
            name : "apple" ,
            fixed : false ,
            turn : 1 ,
        }] 
    },{
        price : 2 ,
        name : "nomal lemon" ,
        lvl : 1 ,
        weight : 50 ,
        explain : "1ターンの間 レモンが出る確率が少し上がる。",
        textureURL : "../img/10.png" ,
        opt : [{
            add : 3 ,
            name : "lemon" ,
            fixed : false ,
            turn : 1 ,
        }]
    },{
        price : 7 ,
        name : "煌めくレモン" ,
        lvl : 2 ,
        weight : 20 ,
        explain : "5ターンの間、レモンが出る確率が少し上がる。",
        textureURL : "../img/10.png" ,
        opt : [{
            add : 2 ,
            name : "lemon" ,
            fixed : false ,
            turn : 5 ,
        },{
            add : -4 ,
            name : "apple" ,
            fixed : false ,
            turn : 1 ,
        },]
    },{
        price : 5 ,
        name : "除草剤" ,
        lvl : 2 ,
        weight : 20 ,
        explain : "5ターンの間 リンゴとレモンの出る確率が下がる。",
        textureURL : "../img/10.png" ,
        opt : [{
            add : -4 ,
            name : "lemon" ,
            fixed : false ,
            turn : 1 ,
        },{
            add : -4 ,
            name : "apple" ,
            fixed : false ,
            turn : 1 ,
        },]
    },]
)
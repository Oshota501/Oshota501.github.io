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
        tag : [] ,
        score : function(bet,size){
            return 3 * bet  * (size-2)
        } // Function
    },{
        name : "lemon" ,
        probability : 20, // Float
        PATH_TO_IMAGE : "../img/lemon.png", // String
        obj_id : 2 , // Int
        tag : [] ,
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

// 初手の所持金
slot.setCoin(19)
slot.setCoin(1)

bank.coin = 0

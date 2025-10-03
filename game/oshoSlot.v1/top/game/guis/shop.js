class DataShop {
    updata (){

    }
    itemApplicable (item){
        slot.changeFortune(
            item.opt.name,
            item.opt.turn,
            item.opt.fixed,
            item.opt.add
        );
    }
    allItems = [{
        price : 3 ,
        name : "nomal apple" ,
        lvl : 1 ,
        weight : 50 ,
        explain : "1ターンの間 リンゴが出る確率が少し上がる。",
        textureURL : null ,
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
        textureURL : null ,
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
        textureURL : null ,
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
        textureURL : null ,
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
    shopItems = []
    constructor(){

    }
}
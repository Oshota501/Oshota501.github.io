const mainElm = document.getElementsByClassName("main");
const clearGameScreen = function (){
    mainElm[0].style .display = "none" ;
    mainElm[1].style .display = "block" ;
}
const cardCreateElement = function(code,rarity,text,id,isSelect,cardType){
    let hoshi = "" ;
    for(let i = 0 ; i < rarity ; i ++ ){
        hoshi += "★";
    }
    let style = ""
    switch(cardType){
        case "css" :
            if(isSelect){
                style = "color:red;background:rgba(255, 230, 197, 1)"
            }
            return `<div class="css_card" style="${style}" onclick="clickCard(${id})"><code>${code}</code><br>${text}<br>レア度：${hoshi}</div>`
        case "html" :
            if(isSelect){
                style = "color:rgba(241, 0, 0, 1);background:rgba(205, 255, 197, 1)"
            }
            return `<div class="html_card" style="${style}" onclick="clickCard(${id})"><code>${code}</code><br>${text}<br>レア度：${hoshi}</div>`
        case "shops-css" :
            if(isSelect){
                style = "color:red;background:rgba(255, 230, 197, 1)"
            }
            return `<div class="css_card" style="${style}" onclick="shopCardSelect(${id})"><code>${code}</code><br>${text}<br>レア度：${hoshi}</div>`
        case "shops-html" :
            if(isSelect){
                style = "color:rgba(241, 0, 0, 1);background:rgba(205, 255, 197, 1)"
            }
            return `<div class="html_card" style="${style}" onclick="shopCardSelect(${id})"><code>${code}</code><br>${text}<br>レア度：${hoshi}</div>`
        case "shops-cost" :
            if(isSelect){
                style = "background:rgba(207, 207, 207, 1)"
            }
            return `<div class="css_card" style="${style}">${text}<br><br>価格：${code}</div>`

        default :
            return "<div>予期されていないカード:errow</div>"
    }
}
const db = {
    easy : [
        {code:"&lt;p&gt;&lt;/p&gt;",rarity:1,text:"div要素",type:"html",cost:1},
        {code:"&lt;div&gt;&lt;/div&gt;",rarity:1,text:"p要素",type:"html",cost:1},
        {code:"color:red;",rarity:1,text:"色を変更。",type:"css",cost:1},
        {code:"color:blue;",rarity:1,text:"色を変更。",type:"css",cost:1},
    ] ,
    nomal : [

    ] ,
    hard : [

    ] ,
    hard2 : [
        
    ] ,
}
let pub = {
    select : null ,
    objs : [] ,
    allCard : [] ,
    sellCard : [] ,
}
const clickCard = function(id){
    pub.select = id ;
    selectObj = pub.objs.find(obj => obj.id === id) ;
    selectObj.isSelect = !selectObj.isSelect ;
    rendering(pub.objs)
}
const gameSelector = function (str){
    let q = [] ;
    switch(str){
        case "easy" :
            for(let i = 0 ; i < db.easy.length ; i ++ ){
                q.push(db .easy[i])
            }
            break;
        case "nomal" :
            for(let i = 0 ; i < db.nomal.length ; i ++ ){
                q.push(db .nomal[i])
            }
            for(let i = 0 ; i < db.easy.length ; i ++ ){
                q.push(db .easy[i])
            }
            break;
        case "hard" :
            for(let i = 0 ; i < db.hard.length ; i ++ ){
                q.push(db .hard[i])
            }
            for(let i = 0 ; i < db.nomal.length ; i ++ ){
                q.push(db .nomal[i])
            }
            for(let i = 0 ; i < db.easy.length ; i ++ ){
                q.push(db .easy[i])
            }
            break;
        case "hard2" :
            for(let i = 0 ; i < db.hard2.length ; i ++ ){
                q.push(db .hard2[i])
            }
            for(let i = 0 ; i < db.hard.length ; i ++ ){
                q.push(db .hard[i])
            }
            for(let i = 0 ; i < db.nomal.length ; i ++ ){
                q.push(db .nomal[i])
            }
            for(let i = 0 ; i < db.easy.length ; i ++ ){
                q.push(db .easy[i])
            }
            break;
    }

    mainElm[1].style .display = "none" ;
    pub.allCard = q ;
    pub.objs=[];
    for(let i = 0 ; i < 3 ; i ++){
        const obj = db.easy[Math.floor(db.easy.length*Math.random())];
        pub.objs.push({
            code : obj.code ,
            rarity : obj.rarity ,
            text : obj.text ,
            id : i ,
            isSelect : false ,
            type: obj.type ,
            cost: obj.cost ,
        });
        rendering(pub.objs);
    }
    
    mainElm[2].style .display = "flex" ;
    startGame();
}
const rendering = function(objs){
    let html = "" ;
    for(let i = 0 ; i < objs.length ; i ++){
        const obj = objs[i] ;
        html += cardCreateElement(obj.code,obj.rarity,obj.text,obj.id , obj.isSelect,obj.type);
    }
    document.getElementsByClassName("game_screen_cards")[0].innerHTML = html ;
}
const returnBackMenue = function(index){
    showElms(index)
}
    
const showElms = function ( index ){
    for(let i = 0 ; i < mainElm.length ; i ++){
        mainElm[i].style.display = "none";
    }
    mainElm[index].style.display = "block" ;
}

//ゲーム
const gameAlStartElm = document.getElementsByClassName("game_field")[0];
const gameAlSelectCard = document.getElementsByClassName("buy_card")[0];
const buyCardShop = document.getElementsByClassName("buy_card_shop")[0];
const buyCardCost = document.getElementsByClassName("buy_card_cost")[0];

const startGame = function(){
    const shopRendering = function(objs) {
        let html = "" ;
        for(let i = 0 ; i < objs.length ; i ++){
            const obj = objs[i] ;
            html += cardCreateElement(obj.code,obj.rarity,obj.text,obj.id , obj.isSelect,"shops-"+obj.type);
        }
        buyCardShop.innerHTML = html ;
        html = "" ;
        for(let i = 0 ; i < objs.length ; i ++){
            const obj = objs[i] ;
            html += cardCreateElement(obj.cost,obj.rarity,"形式：買取", obj.id , obj.isSelect,"shops-cost");
        }
        buyCardCost.innerHTML = html ;
    }
    const changeMenue = function (isStarting){
        if(isStarting){
            gameAlStartElm.style.display = "flex" ;
            gameAlSelectCard.style.display = "none" ;
        }else{
            gameAlStartElm.style.display = "none" ;
            gameAlSelectCard.style.display = "flex" ;
            pub.sellCard = [] ;
            for(let i = 0 ; i < 4 ; i ++){
                const obj = pub.allCard[Math.floor(Math.random()*pub.allCard.length)] ;
                pub.sellCard.push({
                    code : obj.code ,
                    rarity : obj.rarity ,
                    text : obj.text ,
                    id : i ,
                    isSelect : false ,
                    type: obj.type ,
                    cost: obj.cost ,
                });
            }
            shopRendering(pub.sellCard);
        }
    }

    changeMenue(false);
}
const shopCardSelect = function(){

}
const mainElm = document.getElementsByClassName("main");
const clearGameScreen = function (){
    mainElm[0].style .display = "none" ;
    mainElm[1].style .display = "block" ;
}
const cardCreateElement = function(code,rarity,text,id,isSelect){
    let hoshi = "" ;
    for(let i = 0 ; i < rarity ; i ++ ){
        hoshi += "★";
    }
    let style = ""
    if(isSelect){
        style = "color:red;"
    }
    return `<div class="css_card" style="${style}" onclick="clickCard(${id})"><code>${code}</code><br>${text}<br>レア度：${hoshi}</div>`
}
const db = {
    easy : [
        {code:"color:yellow;",rarity:1,text:"色を変更。"},
        {code:"color:pink;",rarity:1,text:"色を変更。"},
        {code:"color:orange;",rarity:1,text:"色を変更。"},
        {code:"color:blue;",rarity:1,text:"色を変更。"},
        {code:"color:green;",rarity:1,text:"色を変更。"},
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
    for(let i = 0 ; i < 15 ; i ++){
        const obj = q[Math.floor(q.length*Math.random())];
        pub.objs.push({
            code : obj.code ,
            rarity : obj.rarity ,
            text : obj.text ,
            id : i ,
            isSelect : false ,
        });
        mainElm[2].children[0].innerHTML += cardCreateElement(obj.code,obj.rarity,obj.text,i,false);
    }
    
    mainElm[2].style .display = "flex" ;
}
const rendering = function(objs){
    let html = "" ;
    for(let i = 0 ; i < objs.length ; i ++){
        const obj = objs[i] ;
        html += cardCreateElement(obj.code,obj.rarity,obj.text,obj.id , obj.isSelect);
    }
    mainElm[2].children[0].innerHTML = html ;
}
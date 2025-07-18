window.onload = function(){
    let elms = document.getElementsByClassName("colorV");
    let elms2 = document.getElementsByClassName("rotation1");
    let elms3 = document.getElementsByClassName("rotation2");
    let elms4 = document.getElementsByClassName("rotation3");
    let nms = [];
    let nms2 = [];
    let nms3 = [];
    let nms4 = [];
    let cl = ["red","orange","yellow","lightgreen","green","lightblue","blue","purple"];
    for(let i = 0 ; i < elms.length ; i++)nms.push(i%cl.length);
    for(let i = 0 ; i < elms2.length ; i++)nms2.push(0);
    for(let i = 0 ; i < elms3.length ; i++)nms3.push(0);
    for(let i = 0 ; i < elms4.length ; i++)nms4.push(0);
    setInterval(function(){
        for(let i = 0 ; i < elms.length ; i++){
            nms[i]++;
            if(nms[i]>cl.length)nms[i]=0;
            elms[i].style.color=cl[nms[i]];
        }
        for(let i = 0 ; i < elms2.length ; i++){
            nms2[i]+=1;
            if(nms2[i]>360)nms2[i]=0;
            elms2[i].style.transform = "rotateX("+nms2[i]+"deg)";
        }
        for(let i = 0 ; i < elms3.length ; i++){
            nms3[i]+=1;
            if(nms3[i]>360)nms3[i]=0;
            elms3[i].style.transform = "rotateY("+nms3[i]+"deg)";
        }
        for(let i = 0 ; i < elms4.length ; i++){
            nms4[i]+=1;
            if(nms4[i]>360)nms4[i]=0;
            elms4[i].style.transform = "rotateZ("+nms4[i]+"deg)";
        }
    },20);
}


let selectType1 = {
    elms : document.getElementsByName("selectType1") ,
    color : [
        "rgba(255, 0, 0, 0.56)",
        "rgba(238, 255, 0, 0.52)",
        "rgba(0, 255, 72, 0.5)",
        "rgba(0, 0, 0, 0.47)",
        "rgba(0, 255, 229, 0.44)",
        "rgba(0, 255, 229, 0.44)",
        "rgba(255, 255, 255, 0.44)",
        "rgba(0, 46, 185, 0.58)",
        "rgba(0, 255, 8, 0.44)"

    ] ,
    colorrange : 9 ,
}
for(let i = 0 ; i < selectType1.elms.length; i++){
    selectType1.elms[i].addEventListener("click",function(){
        const c = [];
        for(let j = 0 ; j <  6 ; j++){
            c.push(selectType1.color[Math.floor(selectType1.colorrange*Math.random())] );
        }
        selectType1.elms[i].style.background = "linear-gradient(45deg,"+c[0]+","+c[1]+"),linear-gradient(135deg,"+c[2]+","+c[3]+"),linear-gradient(270deg,"+c[4]+","+c[5]+")";
    });
}

let bd2 = {
    elms : document.getElementsByClassName("bd2"),
    color : ["black","yellow"],
    typeFlag : [true,true] ,
}
setInterval(function(){
    for(let i = 0 ; i < bd2.elms.length ; i++){
        if(bd2.typeFlag[i]){
            bd2.elms[i].style.color = bd2.color[1];
            bd2.elms[i].style.background = bd2.color[0];
            bd2.typeFlag[i] = false ;
        }else{
            bd2.elms[i].style.color = bd2.color[0];
            bd2.elms[i].style.background = bd2.color[1];
            bd2.typeFlag[i] = true ;
        }
    }
},500);

// let csElm = document.getElementById("copySpace");
// let reactTest = {
//     AddButton : function(){
        
//     }
// }

// const addFtbl = document.getElementById("addFtbl");

// let addFtblFlag = true ;
// addFtbl.addEventListener("click",function(){

//     if(addFtblFlag){
//         addFtbl.innerText="追加表示を消す";
//         document.getElementById("AddFt").style.display = "block";
//     }else{
//         addFtbl.innerText="追加で表示する";
//         document.getElementById("AddFt").style.display = "none";
//     }
//     addFtblFlag = ! addFtblFlag;

// });
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


let coinH = 10 ;
let slotF = [
    {flag:false,c:0,},
    {flag:false,c:0,},
    {flag:false,c:0,},
];

let mode = false ;
let bt = 1 ;
let url = ["/7.png","/apple.png","/bell.png","/bar.png"];
let betCoinIn = document.getElementById("bet-coin");
let StopButtons = document.getElementsByClassName("stop-btn");
let SlotScreens = document.getElementsByClassName("slot-m");
let StartButton = document.getElementById("start-btn");
let coin = document.getElementById("coin");
for(let i = 0 ; i < 3 ; i ++){
    StopButtons[i].addEventListener("click",function(){
        slotF[i].flag = false ;
        StopButtons[i].style.background = "white";
    });

}

StartButton.addEventListener("click",function(){
    
    if(!mode)for(let i = 0 ; i < 3 ; i ++){
        slotF[i].flag = true ;
        StopButtons[i].style.background = "blue";
    }
    mode = true ;
    coinH -= Number(betCoinIn.value);
    coin.innerText = "coin : "+coinH ;
    bt = Number(betCoinIn.value) ;
});


setInterval(function(){
    for(let i = 0 ; i < 3 ; i ++){
        if(slotF[i].flag){
            SlotScreens[i].src=url[slotF[i].c];
            slotF[i].c++;
            if(slotF[i].c>=4)slotF[i].c = 0;
        }
    }
    if(mode)if(!slotF[0].flag && !slotF[1].flag && !slotF[2].flag){
        mode = false ;
        
        if(slotF[0].c == slotF[1].c)if(slotF[0].c == slotF[2].c){
            coinH += bt * 5 ;
        }
        coin.innerText = "coin : "+coinH ;
    }
},140);


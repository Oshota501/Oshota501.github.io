let coinH = 10 ;
let slotF = [
    {flag:false,c:0,},
    {flag:false,c:0,},
    {flag:false,c:0,},
];

let mode = false ;
let bt = 1 ;
let url = ["/img/7.png","/img/apple.png","/img/bell.png","/img/bar.png"];
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
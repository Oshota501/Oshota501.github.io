const elm = document.getElementById("moku")
const yagi = document.getElementById("yagi")
const body = document.body ;
let rotate = 0;
setInterval(function(){
    
    if(rotate >= 360){
        rotate = 0 ;
    }
    let p = Math.sin(rotate*Math.PI/180)
    elm.style.transform = `rotateY(${rotate}deg) translateY(${-Math.abs(Math.sin(rotate*Math.PI/20)*40)}px)`
    yagi.style.transform = `rotateZ(${rotate*10}deg) scale(${p+1})`
    rotate ++ ;
},20)
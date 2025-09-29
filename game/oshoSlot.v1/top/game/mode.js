document.addEventListener("keydown",function(e){
    if(e.key == "d"){
        document.getElementsByClassName("debug")[0].style.display = "block"
    }
})
document.getElementById("closeBtn_bank").addEventListener("click",function(){
    const elm = document.getElementById("bank") ;
    if(elm.style.display == "block"){
        elm.style.display = "none"
    }else{
        elm.style.display = "block"
    }
})
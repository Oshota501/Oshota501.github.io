class random_number_jsObject{
    constructor(elmName){
        setInterval(function(){
            const elms = document.getElementsByClassName(elmName) ;
            for(let i = 0 ; i < elms.length ; i ++){
                elms[i] .innerHTML = Math.floor(Math.random()*100) ;
            }
        },100); 
    }
}
let random_number = new random_number_jsObject("random_number_jsObject");

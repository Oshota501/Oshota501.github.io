class DataError {
    main = document.getElementById("game-error")
    log = document.getElementById("error-log")
    makeError (code) {
        this.log.innerHTML = code ;
        this.main.style.display = "block" ;
    }
    constructor(){
        
    }
}
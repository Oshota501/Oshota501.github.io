class DataInfomation {
    log_elm = document.getElementsByClassName("info-log")
    updata(){
        for(let i = 0 ; i < this.log_elm.length ; i ++){
            const elm = this.log_elm[i]
            if(this.logs.length -1-i >= 0){
                elm.innerHTML = this.logs[this.logs.length -1-i]
            }
        }
    }
    logs = []
    addLogs(t){
        this.logs.push(t)
        this.updata()
    }
    constructor(){

    }
}
taskbar = (elmName) => {
    const elm = document.getElementById(elmName);
    elm.style.display = "block" ;
}
class DataBank  {
    coin = 0
    bank_coin = document.getElementById("bank-coin")
    coin_all = document.getElementById("bank-all-coin")
    out_money = document.getElementById("bank-out-coin") 
    in_money = document.getElementById("bank-in-coin") 
    value_out = document.getElementById("bank-value-out") 
    value_in = document.getElementById("bank-value-in") 
    exSelector = document.getElementsByClassName("bank-exchange ")
    updata = () => {
        this.bank_coin .innerText = this .coin ;
        this.coin_all .innerText = slot.sumCoin() ;
    }
    mode = (flag) => {
        if(flag){
            
            slot.removeCoins(this.in_money.value)
        }else{
            slot.setCoin(this.out_money.value) ;
        }
    } 
    exchange = () =>{
    }
    constructor(){
        this.bank_coin = 0
        this.out_money.addEventListener("input",()=>{
            this.value_out .innerText = this.out_money.value ;
        })
        this.in_money.addEventListener("input",()=>{
            this.value_in .innerText = this.in_money.value ;

        })
    }
}



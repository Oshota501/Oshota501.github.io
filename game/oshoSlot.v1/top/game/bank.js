class DataBank  {
    coin = 10
    
    out_money = document.getElementById("bank-out-coin") 
    in_money = document.getElementById("bank-in-coin") 
    value_out = document.getElementById("bank-value-out") 
    value_in = document.getElementById("bank-value-in") 
    exSelector = document.getElementById("bank-exchange")
    updata = () => {
        const bank_coin = document.getElementById("bank-coin")
        const coin_all = document.getElementById("bank-all-coin")
        bank_coin.innerHTML = this.coin;
        coin_all.innerHTML = slot.sumCoin() ;
    }
    mode = (flag) => {
        if(flag){
            const a = Number(this.in_money.value)
            slot.removeCoins(a)
            this.coin += a ;
        }else{
            const a = Number(this.out_money.value);
            if(this.coin >= a){
                slot.setCoin(a) ;
                this.coin -= a ;
            }
        }
        this.updata()
    } 
    exchange = () =>{
        switch(this.exSelector.value){
        case "10_1*10" :
            if(slot.removeCoin(10)){
                slot.setCoin(4)
                slot.setCoin(4)
                slot.setCoin(2)
            }
            break;
        case "10_5*2" :
            if(slot.removeCoin(10)){
                slot.setCoin(5)
                slot.setCoin(5)
            }
            break;
        case "10_5+1*5" :
            if(slot.removeCoin(10)){
                slot.setCoin(5)
                slot.setCoin(4)
                slot.setCoin(1)
            }
            break;
        case "1*10_10" :
            if(slot.getCoinSum().coin._1 >= 10){
                for(let i = 0 ; i < 10 ; i ++)slot.removeCoin(1) ;
                slot.setCoin(10)
            }
            break;
        case "5*2_10" :
            if(slot.getCoinSum().coin._5 >= 2){
                slot.removeCoin(5) ;
                slot.removeCoin(5) ;
                slot.setCoin(10)
            }
            break;
        default :
            console.log("value値が読み取れなかったため処理をスキップしました。")
            break ;
        }
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



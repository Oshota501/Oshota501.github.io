// アイテム
// 実質リアクトの書き方をパクるという...

class DataShop {
    elm = document.getElementById("shop-data")
    shopItems = []
    isBought = [false,false,false]
    new_shop_cost = 1
    costUpdata(){
        this.new_shop_cost += this.new_shop_cost
    }
    updata (){
        let str = `
        <table>
            <thead>
                <tr style="text-align:center;font-size:2rem;">
                    <th style="width:18rem;">商品1</th>
                    <th style="width:18rem;">商品2</th>
                    <th style="width:18rem;">商品3</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                ${(()=>{
                    if(this.isBought[0]){
                        return '<td style="border-right:1px solid;padding:1rem;height:35rem;">売却済み<rd>'
                    }else{
                        return `<td style="border-right:1px solid;padding:1rem;height:35rem;">
                            <img style="width:6rem" src="${this.shopItems[0].textureURL}"><br>
                            ${this.shopItems[0].name}<br>
                            ${this.shopItems[0].explain}
                            <hr>
                            レア度：${this.shopItems[0].lvl}
                            <hr>
                            価格：${this.shopItems[0].price} 円
                            <hr>
                            <button style="font-size:1.3rem" onclick="shop.buy(0)">購入する</button>
                        </td>`
                    }
                })()}
                ${(()=>{
                    if(this.isBought[1]){
                        return '<td style="border-right:1px solid;padding:1rem;height:35rem;">売却済み<rd>'
                    }else{
                        return `<td style="border-right:1px solid;padding:1rem;height:35rem;">
                            <img style="width:6rem" src="${this.shopItems[1].textureURL}"><br>
                            ${this.shopItems[1].name}<br>
                            ${this.shopItems[1].explain}
                            <hr>
                            レア度：${this.shopItems[1].lvl}
                            <hr>
                            価格：${this.shopItems[1].price} 円
                            <hr>
                            <button style="font-size:1.3rem" onclick="shop.buy(1)">購入する</button>
                        </td>`
                    }
                })()}
                ${(()=>{
                    if(this.isBought[2]){
                        return '<td style="border-right:1px solid;padding:1rem;height:35rem;">売却済み<rd>'
                    }else{
                        return `<td style="border-right:1px solid;padding:1rem;height:35rem;">
                            <img style="width:6rem" src="${this.shopItems[2].textureURL}"><br>
                            ${this.shopItems[2].name}<br>
                            ${this.shopItems[2].explain}
                            <hr>
                            レア度：${this.shopItems[2].lvl}
                            <hr>
                            価格：${this.shopItems[2].price} 円
                            <hr>
                            <button style="font-size:1.3rem" onclick="shop.buy(2)">購入する</button>
                        </td>`
                    }
                })()}
                </tr>
            </tbody>
        </table>
        <button style="text-align:center;font-size:2rem;" onclick="shop.newShop()">更新 ${this.new_shop_cost}円</button>
        <button style="text-align:center;font-size:2rem;" onclick="document.getElementById('shop').style.display='none';">閉じる</button>
        `
        this.elm.innerHTML = str
    }
    buy(i){
        this.isBought[i] = true ;
        this.updata()
    }
    newShop(){
        if(slot.removeCoins(this.new_shop_cost)){
            this.isBought = [false,false,false] ;
            this.costUpdata()
            this.shopItems = [
                this.getItem(),
                this.getItem(),
                this.getItem(),
            ]
            this.updata()
        }
        
    }
    itemApplicable (item){
        slot.changeFortune(
            item.opt.name,
            item.opt.turn,
            item.opt.fixed,
            item.opt.add
        );
    }
    /*
    {
        price : 3 ,
        name : "nomal apple" ,
        lvl : 1 ,
        weight : 50 ,
        explain : "1ターンの間 リンゴが出る確率が少し上がる。",
        textureURL : null ,
        opt : [{
            add : 3 ,
            name : "apple" ,
            fixed : false ,
            turn : 1 ,
        }] 
    }
        */
    allItems = []
    addItem = (item) =>{
        this.allItems.push(item);
    }
    setItems = (items) => {
        for(let i = 0 ; i < items.length ; i ++){
            const elm = items[i]
            this.addItem(elm);
        }
        this.shopItems = [
            this.getItem(),
            this.getItem(),
            this.getItem(),
        ]
        this.updata()
    }
    getItem () {
        let s =  0 ;
        for(let i = 0 ; i < this.allItems.length ; i ++){
            const elm = this.allItems [i] ;
            s += elm.weight ;
        }
        const r = Math.floor(Math.random()*s)
        s =  0 ;
        for(let i = 0 ; i < this.allItems.length ; i ++){
            const elm = this.allItems [i] ;
            if(r >= s && r < s+elm.weight){
                return elm
            }
            s += elm.weight
        }
        return 
    }
    constructor(){
    }
}
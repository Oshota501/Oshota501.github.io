class DataScore {
    body = document.getElementById("score-all")
    updata (){
        const ret = Math.floor(slot.slot_object.length/4);
        const s = (function(){
            let count = 0 
            slot.slot_object.forEach(elm=>{
                count += elm.weight ;
            })
            return count
        })()
        // テーブル開始
        let str = '<table style="width: 100%; border-collapse: collapse;"><tbody>'
        
        for(let i = 0 ; i < ret ; i ++){
            // 各行を作成
            str += '<tr>';
            for(let j = 0 ; j < 4 ; j ++){
                if(slot.slot_object [i*4 + j]==undefined) {
                    // 空のセルを追加
                    str += '<td style="padding: 1rem; text-align: center; vertical-align: top;"></td>';
                } else {
                    const elm = slot.slot_object [i*4 + j] ;
                    str += `<td style="border:1px solid;padding: 1rem; text-align: center; vertical-align: top;">
                        <div>
                            <span class="style-title">${elm.name}</span><br>
                            <div style="height:3rem; margin-top: 0.5rem;">
                                <img style="height:100%;" src="${elm.img}"/>
                            </div>
                            <div>
                            出現確率: ${Math.round((elm.weight/s)*10000)/100}%<br>
                            ${elm.win_p}
                            </div>
                        </div>
                    </td>`
                }
            }
            str += '</tr>';
        }
        
        // テーブル終了
        str += '</tbody></table>';
        this.body.innerHTML = str
    }   
    constructor(){
    }
}
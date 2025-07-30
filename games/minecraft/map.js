function draw(cnvname,cityJsons,output){
    elm = document.getElementById(cnvname);
    co = cityJsons //現状特に変更なし
    /*
    駅等のノードを定義する
    {
        type : "st_node" ,
        name : "表示名" ,
        pos : [x,y] ,
        id : 0 ,
        color : "white"
    }
    特に意味のないノードを定義する
    {
        type : "nm_node" ,
        pos : [x,y] ,
        name : "表示名" ,
        id : 0 ,
    }
    線を接続する
    {
        type : "connect" ,
        id_to_id : [ 0 , 1 , 2 , 3 ] ,
        name : "表示名" ,
        color : "blue" ,
    }
    */
    window.onclick = function(e){
        mouse.x = (e.clientX - elm.getBoundingClientRect().left);
        mouse.y = (e.clientY - elm.getBoundingClientRect().top);
    }
    let mouse = {
        x : 0 ,
        y : 0 ,
    }
    let hits = [] ;
    let ctx = elm.getContext("2d");
    for(let i = 0 ; i < co.length ; i ++){
        ctx.strokeStyle = co[i].color ;
        if(co[i].type == "connect"){
            let p = undefined ;
            for(let j = 0 ; j < co[i].id_to_id.length ; j++){
                let ap = co.find(item => item.id === co[i].id_to_id[j]);
                if(j != 0){
                    ctx.beginPath();
                    dx = ap.pos[0]-p.pos[0];
                    dy = ap.pos[1]-p.pos[1];
                    ctx.lineWidth = 5 ;
                    ctx.moveTo(p.pos[0],p.pos[1]);
                    ctx.lineTo(ap.pos[0],ap.pos[1]);
                    ctx.stroke();
                    hits.push({
                        name : co[i].name ,
                        type : "路線" ,
                        hit : [p.pos[0]-3,p.pos[1]-3,ap.pos[0]+3,ap.pos[1]+3] ,
                    });
                }
                p = co.find(item => item.id === co[i].id_to_id[j])
            }
        }
    }
    for(let i = 0 ; i < co.length ; i ++){
        if(co[i].type == "st_node"){
            ctx.beginPath();
            ctx.lineWidth = 1 ;
            ctx.font = "12px serif";
            ctx.strokeStyle = "black" ;
            ctx.fillStyle = "black" ;
            // ctx.fillText(co[i].name, co[i].pos[0]+7,co[i].pos[1]+3,36);
            ctx.fillStyle = co[i].color ;
            ctx.fillRect(co[i].pos[0]-5,co[i].pos[1]-5,10,10);
            ctx.strokeRect (co[i].pos[0]-5,co[i].pos[1]-5,10,10);
            hits.push({
                name : co[i].name ,
                type : "駅" ,
                hit : [co[i].pos[0]-5 ,co[i].pos[1]-5 ,co[i].pos[0]+5 ,co[i].pos[1]+5] ,
                pos : co[i].pos 
            })
        }
        if(co[i].type == "nm_node"){
            ctx.beginPath();
            ctx.fillStyle = "black" ;
            ctx.fillText(co[i].name, co[i].pos[0]+7,co[i].pos[1]+3,36);
        }
    }
    elm.addEventListener("click",function(){
        function sort_hit(hitobj){
            //右下〜左上 ＝ ＞ 左上〜右下
            if(hitobj[0]>hitobj[2] && hitobj[1]>hitobj[3]){
                return [hitobj[2]+3,hitobj[3]+3,hitobj[0]-3,hitobj[1]-3] ;
            //右上〜左下 ＝ ＞ 左上〜右下
            }else if(hitobj[0]>hitobj[2] && hitobj[1]<hitobj[3]){
                return [hitobj[2]+3,hitobj[1]-3,hitobj[0]-3,hitobj[3]+3] ;
            //左下〜右上 ＝ ＞ 左上〜右下
            }else if(hitobj[0]<hitobj[2] && hitobj[1]>hitobj[3]){
                return [hitobj[0]+3,hitobj[3]-3,hitobj[2]-3,hitobj[1]+3] ;
            //左上〜右下
            }else {
                return [hitobj[0]-3,hitobj[1]-3,hitobj[2]+3,hitobj[3]+3] ;
            }
        }
        for(let i = 0 ; i < hits.length ; i++){
            let hit = sort_hit(hits[i].hit);
            if(hit[0] < mouse.x && hit[1] < mouse.y && hit[2] > mouse.x && hit[3] > mouse.y ){
                document.getElementById(output).innerText = `${hits[i].name} : ${hits[i].type} : position ${hits[i].pos}` ;
            }
        }
    });
}
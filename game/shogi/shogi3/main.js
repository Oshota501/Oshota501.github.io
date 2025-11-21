document.writeIn
//固定値
let FixedValue = {
    size : 60 ,
    komaShape : [[6,6],[54,6],[48,48],[30,54],[12,48]] ,
    KanjiNum : ["一","二","三","四","五","六","七","八","九"] ,
    ZenkakuNum : ["１","２","３","４","５","６","７","８","９"] ,
}
//処理ようデータ
let ctx = document.getElementById("main").getContext("2d");
let cnv = document.getElementById("main");
let koma = [] ;
let owner = true ;
let select = {
    type : "No" ,
    n : 0 ,
} ;
let kifu = [] ;
let mochigoma = {
    //["歩","香","桂","銀","金","角","飛","王","玉"]
    i : ["歩","香","桂","銀","金","角","飛","王","玉"] ,
    sente :[0,0,0,0,0,0,0,0,0],
    gote :[0,0,0,0,0,0,0,0,0],
}
function koma_ability(k,s){
    let x = MF.sb(s)[0];
    let y = MF.sb(s)[1]
    let prK =  function(a,dx,dy){
            let C = function(c){
                let s1 = 0 ;
                if(k[s].ow){
                    if(x+dx+c*dx <= 8 && x+dx+c*dx >= 0 && y+c*dy+dy <= 8 && y+c*dy+dy >= 0 ){
                        s1 = MF.bs( x+dx+c*dx , y+c*dy+dy );
                    }else{
                        s1 = -1 ;
                    }
                }else{
                    if(x-dx-c*dx <= 8 && x-dx-c*dx >= 0 && y-c*dy-dy <= 8 && y-c*dy-dy >= 0 ){
                        s1 = MF.bs( x-dx-c*dx , y-c*dy-dy );
                    }else{
                        s1 = -1 ;
                    }
                }
                return s1 >= 0 && s1 <= 80 ;
            }
            if(k[s].ow){
                for(let i = 0 ; C(i) ; i++){
                    if (k[MF.bs(x+i*dx+dx,y+i*dy+dy)].type != "" && (k[MF.bs(x+i*dx+dx,y+i*dy+dy)].ow == k[s].ow)){
                        break;
                    }else if(k[MF.bs(x+i*dx+dx,y+i*dy+dy)].type != "" ){
                        a.push([i*dx+dx,i*dy+dy])
                        break;
                    }
                    a.push([i*dx+dx,i*dy+dy])
                }
            }else{
                for(let i = 0 ; C(i) ; i++){
                    if (k[MF.bs(x-i*dx-dx,y-i*dy-dy)].type != "" && (k[MF.bs(x-i*dx-dx,y-i*dy-dy)].ow == k[s].ow)){
                        break;
                    }else if(k[MF.bs(x-i*dx-dx,y-i*dy-dy)].type != "" ){
                        a.push([i*dx+dx,i*dy+dy])
                        break;
                    }
                    a.push([i*dx+dx,i*dy+dy])
                }
            }
            return a ;
    }
    let AddEl = function(d,arr){
        for(let i = 0 ; i < arr.length ; i++){
            d.push(arr[i]) ;
        }
        return d ;
    }
    let CanMoveToB = [] ;
    dete = [
        {name:"金",Ps:[[0,1],[1,1],[-1,1],[1,0],[-1,0],[0,-1]],},
        {name:"歩",Ps:[[0,1],],},
        {name:"香",Ps: prK([],0,1) ,},
        {name:"桂",Ps:[[1,2],[-1,2]],},
        {name:"銀",Ps:[[1,1],[0,1],[-1,1],[-1,-1],[1,-1]],},
        {name:"王",Ps:[[0,1],[1,1],[-1,1],[1,0],[-1,0],[0,-1],[-1,-1],[1,-1]],},
        {name:"玉",Ps:[[0,1],[1,1],[-1,1],[1,0],[-1,0],[0,-1],[-1,-1],[1,-1]],},
        {name:"角",Ps:prK(prK(prK(prK([],1,1),-1,1),1,-1),-1,-1),},
        {name:"飛",Ps:prK(prK(prK(prK([],1,0),-1,0),0,-1),0,1),},
        {name:"馬",Ps:AddEl(prK(prK(prK(prK([],1,1),-1,1),1,-1),-1,-1) , [[1,0],[-1,0],[0,-1],[0,1]]),},
        {name:"龍",Ps:AddEl(prK(prK(prK(prK([],1,0),-1,0),0,-1),0,1),[[1,1],[-1,1],[1,-1],[-1,-1]]),},
        {name:"成銀",Ps:[[0,1],[1,1],[-1,1],[1,0],[-1,0],[0,-1]],},
        {name:"成桂",Ps:[[0,1],[1,1],[-1,1],[1,0],[-1,0],[0,-1]],},
        {name:"成香",Ps:[[0,1],[1,1],[-1,1],[1,0],[-1,0],[0,-1]],},
        {name:"と",Ps:[[0,1],[1,1],[-1,1],[1,0],[-1,0],[0,-1]],},
               
    ];
    for(let i = 0 ; i < dete.length ; i ++){
        if(k[s].type == dete[i].name ){
            if(k[s].ow){
                for(let j = 0 ; j < dete[i].Ps.length ; j++ ){
                    if(x + dete[i].Ps[j][0]<9 && y + dete[i].Ps[j][1] < 9 && x + dete[i].Ps[j][0] >= 0 && y + dete[i].Ps[j][1] >= 0 ){
                        if(koma[MF.bs(x + dete[i].Ps[j][0], y + dete[i].Ps[j][1])].type =="" || (k[s].ow && !k[MF.bs(x + dete[i].Ps[j][0], y + dete[i].Ps[j][1])].ow))CanMoveToB.push([x + dete[i].Ps[j][0], y + dete[i].Ps[j][1]])
                    }
                }
            }else{
                for(let j = 0 ; j < dete[i].Ps.length ; j++ ){
                    if(x - dete[i].Ps[j][0] <9 && y - dete[i].Ps[j][1] < 9 && x - dete[i].Ps[j][0] >= 0 && y - dete[i].Ps[j][1] >= 0 ){
                        if(koma[MF.bs(x - dete[i].Ps[j][0], y - dete[i].Ps[j][1])].type =="" || (!k[s].ow && k[MF.bs(x - dete[i].Ps[j][0], y - dete[i].Ps[j][1])].ow))CanMoveToB.push([x - dete[i].Ps[j][0], y - dete[i].Ps[j][1]])
                    } 
                }
            }
        }
    }
    return CanMoveToB ;
};


//描画
let DrawingFunction = {
    clear : function(){
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,900,660);
    },
    grid : function(){
        ctx.beginPath();
        for(let x = 0 ; x < 10 ; x ++ ){
            ctx.moveTo(180+60*x,60)
            ctx.lineTo(180+60*x,600)
        }
        for(let y = 0 ; y < 10 ; y ++ ){
            ctx.moveTo(180,60+60*y)
            ctx.lineTo(720,60+60*y)
        }
        ctx.strokeStyle = "black";
        ctx.stroke();
    },
    NumTxt : function(n,x,y,ow){
        ctx.fillStyle = "black";
        if(ow){
            ctx.font = "30px serif";
            x = x*60+180 +60 ;
            y = y*60+60 +60 ;
            ctx.fillText("x"+n,x-51,y-15);
        }else{
            ctx.font = "30px serif";
            x = x*60+180 ;
            y = y*60+60 ;
            ctx.rotate(Math.PI);
            ctx.fillText("x"+n,(x+51)*-1,(y+15)*-1);
            ctx.rotate(-Math.PI);
        }
    },
    selBanjo : function(x,y){
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.strokeRect((x+3)*60,(y+1)*60,60,60)
    },
    turn : function(){
        ctx.beginPath();
        ctx.font = "45px serif";
        if(owner){
            ctx.fillStyle = "black";
        }else{
            ctx.fillStyle = "red";
        }
        ctx.fillText("後手",30,120)
        ctx.rotate(Math.PI);
        if(!owner){
            ctx.fillStyle = "black";
        }else{
            ctx.fillStyle = "red";
        }
        ctx.fillText("先手",-870,-540);
        ctx.rotate(-Math.PI);
    } ,
    k : function(x,y,ow,type,n){
        if(n){
            ctx.strokeStyle = "red" ;
        }else{
            ctx.strokeStyle = "black" ;
        }
        ctx.beginPath();
        if(!ow && type.length == 1){
            x = x*60+180 +60 ;
            y = y*60+60 +60 ;
            ctx.font = "30px serif";
            ctx.strokeText(type,x-45,y-15);
        }else if( ow && type.length == 1){
            x = x*60+180 ;
            y = y*60+60 ;
            ctx.font = "30px serif";
            ctx.rotate(Math.PI);
            ctx.strokeText(type,(x+45)*-1,(y+15)*-1);
            ctx.rotate(-Math.PI);
        }else if(!ow && type.length == 2){
            x = x*60+180 +60 ;
            y = y*60+60 +60 ;
            ctx.font = "20px serif";
            ctx.strokeText(type[0],x-40,y-12);
            ctx.strokeText(type[1],x-40,y-32);
        }else if(ow && type.length == 2){
            x = x*60+180 ;
            y = y*60+60 ;
            ctx.font = "20px serif";
            ctx.rotate(Math.PI);
            ctx.strokeText(type[0],(x+40)*-1,(y+12)*-1);
            ctx.strokeText(type[1],(x+40)*-1,(y+32)*-1);
            ctx.rotate(-Math.PI);
        }
        ctx.strokeStyle = "black" ;
        let a = FixedValue.komaShape ;
        ctx.beginPath();
        if(!ow){
            for(let i = 0 ; i < a.length ; i ++){
                let b = a[i]
                if(i==0){
                    ctx.moveTo(x-b[0],y-b[1]);
                }else{
                    ctx.lineTo(x-b[0],y-b[1]);
                }
            }
            ctx.lineTo(x-a[0][0],y-a[0][1]);
            ctx.stroke();
        }
        if(ow){
            for(let i = 0 ; i < a.length ; i ++){
                let b = a[i]
                if(i==0){
                    ctx.moveTo(x+b[0],y+b[1]);
                }else{
                    ctx.lineTo(x+b[0],y+b[1]);
                }
            }
            ctx.lineTo(x+a[0][0],y+a[0][1]);
            ctx.stroke();
        }
    }
    
}

//カスタム
document.getElementsByClassName("input1")[0].addEventListener("click",function(e){
    koma[select.n].type = document.getElementsByClassName("input1")[1].value ;
    koma[select.n].ow = owner ;
    StateFunction.upFrame();
});
document.getElementsByClassName("input1")[2].addEventListener("click",function(e){
    owner = true ;
    StateFunction.upFrame();
});
document.getElementsByClassName("input1")[3].addEventListener("click",function(e){
    owner = false ;
    StateFunction.upFrame();
});
document.getElementsByClassName("input1")[4].addEventListener("click",function(e){
    koma[select.n].type = "" ;
    StateFunction.upFrame();
});


document.getElementsByClassName("input2")[0].addEventListener("click",function(e){
    for(let i = 0 ; i < mochigoma.i.length ; i ++){
        if(mochigoma.i[i] == document.getElementsByClassName("input2")[2].value ){
            mochigoma.sente[i] ++ ;
        }
    }
    StateFunction.upFrame();
});
document.getElementsByClassName("input2")[1].addEventListener("click",function(e){
    for(let i = 0 ; i < mochigoma.i.length ; i ++){
        if(mochigoma.i[i] == document.getElementsByClassName("input2")[2].value ){
            mochigoma.gote[i] ++ ;
        }
    }
    StateFunction.upFrame();
});
document.getElementsByClassName("input2")[3].addEventListener("click",function(e){
    for(let i = 0 ; i < mochigoma.i.length ; i ++){
        mochigoma.sente[i] = 0 ;
        mochigoma.gote[i] = 0 ;
    }
    StateFunction.upFrame();
});

document.getElementsByClassName("input3")[0].addEventListener("click",function(e){
    StateFunction.showKoma(koma);
});
document.getElementsByClassName("input3")[1].onclick = (event) => {
	let canvas = cnv;

	let link = document.createElement("a");
	link.href = canvas.toDataURL("image/png");
	link.download = "盤面.png";
	link.click();
}
document.getElementsByClassName("input4")[1].addEventListener("click",function(e){
    let dk = "" ;
    dk ="";
    dk +=  "# ---- 棋譜ファイル ----";
    dk += "\n棋戦：\n開始日時：\n終了日時：\n先手：\n後手：\n手合割：平手\n手数----指手---------消費時間--"
    for(let i = 1 ; i < kifu.length+1 ; i ++){
        if(i < 10 ){
            dk += "\n   " +i;
        }else if(i < 100 ){
            dk += "\n  " +i;
        }else if(i < 1000 ){
            dk += "\n " +i;
        }else{
            dk += "\n" +i;
        }
        dk += " " ;
        let x = MF.sb(kifu[i-1].a)[0];
        let y = 8 - MF.sb(kifu[i-1].a)[1] ;
        dk += FixedValue.ZenkakuNum[x] + FixedValue.KanjiNum[y] + kifu[i-1].type ;
        if(kifu[i-1].b == -1){
            dk += "打     ( 0:00/00:00:00)" ;
        }else if(kifu[i-1].n){
            x = MF.sb(kifu[i-1].b)[0] +1 ;
            y = 9 - MF.sb(kifu[i-1].b)[1] ;
            dk += "成("+x+y+")" ;
            dk += " ( 0:00/00:00:00)" ;
        }else if(kifu[i-1].type.length == 2){
            x = MF.sb(kifu[i-1].b)[0] +1 ;
            y = 9 - MF.sb(kifu[i-1].b)[1] ;
            dk += "("+x+y+")" ;
            dk += " ( 0:00/00:00:00)" ;
        }else{
            x = MF.sb(kifu[i-1].b)[0] +1 ;
            y = 9 - MF.sb(kifu[i-1].b)[1] ;
            dk += "("+x+y+")" ;
            dk += "   ( 0:00/00:00:00)" ;
        }
    }
    let p = kifu.length+1 ;
        if(kifu.length+1 < 10 ){
            dk += "\n   " +p;
        }else if(kifu.length+1 < 100 ){
            dk += "\n  " +p;
        }else if(kifu.length+1 < 1000 ){
            dk += "\n " +p;
        }else{
            dk += "\n" +p;
        }
        dk += " 中断         ( 0:00/00:00:00)"
    document.getElementById("log").value = dk ;
});

document.getElementById("yes").addEventListener("click",function(e){
    koma[select.n].type = SystemFunction.NariKoma(koma[select.n].type).t
    document.getElementsByClassName("Nari")[0].style.display = "none";
    kifu[kifu.length-1].n = true ;
    StateFunction.upFrame() ;
});
document.getElementById("no").addEventListener("click",function(e){
    document.getElementsByClassName("Nari")[0].style.display = "none";
});


//システム
//clickEvent
cnv.addEventListener("click",function(e){
    let mouse = [0,0];
    mouse[0] = (e.clientX - cnv.getBoundingClientRect().left);
    mouse[1] = (e.clientY - cnv.getBoundingClientRect().top);
    if(mouse[0] > 180 && mouse[0] < 720 && mouse[1] > 60 && mouse[1] < 600){
        let p = [0,0];
        p[0] = Math.floor((mouse[0]-180)/60) ;
        p[1] = Math.floor((mouse[1]-60)/60) ;
        let n = MF.bs(p[0],p[1]) ;

        if(select.type == "No"){
            select.type = "Banjo" ;
        }else if(select.type == "MochiUp" && owner ){
            if(koma[n].type == ""){
                mochigoma.sente[7-select.n] -- ;
                koma[n].type = mochigoma.i[7-select.n] ;
                koma[n].ow = owner ;
                owner = !owner ;
            }
            select.type = "No" ;
            kifu.push({b:-1,a:n,type:mochigoma.i[7-select.n],n:false,})
        }else if(select.type == "MochiBottom" && !owner ){
            if(koma[n].type == ""){
                mochigoma.gote[select.n] -- ;
                koma[n].type = mochigoma.i[select.n] ;
                koma[n].ow = owner ;
                owner = !owner ;
            }
            select.type = "No" ;
            kifu.push({b:-1,a:n,type:mochigoma.i[select.n],n:false,})
        }else if(select.type == "Banjo" ){
            let ka = koma_ability(koma,select.n);
            for(let i = 0 ; i < ka.length ; i ++){
                if( n == MF.bs(ka[i][0],ka[i][1]) && (koma[select.n].ow == owner)){
                    select.type = "No" ;
                    SystemFunction.MoveKoma(select.n,n);
                    owner = !owner ;
                }
            }

        }
        select.n = n;
        document.getElementsByClassName("set")[0].innerText = MF.sb(select.n) + "(" + select.n + ")";
    }else{
        select.type = "No";
    }
    for(let i = 0 ; i < 7 ; i ++){
        if(mouse[0] > i*120+60 && mouse[0] < i*120+120 && mouse[1] > 0 && mouse [1] < 60){
            if(mochigoma.sente[i] != 0 && owner){
                select.type = "MochiUp" ;
                select.n = 7-i ;
            }
        }
        if(mouse[0] > i*120+60 && mouse[0] < i*120+120 && mouse[1] > 600 && mouse [1] < 660){
            if(mochigoma.gote[i] != 0 && !owner){
                select.type = "MochiBottom" ;
                select.n = i ;
            }
        }
    }
    StateFunction.upFrame();
});
let SystemFunction = {
    SystemType : 0 ,
    MoveKoma : function(s1,s2){
        let savek = {
            type : koma[s1].type ,
            ow : koma[s1].ow ,
        }
        if((koma[s1].ow && s2 >= 54 && s2 <= 80 )||(koma[s1].ow && s1 >= 54 && s1 <= 80)){
            if(SystemFunction.NariKoma(koma[s1].type).nari){
                document.getElementsByClassName("Nari")[0].style.display = "block";
            }
        }else if((!koma[s1].ow && s2 >= 0 && s2 <= 26)||(!koma[s1].ow && s1 >= 0 && s1 <= 26)){
            if(SystemFunction.NariKoma(koma[s1].type).nari){
                document.getElementsByClassName("Nari")[0].style.display = "block";
            }
        }
        koma[s1].type = "" ;
        for(let i = 0 ; i < mochigoma.i.length ; i ++){
            if(koma[s2].type == mochigoma.i[i]){
                if(owner){
                    mochigoma.sente[i] ++;
                }else{
                    mochigoma.gote[i] ++;
                }
            }
            if(koma[s2].type == SystemFunction.NariKoma(mochigoma.i[i]).t && koma[s2].type != ""){
                if(owner){
                    mochigoma.sente[i] ++;
                }else{
                    mochigoma.gote[i] ++;
                }
            }
        }
        koma[s2].type = savek.type ;
        koma[s2].ow = savek.ow ;
        kifu.push({b:s1,a:s2,type:koma[s2].type,n:false,})
        StateFunction.upFrame();
    },
    NariKoma : function(type){
        let same = [
            ["歩","と"],
            ["銀","成銀"],
            ["桂","成桂"],
            ["香","成香"],
            ["角","馬"],
            ["飛","龍"],
        ]
        for(let i = 0 ; i < same.length ; i ++){
            if(same[i][0] == type){
                return {
                    t : same[i][1] ,
                    nari : true ,
                    d : false ,
                }
            }
            if(same[i][1] == type){
                return {
                    t : same[i][0] ,
                    nari : false ,
                    d : true ,
                }
            }
        }
        return {
            t : "" ,
            nari : false ,
            d : false ,
        } ;
    },
    
}
//計算用関数
let MF = {
    bs : function(x,y){
        //それぞれ入力してください
        //ベクトル（xy)　→ スカラー(p)
        return y*9 + x ;
    },
    sb : function(p){
        //スカラー（p）→　ベクトル(xy)
        //配列として出力します。
        return [ p % 9 , Math.floor(p/9) ] ;
    },
}

//導入
window.onload = function(){
    StateFunction.start();
}
let StateFunction = {
    upFrame : function(){
        DrawingFunction.clear();
        DrawingFunction.grid();
        for(let i = 0 ; i < koma.length ; i++){
            if(koma[i].type != ""){
                DrawingFunction.k( MF.sb(i)[0], MF.sb(i)[1], koma[i].ow ,koma[i].type ,SystemFunction.NariKoma(koma[i].type).d);
            }

         }
         let m = ["歩","香","桂","銀","金","角","飛"]
         for(let i = 0 ; i < m.length ; i++){
            if(mochigoma.gote[i] != 0 ){
                DrawingFunction.k(i*2 -2,9,false,m[i],false);
                DrawingFunction.NumTxt(mochigoma.gote[i],i*2 -1,9,true);
            }
         }
         for(let i = 0 ; i < m.length ; i++){
            if(mochigoma.sente[i] !=0 ){
                DrawingFunction.k(i*2 -2,-1,true,m[i],false);
                DrawingFunction.NumTxt(mochigoma.sente[i],i*2 -3,-1,false);
            }
         }
         if(select.type == "Banjo"){
            DrawingFunction.selBanjo(MF.sb(select.n)[0],MF.sb(select.n)[1]);
            if(koma[select.n].type != "" && (koma[select.n].ow == owner)){
                let a = koma_ability(koma,select.n);
                for(let i = 0 ; i < a.length ; i ++){
                    DrawingFunction.selBanjo(a[i][0],a[i][1])
                }
            }
         }
         if(select.type == "MochiUp"){
            DrawingFunction.selBanjo(-2+(7-select.n)*2,-1);
         }
         if(select.type == "MochiBottom"){
            DrawingFunction.selBanjo(-2+select.n*2,9);
         }
        DrawingFunction.turn();
    },
    showKoma : function(k){
        document.getElementById("log").value = "[" ;
        for(let i = 0 ; i < k.length ; i ++){
            document.getElementById("log").value += '{type:"' + k[i].type + '",ow:' +k[i].ow+',},' ;
        }
        document.getElementById("log").value += "];" ;
    } ,
    start : function(){
        koma = [{type:"香",ow:true,},{type:"桂",ow:true,},{type:"銀",ow:true,},{type:"金",ow:true,},{type:"玉",ow:true,},{type:"金",ow:true,},{type:"銀",ow:true,},{type:"桂",ow:true,},{type:"香",ow:true,},{type:"",ow:false,},{type:"飛",ow:true,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"角",ow:true,},{type:"",ow:false,},{type:"歩",ow:true,},{type:"歩",ow:true,},{type:"歩",ow:true,},{type:"歩",ow:true,},{type:"歩",ow:true,},{type:"歩",ow:true,},{type:"歩",ow:true,},{type:"歩",ow:true,},{type:"歩",ow:true,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"歩",ow:false,},{type:"歩",ow:false,},{type:"歩",ow:false,},{type:"歩",ow:false,},{type:"歩",ow:false,},{type:"歩",ow:false,},{type:"歩",ow:false,},{type:"歩",ow:false,},{type:"歩",ow:false,},{type:"",ow:false,},{type:"角",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"",ow:false,},{type:"飛",ow:false,},{type:"",ow:false,},{type:"香",ow:false,},{type:"桂",ow:false,},{type:"銀",ow:false,},{type:"金",ow:false,},{type:"王",ow:false,},{type:"金",ow:false,},{type:"銀",ow:false,},{type:"桂",ow:false,},{type:"香",ow:false,},];
        StateFunction.upFrame();
        DrawingFunction.turn();
        return koma ;
    } ,

}






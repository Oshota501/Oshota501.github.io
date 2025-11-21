

//初期設定
//固定値
let kif = document.getElementById("kif") ;
let cnv = document.getElementById("cv");
let d = {
	mw : 9 ,
	mh : 9 ,
	mS : 45 ,
	bgColor : "#fff7ba" ,
	selectColor : "red" ,
	subSelectColor : "#ffe8b3" ,
	nariColor : "red" ,
	nomalColor : "black" ,
	komaColor : "black" ,
	komaBGColor : "#fff7ba" ,
}
//固定値変更
document.getElementsByClassName("input")[1].addEventListener("input",function(e){
	d.mS = Number(document.getElementsByClassName("input")[1].value) ;
});
document.getElementsByClassName("colorChange")[0].addEventListener("input",function(e){
	d.bgColor = document.getElementsByClassName("colorChange")[0].value;
});
document.getElementsByClassName("colorChange")[1].addEventListener("input",function(e){
	d.nariColor = document.getElementsByClassName("colorChange")[1].value;
});
document.getElementsByClassName("colorChange")[2].addEventListener("input",function(e){
	d.nomalColor = document.getElementsByClassName("colorChange")[2].value;
});
document.getElementsByClassName("colorChange")[3].addEventListener("input",function(e){
	d.komaBGColor = document.getElementsByClassName("colorChange")[3].value;
});
document.getElementsByClassName("colorChange")[4].addEventListener("input",function(e){
	d.komaColor = document.getElementsByClassName("colorChange")[4].value;
});
document.getElementsByClassName("colorChange")[5].addEventListener("input",function(e){
	d.selectColor = document.getElementsByClassName("colorChange")[5].value;
});
document.getElementsByClassName("colorChange")[6].addEventListener("input",function(e){
	d.subSelectColor = document.getElementsByClassName("colorChange")[6].value;
});

//変数
let Having = {
	s : [] ,
	f : [] ,
};
let Nsf = true ;
let Nselect = {
	sf : true ,
	v : "No" ,
};
let mode = "NS" ;
let koma = undefined ;
let selectB = 0 ;
let subSelectP = [] ;

//スタート
let Start = function(){
	Having.f = [] ;
	Having.s = [] ;
	let name1 = document.getElementsByClassName("PlayerName")[0].value;
	let name2 = document.getElementsByClassName("PlayerName")[1].value;
	kif.value += "手合割：平手\n先手："+name1+"\n後手："+name2;
	function EmptyKomaP(C){
		let arr = [] ;
		for(let i = 0 ; i < d.mw*d.mh ; i ++){
			if(koma[i].v == "No" )arr.push(BeP(i));
		}
		if(Nsf == C ){
			return arr;
		}else{
			return [];
		}
	}
	console.log("start")
	KomaHaichiSetting();
	let elm = document.getElementById("menue");
	elm.style.display = "none" ;
	elm = document.getElementById("maingame");
	elm.style.display = "block" ;

	cnv.width = (d.mw+6) * d.mS ;
	cnv.height = (d.mh+2) * d.mS ;
	FreemReset([]);
	cnv.addEventListener("click",function(e){
		for(let j = 0 ; j < Having.s.length ; j ++){
			let p1 = [d.mw+5-j,0];
			if( mouse[0] > p1[0]*d.mS && mouse[1] > p1[1]*d.mS && mouse[0] < p1[0]*d.mS+d.mS-1 && mouse[1] < p1[1]*d.mS+d.mS-1){
				selectB = -1-j;
				document.getElementsByClassName("ipg")[3].value=-1-j;
				FreemReset(EmptyKomaP(false));
				subSelectP = EmptyKomaP(false) ;
				Touch(-1-j);
			}
		}
		for(let k = 0 ; k < Having.f.length ; k ++){
			let p2 = [k,d.mh+1];
			if( mouse[0] > p2[0]*d.mS && mouse[1] > p2[1]*d.mS && mouse[0] < p2[0]*d.mS+d.mS-1 && mouse[1] < p2[1]*d.mS+d.mS-1){
				selectB = d.mw*d.mh + k;
				document.getElementsByClassName("ipg")[3].value=d.mw*d.mh + k;
				FreemReset(EmptyKomaP(true));
				subSelectP = EmptyKomaP(true);
				Touch(d.mw*d.mh + k);
			}
		}
		let a = true ;
		let i = 0 ;
		while(a){
			let p = BeP(i);
			p[0] += 3 ;
			p[1] += 1 ;
			if( mouse[0] > p[0]*d.mS && mouse[1] > p[1]*d.mS && mouse[0] < p[0]*d.mS+d.mS-1 && mouse[1] < p[1]*d.mS+d.mS-1){
				Touch(i);
				a = false ;
			}
			if(i >= d.mw*d.mh )a = false ;
			i++;
		};
	});
};
//クリックされた
let Touch = function(i){
	function ys(){
		if(i > -1 && i < d.mw*d.mh)subSelectP = KomaAbility(koma[i],BeP(i)) ;
		selectB = i ;
		FreemReset(subSelectP);
		mode = "YS" ;
	}
	document.getElementsByClassName("ipg")[3].value=i;
	if(mode == "NS"){
		ys();
	}else if(mode == "YS" ){
		let m = "NS" ;
		if(subSelectP.length==0){
			ys();
			m = "YS";
		}else{
			for(let j = 0 ; j < subSelectP.length ; j ++){
				if(i == PeB(subSelectP[j])){
					if(selectB > -1 && selectB < d.mw*d.mh){
						MoveKoma(koma[selectB] ,PeB(subSelectP[j]),true);
					}else if(selectB >= d.mw*d.mh){
						MoveKoma({v:Having.f[selectB-d.mw*d.mh],sf:Nsf,} ,PeB(subSelectP[j]),false);
						Having.f.splice(selectB-d.mw*d.mh ,1 );
					}else{ 
						MoveKoma({v:Having.s[-selectB-1],sf:Nsf,} ,PeB(subSelectP[j]),false);
						Having.s.splice(-selectB-1 ,1 );
					}
					ChangeSF(!Nsf);
					FreemReset([]);
					break;
				}else if(j == subSelectP.length-1){
					ys();
					m = "YS";
				}
			}
		}
		mode = m ;
	}
}
window.onload=function(){
	ChangeSF(true);
}

//終了
let elmsRestart = document.getElementsByClassName("restart");
for(let i = 0 ; i < elmsRestart.length ; i ++){
	elmsRestart[i].addEventListener("click",function(e){
		let elm = document.getElementById("menue");
		elm.style.display = "block" ;
		elm = document.getElementById("maingame");
		elm.style.display = "none" ;
		elm = document.getElementById("tsumi");
		elm.style.display = "none" ;
		ChangeSF(true);
	});
}


//入力反映
document.getElementsByClassName("ipg")[1].addEventListener("click",function(e){
	document.getElementsByClassName("ipg")[1].style.background = "red" ;
	document.getElementsByClassName("ipg")[2].style.background = "white" ;
	Nselect.sf = true;
});
document.getElementsByClassName("ipg")[2].addEventListener("click",function(e){
	document.getElementsByClassName("ipg")[2].style.background = "red" ;
	document.getElementsByClassName("ipg")[1].style.background = "white" ;
	Nselect.sf = false;
});
document.getElementsByClassName("ipg")[3].value=0;
document.getElementsByClassName("ipg")[3].addEventListener("input",function(e){
	selectB = document.getElementsByClassName("ipg")[3].value ;
});
document.getElementsByClassName("ipg")[4].addEventListener("click",function(e){
	Nselect.v = document.getElementsByClassName("ipg")[0].value ;
	koma[selectB] = {
		sf : Nselect.sf ,
		v : Nselect.v ,
	} ;
	FreemReset([]);
});
document.getElementsByClassName("ipg")[5].addEventListener("click",function(e){
	ChangeSF(true);
});
document.getElementsByClassName("ipg")[6].addEventListener("click",function(e){
	ChangeSF(false);
});
document.getElementsByClassName("opg")[0].addEventListener("click",function(e){
	let a1 = "[" ;
	for(let i = 0 ; i < koma.length ; i++ ){
		a1 += '{sf:'+koma[i].sf+',v:"'+koma[i].v+'",},' ;
	}
	a1 += "];" ;
	document.getElementsByClassName("opg")[1].innerText = a1 ;
});
document.getElementsByClassName("narimasuka")[0].addEventListener("click",function(e){
	document.getElementById("narimasuka").style.display = "none";
	koma[selectB].v = Nari(koma[selectB].v).v;
	FreemReset([]);
});
document.getElementsByClassName("narimasuka")[1].addEventListener("click",function(e){
	document.getElementById("narimasuka").style.display = "none";
});
document.getElementsByClassName("ipg1")[0].addEventListener("click",function(e){
	let v = document.getElementsByClassName("ipg")[0].value ;
	if(v == "No"){
		Having.f.shift();
	}else{
		Having.f.push(v);
	}
	FreemReset([]);
});
document.getElementsByClassName("ipg1")[1].addEventListener("click",function(e){
	let v = document.getElementsByClassName("ipg")[0].value ;
	if(v == "No"){
		Having.s.shift();
	}else{
		Having.s.push(v);
	}
	FreemReset([]);
});
document.getElementsByClassName("toryo")[0].addEventListener("click",function(e){
		let elmA = document.getElementById("tsumi");
		elmA.style.display = "block";
		let elmAs = document.getElementsByClassName("tsumi");
		if(Nsf){
			elmAs[0].innerText = "投了で後手の勝利"
		}else{
			elmAs[0].innerText = "投了で先手の勝利"
		}
});

//マウス
let mouse = [ 0 , 0 ] ;
window.onmousemove = function(e){
    mouse[0] = (e.clientX - cnv.getBoundingClientRect().left);
    mouse[1] = (e.clientY - cnv.getBoundingClientRect().top);
}

//描画
let OutSideArea = function(p1,p2,c){
	let ctx = cnv.getContext("2d");
	ctx.beginPath();
	ctx.strokeStyle = c ;
	ctx.strokeRect(p1[0],p1[1],p2[0],p2[1]);
}
let InSideArea = function(p1,p2,c){
	let ctx = cnv.getContext("2d");
	ctx.beginPath();
	ctx.fillStyle = c ;
	ctx.fillRect(p1[0],p1[1],p2[0],p2[1]);
}
let TextD = function(p1,text,size,c,sf,type){
	if(type){
		let ctx = cnv.getContext("2d");
		ctx.fillStyle = c ;
		ctx.font = size+"px serif";
		if(sf){
			for(let i = 0 ; i < text.length ; i++){
				ctx.fillText(text[i],p1[0],p1[1]);
				p1[1] += size ;
			}
		}else{
			ctx.rotate(Math.PI);
			p1[0] *= -1 ;
			p1[1] *= -1 ;
			for(let i = 0 ; i < text.length ; i++){
				ctx.fillText(text[i],p1[0]-size,p1[1]);
				p1[1] += size ;
			};
			ctx.rotate(Math.PI);
		}
	}else{
		let ctx = cnv.getContext("2d");
		ctx.fillStyle = c ;
		ctx.font = size+"px serif";
		if(sf){
			ctx.fillText(text,p1[0],p1[1]);
		}else{
			ctx.rotate(Math.PI);
			p1[0] *= -1 ;
			p1[1] *= -1 ;
			ctx.fillText(text,p1[0]-size,p1[1]+size);
			ctx.rotate(Math.PI);
		}
	}
}
let FreemReset = function(cmk){
	InSideArea([0,0],[(d.mw+6) * d.mS,(d.mh+2) * d.mS ],d.bgColor);
	for(let i = 0 ; i < cmk.length ; i ++){
		let p2 = cmk[i];
		InSideArea( [(p2[0]+3)*d.mS,(p2[1]+1)*d.mS], [ d.mS-1, d.mS-1] , d.subSelectColor);
	}
	for(let i = 0 ; i < d.mw*d.mh ; i ++){
		let p1 = BeP(i);
		if(i == selectB){
			OutSideArea([(p1[0]+3)*d.mS,(p1[1]+1)*d.mS],[ d.mS-1, d.mS-1] , d.selectColor);
		}else{
			OutSideArea([(p1[0]+3)*d.mS,(p1[1]+1)*d.mS],[ d.mS-1, d.mS-1] , "black");
		}
		if(koma[i].v != "No" ){
			if(Nari(koma[i].v).nari){
				ShowKoma(p1,koma[i].sf ,koma[i].v ,d.nomalColor );
			}else{
				ShowKoma(p1,koma[i].sf ,koma[i].v ,d.nariColor );
			}
		}	
	}
	for(let i = 0 ; i < Having.s.length ; i ++){
		if(selectB == -1-i)c = "red";
		if(Nari(Having.s[i]).nari){
			ShowKoma([d.mw-i+2,-1],false ,Having.s[i] ,d.nomalColor);
		}else{
			ShowKoma([d.mw-i+2,-1],false ,Having.s[i] ,d.nariColor);
		}
	}
	for(let i = 0 ; i < Having.f.length ; i ++){
		if(selectB == d.mh*d.mw+i)c = "red";
		if(Nari(Having.f[i]).nari){
			ShowKoma([i-3,d.mh],true ,Having.f[i],d.nomalColor );
		}else{
			ShowKoma([i-3,d.mh],true ,Having.f[i],d.nariColor );
		}
	}
}
let ShowKoma = function(p1,sf,text,c){
	p1 = [(p1[0]+3)*d.mS,(p1[1]+1)*d.mS]  ;
	let k = function(a){
		if(sf){
			return a;
		}else{
			return d.mS-a ;
		};
	};
	let ctx = cnv.getContext("2d");
	let n = d.mS/12 ;
	ctx.beginPath();
	ctx.moveTo( p1[0] + n*6 , p1[1] + k(n));
	ctx.lineTo( p1[0] + n*10 , p1[1] + k(n*2));
	ctx.lineTo( p1[0] + n*11 , p1[1] + k(n*11));
	ctx.lineTo( p1[0] + n , p1[1] + k(n*11));
	ctx.lineTo( p1[0] + n*2 , p1[1] + k(n*2));
	ctx.lineTo( p1[0] + n*6 , p1[1] + k(n));
	ctx.fillStyle = d.komaBGColor ;
	ctx.fill();
	ctx.strokeStyle = d.komaColor ;
	ctx.stroke();
	p1[1] += d.mS ;
	if(text.length == 1){
		p1[1] -= n*2;
		p1[0] += n*2;
		TextD(p1,text,d.mS*2/3,c,sf,false);
	}else if(text.length == 2){
		p1[1] -= n*6;
		p1[0] += n*4;
		TextD(p1,text,d.mS/3,c,sf,true);
	};
}

//常陽関数
//位置データ変更
let PeB = function(p1){
	return p1[0] + p1[1]*d.mw ;
}
let BeP = function(b1){
	return [b1%d.mw , Math.floor(b1/d.mw)];
}

//駒の能力

function KomaAbility(k,p){
	let ke = (function(){
		if(k.sf){
			return -1;
		}else{
			return 1;
		}
	})();
	function CT(type){
		let p1 = [p[0] , p[1]]
		let arr = [] ;
		let i = 0 ;
		let C = true;
		switch(type){
		case "t":
			while(p1[1]+ke > -1 && p1[1]+ke < d.mh && C){
				if(koma[PeB(p1)].v != "No" && i != 0)break;
				i++;
				p1[1] += ke ;
				C = !(koma[PeB(p1)].v != "No" && koma[PeB(p1)].sf == Nsf);
				arr.push([0,i]);
			}
			break;
		case "b":
			while(p1[1]-ke > -1 && p1[1]-ke < d.mh && C){
				if(koma[PeB(p1)].v != "No" && i != 0)break;
				i--;
				p1[1] -= ke ;
				C = !(koma[PeB(p1)].v != "No" && koma[PeB(p1)].sf == Nsf);
				arr.push([0,i]);
			}
			break;
		case "l":
			while(p1[0]+ke > -1 && p1[0]+ke < d.mh && C){
				if(koma[PeB(p1)].v != "No" && i != 0)break;
				i++;
				p1[0] += ke ;
				C = !(koma[PeB(p1)].v != "No" && koma[PeB(p1)].sf == Nsf);
				arr.push([i,0]);
			}
			break;
		case "r":
			while(p1[0]-ke > -1 && p1[0]-ke < d.mh && C){
				if(koma[PeB(p1)].v != "No" && i != 0)break;
				i--;
				p1[0] -= ke ;
				C = !(koma[PeB(p1)].v != "No" && koma[PeB(p1)].sf == Nsf);
				arr.push([i,0]);
			}
			break;
		case "tl":
			while(p1[0]+ke > -1 && p1[0]+ke < d.mh && p1[1]+ke > -1 && p1[1]+ke < d.mh && C){
				if(koma[PeB(p1)].v != "No" && i != 0)break;
				i++;
				p1[0] += ke ;
				p1[1] += ke ;
				C = !(koma[PeB(p1)].v != "No" && koma[PeB(p1)].sf == Nsf);
				arr.push([i,i]);
			}
			break;
		case "tr":
			while(p1[0]-ke > -1 && p1[0]-ke < d.mh && p1[1]+ke > -1 && p1[1]+ke < d.mh && C){
				if(koma[PeB(p1)].v != "No" && i != 0)break;
				i++;
				p1[0] -= ke ;
				p1[1] += ke ;
				C = !(koma[PeB(p1)].v != "No" && koma[PeB(p1)].sf == Nsf);
				arr.push([-i,i]);
			}
			break;
		case "dl":
			while(p1[0]+ke > -1 && p1[0]+ke < d.mh && p1[1]-ke > -1 && p1[1]-ke < d.mh && C){
				if(koma[PeB(p1)].v != "No" && i != 0)break;
				i++;
				p1[0] += ke ;
				p1[1] -= ke ;
				C = !(koma[PeB(p1)].v != "No" && koma[PeB(p1)].sf == Nsf);
				arr.push([i,-i]);
			}
			break;
		case "dr":
			while(p1[0]-ke > -1 && p1[0]-ke < d.mh && p1[1]-ke > -1 && p1[1]-ke < d.mh && C){
				if(koma[PeB(p1)].v != "No" && i != 0)break;
				i++;
				p1[0] -= ke ;
				p1[1] -= ke ;
				C = !(koma[PeB(p1)].v != "No" && koma[PeB(p1)].sf == Nsf);
				arr.push([-i,-i]);
			}
			break;
		}
		return arr;
	}
	if(k.sf != Nsf)return [] ;
	let n = [] ;
	let c = [] ;
	if(k.v=="歩" || k.v=="歩兵"){
		n = [[0,1]] ;
	}else if(k.v=="香" || k.v=="香車"){
		n = CT("t");
	}else if(k.v=="桂" || k.v=="桂馬"){
		n = [[1,2],[-1,2]];
	}else if(k.v=="銀" || k.v=="銀将"){
		n = [[0,1],[-1,1],[1,1],[-1,-1],[1,-1]];
	}else if(k.v=="金" || k.v=="金将"||k.v=="成香"||k.v=="成桂"||k.v=="と"||k.v=="成銀"){
		n = [[0,1],[-1,1],[1,1],[-1,0],[1,0],[0,-1]];
	}else if(k.v=="王" || k.v=="王将"||k.v=="玉" || k.v=="玉将"){
		n = [[0,1],[-1,1],[1,1],[-1,0],[1,0],[0,-1],[-1,-1],[1,-1]];
	}else if(k.v=="飛" || k.v=="飛車"){
		n = CT("t").concat(CT("b")).concat(CT("l")).concat(CT("r"))
	}else if(k.v=="角" || k.v=="角行"){
		n = CT("tl").concat(CT("tr")).concat(CT("dl")).concat(CT("dr"))
	}else if(k.v=="竜" || k.v=="龍王"){
		n = CT("t").concat(CT("b")).concat(CT("l")).concat(CT("r")).concat([[1,1],[1,-1],[-1,1],[-1,-1]]);
	}else if(k.v=="馬" || k.v=="龍馬"){
		n = CT("tl").concat(CT("tr")).concat(CT("dl")).concat(CT("dr")).concat([[1,0],[-1,0],[0,1],[0,-1]]);
	}
	for(let i = 0 ; i < n.length ; i ++){
		let a = n[i];
		if(p[0] + a[0]*ke < d.mw && p[0] + a[0]*ke > -1 && p[1] + a[1]*ke > -1 && p[1] + a[1]*ke < d.mh ){
			let p2 = [p[0] + a[0]*ke , p[1] + a[1]*ke] ;
			let b = koma[PeB(p2)];
			if(b.v == "No" || b.sf != Nsf){
				c.push(p2);
			}
		}
	}
	return c ;
};
//成り処理
function Nari(k){
	let arr = [
	["歩兵","と"],
	["歩","と"],
	["香車","成香"],
	["香","成香"],
	["桂馬","成桂"],
	["桂","成桂"],
	["銀将","成銀"],
	["銀","成銀"],
	["角行","龍馬"],
	["角","馬"],
	["飛車","龍王"],
	["飛","竜"],
	["金"],
	["金将"],
	["玉"],
	["玉将"],
	["王将"],
	["王"],
	];
	for(let i = 0 ; i < arr.length ; i ++){
		let a = arr[i] ;
		if(k == a[0]){
			if(a.length == 1){
				return {
					v : a[0],
					nari : true ,
					can : false ,
				}
			}else{
				return {
					v : a[1],
					nari : true ,
					can : true ,
				}
			}
		}else if(k == a[1]){
			return {
				v : a[0],
				nari : false ,
				can : false ,
			}
		}
	}
}

//駒移動
function MoveKoma(beforeK,afterB,n1){
	let getK = koma[afterB].v;
	if(koma[afterB].v != "No"){
		if(Nsf){
			if(Nari(koma[afterB].v).nari){
				Having.f.push(koma[afterB].v);
			}else{
				Having.f.push(Nari(koma[afterB].v).v);
			}
		}else{
			if(Nari(koma[afterB].v).nari){
				Having.s.push(koma[afterB].v);
			}else{
				Having.s.push(Nari(koma[afterB].v).v);
			}
		}
		if( koma[afterB].v == "玉将" || koma[afterB].v == "王将" || koma[afterB].v == "玉" || koma[afterB].v == "王"){
			let elmA = document.getElementById("tsumi");
			elmA.style.display = "block";
			let elmAs = document.getElementsByClassName("tsumi");
			if(Nsf){
				elmAs[0].innerText = "詰みで先手の勝利"
			}else{
				elmAs[0].innerText = "詰みで後手の勝利"
			}
		}
	}
	koma[afterB].v = beforeK.v;
	koma[afterB].sf = Nsf;
	beforeK.v = "No";
	selectB = afterB ;
	if(BeP(afterB)[1] < (d.mh*35/100)-1 && Nsf ){
		let c = Nari(koma[afterB].v) ;
		mode = "NA";
		if( c.can && n1)document.getElementById("narimasuka").style.display = "block";
	}else if(BeP(afterB)[1] > d.mh-(d.mh*35/100) && !Nsf ){
		let c = Nari(koma[afterB].v) ;
		mode = "NA";
		if( c.can && n1)document.getElementById("narimasuka").style.display = "block";
	}
	FreemReset([]);
	return getK;
}


//先手後手変換
let ChangeSF = function(sf){
	let elm = document.getElementById("sfShow") ;
	Nsf = sf ;
	if(sf){
		elm.innerText = "先手番" ;
		elm.style.color = "white" ;
		elm.style.background = "red" ;
	}else{
		elm.innerText = "後手番" ;
		elm.style.color = "red" ;
		elm.style.background = "white" ;
	}
}

//駒の配置用
let haichifile = document.getElementById("haichifile");
let KomaHaichiSetting = function(){
	let en = function(){let arr = [] ;for(let i = 0 ; i < d.mw*d.mh ; i ++){let a = {sf : true ,v : "No" ,};arr.push(a) ;};return arr;};
	switch(haichifile.value){
	case "Nomal":
		koma = [{sf:false,v:"香車",},{sf:false,v:"桂馬",},{sf:false,v:"銀将",},{sf:false,v:"金将",},{sf:false,v:"玉将",},{sf:false,v:"金将",},{sf:false,v:"銀将",},{sf:false,v:"桂馬",},{sf:false,v:"香車",},{sf:true,v:"No",},{sf:false,v:"飛車",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:false,v:"角行",},{sf:true,v:"No",},{sf:false,v:"歩兵",},{sf:false,v:"歩兵",},{sf:false,v:"歩兵",},{sf:false,v:"歩兵",},{sf:false,v:"歩兵",},{sf:false,v:"歩兵",},{sf:false,v:"歩兵",},{sf:false,v:"歩兵",},{sf:false,v:"歩兵",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"歩兵",},{sf:true,v:"歩兵",},{sf:true,v:"歩兵",},{sf:true,v:"歩兵",},{sf:true,v:"歩兵",},{sf:true,v:"歩兵",},{sf:true,v:"歩兵",},{sf:true,v:"歩兵",},{sf:true,v:"歩兵",},{sf:true,v:"No",},{sf:true,v:"角行",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"No",},{sf:true,v:"飛車",},{sf:true,v:"No",},{sf:true,v:"香車",},{sf:true,v:"桂馬",},{sf:true,v:"銀将",},{sf:true,v:"金将",},{sf:true,v:"王将",},{sf:true,v:"金将",},{sf:true,v:"銀将",},{sf:true,v:"桂馬",},{sf:true,v:"香車",},];
		break;
	case "Empty":
		koma = en();
		break;
	case "Random":
		let vr = ["歩兵","桂馬","飛車","角行","香車","銀将","金将"];
		koma = en();
		let i = 0 ;
		let k = Math.floor(d.mw*d.mh*(20/81));
		let k2 = d.mw*d.mh - k;
		koma[Math.floor(d.mw/2)].v = "王将";
		koma[Math.floor(d.mw/2)].sf = false ;
		koma[d.mw*d.mh-1-Math.floor(d.mw/2)].v = "玉将";
		koma[d.mw*d.mh-1-Math.floor(d.mw/2)].sf = true
		while(i<k){
			let r1 = Math.floor(Math.random()*k2);
			if(koma[r1].v == "No"){
				koma[r1].v = vr[Math.floor(Math.random()*vr.length)];
				koma[r1].sf = false ;
				i++;
			}
		};
		i=0;
		while(i<k){
			let r1 = d.mw*d.mh-1-Math.floor(Math.random()*k2);
			if(koma[r1].v == "No"){
				koma[r1].v = vr[Math.floor(Math.random()*vr.length)];
				koma[r1].sf = true ;
				i++;
			}
		};
		break;
	}
}

let cpu = function(){
	let En = [];
	let My = [];
	for(let i = 0 ; i < koma.length ; i ++){
		if(koma[i].v != "No"){
			let p = BeP(i);
			if(koma[i].sf && Nsf){
				My.push({
					p:p,
					v:koma[i].v,
				})
			}else if(!koma[i].sf && !Nsf){
				My.push({
					p:p,
					v:koma[i].v,
				})
			}else{
				En.push({
					p:p,
					v:koma[i].v,
				})
			}
		}
	}
	let m0 = My[Math.floor(Math.random()*My.length)].p ;
	Touch(PeB(m0));
	let m1 = subSelectP[Math.floor(Math.random()*subSelectP.length)];
	Touch(PeB(m1));

	console.log(m0 +"→"+m1)
}
let interval = {
	Time : 0,
}
function str(){
	clearInterval(interval.Time);
	document.getElementById("infmation_hint_log").innerHTML="";
	cpu.bomC = true ;
	GOption.fsCheck = true ;
	document.getElementById("errowSentence").innerText="";
	flagCounter();
	document.getElementById("Sr1").style.display="none";
	document.getElementById("Sr2").style.display="block";
	for(let h = 0 ; h < GOption.height ; h++ ){
		elmAdd("tr","",document.getElementById("mon"),[["class","HeigthScreen"]]);
		for(let w = 0 ; w < GOption.width ; w++ ){
			let cssNum = h * GOption.width + w ;
			elmAdd("td","",document.getElementById("mon").children[h],[["class","sw"],["onmouseup","op("+cssNum+")"]]);
			let elms = document.getElementsByClassName("sw");
			sh[cssNum] = ["u","","K"];
		}
	}	
	document.getElementById("Sr2").style.width=GOption.style*GOption.width+20;
	for(let i = 0 ; i < sh.length ; i++){
		let elm = document.getElementsByClassName("sw")[i];
		elm.style.width = GOption.style-4 ;
		elm.style.height = GOption.style-4 ;
	}
}

document.addEventListener("keydown",function(e){
	if(e.keyCode === 13){
		GOption.mode = "hata" ;
		document.getElementById("btOpen").style.background="white";
		document.getElementById("btHata").style.background="yellow";
	}
});
document.addEventListener("keyup",function(e){
	if(e.keyCode === 13){
		GOption.mode = "open" ;
		document.getElementById("btOpen").style.background="yellow";
		document.getElementById("btHata").style.background="white";
	}
});
document.addEventListener("keypress",function(e){
	switch(e.key){
	case "r":
		if(document.getElementById("Sr2").style.display=="block"){
			clearInterval(interval.Time);
			replay();
		}
		break;
	case " ":
		if(GOption.mode=="hata"){
			GOption.mode = "open" ;
			document.getElementById("btOpen").style.background="yellow";
			document.getElementById("btHata").style.background="white";
		}else{
			GOption.mode = "hata" ;
			document.getElementById("btOpen").style.background="white";
			document.getElementById("btHata").style.background="yellow";
		}
		break;
	case "h":
		hint(false);
		break;
	case "c":
		systemB2(true);
		break;
	case "v":
		systemB2(false);
		break;
	}
});
document.getElementById("EveryBom").addEventListener("input", function(e){
	if(document.getElementById("EveryBom").checked){
		GOption.bomP = 9 ;
	}else{
		GOption.bomP = 1 ;
	}
});
function op(n){
	cpu.bomC = false ;
	if(GOption.fsCheck){
		interval.Time=setInterval(Interval,10);
		TimeCounter = 0;
		GOption.finish=false;
	}
	if(GOption.fsCheck&&GOption.bomP==1){
		GOption.fsCheck = false ;
		for(let i = 0 ; i < GOption.bom ; i++ ){
			let a = Math.floor(Math.random()*sh.length);
			let b = sh[a];
			if(b[1]==""&&a!==n){
				sh[a]=[b[0],"b",b[2]];
				let elm1 = document.getElementsByClassName("sw")[a];
			}else{
				i--;
			}
		}
		for(let i2 = 0 ; i2 < sh.length ; i2++){
			let a = sh[i2];
			if(a[1]!=="b"){
				let elm2 = document.getElementsByClassName("sw")[i2];
				sh[i2]=[a[0],numberS(i2),a[2]];
			}
		}
	}else if(GOption.fsCheck){
		GOption.fsCheck = false ;
		for(let i = 0 ; i < GOption.bom ; i++ ){
			let a = Math.floor(Math.random()*sh.length);
			let b = sh[a];
			if(b[1]==""&&a!==n&&a!==opMore(n,0)&&a!==opMore(n,1)&&a!==opMore(n,2)&&a!==opMore(n,3)&&a!==opMore(n,4)&&a!==opMore(n,5)&&a!==opMore(n,6)&&a!==opMore(n,7)){
				sh[a]=[b[0],"b",b[2]];
				let elm1 = document.getElementsByClassName("sw")[a];
			}else{
				i--;
			}
		}
		for(let i2 = 0 ; i2 < sh.length ; i2++){
			let a = sh[i2];
			if(a[1]!=="b"){
				let elm2 = document.getElementsByClassName("sw")[i2];
				sh[i2]=[a[0],numberS(i2),a[2]];
			}
		}
	}
	let a = sh[n];
	let elm = document.getElementsByClassName("sw");
	if(GOption.mode=="hata"){
		if(a[0]=="u"){
			elm[n].innerHTML = "<img src='./ph/hata.png' style='width:100%;height:100%;'>";
			sh[n]=["h",a[1],a[2]];
		}else if(a[0]=="h"){
			elm[n].innerHTML = "";
			sh[n]=["u",a[1],a[2]];
		}
	}else if(GOption.mode=="open"){
		hy1(n)
		if(a[1]==0){
		}
	}
	function hy1(b){
		let c = sh[b];
		try{
			if(c[0]=="u"){
				if(!cpu.kido){
					document.getElementById("infmation_hint_log").innerHTML+="<br><a style='color:green;'>"+b+"is open by player.</a>";
				}
				elm[b].style.background = "white";
				if(c[1]=="b"){
					elm[b].innerHTML="<img src='./ph/boom.png' style='width:50px;height:54px;'>";
					document.getElementById("gameLog").innerText="GAME OVER 一からやり直せ無能！！";
					document.getElementById("infmation_hint_log").innerHTML+="<br><a style='color:blue;'>Game over by opening at "+n+" .</a>";
					GOption.finish=true;
					clearInterval(interval.Time);
					for(let i = 0 ; i < sh.length ; i++){
						let n1 = sh[i];
						if(n1[1]=="b"){
							elm[i].style.background = "white";
							elm[i].innerHTML="<img src='./ph/boom.png' style='width:100%;height:100%;'>";
						}
					}
					if(GOption.jisseki){
						document.getElementById("expPlus").innerText="-100";
					}
				}else{
					GOption.score+=100*GOption.gametype;
					document.getElementById("score").innerText=GOption.score;
					let src = "<img src='./num/"+c[1]+".png' style='width:100%;height:100%;'>";
					elm[b].innerHTML=src ;
				}
				if(c[1]=="0"){	
					sh[b]=["o","0z",c[2]];
					hy2(b);
				}else{
					sh[b]=["o",c[1],c[2]];
				}
			}
		}catch(errow){
			document.getElementById("errow").innerHTML="sh["+b+"][1] is No number or<br> other problem at hy1";
		}
	}
	function hy2(b){
		for(let i = 0 ; i<8;i++){
			hy1(opMore(b,i));
		}
	}
	flagCounter();
}
function opMore(n,p){
	let y = Math.floor(n/GOption.width);
	let x = (n)%GOption.width;
	if(y!==0&&p==0){
		return (y-1)*GOption.width+x;
	}else if(y!==GOption.height-1&&p==1){
		return (y+1)*GOption.width+x;
	}else if(x!==0&&p==2){
		return (y)*GOption.width+x-1;
	}else if(x!==GOption.width-1&&p==3){
		return (y)*GOption.width+x+1;
	}else if(y!==0&&x!==0&&p==4){
		return (y-1)*GOption.width+x-1;
	}else if(y!==GOption.height-1&&x!==0&&p==5){
		return (y+1)*GOption.width+x-1;
	}else if(y!==0&&x!==GOption.width-1&&p==6){
		return (y-1)*GOption.width+x+1;
	}else if(y!==GOption.height-1&&x!==GOption.width-1&&p==7){
		return (y+1)*GOption.width+x+1 ;
	}else{
		return "f";
	}
}
function elmAdd(elmName,tc,Place,att){
	let NewElm = document.createElement(elmName);
	NewElm.textContent = tc ;
	length = att.length ;
	for(let i = 0; i < length ; i ++){
		let attInside = att[i] ;
		NewElm.setAttribute(attInside[0],attInside[1]);
	}
	Place.appendChild(NewElm) ;
}
function numberS(n){
	let y = Math.floor(n/GOption.width);
	let x = (n)%GOption.width;
	let C_num = 0;
	if(y!==0){
		let C = (y-1)*GOption.width+x ;
		let a = sh[C] ;
		if(a[1]=="b"){
			C_num ++;
		}
	}if(y!==GOption.height-1){
		let C = (y+1)*GOption.width+x ;
		let a = sh[C] ;
		if(a[1]=="b"){
			C_num ++;
		}
	}if(x!==0){
		let C = (y)*GOption.width+x-1 ;
		let a = sh[C] ;
		if(a[1]=="b"){
			C_num ++;
		}
	}if(x!==GOption.width-1){
		let C = (y)*GOption.width+x+1 ;
		let a = sh[C] ;
		if(a[1]=="b"){
			C_num ++;
		}
	}if(y!==0&&x!==0){
		let C = (y-1)*GOption.width+x-1 ;
		let a = sh[C] ;
		if(a[1]=="b"){
			C_num ++;
		}
	}if(y!==GOption.height-1&&x!==0){
		let C = (y+1)*GOption.width+x-1 ;
		let a = sh[C] ;
		if(a[1]=="b"){
			C_num ++;
		}
	}if(y!==0&&x!==GOption.width-1){
		let C = (y-1)*GOption.width+x+1 ;
		let a = sh[C] ;
		if(a[1]=="b"){
			C_num ++;
		}
	}if(y!==GOption.height-1&&x!==GOption.width-1){
		let C = (y+1)*GOption.width+x+1 ;
		let a = sh[C] ;
		if(a[1]=="b"){
			C_num ++;
		}
	}
	return C_num;
}
function replay(){
	let elms = document.getElementsByClassName("CostomOption");
	GOption.bom = elms[0].value;
	GOption.height = elms[1].value;
	GOption.width = elms[2].value;
	if(GOption.bom<=GOption.height*GOption.width-GOption.bomP){
		document.getElementById("gameLog").innerText="スタート!!";
		sh=[];
		document.getElementById("mon").innerHTML="";
		str();
	}else{
		document.getElementById("errowSentence").innerText="マス数よりも爆弾が多くなっています！！"
	}
	GOption.score=0;
	document.getElementById("score").innerText=0;
	if(GOption.jisseki&&GOption.exp>=100){
		GOption.exp -= 100 ;
	}else{
		GOption.jisseki=false;
	}
	document.getElementById("exp").innerText=GOption.exp;
}
function playMain(){
	if(GOption.exp>=100){
		GOption.exp -= 100 ;
		document.getElementById("exp").innerText=GOption.exp;
		let elms = document.getElementsByClassName("CostomOption");
		elms[0].value=GOption.bom;
		elms[1].value=GOption.height;
		elms[2].value=GOption.width;
		GOption.bomP = 9 ;
		GOption.jisseki = true ;
		document.getElementById("gameLog").innerText="スタート!!";
		sh=[];
		document.getElementById("mon").innerHTML="";
		str();
		clearInterval(interval.Time);
		GOption.score=0;
		document.getElementById("score").innerText=0;
	}else{
		document.getElementById("errowSentence").innerText="お金が足りません（一回100円）現在所有："+GOption.exp+"円";
	}
}
function Interval(){
	TimeCounter++;
	let a = TimeCounter / 100 ;
	document.getElementById("Conter").innerText=a;
}
function flagCounter(){
	let a = 0 ;
	let c = 0 ;
	let d = [] ;
	for(let i = 0 ; i < sh.length ; i++ ){
		let elmI = sh[i] ;
		if(elmI[0]=="h"){
			a++;
		}
		if(elmI[0]=="u"||elmI[0]=="h"||elmI[0]=="d"){
			c++;
		}
	}
	let b = GOption.bom - a ;
	document.getElementById("ALbom").innerText="残り"+b+"個";
	if(c == GOption.bom ){
		clearInterval(interval.Time);
		document.getElementById("gameLog").innerText="GAME CLEAR !!";
		GOption.finish=true;

		document.getElementById("infmation_hint_log").innerHTML+="<br><a style='color:blue;'>Game clear.</a>";
		GOption.score+=GOption.bom*500* GOption.gametype;
		GOption.score-=TimeCounter;
		if(GOption.score<=200){
			GOption.score=200;
		}
		document.getElementById("score").innerText=GOption.score;
		let elms2 = document.getElementsByClassName("sts");
		if(GOption.score>=Number(elms2[0].innerText)){
			elms2[0].innerText=GOption.score;
		}
		if(GOption.jisseki){
			GOption.exp += Math.floor(GOption.score/100) ;
			document.getElementById("expPlus").innerText = Math.floor(GOption.score/100) -100;
			document.getElementById("exp").innerText=GOption.exp;
			for(let i = 1 ; i < 5 ; i ++ ){
				if(GOption.gametype==i){
					if(Number(elms2[i].innerText)>TimeCounter/100||elms2[i].innerText=="-"){
						elms2[i].innerText=TimeCounter/100;
					}
				}
			}
		}
		GOption.score = 0;
	}
}
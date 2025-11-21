let coin = 100 ;
//N...動いていない　S...動いている
let mode = "N";
let k = 5 ;
let ch = [0,1,2];
let jp=1000;
let ct = [0,0,0] ;
let iv=100;
let bmode="click";

window.onload=function(){
	hy(6,"×0");
	let count=0;
	setInterval(function(){
		count++;
		document.getElementById("rotate").style.transform="rotateY("+count+"deg)";
	},20);
}
function hy(at,at2){
	info=document.getElementsByClassName("info");
	info[0].innerText=coin+" coin";
	info[1].innerHTML="<input type='number' value='"+k+"' id='k' style='font-size:40px;'>"+"coin";
	info[2].innerHTML="<div id='rotate' style='text-align:center;'>"+random(4,at)+"</div>";
	info[3].innerHTML=at2;
	info[4].innerText=jp+"coin";
}
function start(){
	const L0 = () => {
		clearInterval(sr0);
		co(0);
		stop[0].style.background="white";
	};
	const L1 = () => {
		clearInterval(sr1);
		co(1);
		stop[1].style.background="white";
	};
	const L2 = () => {
		clearInterval(sr2);
		co(2);
		stop[2].style.background="white";
	};
	let cos=[false,false,false];
	let sr0,sr1,sr2;
	k=document.getElementById("k").value;
	let stop=document.getElementsByClassName("stopbutton");
	if(mode=="N"){
		document.getElementById('startButton').style.background='black';
		coin = coin - k ;
		mode = "S";
		let sr = document.getElementById("screen").children;
		sr0 = setInterval(function(){
			sr[0].innerHTML=random(0,kakuritsu(ct[0]));
			ct[0]++
			if(ct[0]==7){
				ct[0]=0;
			}
		},iv);
		sr1 = setInterval(function(){
			sr[1].innerHTML=random(1,kakuritsu(ct[1]));
			ct[1]++
			if(ct[1]==7){
				ct[1]=0;
			}
		},iv);
		sr2 = setInterval(function(){
			sr[2].innerHTML=random(2,kakuritsu(ct[2]));
			ct[2]++
			if(ct[2]==7){
				ct[2]=0;
			}
		},iv);

		for(let i = 0 ; i< stop.length; i++){
			stop[i].style.background="blue";
		}
		stop[0].addEventListener(bmode,L0,false);
		stop[1].addEventListener(bmode,L1,false);
		stop[2].addEventListener(bmode,L2,false);
	}else{
		console.log("まだ押さないで―");
	}
	hy(6,"×0");
	function co(n){
		cos[n]=true;
		if(cos[0]&&cos[1]&&cos[2]){
			document.getElementById('startButton').style.background='red';
			mode="N";
			check();
			stop[2].removeEventListener(bmode,L2,false);
			stop[1].removeEventListener(bmode,L1,false);
			stop[0].removeEventListener(bmode,L0,false);
		}
		console.log(cos);
	}
}
function random(a,b){
	ch[a]=b;
	switch(b){
	case 0 :
		return "<img src='./typePhoto/7.png'>";
		break;
	case 1 :
		return "<img src='./typePhoto/apple.png'>";
		break;
	case 2 :
		return "<img src='./typePhoto/bar1.png'>";
		break;
	case 3 :
		return "<img src='./typePhoto/bar2.png'>";
		break;
	case 4 :
		return "<img src='./typePhoto/bar3.png'>";
		break;
	case 5 :
		return "<img src='./typePhoto/bell.png'>";
		break;
	case 6 :
		return "";
		break;
	}
}
function check(){
	let b = 0;
	let sr = document.getElementById("screen").children;
	if(ch[0]==ch[1]&&ch[0]==ch[2]){
		switch(ch[0]){
		case 0:
			coin =coin+ jp ;
			hy(ch[0],jp+"<br>当たり"+jp+"coin");
			jp=Math.floor(Math.random()*300);
			break;
		case 1:
			jp=jp+Math.floor(Math.random()*25);
			b = 5 * k ;
			coin =coin+ b ;
			hy(ch[0],"×"+5+"<br>当たり"+b+"coin");
			break;
		case 2:
			jp=jp+Math.floor(Math.random()*25);
			b = 3 * k ;
			coin =coin+ b ;
			hy(ch[0],"×"+3+"<br>当たり"+b+"coin");
			break;
		case 3:
			jp=jp+Math.floor(Math.random()*25);
			b = 6 * k ;
			coin =coin+ b ;
			hy(ch[0],"×"+6+"<br>当たり"+b+"coin");
			break;
		case 4:
			jp=jp+Math.floor(Math.random()*25);
			b = 9 * k ;
			coin =coin+ b ;
			hy(ch[0],"×"+9+"<br>当たり"+b+"coin");
			break;
		case 5:
			jp=jp+Math.floor(Math.random()*25);
			b = 10 * k ;
			coin =coin+ b ;
			hy(ch[0],"×"+10+"<br>当たり"+b+"coin");
			break;
		}
	}else if((ch[0]==2||ch[0]==3||ch[0]==4)&&(ch[1]==2||ch[1]==3||ch[1]==4)&&(ch[2]==2||ch[2]==3||ch[2]==4)){
		jp=jp+Math.floor(Math.random()*25);
		let a = (ch[0]-1)+(ch[1]-1)+(ch[2]-1);
		b = a * k ;
		coin =coin+ b ;
		hy(2,"×"+a+"<br>当たり"+b+"coin");
	}else{
		jp=jp+Math.floor(Math.random()*40);
		hy(6,"×"+0);
	}
}
function kakuritsu(r){
	let a = [0,1,2,3,4,5,1,2,0,3,4,3,4,5,1,2,4,0,2];
	return a[r];
}
function option(){
	let o=document.getElementsByClassName("opi");
	iv=o[0].value;
	bmode=o[1].value;
}











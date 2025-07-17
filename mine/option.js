function systemB1(a){
	if(GOption.mode=='open'){
		document.getElementById("btOpen").style.background="white";
		document.getElementById("btHata").style.background="yellow";
		GOption.mode='hata';
	}else{
		document.getElementById("btOpen").style.background="yellow";
		document.getElementById("btHata").style.background="white";
		GOption.mode='open';
	}
}
function systemB2(a){
	if(a){
		document.getElementById("Sr2").style.display="none";
		document.getElementById("Sr1").style.display="none";
		document.getElementById("state").style.display="none";
		document.getElementById("infmation_hint").style.display="block";
	}else{
		document.getElementById("Sr2").style.display="block";
		document.getElementById("Sr1").style.display="none";
		document.getElementById("state").style.display="block";
		document.getElementById("infmation_hint").style.display="none";
	}
}
function menyu(){
	document.getElementById("Sr1").style.display="block";
	document.getElementById("Sr2").style.display="none";
	document.getElementById("saikai").style.display="block";
}
function saikai(){
	document.getElementById("Sr2").style.width=GOption.style*GOption.width+20;
	document.getElementById("Sr1").style.display="none";
	document.getElementById("Sr2").style.display="block";
	document.getElementById("saikai").style.display="none";
	for(let i = 0 ; i < sh.length ; i++){
		let elm = document.getElementsByClassName("sw")[i];
		elm.style.width = GOption.style-4 ;
		elm.style.height = GOption.style-4 ;
	}
}
let elmsTable = document.getElementsByClassName("example");
window.onload=function(){
	for(let i = 0 ; i < elmsTable.length ; i ++){
		let ec = elmsTable[i].children[0].children ;
		for(let j = 0 ; j < ec.length ; j ++){
			let ecc = ec[j].children ;
			for(let k = 0 ; k < ecc.length ; k++){
				if(ecc[k].innerText=="１"){
					ecc[k].style.backgroundColor="#4caf50";
				}else if(ecc[k].innerText=="２"){
					ecc[k].style.backgroundColor="#03a9f4";
				}else if(ecc[k].innerText=="３"){
					ecc[k].style.backgroundColor="yellow";
				}else if(ecc[k].innerText=="４"){
					ecc[k].style.backgroundColor="orange";
				}else if(ecc[k].innerText=="５"){
					ecc[k].style.backgroundColor="red";
				}else if(ecc[k].innerText=="■"){
					ecc[k].style.backgroundColor="gray";
					ecc[k].style.color="gray";
				}else if(ecc[k].innerText=="□"){
					ecc[k].style.backgroundColor="white";
					ecc[k].style.color="white";
					ecc[k].style.borderColor="black";
				}else if(ecc[k].innerText=="★"){
					ecc[k].style.backgroundColor="gray";
				}else if(ecc[k].innerText=="a"){
					ecc[k].style.backgroundColor="white";
					ecc[k].style.color="white";
				}else if(ecc[k].innerText=="▶"){
					ecc[k].style.backgroundColor="gray";
					ecc[k].style.color="red";
				}
			}
		}
	}
}
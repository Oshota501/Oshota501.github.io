document.write("<script src='./mine.js'></script> ");
document.write("<script src='./hint.js'></script> ");
document.write("<script src='./option.js'></script> ");
function comm(elm){
	let m = true ;
	elm = document.getElementById("command");
	if(elm.value=="ort"){
		document.getElementById("infmation_hint_log").innerHTML+="<br><a style='color:blue;'>◆ ort mode change by you.</a>";
		ort();
	}
	if(elm.value=="clear"){
		document.getElementById("infmation_hint_log").innerHTML="<br><a style='color:blue;'>◆ log clear by you.</a>";
		ort();
	}
	if(elm.value=="hint"){
		document.getElementById("infmation_hint_log").innerHTML+="<br><a style='color:blue;'>◆ hint visible by you.</a>";
		hint(false);
	}
	for(let i = 0 ; i < sh.length ; i++){
		if(elm.value=="ans "+i){
			let a = sh[i] ;
			if(a[1]=="b"){
				document.getElementById("infmation_hint_log").innerHTML+="<br><a style='color:blue;'>◆ [●～*] "+i+" is bomb</a>";
			}else{
				document.getElementById("infmation_hint_log").innerHTML+="<br><a style='color:blue;'>◆ [X] "+i+" is No bomb</a>";
			}	
		}	
	}
	if(elm.value=="coin"){
		document.getElementById("infmation_hint_log").innerHTML+="<br><a style='color:blue;'>◆ Add coin.</a>";
		setInterval(function(){
			GOption.exp += 1 ;
			document.getElementById("exp").innerText=GOption.exp;
		},50);
	}
}
function t(a){
    GOption.exp-=a;
    if(Math.floor(Math.random()*10)>=4){
        GOption.exp+=a*2;
    }
    document.getElementById('exp').innerText=GOption.exp;
}
cpu = {
	bomC : true ,
	kido : false ,
}
document.getElementById("sizeSelect").addEventListener("input",function(){
	let a = document.getElementById("sizeSelect").value;
	GOption.style = Number(a);
	console.log(GOption.stylew);
});
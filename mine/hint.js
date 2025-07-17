function ort(){	
	cpu.kido = true ;
	hint(true);
	cpu.kido = false ;
	let intb = setInterval(function(){
		hint(true);
		if(GOption.fsCheck||GOption.finish){
			clearInterval(intb);
			cpu.kido = false ;
		}
	},600);
}
function hint(ort){
	if(!ort&&GOption.jisseki){
		GOption.exp-=50;
	}
	document.getElementById("exp").innerText=GOption.exp;
	if(ort&&cpu.bomC){
		cpu.bomC = false ;
		GOption.mode = "open";
		let r = Math.floor(Math.random()*sh.length );
		document.getElementById("infmation_hint_log").innerHTML+="<br><a style='color:orange;'>"+r+"First open is absolutely blank by hint or ort.</a>";
		op(r);
	}
	for(let i = 0 ; i < sh.length ; i++){
		let a = sh[i] ;
		sh[i] = [a[0],a[1],"N"];
	}
	for(let i = 0 ; i < sh.length ; i++){
		let a = sh[i] ;
		let hata = 0 ;
		let rock= 0;
		if(a[0]=="o"){
			function coun(p){
				hata = 0 ;
				rock = 0 ;
				for(let b = 0 ; b < 8 ; b ++ ){
					if(opMore(p,b)!="f"){
						let c = sh[opMore(p,b)];
						if(c[0]=="u"){
							rock++ ;
						}else if(c[0]=="h"){
							hata++ ;
						}
					}
				}
			}
			coun(i);
			for(let b = 0 ; b < 8 ; b ++ ){
				if(opMore(i,b)!="f" && rock!=0 ){
					let c = sh[opMore(i,b)];
					if(c[2]!="N"&&c[0]=="u"&&1-((a[1]-hata)/rock)==1){
						c[2]=1;
					}else if(c[2]!="N"&&c[0]=="u"&&c[2]!=1){
						c[2] = c[2]*(1-((a[1]-hata)/rock));
					}else if(c[0]=="u"&&c[2]=="N"){
						c[2] =1-((a[1]-hata)/rock);
					}
				}
			}
			if(a[1]-hata==2&&a[0]=="o"){
				let arr1 = [-1,-1,-1,-1,-1,-1,-1,-1,-1];//mode
				let arr2 = [-1,-1,-1,-1,-1,-1,-1,-1,-1];//number
				for(let d = 0 ; d < 8 ; d ++ ){
					if(opMore(i,d)!="f"){
						let f = sh[opMore(i,d)];
						arr1[d] = f[0] ;
						arr2[d] = f[1] ;
					}
				}
				if(arr1[2]!="u"&&arr1[4]!="u"&&arr1[5]!="u"&& arr1[1]=="o"&&arr1[0]=="o"&& arr1[3]=="u"&&arr1[6]=="u"&&arr1[7]=="u"){
					coun(opMore(i,0));
					if(arr2[0]-hata==1){
						coun(opMore(i,1));
						if(arr2[1]-hata==1){
							let c = sh[opMore(i,3)];
							c[2]=1;
							let c1 = sh[opMore(i,6)];
							c1[2]=0;
							let c2 = sh[opMore(i,7)];
							c2[2]=0;
						}
					}
				}
				if(arr1[2]=="u"&&arr1[4]=="u"&&arr1[5]=="u"&& arr1[1]=="o"&&arr1[0]=="o"&& arr1[3]!="u"&&arr1[6]!="u"&&arr1[7]!="u"){
					coun(opMore(i,0));
					if(arr2[0]-hata==1){
						coun(opMore(i,1));
						if(arr2[1]-hata==1){
							let c = sh[opMore(i,2)];
							c[2]=1;
							let c1 = sh[opMore(i,4)];
							c1[2]=0;
							let c2 = sh[opMore(i,5)];
							c2[2]=0;
						}
					}
				}
				if(arr1[0]=="u"&&arr1[4]=="u"&&arr1[6]=="u"&& arr1[2]=="o"&&arr1[3]=="o"&& arr1[1]!="u"&&arr1[5]!="u"&&arr1[7]!="u"){
					coun(opMore(i,2));
					if(arr2[2]-hata==1){
						coun(opMore(i,3));
						if(arr2[3]-hata==1){
							let c = sh[opMore(i,0)];
							c[2]=1;
							let c1 = sh[opMore(i,4)];
							c1[2]=0;
							let c2 = sh[opMore(i,6)];
							c2[2]=0;
						}
					}
				}
				if(arr1[0]!="u"&&arr1[4]!="u"&&arr1[6]!="u"&& arr1[2]=="o"&&arr1[3]=="o"&& arr1[1]=="u"&&arr1[5]=="u"&&arr1[7]=="u"){
					coun(opMore(i,2));
					if(arr2[2]-hata==1){
						coun(opMore(i,3));
						if(arr2[3]-hata==1){
							let c = sh[opMore(i,1)];
							c[2]=1;
							let c1 = sh[opMore(i,5)];
							c1[2]=0;
							let c2 = sh[opMore(i,7)];
							c2[2]=0;
						}
					}
				}
			}
		}
	}
	for(let i = 0 ; i < sh.length ; i++){
		let elm = document.getElementsByClassName("sw")[i];
		let a = sh[i];
		if(a[2]==0){
			cpu.kido = true ;
			GOption.mode = "hata";
			op(i);
			document.getElementById("infmation_hint_log").innerHTML+="<br><a style='color:red;'>"+i+" is 100% Bomb by hint or ort.</a>";
			cpu.kido = false ;
		}else if(a[2]==1&&ort){
			cpu.kido = true ;
			GOption.mode = "open";
			op(i);
			document.getElementById("infmation_hint_log").innerHTML+="<br><a style='color:orange;'>"+i+" is 0% Bomb by hint or ort.</a>";
			cpu.kido = false ;
		}
		a = sh[i];
		if(a[0]=="u"&&a[2]!="N"){
			if(a[2]>0&&a[2]<=0.1){
				elm.style.background = "#b700ff";
			}else if(a[2]>0.1&&a[2]<=0.25){
				elm.style.background = "red";
			}else if(a[2]>0.25&&a[2]<=0.4){
				elm.style.background = "orange";
			}else if(a[2]>0.4&&a[2]<=0.6){
				elm.style.background = "yellow";
			}else if(a[2]>0.6&&a[2]<=0.8){
				elm.style.background = "lightgreen";
			}else if(a[2]>0.8&&a[2]<1){
				elm.style.background = "green";
			}else if(a[2]==1){
				elm.style.background = "lightblue";
			}
		}else if(a[0]=="u"||a[0]=="h"){
			elm.style.background="gray";
		}else if(a[0]=="o"){
			elm.style.background="white";
		}
	}
	document.getElementById("btOpen").style.background="yellow";
	document.getElementById("btHata").style.background="white";
	GOption.mode='open';
}
const elm = document.getElementById("init");

const inp = document.getElementById("input");

inp.children[2].addEventListener("click",function(){
    const dete = inp.children[0].value ;
    const dayRange = inp.children[1].value ;
    let html = "" ;
    
    for(let y = 0 ; y < Math.floor((Number(dete)+Number(dayRange))/7)+1 ;y++){
        html += `<tr><td>日付<br>17:00~<br>19:00~</td>`
        for(let x = 0 ; x < 7 ; x ++){
            const day = x+y*7+1-Number(dete) ;
            if((day >= 1 && Number(dayRange) >= day)){
                if(x != 1){
                    html += `<td>
                        ${day}
                        <div style="border-top:1px gray solid;" onclick="OX(${day*2})" id="${day*2}">O</div>
                        <div style="border-top:1px gray solid;" onclick="OX(${day*2+1})" id="${day*2+1}">X</div>
                    </td>` ;
                }else{
                    html += `<td>
                        ${day}
                        <div style="background-image: linear-gradient(to bottom left, #dddddd 50%, transparent 50%);height:3rem;"> </div>
                    </td>`;
                }
            }else{
                html += `<td style="background-image: linear-gradient(to bottom left, #dddddd 50%, transparent 50%);"></td>`
            }
        }
        html += "</tr>"
    }
    elm.innerHTML = html ;
}) ;

function OX(id){
    const e = document.getElementById(id);
    if(e.innerHTML == "O"){
        e.innerHTML = "X" ;
        e.style.background = "#ffd4d4ff"
    }else if(e.innerHTML == "X"){
        e.innerHTML = "△" ;
        e.style.background = "#f9ffd4ff"
    }else{
        e.innerHTML = "O" ;
        e.style.background = "#d4ffd7ff"
    }
    
}
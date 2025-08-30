//tesにpushして使ってね
// fetchを使ってファイルを読み込む
function page_template_import(change_elm){
    const filePath = change_elm.url ;
    const targetElement = change_elm.elm ;
    fetch(filePath)
        .then(response => {
            // レスポンスが正常かどうかを確認
            if (!response.ok) {
                throw new Error('ファイルの読み込みに失敗しました: ' + response.statusText);
            }
            // レスポンスをテキストとして解析
            return response.text();
        })
        .then(data => {
            // 取得したテキストデータをdiv要素のinnerHTMLに設定
            // 改行を<br>に変換したい場合は .replace(/\n/g, '<br>') を追加
            targetElement.innerHTML = data;
        })
        .catch(error => {
            // エラーが発生した場合の処理
            console.error('エラー:', error);
            targetElement.innerHTML = 'ファイルの読み込みに失敗しました。';
        });
}
function event_definition(){
    const elms = document.getElementsByClassName("pass_1");
    console.log(elms.length)
    for(let i = 0 ; i< elms.length ; i++){
        elms[i] = addEventListener("click",function(e){
            onclick_menue_bar(i)
        });
    }
    const onclick_menue_bar = function(n){
        const elm = elms[n];
        const elm_child = Array.from(elm.children);
        elm_child.forEach((elm2, index2) => {
            if (index2 > 0) {
                if (elm2.style.visibility == "visible") {
                    elm2.style.visibility = "hidden";
                } else {
                    elm2.style.visibility = "visible";
                }
            }
        });
    }
}
//main
window.onload=function(){
    tes.forEach((e,index)=>{
        console.log(`${index}: Req ${e}`)
        page_template_import(e)
    })
    event_definition()
};
// 読み込むファイルへのパス
// 表示させたいHTML要素を取得
const tes = [
    {
        elm : document.getElementsByClassName('menue_page')[0],
        url : '/public/menue.html' ,
    },{
        elm : document.getElementsByClassName('footer')[0] ,
        url : '/public/footer.html' ,
    },{
        elm : document.getElementsByClassName('side_menue')[0] ,
        url : '/public/profile.html' ,
    }
]

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

tes.forEach((e,index)=>{
    console.log(`${index}: Req ${e}`)
    page_template_import(e)
})

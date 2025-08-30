// tesにpushして使ってね
// fetchを使ってファイルを読み込む
function page_template_import(change_elm) {
    const filePath = change_elm.url;
    const targetElement = change_elm.elm;
    // fetchはPromiseを返すので、それをそのまま返す
    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('ファイルの読み込みに失敗しました: ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            targetElement.innerHTML = data;
        })
        .catch(error => {
            console.error('エラー:', error);
            targetElement.innerHTML = 'ファイルの読み込みに失敗しました。';
        });
}

function event_definition() {
    const elms = document.getElementsByClassName("pass_1");
    for (let i = 0; i < elms.length; i++) {
        // 注意：addEventListenerの使い方が間違っていたので修正
        elms[i].addEventListener("click", function (e) {
            onclick_menue_bar(i);
        });
    }

    const onclick_menue_bar = function (n) {
        const elm = elms[n];
        const elm_child = Array.from(elm.children);
        elm_child.forEach((elm2, index2) => {
            if (index2 > 0) { // h2要素以外を対象
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
window.onload = function () {
    // 各page_template_importのPromiseを配列に格納
    const promises = tes.map(e => page_template_import(e));

    // 全てのPromiseが解決されたら（＝全てのファイル読み込みが終わったら）実行
    Promise.all(promises).then(() => {
        event_definition(); // DOM要素が読み込まれた後に実行
    });
};
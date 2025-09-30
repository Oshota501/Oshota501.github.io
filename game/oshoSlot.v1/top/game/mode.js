document.addEventListener("keydown",function(e){
    if(e.key == "d"){
        document.getElementsByClassName("debug")[0].style.display = "block"
    }
})
for(let i = 0 ; i < document.getElementsByClassName("data").length ; i ++ ){
    const p = document.getElementsByClassName("data")[i] ;
    p.children[0].children[0].children[0].addEventListener("click",function(){
        if(p.style.display == "block"){
            p.style.display = "none"
        }else{
            p.style.display = "block"
        }
    });
}
/**
 * ドラッグ可能な要素を管理するクラス
 */
class DragItem {
    /**
     * @param {HTMLElement} element ドラッグ対象のHTML要素
     */
    constructor(element) {
        this.element = element;
        // 各要素をドラッグ可能にする
        this.element.draggable = true;
        // 各要素にdragstartイベントを設定
        this.element.addEventListener("dragstart", this.onDragStart);
    }

    /**
     * dragstartイベントのハンドラ
     * @param {DragEvent} ev 
     */
    onDragStart = (ev) => {
        // マウスカーソルと要素の左上隅のオフセットを計算
        const rect = this.element.getBoundingClientRect();
        const offsetX = ev.clientX - rect.left;
        const offsetY = ev.clientY - rect.top;

        // DataTransferオブジェクトに、IDとオフセットを含むJSON文字列を保存
        const data = {
            id: this.element.id,
            offsetX: offsetX,
            offsetY: offsetY
        };
        // データの種類は "application/json" のようなカスタムタイプにするのが推奨
        ev.dataTransfer.setData("application/json", JSON.stringify(data));
    }
}

// === メインの処理 ===
window.addEventListener("DOMContentLoaded", () => {
    
    // ---- グローバルなドロップゾーンの設定 ----
    // 1. dragoverリスナーをdocumentに一度だけ設定
    document.addEventListener("dragover", (ev) => {
        // デフォルトの動作をキャンセルしてドロップを許可する
        ev.preventDefault();
    });

    // 2. dropリスナーをdocumentに一度だけ設定
    document.addEventListener("drop", (ev) => {
    ev.preventDefault();
        try {
            const data = JSON.parse(ev.dataTransfer.getData("application/json"));
            
            if (data && data.id) {
                const draggedElement = document.getElementById(data.id);
                
                // ★★★ ここからが修正部分 ★★★

                // マウスのビューポート座標に現在のスクロール量を加算
                const newLeft = ev.clientX - data.offsetX + window.scrollX;
                const newTop = ev.clientY - data.offsetY + window.scrollY;

                // 計算したページ全体の座標を適用
                draggedElement.style.left = newLeft + "px";
                draggedElement.style.top = newTop + "px";
            }
        } catch (e) {
            console.error("ドロップ処理に失敗しました:", e);
        }
    });

    // ---- ドラッグ要素の初期化 ----
    const draggableElements = document.getElementsByClassName("data");
    for (const element of draggableElements) {
        // 各要素に対してDragItemインスタンスを作成して、ドラッグ機能を有効化
        new DragItem(element);
    }
});
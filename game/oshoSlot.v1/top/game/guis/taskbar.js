const bank = new DataBank();
const info = new DataInfomation();
const err = new DataError();
const shop = new DataShop();
const item = new DataItem();
const score = new DataScore();
taskbar = (elmName) => {
    const elm = document.getElementById(elmName);
    elm.style.display = "block"

    bank.updata()
    info.updata()
    shop.updata()
    item.updata()
    score.updata(score.page)
}


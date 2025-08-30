# Template
もしあなたがこのページを拡張するとき、以下のテンプレートをコピーアンドペーストしてください。
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>oshotaのgithubページ</title>
    </head>
    <body>
        <div class="menue_page">
            <!-- この要素ないには書かないでください。 -->
            <div class="menue_in_main"></div>
        </div>
        <div id="main">
            <div class="main_page">
                <div class="main_page_nomal_format">
                    <h1>ようこそ！</h1>
                    <hr>
                    <p>
                        このページはOshotaがcssやjsで遊ぶために作られたものです。ここにあるものは明記されていない限り著作権フリーとさせていただくので自由にご利用ください。(2025年08月30日22時05分)
                    </p>
                </div>
            </div>
            <div class="space_6px"></div>
            <div class="side_menue">
                <!-- この要素ないには書かないでください。 -->
            </div>
        </div>
        <div class="footer">
            <!-- この要素ないには書かないでください。 -->
        </div>

        <script>
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
        </script>
        <script src="/public/index.js"></script>
        <link href="/public/public_style.css" rel="stylesheet"/>
    </body>
</html>
```
# パスの構成
- root
  - [index.html](https://Oshota501.github.io)
  - game
  - memo
  - profile
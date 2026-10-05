(function () {
    'use strict';

    const COLORS = ['#ffffff', '#ff6b6b', '#4dabf7', '#ffd43b', '#69db7c', '#da77f2', '#ffa94d', '#66d9e8'];
    const DEFAULT_SRC = 'y = a\\sin\\left(bx + c\\right)\nf(x) = \\frac{1}{1 + e^{-k(x - x_0)}}';
    const DEFAULT_PARAM = { value: 1, min: -10, max: 10, step: 0.1 };
    const DEFAULT_X_HALF = 10;

    const $ = id => document.getElementById(id);
    const srcEl = $('src');
    const exprsEl = $('exprs');
    const paramsEl = $('params');
    const noParamsEl = $('no_params');
    const canvas = $('graph');
    const ctx = canvas.getContext('2d');
    const coordEl = $('coord');
    const viewInputs = { xmin: $('xmin'), xmax: $('xmax'), ymin: $('ymin'), ymax: $('ymax') };

    // ---------- 状態 ----------
    const state = {
        lines: [],          // parseProgram の結果 + fn, color
        paramOrder: [],     // 表示中のパラメータ名
        params: {},         // 名前 → {value,min,max,step}（消えた名前も設定を覚えておく）
        view: null,         // {xmin,xmax,ymin,ymax}
    };
    const paramRows = {};   // 名前 → DOM 参照
    const playing = {};     // 名前 → {dir, last}

    // ---------- KaTeX ----------
    function renderTex(el, tex) {
        if (window.katex) {
            try {
                window.katex.render(tex, el, { throwOnError: false, displayMode: false });
                return;
            } catch (e) { /* 下でテキスト表示 */ }
        }
        el.textContent = tex.replace(/^\\displaystyle /, ''); // KaTeX が読めないときはそのまま表示
    }

    // ---------- 数式の解析 ----------
    function rebuild() {
        let prog;
        try {
            prog = LatexMath.parseProgram(srcEl.value);
        } catch (e) {
            console.error(e);
            prog = [];
        }
        let colorIndex = 0;
        state.lines = prog.map(line => {
            const out = Object.assign({}, line);
            if (!line.error) {
                try {
                    out.fn = LatexMath.makeFunction(line.ast);
                } catch (e) {
                    out.error = e.message;
                }
            }
            out.color = out.error ? null : COLORS[colorIndex++ % COLORS.length];
            return out;
        });

        // パラメータ（登場順）
        const order = [];
        state.lines.forEach(l => {
            if (!l.error) l.vars.forEach(v => { if (!order.includes(v)) order.push(v); });
        });
        state.paramOrder = order;
        order.forEach(name => {
            if (!state.params[name]) state.params[name] = Object.assign({}, DEFAULT_PARAM);
        });

        renderExprList();
        syncParamRows();
        scheduleDraw();
        scheduleHash();
    }

    function renderExprList() {
        exprsEl.innerHTML = '';
        state.lines.forEach(l => {
            const li = document.createElement('li');
            const sw = document.createElement('span');
            sw.className = 'swatch';
            if (l.color) sw.style.background = l.color;
            const body = document.createElement('div');
            body.className = 'expr_body';
            const tex = document.createElement('div');
            renderTex(tex, '\\displaystyle ' + l.latex);
            body.appendChild(tex);
            if (l.error) {
                li.classList.add('expr_err');
                const err = document.createElement('div');
                err.textContent = l.error;
                body.appendChild(err);
            }
            li.append(sw, body);
            exprsEl.appendChild(li);
        });
    }

    // ---------- パラメータ UI ----------
    function fmt(v) {
        if (!isFinite(v)) return String(v);
        return String(parseFloat(v.toPrecision(10)));
    }

    function makeParamRow(name) {
        const row = document.createElement('div');
        row.className = 'param';
        row.innerHTML =
            '<div class="param_head">' +
            '<span class="param_name"></span><span>=</span>' +
            '<input type="number" class="param_val" step="any" aria-label="値">' +
            '<button type="button" class="play" title="自動で動かす">▶</button>' +
            '</div>' +
            '<input type="range" class="param_range">' +
            '<div class="param_bounds">' +
            '<label>最小 <input type="number" class="param_min" step="any"></label>' +
            '<label>最大 <input type="number" class="param_max" step="any"></label>' +
            '<label>刻み <input type="number" class="param_step" step="any" min="0"></label>' +
            '</div>';
        const refs = {
            row,
            name: row.querySelector('.param_name'),
            val: row.querySelector('.param_val'),
            play: row.querySelector('.play'),
            range: row.querySelector('.param_range'),
            min: row.querySelector('.param_min'),
            max: row.querySelector('.param_max'),
            step: row.querySelector('.param_step'),
        };
        renderTex(refs.name, name);
        const p = () => state.params[name];

        refs.range.addEventListener('input', () => {
            p().value = parseFloat(refs.range.value);
            refs.val.value = fmt(p().value);
            changed();
        });
        refs.val.addEventListener('input', () => {
            const v = parseFloat(refs.val.value);
            if (!isFinite(v)) return;
            p().value = v;
            // 範囲外の値が入力されたら範囲を広げる
            if (v < p().min) { p().min = v; refs.min.value = fmt(v); }
            if (v > p().max) { p().max = v; refs.max.value = fmt(v); }
            applyRangeAttrs(name);
            changed();
        });
        const onBounds = () => {
            const mn = parseFloat(refs.min.value);
            const mx = parseFloat(refs.max.value);
            const st = parseFloat(refs.step.value);
            const okRange = isFinite(mn) && isFinite(mx) && mn < mx;
            const okStep = isFinite(st) && st > 0;
            refs.min.classList.toggle('invalid', !okRange);
            refs.max.classList.toggle('invalid', !okRange);
            refs.step.classList.toggle('invalid', !okStep);
            if (okRange) {
                p().min = mn;
                p().max = mx;
                p().value = Math.min(mx, Math.max(mn, p().value));
            }
            if (okStep) p().step = st;
            applyRangeAttrs(name);
            refs.val.value = fmt(p().value);
            changed();
        };
        refs.min.addEventListener('change', onBounds);
        refs.max.addEventListener('change', onBounds);
        refs.step.addEventListener('change', onBounds);
        refs.play.addEventListener('click', () => togglePlay(name));
        return refs;
    }

    function applyRangeAttrs(name) {
        const p = state.params[name], r = paramRows[name];
        if (!r) return;
        // min/max/step を先に設定してから value（順序が逆だとブラウザが値を丸めてしまう）
        r.range.min = p.min;
        r.range.max = p.max;
        r.range.step = p.step > 0 ? p.step : 'any';
        r.range.value = p.value;
    }

    function fillParamRow(name) {
        const p = state.params[name], r = paramRows[name];
        r.val.value = fmt(p.value);
        r.min.value = fmt(p.min);
        r.max.value = fmt(p.max);
        r.step.value = fmt(p.step);
        applyRangeAttrs(name);
    }

    function syncParamRows() {
        Object.keys(paramRows).forEach(name => {
            if (!state.paramOrder.includes(name)) {
                stopPlay(name);
                paramRows[name].row.remove();
                delete paramRows[name];
            }
        });
        state.paramOrder.forEach(name => {
            if (!paramRows[name]) {
                paramRows[name] = makeParamRow(name);
                fillParamRow(name);
            }
            paramsEl.appendChild(paramRows[name].row); // 並び順を揃える
        });
        noParamsEl.hidden = state.paramOrder.length > 0;
    }

    // ▶: 最小〜最大を往復させる（全範囲を約4秒で）
    function togglePlay(name) {
        if (playing[name]) stopPlay(name);
        else {
            playing[name] = { dir: 1, last: performance.now() };
            paramRows[name].play.textContent = '❚❚';
            requestAnimationFrame(tick);
        }
    }
    function stopPlay(name) {
        delete playing[name];
        if (paramRows[name]) paramRows[name].play.textContent = '▶';
    }
    function tick(now) {
        const names = Object.keys(playing);
        if (names.length === 0) return;
        names.forEach(name => {
            const pl = playing[name], p = state.params[name];
            const dt = Math.min(0.1, (now - pl.last) / 1000);
            pl.last = now;
            let v = p.value + pl.dir * (p.max - p.min) * dt / 4;
            if (v >= p.max) { v = p.max; pl.dir = -1; }
            if (v <= p.min) { v = p.min; pl.dir = 1; }
            p.value = v;
            const r = paramRows[name];
            r.range.value = v;
            r.val.value = fmt(Math.round(v / p.step) * p.step);
        });
        changed();
        requestAnimationFrame(tick);
    }

    function changed() {
        scheduleDraw();
        scheduleHash();
    }

    // ---------- 表示範囲 ----------
    let cssW = 0, cssH = 0, dpr = 1;

    function defaultView() {
        const yHalf = cssW > 0 ? DEFAULT_X_HALF * cssH / cssW : DEFAULT_X_HALF;
        return { xmin: -DEFAULT_X_HALF, xmax: DEFAULT_X_HALF, ymin: -yHalf, ymax: yHalf };
    }

    function setView(v) {
        if (!(v.xmax > v.xmin) || !(v.ymax > v.ymin)) return;
        if (!isFinite(v.xmax - v.xmin) || !isFinite(v.ymax - v.ymin)) return;
        if (v.xmax - v.xmin < 1e-12 || v.ymax - v.ymin < 1e-12) return; // 拡大しすぎ防止
        state.view = v;
        updateViewInputs();
        changed();
    }

    function updateViewInputs() {
        const v = state.view;
        // 範囲の 1/1000 程度の精度で丸めて表示
        const digits = span => Math.max(0, Math.ceil(-Math.log10(span / 1000)));
        const dx = digits(v.xmax - v.xmin), dy = digits(v.ymax - v.ymin);
        Object.keys(viewInputs).forEach(k => {
            if (document.activeElement === viewInputs[k]) return;
            viewInputs[k].value = fmt(parseFloat(v[k].toFixed(Math.min(20, k[0] === 'x' ? dx : dy))));
        });
    }

    Object.keys(viewInputs).forEach(k => {
        viewInputs[k].addEventListener('change', () => {
            const n = parseFloat(viewInputs[k].value);
            const next = Object.assign({}, state.view, { [k]: n });
            const ok = isFinite(n) && next.xmax > next.xmin && next.ymax > next.ymin;
            viewInputs[k].classList.toggle('invalid', !ok);
            if (ok) setView(next);
        });
    });

    function zoomAt(px, py, fx, fy) {
        const v = state.view;
        const cx = v.xmin + (px / cssW) * (v.xmax - v.xmin);
        const cy = v.ymax - (py / cssH) * (v.ymax - v.ymin);
        setView({
            xmin: cx - (cx - v.xmin) * fx,
            xmax: cx + (v.xmax - cx) * fx,
            ymin: cy - (cy - v.ymin) * fy,
            ymax: cy + (v.ymax - cy) * fy,
        });
    }

    $('zoom_in').addEventListener('click', () => zoomAt(cssW / 2, cssH / 2, 0.8, 0.8));
    $('zoom_out').addEventListener('click', () => zoomAt(cssW / 2, cssH / 2, 1.25, 1.25));
    $('reset_view').addEventListener('click', () => setView(defaultView()));

    // ---------- 操作（ドラッグ・ピンチ・ホイール） ----------
    const pointers = new Map();
    let pinchStart = null;

    canvas.addEventListener('pointerdown', e => {
        canvas.setPointerCapture(e.pointerId);
        pointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
        canvas.classList.add('dragging');
        if (pointers.size === 2) {
            const [a, b] = [...pointers.values()];
            pinchStart = { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1 };
        }
    });
    canvas.addEventListener('pointermove', e => {
        showCoord(e.offsetX, e.offsetY);
        const prev = pointers.get(e.pointerId);
        if (!prev) return;
        const cur = { x: e.offsetX, y: e.offsetY };
        if (pointers.size === 1) {
            const v = state.view;
            const sx = (v.xmax - v.xmin) / cssW, sy = (v.ymax - v.ymin) / cssH;
            const mx = (cur.x - prev.x) * sx, my = (cur.y - prev.y) * sy;
            setView({ xmin: v.xmin - mx, xmax: v.xmax - mx, ymin: v.ymin + my, ymax: v.ymax + my });
        } else if (pointers.size === 2 && pinchStart) {
            const other = [...pointers.entries()].find(([id]) => id !== e.pointerId)[1];
            const before = Math.hypot(prev.x - other.x, prev.y - other.y) || 1;
            const after = Math.hypot(cur.x - other.x, cur.y - other.y) || 1;
            const f = before / after;
            zoomAt((cur.x + other.x) / 2, (cur.y + other.y) / 2, f, f);
        }
        pointers.set(e.pointerId, cur);
    });
    const endPointer = e => {
        pointers.delete(e.pointerId);
        if (pointers.size < 2) pinchStart = null;
        if (pointers.size === 0) canvas.classList.remove('dragging');
    };
    canvas.addEventListener('pointerup', endPointer);
    canvas.addEventListener('pointercancel', endPointer);
    canvas.addEventListener('pointerleave', () => { coordEl.textContent = ''; });
    canvas.addEventListener('wheel', e => {
        e.preventDefault();
        const f = Math.exp(e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0015));
        zoomAt(e.offsetX, e.offsetY, f, f);
    }, { passive: false });

    function showCoord(px, py) {
        const v = state.view;
        const x = v.xmin + (px / cssW) * (v.xmax - v.xmin);
        const y = v.ymax - (py / cssH) * (v.ymax - v.ymin);
        const d = Math.max(0, Math.ceil(-Math.log10((v.xmax - v.xmin) / cssW)));
        coordEl.textContent = '(' + x.toFixed(d) + ', ' + y.toFixed(d) + ')';
    }

    // ---------- 描画 ----------
    let drawQueued = false;
    function scheduleDraw() {
        if (drawQueued) return;
        drawQueued = true;
        requestAnimationFrame(() => { drawQueued = false; draw(); });
    }

    function resize() {
        const rect = canvas.getBoundingClientRect();
        const oldW = cssW, oldH = cssH;
        cssW = rect.width;
        cssH = rect.height;
        dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
        if (!state.view) state.view = defaultView();
        else if (oldW > 0 && oldH > 0) {
            // 縦横比を保ったまま、画面サイズの変化に合わせて表示範囲を伸縮
            const v = state.view;
            const cx = (v.xmin + v.xmax) / 2, cy = (v.ymin + v.ymax) / 2;
            const hx = (v.xmax - v.xmin) / 2 * cssW / oldW, hy = (v.ymax - v.ymin) / 2 * cssH / oldH;
            state.view = { xmin: cx - hx, xmax: cx + hx, ymin: cy - hy, ymax: cy + hy };
        }
        updateViewInputs();
        draw();
    }

    function niceStep(range, pixels, target) {
        const raw = range / Math.max(1, pixels / target);
        const mag = Math.pow(10, Math.floor(Math.log10(raw)));
        const r = raw / mag;
        return (r < 1.5 ? 1 : r < 3.5 ? 2 : r < 7.5 ? 5 : 10) * mag;
    }

    function tickLabel(v, step) {
        if (Math.abs(v) < step * 1e-6) return '0';
        const a = Math.abs(v);
        if (a >= 1e6 || a < 1e-4) return v.toExponential(Math.max(0, Math.round(Math.log10(a) - Math.log10(step))));
        return v.toFixed(Math.max(0, -Math.floor(Math.log10(step) + 1e-9)));
    }

    function draw() {
        if (!state.view || cssW === 0 || cssH === 0) return;
        const v = state.view;
        const W = cssW, H = cssH;
        const toPx = x => (x - v.xmin) / (v.xmax - v.xmin) * W;
        const toPy = y => (v.ymax - y) / (v.ymax - v.ymin) * H;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, H);

        // グリッド
        const sx = niceStep(v.xmax - v.xmin, W, 90);
        const sy = niceStep(v.ymax - v.ymin, H, 90);
        ctx.lineWidth = 1;
        // 細かい補助線 → 主線（x, y で刻みが違うので個別に）
        const gridXY = (stepX, stepY, color) => {
            ctx.strokeStyle = color;
            ctx.beginPath();
            for (let i = Math.ceil(v.xmin / stepX); i * stepX <= v.xmax; i++) {
                const px = Math.round(toPx(i * stepX)) + 0.5;
                ctx.moveTo(px, 0); ctx.lineTo(px, H);
            }
            for (let i = Math.ceil(v.ymin / stepY); i * stepY <= v.ymax; i++) {
                const py = Math.round(toPy(i * stepY)) + 0.5;
                ctx.moveTo(0, py); ctx.lineTo(W, py);
            }
            ctx.stroke();
        };
        gridXY(sx / 5, sy / 5, '#121212');
        gridXY(sx, sy, '#2a2a2a');

        // 軸
        const ax = toPy(0), ay = toPx(0);
        ctx.strokeStyle = '#bbbbbb';
        ctx.beginPath();
        if (ax >= 0 && ax <= H) { ctx.moveTo(0, Math.round(ax) + 0.5); ctx.lineTo(W, Math.round(ax) + 0.5); }
        if (ay >= 0 && ay <= W) { ctx.moveTo(Math.round(ay) + 0.5, 0); ctx.lineTo(Math.round(ay) + 0.5, H); }
        ctx.stroke();

        // 目盛りラベル（軸が画面外なら端に寄せる）
        ctx.font = '11px ui-monospace, Menlo, Consolas, monospace';
        ctx.fillStyle = '#9a9a9a';
        const labelY = Math.min(H - 14, Math.max(2, ax + 3));
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        for (let i = Math.ceil(v.xmin / sx); i * sx <= v.xmax; i++) {
            const px = toPx(i * sx);
            if (i === 0 || px < 16 || px > W - 16) continue; // 端で切れるラベルは出さない
            ctx.fillText(tickLabel(i * sx, sx), px, labelY);
        }
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const labelX = Math.min(W - 3, Math.max(40, ay - 4));
        for (let i = Math.ceil(v.ymin / sy); i * sy <= v.ymax; i++) {
            if (i === 0) continue;
            ctx.fillText(tickLabel(i * sy, sy), labelX, toPy(i * sy));
        }
        if (ax >= 0 && ax <= H && ay >= 0 && ay <= W) {
            ctx.textAlign = 'right';
            ctx.textBaseline = 'top';
            ctx.fillText('0', ay - 4, ax + 3);
        }

        // 曲線
        const env = { p: {}, fns: {} };
        state.paramOrder.forEach(n => { env.p[n] = state.params[n].value; });
        state.lines.forEach(l => { if (l.fn && l.name) env.fns[l.name] = l.fn; });

        const samples = Math.ceil(W * 2);
        const yRange = v.ymax - v.ymin;
        const clampPy = py => Math.max(-H * 4, Math.min(H * 5, py));
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        state.lines.forEach(l => {
            if (!l.fn) return;
            ctx.strokeStyle = l.color;
            ctx.beginPath();
            let prevY = NaN, penDown = false;
            for (let i = 0; i <= samples; i++) {
                const x = v.xmin + (i / samples) * (v.xmax - v.xmin);
                let y;
                try { y = l.fn(x, env); } catch (e) { y = NaN; }
                if (!isFinite(y)) { penDown = false; prevY = NaN; continue; }
                const px = (i / samples) * W;
                // 漸近線（tan など）: 画面外の上下をまたぐ大ジャンプは線を切る
                if (penDown && Math.abs(y - prevY) > yRange * 2 &&
                    ((y > v.ymax && prevY < v.ymin) || (y < v.ymin && prevY > v.ymax))) {
                    penDown = false;
                }
                const py = clampPy(toPy(y));
                if (penDown) ctx.lineTo(px, py);
                else { ctx.moveTo(px, py); penDown = true; }
                prevY = y;
            }
            ctx.stroke();
        });
    }

    // ---------- URL での共有 ----------
    let hashTimer = null;
    function scheduleHash() {
        clearTimeout(hashTimer);
        hashTimer = setTimeout(writeHash, 300);
    }
    function snapshot() {
        const p = {};
        state.paramOrder.forEach(n => {
            const q = state.params[n];
            p[n] = [q.value, q.min, q.max, q.step].map(x => parseFloat(x.toPrecision(8)));
        });
        const v = state.view;
        return {
            s: srcEl.value,
            p,
            v: v ? [v.xmin, v.xmax, v.ymin, v.ymax].map(x => parseFloat(x.toPrecision(8))) : null,
        };
    }
    function writeHash() {
        try {
            history.replaceState(null, '', '#' + encodeURIComponent(JSON.stringify(snapshot())));
        } catch (e) { /* file:// などで失敗しても無視 */ }
    }
    function readHash() {
        if (location.hash.length < 2) return false;
        try {
            const d = JSON.parse(decodeURIComponent(location.hash.slice(1)));
            if (typeof d.s === 'string') srcEl.value = d.s;
            if (d.p && typeof d.p === 'object') {
                Object.keys(d.p).forEach(n => {
                    const [value, min, max, step] = d.p[n].map(Number);
                    if ([value, min, max, step].every(isFinite) && min < max && step > 0) {
                        state.params[n] = { value, min, max, step };
                    }
                });
            }
            if (Array.isArray(d.v) && d.v.length === 4) {
                const [xmin, xmax, ymin, ymax] = d.v.map(Number);
                if (xmax > xmin && ymax > ymin) state.view = { xmin, xmax, ymin, ymax };
            }
            return typeof d.s === 'string';
        } catch (e) {
            return false;
        }
    }

    const toastEl = $('toast');
    let toastTimer = null;
    function toast(msg) {
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1600);
    }
    $('share').addEventListener('click', () => {
        writeHash();
        const url = location.href;
        const fallback = () => window.prompt('このURLをコピーしてください', url);
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(url).then(() => toast('URLをコピーしました'), fallback);
        } else fallback();
    });

    // ---------- 起動 ----------
    let inputTimer = null;
    srcEl.addEventListener('input', () => {
        clearTimeout(inputTimer);
        inputTimer = setTimeout(rebuild, 150);
    });

    if (!readHash()) srcEl.value = DEFAULT_SRC;
    // 初期サンプル用に見やすい値を入れておく
    if (!location.hash) {
        state.params.k = { value: 2, min: 0, max: 10, step: 0.1 };
        state.params['x_{0}'] = { value: 0, min: -5, max: 5, step: 0.1 };
    }
    new ResizeObserver(resize).observe(canvas);
    resize();
    rebuild();
})();

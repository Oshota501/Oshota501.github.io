// LaTeX 数式 → 評価可能な関数 への変換
// 外部ライブラリなし。tokenize → parse(AST) → compile(クロージャ) の3段階。
(function (global) {
    'use strict';

    // ---------- 定義 ----------
    const GREEK = [
        'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'varepsilon', 'zeta', 'eta',
        'theta', 'vartheta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'rho',
        'varrho', 'sigma', 'tau', 'upsilon', 'phi', 'varphi', 'chi', 'psi', 'omega',
        'Gamma', 'Delta', 'Theta', 'Lambda', 'Xi', 'Sigma', 'Upsilon', 'Phi', 'Psi', 'Omega'
    ];

    const FUNCS = {
        sin: Math.sin, cos: Math.cos, tan: Math.tan,
        sec: x => 1 / Math.cos(x), csc: x => 1 / Math.sin(x), cot: x => 1 / Math.tan(x),
        arcsin: Math.asin, arccos: Math.acos, arctan: Math.atan,
        arccot: x => Math.PI / 2 - Math.atan(x),
        sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
        sech: x => 1 / Math.cosh(x), csch: x => 1 / Math.sinh(x), coth: x => 1 / Math.tanh(x),
        arsinh: Math.asinh, arcosh: Math.acosh, artanh: Math.atanh,
        arcsinh: Math.asinh, arccosh: Math.acosh, arctanh: Math.atanh,
        exp: Math.exp, ln: Math.log, log: Math.log10, lg: Math.log10,
        sgn: Math.sign, sign: Math.sign, abs: Math.abs,
        floor: Math.floor, ceil: Math.ceil, round: Math.round,
        max: Math.max, min: Math.min
    };
    const VARIADIC = new Set(['max', 'min']);
    const INVERSE = {
        sin: 'arcsin', cos: 'arccos', tan: 'arctan', cot: 'arccot',
        sinh: 'arsinh', cosh: 'arcosh', tanh: 'artanh'
    };
    // バックスラッシュ無しで書かれても関数として扱う名前（長い順に照合）
    const PLAIN_NAMES = [
        'arcsin', 'arccos', 'arctan', 'sinh', 'cosh', 'tanh', 'sqrt', 'floor', 'round',
        'ceil', 'sin', 'cos', 'tan', 'exp', 'log', 'abs', 'max', 'min', 'sgn', 'ln', 'pi'
    ];
    const IGNORED_CMDS = new Set([
        'quad', 'qquad', 'displaystyle', 'textstyle', 'limits', 'nolimits',
        'big', 'Big', 'bigg', 'Bigg', 'bigl', 'bigr', 'Bigl', 'Bigr', 'biggl', 'biggr'
    ]);

    class LatexError extends Error {
        constructor(msg) { super(msg); this.name = 'LatexError'; }
    }

    // ---------- 前処理 ----------
    // $...$ や \[ \] などの囲みを外し、\\ で改行する
    function preprocess(src) {
        return src
            .replace(/\\\\/g, '\n')
            .replace(/\\(begin|end)\{[^}]*\}/g, '')
            .replace(/\$+/g, '')
            .replace(/\\[\[\]()]/g, '')
            .replace(/&/g, '')
            .split('\n')
            .map(l => l.trim().replace(/[,.;]+$/, '').trim());
    }

    // ---------- 字句解析 ----------
    function tokenize(src) {
        const toks = [];
        const n = src.length;
        let i = 0;
        let singleDigits = 0; // ^2x や \frac12 のように「数字1文字だけ」を取る残り回数

        const push = (t, v, extra) => {
            toks.push(Object.assign({ t, v }, extra));
            if (t !== 'num') singleDigits = 0;
        };
        const skipSpaces = () => { while (i < n && /\s/.test(src[i])) i++; };
        const readBraceGroup = () => {
            // src[i] === '{' を前提に、対応する } までの生文字列を返す
            let depth = 0, start = i + 1;
            for (; i < n; i++) {
                if (src[i] === '{') depth++;
                else if (src[i] === '}') { depth--; if (depth === 0) { i++; return src.slice(start, i - 1); } }
            }
            throw new LatexError('{ が閉じられていません');
        };
        // 識別子の直後の添字 (a_1, a_{12}, x_\alpha) を取り込む
        const readSubscript = () => {
            if (src[i] !== '_') return null;
            const save = i;
            i++;
            skipSpaces();
            let sub;
            if (src[i] === '{') sub = readBraceGroup();
            else if (src[i] === '\\') {
                let j = i + 1;
                while (j < n && /[a-zA-Z]/.test(src[j])) j++;
                sub = src.slice(i, j); i = j;
            } else if (i < n && /[a-zA-Z0-9]/.test(src[i])) sub = src[i++];
            else { i = save; return null; }
            sub = sub.replace(/\s+/g, '');
            if (!sub) throw new LatexError('添字が空です');
            return sub;
        };
        const pushIdent = (base) => {
            const sub = readSubscript();
            if (sub !== null) { push('id', base + '_{' + sub + '}'); return; }
            if (base === 'e') { push('num', Math.E); return; }
            push('id', base);
        };

        const handleCommand = (name) => {
            if (IGNORED_CMDS.has(name)) return;
            if (name === 'left' || name === 'right') {
                skipSpaces();
                if (src[i] === '.') i++;
                return;
            }
            if (name === 'cdot' || name === 'times' || name === 'ast') return push('op', '*');
            if (name === 'div') return push('op', '/');
            if (name === 'pi') return push('num', Math.PI);
            if (name === 'infty') return push('num', Infinity);
            if (name === 'vert' || name === 'lvert' || name === 'rvert' || name === 'mid') return push('op', '|');
            if (name === 'lfloor' || name === 'rfloor' || name === 'lceil' || name === 'rceil') return push('op', name);
            if (name === 'frac' || name === 'dfrac' || name === 'tfrac') { push('frac', 'frac'); singleDigits = 2; return; }
            if (name === 'sqrt') { push('sqrt', 'sqrt'); singleDigits = 1; return; }
            if (GREEK.includes(name)) return pushIdent('\\' + name.replace(/^var/, ''));
            if (Object.prototype.hasOwnProperty.call(FUNCS, name)) return push('func', name);
            if (['operatorname', 'mathrm', 'text', 'textrm', 'mathit', 'mathbf', 'rm'].includes(name)) {
                skipSpaces();
                if (src[i] !== '{') throw new LatexError('\\' + name + ' の後に { } が必要です');
                const content = readBraceGroup().replace(/\s+/g, '');
                if (Object.prototype.hasOwnProperty.call(FUNCS, content)) return push('func', content);
                if (content === 'e') return push('num', Math.E);
                if (!/^[a-zA-Z]+$/.test(content)) throw new LatexError('\\' + name + '{' + content + '} は解釈できません');
                return pushIdent(content);
            }
            throw new LatexError('未対応のコマンド: \\' + name);
        };

        while (i < n) {
            const c = src[i];
            if (/\s/.test(c)) { i++; continue; }

            if (c === '\\') {
                let j = i + 1;
                if (j < n && /[a-zA-Z]/.test(src[j])) {
                    while (j < n && /[a-zA-Z]/.test(src[j])) j++;
                    const name = src.slice(i + 1, j);
                    i = j;
                    handleCommand(name);
                } else {
                    const s = src[j];
                    i = j + 1;
                    if (s === undefined || ',;:! '.includes(s)) continue; // 空白系
                    if (s === '{') push('op', '(');
                    else if (s === '}') push('op', ')');
                    else if (s === '|') push('op', '|');
                    else throw new LatexError('未対応の記号: \\' + s);
                }
                continue;
            }

            if (/[0-9.]/.test(c)) {
                let j = i;
                if (singleDigits > 0) {
                    j = i + 1;
                    singleDigits--;
                } else {
                    let dot = false;
                    while (j < n && /[0-9.]/.test(src[j])) {
                        if (src[j] === '.') { if (dot) break; dot = true; }
                        j++;
                    }
                }
                const text = src.slice(i, j);
                if (text === '.') throw new LatexError('不正な数値: .');
                const v = parseFloat(text);
                i = j;
                // singleDigits は維持したいので push を経由しない
                toks.push({ t: 'num', v });
                continue;
            }

            if (/[a-zA-Z]/.test(c)) {
                const plain = PLAIN_NAMES.find(name => src.startsWith(name, i));
                if (plain) {
                    i += plain.length;
                    if (plain === 'pi') push('num', Math.PI);
                    else if (plain === 'sqrt') { push('sqrt', 'sqrt'); singleDigits = 1; }
                    else push('func', plain);
                    continue;
                }
                i++;
                pushIdent(c);
                continue;
            }

            i++;
            if ('+-*/^_()[]{}|,=!'.includes(c)) {
                push('op', c);
                if (c === '^') singleDigits = 1;
                continue;
            }
            if (c === '−' || c === '–') { push('op', '-'); continue; }
            if (c === '·' || c === '×' || c === '⋅') { push('op', '*'); continue; }
            if (c === '÷') { push('op', '/'); continue; }
            if (c === 'π') { push('num', Math.PI); continue; }
            throw new LatexError('解釈できない文字: ' + c);
        }
        return toks;
    }

    // ---------- 構文解析 ----------
    const CLOSERS = { '(': ')', '[': ']', '{': '}' };

    class Parser {
        constructor(toks, userFuncs) {
            this.toks = toks;
            this.p = 0;
            this.absDepth = 0;
            this.userFuncs = userFuncs || new Set();
        }
        peek() { return this.toks[this.p]; }
        next() { return this.toks[this.p++]; }
        isOp(v) { const t = this.peek(); return !!t && t.t === 'op' && t.v === v; }
        expect(v) {
            if (!this.isOp(v)) {
                const t = this.peek();
                const label = { rfloor: '\\rfloor', rceil: '\\rceil' }[v] || v;
                throw new LatexError(label + ' が必要です' + (t ? '（' + describe(t) + ' があります）' : '（式が途中で終わっています）'));
            }
            this.p++;
        }
        end() { return this.p >= this.toks.length; }

        // 括弧の中では | を新しい絶対値の開始として扱えるよう absDepth をリセットする
        group(open) {
            this.expect(open);
            const saved = this.absDepth;
            this.absDepth = 0;
            const e = this.parseExpr();
            this.expect(CLOSERS[open]);
            this.absDepth = saved;
            return e;
        }

        parseExpr() {
            let left = this.parseTerm();
            while (this.isOp('+') || this.isOp('-')) {
                const op = this.next().v;
                left = { k: 'bin', op, a: left, b: this.parseTerm() };
            }
            return left;
        }

        parseTerm() {
            let left = this.parseUnary();
            for (;;) {
                if (this.isOp('*') || this.isOp('/')) {
                    const op = this.next().v;
                    left = { k: 'bin', op, a: left, b: this.parseUnary() };
                } else if (this.startsPrimary()) {
                    left = { k: 'bin', op: '*', a: left, b: this.parsePower() }; // 暗黙の掛け算
                } else break;
            }
            return left;
        }

        parseUnary() {
            if (this.isOp('-')) { this.next(); return { k: 'neg', a: this.parseUnary() }; }
            if (this.isOp('+')) { this.next(); return this.parseUnary(); }
            return this.parsePower();
        }

        parsePower() {
            const base = this.parsePostfix();
            if (this.isOp('^')) {
                this.next();
                return { k: 'pow', a: base, b: this.parseScript() };
            }
            return base;
        }

        // ^ や _ の後ろ: {..} か 1 要素だけ
        parseScript() {
            if (this.isOp('-')) { this.next(); return { k: 'neg', a: this.parseScript() }; }
            if (this.isOp('+')) { this.next(); return this.parseScript(); }
            if (this.isOp('{')) return this.group('{');
            return this.parsePrimary();
        }

        parsePostfix() {
            let a = this.parsePrimary();
            while (this.isOp('!')) { this.next(); a = { k: 'fact', a }; }
            return a;
        }

        startsPrimary() {
            const t = this.peek();
            if (!t) return false;
            if (t.t !== 'op') return true; // num, id, func, frac, sqrt
            if (t.v === '(' || t.v === '[' || t.v === '{' || t.v === 'lfloor' || t.v === 'lceil') return true;
            if (t.v === '|') return this.absDepth === 0;
            return false;
        }

        // \frac や \sqrt の引数: {..} か 1 要素
        parseArg() {
            if (this.isOp('{')) return this.group('{');
            return this.parsePrimary();
        }

        parsePrimary() {
            const t = this.peek();
            if (!t) throw new LatexError('式が途中で終わっています');
            switch (t.t) {
                case 'num':
                    this.next();
                    return { k: 'num', v: t.v };
                case 'id':
                    this.next();
                    if (this.userFuncs.has(t.v) && this.isOp('(')) {
                        return { k: 'ucall', name: t.v, args: this.parseCallArgs('(') };
                    }
                    return { k: 'var', name: t.v };
                case 'frac': {
                    this.next();
                    const a = this.parseArg();
                    const b = this.parseArg();
                    return { k: 'bin', op: '/', a, b };
                }
                case 'sqrt': {
                    this.next();
                    if (this.isOp('[')) {
                        const index = this.group('[');
                        return { k: 'root', n: index, a: this.parseArg() };
                    }
                    return { k: 'sqrt', a: this.parseArg() };
                }
                case 'func':
                    this.next();
                    return this.parseFunc(t.v);
            }
            // op
            if (t.v === '(' || t.v === '[' || t.v === '{') return this.group(t.v);
            if (t.v === '|') {
                this.next();
                this.absDepth++;
                const e = this.parseExpr();
                this.expect('|');
                this.absDepth--;
                return { k: 'call', name: 'abs', args: [e] };
            }
            if (t.v === 'lfloor' || t.v === 'lceil') {
                this.next();
                const saved = this.absDepth;
                this.absDepth = 0;
                const e = this.parseExpr();
                this.expect(t.v === 'lfloor' ? 'rfloor' : 'rceil');
                this.absDepth = saved;
                return { k: 'call', name: t.v === 'lfloor' ? 'floor' : 'ceil', args: [e] };
            }
            throw new LatexError('予期しない記号: ' + describe(t));
        }

        parseCallArgs(open) {
            this.expect(open);
            const saved = this.absDepth;
            this.absDepth = 0;
            const args = [this.parseExpr()];
            while (this.isOp(',')) { this.next(); args.push(this.parseExpr()); }
            this.expect(CLOSERS[open]);
            this.absDepth = saved;
            return args;
        }

        parseFunc(name) {
            let power = null, base = null;
            for (let k = 0; k < 2; k++) {
                if (this.isOp('^') && !power) { this.next(); power = this.parseScript(); }
                else if (this.isOp('_') && !base) { this.next(); base = this.parseScript(); }
                else break;
            }
            // \sin^{-1} → arcsin
            if (power && power.k === 'neg' && power.a.k === 'num' && power.a.v === 1 && INVERSE[name]) {
                name = INVERSE[name];
                power = null;
            }
            if (base && name !== 'log') throw new LatexError('\\' + name + ' に添字は使えません');

            let args;
            if (this.isOp('(') || this.isOp('[')) args = this.parseCallArgs(this.peek().v);
            else if (this.isOp('{')) args = [this.group('{')];
            else args = [this.parseChain(name)];

            if (VARIADIC.has(name)) {
                if (args.length < 1) throw new LatexError('\\' + name + ' の引数がありません');
            } else if (args.length !== 1) {
                throw new LatexError('\\' + name + ' の引数は1つです');
            }

            let node = { k: 'call', name, args, base };
            if (power) node = { k: 'pow', a: node, b: power };
            return node;
        }

        // \sin 2x のような括弧なしの引数。+ - や次の関数で止まる
        parseChain(name) {
            if (this.isOp('-')) { this.next(); return { k: 'neg', a: this.parseChain(name) }; }
            if (!this.startsPrimary()) throw new LatexError('\\' + name + ' の引数がありません');
            let a = this.parsePower();
            while (this.startsPrimary() && this.peek().t !== 'func') {
                a = { k: 'bin', op: '*', a, b: this.parsePower() };
            }
            return a;
        }
    }

    function describe(t) {
        if (t.t === 'num') return String(t.v);
        if (t.t === 'id') return t.v;
        if (t.t === 'func') return '\\' + t.v;
        if (t.t === 'frac' || t.t === 'sqrt') return '\\' + t.t;
        return t.v;
    }

    // ---------- 1 行の解析 ----------
    // 戻り値: { name, ast, vars }  name は f(x)= の f（y= や式だけなら null）
    function lhsFunctionName(toks) {
        if (toks.length === 4 && toks[0].t === 'id' && toks[1].t === 'op' && toks[1].v === '('
            && toks[2].t === 'id' && toks[2].v === 'x' && toks[3].t === 'op' && toks[3].v === ')') {
            return toks[0].v;
        }
        return null;
    }

    function splitEquation(toks) {
        const eq = [];
        toks.forEach((t, idx) => { if (t.t === 'op' && t.v === '=') eq.push(idx); });
        if (eq.length > 1) throw new LatexError('= は1つまでです');
        if (eq.length === 0) return { lhs: null, rhs: toks };
        return { lhs: toks.slice(0, eq[0]), rhs: toks.slice(eq[0] + 1) };
    }

    function parseLine(line, userFuncs) {
        const toks = tokenize(line);
        if (toks.length === 0) return null;
        const { lhs, rhs } = splitEquation(toks);
        let name = null;
        if (lhs) {
            if (lhs.length === 1 && lhs[0].t === 'id' && lhs[0].v === 'y') name = null;
            else if ((name = lhsFunctionName(lhs)) === null) {
                throw new LatexError('左辺は y または f(x) の形にしてください');
            }
        }
        if (rhs.length === 0) throw new LatexError('右辺が空です');
        const parser = new Parser(rhs, userFuncs);
        const ast = parser.parseExpr();
        if (!parser.end()) throw new LatexError('予期しない記号: ' + describe(parser.peek()));
        if (name && userFuncs && !userFuncs.has(name)) userFuncs.add(name);
        return { name, ast, vars: collectVars(ast) };
    }

    // 複数行をまとめて解析（f(x)=... を他の行から呼べるよう先に関数名を集める）
    function parseProgram(src) {
        const lines = preprocess(src);
        const userFuncs = new Set();
        lines.forEach(line => {
            try {
                const { lhs } = splitEquation(tokenize(line));
                const name = lhs && lhsFunctionName(lhs);
                if (name) userFuncs.add(name);
            } catch (e) { /* 本解析でエラーを出す */ }
        });
        return lines.map(line => {
            if (!line) return null;
            try {
                const r = parseLine(line, userFuncs);
                return r && Object.assign({ latex: line, error: null }, r);
            } catch (e) {
                if (!(e instanceof LatexError)) throw e;
                return { latex: line, error: e.message, name: null, ast: null, vars: [] };
            }
        }).filter(Boolean);
    }

    function collectVars(ast) {
        const out = [];
        (function walk(nd) {
            if (!nd || typeof nd !== 'object') return;
            if (nd.k === 'var' && nd.name !== 'x' && !out.includes(nd.name)) out.push(nd.name);
            for (const key of ['a', 'b', 'n', 'base']) if (nd[key]) walk(nd[key]);
            if (nd.args) nd.args.forEach(walk);
        })(ast);
        return out;
    }

    // ---------- 評価関数の生成 ----------
    // env = { x, p: {パラメータ名: 値}, fns: {関数名: (x, env) => number}, depth }
    function gamma(z) {
        if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
        const g = 7;
        const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
            -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
        z -= 1;
        let x = c[0];
        for (let i = 1; i < g + 2; i++) x += c[i] / (z + i);
        const t = z + g + 0.5;
        return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
    }
    function factorial(v) {
        if (Number.isInteger(v)) {
            if (v < 0) return NaN;
            if (v > 170) return Infinity;
            let r = 1;
            for (let i = 2; i <= v; i++) r *= i;
            return r;
        }
        return gamma(v + 1);
    }

    function compile(nd) {
        switch (nd.k) {
            case 'num': { const v = nd.v; return () => v; }
            case 'var': {
                if (nd.name === 'x') return env => env.x;
                const name = nd.name;
                return env => env.p[name];
            }
            case 'neg': { const a = compile(nd.a); return env => -a(env); }
            case 'bin': {
                const a = compile(nd.a), b = compile(nd.b);
                switch (nd.op) {
                    case '+': return env => a(env) + b(env);
                    case '-': return env => a(env) - b(env);
                    case '*': return env => a(env) * b(env);
                    case '/': return env => a(env) / b(env);
                }
                break;
            }
            case 'pow': {
                const a = compile(nd.a), b = compile(nd.b);
                return env => Math.pow(a(env), b(env));
            }
            case 'sqrt': { const a = compile(nd.a); return env => Math.sqrt(a(env)); }
            case 'root': {
                const a = compile(nd.a), n = compile(nd.n);
                return env => {
                    const v = a(env), k = n(env);
                    // 奇数乗根は負の数でも実数で返す (∛-8 = -2)
                    if (v < 0 && Number.isInteger(k) && k % 2 !== 0) return -Math.pow(-v, 1 / k);
                    return Math.pow(v, 1 / k);
                };
            }
            case 'fact': { const a = compile(nd.a); return env => factorial(a(env)); }
            case 'call': {
                const args = nd.args.map(compile);
                const f = FUNCS[nd.name];
                if (nd.base) {
                    const base = compile(nd.base), a = args[0];
                    return env => {
                        const v = a(env), b = base(env);
                        if (b === 10) return Math.log10(v);
                        if (b === 2) return Math.log2(v);
                        return Math.log(v) / Math.log(b);
                    };
                }
                if (args.length === 1) { const a = args[0]; return env => f(a(env)); }
                return env => f(...args.map(g => g(env)));
            }
            case 'ucall': {
                const name = nd.name;
                const a = nd.args[0];
                if (nd.args.length !== 1) throw new LatexError(name + '(x) の引数は1つです');
                const arg = compile(a);
                return env => {
                    const g = env.fns[name];
                    if (!g || env.depth > 32) return NaN; // 循環参照の保護
                    return g(arg(env), env);
                };
            }
        }
        throw new LatexError('内部エラー: ' + nd.k);
    }

    // AST から (x, p, fns) を受け取る関数を作る
    function makeFunction(ast) {
        const body = compile(ast);
        const fn = (x, env) => body({ x, p: env.p, fns: env.fns, depth: (env.depth || 0) + 1 });
        return fn;
    }

    const api = { preprocess, tokenize, parseLine, parseProgram, compile, makeFunction, collectVars, LatexError };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else global.LatexMath = api;
})(typeof window !== 'undefined' ? window : globalThis);

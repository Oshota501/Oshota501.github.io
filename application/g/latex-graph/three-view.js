// 3D 表示（奥行き軸を選んだときに main.js から動的に読み込まれる）
// 座標の対応: 横軸の変数 → X、奥行き軸の変数 → 奥(-Z)、式の値 y → 上(Y)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const SX = 10, SZ = 10, SY = 6; // 箱の大きさ
const CAMERA_POS = new THREE.Vector3(14, 10, 17);

function makeLabel(text, { size = 34, color = '#dddddd', italic = false } = {}) {
    const c = document.createElement('canvas');
    const g = c.getContext('2d');
    const font = (italic ? 'italic ' : '') + size + 'px serif';
    g.font = font;
    const w = Math.ceil(g.measureText(text).width) + 8;
    const h = Math.ceil(size * 1.4);
    c.width = w;
    c.height = h;
    g.font = font;
    g.fillStyle = color;
    g.textBaseline = 'middle';
    g.fillText(text, 4, h / 2);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
    const scale = 0.013;
    sprite.scale.set(w * scale, h * scale, 1);
    sprite.renderOrder = 10;
    return sprite;
}

function fmtTick(v) {
    if (!isFinite(v)) return String(v);
    const a = Math.abs(v);
    if (a !== 0 && (a >= 1e5 || a < 1e-3)) return v.toExponential(2);
    return String(parseFloat(v.toPrecision(4)));
}

export function create(container) {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 500);
    camera.position.copy(CAMERA_POS);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.12;
    controls.target.set(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(6, 12, 8);
    scene.add(sun);
    const back = new THREE.DirectionalLight(0xffffff, 0.5);
    back.position.set(-8, -6, -6);
    scene.add(back);

    // 外枠
    const box = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(SX, SY, SZ)),
        new THREE.LineBasicMaterial({ color: 0x555555 })
    );
    scene.add(box);

    // y = 0 の面のグリッド
    const zeroGrid = new THREE.GridHelper(SX, 10, 0x666666, 0x2a2a2a);
    zeroGrid.scale.z = SZ / SX;
    scene.add(zeroGrid);

    const surfaceGroup = new THREE.Group();
    scene.add(surfaceGroup);
    const labelGroup = new THREE.Group();
    scene.add(labelGroup);
    let labelKey = '';

    function resize() {
        const w = container.clientWidth, h = container.clientHeight;
        if (w === 0 || h === 0) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    new ResizeObserver(resize).observe(container);
    resize();

    let running = true;
    renderer.setAnimationLoop(() => {
        if (!running || container.hidden) return;
        controls.update();
        renderer.render(scene, camera);
    });

    function clearGroup(group) {
        for (const obj of [...group.children]) {
            group.remove(obj);
            obj.geometry && obj.geometry.dispose();
            if (obj.material) {
                if (obj.material.map) obj.material.map.dispose();
                obj.material.dispose();
            }
        }
    }

    function updateLabels(u, v, w) {
        const key = [u.name, u.min, u.max, v.name, v.min, v.max, w.min, w.max].map(String).join('|');
        if (key === labelKey) return;
        labelKey = key;
        clearGroup(labelGroup);
        const add = (sprite, x, y, z) => { sprite.position.set(x, y, z); labelGroup.add(sprite); };
        const yb = -SY / 2;
        // 横軸（手前の下の辺）
        add(makeLabel(u.name + ' = ' + fmtTick(u.min), { size: 26, color: '#999' }), -SX / 2 + 0.6, yb - 0.45, SZ / 2 + 0.6);
        add(makeLabel(u.name + ' = ' + fmtTick(u.max), { size: 26, color: '#999' }), SX / 2 - 1.0, yb - 0.45, SZ / 2 + 0.6);
        add(makeLabel(u.name, { italic: true }), 0, yb - 0.5, SZ / 2 + 0.9);
        // 奥行き軸（右の下の辺）
        add(makeLabel(v.name + ' = ' + fmtTick(v.min), { size: 26, color: '#999' }), SX / 2 + 1.0, yb - 0.2, SZ / 2 - 1.0);
        add(makeLabel(v.name + ' = ' + fmtTick(v.max), { size: 26, color: '#999' }), SX / 2 + 1.0, yb - 0.2, -SZ / 2 + 0.6);
        add(makeLabel(v.name, { italic: true }), SX / 2 + 1.2, yb - 0.5, 0);
        // 高さ（左奥の縦の辺）
        add(makeLabel(w.name + ' = ' + fmtTick(w.min), { size: 26, color: '#999' }), -SX / 2 - 0.7, -SY / 2, -SZ / 2);
        add(makeLabel(w.name + ' = ' + fmtTick(w.max), { size: 26, color: '#999' }), -SX / 2 - 0.7, SY / 2, -SZ / 2);
        add(makeLabel(w.name, { italic: true }), -SX / 2, SY / 2 + 0.6, -SZ / 2);
    }

    // data: { n, surfaces: [{color, values}], u, v, w }
    function update(data) {
        const { n, surfaces, u, v, w } = data;
        const N1 = n + 1;
        const wSpan = w.max - w.min;
        const toY = val => (val - w.min) / wSpan * SY - SY / 2;

        // y = 0 の面
        const y0 = toY(0);
        zeroGrid.visible = y0 >= -SY / 2 && y0 <= SY / 2;
        zeroGrid.position.y = y0;

        clearGroup(surfaceGroup);
        for (const s of surfaces) {
            const pos = new Float32Array(N1 * N1 * 3);
            const ok = new Uint8Array(N1 * N1);
            for (let i = 0; i < N1; i++) {
                const z = -((i / n) * SZ - SZ / 2); // 奥行き軸の最小が手前
                for (let j = 0; j < N1; j++) {
                    const k = i * N1 + j;
                    const val = s.values[k];
                    const inRange = isFinite(val) && val >= w.min - wSpan * 1e-6 && val <= w.max + wSpan * 1e-6;
                    ok[k] = inRange ? 1 : 0;
                    pos[k * 3] = (j / n) * SX - SX / 2;
                    pos[k * 3 + 1] = isFinite(val) ? Math.max(-SY / 2, Math.min(SY / 2, toY(val))) : 0;
                    pos[k * 3 + 2] = z;
                }
            }
            // 範囲外や未定義の点を含む三角形は描かない（はみ出た部分は切り取られる）
            const index = [];
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    const a = i * N1 + j, b = a + 1, c = a + N1, d = c + 1;
                    if (ok[a] && ok[c] && ok[b]) index.push(a, c, b);
                    if (ok[b] && ok[c] && ok[d]) index.push(b, c, d);
                }
            }
            const geom = new THREE.BufferGeometry();
            geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            geom.setIndex(index);
            geom.computeVertexNormals();
            const mesh = new THREE.Mesh(geom, new THREE.MeshPhongMaterial({
                color: s.color,
                side: THREE.DoubleSide,
                shininess: 40,
                transparent: true,
                opacity: 0.88,
                polygonOffset: true,
                polygonOffsetFactor: 1,
                polygonOffsetUnits: 1,
            }));
            surfaceGroup.add(mesh);

            // 等間隔の網目（断面の線）
            const lines = [];
            const every = Math.max(1, Math.round(n / 16));
            const seg = (p, q) => {
                if (!ok[p] || !ok[q]) return;
                lines.push(pos[p * 3], pos[p * 3 + 1], pos[p * 3 + 2], pos[q * 3], pos[q * 3 + 1], pos[q * 3 + 2]);
            };
            for (let i = 0; i < N1; i += every) for (let j = 0; j < n; j++) seg(i * N1 + j, i * N1 + j + 1);
            for (let j = 0; j < N1; j += every) for (let i = 0; i < n; i++) seg(i * N1 + j, (i + 1) * N1 + j);
            const lg = new THREE.BufferGeometry();
            lg.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
            surfaceGroup.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({
                color: 0x000000, transparent: true, opacity: 0.35,
            })));
        }
        updateLabels(u, v, w);
    }

    function resetCamera() {
        camera.position.copy(CAMERA_POS);
        controls.target.set(0, 0, 0);
        controls.update();
    }

    function dispose() {
        running = false;
        renderer.setAnimationLoop(null);
        clearGroup(surfaceGroup);
        clearGroup(labelGroup);
        controls.dispose();
        renderer.dispose();
        renderer.domElement.remove();
    }

    return { update, resetCamera, dispose };
}

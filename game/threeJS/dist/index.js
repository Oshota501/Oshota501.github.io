import * as THREE from "three";
import { Block } from "./func/3d_block.js";
import { Floor } from "./func/floor.js";
import { MoveGUI } from "./listener/mov.js";
import { PerspectiveGUI } from "./listener/perspective.js";
// --------------------------------------------------------------------------------
// メインのクラス
export class Main {
    addLight(x, y, z) {
        const light = new THREE.DirectionalLight(0xFFFFFF);
        light.intensity = 2; // 光の強さを倍に
        light.position.set(x, y, z); // ライトの方向
        this.lights.push(light);
        // シーンに追加
        this.scene.add(light);
    }
    addBlock(x, y, z) {
        const block = new Block(new THREE.Vector3(x, y, z), this.size);
        this.blocks.push(block);
        this.scene.add(block);
    }
    /**
     * カメラ位置を絶対座標で設定します。
     * @param x X座標（ワールド座標）
     * @param y Y座標
     * @param z Z座標
     */
    setCameraPosition(x, y, z) {
        this.camera.position.set(x, y, z);
    }
    /**
     * カメラを相対移動します（現在位置に加算）。
     */
    moveCameraBy(dx, dy, dz) {
        this.camera.position.x += dx;
        this.camera.position.y += dy;
        this.camera.position.z += dz;
    }
    /**
     * カメラを指定座標へ向けます（lookAt）。
     */
    lookAtCamera(x, y, z) {
        this.camera.lookAt(new THREE.Vector3(x, y, z));
    }
    // --------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------
    constructor() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas = document.querySelector("#myCanvas");
        this.size = 200;
        // --------------------------------------------------------------------------------
        // ライト
        // --------------------------------------------------------------------------------
        this.lights = [];
        // --------------------------------------------------------------------------------
        // ブロック
        // --------------------------------------------------------------------------------
        this.blocks = [];
        // --------------------------------------------------------------------------------
        // アニメーション関連
        // --------------------------------------------------------------------------------
        // イベントリスナー
        this.mov = new MoveGUI();
        this.perspective = new PerspectiveGUI(this);
        // アニメーション
        this.tick = () => {
            window.requestAnimationFrame(this.tick);
            this.mov.tick(this);
            this.perspective.tick();
            for (let i = 0; i < this.blocks.length; i++) {
                this.blocks[i].setColorMaterial((Math.floor(Math.random() * 0xFFFFFF)));
                this.blocks[i].rotation.y += 0.1;
                this.blocks[i].position.y = Math.sin(Date.now() * 0.001 + i) * 50;
            }
            // レンダリング
            this.renderer.render(this.scene, this.camera);
        };
        if (!this.canvas) {
            throw new Error("#myCanvas element not found");
        }
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(devicePixelRatio);
        // シーンを作成
        this.scene = new THREE.Scene();
        // カメラを作成（ローカル定数にして scene に追加）
        const camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
        // カメラの初期座標を設定（X座標:0, Y座標:0, Z座標:0）
        camera.position.set(0, 0, 1000);
        this.scene.add(camera);
        this.camera = camera;
        // 箱を作成
        for (let i = 0; i < 100; i++)
            this.addBlock(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10);
        // 平行光源
        this.addLight(1, 1, 1);
        // 床を追加
        this.floor = new Floor(0, 0, this.size * 16);
        this.scene.add(this.floor);
        // 初回実行
        this.tick();
        //# sourceMappingURL=index.js.map
    }
}
export const main = new Main();
//# sourceMappingURL=index.js.map
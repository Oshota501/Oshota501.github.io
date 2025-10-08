import * as THREE from "three";
import { Block } from "./func/3d_block.js";
import { Floor } from "./func/floor.js";
import { MoveGUI } from "./listener/mov.js";
// メインのクラス
export class Main {
    addLight() {
        const light = new THREE.DirectionalLight(0xFFFFFF);
        light.intensity = 2; // 光の強さを倍に
        light.position.set(1, 1, 1); // ライトの方向
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
    constructor() {
        this.width = 960;
        this.height = 540;
        this.canvas = document.querySelector("#myCanvas");
        this.lights = [];
        this.size = 200;
        //ユーザ定義のclass
        this.blocks = [];
        // イベントリスナー
        this.mov = new MoveGUI();
        // アニメーション
        this.tick = () => {
            window.requestAnimationFrame(this.tick);
            // 箱を回転させる
            for (let i = 0; i < this.blocks.length; i++) {
                this.blocks[i].rotation.x += 0.01;
                this.blocks[i].rotation.y += 0.01;
            }
            this.mov.tick(this);
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
        // カメラを作成
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 10000);
        // カメラの初期座標を設定（X座標:0, Y座標:0, Z座標:0）
        this.camera.position.set(0, 0, 1000);
        // 箱を作成
        this.addBlock(0, 0, 0);
        // 平行光源
        this.addLight();
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
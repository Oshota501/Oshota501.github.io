import * as THREE from "three";
import { Block } from "./func/3d_block.js";
class Main {
    addLight() {
        const light = new THREE.DirectionalLight(0xFFFFFF);
        light.intensity = 2; // 光の強さを倍に
        light.position.set(1, 1, 1); // ライトの方向
        this.lights.push(light);
        // シーンに追加
        this.scene.add(light);
    }
    addBlock(x, y, z) {
        const block = new Block(new THREE.Vector3(x, y, z), 30);
        this.blocks.push(block);
        this.scene.add(block);
    }
    constructor() {
        this.width = 960;
        this.height = 540;
        this.canvas = document.querySelector("#myCanvas");
        this.lights = [];
        //ユーザ定義のclass
        this.blocks = [];
        this.tick = () => {
            window.requestAnimationFrame(this.tick);
            // 箱を回転させる
            for (let i = 0; i < this.blocks.length; i++) {
                this.blocks[i].rotation.x += 0.01;
                this.blocks[i].rotation.y += 0.01;
                this.blocks[i].addPosition(Math.sin(this.blocks[i].rotation.x), Math.cos(this.blocks[i].rotation.y), Math.sin(this.blocks[i].rotation.z));
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
        // カメラを作成
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 10000);
        // カメラの初期座標を設定（X座標:0, Y座標:0, Z座標:0）
        this.camera.position.set(0, 0, 1000);
        // 箱を作成
        for (let i = 0; i < 100; i++) {
            this.addBlock(-Math.random() * 200, -Math.random() * 200, -Math.random() * 200);
        }
        // 平行光源
        this.addLight();
        // 初回実行
        this.tick();
        //# sourceMappingURL=index.js.map
    }
}
const main = new Main();
//# sourceMappingURL=index.js.map
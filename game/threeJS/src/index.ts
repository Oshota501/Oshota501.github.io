import * as THREE from "three";
import { Block } from "./func/3d_block.js"
import { Floor } from "./func/floor.js"
import { MoveGUI } from "./listener/mov.js"
	
// メインのクラス
export class Main {
	public width : number = 960 
	public height : number = 540
	public renderer : THREE.WebGLRenderer
	public canvas = document.querySelector("#myCanvas")
	public scene : THREE.Scene
	private lights : THREE.DirectionalLight [] = []
	public size : number = 200 
	public floor : Floor 

	public addLight () {
		const light = new THREE.DirectionalLight(0xFFFFFF);
		light.intensity = 2; // 光の強さを倍に
		light.position.set(1, 1, 1); // ライトの方向
		this.lights.push(light)
		// シーンに追加
		this.scene.add(light);	
	}

	//ユーザ定義のclass
	private blocks : Block[] = []
	public addBlock (x:number,y:number,z:number) {
		const block = new Block(new THREE.Vector3(x,y,z),this.size) ;
		this.blocks.push( block )
		this.scene.add(block);
	}
	// イベントリスナー
	public mov : MoveGUI = new MoveGUI()

	// アニメーション
	public tick = () => {
		window.requestAnimationFrame(this.tick);
		// 箱を回転させる
		for(let i = 0 ; i < this.blocks.length ; i ++){
			this.blocks[i].rotation.x += 0.01;
			this.blocks[i].rotation.y += 0.01;
		}
		this.mov.tick(this);
		// レンダリング
		this.renderer.render(this.scene, this.camera);
	}

	// カメラの移動
	public camera : THREE.PerspectiveCamera

	/**
	 * カメラ位置を絶対座標で設定します。
	 * @param x X座標（ワールド座標）
	 * @param y Y座標
	 * @param z Z座標
	 */
	public setCameraPosition(x: number, y: number, z: number) {
		this.camera.position.set(x, y, z);
	}

	/**
	 * カメラを相対移動します（現在位置に加算）。
	 */
	public moveCameraBy(dx: number, dy: number, dz: number) {
		this.camera.position.x += dx;
		this.camera.position.y += dy;
		this.camera.position.z += dz;
	}

	/**
	 * カメラを指定座標へ向けます（lookAt）。
	 */
	public lookAtCamera(x: number, y: number, z: number) {
		this.camera.lookAt(new THREE.Vector3(x, y, z));
	}

	constructor(){
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
	
		this.addBlock(0,0,0)
		// 平行光源
		this.addLight()

		// 床を追加
		this.floor = new Floor(0,0,this.size*16)
		this.scene.add(this.floor)
		// 初回実行

		this.tick();
		//# sourceMappingURL=index.js.map


	}
}

export const main = new Main()


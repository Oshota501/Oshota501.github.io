import * as THREE from "three";
export class FloorChunck extends THREE.Group {
    constructor(size) {
        super();
        // Plane: transparent fill
        const planeGeo = new THREE.PlaneGeometry(size, size);
        const planeMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.10,
            depthWrite: false,
        });
        this.plane = new THREE.Mesh(planeGeo, planeMat);
        // plane geometry is in X/Y; rotate to X/Z
        this.plane.rotation.x = -Math.PI / 2;
        this.plane.receiveShadow = true;
        this.add(this.plane);
        // Outline: white line along the boundary
        const half = size / 2;
        // 16ブロック1chunckで計算
        // create points in XZ plane (y = 0)
        const pts = [
            new THREE.Vector3(-half, 0, -half),
            new THREE.Vector3(half, 0, -half),
            new THREE.Vector3(half, 0, half),
            new THREE.Vector3(-half, 0, half),
        ];
        // Use LineLoop to automatically close the loop
        const outlineGeo = new THREE.BufferGeometry().setFromPoints(pts);
        const outlineMat = new THREE.LineBasicMaterial({ color: 0xffffff });
        const outline = new THREE.LineLoop(outlineGeo, outlineMat);
        // render on top so the white border is always visible
        outline.renderOrder = 999;
        outline.material.depthTest = false;
        this.outline = outline;
        this.add(this.outline);
    }
}
export class Floor extends THREE.Group {
    constructor(gridX, gridZ, size) {
        super();
        // multiple chuncks tiled to form a larger floor
        this.chuncks = [];
        this.size = size;
        this.grid = new THREE.Vector2(gridX, gridZ);
        // create 4 chuncks to form a larger floor
        for (let dz = 0; dz < 2; dz++) {
            for (let dx = 0; dx < 2; dx++) {
                const chunck = new FloorChunck(size);
                chunck.position.set((this.grid.x * 2 + dx) * size, 0, (this.grid.y * 2 + dz) * size);
                this.chuncks.push(chunck);
                this.add(chunck);
            }
        }
    }
}
//# sourceMappingURL=floor.js.map
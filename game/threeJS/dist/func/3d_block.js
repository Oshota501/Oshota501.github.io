import * as THREE from "three";
export class Block extends THREE.Mesh {
    // update mesh.position from logical grid coordinates
    updatePosition() {
        this.position.set(this.grid.x * this.size, this.grid.y * this.size, this.grid.z * this.size);
    }
    tick() {
        // tick should perform per-frame updates if needed; for now ensure position sync
        this.updatePosition();
    }
    setPosition(x, y, z) {
        this.grid.x = x;
        this.grid.y = y;
        this.grid.z = z;
        this.tick();
    }
    addPosition(dx, dy, dz) {
        this.grid.x += dx;
        this.grid.y += dy;
        this.grid.z += dz;
        this.tick();
    }
    // p is logical grid coords (not geometry size). size is used both for geometry and grid scale.
    constructor(p, size) {
        // create geometry sized to one grid cell
        const g = new THREE.BoxGeometry(size, size, size);
        const m = new THREE.MeshStandardMaterial({ color: 0xFFFF00 });
        super(g, m);
        this.geometry = g;
        this.material = m;
        this.size = size;
        // store grid coords as a copy
        this.grid = p.clone();
        // set initial world position based on grid
        this.updatePosition();
    }
}
//# sourceMappingURL=3d_block.js.map
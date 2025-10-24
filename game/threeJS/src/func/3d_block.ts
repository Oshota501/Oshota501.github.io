import * as THREE from "three";

export class Block extends THREE.Mesh {
    public geometry: THREE.BoxGeometry;
    public material: THREE.MeshStandardMaterial;
    private size: number; // size of one grid cell in world units
    // store logical grid coordinates separately from mesh.position
    public grid: THREE.Vector3;

    // update mesh.position from logical grid coordinates
    private updatePosition() {
        this.position.set(
            this.grid.x * this.size,
            this.grid.y * this.size,
            this.grid.z * this.size
        );
    }

    public tick(){
        // tick should perform per-frame updates if needed; for now ensure position sync
        this.updatePosition();
    }

    public setPosition(x:number,y:number,z:number) {
        this.grid.x = x
        this.grid.y = y
        this.grid.z = z
        this.tick()
    }
    public addPosition(dx:number,dy:number,dz:number) {
        this.grid.x += dx
        this.grid.y += dy
        this.grid.z += dz
        this.tick()
    }

    public materialColor : number = 0xFFFF00; // default yellow
    /**
    * @param color: hex color for material or geometry
    * Changes the color of the material or geometry
    */
    public setColorMaterial(color:number) {
        this.materialColor = color;
        (this.material as THREE.MeshStandardMaterial).color.setHex(color);
        this.material.needsUpdate = true; // Ensure material updates
    }

    /**
     * @param color hex color for geometry vertex colors
     * Changes the color of the geometry (vertex colors)
     */
    // public changeColorGeometry(color:number) {
    //     (this.geometry as THREE.BoxGeometry).attributes.color = new THREE.Float32BufferAttribute([
    //         ((color >> 16) & 0xFF) / 255,
    //         ((color >> 8) & 0xFF) / 255,
    //         (color & 0xFF) / 255,
    //     ], 3);
    //     this.geometry.attributes.color.needsUpdate = true; // Ensure geometry updates
    // }

    // p is logical grid coords (not geometry size). size is used both for geometry and grid scale.
    constructor(p: THREE.Vector3,size: number) {
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

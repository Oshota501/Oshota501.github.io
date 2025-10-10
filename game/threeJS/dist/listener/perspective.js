// Make sure the path is correct and the module exists
export class PerspectiveGUI {
    constructor(m) {
        this.speed = 10;
        // store last centered mouse coordinates
        this.lastMouse = { x: 0, y: 0 };
        // target angles (radians) the camera should rotate to
        this.targetYaw = 0;
        this.targetPitch = 0;
        // maximum allowed angles from center (radians)
        this.maxYaw = Math.PI / 6; // 30 degrees
        this.maxPitch = Math.PI / 8; // 22.5 degrees
        // smoothing factor for interpolation (0..1)
        this.smooth = 0.08;
        this.setListener();
        this.m = m;
    }
    tick() {
        // Update logic if needed
        // smooth interpolate current camera rotation toward target angles
        // yaw -> rotation.y, pitch -> rotation.x
        const cy = this.m.camera.rotation.y;
        const cx = this.m.camera.rotation.x;
        const ny = cy + (this.targetYaw - cy) * this.smooth;
        const nx = cx + (this.targetPitch - cx) * this.smooth;
        this.m.camera.rotation.y = ny;
        this.m.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, nx));
    }
    setListener() {
        document.addEventListener('mousemove', (event) => {
            // use centered coords so (0,0) is canvas center
            const c = this.mouseToCenter(event);
            // normalize by half-width/half-height to get -1..1 range
            const el = document.querySelector('#myCanvas') ?? document.documentElement;
            const rect = el.getBoundingClientRect();
            const nx = Math.max(-1, Math.min(1, c.x / (rect.width / 2)));
            const ny = Math.max(-1, Math.min(1, c.y / (rect.height / 2)));
            // compute target angles from normalized direction
            this.targetYaw = -nx * this.maxYaw; // negative so mouse right -> yaw negative (turn right)
            this.targetPitch = ny * this.maxPitch; // positive up
            // keep roll zero
            this.m.camera.rotation.z = 0;
        });
        window.addEventListener('mouseleave', (event) => {
            // Handle mouse leave if needed
        });
        document.addEventListener('mouseenter', (event) => {
            // Handle mouse enter if needed
        });
        document.addEventListener('click', (event) => {
            // Handle click events if needed
            this.m.camera.rotation.y = 0;
            this.m.camera.rotation.x = 0;
            this.m.camera.rotation.z = 0;
            // Always look at the origin (0,0,0)
            //this.m.lookAtCamera(0,0,0);
        });
    }
    mouseToCenter(e, element) {
        const el = element ?? document.querySelector('#myCanvas') ?? document.documentElement;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const x = e.clientX - cx;
        const y = cy - e.clientY; // up is positive
        this.lastMouse.x = x;
        this.lastMouse.y = y;
        return { x, y };
    }
    getCenteredMouse() {
        return { ...this.lastMouse };
    }
}
//# sourceMappingURL=perspective.js.map
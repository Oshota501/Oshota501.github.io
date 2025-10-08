// Make sure the path is correct and the module exists
export class MoveGUI {
    constructor() {
        this.speed = 3;
        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.setListener();
    }
    tick(m) {
        // Update logic if needed
        m.moveCameraBy((this.right ? 1 * this.speed : 0) - (this.left ? 1 * this.speed : 0), (this.up ? 1 * this.speed : 0) - (this.down ? 1 * this.speed : 0), (this.backward ? 1 * this.speed : 0) - (this.forward ? 1 * this.speed : 0));
    }
    setListener() {
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'w':
                    this.forward = true;
                    break;
                case 's':
                    this.backward = true;
                    break;
                case 'a':
                    this.left = true;
                    break;
                case 'd':
                    this.right = true;
                    break;
                case ' ':
                    this.up = true;
                    break;
                case 'Shift':
                    this.down = true;
                    break;
            }
        });
        document.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'w':
                    this.forward = false;
                    break;
                case 's':
                    this.backward = false;
                    break;
                case 'a':
                    this.left = false;
                    break;
                case 'd':
                    this.right = false;
                    break;
                case ' ':
                    this.up = false;
                    break;
                case 'Shift':
                    this.down = false;
                    break;
            }
        });
    }
}
//# sourceMappingURL=mov.js.map
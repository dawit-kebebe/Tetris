import { ISquare, Shape } from "./shape/Square";
import { StateMachine } from "./StateMachine";
// import JShape from "./J-Shape";
// import LShape from "./L-Shape";
// import OShape from "./O-Shape";
// import SShape from "./S-Shape";
// import TShape from "./T-Shape";
// import ZShape from "./Z-Shape";

class Tetris {
    static _DEBUG = true;
    private canv: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private sqr: ISquare = {
        dX: 200,
        dY: 0,
        dSize: 40,
        strokeColor: '#ff00ff',
        fillColor: '#00ff00'
    }

    rotation: number = 1
    lastTick: number | undefined;
    animationFrameId: number | undefined;
    static DELTA: number = 700;

    stateMachine: StateMachine | undefined;
    currentShape: Shape | null | undefined;

    constructor(canv: HTMLCanvasElement) {
        this.canv = canv;
        this.canv.width = 480;
        this.canv.height = 720;
        this.ctx = this.canv.getContext('2d') as CanvasRenderingContext2D
    }

    public start() {
        document.addEventListener('keydown', this.moveBottom.bind(this))
        document.addEventListener('keydown', this.moveTop.bind(this))
        document.addEventListener('keydown', this.moveLeft.bind(this))
        document.addEventListener('keydown', this.moveRight.bind(this))

        this.stateMachine = new StateMachine(this.canv, this.ctx);
        this.currentShape = this.stateMachine.getRandomShape();

        this.lastTick = Date.now();
        this.animationFrameId = requestAnimationFrame(() => {
            this.loop();
        });
    }

    public loop() {
        //12x18
        if (this.lastTick && (Date.now() - this.lastTick >= Tetris.DELTA)) {
            this.lastTick = Date.now();

            this.clearCanvas()
            this.renderDebugGrid()

            if (this.currentShape) {

                if (this.stateMachine?.checkEOLBottom(this.currentShape) || this.stateMachine?.checkCollisionBottom(this.currentShape)) {
                    const sealSqr = { ... this.sqr };
                    this.currentShape.setSquare(sealSqr);
                    this.stateMachine?.archiveShape(this.currentShape);
                    this.currentShape = this.stateMachine?.getRandomShape();
                    if (this.currentShape) {
                        this.sqr = {
                            dX: 200,
                            dY: 0,
                            dSize: 40,
                            strokeColor: '#ff00ff',
                            fillColor: '#00ff00'
                        }
                        this.rotation = 1;
                    }
                } else {
                    this.sqr.dY += 40;
                }

                this.currentShape?.setSquare(this.sqr)
                this.render()

            }

        }

        this.animationFrameId = requestAnimationFrame(() => this.loop())
    }

    public stop() {
        this.animationFrameId ? cancelAnimationFrame(this.animationFrameId) : undefined;
    }

    private moveLeft(event: KeyboardEvent) {
        if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
            if (this.currentShape && (!this.stateMachine?.checkEOLLeft(this.currentShape) && !this.stateMachine?.checkCollisionLeft(this.currentShape))) {
                this.sqr.dX -= this.sqr.dSize;
                this.currentShape.setSquare(this.sqr);
                this.clearCanvas()
                this.renderDebugGrid()
                this.render()
            }

            if (Tetris._DEBUG) { console.log('Move Left', this.currentShape?.getLeft()) }
        }
    }

    private moveRight(event: KeyboardEvent) {
        if (event.code === 'KeyD' || event.code === 'ArrowRight') {
            if (this.currentShape && (!this.stateMachine?.checkEOLRight(this.currentShape) && !this.stateMachine?.checkCollisionRight(this.currentShape))) {
                this.sqr.dX += this.sqr.dSize;
                this.currentShape.setSquare(this.sqr);
                this.clearCanvas()
                this.renderDebugGrid()
                this.render()
            }

            if (Tetris._DEBUG) { console.log('Move Right') }
        }
    }

    private moveTop(event: KeyboardEvent) {

        if (event.code === 'KeyW' || event.code === 'ArrowUp') {
            if (this.currentShape) {
                // this.changeRotation();
                // this.currentShape.rotate(this.rotation);
                // this.clearCanvas()
                // // this.renderDebugGrid()
                // this.render()

                const lastRotation = Number(this.rotation);
                const lastSqr = {...this.sqr};

                this.changeRotation(undefined)

                this.currentShape.rotate(this.rotation);
                this.currentShape.setSquare(this.sqr);

                if (this.stateMachine?.checkCollisionLeft(this.currentShape)) {
                    this.changeRotation(lastRotation)
                    this.currentShape.rotate(lastRotation);
                    this.currentShape.setSquare(lastSqr);

                    console.log("Collision left")
                }

                if (this.stateMachine?.checkCollisionRight(this.currentShape)) {
                    this.changeRotation(lastRotation)
                    this.currentShape.rotate(lastRotation);
                    this.currentShape.setSquare(lastSqr);

                    console.log("Collision right")
                }

                if (this.stateMachine?.checkCollisionBottom(this.currentShape)) {
                    this.changeRotation(lastRotation)
                    this.currentShape.rotate(lastRotation);
                    this.currentShape.setSquare(lastSqr);

                    console.log("Collision bottom")
                }

                if (this.stateMachine?.checkEOLLeft(this.currentShape)) {
                    this.changeRotation(lastRotation)
                    this.currentShape.rotate(lastRotation);
                    this.currentShape.setSquare(lastSqr);

                    console.log("EOL left")
                }

                if (this.stateMachine?.checkEOLRight(this.currentShape)) {
                    this.changeRotation(lastRotation)
                    this.currentShape.rotate(lastRotation);
                    this.currentShape.setSquare(lastSqr);

                    console.log("EOL right")
                }

                if (this.stateMachine?.checkEOLBottom(this.currentShape)) {
                    this.changeRotation(lastRotation)
                    this.currentShape.rotate(lastRotation);
                    this.currentShape.setSquare(lastSqr);

                    console.log("EOL bottom")
                }

                this.clearCanvas()
                this.renderDebugGrid()
                this.render()
                // console.log(`Last Rotation: ${lastRotation}\n Current Rotation: ${this.rotation}`);

                // if (Tetris._DEBUG) { console.log('Rotation', this.currentShape.rotation) }
            }
        }
    }

    private moveBottom(event: KeyboardEvent) {
        if (event.code === 'KeyS' || event.code === 'ArrowDown') {
            if (Tetris._DEBUG) { console.log('Put Down') }
        }
    }

    private changeRotation(rotation: number | undefined) {
        if (typeof rotation !== 'undefined'){
            this.rotation = rotation;
            return;
        }

        if (this.currentShape)
            this.rotation = (this.currentShape.rotation >= 4 ? 1 : this.currentShape.rotation + 1)
    }

    private clearCanvas() {
        this.ctx.clearRect(0, 0, this.canv.width, this.canv.height)
    }

    private renderDebugGrid() {
        if (Tetris._DEBUG) {
            for (let index = 0; index < 12; index++) {
                this.ctx.beginPath();
                this.ctx.moveTo(40 * index, 0);
                this.ctx.lineTo(40 * index, 720);
                this.ctx.stroke()
            }

            for (let index = 0; index < 18; index++) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, 40 * index);
                this.ctx.lineTo(480, 40 * index);
                this.ctx.stroke()
            }
        }
    }

    private render() {

        this.currentShape?.draw();

        const archivedSquares = this.stateMachine?.getArchivedSquares()

        if (archivedSquares) {
            for (let i = 0; i < archivedSquares.length; i++) {
                archivedSquares[i].draw();
            }
        }
    }

}

export default Tetris;
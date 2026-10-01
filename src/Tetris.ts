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


            this.ctx.clearRect(0, 0, this.canv.width, this.canv.height)

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

            if (this.currentShape) {

                if (this.stateMachine?.checkEOL(this.currentShape) || this.stateMachine?.checkCollision(this.currentShape)) {
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
                }

                this.currentShape?.setSquare(this.sqr)
                this.currentShape?.rotate(this.rotation)
                this.currentShape?.draw();
                this.sqr.dY += 40;
            }

            const archivedSquares = this.stateMachine?.getArchivedSquares()

            if (archivedSquares) {
                for (let i = 0; i < archivedSquares.length; i++) {
                    archivedSquares[i].draw();
                }
            }
        }

        this.animationFrameId = requestAnimationFrame(() => this.loop())
    }

    public stop() {
        this.animationFrameId ? cancelAnimationFrame(this.animationFrameId) : undefined;
    }

    private moveLeft(event: KeyboardEvent) {
        if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
            if (this.currentShape && this.currentShape.getLeft() >= 0) {
                if (this.currentShape.getLeft() <= 0)
                    null
                else {
                    this.sqr.dX -= this.sqr.dSize;
                }

            }
            if (Tetris._DEBUG) { console.log('Move Left', this.currentShape?.getLeft()) }
        }
    }

    private moveRight(event: KeyboardEvent) {
        if (event.code === 'KeyD' || event.code === 'ArrowRight') {
            if (this.currentShape && this.currentShape.getRight() <= this.canv.width) {
                if (this.currentShape.getRight() >= this.canv.width)
                    null;
                else
                    this.sqr.dX += this.sqr.dSize;
            }
            if (Tetris._DEBUG) { console.log('Move Right') }
        }
    }

    private moveTop(event: KeyboardEvent) {

        if (event.code === 'KeyW' || event.code === 'ArrowUp') {
            if (this.currentShape) {
                this.changeRotation();
                if (Tetris._DEBUG) { console.log('Rotation', this.currentShape.rotation) }
            }
        }
    }

    private moveBottom(event: KeyboardEvent) {
        if (event.code === 'KeyS' || event.code === 'ArrowDown') {
            if (Tetris._DEBUG) { console.log('Put Down') }
        }
    }

    private changeRotation() {
        if (this.currentShape)
            this.rotation = (this.currentShape.rotation >= 4 ? 1 : this.currentShape.rotation + 1)
    }
}

export default Tetris;
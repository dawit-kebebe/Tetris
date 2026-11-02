import IShape from "./shape/I-Shape";
import JShape from "./shape/J-Shape";
import LShape from "./shape/L-Shape";
import OShape from "./shape/O-Shape";
import SShape from "./shape/S-Shape";
import { ISquare, type Rotation, Shape } from "./shape/Square";
import TShape from "./shape/T-Shape";
import ZShape from "./shape/Z-Shape";
import { State } from "./State";

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

    private rotation: Rotation = 1

    private lastTick: number | undefined;
    private animationFrameId: number | undefined;
    
    private state: State | undefined;
    private currentShape: Shape | null | undefined;
    
    private gameOverSequence?: () => void;
    
    static DELTA: number = 700;

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

        this.state = new State();
        this.currentShape = this.getRandomShape();

        this.lastTick = Date.now();
        this.animationFrameId = requestAnimationFrame(() => {
            this.loop();
        });
    }

    public loop() {
        //12x18
        if (this.lastTick && (Date.now() - this.lastTick >= Tetris.DELTA)) {
            this.lastTick = Date.now();

            if (this.currentShape) {
                this.sqr.dY += this.sqr.dSize;
                this.currentShape?.setSquare(this.sqr)

                if (!this.state?.isValidPosition(this.currentShape)) {
                    this.sqr.dY -= this.sqr.dSize;
                    this.currentShape?.setSquare(this.sqr)

                    this.state?.setArrivedShape(this.currentShape);
                    this.state?.clearCompletedRaw();

                    this.currentShape = this.getRandomShape();

                    this.resetDimention()
                    this.currentShape.setSquare(this.sqr);

                    if (!this.state?.isValidPosition(this.currentShape)) {
                        this.stop();
                        return;
                    }
                }

            }

        }

        this.clearCanvas()
        this.renderDebugGrid()
        this.render()

        this.animationFrameId = requestAnimationFrame(() => this.loop())
    }

    public stop() {
        this.animationFrameId ? cancelAnimationFrame(this.animationFrameId) : undefined;

        document.removeEventListener('keydown', this.moveBottom.bind(this))
        document.removeEventListener('keydown', this.moveTop.bind(this))
        document.removeEventListener('keydown', this.moveLeft.bind(this))
        document.removeEventListener('keydown', this.moveRight.bind(this))

        if (this.gameOverSequence) this.gameOverSequence();
    }

    public setGameOverSequence(gameOverSequence: () => void) {
        this.gameOverSequence = gameOverSequence;
    }

    private moveLeft(event: KeyboardEvent) {
        if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
            if (this.currentShape) {
                this.sqr.dX -= this.sqr.dSize;
                this.currentShape.setSquare(this.sqr);

                if (!this.state?.isValidPosition(this.currentShape)) {
                    this.sqr.dX += this.sqr.dSize;
                    this.currentShape?.setSquare(this.sqr)
                }
            }

            if (Tetris._DEBUG) { console.log('Move Left', this.currentShape?.getLeft()) }
        }
    }

    private moveRight(event: KeyboardEvent) {
        if (event.code === 'KeyD' || event.code === 'ArrowRight') {
            if (this.currentShape) {
                this.sqr.dX += this.sqr.dSize;
                this.currentShape.setSquare(this.sqr);

                if (!this.state?.isValidPosition(this.currentShape)) {
                    this.sqr.dX -= this.sqr.dSize;
                    this.currentShape?.setSquare(this.sqr)
                }
            }

            if (Tetris._DEBUG) { console.log('Move Right') }
        }
    }

    private moveTop(event: KeyboardEvent) {
        if (event.code === 'KeyW' || event.code === 'ArrowUp') {
            if (this.currentShape) {
                const currentRotation = Number(this.rotation) as Rotation;

                this.changeRotation()
                this.currentShape.rotate(this.rotation);
                this.currentShape.setSquare(this.sqr);

                if (!this.state?.isValidPosition(this.currentShape)) {
                    this.sqr.dX += this.sqr.dSize
                    this.currentShape.setSquare(this.sqr);

                    if (!this.state?.isValidPosition(this.currentShape)) {
                        this.sqr.dX -= (this.sqr.dSize * 2)
                        this.currentShape.setSquare(this.sqr);

                        if (!this.state?.isValidPosition(this.currentShape)) {
                            this.sqr.dX += this.sqr.dSize
                            this.changeRotation(currentRotation);
                            this.currentShape.rotate(currentRotation);
                            this.currentShape.setSquare(this.sqr);
                        }
                    }
                }
            }
        }
    }

    private moveBottom(event: KeyboardEvent) {
        if (event.code === 'KeyS' || event.code === 'ArrowDown') {
            if (Tetris._DEBUG) { console.log('Put Down') }
        }
    }

    private getRandomShape(): Shape {
        if (Tetris._DEBUG)
            return new JShape(this.ctx, this.sqr);

        const randInt = Math.floor(Math.random() * 7)

        switch (randInt) {
            default:
            case 0:
                return new IShape(this.ctx, this.sqr);
            case 1:
                return new JShape(this.ctx, this.sqr);
            case 2:
                return new LShape(this.ctx, this.sqr);
            case 3:
                return new OShape(this.ctx, this.sqr);
            case 4:
                return new SShape(this.ctx, this.sqr);
            case 5:
                return new TShape(this.ctx, this.sqr);
            case 6:
                return new ZShape(this.ctx, this.sqr);
        }

    }

    private changeRotation(rotation?: Rotation) {
        if (rotation != undefined) {
            this.rotation = rotation;
            return null;
        }

        if (this.currentShape)
            this.rotation = (this.currentShape.rotation >= 4 ? 1 : this.currentShape.rotation + 1 as Rotation)
    }

    private resetDimention() {
        this.sqr = {
            dX: 200,
            dY: 0,
            dSize: 40,
            strokeColor: '#ff00ff',
            fillColor: '#00ff00'
        }

        this.rotation = 1;
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

        const arrivedSquares = this.state?.getArrivedSquares()

        if (arrivedSquares) {
            for (let i = 0; i < arrivedSquares.length; i++) {
                for (let j = 0; j < arrivedSquares[i].length; j++) {
                    if (arrivedSquares[i][j] !== null) {
                        arrivedSquares[i][j].draw();
                    }
                }
            }
        }
    }

}

export default Tetris;
import IShape from "./shape/I-Shape";
import JShape from "./shape/J-Shape";
import LShape from "./shape/L-Shape";
import OShape from "./shape/O-Shape";
import SShape from "./shape/S-Shape";
import TShape from "./shape/T-Shape";
import ZShape from "./shape/Z-Shape";
import { ISquare, Shape, Square } from "./shape/Square";
import Tetris from "./Tetris";

export class StateMachine {

    archivedSquares: Square[] = []
    canv: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    isShapeInMotion: Boolean = false;

    private sqr: ISquare = {
        dX: 200,
        dY: 0,
        dSize: 40,
        strokeColor: '#ff00ff',
        fillColor: '#00ff00'
    }

    constructor(canv: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canv = canv;
        this.ctx = ctx;
    }

    checkCollisionBottom(shape: Shape): Boolean {
        const squares = shape.getSquares();
        let isCollided = false;

        for (let i = 0; i < squares.length && !isCollided; i++) {
            isCollided = this.archivedSquares.some(archivedSquare =>
                archivedSquare.getRow() === squares[i].getRow() + 1 &&
                archivedSquare.getColumn() === squares[i].getColumn()
            )
        }

        return isCollided;
    }

    checkEOLBottom(shape: Shape): Boolean {
        return shape.getBottom() == this.canv.height;
    }

    checkCollisionRight(shape: Shape): Boolean {
        const squares = shape.getSquares();
        let isCollided = false;

        for (let i = 0; i < squares.length && !isCollided; i++) {
            isCollided = this.archivedSquares.some(archivedSquare =>
                archivedSquare.getRow() === squares[i].getRow() &&
                archivedSquare.getColumn() === squares[i].getColumn() + 1
            )
        }

        return isCollided;
    }

    checkEOLRight(shape: Shape): Boolean {
        return shape.getRight() >= this.canv.width;
    }

    checkCollisionLeft(shape: Shape): Boolean {
        const squares = shape.getSquares();
        let isCollided = false;

        for (let i = 0; i < squares.length && !isCollided; i++) {
            isCollided = this.archivedSquares.some(archivedSquare =>
                archivedSquare.getRow() === squares[i].getRow() &&
                archivedSquare.getColumn() === squares[i].getColumn() - 1
            )
        }

        return isCollided;
    }

    checkEOLLeft(shape: Shape): Boolean {
        return shape.getLeft() <= 0;
    }

    getRandomShape(): Shape {
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

    archiveShape(shape: Shape) {
        const squares = shape.getSquares();
        this.archivedSquares.push(...squares)
    }

    getArchivedSquares(): Square[] {
        return this.archivedSquares;
    }

    // 0923726517 Gosaye Gizaw
    // 002495 

}
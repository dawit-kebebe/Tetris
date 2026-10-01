class Square {
    square: ISquare
    ctx: CanvasRenderingContext2D

    constructor(ctx: CanvasRenderingContext2D, square: ISquare) {
        this.ctx = ctx
        this.square = square
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.square.dX, this.square.dY);
        this.ctx.rect(this.square.dX, this.square.dY, this.square.dSize, this.square.dSize);
        if (this.square.strokeColor)
            this.ctx.strokeStyle = this.square.strokeColor
        this.ctx.stroke();

        if (this.square.fillColor)
            this.ctx.fillStyle = this.square.fillColor
        this.ctx.fill();
    }

    getSquare() {
        return this.square;
    }

    getLeft() {
        return this.square.dX
    }

    getRight() {
        return this.square.dX + this.square.dSize
    }

    getTop() {
        return this.square.dY
    }

    getBottom() {
        return this.square.dY + this.square.dSize
    }

    getRow() {
        return Math.min(Math.floor(this.getTop() / this.square.dSize), Math.floor(this.getBottom() / this.square.dSize))
    }

    getColumn() {
        return Math.min(Math.floor(this.getLeft() / this.square.dSize), Math.floor(this.getRight() / this.square.dSize))
    }
}

interface ISquare {
    dX: number
    dY: number
    dSize: number
    strokeColor?: string
    fillColor?: string
}

abstract class Shape {
    square: ISquare = null as unknown as ISquare
    ctx: CanvasRenderingContext2D = null as unknown as CanvasRenderingContext2D
    rotation: number = 0

    left: number = 0
    right: number = 0
    top: number = 0
    bottom: number = 0

    topLeftSquare: Square = null as unknown as Square
    bottomLeftSquare: Square = null as unknown as Square
    topRightSquare: Square = null as unknown as Square
    bottomRightSquare: Square = null as unknown as Square


    abstract draw(): void
    abstract rotate(pos: number): void
    abstract setSquare(square: ISquare): void

    /**
     * @returns The top left.
     */
    // abstract getTopLeftSquare(): Square;

    /**
     * @returns The top right.
     */
    // abstract getTopRightSquare(): Square;

    /**
     * @returns The bottom left square.
     */
    // abstract getBottomLeftSquare(): Square;

    /**
     * @returns The bottom right square.
     */
    // abstract getBottomRightSquare(): Square;

    /**
     * @returns All the squares in the shape.
     */
    abstract getSquares(): Square[];

    getBottom() { return this.bottom }
    getTop() { return this.top }
    getLeft() { return this.left }
    getRight() { return this.right }

    setBottom(bottom: number) {
        this.bottom = bottom
    }
    setTop(top: number) {
        this.top = top
    }
    setLeft(left: number) {
        this.left = left
    }
    setRight(right: number) {
        this.right = right
    }
}

export type { ISquare };
export { Square, Shape }
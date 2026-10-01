import { Square, ISquare, Shape } from "./Square"

class IShape extends Shape {

    square: ISquare
    ctx: CanvasRenderingContext2D
    rotation: number = 1

    left: number = 0
    right: number = 0
    top: number = 0
    bottom: number = 0

    square1: Square | undefined
    square2: Square | undefined
    square3: Square | undefined
    square4: Square | undefined

    constructor(ctx: CanvasRenderingContext2D, square: ISquare) {
        super()
        this.ctx = ctx
        this.square = square
    }

    draw() {
        let square1Dim = {} as ISquare;
        let square2Dim = {} as ISquare;
        let square3Dim = {} as ISquare;
        let square4Dim = {} as ISquare;

        switch (this.rotation) {
            case 3:
            case 1:
                square1Dim = { ...this.square }
                square2Dim = { ...this.square }
                square2Dim.dY -= (this.square.dSize * 1);
                square3Dim = { ...this.square }
                square3Dim.dY += (this.square.dSize * 1);
                square4Dim = { ...this.square }
                square4Dim.dY += (this.square.dSize * 2);
                break;
            case 4:
            case 2:
                square1Dim = { ...this.square }
                square2Dim = { ...this.square }
                square2Dim.dX -= (this.square.dSize * 1);
                square3Dim = { ...this.square }
                square3Dim.dX += (this.square.dSize * 1);
                square4Dim = { ...this.square }
                square4Dim.dX += (this.square.dSize * 2);
                break;
        }

        this.square1 = new Square(this.ctx, square1Dim);
        this.square1.draw();

        this.square2 = new Square(this.ctx, square2Dim);
        this.square2.draw();

        this.square3 = new Square(this.ctx, square3Dim);
        this.square3.draw();

        this.square4 = new Square(this.ctx, square4Dim);
        this.square4.draw();

        this.setBottom(Math.max(
            this.square1.getBottom(),
            this.square2.getBottom(),
            this.square3.getBottom(),
            this.square4.getBottom()
        ))

        this.setTop(Math.min(
            this.square1.getTop(),
            this.square2.getTop(),
            this.square3.getTop(),
            this.square4.getTop()
        ))

        this.setLeft(Math.min(
            this.square1.getLeft(),
            this.square2.getLeft(),
            this.square3.getLeft(),
            this.square4.getLeft()
        ))

        this.setRight(Math.max(
            this.square1.getRight(),
            this.square2.getRight(),
            this.square3.getRight(),
            this.square4.getRight()
        ))

    }

    getSquares(): Square[] {
        if (this.square1 && this.square2 && this.square3 && this.square4)
            return Array.from([this.square1, this.square2, this.square3, this.square4])
        return []
    }

    rotate(pos: number) { this.rotation = pos }

    setSquare(square: ISquare) { this.square = square }

}

export default IShape;
import { Shape, Square } from "./shape/Square";

export class State {
    arrivedSquares: Square[][] = Array.from({ length: 18 }, () => Array(12).fill(null))

    isValidPosition(shape: Shape): boolean {
        const squares = shape.getSquares();
        let i = 0;

        for (; i < squares.length; i++) {
            const y = squares[i].getRow();
            const x = squares[i].getColumn();

            if (y < 0) continue;
            if (y >= this.arrivedSquares.length) return false;
            if (x < 0 || x >= this.arrivedSquares[0].length) return false;


            const arrivedSquare = this.arrivedSquares[y][x];
            if (arrivedSquare !== null) return false;
        }

        return true && i === squares.length;
    }

    setArrivedShape(shape: Shape) {
        const squares = shape.getSquares();

        for (let i = 0; i < squares.length; i++) {
            const square = squares[i];
            const y = square.getRow()
            const x = square.getColumn()

            this.arrivedSquares[y][x] = square;
        }

        // console.table(this.arrivedSquares)
    }

    getArrivedSquares(): Square[][] {
        return this.arrivedSquares;
    }

    private isRawCompleted(squares: Square[]) {
        let isComplete = true;

        for (let i = 0; i < squares.length && isComplete; i++)
            isComplete = squares[i] !== null;

        return isComplete;
    }

    clearCompletedRaw() {
        for (let i = 0; i < this.arrivedSquares.length; i++) {
            if (this.isRawCompleted(this.arrivedSquares[i])) {
                for (let j = i-1; j >= 0; j--) this.arrivedSquares[j].map(square => {
                    if (square === null) return null;
                    square.square.dY += square.square.dSize;
                    return square;
                })

                this.arrivedSquares.splice(i, 1);
                this.arrivedSquares.unshift(Array(12).fill(null));
            }
        }
    }

}
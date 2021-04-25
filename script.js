let inputs = document.querySelectorAll("#sudoku input")
let sudoku_table = document.querySelector("#sudoku")
let table = Array(9).fill(0).map(() => Array(9).fill(0))
let btn_new_puzzle = document.querySelector("#new-puzzle")
let div_choose_level = document.querySelector("#choose-level")
let levels = document.querySelectorAll("#choose-level button")
let menu = document.querySelector("#menu")
let btnClearBoard = document.querySelector("#clear-board")


class Sudoku {

    constructor(difficult, row = 9) {
        this.difficult = difficult
        this.row = row
        this.root = Math.sqrt(row)
        this.matrix = null
        this.result = null
    }

    fillValues() {
        this.matrix = Array(this.row).fill(0).map(() => Array(this.row).fill(0))
        this.result = Array(this.row).fill(0).map(() => Array(this.row).fill(0))

        this.fillDiagonal()
        this.fillRemaining(0, this.root)
        this.removeKDigits();
    }

    fillDiagonal() {
        for (let i = 0; i < this.row; i = i + this.root)
            this.fillBox(i, i);
    }

    unUsedInBox(rowStart, colStart, num) {
        for (let i = 0; i < this.root; i++)
            for (let j = 0; j < this.root; j++)
                if (this.matrix[rowStart + i][colStart + j] == num)
                    return false;

        return true;
    }

    fillBox(row, col) {
        let num;
        for (let i = 0; i < this.root; i++) {
            for (let j = 0; j < this.root; j++) {
                do {
                    num = this.randomGenerator(this.row);

                }
                while (!this.unUsedInBox(row, col, num));
                this.matrix[row + i][col + j] = num;
            }
        }
    }

    randomGenerator(num) {
        return Math.floor((Math.random() * num + 1));
    }

    CheckIfSafe(i, j, num) {
        return (this.unUsedInRow(i, num) &&
            this.unUsedInCol(j, num) &&
            this.unUsedInBox(i - i % this.root, j - j % this.root, num));
    }

    // check in the row for existence
    unUsedInRow(i, num) {
        for (let j = 0; j < this.row; j++)
            if (this.matrix[i][j] == num)
                return false;
        return true;
    }

    // check in the row for existence
    unUsedInCol(j, num) {
        for (let i = 0; i < this.row; i++)
            if (this.matrix[i][j] == num)
                return false;
        return true;
    }

    fillRemaining(i, j) {
        if (j >= this.row && i < this.row - 1) {
            i = i + 1;
            j = 0;
        }
        if (i >= this.row && j >= this.row)
            return true;

        if (i < this.root) {
            if (j < this.root)
                j = this.root;
        }
        else if (i < this.row - this.root) {
            if (j == parseInt(i / this.root) * this.root)
                j = j + this.root;
        }
        else {
            if (j == this.row - this.root) {
                i = i + 1;
                j = 0;
                if (i >= this.row)
                    return true;
            }
        }

        for (let num = 1; num <= this.row; num++) {
            if (this.CheckIfSafe(i, j, num)) {
                this.matrix[i][j] = num;
                if (this.fillRemaining(i, j + 1))
                    return true;

                this.matrix[i][j] = 0;
            }
        }
        return false;
    }




    removeKDigits() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.result[i][j] = this.matrix[i][j]
            }
        }

        let count = this.difficult

        while (count != 0) {
            let cellId = this.randomGenerator(this.row * this.row);

            let i = parseInt(cellId / this.row);
            let j = cellId % 9;

            if (i === this.row) {
                continue;
            }

            if (this.matrix[i][j] !== 0) {
                count--;
                this.matrix[i][j] = 0;
            }
        }
    }

}

function printBoard() {

    let k = 0
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (table[i][j] === 0) {
                inputs[k++].value = ""
                inputs[k - 1].disabled = false
                inputs[k - 1].style.backgroundColor = "#FFFFFF"
                inputs[k - 1].readOnly = false

            }
            else {
                inputs[k++].value = table[i][j]
                inputs[k - 1].readOnly = true
                inputs[k - 1].classList.add("disabled-input")
                inputs[k - 1].style.backgroundColor = "#EBEBE4"
                inputs[k - 1].readOnly = true

            }
        }
    }
}

function check(result) {
    let k = 0
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (parseInt(inputs[k++].value) !== result[i][j])
                return false
        }
    }

    return true
}

function init() {
    let sudoku

    menu.classList.add("disabled")
    for (const input of inputs) {

        input.addEventListener("input", function (e) {
            let value = e.target.value

            if (isNaN(value) || value > 9 || value < 1) {
                e.target.value = ""
            }

            if (check(sudoku.result)) {
                alert("Tebrikler")
            }
        })

        input.addEventListener("click", function (e) {
            let value = e.target.value

            if (value !== "") {
                for (const inpt of inputs) {
                    if (inpt.value === value) {
                        inpt.style.backgroundColor = "#6699ff"
                    }
                }
            }
        })

        input.addEventListener("focusout", function (e) {
            for (const inpt of inputs) {
                if (inpt.style.backgroundColor === 'rgb(102, 153, 255)') {
                    if (inpt.readOnly === true) {
                        inpt.style.backgroundColor = "#EBEBE4"

                    } else {
                        inpt.style.backgroundColor = "#FFFFFF"

                    }
                }
            }
        })

    }

    for (const level of levels) {
        level.addEventListener('click', function (e) {
            sudoku = new Sudoku(e.target.value)
            sudoku.fillValues()
            table = sudoku.matrix
            printBoard()

            div_choose_level.classList.add("disabled")
            menu.classList.remove("disabled")
        })
    }

    btnClearBoard.addEventListener("click", function (e) {
        printBoard()
    })

    btn_new_puzzle.addEventListener('click', function (e) {
        menu.classList.add("disabled")
        div_choose_level.classList.remove("disabled")
    })
}

init();

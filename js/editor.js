class Editor extends GuaObject {

    constructor(code) {
        super()
        this.code = code
        this.tokenList = tokens(this.code)
        this.canvas = document.querySelector('#id-canvas')
        this.context = this.canvas.getContext('2d')
        this.fontSize = 18
        this.font = 'Consolas'
        // 存放元素
        this.elements = []
        // 按行列存字符
        this.codeObj = []
        this.init()
        this.setUpInputs()
    }

    init() {
        this.startX = this.fontSize + 10
        this.lineHeight = this.fontSize + 6
        this.paddingDown = (this.lineHeight - this.fontSize) / 2

        // 把 token list 转成 row col 形式存储字符
        this.codeObjFromTokenList()

        // 生成 code 绘画
        this.code = Code.new(this)
        this.addElement(this.code)

        // 生成光标，默认在第一个字符开始
        this.cursor = Cursor.new(this)
        this.addElement(this.cursor)

        this.__start()
    }

    codeObjFromTokenList() {
        this.codeObj = []
        let line = []
        let row = 0
        let col = 0
        for (const item of this.tokenList) {
            let type = item.type
            if (item.value === '\n') {
                line.push(EditorText.new(this, '\n', type, row, col))
                this.codeObj.push(line)
                row += 1
                col = 0
                line = []
                continue
            }
            // 拆分单字符
            for (const c of item.value) {
                let t = EditorText.new(this, c, type, row, col)
                line.push(t)
                // 每次加完 col 需要加一
                col += 1
            }
        }

        if (line.length !== 0) {
            line.push(EditorText.new(this, '\n', Token.lineBreak, row, col+1))
            this.codeObj.push(line)
        }
    }

    addElement(element) {
        this.elements.push(element)
    }

    setUpInputs() {
        let canvas = this.canvas
        let string = '1234567890' +
            'abcdefghijklmnopqrstuvwxyz' +
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
            '~!@#$%^&*()_+=-`[]\\;\',./<>?:"{}| '
        canvas.addEventListener('keydown', (event) => {
            log('event', event)
            let row = this.cursor.row
            let col = this.cursor.col
            if (string.includes(event.key)) {
                // 拿到行
                let line = this.codeObj[row]
                // 插入 col 这个位置
                let t = EditorText.new(this, event.key, '', row, col)
                line.splice(col, 0, t)

                this.cursor.col += 1
                this.cursor.resident()
            } else if (event.key === 'Backspace') {
                // 拿到行
                let line = this.codeObj[row]
                if (col === 0) {
                    let preLine = this.codeObj[row - 1]
                    if (preLine !== undefined) {
                        // 移除最后一个回车
                        preLine.pop()
                        // 计算光标的位置
                        this.cursor.row = row - 1
                        this.cursor.col = preLine.length
                    }
                    // this.codeObj.splice(row, 0, line)
                } else {
                    line.splice(col - 1, 1)
                    // 插入 col 这个位置
                    this.cursor.col -= 1
                }
            } else if (event.key === 'Enter') {
                let t = EditorText.new(this, '\n', '', 0, 0)
                this.codeObj[row].splice(col, 0, t)
                // this.codeObj.splice(row+1, 0, line)
                this.cursor.col = 0
                this.cursor.row += 1
            }
        })
    }

    updateCursor(x, y) {
        let c = this.cursor
        c.x = x
        c.y = y
    }


    __start() {
        var g = this
        // 开始运行程序
        // setTimeout(function() {
            g.runLoop()
        // }, 1000 / 60)
    }

    runLoop() {
        let g = this

        // update x
        g.update()

        // clear
        g.context.clearRect(0, 0, g.canvas.width, g.canvas.height)

        // draw
        g.draw()


        // next run loop
        setTimeout(function() {
            g.runLoop()
        }, 1000 / 60)
    }

    drawLine(index) {
        let ctx = this.context
        let i = index + 1
        // 画框框
        // ctx.fillStyle = '#999'
        // ctx.fillRect(0,0, this.startX, this.lineHeight)
        // 画行数
        ctx.fillStyle = '#555'
        ctx.fillText(i, this.startX - this.fontSize, this.lineHeight * i - this.paddingDown)
    }

    draw() {
        // 画所有元素
        for (const element of this.elements) {
            element.draw()
        }
    }

    update() {
        // 转成字符串
        let code = ''
        for (const line of this.codeObj) {
            for (const token of line) {
                code += token.value
            }
        }
        this.tokenList = tokens(code)
        this.codeObjFromTokenList()

        // 更新所有元素
        for (const element of this.elements) {
            element.update()
        }
    }
}


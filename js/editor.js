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

        // // 生成光标，默认在第一个字符开始
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
        let ctx = this.context
        ctx.font = `${this.fontSize}px ${this.font}`
        for (let i = 0; i < this.codeObj.length; i++) {
            let line = this.codeObj[i]
            this.drawLine(i)
            for (const token of line) {
                let value = token.value
                if (value === ' ') {
                    value = '•'
                }
                let type = token.type
                ctx.fillStyle = Palette[type]
                ctx.fillText(value, token.x, token.y)
            }
        }
        // 画所有元素
        for (const element of this.elements) {
            element.draw()
        }
    }

    update() {
        let ctx = this.context
        for (let index in this.codeObj) {
            let line = this.codeObj[index]
            let x = this.startX
            let y = (Number(index) + 1) * this.lineHeight - this.paddingDown
            for (const token of line) {
                token.y = y
                token.x = x
                token.w = ctx.measureText(token.value).width
                x += token.w
            }
        }

        // 更新所有元素
        for (const element of this.elements) {
            element.update()
        }
    }
}


class Editor extends GuaObject {

    constructor(code) {
        super()
        this.code = code
        this.tokenList = tokens(this.code)
        this.canvas = document.querySelector('#id-canvas')
        this.context = this.canvas.getContext('2d')
        this.fontSize = 18
        this.font = 'Consolas'
        this.lines = []
        this.init()
        this.setUpInputs()
    }

    init() {
        this.codeObj = []
        this.startX = this.fontSize + 10
        this.lineHeight = this.fontSize + 6
        this.paddingDown = (this.lineHeight - this.fontSize) / 2

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

        // // 生成光标，默认在第一个字符开始
        this.cursor = Cursor.new(this)
        let width = this.context.measureText('a').width
        this.updateCursor(this.startX - width, this.lineHeight - this.paddingDown)

        this.__start()
    }

    setUpInputs() {
        let canvas = this.canvas
        // 绑定 click 事件
        canvas.addEventListener('click', (event) => {
            this.cursor.show = true
            let row = Math.floor(event.offsetY / this.lineHeight)
            let line = this.codeObj[row]
            let x = 0
            log('line', line)
            if (line === undefined) {
                line = this.codeObj[this.codeObj.length - 1]
                x = line[line.length - 1].x
            } else {
                let offsetX = 100000
                for (const token of line) {
                    if (Math.abs(token.x - event.offsetX) < offsetX) {
                        log('token', token, token.x, event.offsetX)
                        x = token.x - token.w + 6
                        offsetX = Math.abs(token.x - event.offsetX)
                    }
                }
            }
            this.cursor.x = x
            this.cursor.y = line[0].y
        })
        canvas.addEventListener('blur', (event) => {
            this.cursor.change()
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
        this.cursor.draw()


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
    }
}


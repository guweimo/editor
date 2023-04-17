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
    }

    init() {
        this.startX = this.fontSize + 10
        this.lineHeight = this.fontSize + 6
        // 按行生成数据
        let line = []
        for (let item of this.tokenList) {
            if (item.value === '\n') {
                this.lines.push(line)
                line = []
                continue
            }
            line.push(item)
        }
        line.push(Token.new('\n', Token.lineBreak))
        this.lines.push(line)
        this.__start()
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
        let paddingDown = (this.lineHeight - this.fontSize) / 2
        // 画框框
        // ctx.fillStyle = '#999'
        // ctx.fillRect(0,0, this.startX, this.lineHeight)
        // 画行数
        ctx.fillStyle = '#555'
        ctx.fillText(i, this.startX - this.fontSize, this.lineHeight * i - paddingDown)
    }

    draw() {
        let ctx = this.context
        ctx.font = `${this.fontSize}px ${this.font}`
        let paddingDown = (this.lineHeight - this.fontSize) / 2
        for (let i = 0; i < this.lines.length; i++) {
            let line = this.lines[i]
            this.drawLine(i)
            let offsetY = (i + 1) * this.lineHeight - paddingDown
            let offsetX = this.startX
            for (const token of line) {
                let value = token.value
                if (value === ' ') {
                    value = '•'
                }
                let type = token.type
                ctx.fillStyle = Palette[type]
                ctx.fillText(value, offsetX, offsetY)
                let w = ctx.measureText(value).width
                offsetX += w
            }
        }
    }

    update() {

    }
}



const __main = function() {
    let code = `const a = 1
const b = 1
const c = [2, 3, '3',]`
    Editor.new(code)
}

__main()
